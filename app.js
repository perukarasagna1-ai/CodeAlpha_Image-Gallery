const galleryItems = [
  {
    id: 1,
    title: "Vibrant Tropical Birds",
    category: "animals",
    src: "Birds.jpg",
    description: "A gorgeous collection of tropical parrots in close detail, showcasing their bright plumage and curious personalities."
  },
  {
    id: 2,
    title: "Serene Wilderness River",
    category: "nature",
    src: "Nature.jpg",
    description: "A beautiful, peaceful river flowing through a lush pine forest during a quiet autumn morning."
  },
  {
    id: 3,
    title: "Cosmic Nebula Swirls",
    category: "space",
    src: "cosmic_nebula.png",
    description: "An awe-inspiring capture of hot cosmic dust, glowing hydrogen emissions, and distant stellar nurseries deep in space."
  },
  {
    id: 4,
    title: "Cyberpunk Rain Showers",
    category: "architecture",
    src: "cyberpunk_street.png",
    description: "Dazzling neon lights reflecting on wet streets during a rainy evening in a vertical cyberpunk megacity."
  },
  {
    id: 5,
    title: "Quantum Computing Core",
    category: "tech",
    src: "futuristic_tech.png",
    description: "An intricate, glowing quantum processing unit featuring layered holographic user interfaces and hyper-fast optical data streams."
  },
  {
    id: 6,
    title: "Sunlit Coral Reef",
    category: "nature",
    src: "underwater_reef.png",
    description: "Sunlight filters through sparkling turquoise water onto a thriving reef packed with colorful corals and tropical sea life."
  }
];

let currentCategory = 'all';
let searchQuery = '';
let activeIndex = 0;
let filteredItems = [...galleryItems];
let slideshowTimer = null;
let isSlideshowPlaying = false;
let zoomScale = 1;

const galleryGrid = document.getElementById('galleryGrid');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxCounter = document.getElementById('lightboxCounter');

const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playBtn = document.getElementById('playBtn');
const zoomBtn = document.getElementById('zoomBtn');

function initGallery() {
  renderGallery();
  setupEventListeners();
}

function renderGallery() {
  galleryGrid.innerHTML = '';
  
  filteredItems = galleryItems.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                          item.category.toLowerCase().includes(searchQuery) ||
                          item.description.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filteredItems.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
    
    filteredItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.dataset.index = index;
      
      card.innerHTML = `
        <div class="gallery-card-link">
          <img src="${item.src}" alt="${item.title}" class="gallery-img" loading="lazy">
          <div class="card-overlay">
            <span class="card-category">${item.category}</span>
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc">${item.description}</p>
          </div>
        </div>
      `;
      
      card.addEventListener('click', () => {
        openLightbox(index);
      });
      
      galleryGrid.appendChild(card);
    });
  }
}

function setupEventListeners() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentCategory = btn.dataset.filter;
      renderGallery();
    });
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderGallery();
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);
  playBtn.addEventListener('click', toggleSlideshow);
  zoomBtn.addEventListener('click', toggleZoom);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === document.querySelector('.lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', handleKeyboardNav);
}

function handleKeyboardNav(e) {
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowRight') {
    showNextImage();
  } else if (e.key === 'ArrowLeft') {
    showPrevImage();
  } else if (e.key === ' ') {
    e.preventDefault();
    toggleSlideshow();
  }
}

function openLightbox(index) {
  activeIndex = index;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateLightboxContent();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  stopSlideshow();
  resetZoom();
}

function updateLightboxContent() {
  const item = filteredItems[activeIndex];
  if (!item) return;

  lightboxImg.classList.add('fade-out');

  setTimeout(() => {
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    
    lightboxTitle.textContent = item.title;
    lightboxCategory.textContent = item.category;
    lightboxDesc.textContent = item.description;
    
    lightboxCounter.textContent = `${activeIndex + 1} of ${filteredItems.length}`;
    
    resetZoom();

    lightboxImg.classList.remove('fade-out');
    lightboxImg.classList.add('fade-in');
    
    setTimeout(() => {
      lightboxImg.classList.remove('fade-in');
    }, 350);
  }, 200);
}

function showNextImage() {
  if (filteredItems.length === 0) return;
  activeIndex = (activeIndex + 1) % filteredItems.length;
  updateLightboxContent();
}

function showPrevImage() {
  if (filteredItems.length === 0) return;
  activeIndex = (activeIndex - 1 + filteredItems.length) % filteredItems.length;
  updateLightboxContent();
}

function toggleSlideshow() {
  if (isSlideshowPlaying) {
    stopSlideshow();
  } else {
    startSlideshow();
  }
}

function startSlideshow() {
  isSlideshowPlaying = true;
  playBtn.innerHTML = '&#9646;&#9646;';
  playBtn.style.color = 'var(--accent-purple)';
  playBtn.style.boxShadow = '0 0 15px var(--accent-purple-glow)';
  
  slideshowTimer = setInterval(() => {
    showNextImage();
  }, 3500);
}

function stopSlideshow() {
  isSlideshowPlaying = false;
  playBtn.innerHTML = '&#9654;';
  playBtn.style.color = '';
  playBtn.style.boxShadow = '';
  
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
}

function toggleZoom() {
  if (zoomScale === 1) {
    zoomScale = 1.5;
    lightboxImg.style.transform = 'scale(1.5)';
    lightboxImg.style.cursor = 'zoom-out';
    zoomBtn.style.color = 'var(--accent-cyan)';
    zoomBtn.style.boxShadow = '0 0 15px var(--accent-cyan-glow)';
  } else if (zoomScale === 1.5) {
    zoomScale = 2;
    lightboxImg.style.transform = 'scale(2)';
    lightboxImg.style.cursor = 'zoom-out';
  } else {
    resetZoom();
  }
}

function resetZoom() {
  zoomScale = 1;
  lightboxImg.style.transform = 'scale(1)';
  lightboxImg.style.cursor = 'zoom-in';
  zoomBtn.style.color = '';
  zoomBtn.style.boxShadow = '';
}

document.addEventListener('DOMContentLoaded', initGallery);
