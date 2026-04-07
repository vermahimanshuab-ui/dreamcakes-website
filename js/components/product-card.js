// ═══════════════════════════════════════════════
// PRODUCT CARD COMPONENT
// ═══════════════════════════════════════════════

function renderProductCard(product) {
  const image = product.images?.edges?.[0]?.node;
  const price = product.priceRange?.minVariantPrice?.amount;
  const maxPrice = product.priceRange?.maxVariantPrice?.amount;
  const firstVariant = product.variants?.edges?.[0]?.node;
  const tags = product.tags || [];
  const isWished = Wishlist.has(product.id);

  // Tag pills
  const tagPills = tags.slice(0, 2).map(tag => {
    let cls = 'pill--rose';
    if (tag.toLowerCase() === 'new') cls = 'pill--teal';
    if (tag.toLowerCase() === 'eggless') cls = 'pill--gold';
    if (tag.toLowerCase() === 'bestseller') cls = 'pill--rose';
    return `<span class="pill ${cls}">${tag}</span>`;
  }).join('');

  const priceDisplay = price === maxPrice
    ? `₹${Math.round(price)}`
    : `From ₹${Math.round(price)}`;

  return `
    <div class="product-card hover-lift" data-product-handle="${product.handle}">
      <div class="product-card__image-wrap">
        ${image ? `<img class="product-card__image" src="${image.url}" alt="${image.altText || product.title}" loading="lazy">` : `<div class="product-card__image skeleton"></div>`}
        <div class="product-card__tags">${tagPills}</div>
        <button class="product-card__wishlist ${isWished ? 'active' : ''}" 
                onclick="event.stopPropagation(); toggleWishlist(this, '${product.id}')" 
                aria-label="Add to wishlist">
          ${isWished ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${product.title}</h3>
        <p class="product-card__desc">${product.description?.substring(0, 80) || ''}</p>
        <div class="product-card__price">${priceDisplay}</div>
        <button class="btn btn--add-to-cart" 
                onclick="event.stopPropagation(); handleAddToCart('${firstVariant?.id}')"
                ${!firstVariant?.availableForSale ? 'disabled' : ''}>
          ${firstVariant?.availableForSale ? '🛒 Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  `;
}

function toggleWishlist(btn, productId) {
  const added = Wishlist.toggle(productId);
  btn.innerHTML = added ? '❤️' : '🤍';
  btn.classList.toggle('active', added);
  if (added) btn.classList.add('heart-pop');
  setTimeout(() => btn.classList.remove('heart-pop'), 300);
}

async function handleAddToCart(variantId) {
  if (!variantId) return;
  try {
    await Cart.addItem(variantId, 1);
    updateCartBadge();
    showToast('Added to cart! 🎂', 'success');
    openCartDrawer();
  } catch (err) {
    showToast('Could not add to cart. Please try again.', 'error');
  }
}

function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type} toast-enter`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
