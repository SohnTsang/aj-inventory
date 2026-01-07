// Services Premium JavaScript - Interactive Elements and Animations

(function() {
  'use strict';

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initAnimations();
    initStickyNav();
    initParallax();
    initSmoothScroll();
    initServiceObservers();
  }

  // Animation on scroll
  function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, delay);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  }

  // Sticky navigation with active states
  function initStickyNav() {
    const nav = document.querySelector('.services-nav-section');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.service-section');
    
    if (!nav || !navItems.length) return;

    // Track scroll for nav shadow
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });

    // Update active nav item based on scroll position
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach(item => {
            if (item.getAttribute('href') === `#${id}`) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -50% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Parallax effect
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (!parallaxElements.length) return;

    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = el.dataset.parallaxSpeed || 0.5;
        const yPos = -(scrolled * speed);
        
        if (el.dataset.parallaxBg) {
          el.style.transform = `translateY(${yPos}px)`;
        }
      });
      
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick);
  }

  // Smooth scroll for navigation links
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if just "#" or empty
        if (!href || href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 60;
        const navHeight = document.querySelector('.services-nav-section')?.offsetHeight || 0;
        const offset = headerHeight + navHeight + 20;
        
        const targetPosition = target.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // Service section interactions
  function initServiceObservers() {
    // Count up animation for statistics
    const statNumbers = document.querySelectorAll('.stat-large, .metric-value, .showcase-number');
    
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const endValue = parseInt(el.innerText.replace(/[^0-9]/g, ''));
          const duration = 2000;
          const step = Math.ceil(endValue / (duration / 16));
          let current = 0;
          
          const counter = setInterval(() => {
            current += step;
            if (current >= endValue) {
              current = endValue;
              clearInterval(counter);
            }
            
            // Preserve original format
            const originalText = el.innerText;
            const hasPlus = originalText.includes('+');
            const hasK = originalText.includes('K');
            
            let displayValue = current.toString();
            if (hasK) displayValue = (current / 1000).toFixed(0) + 'K';
            if (hasPlus) displayValue += '+';
            
            el.innerText = displayValue;
          }, 16);
          
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => countObserver.observe(num));

    // Hover effects for media containers
    const mediaContainers = document.querySelectorAll('.media-container');
    
    mediaContainers.forEach(container => {
      container.addEventListener('mouseenter', () => {
        const image = container.querySelector('.service-image');
        if (image) {
          image.style.transform = 'scale(1.05)';
        }
      });
      
      container.addEventListener('mouseleave', () => {
        const image = container.querySelector('.service-image');
        if (image) {
          image.style.transform = 'scale(1)';
        }
      });
    });

    // Network animation for investment section
    const networkNodes = document.querySelectorAll('.network-node');
    
    networkNodes.forEach((node, index) => {
      node.style.animationDelay = `${index * 0.2}s`;
      node.style.animation = 'pulse-node 3s ease-in-out infinite';
    });
  }

  // Add CSS for dynamic animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-node {
      0%, 100% { 
        transform: scale(1);
        opacity: 1;
      }
      50% { 
        transform: scale(1.5);
        opacity: 0.7;
      }
    }
    
    .services-nav-section.scrolled {
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    
    .nav-item.active {
      color: var(--service-primary);
      background: linear-gradient(180deg, white 0%, var(--service-light) 100%);
    }
    
    .nav-item.active .nav-progress {
      width: 100%;
    }
  `;
  document.head.appendChild(style);

})();

function handleMobileNav() {
  const navSection = document.querySelector('.services-nav-section');
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    navSection.style.position = 'relative';
    navSection.style.top = '0';
  } else {
    navSection.style.position = 'sticky';
    navSection.style.top = '60px';
  }
}

// Call on load and resize
handleMobileNav();
window.addEventListener('resize', debounce(handleMobileNav, 250));

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}