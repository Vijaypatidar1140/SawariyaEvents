// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;

    // --- THEME TOGGLE LOGIC ---
    let currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    if (currentTheme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    function updateThemeButtonIcon(isDark, button) {
        if (!button) return;
        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`;
        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`;
        button.innerHTML = isDark ? sunIcon : moonIcon;
    }

    function initializeThemeToggle() {
        const themeToggleButton = document.getElementById('themeToggleButton');
        const themeToggleButtonMobile = document.getElementById('themeToggleButtonMobile');
        
        if (themeToggleButton) {
            updateThemeButtonIcon(htmlElement.classList.contains('dark'), themeToggleButton);
            themeToggleButton.addEventListener('click', toggleTheme);
        }
        if (themeToggleButtonMobile) {
            updateThemeButtonIcon(htmlElement.classList.contains('dark'), themeToggleButtonMobile);
            themeToggleButtonMobile.addEventListener('click', toggleTheme);
        }
    }

    function toggleTheme() {
        htmlElement.classList.toggle('dark');
        let theme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        const themeToggleButton = document.getElementById('themeToggleButton');
        const themeToggleButtonMobile = document.getElementById('themeToggleButtonMobile');
        if(themeToggleButton) updateThemeButtonIcon(theme === 'dark', themeToggleButton);
        if(themeToggleButtonMobile) updateThemeButtonIcon(theme === 'dark', themeToggleButtonMobile);
    }
    // --- END THEME TOGGLE LOGIC ---


    // --- MOBILE MENU LOGIC ---
    function initializeMobileMenu() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    // --- END MOBILE MENU LOGIC ---

    // --- ACTIVE NAV LINK STYLER ---
    function styleActiveNavLink() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll('header nav a[data-navlink], header #mobileMenu a[data-navlink]').forEach(link => {
            if (link.getAttribute('data-navlink') === currentPage) {
                link.classList.add('text-[var(--maroon)]', 'font-semibold');
                if (!link.classList.contains('btn-primary')) {
                    link.classList.add('border-b-2', 'border-[var(--maroon)]');
                }
            } else {
                link.classList.remove('text-[var(--maroon)]', 'font-semibold', 'border-b-2', 'border-[var(--maroon)]');
            }
        });
    }
    // --- END ACTIVE NAV LINK STYLER ---


    // --- EMAIL AND PHONE PROTECTION ---
    function renderContactInfo() {
        const emailParts = ['info', '@', 'eventmasters.co.in']; // Replace with your actual email
        const phoneParts = ['+91', '98765', '43210']; // Replace with your actual phone

        const emailElement = document.getElementById('contactEmail');
        if (emailElement) {
            const email = emailParts.join('');
            emailElement.innerHTML = `<a href="mailto:${email}" class="hover:text-[var(--gold)]">${email}</a>`;
        }

        const phoneElement = document.getElementById('contactPhone');
        if (phoneElement) {
            const phone = phoneParts.join('');
            phoneElement.innerHTML = `<a href="tel:${phone}" class="hover:text-[var(--gold)]">${phone}</a>`;
        }
    }
    // --- END EMAIL AND PHONE PROTECTION ---

    // --- CURRENT YEAR FOR FOOTER ---
    function initializeCurrentYear() {
        const currentYearEl = document.getElementById('currentYear');
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
    }
    // --- END CURRENT YEAR ---


    // --- FUNCTION TO LOAD HTML (HEADER/FOOTER) ---
    async function loadHTML(filePath, elementId, callback) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`File not found or error loading: ${filePath} (${response.status})`);
            }
            const data = await response.text();
            const targetElement = document.getElementById(elementId);
            if (targetElement) {
                targetElement.innerHTML = data;
                if (callback) callback();
            } else {
                // console.warn(`Element with ID '${elementId}' not found for ${filePath}`);
            }
        } catch (error) {
            console.error(`Error loading HTML from ${filePath}:`, error);
            const targetElement = document.getElementById(elementId);
            if (targetElement) {
                 targetElement.innerHTML = `<p class="text-red-500 text-center p-4">Error loading content for ${elementId}.</p>`;
            }
        }
    }

    // --- GOOGLE SHEET DATA FOR UPCOMING EVENTS ---
    async function loadUpcomingEvents() {
        const eventsGrid = document.getElementById('events-grid');
        const loadingMessage = document.getElementById('events-loading-message');

        if (!eventsGrid) return; // Only run if the section exists on the page

        // ====================================================================================
        // VVVVVVVVVVVVVVVVVVVVVV  EDIT THIS LINE VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        // Replace with the "Publish to web" CSV URL from YOUR Google Sheet for public events
        const googleSheetCsvUrl = 'YOUR_COPIED_GOOGLE_SHEET_PUBLISH_TO_WEB_CSV_URL_HERE';
        // ^^^^^^^^^^^^^^^^^^^^^^  EDIT THIS LINE ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // Example: const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/pub?gid=0&single=true&output=csv';
        // ====================================================================================


        try {
            const response = await fetch(googleSheetCsvUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch Google Sheet CSV: ${response.status} - ${response.statusText}`);
            }
            const csvData = await response.text();
            const events = parseCsvToObjects(csvData); // Uses the refined parser below

            if (loadingMessage) loadingMessage.remove();

            if (events.length === 0) {
                eventsGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No upcoming events to display at the moment.</p>';
                return;
            }

            eventsGrid.innerHTML = '';
            events.forEach(event => {
                // Column names from your sheet are 'EventName', 'Date', 'Venue', 'Description' (Case-sensitive)
                const eventName = event.EventName || 'Unnamed Event';
                const eventDate = event.Date || 'Date TBD';
                const eventVenue = event.Venue || 'Venue TBD';
                const eventDescription = event.Description || 'No description available.';

                const eventCard = `
                    <div class="event-card card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 reveal">
                        <h3 class="text-xl font-semibold text-[var(--gold)] mb-2">${eventName}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Date:</strong> ${eventDate}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3"><strong>Venue:</strong> ${eventVenue}</p>
                        <p class="text-sm">${eventDescription}</p>
                    </div>
                `;
                eventsGrid.insertAdjacentHTML('beforeend', eventCard);
            });
            
            initializeScrollAnimations(); // Re-run for newly added .reveal elements

        } catch (error) {
            console.error("Error loading upcoming events:", error);
            if (loadingMessage) {
                loadingMessage.textContent = 'Could not load events. Please check the console for more details.';
                loadingMessage.classList.add('text-red-500');
            } else if (eventsGrid) {
                 eventsGrid.innerHTML = '<p class="col-span-full text-center text-red-500">Error: Could not load events data. Check console.</p>';
            }
        }
    }

    function parseCsvToObjects(csvText) {
        const lines = csvText.trim().split(/\r\n|\n/); // Handle both CRLF and LF line endings
        if (lines.length < 2) return []; // No data or only headers

        // More robust header parsing: remove quotes and leading/trailing spaces
        const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, '').trim());
        
        const objects = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue; // Skip empty lines

            // Basic CSV value parsing. For values with commas inside, this will need improvement.
            // This regex attempts to handle simple quoted commas, but it's not foolproof for complex CSV.
            const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(value => {
                let cleanValue = value.trim();
                // Remove surrounding quotes if they exist
                if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
                    cleanValue = cleanValue.substring(1, cleanValue.length - 1);
                }
                // Replace double double-quotes with a single double-quote (CSV standard for escaping quotes)
                return cleanValue.replace(/""/g, '"');
            });
            
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] !== undefined ? values[index] : ''; // Ensure property exists
            });
            objects.push(obj);
        }
        return objects;
    }
    // --- END GOOGLE SHEET DATA ---


    // --- LOAD HEADER AND FOOTER, THEN INITIALIZE DEPENDENT SCRIPTS ---
    async function initializePage() {
        await loadHTML('_header.html', 'header-placeholder', () => {
            initializeThemeToggle();
            initializeMobileMenu();
            styleActiveNavLink();
        });

        await loadHTML('_footer.html', 'footer-placeholder', () => {
            renderContactInfo();
            initializeCurrentYear();
        });

        // --- Call functions for page-specific or general initializations ---
        initializeScrollAnimations(); // Initial call for elements already in DOM
        initializeLightbox();
        initializeGalleryFilters();
        initializeBookingFormExtras();
        loadUpcomingEvents(); // <<<<<<<<<<< CALL TO LOAD GOOGLE SHEET DATA
    }

    initializePage(); // Start the loading process

    // --- SCROLL ANIMATIONS ---
    function initializeScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }
    // --- END SCROLL ANIMATIONS ---

    // --- LIGHTBOX FOR GALLERY ---
    function initializeLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxClose = document.getElementById('lightboxClose');

        if (!lightbox || !lightboxImg || !lightboxClose) return;

        document.querySelectorAll('.gallery-item img').forEach(image => {
            image.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = image.src;
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightboxAction = () => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
            document.body.style.overflow = 'auto';
        };
        lightboxClose.addEventListener('click', closeLightboxAction);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightboxAction();
        });
    }
    // --- END LIGHTBOX ---

    // --- GALLERY FILTERING ---
    function initializeGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (filterButtons.length === 0 || galleryItems.length === 0) return;

        // Set initial active button (e.g., "All")
        const initialActiveButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (initialActiveButton) {
            initialActiveButton.classList.add('bg-[var(--maroon)]', 'text-white');
        }


        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('bg-[var(--maroon)]', 'text-white'));
                button.classList.add('bg-[var(--maroon)]', 'text-white');
                
                const filter = button.getAttribute('data-filter');
                galleryItems.forEach(item => {
                    item.style.display = (filter === 'all' || item.getAttribute('data-category') === filter) ? 'block' : 'none';
                });
            });
        });
    }
    // --- END GALLERY FILTERING ---

    // --- BOOKING FORM EXTRAS (URL param prefill) ---
    function initializeBookingFormExtras() {
        const eventTypeSelect = document.getElementById('eventType');
        if (eventTypeSelect && window.location.pathname.includes('booking.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const eventTypeFromUrl = urlParams.get('event_type');
            if (eventTypeFromUrl) {
                eventTypeSelect.value = eventTypeFromUrl;
            }
        }
    }
    // --- END BOOKING FORM EXTRAS ---

});