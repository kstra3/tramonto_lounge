/* ===================================
   TRAMONTO LOUNGE - Main JavaScript
   Navigation, Lightbox, Cookies
   =================================== */

/* --- Time-Aware Theme System --- */
(function() {
  function applyTimeTheme() {
    const hour = new Date().getHours();
    const body = document.body;

    // Remove existing time classes
    body.classList.remove('sunset-mode', 'night-mode');

    if (hour >= 18 && hour < 22) {
      // Sunset: 6 PM - 10 PM → warm golden/coral vibes
      body.classList.add('sunset-mode');
    } else if (hour >= 22 || hour < 6) {
      // Night: 10 PM - 6 AM → deep twilight navy
      body.classList.add('night-mode');
    }
    // Daytime: 6 AM - 6 PM → default Aegean blue (no class needed)
  }

  // Apply immediately on script load (before preloader finishes)
  applyTimeTheme();

  // Re-check every 60 seconds for live transitions
  setInterval(applyTimeTheme, 60000);
})();

function initPageTransition() {
  // Page transition in
  document.body.classList.remove('fade-out');
  
  // Wait for the sun drawing animation (2s) before fading out preloader
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 2200);
}

if (document.readyState === 'complete') {
  initPageTransition();
} else {
  window.addEventListener('load', initPageTransition);
}

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar scroll behavior --- */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      // On menu.html the navbar starts scrolled
      if (!document.querySelector('.menu-hero')) {
        navbar.classList.remove('scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  /* --- Cinematic Page Transitions --- */
  document.querySelectorAll('a[href]:not([href^="#"]):not([href^="tel:"]):not([href^="mailto:"]):not([target="_blank"])').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = link.href;
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1000); // Wait for transition
    });
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  /* --- Mobile hamburger menu --- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.add('active');
    hamburger.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('active');
    hamburger.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeLightbox();
    }
  });

  /* --- Lightbox for gallery --- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryItems = document.querySelectorAll('.gallery-item, .dish-card, .dish-hero-img');
  let currentIndex = 0;
  const gallerySrcs = [];

  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
      gallerySrcs.push(img.src);
      // Make item look clickable
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => openLightbox(i));
    }
  });

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = index;
    lightboxImg.src = gallerySrcs[currentIndex];
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % gallerySrcs.length;
    if (lightboxImg) lightboxImg.src = gallerySrcs[currentIndex];
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
    if (lightboxImg) lightboxImg.src = gallerySrcs[currentIndex];
  }

  const closeBtn = document.querySelector('.lightbox-close');
  const nextBtn = document.querySelector('.lightbox-next');
  const prevBtn = document.querySelector('.lightbox-prev');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);

  // Close lightbox on background click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch swipe support for lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (lightbox) {
    lightbox.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});
  }

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextImage();
    if (touchEndX > touchStartX + 50) prevImage();
  }

  /* --- Cookie banner --- */
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('tramonto-cookies')) {
    setTimeout(() => cookieBanner.classList.add('show'), 2000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('tramonto-cookies', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('tramonto-cookies', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  /* --- Testimonials Slider --- */
  const slider = document.getElementById('testimonials-slider');
  const track = document.getElementById('testimonials-track');
  if (slider && track) {
    const cards = Array.from(track.children);
    const prevBtn = document.getElementById('test-prev');
    const nextBtn = document.getElementById('test-next');
    const dotsContainer = document.getElementById('test-dots');
    
    let currentSlide = 0;
    let slideInterval;
    let dots = [];
    
    function getVisibleCards() {
      if (cards.length === 0) return 1;
      const sliderWidth = slider.getBoundingClientRect().width;
      const cardWidth = cards[0].getBoundingClientRect().width;
      return Math.max(1, Math.round(sliderWidth / cardWidth));
    }
    
    function setupDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, cards.length - visibleCards);
      
      dots = [];
      for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('button');
        dot.classList.add('t-dot');
        dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
      }
    }
    
    function updateSlider() {
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, cards.length - visibleCards);
      if (currentSlide > maxSlide) currentSlide = maxSlide;
      
      if (cards[currentSlide]) {
        const offset = cards[currentSlide].offsetLeft;
        track.style.transform = `translateX(-${offset}px)`;
      }
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
    
    function nextSlide() {
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, cards.length - visibleCards);
      if (maxSlide === 0) return;
      currentSlide = (currentSlide + 1) > maxSlide ? 0 : currentSlide + 1;
      updateSlider();
    }
    
    function prevSlide() {
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, cards.length - visibleCards);
      if (maxSlide === 0) return;
      currentSlide = (currentSlide - 1) < 0 ? maxSlide : currentSlide - 1;
      updateSlider();
    }
    
    function goToSlide(index) {
      currentSlide = index;
      updateSlider();
      resetInterval();
    }
    
    function resetInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }
    
    setupDots();
    updateSlider();
    
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
    
    slideInterval = setInterval(nextSlide, 5000);
    
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', resetInterval);
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupDots();
        updateSlider();
      }, 100);
    });
    
    let startX = 0;
    slider.addEventListener('touchstart', e => {
      startX = e.changedTouches[0].screenX;
      clearInterval(slideInterval);
    }, {passive: true});
    
    slider.addEventListener('touchend', e => {
      let endX = e.changedTouches[0].screenX;
      if (endX < startX - 50) nextSlide();
      if (endX > startX + 50) prevSlide();
      resetInterval();
    }, {passive: true});
  }

  /* --- Parallax hero effect (desktop only) --- */
  const heroBg = document.querySelector('.hero-bg img');
  const isTouch = () => window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024;
  if (heroBg && !isTouch()) {
    window.addEventListener('scroll', () => {
      if (isTouch()) return;
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

  /* --- Back to Top button --- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Sunset Tracker Dynamic Logic --- */
  let sunsetCache = null;
  let sunsetCacheDate = null;
  let usingRealApi = false;

  function getSantoriniSunsetTime(date) {
    // Latitude of Santorini: 36.4° N.
    // Approximate sunset hour using a simple sin wave based on day of the year.
    // In Santorini:
    // Summer Solstice (day 172): sunset is around 8:40 PM (20.66 hours decimal)
    // Winter Solstice (day 355): sunset is around 5:05 PM (17.08 hours decimal)
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Sine wave approximation matching Santorini sunset hours (with UTC+3 Summer / UTC+2 Winter offset auto-adjustment handled by standard local time representation)
    const amplitude = 1.79; // (20.66 - 17.08) / 2
    const mean = 18.87; // average sunset hour in local standard decimal hours
    // Phase shift so peak is at June 21 (approx day 172)
    const sunsetDecimal = mean + amplitude * Math.sin((2 * Math.PI * (dayOfYear - 80)) / 365);
    
    const hours = Math.floor(sunsetDecimal);
    const minutes = Math.floor((sunsetDecimal - hours) * 60);
    
    const sunsetDate = new Date(date);
    sunsetDate.setHours(hours, minutes, 0, 0);
    return sunsetDate;
  }

  function formatTimeHHMM(date) {
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12; // 12 instead of 0
    mins = mins < 10 ? '0' + mins : mins;
    return `${hrs}:${mins} ${ampm}`;
  }

  async function fetchRealSunsetTime(date) {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Check cache
    if (sunsetCache && sunsetCacheDate === dateStr) {
      return new Date(sunsetCache);
    }

    try {
      const response = await fetch(`https://api.sunrise-sunset.org/json?lat=36.4622&lng=25.3744&date=${dateStr}&formatted=0`);
      const data = await response.json();
      if (data.status === 'OK') {
        const sunsetTime = new Date(data.results.sunset);
        sunsetCache = sunsetTime.getTime();
        sunsetCacheDate = dateStr;
        usingRealApi = true;
        const apiSourceLabel = document.getElementById('api-source-status');
        if(apiSourceLabel) {
            apiSourceLabel.textContent = 'API Live';
            apiSourceLabel.parentElement.classList.add('api-connected');
            document.querySelector('.api-live-dot')?.classList.remove('loading');
        }
        return sunsetTime;
      }
    } catch (error) {
      console.warn("Failed to fetch real sunset time, falling back to approximation", error);
    }
    
    usingRealApi = false;
    const apiSourceLabel = document.getElementById('api-source-status');
    if(apiSourceLabel) {
        apiSourceLabel.textContent = 'Approximation Mode';
        apiSourceLabel.parentElement.classList.remove('api-connected');
        document.querySelector('.api-live-dot')?.classList.add('loading');
    }
    return getSantoriniSunsetTime(date);
  }

  let updateInterval;

  async function initSunsetTracker() {
    const timeHoursEl = document.getElementById('time-hours');
    if (!timeHoursEl) return; // Not on the sunset tracker page
    
    // Initial fetch to set up the times before interval starts
    await updateSunsetTracker();
    
    // Start interval
    updateInterval = setInterval(updateSunsetTracker, 1000);
  }


  async function updateSunsetTracker() {
    const timeHoursEl = document.getElementById('time-hours');
    const timeMinsEl = document.getElementById('time-mins');
    const timeSecsEl = document.getElementById('time-secs');
    const localTimeEl = document.getElementById('local-time');
    const sunsetTimeEl = document.getElementById('sunset-time');
    const magicHourRangeEl = document.getElementById('magic-hour-range');
    const sunsetStatusEl = document.getElementById('sunset-status');
    const countdownMessageEl = document.getElementById('countdown-message');
    const dialProgressEl = document.getElementById('dial-progress');
    const dialSunEl = document.getElementById('dial-sun');
    const magicHourBannerEl = document.getElementById('magic-hour-banner');

    if (!timeHoursEl) return; // Not on the sunset tracker page

    // Get current time in Santorini (represented by user's local timezone offset or adjusted to UTC+3 if wanted,
    // but default standard is local since visitor is browsing. Let's compute Santorini time exactly:
    // Santorini is in GMT+3 (EEST) during summer and GMT+2 (EET) during winter.
    const now = new Date();
    // Calculate UTC offset for Greece
    // Let's format and parse to Greece/Athens timezone:
    let greeceTimeStr = now.toLocaleString("en-US", {timeZone: "Europe/Athens"});
    const greeceTime = new Date(greeceTimeStr);

    const todaySunset = await fetchRealSunsetTime(greeceTime);
    const magicHourEnd = new Date(todaySunset.getTime() + 45 * 60 * 1000); // Magic Hour ends 45 mins after sunset

    // Update Local Time Display
    let secStr = greeceTime.getSeconds();
    let minStr = greeceTime.getMinutes();
    let hrStr = greeceTime.getHours();
    localTimeEl.textContent = `${hrStr < 10 ? '0' + hrStr : hrStr}:${minStr < 10 ? '0' + minStr : minStr}:${secStr < 10 ? '0' + secStr : secStr}`;

    // Update Sunset and Magic Hour Ranges
    if(sunsetTimeEl) sunsetTimeEl.textContent = formatTimeHHMM(todaySunset);
    const magicHourStart = new Date(todaySunset.getTime() - 15 * 60 * 1000); // starts 15 mins before
    if(magicHourRangeEl) magicHourRangeEl.textContent = `${formatTimeHHMM(magicHourStart)} - ${formatTimeHHMM(magicHourEnd)}`;

    // Time difference
    let diffMs = todaySunset.getTime() - greeceTime.getTime();

    // Check states:
    if (greeceTime >= magicHourStart && greeceTime <= magicHourEnd) {
      // Magic hour active state
      sunsetStatusEl.textContent = "Live: Magic Hour";
      sunsetStatusEl.className = "status-badge magic-hour";
      countdownMessageEl.textContent = "Golden Hour is currently painting the Santorini sky!";
      
      // Calculate how much time is left in magic hour
      let magicHourDiffMs = magicHourEnd.getTime() - greeceTime.getTime();
      const mins = Math.floor((magicHourDiffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((magicHourDiffMs % (1000 * 60)) / 1000);
      
      timeHoursEl.textContent = "00";
      timeMinsEl.textContent = mins < 10 ? '0' + mins : mins;
      timeSecsEl.textContent = secs < 10 ? '0' + secs : secs;
      
      countdownMessageEl.textContent = `Magic Hour ends in ${mins}m ${secs}s`;

      if (magicHourBannerEl) magicHourBannerEl.classList.add('active');

      // Position sun at the horizon (approx center right of dial)
      updateDialPosition(0.85); // sunset stage
    } else if (diffMs < 0) {
      // After sunset, show next day's countdown
      const tomorrow = new Date(greeceTime.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowSunset = await fetchRealSunsetTime(tomorrow);
      const tomorrowDiff = tomorrowSunset.getTime() - greeceTime.getTime();
      
      sunsetStatusEl.textContent = "After Sunset";
      sunsetStatusEl.className = "status-badge";
      countdownMessageEl.textContent = "Counting down to tomorrow's sunset...";
      if (magicHourBannerEl) magicHourBannerEl.classList.remove('active');

      const hours = Math.floor(tomorrowDiff / (1000 * 60 * 60));
      const mins = Math.floor((tomorrowDiff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((tomorrowDiff % (1000 * 60)) / 1000);

      timeHoursEl.textContent = hours < 10 ? '0' + hours : hours;
      timeMinsEl.textContent = mins < 10 ? '0' + mins : mins;
      timeSecsEl.textContent = secs < 10 ? '0' + secs : secs;

      updateDialPosition(1.0); // night stage
    } else {
      // Before sunset state
      if (diffMs <= 60 * 60 * 1000) {
        // Less than 1 hour to sunset
        sunsetStatusEl.textContent = "Sunset Approaching";
        sunsetStatusEl.className = "status-badge sunset-near";
      } else {
        sunsetStatusEl.textContent = "Daytime";
        sunsetStatusEl.className = "status-badge";
      }
      countdownMessageEl.textContent = "Until today's magical golden hour.";
      if (magicHourBannerEl) magicHourBannerEl.classList.remove('active');

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      timeHoursEl.textContent = hours < 10 ? '0' + hours : hours;
      timeMinsEl.textContent = mins < 10 ? '0' + mins : mins;
      timeSecsEl.textContent = secs < 10 ? '0' + secs : secs;

      // Map progress based on how far we are in the day (say from 12 PM standard opens to sunset)
      const dayStart = new Date(greeceTime);
      dayStart.setHours(12, 0, 0, 0); // 12 PM opening
      const totalDayMs = todaySunset.getTime() - dayStart.getTime();
      const currentElapsedMs = greeceTime.getTime() - dayStart.getTime();
      let progress = 0;
      if (currentElapsedMs > 0 && totalDayMs > 0) {
        progress = Math.min(currentElapsedMs / totalDayMs, 1.0);
      }
      updateDialPosition(progress);
    }
  }

  function updateDialPosition(progress) {
    const dialProgressEl = document.getElementById('dial-progress');
    const dialSunEl = document.getElementById('dial-sun');
    if (!dialProgressEl || !dialSunEl) return;

    // Stroke dasharray size is 251. Progress shifts offset from 251 (0% done) to 0 (100% done)
    const offset = 251 - (progress * 251);
    dialProgressEl.style.strokeDashoffset = offset;

    // Place sun on arc path (20, 90 to 180, 90 radius 80)
    // Angle goes from Math.PI (180 deg, left) to 0 (0 deg, right)
    const angle = Math.PI - (progress * Math.PI);
    const radius = 80;
    const cx = 100;
    const cy = 90;
    
    const sunX = cx + radius * Math.cos(angle);
    const sunY = cy - radius * Math.sin(angle);
    
    dialSunEl.setAttribute('cx', sunX);
    dialSunEl.setAttribute('cy', sunY);
  }

  // Run immediately & start dynamic loop
  initSunsetTracker();

  /* --- Menu jump nav scroll spy --- */
  const menuJumpNav = document.querySelector('.menu-jump-nav');
  if (menuJumpNav) {
    const jumpLinks = Array.from(menuJumpNav.querySelectorAll('.menu-jump-link'));
    const sections = jumpLinks
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const updateActiveLink = () => {
      const scrollPos = window.scrollY + 140;
      let active = null;
      sections.forEach(s => { if (s.offsetTop <= scrollPos) active = s; });
      jumpLinks.forEach(l => l.classList.remove('active'));
      if (active) {
        const link = menuJumpNav.querySelector(`[href="#${active.id}"]`);
        if (link) {
          link.classList.add('active');
          link.scrollIntoView({ inline: 'nearest', block: 'nearest' });
        }
      }
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

});


/* --- Dish Category Filter --- */
(function() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const dishCards = document.querySelectorAll('.dish-card[data-category]');
  const dishHero = document.querySelector('.dish-hero');
  const counter = document.querySelector('.dishes-count');

  if (!filterTabs.length || !dishCards.length) return;

  let heroTimeoutId = null;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Cancel active hero timeout
      if (heroTimeoutId) {
        clearTimeout(heroTimeoutId);
        heroTimeoutId = null;
      }

      // Show/hide hero dish (it's a starter)
      if (dishHero) {
        if (filter === 'all' || filter === 'starters') {
          dishHero.style.display = '';
          // force reflow
          dishHero.offsetHeight;
          dishHero.style.opacity = '1';
          dishHero.style.transform = 'translateY(0)';
        } else {
          dishHero.style.opacity = '0';
          dishHero.style.transform = 'translateY(-10px)';
          heroTimeoutId = setTimeout(() => {
            dishHero.style.display = 'none';
            heroTimeoutId = null;
          }, 350);
        }
      }

      // Filter dish cards with animation
      let visibleCount = 0;
      dishCards.forEach((card, i) => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (card.timeoutId) {
          clearTimeout(card.timeoutId);
          card.timeoutId = null;
        }

        if (shouldShow) {
          visibleCount++;
          card.classList.remove('hidden', 'fade-out');
          card.style.animationDelay = `${i * 0.06}s`;
        } else {
          card.classList.add('fade-out');
          card.timeoutId = setTimeout(() => {
            card.classList.add('hidden');
            card.timeoutId = null;
          }, 350);
        }
      });

      // Add hero to count if visible
      if (dishHero && (filter === 'all' || filter === 'starters')) {
        visibleCount++;
      }

      // Update counter
      if (counter) {
        counter.textContent = visibleCount;
      }
    });
  });
})();
