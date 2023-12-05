var firstTouch = null;
var secondTouch = null;
var scale = 1;
var maxScale = 10;
var minScale = 1;
var tempScale = 1;
var transformOrigin = '';
var prevMid = null;
initPinchZoom();

function initPinchZoom() {
    var previewGallery = document.querySelector('.previewGallery');
    previewGallery.addEventListener('touchstart', handleStart, {passive:false});
    previewGallery.addEventListener('touchend', handleEnd, {passive:false});
    previewGallery.addEventListener('touchcancel', handleEnd, {passive:false});
    previewGallery.addEventListener('touchmove', handleMove, {passive:false});
}

function parseTwoFingerTouch(evt) {
    var absx = Math.abs(evt.touches[0].pageX - evt.touches[1].pageX);
    var absy = Math.abs(evt.touches[0].pageY - evt.touches[1].pageY);
    var abstotal = absx + absy;
    return {
        x: evt.touches[0].pageX,
        y: evt.touches[0].pageY,
        x2: evt.touches[1].pageX,
        y2: evt.touches[1].pageY,
        absx,
        absy,
        abstotal: absx + absy,
    }
}

function writeDebug() {
    write(
        'ftx:'
        + Math.round(firstTouch == null ? 0 : firstTouch.x)
        + ';fty:'
        + Math.round(firstTouch == null ? 0 : firstTouch.y)
        /**
        + 'ft:'
        + Math.round(firstTouch == null ? 0 : firstTouch.abstotal)
        + ';st:'
        + Math.round(secondTouch == null ? 0 : secondTouch.abstotal)
        */
        + '<br>'
        + ';scale:'
        + scale
        + ';tempScale:'
        + tempScale
        + ';to:'
        + transformOrigin
    );
}
function handleStart(evt) {
    evt.preventDefault();
    if (evt.touches.length > 1) {
        firstTouch = parseTwoFingerTouch(evt);
        writeDebug();
        return;
    } else {
        firstTouch = null;
    }
}

function handleMove(evt) {
    if (evt.touches.length > 1 && firstTouch != null) {
        secondTouch = parseTwoFingerTouch(evt);
        writeDebug();
        updateZoomOnMove();
    }
}

function handleEnd(evt) {
    if (evt.touches.length < 2) {
        if (tempScale != 1) {
            scale = tempScale;
            //tempScale = 1;
            firstTouch = null;
            secondTouch = null;
        }
    }
}

function updateZoomOnMove() {
    if (firstTouch == null || secondTouch == null) {
        return;
    }

    tempScale = scale * (secondTouch.abstotal / firstTouch.abstotal);
    tempScale = tempScale.toFixed(2);
    if (tempScale > maxScale) {
        tempScale = maxScale;
    }

    if (tempScale < minScale) {
        tempScale = minScale;
    }

    if (tempScale == 1) {
        prevMid = null;
        scale = 1;
    }

    var midx = (firstTouch.x + firstTouch.x2) / 2;
    var midy = (firstTouch.y + firstTouch.y2) / 2;


    var previewImage = document.querySelector('.previewImage');
    previewImage.style.transform = 'scale(' + tempScale + ')';
    /** handle zooming first time */
    if (prevMid == null) {
        transformOrigin = Math.round(midx) + 'px ' + Math.round(midy) + 'px';
        previewImage.style.transformOrigin = transformOrigin;
        prevMid = {x: midx, y: midy};
    /** handle repeat zoom */
    } else {
        const rect = previewGallery.getBoundingClientRect();
        const offsetX = (midx - rect.left) / rect.width * 100;
        const offsetY = (midy - rect.top) / rect.height * 100;

        previewImage.style.transformOrigin = `${offsetX}% ${offsetY}%`;
        previewImage.style.transform = `scale(${tempScale})`;

        prevMid = {x: offsetX, y: offsetY};
        var objectPosX = Math.round(offsetX) + 'px';
        var objectPosY = Math.round(offsetY) + 'px';
        transformOrigin = objectPosX + ' ' + objectPosY;
        previewImage.style.objectPosition = transformOrigin;
    }
}


function write(text) {
    document.querySelector('.debug').innerHTML = text;
}
