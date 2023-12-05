function write(text, append = false) {
    if (append) {
        text = text + '<br>' + document.querySelector('.debug').innerHTML;
    }

    document.querySelector('.debug').innerHTML = text;
}

function initMGallery() {
    window.addEventListener("load", initExpandGallery, false);
    window.addEventListener("load", initPreviewLinks, false);
    window.addEventListener('load', setupSwipeGallery, false);
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
}

function showExpandedGallery() {
    var expandedGallery = document.querySelector('.expandedGallery');
    expandedGallery.classList.remove('hide');
    var collapsedGallery = document.querySelector('.collapsedGallery');
    collapsedGallery.classList.add('hide');
    var previewContainer = document.querySelector('.previewGallery');
    previewContainer.classList.add('hide');
}

function showPreview(imageId) {
    console.log('showPreview' + imageId);
    var previewContainer = document.querySelector('.previewGallery');
    previewContainer.classList.remove('hide');
    var expandedGallery = document.querySelector('.expandedGallery');
    expandedGallery.classList.remove('hide');
    var collapsedGallery = document.querySelector('.collapsedGallery');
    collapsedGallery.classList.add('hide');
    /** remove active class from all preview items */
    var previewItems = document.querySelectorAll('.previewImage');
    previewItems.forEach(function(el) {
        el.classList.remove('active');
    });
    /** add class to that preview item */
    var previewItem = document.querySelector('.previewImage[data-index="' + imageId + '"]');
    previewItem.classList.add('active');
    console.log('setting active ' + imageId, previewItem);

    /** scroll to that preview item */
    var previewItemOffset = previewItem.offsetLeft;
    var previewItemWidth = previewItem.offsetWidth;
    var previewContainerWidth = previewContainer.offsetWidth;
    var previewContainerOffset = previewContainer.offsetLeft;
    var scrollLeft = previewItemOffset - previewContainerOffset - (previewContainerWidth / 2) + (previewItemWidth / 2);
    previewContainer.scrollLeft = scrollLeft;
}

function showCollapsedGallery() {
    var expandedGallery = document.querySelector('.expandedGallery');
    expandedGallery.classList.add('hide');
    var collapsedGallery = document.querySelector('.collapsedGallery');
    collapsedGallery.classList.remove('hide');
    var previewContainer = document.querySelector('.previewGallery');
    previewContainer.classList.add('hide');
}

function handleHashChange()
{
    console.log('hashChange');
    const hash = window.location.hash;
    if (hash === '#gallery') {
        console.log('hashChange expanded');
        showExpandedGallery();
    } else if (hash.indexOf('#galleryImage_') === 0) {
        const imageId = hash.replace('#galleryImage_', '');
        console.log('hashChange prev' + imageId);
        showPreview(imageId);
    } else {
        showCollapsedGallery();
        console.log('hashChange collapsed');
  }
}

/* esc key */
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
        e.preventDefault();
        e.stopImmediatePropagation();
        /** go back once if hash not empty*/
        if (window.location.hash !== '') {
            window.history.back();
        }

        return false;
    }
});

document.querySelector('.closeOverlay .close').addEventListener('click', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    /** go back once if hash not empty*/
    if (window.location.hash !== '') {
        window.history.back();
    }

    return false;
});

function setupSwipeGallery() {
    const gallery = document.querySelector('.previewGallery');
    let touchstartX = 0;
    let touchendX = 0;
    let index = 0;

    var images = gallery.querySelectorAll('.previewImage picture');

    images.forEach(image => {
        image.addEventListener('zoomReset', () => {
            gallery.classList.remove('noSwipe'); // Remove a class that would prevent swiping (decide how you implement the restriction)
        });
    });

    function onZoomUpdateOrEnd(object, event) {
        write('scale ' + object.zoomFactor, true);
        if (object.zoomFactor == 1) {
            enableSwipe();
        } else {
            disableSwipe();
        }
    }

    var imageContainers = gallery.querySelectorAll('.previewImage');
    imageContainers.forEach(function (value, key) {
        write('init zoom for ' + key, true);
        try {
            var pz = new PinchZoom(value, {
                tapZoomFactor: 4,
                maxZoom: 10,
                animationDuration: 0,
                maxZoom: 8,
                minZoom: 1,
                draggableUnzoomed: false,
                onZoomStart: function (object, event) {
                    disableSwipe();
                },
                onZoomUpdate: onZoomUpdateOrEnd,
                onZoomEnd: onZoomUpdateOrEnd,
                onDoubleTap: function (object, event) {
                    //enableSwipe();
                },
            });
        } catch (e) {
            alert(e);
        }

    });

    function disableSwipe()
    {
        gallery.classList.add('noSwipe');
        write('disableSwipe', true);
    }

    function enableSwipe()
    {
        gallery.classList.remove('noSwipe');
        write('enableSwipe', true);
    }

    function canSwipe() {
        return !gallery.classList.contains('noSwipe');
    }

    function updateGalleryPosition() {
        const gallery = document.querySelector('.previewGallery');
        gallery.style.transition = 'transform 0.2s ease-out';
        gallery.style.transform = 'translateX(-' + index * window.innerWidth + 'px)';
    }

    function handleGesture() {
        if (canSwipe()) {
            if (touchendX < touchstartX) {
                index = Math.min(index + 1, gallery.children.length - 1);
            }
            if (touchendX > touchstartX) {
                index = Math.max(index - 1, 0);
            }

            write('swipe to ' + index, true);
            updateGalleryPosition();
            showPreview(index + 1);
        }
    }

    gallery.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    });

    gallery.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        gallery.classList.add('touched');
        handleGesture();
    });

    gallery.addEventListener('mousedown', e => {
        touchstartX = e.screenX;
        e.preventDefault();
    });

    gallery.addEventListener('mouseup', e => {
        touchendX = e.screenX;
        gallery.classList.add('touched');
        handleGesture();
    });

    window.addEventListener('resize', updateGalleryPosition);
}


function initExpandGallery() {
    var galleryLinks = document.querySelectorAll('.galleryLink');('t123');
    galleryLinks.forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var currEl = e.currentTarget;
            var imageIndex = currEl.getAttribute('data-index');
            var expandedGallery = document.querySelector('.expandedGallery');
            if (typeof imageIndex === 'string' && imageIndex.length > 0) {
                var expandedEl = document.querySelector('.mgallery-element[data-index="' + imageIndex + '"]');
                var firstEl = expandedGallery.querySelectorAll('.mgallery-element')[0];
                if (expandedEl !== null && expandedEl !== firstEl) {
                    // Insert expandedEl as the first element
                    expandedGallery.insertBefore(expandedEl, expandedGallery.firstChild);
                    if (firstEl !== expandedGallery.querySelectorAll('.mgallery-element')[0]) {
                        var secondEl = expandedGallery.querySelectorAll('.mgallery-element')[1];
                        expandedGallery.insertBefore(firstEl, secondEl);
                    }
                }
            }

            window.history.pushState({ gallery: true }, '', '#gallery');
            handleHashChange();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            return false;
        });
    });
}

function initPreviewLinks() {
    var previewLinks = document.querySelectorAll('.previewable-image');
    previewLinks.forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var currEl = e.currentTarget;
            var imageIndex = currEl.getAttribute('data-index');
            var previewContainer = document.querySelector('.previewGallery');
            previewContainer.classList.remove('hide');
            showPreview(imageIndex);
            window.history.pushState({ preview: true, id: imageIndex }, '', '#galleryImage_' + imageIndex);
            return false;
        });
    });
}



