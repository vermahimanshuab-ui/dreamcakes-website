// ═══════════════════════════════════════════════
// MENU PAGE — Full product catalog
// ═══════════════════════════════════════════════

const MENU_CATEGORIES = [
  { emoji: '✨', name: 'All Products', slug: 'all' },
  { emoji: '🎂', name: 'Celebration Cakes', slug: 'celebration-cakes' },
  { emoji: '🥐', name: 'Pastries & Minis', slug: 'pastries' },
  { emoji: '🍰', name: 'Cheesecakes', slug: 'cheesecakes' },
  { emoji: '☕', name: 'Café Items', slug: 'cafe-drinks' },
  { emoji: '🧁', name: 'Café Drinks', slug: 'cafe-drinks' },
  { emoji: '🍪', name: 'Cookies & Bites', slug: 'cookies' },
];

let _menuState = {
  activeCategory: 'all',
  searchQuery: '',
  products: [],
  loading: true,
  searchTimeout: null,
};

async function renderMenuPage(params) {
  const initialCategory = params?.get('category') || 'all';
  _menuState.activeCategory = initialCategory;

  return `
    <section class="menu-hero" id="menuHero">
      <div class="container">
        <div class="menu-hero__content">
          <div class="section-eyebrow" style="justify-content:center; color: var(--rose);">🍰 Our Menu</div>
          <h1 class="menu-hero__title">Freshly Baked, Daily</h1>
          <p class="menu-hero__subtitle">Every item is handcrafted with love using premium ingredients.</p>
        </div>
      </div>
    </section>

    <section class="section menu-section" id="menuSection">
      <div class="container">
        <!-- Search Bar -->
        <div class="menu-search scroll-fade">
          <div class="menu-search__wrapper">
            <svg class="menu-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" class="menu-search__input" id="menuSearchInput" placeholder="Search cakes, pastries, drinks..." autocomplete="off">
            <button class="menu-search__clear" id="menuSearchClear" style="display:none;" onclick="clearMenuSearch()">✕</button>
          </div>
        </div>

        <!-- Category Filter Strip -->
        <div class="menu-filters scroll-fade" id="menuFilters">
          ${MENU_CATEGORIES.map(cat => `
            <button class="menu-filter-pill ${cat.slug === initialCategory ? 'active' : ''}" 
                    data-category="${cat.slug}" 
                    onclick="filterByCategory('${cat.slug}')">
              <span class="menu-filter-pill__emoji">${cat.emoji}</span>
              ${cat.name}
            </button>
          `).join('')}
        </div>

        <!-- Results Header -->
        <div class="menu-results-header scroll-fade" id="menuResultsHeader">
          <h2 class="menu-results-header__title" id="menuResultsTitle">All Products</h2>
          <span class="menu-results-header__count" id="menuResultsCount"></span>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-3 menu-grid" id="menuProductGrid">
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
        </div>

        <!-- Empty State -->
        <div class="menu-empty" id="menuEmpty" style="display:none;">
          <div class="menu-empty__icon">🔍</div>
          <h3 class="menu-empty__title">No items found</h3>
          <p class="menu-empty__text">Try a different search or category.</p>
          <button class="btn btn--primary btn--sm" onclick="filterByCategory('all')">View All Products</button>
        </div>
      </div>
    </section>
  `;
}

async function initMenuPage() {
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('menuSearchClear');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      _menuState.searchQuery = q;
      if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';

      clearTimeout(_menuState.searchTimeout);
      _menuState.searchTimeout = setTimeout(() => {
        if (q.length >= 2) {
          searchMenuProducts(q);
        } else if (q.length === 0) {
          loadMenuProducts(_menuState.activeCategory);
        }
      }, 400);
    });
  }

  await loadMenuProducts(_menuState.activeCategory);
  initScrollAnimations();
}

function clearMenuSearch() {
  const input = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('menuSearchClear');
  if (input) input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  _menuState.searchQuery = '';
  loadMenuProducts(_menuState.activeCategory);
}

async function filterByCategory(slug) {
  _menuState.activeCategory = slug;

  // Update active pill
  document.querySelectorAll('.menu-filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.category === slug);
  });

  // Update title
  const cat = MENU_CATEGORIES.find(c => c.slug === slug);
  const titleEl = document.getElementById('menuResultsTitle');
  if (titleEl) titleEl.textContent = cat ? cat.name : 'All Products';

  // Clear search
  const input = document.getElementById('menuSearchInput');
  if (input) input.value = '';
  _menuState.searchQuery = '';

  await loadMenuProducts(slug);
}

async function loadMenuProducts(category) {
  const grid = document.getElementById('menuProductGrid');
  const empty = document.getElementById('menuEmpty');
  const countEl = document.getElementById('menuResultsCount');
  if (!grid) return;

  // Show skeletons
  grid.style.display = '';
  if (empty) empty.style.display = 'none';
  grid.innerHTML = Array(6).fill('<div class="skeleton skeleton--card"></div>').join('');

  try {
    let products = [];
    if (category === 'all') {
      // Fetch all products
      const res = await shopifyFetch(SHOPIFY_QUERIES.SEARCH_PRODUCTS, { query: '', first: 50 });
      products = res.data?.products?.edges?.map(e => e.node) || [];
    } else {
      // Fetch by collection
      const res = await shopifyFetch(SHOPIFY_QUERIES.GET_COLLECTION_PRODUCTS, { handle: category, first: 50 });
      products = res.data?.collection?.products?.edges?.map(e => e.node) || [];
    }

    _menuState.products = products;
    renderMenuGrid(products);
  } catch (err) {
    console.error('Failed to load menu products:', err);
    // Fallback: show placeholder products
    renderMenuGridPlaceholder();
  }
}

async function searchMenuProducts(query) {
  const grid = document.getElementById('menuProductGrid');
  if (!grid) return;

  grid.innerHTML = Array(3).fill('<div class="skeleton skeleton--card"></div>').join('');

  const titleEl = document.getElementById('menuResultsTitle');
  if (titleEl) titleEl.textContent = `Results for "${query}"`;

  // Deactivate category pills
  document.querySelectorAll('.menu-filter-pill').forEach(p => p.classList.remove('active'));

  try {
    const res = await shopifyFetch(SHOPIFY_QUERIES.SEARCH_PRODUCTS, { query, first: 20 });
    const products = res.data?.products?.edges?.map(e => e.node) || [];
    _menuState.products = products;
    renderMenuGrid(products);
  } catch {
    renderMenuGridPlaceholder();
  }
}

function renderMenuGrid(products) {
  const grid = document.getElementById('menuProductGrid');
  const empty = document.getElementById('menuEmpty');
  const countEl = document.getElementById('menuResultsCount');

  if (products.length === 0) {
    grid.style.display = 'none';
    if (empty) empty.style.display = 'flex';
    if (countEl) countEl.textContent = '';
    return;
  }

  grid.style.display = '';
  if (empty) empty.style.display = 'none';
  if (countEl) countEl.textContent = `${products.length} item${products.length !== 1 ? 's' : ''}`;

  grid.innerHTML = products.map(p => renderProductCard(p)).join('');

  // Stagger animations
  grid.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.4s var(--ease-out)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 80);
  });
}

function renderMenuGridPlaceholder() {
  const grid = document.getElementById('menuProductGrid');
  const countEl = document.getElementById('menuResultsCount');
  if (!grid) return;

  const items = [
    { title: 'Red Velvet Dream', desc: 'Rich red velvet with cream cheese frosting', price: '₹650', tag: 'Bestseller' },
    { title: 'Chocolate Truffle', desc: 'Dark chocolate ganache with gold leaf', price: '₹750', tag: 'New' },
    { title: 'Strawberry Bliss', desc: 'Fresh strawberry layers with whipped cream', price: '₹550', tag: '' },
    { title: 'Mango Mousse', desc: 'Seasonal mango with mirror glaze', price: '₹700', tag: 'Seasonal' },
    { title: 'Blueberry Cheesecake', desc: 'New York style with blueberry compote', price: '₹850', tag: 'Premium' },
    { title: 'Classic Vanilla', desc: 'Fluffy vanilla sponge with buttercream', price: '₹450', tag: 'Eggless' },
    { title: 'Butterscotch Crunch', desc: 'Caramelised butterscotch with crunchy praline', price: '₹600', tag: '' },
    { title: 'Pineapple Upside-Down', desc: 'Caramelised pineapple with whipped cream', price: '₹500', tag: '' },
    { title: 'Chocolate Lava', desc: 'Warm molten chocolate centre with ice cream', price: '₹350', tag: 'Bestseller' },
  ];

  if (countEl) countEl.textContent = `${items.length} items`;

  grid.innerHTML = items.map(p => `
    <div class="product-card hover-lift">
      <div class="product-card__image-wrap" style="background: linear-gradient(135deg, var(--rose-light) 0%, var(--gold-light) 100%); display:flex; align-items:center; justify-content:center;">
        <span style="font-size:64px;">🎂</span>
      </div>
      <div class="product-card__body">
        ${p.tag ? `<span class="pill pill--rose" style="margin-bottom:8px;">${p.tag}</span>` : ''}
        <h3 class="product-card__name">${p.title}</h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__price">${p.price}</div>
        <button class="btn btn--add-to-cart" onclick="showToast('Connect Shopify to enable cart','error')">🛒 Add to Cart</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.4s var(--ease-out)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 80);
  });
}
