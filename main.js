/* =============================================
   Mzansi Tech Repairs — main.js
   All JavaScript features combined:
   - Dynamic Content / Search
   - Interactive Elements / FAQ Accordion
   - Gallery Lightbox
   - Form Validation (Enquiry + Contact)
   - Interactive Map Branch Selector
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       0. EMAILJS INITIALIZATION (Contact Process Email)
       ========================================================= */
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: "T851C2Lpl2D6kzb41" });
    }

    /* =========================================================
       1. SEARCH FEATURE (Dynamic Content)
       Works on index.html (#searchResults) and products.html (#productGrid)
       ========================================================= */
    const searchInput = document.getElementById('searchInput');

    // List of services used for the search-results dropdown on index.html
    const services = [
        { name: 'Screen Replacement', desc: 'Fast smartphone and laptop screen replacements.' },
        { name: 'Battery Replacement', desc: 'Restore your device\'s battery life.' },
        { name: 'Software Fix', desc: 'Operating system issues, viruses, and slow performance.' },
        { name: 'Laptop Repair', desc: 'Hardware and software repairs for all laptop brands.' },
        { name: 'Other Electronics', desc: 'Tablets, consoles, and other electronic devices.' }
    ];

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = searchInput.value.trim().toLowerCase();

            // Case 1: products.html — filter the product card grid
            const productGrid = document.getElementById('productGrid');
            if (productGrid) {
                const cards = productGrid.querySelectorAll('.card');
                cards.forEach(function (card) {
                    const cardName = card.getAttribute('data-name') || '';
                    const cardText = card.textContent.toLowerCase();
                    const isMatch = cardName.includes(query) || cardText.includes(query);
                    card.style.display = (isMatch || query === '') ? 'block' : 'none';
                });
            }

            // Case 2: index.html — show a dropdown list of matching services
            const searchResults = document.getElementById('searchResults');
            if (searchResults) {
                searchResults.innerHTML = '';

                if (query === '') return;

                const matches = services.filter(function (service) {
                    return service.name.toLowerCase().includes(query) ||
                           service.desc.toLowerCase().includes(query);
                });

                if (matches.length === 0) {
                    searchResults.innerHTML = '<p class="no-results">No matching services found.</p>';
                } else {
                    matches.forEach(function (service) {
                        const item = document.createElement('div');
                        item.classList.add('search-result-item');
                        item.innerHTML = '<strong>' + service.name + '</strong><p>' + service.desc + '</p>';
                        searchResults.appendChild(item);
                    });
                }
            }
        });
    }

    /* =========================================================
       2. FAQ ACCORDION (Interactive Elements)
       ========================================================= */
    const accordionButtons = document.querySelectorAll('.accordion-btn');

    accordionButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const content = button.nextElementSibling;
            const isOpen = button.classList.contains('active');

            accordionButtons.forEach(function (otherButton) {
                otherButton.classList.remove('active');
                otherButton.nextElementSibling.style.maxHeight = null;
            });

            if (!isOpen) {
                button.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    /* =========================================================
       3. GALLERY LIGHTBOX
       ========================================================= */
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;

    if (galleryImages.length > 0 && lightbox) {

        galleryImages.forEach(function (img, index) {
            img.addEventListener('click', function () {
                currentImageIndex = index;
                openLightbox(currentImageIndex);
            });
        });

        function openLightbox(index) {
            const img = galleryImages[index];
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            if (lightboxCaption) {
                lightboxCaption.textContent = img.getAttribute('data-caption') || img.alt;
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            openLightbox(currentImageIndex);
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(currentImageIndex);
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
        if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });
    }

    /* =========================================================
       4. FORM VALIDATION HELPERS
       ========================================================= */
    function showFieldError(errorElement, message) {
        if (!errorElement) return;
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearFieldError(errorElement) {
        if (!errorElement) return;
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    function isDateInPast(dateValue) {
        if (dateValue === '') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(dateValue);
        return selected < today;
    }

    /* =========================================================
       5. ENQUIRY FORM VALIDATION (enquiry.html)
       ========================================================= */
    const enquiryForm = document.getElementById('enquiryForm');

    if (enquiryForm) {
        const nameInput   = document.getElementById('name');
        const emailInput  = document.getElementById('email');
        const deviceInput = document.getElementById('device');
        const dateInput   = document.getElementById('repair-date');
        const issueInput  = document.getElementById('issue');

        const nameError   = document.getElementById('nameError');
        const emailError  = document.getElementById('emailError');
        const deviceError = document.getElementById('deviceError');
        const dateError   = document.getElementById('dateError');
        const issueError  = document.getElementById('issueError');
        const enquirySuccess = document.getElementById('enquiry-success');

        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            if (nameInput.value.trim().length < 2) {
                showFieldError(nameError, 'Please enter your full name (at least 2 characters).');
                isValid = false;
            } else {
                clearFieldError(nameError);
            }

            if (!isValidEmail(emailInput.value.trim())) {
                showFieldError(emailError, 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearFieldError(emailError);
            }

            if (deviceInput.value === '') {
                showFieldError(deviceError, 'Please select a device type.');
                isValid = false;
            } else {
                clearFieldError(deviceError);
            }

            if (isDateInPast(dateInput.value)) {
                showFieldError(dateError, 'Please choose a date that is today or later.');
                isValid = false;
            } else {
                clearFieldError(dateError);
            }

            if (issueInput.value.trim().length < 10) {
                showFieldError(issueError, 'Please describe the issue in a bit more detail.');
                isValid = false;
            } else {
                clearFieldError(issueError);
            }

            if (isValid) {
                if (enquirySuccess) {
                    enquirySuccess.style.display = 'block';
                    setTimeout(function () { enquirySuccess.style.display = 'none'; }, 4000);
                }
                enquiryForm.reset();
            } else if (enquirySuccess) {
                enquirySuccess.style.display = 'none';
            }
        });
    }

    /* =========================================================
       6. CONTACT FORM VALIDATION (contactus.html)
       ========================================================= */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const nameInput    = document.getElementById('name');
        const emailInput   = document.getElementById('email');
        const dateInput    = document.getElementById('visit-date');
        const serviceInput = document.getElementById('service');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        const nameError    = document.getElementById('contactNameError');
        const emailError   = document.getElementById('contactEmailError');
        const dateError    = document.getElementById('contactDateError');
        const serviceError = document.getElementById('contactServiceError');
        const subjectError = document.getElementById('contactSubjectError');
        const messageError = document.getElementById('contactMessageError');
        const contactSuccess = document.getElementById('contact-success');

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            if (nameInput.value.trim().length < 2) {
                showFieldError(nameError, 'Please enter your full name (at least 2 characters).');
                isValid = false;
            } else {
                clearFieldError(nameError);
            }

            if (!isValidEmail(emailInput.value.trim())) {
                showFieldError(emailError, 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearFieldError(emailError);
            }

            if (isDateInPast(dateInput.value)) {
                showFieldError(dateError, 'Please choose a date that is today or later.');
                isValid = false;
            } else {
                clearFieldError(dateError);
            }

            if (serviceInput.value === '') {
                showFieldError(serviceError, 'Please select a service.');
                isValid = false;
            } else {
                clearFieldError(serviceError);
            }

            if (subjectInput.value.trim().length < 3) {
                showFieldError(subjectError, 'Please enter a brief subject.');
                isValid = false;
            } else {
                clearFieldError(subjectError);
            }

            if (messageInput.value.trim().length < 10) {
                showFieldError(messageError, 'Please enter a message of at least 10 characters.');
                isValid = false;
            } else {
                clearFieldError(messageError);
            }

            if (isValid) {
                // Disable the submit button briefly to prevent double-sends
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }

                // Send the form data as a real email using EmailJS
                emailjs.sendForm('service_0qbfyz4', 'template_h01muq8', contactForm)
                    .then(function () {
                        if (contactSuccess) {
                            contactSuccess.style.display = 'block';
                            setTimeout(function () { contactSuccess.style.display = 'none'; }, 4000);
                        }
                        contactForm.reset();
                    })
                    .catch(function (error) {
                        showFieldError(messageError, 'Something went wrong sending your message. Please try again.');
                        console.log('EmailJS error:', error);
                    })
                    .finally(function () {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Send Message';
                        }
                    });
            } else if (contactSuccess) {
                contactSuccess.style.display = 'none';
            }
        });
    }

    /* =========================================================
       7. INTERACTIVE MAP — BRANCH SELECTOR (contactus.html)
       ========================================================= */
    const branchSelect = document.getElementById('branchSelect');
    const branchMap = document.getElementById('branchMap');
    const directionsLink = document.getElementById('directionsLink');

    if (branchSelect && branchMap) {
        const branches = {
            central: {
                mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.4!2d25.6022!3d-33.9608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e7ad4b3b3b3b3b3%3A0x1e7ad4b3b3b3b3b3!2sGovan+Mbeki+Ave%2C+Gqeberha!5e0!3m2!1sen!2sza!4v1620000000000!5m2!1sen!2sza",
                directions: "https://www.google.com/maps/dir/?api=1&destination=Govan+Mbeki+Avenue+Gqeberha"
            },
            summerstrand: {
                mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.4!2d25.6432!3d-33.9842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e7ad4b3b3b3b3b3%3A0x1e7ad4b3b3b3b3b3!2sSummerstrand%2C+Gqeberha!5e0!3m2!1sen!2sza!4v1620000000001!5m2!1sen!2sza",
                directions: "https://www.google.com/maps/dir/?api=1&destination=Summerstrand+Gqeberha"
            }
        };

        branchSelect.addEventListener('change', function () {
            const selected = branches[branchSelect.value];
            if (selected) {
                branchMap.src = selected.mapSrc;
                if (directionsLink) directionsLink.href = selected.directions;
            }
        });
    }

});
