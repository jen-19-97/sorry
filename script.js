// script.js - Handles video modal

document.addEventListener('DOMContentLoaded', function() {
    // Gallery modal logic (reuse carousel modal)
    function attachGalleryImageListeners() {
        const galleryImgs = document.querySelectorAll('.gallery-img');
        galleryImgs.forEach(img => {
            img.onclick = null;
            img.addEventListener('click', function() {
                carouselModal.style.display = 'block';
                carouselModalImg.src = img.src;
                carouselModalCaption.textContent = img.alt;
            });
        });
    }
    attachGalleryImageListeners();
    // Carousel image modal logic
    const carouselModal = document.getElementById('carousel-modal');
    const carouselModalImg = document.getElementById('carousel-modal-img');
    const carouselModalCaption = document.getElementById('carousel-modal-caption');
    const closeCarouselModal = document.getElementById('close-carousel-modal');
    // Carousel manual scroll with left/right buttons
    const carouselTrack = document.querySelector('.carousel-track');
    let carouselIndex = 0;
    function updateCarouselPosition() {
        const imgs = carouselTrack.querySelectorAll('.carousel-img');
        const imgWidth = imgs[0].offsetWidth + 32; // 32px gap from CSS
        carouselTrack.style.transform = `translateX(${-carouselIndex * imgWidth}px)`;
        // Disable left button if at start, right button if at end
        leftBtn.disabled = carouselIndex === 0;
        rightBtn.disabled = carouselIndex === imgs.length - 1;
    }
    function attachCarouselImageListeners() {
        const allImgs = document.querySelectorAll('.carousel-img');
        allImgs.forEach(img => {
            img.onclick = null;
            img.addEventListener('click', function() {
                carouselModal.style.display = 'block';
                carouselModalImg.src = img.src;
                carouselModalCaption.textContent = img.alt;
            });
        });
    }
    // Add left/right button listeners only if buttons exist
    const leftBtn = document.getElementById('carousel-left-btn');
    const rightBtn = document.getElementById('carousel-right-btn');
    if (leftBtn && rightBtn && carouselTrack) {
        leftBtn.addEventListener('click', function() {
            const imgs = carouselTrack.querySelectorAll('.carousel-img');
            if (carouselIndex > 0) {
                carouselIndex--;
                updateCarouselPosition();
            }
        });
        rightBtn.addEventListener('click', function() {
            const imgs = carouselTrack.querySelectorAll('.carousel-img');
            if (carouselIndex < imgs.length - 1) {
                carouselIndex++;
                updateCarouselPosition();
            }
        });
        // Initial setup
        attachCarouselImageListeners();
        updateCarouselPosition();
    }

    closeCarouselModal.addEventListener('click', function() {
        carouselModal.style.display = 'none';
        carouselModalImg.src = '';
        carouselModalCaption.textContent = '';
    });
    window.addEventListener('click', function(event) {
        if (event.target === carouselModal) {
            carouselModal.style.display = 'none';
            carouselModalImg.src = '';
            carouselModalCaption.textContent = '';
        }
    });
    // Apology modal logic
    const apologyModal = document.getElementById('apology-modal');
    const thumbnail = document.getElementById('video-thumbnail');
    const closeApology = document.getElementById('close-apology');
    const sendReply = document.getElementById('send-reply');
    const replyMessage = document.getElementById('reply-message');
    const replyStatus = document.getElementById('reply-status');

    // Fix: Ensure send-message-btn opens apology modal
    const sendMessageBtn = document.getElementById('send-message-btn');
    if (sendMessageBtn && apologyModal) {
        sendMessageBtn.onclick = function() {
            apologyModal.style.display = 'block';
            if (replyStatus) replyStatus.textContent = '';
            if (replyMessage) replyMessage.value = '';
        };
    }
    closeApology.addEventListener('click', function() {
        apologyModal.style.display = 'none';
    });
    window.onclick = function(event) {
        if (event.target == apologyModal) {
            apologyModal.style.display = 'none';
        }
    };
    // Formspree integration
    const formspreeForm = document.getElementById('formspree-form');
    if (formspreeForm) {
        formspreeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (replyMessage.value.trim().length === 0) {
                replyStatus.textContent = 'Please write a message before sending.';
                replyStatus.style.color = '#222';
                return;
            }
            fetch(formspreeForm.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(formspreeForm)
            })
            .then(response => {
                if (response.ok) {
                    replyStatus.textContent = 'Message sent! Thank you for sharing your feelings.';
                    replyStatus.style.color = '#000';
                    replyMessage.value = '';
                } else {
                    replyStatus.textContent = 'There was a problem sending your message.';
                    replyStatus.style.color = 'red';
                }
            })
            .catch(() => {
                replyStatus.textContent = 'There was a problem sending your message.';
                replyStatus.style.color = 'red';
            });
        });
    }

    // Remove all scroll animation JS
    // (No need to set opacity/transform or add scroll listeners)
});
// End of file
