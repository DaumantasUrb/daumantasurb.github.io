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
    var previewContainer = document.querySelector('.previewGallery');
    previewContainer.classList.remove('hide');
    var expandedGallery = document.querySelector('.expandedGallery');
    expandedGallery.classList.remove('hide');
    var collapsedGallery = document.querySelector('.collapsedGallery');
    collapsedGallery.classList.add('hide');
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
    const hash = window.location.hash;
    if (hash === '#gallery') {
        showExpandedGallery();
    } else if (hash.indexOf('#galleryImage_') === 0) {
        const imageId = hash.replace('#galleryImage_', '');
        showPreview(imageId);
    } else {
        showCollapsedGallery();
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

    var images = gallery.querySelectorAll('.previewImage');
    for (let i=0;i<images.length;i++) {
        initPinchZoom(images[i]);
    }

    function updateGalleryPosition() {
        const gallery = document.querySelector('.previewGallery');
        gallery.style.transition = 'transform 0.2s ease-out';
        gallery.style.transform = 'translateX(-' + index * window.innerWidth + 'px)';
    }

    function handleGesture() {
        if (touchendX < touchstartX) {
            index = Math.min(index + 1, gallery.children.length - 1);
        }
        if (touchendX > touchstartX) {
            index = Math.max(index - 1, 0);
        }
        updateGalleryPosition();
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
            window.history.pushState({ preview: true, id: imageIndex }, '', '#galleryImage_' + imageIndex);
            return false;
        });
    });
}


