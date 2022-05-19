
const activeClass = 'target__active'
let highLightedDiv, divToMove;
let delayY = 0, delayX = 0;
let mouseIsDown = false; // for move div
let startCoordinates = {}; // for move div
let actionType = '';

function onClick(event) {
    event.stopPropagation()
    if(actionType != 'mousemove') {
        if(highLightedDiv) highLightedDiv.classList.remove(activeClass);
        highLightedDiv = event.target;
        highLightedDiv.classList.add(activeClass)
    }
}

function onWorkspaceClick(event) {
    if(highLightedDiv && actionType != 'keydown'){
        highLightedDiv.classList.remove(activeClass);
        highLightedDiv = null;
    }
}

function onMouseDown(event) {
    actionType = event.type;
    divToMove = event.target;
    let size = divToMove.getBoundingClientRect();
    delayY = event.clientY - size.top;
    delayX = event.clientX - size.left;
    startCoordinates.x = size.left;
    startCoordinates.y = size.top;
    mouseIsDown = true;
}

function onMouseUp(event) {
    mouseIsDown = false;
    divToMove = null;
}

function onMouseMove(event) {
    actionType = event.type;
    if(mouseIsDown) {
        divToMove.style.top = `${event.clientY - delayY}px`;
        divToMove.style.left = `${event.clientX - delayX}px`;
    }
}

function onDoubleClick(event) {
    onClick(event);
    onMouseDown(event);
}

function onKeyPress(event) {
    if(event.keyCode === 27 && divToMove) {
        actionType = event.type
        divToMove.style.top = `${startCoordinates.y}px`;
        divToMove.style.left = `${startCoordinates.x}px`;
        startCoordinates = {}
        onMouseUp(event);
    } else if(event.keyCode === 46 && highLightedDiv) {
        highLightedDiv.remove()
        highLightedDiv = null
    }
}

function onTouchStart(event) {
    divToMove = event.target;
    let size = divToMove.getBoundingClientRect();
    delayY = event.changedTouches[0].pageY - size.top;
    delayX = event.changedTouches[0].pageX - size.left;
    startCoordinates.x = size.left;
    startCoordinates.y = size.top;
    mouseIsDown = true;
}

function onTouchEnd(event) {
    mouseIsDown = false;
    divToMove = null;
}

function onTouchMove(event) {
    if(mouseIsDown) {
        [...event.changedTouches].forEach(touch => {
            divToMove.style.top = `${touch.pageY - delayY}px`;
            divToMove.style.left = `${touch.pageX - delayX}px`;
        })
    }
}

function addListeners(array) {
    for(let element of array) {
        element.addEventListener('click', onClick);
        element.addEventListener('mousedown', onMouseDown);
        element.addEventListener('dblclick', onDoubleClick);
        element.addEventListener('touchstart', onTouchStart);
    }
}

document.addEventListener('touchmove', e => {
    if (e.touches.length > 1) {  
       e.preventDefault();
    }
}, {passive: false})

const workspace = document.querySelector('.lock');
workspace.addEventListener('click', onWorkspaceClick);
workspace.addEventListener('mousemove', onMouseMove);
workspace.addEventListener('mouseup', onMouseUp);
workspace.addEventListener('touchmove', onTouchMove);
workspace.addEventListener('touchend', onTouchEnd);
window.addEventListener('keydown', onKeyPress);
addListeners(document.querySelectorAll('.target'));