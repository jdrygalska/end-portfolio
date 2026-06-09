// Mark that JavaScript is running, so reveal animations can safely start
document.body.classList.add('js-loaded');

// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('.main-nav a, .logo, .btn[href^="#"], .project-card a[href^="#"]');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      event.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Animated cursor glow
let cursorGlow = document.querySelector('.cursor-glow');

if (!cursorGlow) {
  cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);
}

window.addEventListener('mousemove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

// Reveal elements while scrolling
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.16
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add('visible');
  });
}

window.addEventListener('load', () => {
  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (rect.top < window.innerHeight) {
      element.classList.add('visible');
    }
  });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const menuLinks = document.querySelectorAll('.main-nav a');

function updateActiveLink() {
  const scrollPosition = window.scrollY + 180;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const matchingLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`);

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      menuLinks.forEach((link) => link.classList.remove('active'));

      if (matchingLink) {
        matchingLink.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);
updateActiveLink();

// Subtle movement for hero decorative elements
const floatingElements = document.querySelectorAll('.orbit, .floating-card');

window.addEventListener('scroll', () => {
  const scrollValue = window.scrollY;

  floatingElements.forEach((element, index) => {
    const speed = 0.04 + index * 0.015;
    element.style.translate = `0 ${scrollValue * speed}px`;
  });
});

// Button hover state
const contactButtons = document.querySelectorAll('.btn');

contactButtons.forEach((button) => {
  button.addEventListener('mouseenter', () => {
    button.classList.add('is-hovered');
  });

  button.addEventListener('mouseleave', () => {
    button.classList.remove('is-hovered');
  });
});

// Temporary disabled CV download button
const disabledCvDownload = document.querySelector('.cv-download[aria-disabled="true"]');

if (disabledCvDownload) {
  disabledCvDownload.addEventListener('click', (event) => {
    event.preventDefault();
  });
}

// Current year in footer
const yearElement = document.querySelector('[data-year]');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Project image / PDF preview modal
const imageModal = document.querySelector('[data-image-modal]');
const imageModalImg = document.querySelector('[data-image-modal-img]');
const imageModalFrame = document.querySelector('[data-image-modal-frame]');
const imageModalClose = document.querySelector('[data-image-modal-close]');

function openImageModal(previewSrc, previewType = 'image') {
  if (!imageModal || !imageModalImg || !imageModalFrame || !previewSrc) return;

  imageModal.classList.add('is-open');
  imageModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (previewType === 'pdf') {
    imageModal.classList.add('has-frame');
    imageModalImg.src = '';
    imageModalFrame.src = `${previewSrc}#toolbar=0&navpanes=0&scrollbar=1`;
    return;
  }

  imageModal.classList.remove('has-frame');
  imageModalFrame.src = '';
  imageModalImg.src = previewSrc;
}

function closeImageModal() {
  if (!imageModal || !imageModalImg || !imageModalFrame) return;

  imageModal.classList.remove('is-open');
  imageModal.classList.remove('has-frame');
  imageModal.setAttribute('aria-hidden', 'true');
  imageModalImg.src = '';
  imageModalFrame.src = '';
  document.body.style.overflow = '';
}

// Handle project previews with event delegation, including image and PDF previews.
document.addEventListener('click', (event) => {
  const previewButton = event.target.closest('[data-full-image]');

  if (!previewButton) return;

  event.preventDefault();
  openImageModal(previewButton.dataset.fullImage, previewButton.dataset.fullType || 'image');
});

if (imageModalClose) {
  imageModalClose.addEventListener('click', closeImageModal);
}

if (imageModal) {
  imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
      closeImageModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeImageModal();
  }
});
