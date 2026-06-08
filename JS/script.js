// script.js
document.addEventListener('DOMContentLoaded', function() {

    // --- Global Variables & Elements ---
    const navbar = document.getElementById('navbar');
    const header = document.getElementById('header');
    const navLinksContainer = document.querySelector('.nav-links');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroSubtitleEl = document.getElementById('heroSubtitle');
    const counters = document.querySelectorAll('.counter');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const currentYearSpan = document.getElementById('currentYear');

    // --- Initialize AOS (Animate on Scroll) ---
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        once: true, // whether animation should happen only once - while scrolling down
    });

    // --- Smooth Scroll for Anchor Links & Active Nav Link Highlighting ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // For same-page anchor links
            if (this.hash !== "") {
                const hash = this.hash;
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = navbar.offsetHeight;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // Close mobile menu if open
                    if (navLinksContainer.classList.contains('active')) {
                        navLinksContainer.classList.remove('active');
                        hamburgerMenu.classList.remove('active');
                    }
                }
            }
            // For navigation to other pages, the default behavior is fine.
        });
    });

    // Scroll-based active nav link highlighting (basic version)
    function highlightActiveLink() {
        let scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        // Add a small offset to trigger highlight slightly before section top
        const offset = window.innerHeight / 2.5;

        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href').split('/').pop(); // Get section ID from href
            if (sectionId.startsWith('#')) { // Only for on-page links
                const section = document.querySelector(sectionId);
                if (section) {
                    if (section.offsetTop <= scrollPos + offset && section.offsetTop + section.offsetHeight > scrollPos + offset) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    } else {
                        // link.classList.remove('active'); // Be careful with this, might remove active state from current page link
                    }
                }
            }
        });
        // Ensure current page link remains active if no section is matched
        if (!document.querySelector('.nav-link.active') && window.location.pathname) {
            const currentPageLink = document.querySelector(`.nav-link[href*="${window.location.pathname.split('/').pop()}"]`);
            if(currentPageLink && !currentPageLink.href.includes('#')) currentPageLink.classList.add('active');
            else if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
                 document.querySelector('.nav-link[href="index.html"]').classList.add('active');
            }
        }
    }
    // Set active link on page load for the current page
    function setActivePageLink() {
        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').split('/').pop() === currentPath) {
                link.classList.add('active');
            }
        });
    }


    // --- Sticky Navbar & Shrink/Shadow on Scroll ---
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        // For scroll-based navbar highlighting (if added)
        // highlightActiveLink();
    }

    // --- Hamburger Menu Toggle ---
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }

    // --- Hero Section Typewriter Effect ---
    const subtitles = [
        "Your Journey Begins Here.",
        "Explore Breathtaking Destinations.",
        "Crafting Unforgettable Memories."
    ];
    let subtitleIndex = 0;
    let charIndex = 0;
    const typingSpeed = 100; // milliseconds
    const erasingSpeed = 50;
    const delayBetweenSubtitles = 2000;

    function typeWriter() {
        if (heroSubtitleEl) {
            if (charIndex < subtitles[subtitleIndex].length) {
                heroSubtitleEl.textContent += subtitles[subtitleIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typingSpeed);
            } else {
                setTimeout(eraseSubtitle, delayBetweenSubtitles);
            }
        }
    }

    function eraseSubtitle() {
         if (heroSubtitleEl) {
            if (charIndex > 0) {
                heroSubtitleEl.textContent = subtitles[subtitleIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(eraseSubtitle, erasingSpeed);
            } else {
                subtitleIndex = (subtitleIndex + 1) % subtitles.length;
                setTimeout(typeWriter, typingSpeed);
            }
        }
    }

    // --- Animated Counters ---
    const observerOptions = {
        root: null,
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let current = 0;
                const increment = target / 100; // Adjust for speed

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target.toLocaleString() + (counter.innerText.includes('+') || target === 10000 || target === 50 ? '+' : ''); // Add + for specific counters
                    }
                };
                updateCounter();
                observer.unobserve(counter); // Animate only once
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    const items = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.testimonial-carousel-container .prev');
    const nextBtn = document.querySelector('.testimonial-carousel-container .next');
    let currentIndex = 0;
    let autoLoopInterval;

    function showItem(index) {
        if (!carousel || !items.length) return;
        items.forEach((item, i) => {
            item.classList.remove('active');
            // For sliding effect (alternative to fade)
            // item.style.transform = `translateX(-${index * 100}%)`;
        });
        items[index].classList.add('active'); // For fade effect
        currentIndex = index;
    }

    function nextItem() {
        if (!items.length) return;
        let newIndex = (currentIndex + 1) % items.length;
        showItem(newIndex);
    }

    function prevItem() {
        if (!items.length) return;
        let newIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(newIndex);
    }

    function startAutoLoop() {
        if (!items.length) return;
        stopAutoLoop(); // Clear existing interval
        autoLoopInterval = setInterval(nextItem, 5000); // Change slide every 5 seconds
    }

    function stopAutoLoop() {
        clearInterval(autoLoopInterval);
    }

    if (nextBtn && prevBtn && items.length > 0) {
        nextBtn.addEventListener('click', () => {
            nextItem();
            stopAutoLoop(); // Stop auto when manually navigated
            startAutoLoop(); // Restart auto loop
        });
        prevBtn.addEventListener('click', () => {
            prevItem();
            stopAutoLoop();
            startAutoLoop();
        });
        // Initialize carousel
        showItem(0); // Show first item
        startAutoLoop(); // Start auto-loop

        // Pause on hover (optional)
        const carouselContainer = document.querySelector('.testimonial-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoLoop);
            carouselContainer.addEventListener('mouseleave', startAutoLoop);
        }
    }


    // --- Package Filters ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-grid .package-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            packageCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                // Fade out effect
                card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';


                setTimeout(() => {
                    if (filterValue === 'all' || (cardCategory && cardCategory.includes(filterValue))) {
                        card.style.display = 'flex'; // or 'block' or 'grid' depending on card's display type
                         // Fade in effect
                        setTimeout(() => { // slight delay to ensure display:block is applied
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300); // Match timeout with transition duration
            });
        });
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        // Pre-fill subject from URL query parameter if present
        const urlParams = new URLSearchParams(window.location.search);
        const packageInterest = urlParams.get('package');
        const interestSelect = document.getElementById('interest');
        const messageTextarea = document.getElementById('message');

        if (packageInterest && interestSelect && messageTextarea) {
            // Try to find an option that matches or set to package booking
            let foundOption = false;
            for (let i = 0; i < interestSelect.options.length; i++) {
                if (interestSelect.options[i].text.toLowerCase().includes(packageInterest.toLowerCase())) {
                    interestSelect.value = interestSelect.options[i].value;
                    foundOption = true;
                    break;
                }
            }
            if (!foundOption) {
                 interestSelect.value = 'package_booking'; // Default to package booking
            }
            messageTextarea.value = `I am interested in the "${packageInterest}" package. Please provide more details.`;
            // Trigger label float for prefilled textarea
            if(messageTextarea.value) messageTextarea.classList.add('has-content'); // you may need a CSS rule for .has-content + label
            // Or directly manipulate label for prefilled fields
            const messageLabel = document.querySelector('label[for="message"]');
            if (messageLabel && messageTextarea.value) {
                 messageLabel.style.top = '-10px';
                 messageLabel.style.fontSize = '0.85rem';
            }
        }


        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Basic validation (can be enhanced)
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            [nameInput, emailInput, messageInput].forEach(input => input.style.borderColor = '');


            if (!nameInput.value.trim()) {
                displayError(nameInput, 'Full name is required.');
                isValid = false;
            }
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
                displayError(emailInput, 'A valid email is required.');
                isValid = false;
            }
            if (!messageInput.value.trim()) {
                 displayError(messageInput, 'Message cannot be empty.');
                isValid = false;
            }

            if (isValid) {
                // Simulate form submission
                formStatus.textContent = 'Sending your message...';
                formStatus.style.color = 'var(--primary-color)';

                // Save to localStorage (optional enhancement)
                const formData = {
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: document.getElementById('phone').value,
                    interest: interestSelect.value,
                    message: messageInput.value,
                    timestamp: new Date().toLocaleString()
                };
                try {
                    localStorage.setItem('contactFormEntry', JSON.stringify(formData));
                } catch (error) {
                    console.warn("Could not save form data to localStorage:", error);
                }


                setTimeout(() => {
                    formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                    formStatus.style.color = 'green';
                    contactForm.reset();
                    // Manually reset labels for floating effect if not using :placeholder-shown trick
                    document.querySelectorAll('.form-group label').forEach(label => {
                         label.style.top = '12px';
                         label.style.fontSize = '1rem';
                    });
                }, 1500);
            } else {
                formStatus.textContent = 'Please correct the errors above.';
                formStatus.style.color = 'red';
            }
        });
    }

    function displayError(inputElement, message) {
        inputElement.style.borderColor = '#e74c3c';
        const errorElement = inputElement.parentElement.querySelector('.error-message');
        if(errorElement) errorElement.textContent = message;
    }

    function isValidEmail(email) {
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Floating labels: ensure they re-evaluate on input/change for all fields
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('input', handleLabelFloat);
        input.addEventListener('change', handleLabelFloat); // For select or pre-filled fields
        handleLabelFloat({ target: input }); // Initial check for pre-filled values
    });

    function handleLabelFloat(event) {
        const input = event.target;
        const label = input.parentElement.querySelector('label');
        if (label) {
            if (input.value.trim() !== '' || document.activeElement === input) {
                label.style.top = '-10px';
                label.style.left = '10px';
                label.style.fontSize = '0.85rem';
                label.style.color = document.body.classList.contains('dark-mode') ? 'var(--secondary-color)' : 'var(--primary-color)';
            } else if (input.value.trim() === '' && !input.matches(':focus')) { // Check if not focused
                label.style.top = '12px';
                label.style.left = '15px';
                label.style.fontSize = '1rem';
                label.style.color = document.body.classList.contains('dark-mode') ? '#aaa' : '#777';
            }
        }
    }
     // Also trigger label check on focus/blur
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('focus', handleLabelFloat);
        input.addEventListener('blur', handleLabelFloat);
    });


    // --- Dark Mode Toggle ---
    function applyDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️'; // Sun icon for light mode
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.textContent = '🌙'; // Moon icon for dark mode
            localStorage.setItem('theme', 'light');
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            applyDarkMode(!document.body.classList.contains('dark-mode'));
        });

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            applyDarkMode(true);
        } else if (savedTheme === 'light') {
            applyDarkMode(false);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Fallback to system preference if no explicit choice saved
            applyDarkMode(true);
        }
    }


    // --- GSAP Animations (Optional Enhancements) ---
    // Example: Smooth hero text animation with GSAP
    if (typeof gsap !== 'undefined') {
        gsap.from(".hero-title", { duration: 1, y: -50, opacity: 0, ease: "power2.out", delay: 0.2 });
        // Note: Typewriter is JS based, GSAP could animate individual letters if HTML is structured for it.
        // For now, the CSS fadeInDown is used for the title, and JS typewriter for subtitle.
        // GSAP could replace AOS for scroll animations for more control. Example:
        // gsap.utils.toArray('.section-title').forEach(title => {
        //     gsap.from(title, {
        //         scrollTrigger: {
        //             trigger: title,
        //             start: "top 80%", // when the top of the trigger hits 80% of the viewport height
        //             toggleActions: "play none none none", // play animation on enter
        //         },
        //         opacity: 0,
        //         y: 30,
        //         duration: 0.8,
        //         ease: "power1.out"
        //     });
        // });
    }

    // --- Update Footer Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Event Listeners ---
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', () => {
        setActivePageLink(); // Set active link after page content is loaded
        if (heroSubtitleEl) typeWriter(); // Start typewriter on load
        // highlightActiveLink(); // Initial highlight check
    });
    // window.addEventListener('scroll', highlightActiveLink); // Highlight on scroll


    // --- Leaflet Map (Example if you choose Leaflet) ---
    /*
    if (document.getElementById('mapid')) {
        var mymap = L.map('mapid').setView([YOUR_LATITUDE, YOUR_LONGITUDE], 13); // Replace with your coordinates
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(mymap);
        L.marker([YOUR_LATITUDE, YOUR_LONGITUDE]).addTo(mymap)
            .bindPopup("<b>GlobeTrek Adventures</b><br>123 Travel Lane, Adventure City")
            .openPopup();
    }
    */

    // Load packages from localStorage into packages.html
    if (document.querySelector('.package-grid')) {
        loadPackagesFromStorage();
    }

}); // End DOMContentLoaded

function loadPackagesFromStorage() {
    const packages = JSON.parse(localStorage.getItem('packages') || '[]');
    const packageGrid = document.querySelector('.package-grid');
    
    // Keep the existing hardcoded packages
    const existingPackages = packageGrid.innerHTML;
    
    // Add new packages from localStorage
    const newPackagesHtml = packages.map(pkg => {
        const categoryClasses = Array.isArray(pkg.category) ? pkg.category.join(' ').toLowerCase() : '';
        return `
            <div class="package-card" data-category="${categoryClasses}" data-aos="fade-up" data-aos-delay="100" id="${pkg.id}-package">
                <img src="${pkg.image}" alt="${pkg.name}">
                <div class="package-info">
                    <h3>${pkg.name}</h3>
                    <p class="package-price">₹${pkg.price.toLocaleString()}</p>
                    <div class="package-rating">★★★★★ (${pkg.ratingCount || '4.8'})</div>
                    <div class="package-features">
                        ${pkg.features.map(feature => `
                            <span><i class="fas fa-${getFeatureIcon(feature)}"></i> ${feature}</span>
                        `).join('')}
                    </div>
                    <a href="#" class="cta-button-outline" onclick="openBookingPopup('${pkg.name}', ${pkg.price})">Book Now</a>
                </div>
            </div>
        `;
    }).join('');

    // Combine existing and new packages
    packageGrid.innerHTML = existingPackages + newPackagesHtml;

    // Initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Helper function to get appropriate Font Awesome icons based on feature text
function getFeatureIcon(feature) {
    const iconMap = {
        'Heritage Hotels': 'hotel',
        'Flights': 'plane',
        'Royal Cuisine': 'utensils',
        'Desert Safari': 'user-friends',
        'Houseboat Stay': 'home',
        'Ayurveda Spa': 'spa',
        'Tea Gardens': 'leaf',
        'Mountain Trekking': 'mountain',
        'Bike Tours': 'motorcycle',
        'Monastery Visits': 'om',
        'Beach Resorts': 'umbrella-beach',
        'Nightlife': 'glass-cheers',
        'Water Sports': 'water',
        'Heritage Tours': 'church'
    };

    // Try to find a matching icon, or use a default one
    for (const [key, value] of Object.entries(iconMap)) {
        if (feature.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }
    return 'check'; // Default icon if no match found
}

// Filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter packages
            const packages = document.querySelectorAll('.package-card');
            packages.forEach(package => {
                if (filter === 'all' || package.getAttribute('data-category').includes(filter)) {
                    package.style.display = 'block';
                } else {
                    package.style.display = 'none';
                }
            });
        });
    });
});