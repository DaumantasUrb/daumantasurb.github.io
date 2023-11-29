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

    function getTransform(scale) {
        // Apply the cumulative scale
        return `scale(${scale})`;
    }

    function handleGesture() {
        const scale = currentScale * getScale();
        element.style.transform = getTransform(scale);
    }

    function handleTouchStart(e) {
        if (e.touches.length >= 2) {
            startTouches = e.touches;
            startDistance = getDistance(startTouches);
            // Calculate the center of the pinch gesture
            const touchCenterX = (startTouches[0].clientX + startTouches[1].clientX) / 2;
            const touchCenterY = (startTouches[0].clientY + startTouches[1].clientY) / 2;
            // Adjust the transform origin to the center of the pinch
            element.style.transformOrigin = `${touchCenterX}px ${touchCenterY}px`;
        }
    }

    element.addEventListener('touchstart', handleTouchStart);

    element.addEventListener('touchmove', e => {
        if (e.touches.length >= 2) {
            endTouches = e.touches;
            endDistance = getDistance(endTouches);
            handleGesture();
        }
    });

    element.addEventListener('touchend', () => {
        currentScale *= getScale(); // Store the cumulative scale
        element.style.transform = getTransform(currentScale); // Apply the final scale
    });

    element.addEventListener('touchcancel', () => {
        currentScale *= getScale();
        element.style.transform = getTransform(currentScale);
    });

    element.addEventListener('wheel', e => {
        e.preventDefault();
        currentScale = Math.min(Math.max(0.125, currentScale - e.deltaY / 1000), 4);
        element.style.transform = getTransform(currentScale);
    });

    element.addEventListener('dblclick', e => {
        e.preventDefault();
        currentScale = 1; // Reset scaling
        element.style.transformOrigin = '0 0'; // Reset transform origin
        element.style.transform = getTransform(currentScale);
    });

    element.addEventListener('contextmenu', e => {
        e.preventDefault();
    });

    // Apply initial transform
    element.style.transformOrigin = '0 0';
    element.style.transform = getTransform(currentScale);

    return element;
}

