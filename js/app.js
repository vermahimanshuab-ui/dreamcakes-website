// ═══════════════════════════════════════════════
// SPA ROUTER + APP INITIALIZATION
// Hash-based routing for vanilla JS SPA
// ═══════════════════════════════════════════════

const ROUTES = {
  '/': { page: 'home', title: 'Dream Cakes & Cafe — Artisan Bakery Siliguri' },
  '/menu': { page: 'menu', title: 'Our Menu — Dream Cakes & Cafe Siliguri' },
  '/product': { page: 'product', title: 'Product — Dream Cakes & Cafe Siliguri' },
  '/custom-cake': { page: 'custom-cake', title: 'Design Your Cake — Dream Cakes & Cafe Siliguri' },
  '/about': { page: 'about', title: 'About Us — Dream Cakes & Cafe Siliguri' },
  '/contact': { page: 'contact', title: 'Contact & Location — Dream Cakes & Cafe Siliguri' },
  '/reviews': { page: 'reviews', title: 'Reviews — Dream Cakes & Cafe Siliguri' },
  '/order-confirmed': { page: 'order-confirmed', title: 'Order Confirmed — Dream Cakes & Cafe' },
  '/search': { page: 'search', title: 'Search — Dream Cakes & Cafe Siliguri' },
  '/login': { page: 'login', title: 'Login — Dream Cakes & Cafe' },
};

// Current page reference
let currentPage = null;

function getRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  const path = hash.split('?')[0];
  const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  return { path, params };
}

async function navigateTo(path) {
  window.location.hash = '#' + path;
}

async function handleRoute() {
  const { path, params } = getRoute();
  const app = document.getElementById('app');
  if (!app) return;

  // Find matching route
  let route = ROUTES[path];
  let dynamicParam = null;

  // Handle dynamic routes like /product/[handle]
  if (!route) {
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === 'product' && parts[1]) {
      route = ROUTES['/product'];
      dynamicParam = parts[1];
    }
  }

  if (!route) {
    route = ROUTES['/'];
  }

  // Page transition
  app.classList.add('page-transitioning');
  await new Promise(r => setTimeout(r, 200));

  // Set title
  document.title = route.title;

  // Render page content
  let content = '';

  switch (route.page) {
    case 'home':
      content = await renderHomePage();
      break;
    case 'menu':
      content = typeof renderMenuPage === 'function' ? await renderMenuPage(params) : renderComingSoon('Menu');
      break;
    case 'product':
      content = typeof renderProductPage === 'function' ? await renderProductPage(dynamicParam) : renderComingSoon('Product');
      break;
    case 'custom-cake':
      content = typeof renderCustomCakePage === 'function' ? await renderCustomCakePage() : renderComingSoon('Custom Cake Designer');
      break;
    case 'about':
      content = typeof renderAboutPage === 'function' ? await renderAboutPage() : renderComingSoon('About Us');
      break;
    case 'contact':
      content = typeof renderContactPage === 'function' ? await renderContactPage() : renderComingSoon('Contact');
      break;
    case 'reviews':
      content = typeof renderReviewsPage === 'function' ? await renderReviewsPage() : renderComingSoon('Reviews');
      break;
    case 'order-confirmed':
      content = typeof renderOrderConfirmedPage === 'function' ? await renderOrderConfirmedPage(params) : renderComingSoon('Order Confirmed');
      break;
    case 'search':
      content = typeof renderSearchPage === 'function' ? await renderSearchPage(params) : renderComingSoon('Search');
      break;
    case 'login':
      content = typeof renderLoginPage === 'function' ? await renderLoginPage() : renderComingSoon('Login');
      break;
    default:
      content = await renderHomePage();
  }

  // Inject page content
  const pageContent = document.getElementById('pageContent');
  if (pageContent) {
    pageContent.innerHTML = content;
  }

  // Remove transition
  app.classList.remove('page-transitioning');
  app.classList.add('page-enter');
  setTimeout(() => app.classList.remove('page-enter'), 420);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update navbar active state
  updateActiveNavLink();

  // On non-home pages, force navbar to solid (scrolled) style
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (route.page !== 'home') {
      navbar.classList.add('scrolled', 'navbar--solid');
    } else {
      navbar.classList.remove('navbar--solid');
    }
  }

  // Page-specific initialization
  switch (route.page) {
    case 'home':
      await initHomePage();
      break;
    case 'menu':
      if (typeof initMenuPage === 'function') await initMenuPage();
      break;
    case 'product':
      if (typeof initProductPage === 'function') await initProductPage(dynamicParam);
      break;
    case 'custom-cake':
      if (typeof initCustomCakePage === 'function') initCustomCakePage();
      break;
    case 'about':
      if (typeof initAboutPage === 'function') initAboutPage();
      break;
    case 'contact':
      if (typeof initContactPage === 'function') initContactPage();
      break;
    case 'reviews':
      if (typeof initReviewsPage === 'function') await initReviewsPage();
      break;
    case 'search':
      if (typeof initSearchPage === 'function') await initSearchPage();
      break;
    case 'order-confirmed':
      if (typeof initOrderConfirmedPage === 'function') initOrderConfirmedPage();
      break;
    case 'login':
      if (typeof initLoginPage === 'function') initLoginPage();
      break;
  }

  currentPage = route.page;
}

function renderComingSoon(pageName) {
  return `
    <section class="section" style="min-height:60vh; display:flex; align-items:center; justify-content:center; text-align:center; padding-top: calc(var(--nav-height) + var(--space-3xl));">
      <div class="container">
        <div style="font-size:64px; margin-bottom:var(--space-lg);">🚧</div>
        <h1 style="margin-bottom:var(--space-md);">${pageName}</h1>
        <p style="color:var(--text-mid); font-size:18px; margin-bottom:var(--space-xl);">This page is being crafted with love. Coming soon!</p>
        <a href="#/" class="btn btn--primary">← Back to Home</a>
      </div>
    </section>
  `;
}

// ═══════════════════════════════════════════════
// APP INITIALIZATION
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');
  if (!app) return;

  // Inject navbar
  app.innerHTML = `
    ${renderNavbar()}
    <main id="pageContent"></main>
    ${renderFooter()}
    ${renderCartDrawer()}
    <!-- WhatsApp Float -->
    <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I\'d like to order from Dream Cakes & Cafe 🎂')}" 
       target="_blank" rel="noopener" 
       class="whatsapp-float" 
       aria-label="Chat on WhatsApp">
      💬
    </a>
  `;

  // Initialize navbar
  initNavbar();

  // Initialize cart drawer
  initCartDrawer();

  // Initialize cart (restore from localStorage)
  try {
    await Cart.init();
  } catch (e) {
    console.warn('Cart init failed:', e);
  }

  // Handle initial route
  await handleRoute();

  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute);

  // Product card click handler (delegate)
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card[data-product-handle]');
    if (card && !e.target.closest('button')) {
      const handle = card.dataset.productHandle;
      if (handle) navigateTo(`/product/${handle}`);
    }
  });
});
