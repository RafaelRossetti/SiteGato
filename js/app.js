/**
 * ============================================================================
 * CODEX FELIS: INTERATIVIDADE RENASCENTISTA (JS VANILLA MODULAR)
 * Funcionalidades: Carrossel Hero, Lightbox de Anatomia, Métricas Animadas,
 * Modais d'Adozione e Compartilhamento com Toast.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initMetricsAnimation();
  initGalleryLightbox();
  initModals();
  initSocialSharing();
  initNavigationScroll();
});

/* ==========================================================================
   1. CARROSSEL HERO DO GATO VITRUVIANO
   ========================================================================== */
function initHeroCarousel() {
  const track = document.getElementById('heroCarouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('heroCarouselPrev');
  const nextBtn = document.getElementById('heroCarouselNext');
  const dots = document.querySelectorAll('.hero-dot');
  
  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
      dot.setAttribute('aria-selected', idx === currentIndex ? 'true' : 'false');
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(nextSlide, 6500);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  // Event Listeners dos botões
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoSlide();
    });
  });

  // Pausa ao passar o mouse
  const viewport = document.querySelector('.carousel-viewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', stopAutoSlide);
    viewport.addEventListener('mouseleave', startAutoSlide);

    // Suporte a swipe no mobile
    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoSlide();
    }, { passive: true });
  }

  startAutoSlide();
}

/* ==========================================================================
   2. ANIMAÇÃO DE MÉTRICAS & BARRA DE 100%
   ========================================================================== */
function initMetricsAnimation() {
  const metricsSection = document.querySelector('.metrics-card');
  const progressBar = document.getElementById('progressBarFill');
  const likesCounter = document.getElementById('likesCount');
  const sharesCounter = document.getElementById('sharesCount');

  if (!metricsSection) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateNumber(likesCounter, 0, 10000, 1800, '+');
        animateNumber(sharesCounter, 0, 2500, 1800, '+');
        if (progressBar) {
          progressBar.style.width = '0%';
          setTimeout(() => {
            progressBar.style.width = '100%';
          }, 100);
        }
      }
    });
  }, { threshold: 0.25 });

  observer.observe(metricsSection);

  function animateNumber(element, start, end, duration, prefix = '') {
    if (!element) return;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing suave (easeOutCubic)
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(start + (end - start) * ease);

      // Formatação com ponto para milhares
      element.textContent = `${prefix}${currentVal.toLocaleString('pt-BR')}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = `${prefix}${end.toLocaleString('pt-BR')}`;
      }
    }

    requestAnimationFrame(update);
  }
}

/* ==========================================================================
   3. LIGHTBOX DE ANATOMIA & ESTUDOS DA GALERIA
   ========================================================================== */
const galleryData = [
  {
    title: "Studio dell'Occhio Curiosissimo",
    subtitle: "Estudo Óptico da Visão Felina e Convergência de Linhas de Atenção",
    desc: "Leonardo observou que as pupilas e o olhar do pequeno herói possuem uma geometria precisa capaz de cativar instantaneamente qualquer observador.",
    src: "assets/images/gallery-gaze-study.jpg"
  },
  {
    title: "Meccanismo dell'Artiglio & Tendini",
    subtitle: "Tratado Mecânico dos Tendões Retráteis e Alavancas",
    desc: "A precisão mecânica das patinhas em miniatura. As garras retráteis funcionam através de um engenhoso sistema de tendões flexores de rara perfeição anatômica.",
    src: "assets/images/gallery-paw-study.jpg"
  },
  {
    title: "Del Moto d'i Gatti & Traiettoria",
    subtitle: "Estudo Cinemático dos Arcos de Salto e Equilíbrio da Coluna",
    desc: "Análise dinâmica do salto gracioso do filhote. O centro de gravidade flexiona em harmonia com a coluna vertebral mesmo com apenas poucas semanas de vida.",
    src: "assets/images/gallery-motion-study.jpg"
  },
  {
    title: "Anatomia della Risonanza del Purring",
    subtitle: "Onda Acústica da Laringe e Vibração do Coração de 25-150 Hz",
    desc: "A vibração medicinal do ronrom do pequeno herói. Uma frequência natural de puro afeto e amor que desacelera o coração de quem o acolhe.",
    src: "assets/images/gallery-purr-study.jpg"
  }
];

function initGalleryLightbox() {
  const thumbItems = document.querySelectorAll('.gallery-thumb-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxSub = document.getElementById('lightboxSubtitle');
  const lightboxDesc = document.getElementById('lightboxDesc');

  if (!lightboxModal) return;

  thumbItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const data = galleryData[index];
      if (data) {
        lightboxImg.src = data.src;
        lightboxImg.alt = data.title;
        lightboxTitle.textContent = data.title;
        lightboxSub.textContent = data.subtitle;
        lightboxDesc.textContent = data.desc;
        openModal(lightboxModal);
      }
    });
  });
}

/* ==========================================================================
   4. SISTEMA MODULAR DE MODAIS (ADOÇÃO, HISTÓRIA & APOIO)
   ========================================================================== */
function initModals() {
  // Botões de Abertura
  const openAdoptBtns = document.querySelectorAll('[data-open-modal="adoptModal"]');
  const openStoryBtns = document.querySelectorAll('[data-open-modal="storyModal"]');
  const openHelpBtns = document.querySelectorAll('[data-open-modal="helpModal"]');

  const adoptModal = document.getElementById('adoptModal');
  const storyModal = document.getElementById('storyModal');
  const helpModal = document.getElementById('helpModal');

  openAdoptBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(adoptModal);
  }));

  openStoryBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(storyModal);
  }));

  openHelpBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(helpModal);
  }));

  // Botões de Fechar genéricos
  const closeBtns = document.querySelectorAll('.modal-close-btn, [data-close-modal]');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  // Fechar clicando no fundo escuro
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal-backdrop.is-open');
      if (openModalEl) closeModal(openModalEl);
    }
  });

  // Formulário de Adoção
  const adoptForm = document.getElementById('adoptionForm');
  if (adoptForm) {
    adoptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = adoptForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Gravando no Tratado d’Adozione...';

      setTimeout(() => {
        closeModal(adoptModal);
        adoptForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Selar Compromisso d’Adoção';
        showToast('📜 Decreto d’Adozione registrado com sucesso! Entraremos em contato para formalizar esta união.');
      }, 1200);
    });
  }

  // Formulário de Cópia da chave PIX no modal de ajuda
  const copyPixBtn = document.getElementById('copyPixBtn');
  if (copyPixBtn) {
    copyPixBtn.addEventListener('click', () => {
      const pixKey = "adote@pequenograndeheroi.org.br";
      navigator.clipboard.writeText(pixKey).then(() => {
        showToast('✨ Chave PIX copiada: adote@pequenograndeheroi.org.br');
      }).catch(() => {
        showToast('Chave PIX: adote@pequenograndeheroi.org.br');
      });
    });
  }
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('is-open');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('is-open');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   5. COMPARTILHAMENTO SOCIAL & CÓPIA DE LINK
   ========================================================================== */
function initSocialSharing() {
  const shareText = encodeURIComponent("Conheça o Pequeno Grande Herói! Um gatinho com a perfeição das proporções de Da Vinci esperando por um lar.");
  const shareUrl = encodeURIComponent(window.location.href);

  const btnWa = document.getElementById('shareWa');
  const btnFb = document.getElementById('shareFb');
  const btnX = document.getElementById('shareX');
  const btnCopy = document.getElementById('shareCopy');

  if (btnWa) {
    btnWa.href = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
    btnWa.target = '_blank';
  }

  if (btnFb) {
    btnFb.href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    btnFb.target = '_blank';
  }

  if (btnX) {
    btnX.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    btnX.target = '_blank';
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('📋 Link do Códice copiado com sucesso para a área de transferência!');
      }).catch(() => {
        showToast('Link: ' + window.location.href);
      });
    });
  }
}

/* ==========================================================================
   6. TOAST DE PERGAMINHO
   ========================================================================== */
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById('codexToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'codexToast';
    toast.className = 'codex-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>📜</span> <span>${message}</span>`;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   7. SCROLL SUAVE E HIGHLIGHT DE LINKS
   ========================================================================== */
function initNavigationScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
