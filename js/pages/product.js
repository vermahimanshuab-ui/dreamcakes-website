// ═══════════════════════════════════════════════
// PRODUCT DETAIL PAGE — Dynamic product view
// ═══════════════════════════════════════════════

async function renderProductPage(handle) {
  if (!handle) {
    return `
      <section class="section" style="min-height:60vh; display:flex; align-items:center; justify-content:center; text-align:center; padding-top: calc(var(--nav-height) + var(--space-3xl));">
        <div class="container">
          <div style="font-size:64px; margin-bottom:var(--space-lg);">🎂</div>
          <h1>Product Not Found</h1>
          <p style="color:var(--text-mid); margin: var(--space-md) 0 var(--space-xl);">The product you're looking for doesn't exist.</p>
          <a href="#/menu" class="btn btn--primary">← Browse Menu</a>
        </div>
      </section>
    `;
  }

  return `
    <section class="product-page" id="productPage">
      <div class="container">
        <nav class="product-breadcrumb" id="productBreadcrumb">
          <a href="#/">Home</a>
          <span class="product-breadcrumb__sep">›</span>
          <a href="#/menu">Menu</a>
          <span class="product-breadcrumb__sep">›</span>
          <span class="product-breadcrumb__current" id="breadcrumbName">Loading...</span>
        </nav>

        <div class="product-detail" id="productDetail">
          <!-- Skeleton while loading -->
          <div class="product-detail__gallery">
            <div class="skeleton" style="width:100%; height:500px; border-radius: var(--card-radius);"></div>
          </div>
          <div class="product-detail__info">
            <div class="skeleton skeleton--text" style="width:60%; height:32px;"></div>
            <div class="skeleton skeleton--text" style="width:40%; height:24px; margin-top:12px;"></div>
            <div class="skeleton skeleton--text" style="width:100%; height:80px; margin-top:24px;"></div>
            <div class="skeleton skeleton--text" style="width:50%; height:48px; margin-top:24px;"></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function initProductPage(handle) {
  if (!handle) return;

  try {
    const res = await shopifyFetch(SHOPIFY_QUERIES.GET_PRODUCT, { handle });
    const product = res.data?.product;
    if (product) {
      renderProductDetail(product);
    } else {
      renderProductNotFound();
    }
  } catch (err) {
    console.error('Failed to load product:', err);
    renderProductDetailPlaceholder(handle);
  }
}

function renderProductDetail(product) {
  const detail = document.getElementById('productDetail');
  const breadcrumbName = document.getElementById('breadcrumbName');
  if (!detail) return;

  if (breadcrumbName) breadcrumbName.textContent = product.title;
  document.title = `${product.title} — Dream Cakes & Cafe`;

  const images = product.images?.edges?.map(e => e.node) || [];
  const variants = product.variants?.edges?.map(e => e.node) || [];
  const firstVariant = variants[0];
  const price = product.priceRange?.minVariantPrice?.amount;
  const maxPrice = product.priceRange?.maxVariantPrice?.amount;
  const tags = product.tags || [];
  const metafields = product.metafields?.filter(Boolean) || [];

  const priceDisplay = price === maxPrice
    ? `₹${Math.round(price)}`
    : `₹${Math.round(price)} – ₹${Math.round(maxPrice)}`;

  // Group variants by option name
  const optionGroups = {};
  variants.forEach(v => {
    v.selectedOptions?.forEach(opt => {
      if (!optionGroups[opt.name]) optionGroups[opt.name] = new Set();
      optionGroups[opt.name].add(opt.value);
    });
  });

  detail.innerHTML = `
    <!-- Gallery -->
    <div class="product-detail__gallery">
      <div class="product-gallery__main" id="galleryMain">
        ${images.length > 0
          ? `<img src="${images[0].url}" alt="${images[0].altText || product.title}" class="product-gallery__main-img" id="galleryMainImg">`
          : `<div class="product-gallery__placeholder">🎂</div>`
        }
      </div>
      ${images.length > 1 ? `
        <div class="product-gallery__thumbs">
          ${images.map((img, i) => `
            <button class="product-gallery__thumb ${i === 0 ? 'active' : ''}" 
                    onclick="switchGalleryImage('${img.url}', this)"
                    style="background-image: url(${img.url});">
            </button>
          `).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Product Info -->
    <div class="product-detail__info">
      <div class="product-detail__tags">
        ${tags.slice(0, 3).map(t => {
          let cls = 'pill--rose';
          if (t.toLowerCase() === 'new') cls = 'pill--teal';
          if (t.toLowerCase() === 'eggless') cls = 'pill--gold';
          return `<span class="pill ${cls}">${t}</span>`;
        }).join('')}
      </div>

      <h1 class="product-detail__title">${product.title}</h1>
      <div class="product-detail__price">${priceDisplay}</div>

      ${product.descriptionHtml ? `
        <div class="product-detail__desc">
          ${product.descriptionHtml}
        </div>
      ` : product.description ? `
        <div class="product-detail__desc"><p>${product.description}</p></div>
      ` : ''}

      <!-- Variant Options -->
      ${Object.entries(optionGroups).map(([name, values]) => `
        <div class="product-detail__option">
          <label class="product-detail__option-label">${name}</label>
          <div class="product-detail__option-chips">
            ${[...values].map((val, i) => `
              <button class="option-chip ${i === 0 ? 'active' : ''}" 
                      data-option="${name}" data-value="${val}"
                      onclick="selectVariantOption(this, '${name}', '${val}')">
                ${val}
              </button>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <!-- Quantity + Add to Cart -->
      <div class="product-detail__actions">
        <div class="quantity-picker">
          <button class="quantity-picker__btn" onclick="updateProductQty(-1)">−</button>
          <span class="quantity-picker__value" id="productQty">1</span>
          <button class="quantity-picker__btn" onclick="updateProductQty(1)">+</button>
        </div>
        <button class="btn btn--primary btn--lg product-detail__add" 
                id="addToCartBtn"
                data-variant-id="${firstVariant?.id || ''}"
                onclick="addProductToCart()"
                ${!firstVariant?.availableForSale ? 'disabled' : ''}>
          ${firstVariant?.availableForSale ? '🛒 Add to Cart' : 'Sold Out'}
        </button>
      </div>

      <!-- WhatsApp Order -->
      <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'd like to order: ${product.title}`)}" 
         target="_blank" class="btn btn--whatsapp btn--full" style="margin-top: var(--space-md);">
        💬 Order via WhatsApp
      </a>

      <!-- Metafields -->
      ${metafields.length > 0 ? `
        <div class="product-detail__meta">
          ${metafields.map(m => `
            <div class="product-detail__meta-item">
              <strong>${m.key === 'ingredients' ? '🧾 Ingredients' : '⚠️ Allergens'}</strong>
              <p>${m.value}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Trust Badges -->
      <div class="product-detail__trust">
        <div class="product-detail__trust-item">🚚 Free delivery on ₹499+</div>
        <div class="product-detail__trust-item">❄️ Temperature-controlled packaging</div>
        <div class="product-detail__trust-item">⭐ 4.9 average rating</div>
      </div>
    </div>
  `;
}

function renderProductDetailPlaceholder(handle) {
  const detail = document.getElementById('productDetail');
  const breadcrumbName = document.getElementById('breadcrumbName');
  if (!detail) return;

  const name = handle.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  if (breadcrumbName) breadcrumbName.textContent = name;

  detail.innerHTML = `
    <div class="product-detail__gallery">
      <div class="product-gallery__main">
        <div class="product-gallery__placeholder">🎂</div>
      </div>
    </div>
    <div class="product-detail__info">
      <h1 class="product-detail__title">${name}</h1>
      <div class="product-detail__price">₹650</div>
      <div class="product-detail__desc">
        <p>A delicious handcrafted treat from Dream Cakes & Cafe. Made fresh daily with the finest ingredients.</p>
      </div>
      <div class="product-detail__actions">
        <div class="quantity-picker">
          <button class="quantity-picker__btn" onclick="updateProductQty(-1)">−</button>
          <span class="quantity-picker__value" id="productQty">1</span>
          <button class="quantity-picker__btn" onclick="updateProductQty(1)">+</button>
        </div>
        <button class="btn btn--primary btn--lg product-detail__add" onclick="showToast('Connect Shopify to enable cart','error')">
          🛒 Add to Cart
        </button>
      </div>
      <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I\'d like to place an order 🎂')}" 
         target="_blank" class="btn btn--whatsapp btn--full" style="margin-top: var(--space-md);">
        💬 Order via WhatsApp
      </a>
      <div class="product-detail__trust">
        <div class="product-detail__trust-item">🚚 Free delivery on ₹499+</div>
        <div class="product-detail__trust-item">❄️ Temperature-controlled packaging</div>
        <div class="product-detail__trust-item">⭐ 4.9 average rating</div>
      </div>
    </div>
  `;
}

function renderProductNotFound() {
  const detail = document.getElementById('productDetail');
  if (!detail) return;
  detail.innerHTML = `
    <div style="grid-column: 1/-1; text-align:center; padding: var(--space-4xl) 0;">
      <div style="font-size:64px; margin-bottom:var(--space-lg);">😔</div>
      <h2>Product Not Found</h2>
      <p style="color:var(--text-mid); margin: var(--space-md) 0 var(--space-xl);">This product may have been removed or doesn't exist.</p>
      <a href="#/menu" class="btn btn--primary">← Browse Menu</a>
    </div>
  `;
}

// Gallery image switcher
function switchGalleryImage(url, thumbBtn) {
  const mainImg = document.getElementById('galleryMainImg');
  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = url;
      mainImg.style.opacity = '1';
    }, 200);
  }
  document.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('active'));
  if (thumbBtn) thumbBtn.classList.add('active');
}

// Quantity control
let _productQty = 1;
function updateProductQty(delta) {
  _productQty = Math.max(1, Math.min(10, _productQty + delta));
  const el = document.getElementById('productQty');
  if (el) el.textContent = _productQty;
}

// Variant selection
function selectVariantOption(btn, optionName, value) {
  btn.closest('.product-detail__option-chips')
    .querySelectorAll('.option-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
}

// Add to cart
async function addProductToCart() {
  const btn = document.getElementById('addToCartBtn');
  if (!btn) return;
  const variantId = btn.dataset.variantId;
  if (!variantId) {
    showToast('Please select a variant', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Adding...';

  try {
    await Cart.addItem(variantId, _productQty);
    updateCartBadge();
    showToast(`Added ${_productQty} item${_productQty > 1 ? 's' : ''} to cart! 🎂`, 'success');
    openCartDrawer();
    _productQty = 1;
    const qtyEl = document.getElementById('productQty');
    if (qtyEl) qtyEl.textContent = '1';
  } catch {
    showToast('Could not add to cart. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '🛒 Add to Cart';
  }
}
