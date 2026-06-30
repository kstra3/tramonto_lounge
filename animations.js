/* ===================================
   TRAMONTO LOUNGE - Scroll Animations
   Intersection Observer & Stagger FX
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* Check for reduced motion preference */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // Skip all animations

  /* --- Fade-in on scroll (single elements) --- */
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  /* --- Stagger animation for grid items --- */
  const staggerContainers = document.querySelectorAll(
    '.highlights-grid, .dishes-grid, .menu-items-grid, .gallery-grid, .insta-grid, .reviews-grid'
  );

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.stagger-item, .gallery-item, .fade-in');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, index * 100); // 100ms stagger delay
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  staggerContainers.forEach(container => staggerObserver.observe(container));

  /* --- Menu section fade-in (menu.html) --- */
  const menuSections = document.querySelectorAll('.menu-section');
  const menuObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger the menu items within
        const items = entry.target.querySelectorAll('.stagger-item');
        items.forEach((item, index) => {
          setTimeout(() => item.classList.add('visible'), index * 60);
        });
        menuObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  menuSections.forEach(section => menuObserver.observe(section));

  /* --- Counter / number animation for stats (future use) --- */
  function animateValue(el, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      el.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  /* --- Smooth reveal for atmosphere section --- */
  const atmosphere = document.querySelector('.atmosphere');
  if (atmosphere) {
    const atmObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const content = entry.target.querySelector('.atmosphere-content');
          if (content) content.classList.add('visible');
          atmObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    atmObserver.observe(atmosphere);
  }

  /* --- Custom Cursor --- */
  if (!window.matchMedia('(pointer: coarse)').matches && !prefersReducedMotion) {
    const cursorDiv = document.createElement('div');
    cursorDiv.classList.add('custom-cursor');
    document.body.appendChild(cursorDiv);

    const followerDiv = document.createElement('div');
    followerDiv.classList.add('custom-cursor-follower');
    document.body.appendChild(followerDiv);

    document.body.classList.add('custom-cursor-enabled');

    let mouseX = -200;
    let mouseY = -200;
    let followerX = mouseX;
    let followerY = mouseY;
    let cursorReady = false;

    cursorDiv.style.opacity = '0';
    followerDiv.style.opacity = '0';

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDiv.style.left = mouseX + 'px';
      cursorDiv.style.top = mouseY + 'px';
      if (!cursorReady) {
        cursorReady = true;
        cursorDiv.style.opacity = '1';
        followerDiv.style.opacity = '1';
      }
    });

    // Smooth follow logic for the ring
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      followerDiv.style.left = followerX + 'px';
      followerDiv.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Attach hover effects dynamically for any interactive element
    const attachHover = () => {
      const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .gallery-item, .dish-card');
      hoverElements.forEach(el => {
        if(!el.dataset.cursorAttached) {
          el.addEventListener('mouseenter', () => followerDiv.classList.add('hover-active'));
          el.addEventListener('mouseleave', () => followerDiv.classList.remove('hover-active'));
          el.dataset.cursorAttached = 'true';
        }
      });
    };
    
    attachHover();
    // Re-attach in case of dynamic content (like a lightbox)
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });
  }

});
