function initPinchZoom(element) {
    let currentScale = 1;
    let startTouches = [];
    let endTouches = [];
    let startDistance = 0;
    let endDistance = 0;
    /** disable default touch behavior except for pinch zoom  */
    element.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
    element.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    element.addEventListener('touchend', e => e.preventDefault(), { passive: false });
    element.addEventListener('touchcancel', e => e.preventDefault(), { passive: false });
    element.addEventListener('wheel', e => e.preventDefault(), { passive: false });
    //element.addEventListener('dblclick', e => e.preventDefault(), { passive: false });
    element.addEventListener('contextmenu', e => e.preventDefault(), { passive: false });

    element.isZoomed = function() {
        return currentScale !== 1;
    };

    element.addEventListener('dblclick', e => {
        console.log('dbl');
        e.preventDefault();
        currentScale = 1; // Reset scaling
        element.style.transformOrigin = '0 0'; // Reset transform origin
        element.style.transform = 'scale(1.0)';

        // When double-clicking, dispatch a custom event to inform that the image is zoomed out
        element.dispatchEvent(new CustomEvent('zoomReset'));
    });

    function getDistance(touches) {
        const [x1, y1] = [touches[0].clientX, touches[0].clientY];
        const [x2, y2] = [touches[1].clientX, touches[1].clientY];
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    function getScale() {
        console.log('endDistance', endDistance);
        console.log('startDistance', startDistance);
        if (startDistance == 0) {
            return 1;
        }

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
        console.log(currentScale);
        currentScale *= getScale(); // Store the cumulative scale
        console.log(currentScale);
        element.style.transform = getTransform(currentScale); // Apply the final scale
    });

    element.addEventListener('touchcancel', () => {
        console.log(currentScale);
        currentScale *= getScale();
        console.log(currentScale);
        element.style.transform = getTransform(currentScale);
    });

    element.addEventListener('wheel', e => {
        e.preventDefault();
        console.log(currentScale);
        currentScale = Math.min(Math.max(0.125, currentScale - e.deltaY / 1000), 4);
        console.log(currentScale);
        element.style.transform = getTransform(currentScale);
    });

    element.addEventListener('dblclick', e => {
        console.log('dblcl');
        e.preventDefault();
        console.log(currentScale);
        currentScale = 1; // Reset scaling
        console.log(currentScale);
        element.style.transformOrigin = '0 0'; // Reset transform origin
        element.style.transform = getTransform(1.0);
    });

    element.addEventListener('contextmenu', e => {
        e.preventDefault();
    });

    // Apply initial transform
    element.style.transformOrigin = '0 0';
    element.style.transform = getTransform(currentScale);

    return element;
}

