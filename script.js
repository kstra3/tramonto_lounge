document.addEventListener('DOMContentLoaded', () => {

    // Background Audio Toggle
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    bgMusic.volume = 0.12; 
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.textContent = 'Music Off';
            musicBtn.style.opacity = '0.5';
        } else {
            bgMusic.play().catch(e => console.log('Audio playback prevented by browser policy.'));
            musicBtn.textContent = 'Music On';
            musicBtn.style.opacity = '1';
        }
        isPlaying = !isPlaying;
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Parallax Effect
    const parallaxImages = document.querySelectorAll('.parallax img');
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;

        parallaxImages.forEach(img => {
            const speed = 0.1;
            const parentSection = img.closest('section');
            if (parentSection) {
                const sectionTop = parentSection.offsetTop;
                const sectionHeight = parentSection.offsetHeight;
                const windowHeight = window.innerHeight;

                if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                    const relativeScroll = (scrollY + windowHeight - sectionTop) / (windowHeight + sectionHeight);
                    const yPos = (relativeScroll - 0.5) * 100; // range from -50 to 50
                    img.style.transform = `translateY(${yPos}px) scale(1.15)`;
                }
            }
        });
    });

    // Intersection Observer for scroll fade-in
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Reservation Modal Logic
    const modal = document.getElementById('reservation-modal');
    const openBtn = document.getElementById('open-reserve');
    const closeBtn = document.querySelector('.close-modal');
    const reserveForm = document.getElementById('reserve-form');

    const toggleModal = (show) => {
        if (show) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    };

    if (openBtn) {
        openBtn.addEventListener('click', () => toggleModal(true));
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleModal(false));
    }
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) toggleModal(false);
    });

    if (reserveForm) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = reserveForm.querySelector('.submit-btn');
            btn.textContent = 'Requesting...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = 'Request Sent';
                btn.style.background = '#28a745';
                btn.style.color = '#fff';
                setTimeout(() => {
                    toggleModal(false);
                    btn.textContent = 'Request Reservation';
                    btn.style.background = 'var(--accent-color)';
                    btn.style.color = '#fff';
                    btn.disabled = false;
                    reserveForm.reset();
                }, 2000);
            }, 1500);
        });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileBtn = document.querySelector('.close-mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const mobileReserveBtn = document.getElementById('mobile-reserve-btn');

    const toggleMobileMenu = (show) => {
        if (show) {
            if (mobileMenu) {
                mobileMenu.classList.add('active');
                mobileMenu.setAttribute('aria-hidden', 'false');
            }
            mobileBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        } else {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-hidden', 'true');
            }
            mobileBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        }
    };

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => toggleMobileMenu(true));
    }
    if (closeMobileBtn) {
        closeMobileBtn.addEventListener('click', () => toggleMobileMenu(false));
    }
    
    if (mobileNavLinks) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });
    }

    if (mobileReserveBtn) {
        mobileReserveBtn.addEventListener('click', () => {
            toggleMobileMenu(false);
            toggleModal(true);
        });
    }

    // Sticky CTA for Mobile
    const stickyBtn = document.getElementById('sticky-reserve-btn');
    window.addEventListener('scroll', () => {
        if (window.innerWidth < 900) {
            if (window.scrollY > 600) {
                document.body.classList.add('show-sticky-cta');
            } else {
                document.body.classList.remove('show-sticky-cta');
            }
        }
    });

    if (stickyBtn) {
        stickyBtn.addEventListener('click', () => toggleModal(true));
    }

    // Gastronomy Tab Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');

                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                tabContents.forEach(content => {
                    if (content.id === target) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });
            });
        });
    }
});