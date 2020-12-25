// document.write('Js/Gulp works');
let buttonsContainer = document.querySelector('.main-block__cards'); //Получили блок с карочками и присвоили в переменную
console.log(buttonsContainer);
let cartCounterLabel = document.querySelector('#cart-counter'); //Получили елемент по айди
console.log(cartCounterLabel);
let cartCounter = 0;
let cartPrice = 0;

let btnClickHandler = (event) => { //создали функцию и передали ей арументом событие
    let target = event.target; //с помощью таргета ссылаемся на елемент=событие и присвоили в переменную

    if (target.classList.contains('main-block__card-btn_addCart')) { //c помощью класлиста(контеин) проверяем наличие класса и возвращяем тру или фолсе

        cartCounterLabel.innerHTML = `${++cartCounter}`; //С помощбю иннераХТМЛ получаем елемет в виде строики и можем менять эго содержимое

if (cartCounter === 1) {
    cartCounterLabel.style.display = 'block';
}

        const mockData = +target.
            parentElement.
            previousElementSibling.
        innerHTML.
        replace(/^\$(\d+)\s\D+(\d+).*$/u, '$1.$2');

cartPrice = Math.round((cartPrice + mockData) * 100) / 100;
let restoreHTML = target.innerHTML;

target.innerHTML = `Added ${cartPrice.toFixed(2)} $`;

buttonsContainer.removeEventListener('click', btnClickHandler);
target.disabled = true;

setTimeout(() => {
    target.innerHTML = restoreHTML;
    buttonsContainer.addEventListener('click', btnClickHandler);
    target.disabled = false;
}, 2000);

    }
};

buttonsContainer.addEventListener('click', btnClickHandler);

console.log(cartCounterLabel);

// let btnClickHand = (e) => {
//
// }

console.log('independent_work(shop)');

let carousel = new SwipeCarousel({
    containerID: '#carousel2',
    slideID: '.slide',
    interval: 2000
});

carousel.init();