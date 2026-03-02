// ============================================
// Kendal Gerrard - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
    });
  }

  // Lightbox for gallery
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentIndex = 0;

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(function(item, index) {
      item.addEventListener('click', function() {
        currentIndex = index;
        lightboxImg.src = this.src;
        lightboxImg.alt = this.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    lightboxPrev.addEventListener('click', function(e) {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      lightboxImg.src = galleryItems[currentIndex].src;
      lightboxImg.alt = galleryItems[currentIndex].alt;
    });

    lightboxNext.addEventListener('click', function(e) {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryItems.length;
      lightboxImg.src = galleryItems[currentIndex].src;
      lightboxImg.alt = galleryItems[currentIndex].alt;
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev.click();
      if (e.key === 'ArrowRight') lightboxNext.click();
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }


});
