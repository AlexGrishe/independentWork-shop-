class Carousel {
    constructor(s) {
        const settings = this._initConfig(s);

        this._initConfig(s);

        this.container = document.querySelector(s.containerID);
        this.slides = this.container.querySelectorAll(s.slideID);

        this.interval = s.interval;
    }

    _initConfig(o) {
        const p = {containerID: '#carousel2', slideID: '.slide', interval: 5000};

        return { ...p, ...o };//Тот же самый код что ниже только
        //через ...(сприт) + деструктуризация обьекта(своими словами жестко савнили два обьекта)

        // const settings = {
        //     containerID: '#carousel2',
        //     slideID: '.slide',
        //     interval: 5000
        // };

        // if (0 !== undefined) {
        //     settings.containerID = o.containerID || '#carousel2';
        //     settings.slideID = o.slideID || '.slide';
        //     settings.interval = o.interval || 5000;
        // };

        // return settings;
    }

    _initProperty() {
        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.SPACE = 'Space';
        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
        this.FA_PREW = '<i class="fas fa-angle-left"></i>';
        this.FA_ARBITARY = '<i class="fa fa-alipay"></i>';


        this.currentSlide = 0;
        this.slidesCount = this.slides.length;
        this.intervalID = null;
        this.isPlaying = true;
        // this.swipeStartX = null;
        // this.swipeEndX = null;
    }


    _initControls() {
        const controls = document.createElement('div');
        const PAUSE = `<span id="pause-btn" class="control control-pause" type="button">${this.FA_PAUSE}</span>`;
        const PREV = `<span id="prev-btn" class="control control-prev" type="button">${this.FA_PREW}</span>`;
        const NEXT = `<span id="next-btn" class="control control-next" type="button">${this.FA_NEXT}</span>`;
        const ARBITARY = `<span id="arbitary-btn" class="control control-arbitary" type="button">${this.FA_ARBITARY}</span>`

        controls.setAttribute('class', 'controls');
        this.container.appendChild(controls);
        controls.innerHTML = PAUSE + PREV + NEXT + ARBITARY;

        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');
        this.arbitaryBtn = this.container.querySelector('#arbitary-btn');
    }


    _initIndicators() {
        const indicators = document.createElement('ol');

        indicators.setAttribute('class', 'indicators');
        indicators.setAttribute('id', 'indicators-container');


        for (let i = 0; i < this.slidesCount; i++) {
            const indicator = document.createElement('li');
            indicator.setAttribute('class', 'indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.dataset.slideTo = `${i}`;
            indicators.appendChild(indicator);
        }
        this.container.appendChild(indicators);

        this.indicatorsContainer = this.container.querySelector('#indicators-container');
        this.indicators = this.container.querySelectorAll('.indicator');

    }

    _initListeners() {
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.arbitaryBtn.addEventListener('click', this.arbitary.bind(this));
        this.indicatorsContainer.addEventListener('click', this.indicate.bind(this));
        document.addEventListener('keydown', this.pressKey.bind(this));
    }

    _gotoSlide(n) {
        this.slides[this.currentSlide].classList.toggle('active');

        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide = (n + this.slidesCount) % this.slidesCount;

        this.indicators[this.currentSlide].classList.toggle('active');

        this.slides[this.currentSlide].classList.toggle('active');
    }

    _gotoPrew() {
        this._gotoSlide(this.currentSlide - 1);
    }

    _gotoNext() {
        this._gotoSlide(this.currentSlide + 1);
    }

    prev() {
        this._pause();
        this._gotoPrew();
    }

    next() {
        this._pause();
        this._gotoNext();
    }

    arbitary() {
        function randomInteger(min, max) {
            // случайное число от min до (max+1)
            let rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }

        this._pause();
        this._gotoSlide(this.currentSlide + randomInteger(0, 9));
    }

    _play() {
        this.intervalID = setInterval(() => this._gotoNext(), this.interval);
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = true;
    }

    _pause() {
        if (this.isPlaying) {
            clearInterval(this.intervalID);
            this.pauseBtn.innerHTML = this.FA_PLAY;
            this.isPlaying = false;
        }
    }

    pausePlay() {
        this.isPlaying ? this._pause() : this._play();
    }


    indicate(e) {
        let target = e.target;
        if (target.classList.contains('indicator')) {
            this._pause();
            this._gotoSlide(+target.dataset.slideTo);
        }

    }

    pressKey(e) {
        if (e.code === this.LEFT_ARROW) this.prev();
        if (e.code === this.RIGHT_ARROW) this.next();
        if (e.code === this.SPACE) this.pausePlay();
    }

    init() {
        this._initProperty();
        this._initControls();
        this._initIndicators();
        this._initListeners();
        this.intervalID = setInterval(() => this._gotoNext(), this.interval);
    }

}

class SwipeCarousel extends Carousel {

    _swipeStart(e) {
        this.swipeStartX = e.changedTouches[0].pageX;
    }

    _swipeEnd(e) {
        this.swipeEndX = e.changedTouches[0].pageX;
        this.swipeStartX - this.swipeEndX < 100 && this.next();
        this.swipeStartX - this.swipeEndX > -100 && this.prev()
    }
    _initListeners() {
        // Carousel.prototype._initListeners.apply(this);
        super._initListeners();
        this.container.addEventListener('touchstart', this._swipeStart.bind(this));
        this.container.addEventListener('touchend', this._swipeEnd.bind(this));
    }
}

// function SwipeCarousel1() {
//     Carousel.apply(this, arguments);
// };

// SwipeCarousel1.prototype = Object.create(Carousel.prototype);
// SwipeCarousel1.prototype.constructor = SwipeCarousel1;

// SwipeCarousel1.prototype._swipeStart = function (e) {
//     this.swipeStartX = e.changedTouches[0].pageX;
// };
// SwipeCarousel1.prototype._swipeEnd = function (e) {
//     this.swipeEndX = e.changedTouches[0].pageX;
//     this.swipeStartX - this.swipeEndX < 100 && this.next();
//     this.swipeStartX - this.swipeEndX > -100 && this.prev()
// };

// SwipeCarousel1.prototype._initListeners = function () {
//     Carousel.prototype._initListeners.apply(this);
//     this.container.addEventListener('touchstart', this._swipeStart.bind(this));
//     this.container.addEventListener('touchend', this._swipeEnd.bind(this));
// };

// console.log('work')

// function Carousel(containerID, slideID) {

//     this.container = document.querySelector(containerID);
//     this.slides = this.container.querySelectorAll(slideID);

//     this.interval = 2000;
//     this.initProperty();
// };

// Carousel.prototype = {

//     initProperty() {
//     this.LEFT_ARROW = 'ArrowLeft';
//     this.RIGHT_ARROW = 'ArrowRight';
//     this.SPACE = 'Space';
//     this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
//         this.FA_PLAY = '<i class="far fa-play-circle"></i>';
//     this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
//     this.FA_PREW = '<i class="fas fa-angle-left"></i>';


//          this.currentSlide = 0;
//     this.slidesCount = this.slides.length;
//     this.intervalID = null;
//     this.isPlaying = true;
//     // this.swipeStartX = null;
//     // this.swipeEndX = null;
//     },


//     _initControls() {
//         const controls = document.createElement('div');
//         const PAUSE = `<span id="pause-btn" class="control control-pause" type="button">${this.FA_PAUSE}</span>`;
//         const PREV = `<span id="prev-btn" class="control control-prev" type="button">${this.FA_PREW}</span>`;
//         const NEXT = `<span id="next-btn" class="control control-next" type="button">${this.FA_NEXT}</span>`;

//         controls.setAttribute('class', 'controls');
//         this.container.appendChild(controls);
//         controls.innerHTML = PAUSE + PREV + NEXT;

//             this.pauseBtn = this.container.querySelector('#pause-btn');
//     this.prevBtn = this.container.querySelector('#prev-btn');
//     this.nextBtn = this.container.querySelector('#next-btn');
//     },


//     _initIndicators() {
//         const indicators = document.createElement('ol');

//         indicators.setAttribute('class', 'indicators');
//         indicators.setAttribute('id', 'indicators-container');


//         for (i = 0; i < this.slidesCount; i++) {
//             const indicator = document.createElement('li');
//             indicator.setAttribute('class', 'indicator');
//             if (i === 0) indicator.classList.add('active');
//             // indicator.setAttribute('data-slide-to', `${i}`);
//             indicator.dataset.slideTo = `${i}`;

//         indicators.appendChild(indicator);

//         }

//         // indicators.addEventListener('click', () => alert('test'));

//         this.container.appendChild(indicators);

//             this.indicatorsContainer = this.container.querySelector('#indicators-container');
//     this.indicators = this.container.querySelectorAll('.indicator');

//     },

//     _initListeners() {
//         this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
//         this.prevBtn.addEventListener('click', this.prev.bind(this));
//         this.nextBtn.addEventListener('click', this.next.bind(this));
//         this.indicatorsContainer.addEventListener('click', this.indicate.bind(this));
//         document.addEventListener('keydown', this.pressKey.bind(this));
//         // this.container.addEventListener('touchstart', this.swipeStart.bind(this));
//         // this.container.addEventListener('touchend', this.swipeEnd.bind(this));
//     },

//     _gotoSlide(n) {
//         this.slides[this.currentSlide].classList.toggle('active');

//         this.indicators[this.currentSlide].classList.toggle('active');
//         this.currentSlide = (n + this.slidesCount) % this.slidesCount;

//         this.indicators[this.currentSlide].classList.toggle('active');

//         this.slides[this.currentSlide].classList.toggle('active');
//     },

//     _gotoPrew() {
//         this._gotoSlide(this.currentSlide - 1);
//     },

//     _gotoNext() {
//         this._gotoSlide(this.currentSlide + 1);
//     },

//     prev() {
//         this._pause();
//         this._gotoPrew();
//     },

//     next() {
//         this._pause();
//         this._gotoNext();
//     },

//     _play() {
//         this.intervalID = setInterval(() => this._gotoNext(), this.interval);
//         this.pauseBtn.innerHTML = this.FA_PAUSE;
//         this.isPlaying = true;
//     },

//     _pause() {
//         if (this.isPlaying) {
//             clearInterval(this.intervalID);
//             this.pauseBtn.innerHTML = this.FA_PLAY;
//             this.isPlaying = false;
//         }
//     },

//     pausePlay() {
//         this.isPlaying ? this._pause() : this._play();
//     },


//     indicate(e) {
//         let target = e.target;
//         if (target.classList.contains('indicator')) {
//             this._pause();
//             this._gotoSlide(+target.dataset.slideTo);
//         }

//     },

//     pressKey(e) {
//         if (e.code === this.LEFT_ARROW) this.prev();
//         if (e.code === this.RIGHT_ARROW) this.next();
//         if (e.code === this.SPACE) this.pausePlay();
//     },

//     // swipeStart(e) {
//     //     this.swipeStartX = e.changedTouches[0].pageX;
//     // },

//     // swipeEnd(e) {
//     //     this.swipeEndX = e.changedTouches[0].pageX;
//     //     this.swipeStartX - this.swipeEndX < 100 && this.next();
//     //     this.swipeStartX - this.swipeEndX > -100 && this.prev();
//     // },

//     init() {
//         this._initControls();
//         this._initIndicators();
//         this._initListeners();
//         this.intervalID = setInterval(() => this._gotoNext(), this.interval);
//     }

// };

// // this.swipeStartX = null;
// //     this.swipeEndX = null;

// // swipeStart(e) {
// //         this.swipeStartX = e.changedTouches[0].pageX;
// //     },

// //     swipeEnd(e) {
// //         this.swipeEndX = e.changedTouches[0].pageX;
// //         this.swipeStartX - this.swipeEndX < 100 && this.next();
// //         this.swipeStartX - this.swipeEndX > -100 && this.prev();
// //     },

//         // this.container.addEventListener('touchstart', this.swipeStart.bind(this));
//         // this.container.addEventListener('touchend', this.swipeEnd.bind(this));

// function SwipeCarousel1() {
//     Carousel.apply(this, arguments);
// };

// SwipeCarousel1.prototype = Object.create(Carousel.prototype);
// SwipeCarousel1.prototype.constructor = SwipeCarousel1;

// SwipeCarousel1.prototype._swipeStart = function (e) {
//     this.swipeStartX = e.changedTouches[0].pageX;
// };
// SwipeCarousel1.prototype._swipeEnd = function (e) {
//     this.swipeEndX = e.changedTouches[0].pageX;
//     this.swipeStartX - this.swipeEndX < 100 && this.next();
//     this.swipeStartX - this.swipeEndX > -100 && this.prev()
// };

// SwipeCarousel1.prototype._initListeners = function () {
//     Carousel.prototype._initListeners.apply(this);
//     this.container.addEventListener('touchstart', this._swipeStart.bind(this));
//     this.container.addEventListener('touchend', this._swipeEnd.bind(this));
// };