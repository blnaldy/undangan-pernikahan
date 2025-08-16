// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// DOM Elements
const openInvitationBtn = document.getElementById('openInvitation');
const heroSection = document.getElementById('hero');
const mainContent = document.getElementById('mainContent');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const giftModal = document.getElementById('giftModal');
const openGiftBtn = document.getElementById('openGift');
const closeModal = document.querySelector('.close');
const rsvpForm = document.getElementById('rsvpForm');

// Share buttons
const shareWhatsApp = document.getElementById('shareWhatsApp');
const shareFacebook = document.getElementById('shareFacebook');
const shareTwitter = document.getElementById('shareTwitter');
const copyLinkBtn = document.getElementById('copyLink');

// Wedding date - 31 Agustus 2025
const weddingDate = new Date('2025-08-31T08:00:00').getTime();

// Performance optimization - Intersection Observer for lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    }
  });
});

// Open invitation functionality
openInvitationBtn.addEventListener('click', function() {
  // Hide hero section with animation
  heroSection.style.transition = 'opacity 0.5s ease';
  heroSection.style.opacity = '0';
  
  setTimeout(() => {
    heroSection.style.display = 'none';
    
    // Show main content
    mainContent.classList.remove('hidden');
    
    // Play background music
    playBackgroundMusic();
    
    // Scroll to top of main content
    window.scrollTo(0, 0);
    
    // Re-initialize AOS for new content
    AOS.refresh();
    
    // Track invitation opening
    trackEvent('invitation_opened');
  }, 500);
});

// Background music control with error handling
function playBackgroundMusic() {
  // Only load music when needed
  backgroundMusic.load();
  
  const playPromise = backgroundMusic.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      console.log('Music started playing');
      document.querySelector('.music-control').style.display = 'block';
    }).catch(error => {
      console.log('Auto-play was prevented:', error);
      // Show music control button if auto-play fails
      document.querySelector('.music-control').style.display = 'block';
      musicToggle.classList.add('paused');
      musicToggle.innerHTML = '<i class="fas fa-play"></i>';
    });
  }
}

// Music toggle functionality with improved UX
musicToggle.addEventListener('click', function() {
  if (backgroundMusic.paused) {
    const playPromise = backgroundMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        musicToggle.classList.remove('paused');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        showNotification('Musik diputar');
      }).catch(error => {
        console.error('Error playing music:', error);
        showNotification('Gagal memutar musik');
      });
    }
  } else {
    backgroundMusic.pause();
    musicToggle.classList.add('paused');
    musicToggle.innerHTML = '<i class="fas fa-play"></i>';
    showNotification('Musik dijeda');
  }
});

// Enhanced countdown timer with better formatting
function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;
  
  if (distance > 0) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Animate number changes
    animateNumber('days', days);
    animateNumber('hours', hours);
    animateNumber('minutes', minutes);
    animateNumber('seconds', seconds);
  } else {
    // Wedding day has arrived
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    
    // Show special message
    const countdownSection = document.querySelector('.countdown-section .section-title h2');
    countdownSection.textContent = 'Hari Bahagia Telah Tiba!';
    
    // Add celebration effect
    if (typeof jQuery !== 'undefined' && jQuery.fn.firefly) {
      jQuery('body').firefly({
        color: '#FFD700',
        width: 10,
        height: 10,
        speed: 2000,
        total: 20
      });
    }
  }
}

// Animate number changes in countdown
function animateNumber(elementId, newValue) {
  const element = document.getElementById(elementId);
  const currentValue = parseInt(element.textContent);
  const formattedValue = newValue.toString().padStart(2, '0');
  
  if (currentValue !== newValue) {
    element.style.transform = 'scale(1.1)';
    element.textContent = formattedValue;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 200);
  }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Enhanced gift modal functionality
openGiftBtn.addEventListener('click', function() {
  giftModal.style.display = 'block';
  giftModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus management for accessibility
  const closeButton = giftModal.querySelector('.close');
  closeButton.focus();
  
  trackEvent('gift_modal_opened');
});

closeModal.addEventListener('click', function() {
  closeGiftModal();
});

function closeGiftModal() {
  giftModal.style.display = 'none';
  giftModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
  
  // Return focus to the button that opened the modal
  openGiftBtn.focus();
}

// Close modal when clicking outside or pressing Escape
window.addEventListener('click', function(event) {
  if (event.target === giftModal) {
    closeGiftModal();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && giftModal.style.display === 'block') {
    closeGiftModal();
  }
});

// Enhanced copy bank info functionality
function copyBankInfo() {
  const bankInfo = "Bank BCA\n1234567890\na.n. Ichas Asha Syahroni";
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(bankInfo).then(function() {
      showNotification('Nomor rekening berhasil disalin!', 'success');
      trackEvent('bank_info_copied');
    }).catch(function(err) {
      console.error('Failed to copy: ', err);
      fallbackCopyTextToClipboard(bankInfo);
    });
  } else {
    fallbackCopyTextToClipboard(bankInfo);
  }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification('Nomor rekening berhasil disalin!', 'success');
      trackEvent('bank_info_copied_fallback');
    } else {
      showNotification('Gagal menyalin nomor rekening', 'error');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    showNotification('Gagal menyalin nomor rekening', 'error');
  }
  
  document.body.removeChild(textArea);
}

// Enhanced RSVP form submission with validation
rsvpForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Show loading state
  const submitBtn = rsvpForm.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  submitBtn.disabled = true;
  
  const formData = new FormData(rsvpForm);
  const guestName = formData.get('guestName').trim();
  const guestCount = formData.get('guestCount');
  const attendance = formData.get('attendance');
  const message = formData.get('message').trim();
  
  // Validate required fields
  if (!guestName || !guestCount || !attendance) {
    showNotification('Mohon lengkapi semua field yang wajib diisi!', 'error');
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    return;
  }
  
  // Simulate form submission (replace with actual backend integration)
  setTimeout(() => {
    const rsvpData = {
      name: guestName,
      count: guestCount,
      attendance: attendance,
      message: message,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for demo purposes
    const existingRSVPs = JSON.parse(localStorage.getItem('wedding-rsvps') || '[]');
    existingRSVPs.push(rsvpData);
    localStorage.setItem('wedding-rsvps', JSON.stringify(existingRSVPs));
    
    console.log('RSVP Data:', rsvpData);
    
    // Show success message
    showNotification('Terima kasih! Konfirmasi kehadiran Anda telah diterima.', 'success');
    
    // Reset form
    rsvpForm.reset();
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Track event
    trackEvent('rsvp_submitted', { attendance: attendance });
  }, 1500);
});

// Enhanced share functionality with better error handling
shareWhatsApp.addEventListener('click', function() {
  const message = `Assalamu'alaikum! 🌸\n\nAnda diundang ke pernikahan:\n\n💕 Ichas Asha Syahroni & Diva Tiara 💕\n\n📅 Minggu, 31 Agustus 2025\n⏰ 08:00 WIB\n📍 Masjid Al-Ikhlas\n\nLihat undangan lengkap di: ${window.location.href}\n\nBarakallahu fiikum! 🤲`;
  
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  
  if (window.innerWidth <= 768) {
    // Mobile - open WhatsApp app
    window.location.href = whatsappUrl;
  } else {
    // Desktop - open in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
  
  trackEvent('share_whatsapp');
});

shareFacebook.addEventListener('click', function() {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  trackEvent('share_facebook');
});

shareTwitter.addEventListener('click', function() {
  const tweetText = `Anda diundang ke pernikahan Ichas & Diva! 💕 31 Agustus 2025`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  trackEvent('share_twitter');
});

copyLinkBtn.addEventListener('click', function() {
  const currentUrl = window.location.href;
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(currentUrl).then(function() {
      showNotification('Link undangan berhasil disalin!', 'success');
      trackEvent('link_copied');
    }).catch(function(err) {
      console.error('Failed to copy: ', err);
      fallbackCopyTextToClipboard(currentUrl);
    });
  } else {
    fallbackCopyTextToClipboard(currentUrl);
  }
});

// Enhanced smooth scrolling for navigation
document.querySelectorAll('.nav-item').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update URL without triggering page reload
      history.pushState(null, null, targetId);
      
      trackEvent('navigation_click', { section: targetId });
    }
  });
});

// Enhanced gallery lightbox with keyboard navigation
document.querySelectorAll('.gallery-item img').forEach(function(img, index) {
  img.addEventListener('click', function() {
    createLightbox(this.src, this.alt, index);
  });
});

function createLightbox(src, alt, index) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-label', 'Galeri foto');
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close" aria-label="Tutup galeri">&times;</span>
      <img src="${src}" alt="${alt}" tabindex="0">
      <div class="lightbox-nav">
        <button class="lightbox-prev" aria-label="Foto sebelumnya">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="lightbox-next" aria-label="Foto selanjutnya">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="lightbox-counter">
        ${index + 1} / ${document.querySelectorAll('.gallery-item img').length}
      </div>
    </div>
  `;
  
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    animation: fadeIn 0.3s ease;
  `;
  
  const content = lightbox.querySelector('.lightbox-content');
  content.style.cssText = `
    position: relative;
    max-width: 90%;
    max-height: 90%;
    text-align: center;
  `;
  
  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    color: white;
    font-size: 30px;
    cursor: pointer;
    z-index: 3001;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const lightboxImg = lightbox.querySelector('img');
  lightboxImg.style.cssText = `
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  `;
  
  // Navigation buttons
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  [prevBtn, nextBtn].forEach(btn => {
    btn.style.cssText = `
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      padding: 15px;
      cursor: pointer;
      font-size: 18px;
      border-radius: 50%;
    `;
  });
  
  prevBtn.style.left = '20px';
  nextBtn.style.right = '20px';
  
  // Counter
  const counter = lightbox.querySelector('.lightbox-counter');
  counter.style.cssText = `
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    background: rgba(0,0,0,0.5);
    padding: 5px 15px;
    border-radius: 15px;
  `;
  
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';
  
  // Focus management
  closeBtn.focus();
  
  // Close lightbox function
  function closeLightbox() {
    document.body.removeChild(lightbox);
    document.body.style.overflow = 'auto';
  }
  
  // Event listeners
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', function handleKeyPress(e) {
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        document.removeEventListener('keydown', handleKeyPress);
        break;
      case 'ArrowLeft':
        // Navigate to previous image
        break;
      case 'ArrowRight':
        // Navigate to next image
        break;
    }
  });
  
  trackEvent('gallery_image_viewed', { index: index });
}

// Enhanced notification system with types
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  
  // Icon based on type
  let icon = 'fas fa-info-circle';
  let bgColor = 'linear-gradient(135deg, var(--rose), var(--peach))';
  
  switch(type) {
    case 'success':
      icon = 'fas fa-check-circle';
      bgColor = 'linear-gradient(135deg, #28a745, #20c997)';
      break;
    case 'error':
      icon = 'fas fa-exclamation-circle';
      bgColor = 'linear-gradient(135deg, #dc3545, #fd7e14)';
      break;
    case 'warning':
      icon = 'fas fa-exclamation-triangle';
      bgColor = 'linear-gradient(135deg, #ffc107, #fd7e14)';
      break;
  }
  
  notification.innerHTML = `
    <i class="${icon}"></i>
    <span>${message}</span>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    z-index: 4000;
    animation: slideInRight 0.3s ease;
    font-weight: 500;
    max-width: 300px;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(function() {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(function() {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 4000);
}

// Enhanced parallax effect with performance optimization
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.hero-section');
  
  if (parallax && scrolled < window.innerHeight) {
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
  }
  
  ticking = false;
}

window.addEventListener('scroll', function() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// Enhanced active navigation highlighting
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-item');
  
  let current = '';
  
  sections.forEach(function(section) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navItems.forEach(function(item) {
    item.classList.remove('active');
    if (item.getAttribute('href') === '#' + current) {
      item.classList.add('active');
    }
  });
});

// Performance monitoring
function trackEvent(eventName, eventData = {}) {
  // Simple event tracking - replace with your analytics service
  console.log('Event:', eventName, eventData);
  
  // Example: Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
}

// Preload critical images
function preloadImages() {
  const imageUrls = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  ];
  
  imageUrls.forEach(function(url) {
    const img = new Image();
    img.src = url;
  });
}

// Initialize preloading
preloadImages();

// Enhanced loading animation
document.addEventListener('DOMContentLoaded', function() {
  // Fade in body
  document.body.style.opacity = '0';
  setTimeout(function() {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  // Initialize lazy loading for images
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
});

// Enhanced window resize handling
let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    // Refresh AOS on resize
    AOS.refresh();
    
    // Adjust floating navigation for mobile
    const floatingNav = document.querySelector('.floating-nav');
    if (window.innerWidth <= 768) {
      floatingNav.style.right = '15px';
    } else {
      floatingNav.style.right = '30px';
    }
    
    trackEvent('window_resized', { 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
  }, 250);
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Enhanced accessibility features
document.addEventListener('keydown', function(e) {
  // Skip to main content with Tab key
  if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
    const mainContent = document.getElementById('mainContent');
    if (mainContent && !mainContent.classList.contains('hidden')) {
      const firstFocusable = mainContent.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }
});

// Add focus indicators for keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

// Add styles for keyboard navigation
const keyboardNavStyle = document.createElement('style');
keyboardNavStyle.textContent = `
  .keyboard-navigation *:focus {
    outline: 2px solid var(--rose) !important;
    outline-offset: 2px !important;
  }
`;
document.head.appendChild(keyboardNavStyle);

console.log('Wedding invitation website loaded successfully! 💕');
