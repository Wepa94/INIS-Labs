const productsContainer = document.querySelector('.shirts__container');
const logo = document.querySelector('.logo');
const quickViewBlock = document.querySelector('.quick__view__block');
const frontQuickView = document.querySelector('.front__quick__view');
const backQuickView = document.querySelector('.back__quick__view');
const quickName = document.querySelector('.quick__name');
const quickPrice = document.querySelector('.quick__price');
const closeQuickBtn = document.querySelector('.close__quick');
const noAvailableImage = 'url(./shirt_images/no-image-available.jpg)';

logo.addEventListener('click', e => {
    window.location = './index.html';
});

let initProducts = () => {
    for (let i = 0; i < shirts.length; i++) {
        let shirtBlock = document.createElement('div');
        shirtBlock.classList.add('shirt__block');
        let imageBlock = document.createElement('div');
        imageBlock.classList.add('image__block');
        let shirtTitle = document.createElement('h3');
        shirtTitle.classList.add('shirt__title');
        let colorsNumer = document.createElement('p');
        colorsNumer.classList.add('shirt__p');
        let quickViewBtn = document.createElement('button');
        quickViewBtn.classList.add('qv__btn');
        let seePageBtn = document.createElement('button');
        seePageBtn.classList.add('sp__btn');
        const image = new Image();
        image.classList.add('shirt__image')
        if (hasAvailableColors(i)) {
            if (hasFrontImage(i)) {
                image.src = `${shirts[i].colors[Object.keys(shirts[i].colors)[0]].front}`;
            }
            else {
                imageBlock.style.backgroundImage = noAvailableImage;
            }
        }
        productsContainer.append(shirtBlock);
        imageBlock.append(image);
        shirtBlock.append(imageBlock);
        shirtTitle.textContent = shirts[i].name;
        shirtBlock.append(shirtTitle);
        if (hasAvailableColors(i)) {
            colorsNumer.textContent = 'Available in ' + Object.keys(shirts[i].colors).length + ' colors';
        }
        else {
            colorsNumer.textContent = 'Not Available';
        }
        shirtBlock.append(colorsNumer);
        quickViewBtn.textContent = 'Quick View';
        shirtBlock.append(quickViewBtn);
        seePageBtn.textContent = 'See Page';
        shirtBlock.append(seePageBtn);
        if (hasAvailableColors(i)) {
            seePageBtn.addEventListener('click', e => {
                localStorage.setItem('shirt', i);
                window.location = './details.html';
            });
        }
        if (shirts[i].hasOwnProperty('colors')) {
            quickViewBtn.addEventListener('click', e => {
                quickPrintSide(i, frontQuickView, 'front');
                quickPrintSide(i, backQuickView, 'back')
                quickName.textContent = shirts[i].name;
                quickPrice.textContent = shirts[i].price;
                quickViewBlock.style.display = 'block';
                window.scrollTo({
                    left: 0,
                    top: document.documentElement.scrollHeight,
                    behavior: "smooth",
                });
            });
        }
        closeQuickBtn.addEventListener('click', e => {
            quickViewBlock.style.display = 'none';
        });
    }
};

function hasAvailableColors(shirtNumber) {
    if (shirts[shirtNumber].hasOwnProperty('colors') && Object.keys(shirts[shirtNumber].colors).length > 0) {
        return true;
    }
    else {
        return false;
    }
}

function hasFrontImage(shirtNumber) {
    if (shirts[shirtNumber].colors[Object.keys(shirts[shirtNumber].colors)[0]].hasOwnProperty('front')) {
        return true;
    }
    else {
        return false;
    }
}

function quickPrintSide(shirtNumber, block, side) {
    if (Object.keys(shirts[shirtNumber].colors).length > 0) {
        if (shirts[shirtNumber].colors[Object.keys(shirts[shirtNumber].colors)[0]].hasOwnProperty(side)) {
            block.style.backgroundImage = `url(${shirts[shirtNumber].colors[Object.keys(shirts[shirtNumber].colors)[0]][side]})`;
        }
        else {
            block.style.backgroundImage = noAvailableImage;
        }
    }
    else {
        block.style.backgroundImage = noAvailableImage;
    }
}

const shirtName = document.querySelector('.shirt__title__detail');
const shirtContainer = document.querySelector('.shirt__container__detail');
const shirtInfo = document.querySelector('.shirt__info');
const shirtPrice = document.querySelector('.shirt__price');
const shirtDescription = document.querySelector('.shirt__description');
const frontSideBtn = document.querySelector('.front__side__btn');
const backSideBtn = document.querySelector('.back__side__btn');
const shirtColors = document.querySelector('.shirt__colors');
const detailImage = document.querySelector('.detail__image');
let side = 'front';
let activeColor = 'white';

let initDetails = () => {
    let shirtNum = localStorage.getItem('shirt');
    const image = new Image();
    shirtName.textContent = shirts[shirtNum].name;
    if (hasFrontImage(shirtNum)) {
        image.src = `${shirts[shirtNum].colors[Object.keys(shirts[shirtNum].colors)[0]].front}`;
        detailImage.style.backgroundImage = '';
    }
    else {
        detailImage.style.backgroundImage = noAvailableImage;
    }
    detailImage.append(image);
    if (shirts[shirtNum].hasOwnProperty('description')) {
        shirtDescription.textContent = `${shirts[shirtNum].description}`
        shirtInfo.prepend(shirtDescription);
    }
    if (shirts[shirtNum].hasOwnProperty('price')) {
        shirtPrice.textContent = `${shirts[shirtNum].price}`;
        shirtInfo.prepend(shirtPrice);
    }
    for (let i = 0; i < Object.keys(shirts[shirtNum].colors).length; i++) {
        let colorBtn = document.createElement('button');
        colorBtn.classList.add('color__btn');
        if (i === 0) {
            colorBtn.classList.add('active');
        }
        colorBtn.textContent = Object.keys(shirts[shirtNum].colors)[i];
        colorBtn.style.backgroundColor = Object.keys(shirts[shirtNum].colors)[i];
        shirtColors.append(colorBtn);
    }
    const colorBtns = document.querySelectorAll('.color__btn');
    frontSideBtn.addEventListener('click', e => {
        backSideBtn.classList.remove('active');
        frontSideBtn.classList.add('active');
        swipeSide(shirtNum, 'front');
        side = 'front';
    });
    backSideBtn.addEventListener('click', e => {
        frontSideBtn.classList.remove('active');
        backSideBtn.classList.add('active');
        swipeSide(shirtNum, 'back');
        side = 'back';
    });
    shirtColors.addEventListener('click', e => {
        if (e.target.className === 'color__btn') {
            colorBtns.forEach((element) => {
                if (element.classList.contains('active')) {
                    element.classList.remove('active');
                }
            })
            e.target.classList.add('active');
            activeColor = e.target.textContent;
            swipeSide(shirtNum, side);
        }
        else{
            return;
        }
    });
    function swipeSide(shirtNumber, side) {
        if (shirts[shirtNumber].colors[activeColor].hasOwnProperty(side)) {
            image.src = `${shirts[shirtNumber].colors[activeColor][side]}`;
            detailImage.style.backgroundImage = '';
            detailImage.append(image);
        }
        else {
            detailImage.removeChild(image);
            detailImage.style.backgroundImage = noAvailableImage;
        }
    }
};

