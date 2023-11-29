function initPinchZoom(element) {
    let currentScale = 1;
    let startTouches = [];
    let endTouches = [];
    let startDistance = 0;
    let endDistance = 0;

    function getDistance(touches) {
        const [x1, y1] = [touches[0].clientX, touches[0].clientY];
        const [x2, y2] = [touches[1].clientX, touches[1].clientY];
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    function getScale() {
        return endDistance / startDistance;
    }

    function getTransform() {
        // We only include scale in the transform now
        const scale = getScale();
        return `scale(${scale})`;
    }

    function handleGesture() {
        element.style.transform = getTransform();
    }

    element.addEventListener('touchstart', e => {
        if (e.touches.length >= 2) { // Ensure we have two touches
            startTouches = e.touches;
            startDistance = getDistance(startTouches);
        }
    });

    element.addEventListener('touchmove', e => {
        if (e.touches.length >= 2) {
            endTouches = e.touches;
            endDistance = getDistance(endTouches);
            handleGesture();
        }
    });

    element.addEventListener('touchend', () => {
        currentScale *= getScale(); // Store the cumulative scale
        handleGesture(); // Ensure the scale is applied at the end of the gesture
    });

    element.addEventListener('touchcancel', () => {
        currentScale *= getScale();
        handleGesture();
    });

    element.addEventListener('wheel', e => {
        e.preventDefault();
        currentScale = Math.min(Math.max(0.125, currentScale - e.deltaY / 1000), 4);
        handleGesture();
    });

    element.addEventListener('dblclick', e => {
        e.preventDefault();
        currentScale = 1; // Reset scaling
        handleGesture();
    });

    element.addEventListener('contextmenu', e => {
        e.preventDefault();
    });

    element.style.transformOrigin = '0 0'; // Sets the origin of transform
    element.style.transform = getTransform(); // Apply initial transform

    return element;
}

