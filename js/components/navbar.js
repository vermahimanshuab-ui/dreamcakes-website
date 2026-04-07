// ═══════════════════════════════════════════════
// NAVBAR COMPONENT
// ═══════════════════════════════════════════════

function renderNavbar() {
  return `
    <nav class="navbar" id="navbar">
      <div class="navbar__inner container">
        <!-- Logo -->
        <a href="#/" class="navbar__logo">
          <span class="navbar__logo-text">Dream Cakes <em>&</em> Cafe</span>
        </a>

        <!-- Desktop Nav Links -->
        <ul class="navbar__links" id="navLinks">
          <li><a href="#/" class="navbar__link" data-page="home">Home</a></li>
          <li><a href="#/menu" class="navbar__link" data-page="menu">Menu</a></li>
          <li><a href="#/custom-cake" class="navbar__link" data-page="custom-cake">Custom Cake</a></li>
          <li><a href="#/about" class="navbar__link" data-page="about">About</a></li>
          <li><a href="#/contact" class="navbar__link" data-page="contact">Contact</a></li>
        </ul>

        <!-- Right Actions -->
        <div class="navbar__actions">
          <!-- Search -->
          <button class="navbar__icon-btn navbar__search-icon" id="navSearch" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>

          <!-- Cart -->
          <button class="navbar__icon-btn navbar__cart-icon" id="navCart" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span class="cart-badge" id="cartBadge" style="display:none;">0</span>
          </button>

          <!-- Order Now CTA -->
          <a href="#/menu" class="btn btn--primary btn--sm navbar__cta">Order Now</a>

          <!-- Mobile hamburger -->
          <button class="navbar__hamburger" id="navHamburger" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile drawer -->
      <div class="navbar__mobile-drawer" id="mobileDrawer">
        <div class="navbar__mobile-drawer-inner">
          <div class="navbar__mobile-header">
            <span class="navbar__logo-text">Dream Cakes <em>&</em> Cafe</span>
            <button class="navbar__close-btn" id="navClose" aria-label="Close menu">✕</button>
          </div>
          <ul class="navbar__mobile-links">
            <li><a href="#/" class="navbar__mobile-link" data-page="home">🏠 Home</a></li>
            <li><a href="#/menu" class="navbar__mobile-link" data-page="menu">📋 Menu</a></li>
            <li><a href="#/custom-cake" class="navbar__mobile-link" data-page="custom-cake">🎨 Custom Cake</a></li>
            <li><a href="#/about" class="navbar__mobile-link" data-page="about">📖 About Us</a></li>
            <li><a href="#/contact" class="navbar__mobile-link" data-page="contact">📍 Contact</a></li>
            <li><a href="#/reviews" class="navbar__mobile-link" data-page="reviews">⭐ Reviews</a></li>
          </ul>
          <a href="#/menu" class="btn btn--primary btn--full btn--lg navbar__mobile-cta">Order Now →</a>
        </div>
      </div>
      <div class="navbar__mobile-overlay" id="mobileOverlay"></div>
    </nav>
  `;
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const closeBtn = document.getElementById('navClose');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link');

  // Scroll effect
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else if (!navbar.classList.contains('navbar--solid')) {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger toggle
  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Cart icon click
  const cartBtn = document.getElementById('navCart');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      openCartDrawer();
    });
  }

  // Search icon click
  const searchBtn = document.getElementById('navSearch');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      window.location.hash = '#/search';
    });
  }

  // Update active link
  updateActiveNavLink();

  // Cart badge
  updateCartBadge();
}

function updateActiveNavLink() {
  const hash = window.location.hash || '#/';
  const page = hash.replace('#/', '') || 'home';
  document.querySelectorAll('.navbar__link, .navbar__mobile-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const qty = Cart.getTotalQuantity();
  if (qty > 0) {
    badge.textContent = qty;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}
