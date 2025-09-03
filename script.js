// script.js - Handles scroll-triggered animations and video modal

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
    // Add left/right button listeners
    const leftBtn = document.getElementById('carousel-left-btn');
    const rightBtn = document.getElementById('carousel-right-btn');
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
    // Word-by-word apology animation
    function animateApologyWords() {
        const apologySection = document.getElementById('apology');
        if (!apologySection) return;
        const apologyWords = apologySection.querySelectorAll('.apology-word');
        let animated = false;
        function triggerWords() {
            if (animated) return;
            const rect = apologySection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                apologyWords.forEach((word, i) => {
                    setTimeout(() => {
                        word.style.opacity = 1;
                        word.style.transform = 'none';
                    }, i * 120);
                });
                animated = true;
            }
        }
        window.addEventListener('scroll', triggerWords);
        triggerWords();
    }
    animateApologyWords();
    // Apology modal logic
    const apologyModal = document.getElementById('apology-modal');
    const thumbnail = document.getElementById('video-thumbnail');
    const closeApology = document.getElementById('close-apology');
    const sendReply = document.getElementById('send-reply');
    const replyMessage = document.getElementById('reply-message');
    const replyStatus = document.getElementById('reply-status');

    const sendMessageBtn = document.getElementById('send-message-btn');
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', function() {
            apologyModal.style.display = 'block';
            replyStatus.textContent = '';
            replyMessage.value = '';
        });
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

    // Scroll-triggered animations for timeline, apology, and future sections
    function animateOnScroll(selector, activeClass = 'active', stagger = 150) {
        const elements = document.querySelectorAll(selector);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'none';
                    }, i * stagger);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        elements.forEach(el => observer.observe(el));
    }

    // Timeline items slide in
    animateOnScroll('.timeline-item');
    // Apology lines fade in
    animateOnScroll('.apology-line', 'active', 400);

    // Future section title/message
    animateOnScroll('.future-title', 'active', 0);
    animateOnScroll('.future-message', 'active', 0);
    animateOnScroll('#cta-button', 'active', 0);
    animateOnScroll('.video-thumbnail', 'active', 0);
    // Parallax effect for timeline background
    const parallaxSection = document.querySelector('.parallax-bg');
    if (parallaxSection) {
        window.addEventListener('scroll', function() {
            const rect = parallaxSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollPos = window.scrollY + rect.top;
                const parallaxBg = parallaxSection.querySelector('::before');
                // Fallback: use style property on section for transform
                parallaxSection.style.setProperty('--parallax-offset', `${window.scrollY * 0.2}px`);
            }
        });
    }
});
// End of file
