// Main Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Initialize gallery with Unsplash images
    initGallery();
    
    // Filter functionality
    initFilters();
    
    // Contact form
    initContactForm();
    
    // PWA Install button
    initPWAInstall();
    
    // Add smooth scrolling
    initSmoothScroll();
    
    // Lazy loading images
    initLazyLoading();
});

// Gallery initialization with Unsplash API
async function initGallery() {
    const gallery = document.getElementById('gallery');
    const categories = [
        { type: 'portrait', query: 'portrait photography' },
        { type: 'landscape', query: 'landscape photography' },
        { type: 'event', query: 'wedding photography' },
        { type: 'fashion', query: 'fashion photography' }
    ];
    
    // Show loading
    gallery.innerHTML = '<div class="loading"></div>';
    
    try {
        let allImages = [];
        
        // Fetch images for each category
        for (const category of categories) {
            const images = await fetchUnsplashImages(category.query, 4);
            images.forEach(img => {
                img.category = category.type;
                allImages.push(img);
            });
        }
        
        // Shuffle and display images
        allImages = shuffleArray(allImages).slice(0, 12);
        displayImages(allImages, gallery);
        
    } catch (error) {
        console.error('Error loading images:', error);
        gallery.innerHTML = '<p>Error loading images. Please check your connection.</p>';
    }
}

// Fetch images from Unsplash (using demo access)
async function fetchUnsplashImages(query, count = 4) {
    // Using Unsplash Source for demo (no API key needed)
    const urls = [
        `https://source.unsplash.com/featured/?${query}&1`,
        `https://source.unsplash.com/featured/?${query}&2`,
        `https://source.unsplash.com/featured/?${query}&3`,
        `https://source.unsplash.com/featured/?${query}&4`
    ];
    
    return urls.map((url, index) => ({
        id: `${query}-${index}`,
        url: url + `&w=800&h=600`,
        thumbnail: url + `&w=400&h=300`,
        title: query.charAt(0).toUpperCase() + query.slice(1),
        category: query.split(' ')[0]
    }));
}

// Display images in gallery
function displayImages(images, gallery) {
    gallery.innerHTML = '';
    
    images.forEach(image => {
        const item = document.createElement('div');
        item.className = `gallery-item ${image.category}`;
        item.dataset.category = image.category;
        
        item.innerHTML = `
            <img src="${image.thumbnail}" 
                 data-src="${image.url}" 
                 alt="${image.title}"
                 loading="lazy">
            <div class="gallery-overlay">
                <h3>${image.title}</h3>
                <p>${image.category.toUpperCase()}</p>
            </div>
        `;
        
        gallery.appendChild(item);
    });
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Filter functionality
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Contact form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // In a real app, you would send this to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        });
    }
}

// PWA Install functionality
function initPWAInstall() {
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');
    
    // Show install button when PWA can be installed
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'inline-block';
        
        installBtn.addEventListener('click', () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted install');
                }
                deferredPrompt = null;
            });
        });
    });
    
    // Hide install button when app is already installed
    window.addEventListener('appinstalled', () => {
        installBtn.style.display = 'none';
        console.log('PWA installed successfully');
    });
}

// Smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Lazy loading images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Offline functionality check
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Add to home screen prompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('👍', 'beforeinstallprompt', e);
    // Show your custom "Add to Home Screen" button here
});
