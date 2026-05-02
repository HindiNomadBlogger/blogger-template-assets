/**
 * Main JavaScript for High-Performance Blogger Template
 */

(function() {
  'use strict';
  
  /**
   * Smooth Scroll for Anchor Links
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  /**
   * External Links - Open in New Tab
   */
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (link.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  /**
   * Copy Code Block
   */
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(block => {
    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.textContent = 'Copy';
    button.style.cssText = 'position:absolute;top:8px;right:8px;padding:4px 8px;background:#0066cc;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;';
    
    // Wrap pre in relative container
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(button);
    
    // Copy functionality
    button.addEventListener('click', () => {
      const code = block.textContent;
      navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      });
    });
  });
  
  /**
   * Reading Progress Bar
   */
  if (document.querySelector('.single-post')) {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = 'position:fixed;top:0;left:0;width:0;height:3px;background:#0066cc;z-index:100;transition:width 0.1s;';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }
  
  /**
   * Table of Contents Generator (for single posts)
   */
  if (document.querySelector('.single-post')) {
    const postBody = document.querySelector('.post-body');
    const headings = postBody.querySelectorAll('h2, h3');
    
    if (headings.length > 2) {
      const toc = document.createElement('div');
      toc.className = 'table-of-contents';
      toc.innerHTML = '<h3>Table of Contents</h3><ul></ul>';
      toc.style.cssText = 'background:#f9f9f9;padding:1.5rem;border-left:4px solid #0066cc;margin:2rem 0;border-radius:4px;';
      
      const tocList = toc.querySelector('ul');
      tocList.style.cssText = 'list-style:none;padding:0;margin:0;';
      
      headings.forEach((heading, index) => {
        // Add ID to heading
        const id = 'heading-' + index;
        heading.id = id;
        
        // Create TOC item
        const li = document.createElement('li');
        li.style.cssText = 'margin-bottom:0.5rem;padding-left:' + (heading.tagName === 'H3' ? '1rem' : '0') + ';';
        
        const a = document.createElement('a');
        a.href = '#' + id;
        a.textContent = heading.textContent;
        a.style.cssText = 'color:#333;text-decoration:none;';
        
        li.appendChild(a);
        tocList.appendChild(li);
      });
      
      // Insert TOC after first paragraph
      const firstPara = postBody.querySelector('p');
      if (firstPara) {
        firstPara.after(toc);
      }
    }
  }
  
  /**
   * Search Functionality Enhancement
   */
  const searchForm = document.querySelector('form[action="/search"]');
  if (searchForm) {
    const searchInput = searchForm.querySelector('input[name="q"]');
    
    // Add autocomplete off
    searchInput.setAttribute('autocomplete', 'off');
    
    // Add search suggestions (optional - requires custom implementation)
    // This is a placeholder for future enhancement
  }
  
  /**
   * Responsive Table Wrapper
   */
  document.querySelectorAll('.post-body table').forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    wrapper.style.cssText = 'overflow-x:auto;margin:1.5rem 0;';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
  
  /**
   * Image Click to Enlarge
   */
  document.querySelectorAll('.post-body img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:1000;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
      
      const modalImg = document.createElement('img');
      modalImg.src = this.src;
      modalImg.style.cssText = 'max-width:90%;max-height:90%;';
      
      modal.appendChild(modalImg);
      document.body.appendChild(modal);
      
      modal.addEventListener('click', () => {
        modal.remove();
      });
    });
  });
  
  /**
   * Lazy Load Comments (already implemented in template)
   * Additional enhancement for tracking
   */
  window.loadComments = function() {
    const placeholder = document.getElementById('comments-placeholder');
    if (placeholder) {
      // Track comment load
      if (typeof gtag !== 'undefined') {
        gtag('event', 'load_comments', {
          'event_category': 'engagement',
          'event_label': window.location.pathname
        });
      }
      
      // Load Blogger comments widget
      placeholder.innerHTML = '<div class="comments" id="comments"></div>';
      
      // This will be handled by Blogger's comment system
      // The actual implementation depends on your blog's comment settings
    }
  };
  
  /**
   * Performance Monitoring (optional)
   */
  if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        // Log to console (remove in production)
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        
        // Send to analytics if needed
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            'event_category': 'Web Vitals',
            'event_label': 'LCP',
            'value': Math.round(lastEntry.renderTime || lastEntry.loadTime),
            'non_interaction': true
          });
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Observer not supported
    }
  }
  
  /**
   * Service Worker Registration (optional)
   * Uncomment if you create a service worker
   */
  /*
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered:', registration))
        .catch(error => console.log('SW registration failed:', error));
    });
  }
  */
  
})();

/**
 * Debounce Helper Function
 */
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

/**
 * Throttle Helper Function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
