/**
 * Lazy Load Images
 * Uses Intersection Observer for optimal performance
 */

(function() {
  'use strict';
  
  // Check for Intersection Observer support
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
    return;
  }
  
  // Intersection Observer configuration
  const config = {
    rootMargin: '50px 0px',
    threshold: 0.01
  };
  
  // Callback function
  const onIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        // Load srcset if available
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        // Stop observing this image
        observer.unobserve(img);
        
        // Add loaded class for CSS animations
        img.classList.add('loaded');
      }
    });
  };
  
  // Create observer
  const observer = new IntersectionObserver(onIntersection, config);
  
  // Observe all lazy images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => observer.observe(img));
  
  /**
   * Lazy Load Iframes (YouTube, etc.)
   */
  const lazyIframes = document.querySelectorAll('iframe[data-src]');
  
  if (lazyIframes.length > 0) {
    const iframeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
          observer.unobserve(iframe);
        }
      });
    }, config);
    
    lazyIframes.forEach(iframe => iframeObserver.observe(iframe));
  }
  
})();

/**
 * Lazy Load Background Images
 */
(function() {
  'use strict';
  
  const lazyBackgrounds = document.querySelectorAll('[data-bg]');
  
  if (lazyBackgrounds.length === 0) return;
  
  if ('IntersectionObserver' in window) {
    const bgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.style.backgroundImage = `url(${element.dataset.bg})`;
          element.removeAttribute('data-bg');
          observer.unobserve(element);
        }
      });
    });
    
    lazyBackgrounds.forEach(bg => bgObserver.observe(bg));
  } else {
    // Fallback
    lazyBackgrounds.forEach(element => {
      element.style.backgroundImage = `url(${element.dataset.bg})`;
      element.removeAttribute('data-bg');
    });
  }
})();
