// ═══════════════════════════════════════════════
// SEARCH PAGE — Full product search
// ═══════════════════════════════════════════════

let _searchState = {
  query: '',
  results: [],
  loading: false,
  timeout: null,
};

async function renderSearchPage(params) {
  const q = params?.get('q') || '';
  _searchState.query = q;

  return `
    <section class="search-hero" id="searchHero">
      <div class="container">
        <div class="section-eyebrow" style="justify-content:center; color: var(--rose);">🔍 Search</div>
        <h1 class="search-hero__title">Find Your Perfect Treat</h1>
        <div class="search-bar scroll-fade">
          <div class="search-bar__wrapper">
            <svg class="search-bar__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" class="search-bar__input" id="searchPageInput" 
                   placeholder="Search cakes, pastries, drinks..." 
                   value="${q}" autocomplete="off" autofocus>
            <button class="search-bar__clear" id="searchClearBtn" style="display:${q ? 'flex' : 'none'};" onclick="clearSearch()">✕</button>
          </div>
          <div class="search-bar__hints">
            <span class="search-hint" onclick="quickSearch('chocolate')">🍫 Chocolate</span>
            <span class="search-hint" onclick="quickSearch('strawberry')">🍓 Strawberry</span>
            <span class="search-hint" onclick="quickSearch('cheesecake')">🍰 Cheesecake</span>
            <span class="search-hint" onclick="quickSearch('vanilla')">🍦 Vanilla</span>
            <span class="search-hint" onclick="quickSearch('cupcake')">🧁 Cupcake</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--cream search-results-section" id="searchResults">
      <div class="container">
        <div class="search-results-header" id="searchResultsHeader" style="display:none;">
          <h2 class="search-results-header__title" id="searchResultsTitle">Results</h2>
          <span class="search-results-header__count" id="searchResultsCount"></span>
        </div>

        <!-- Results Grid -->
        <div class="grid grid-3 search-grid" id="searchGrid" style="display:none;"></div>

        <!-- Empty State -->
        <div class="search-empty" id="searchEmpty" style="display:${q ? 'none' : 'flex'};">
          <div class="search-empty__icon">🧁</div>
          <h3 class="search-empty__title">${q ? 'No results found' : 'Start typing to search'}</h3>
          <p class="search-empty__text">${q ? 'Try a different search term.' : 'Search our full catalog of handcrafted treats.'}</p>
        </div>

        <!-- Loading -->
        <div class="grid grid-3 search-loading" id="searchLoading" style="display:none;">
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
        </div>
      </div>
    </section>
  `;
}

async function initSearchPage() {
  const input = document.getElementById('searchPageInput');
  const clearBtn = document.getElementById('searchClearBtn');

  if (input) {
    input.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      _searchState.query = q;
      if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';

      clearTimeout(_searchState.timeout);
      _searchState.timeout = setTimeout(() => {
        if (q.length >= 2) {
          performSearch(q);
        } else if (q.length === 0) {
          showSearchEmpty('Start typing to search', 'Search our full catalog of handcrafted treats.', '🧁');
        }
      }, 350);
    });

    // Focus on load
    setTimeout(() => input.focus(), 300);

    // If there's an initial query, search it
    if (_searchState.query) {
      performSearch(_searchState.query);
    }
  }

  initScrollAnimations();
}

async function performSearch(query) {
  const grid = document.getElementById('searchGrid');
  const loading = document.getElementById('searchLoading');
  const empty = document.getElementById('searchEmpty');
  const header = document.getElementById('searchResultsHeader');

  if (!grid) return;

  // Show loading
  grid.style.display = 'none';
  if (empty) empty.style.display = 'none';
  if (loading) loading.style.display = '';
  if (header) header.style.display = '';

  const titleEl = document.getElementById('searchResultsTitle');
  if (titleEl) titleEl.textContent = `Searching for "${query}"...`;

  try {
    const res = await shopifyFetch(SHOPIFY_QUERIES.SEARCH_PRODUCTS, { query, first: 20 });
    const products = res.data?.products?.edges?.map(e => e.node) || [];

    if (loading) loading.style.display = 'none';

    if (products.length === 0) {
      showSearchEmpty('No results found', `We couldn't find anything matching "${query}". Try a different term.`, '🔍');
      if (header) header.style.display = 'none';
      return;
    }

    // Update header
    if (titleEl) titleEl.textContent = `Results for "${query}"`;
    const countEl = document.getElementById('searchResultsCount');
    if (countEl) countEl.textContent = `${products.length} item${products.length !== 1 ? 's' : ''}`;

    // Render results
    grid.style.display = '';
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

  } catch (err) {
    console.error('Search failed:', err);
    if (loading) loading.style.display = 'none';
    showSearchEmpty('Search unavailable', 'Please try again or browse our menu.', '⚠️');
    if (header) header.style.display = 'none';
  }
}

function showSearchEmpty(title, text, icon) {
  const empty = document.getElementById('searchEmpty');
  const grid = document.getElementById('searchGrid');
  const header = document.getElementById('searchResultsHeader');

  if (grid) grid.style.display = 'none';
  if (header) header.style.display = 'none';

  if (empty) {
    empty.style.display = 'flex';
    empty.innerHTML = `
      <div class="search-empty__icon">${icon}</div>
      <h3 class="search-empty__title">${title}</h3>
      <p class="search-empty__text">${text}</p>
      ${title.includes('No results') ? '<a href="#/menu" class="btn btn--primary btn--sm" style="margin-top:var(--space-md);">Browse Full Menu →</a>' : ''}
    `;
  }
}

function clearSearch() {
  const input = document.getElementById('searchPageInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (input) { input.value = ''; input.focus(); }
  if (clearBtn) clearBtn.style.display = 'none';
  _searchState.query = '';
  showSearchEmpty('Start typing to search', 'Search our full catalog of handcrafted treats.', '🧁');
}

function quickSearch(term) {
  const input = document.getElementById('searchPageInput');
  if (input) input.value = term;
  _searchState.query = term;
  const clearBtn = document.getElementById('searchClearBtn');
  if (clearBtn) clearBtn.style.display = 'flex';
  performSearch(term);
}
