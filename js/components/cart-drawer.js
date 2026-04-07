// ═══════════════════════════════════════════════
// CART DRAWER COMPONENT
// Screen 04 — Slide-in overlay from right
// ═══════════════════════════════════════════════

function renderCartDrawer() {
  return `
    <div class="cart-drawer" id="cartDrawer">
      <div class="cart-drawer__overlay" id="cartOverlay"></div>
      <div class="cart-drawer__panel" id="cartPanel">
        <div class="cart-drawer__header">
          <h3 class="cart-drawer__title">Your Cart 🛒 <span class="cart-drawer__count" id="drawerCartCount"></span></h3>
          <button class="cart-drawer__close" id="cartClose" aria-label="Close cart">✕</button>
        </div>

        <div class="cart-drawer__body" id="cartBody">
          <!-- Items loaded dynamically -->
        </div>

        <div class="cart-drawer__footer" id="cartFooter" style="display:none;">
          <!-- Coupon -->
          <div class="cart-drawer__coupon">
            <button class="cart-drawer__coupon-toggle" onclick="this.nextElementSibling.classList.toggle('open')">
              🏷️ Have a coupon?
            </button>
            <div class="cart-drawer__coupon-form">
              <input type="text" class="form-input" placeholder="Enter code" id="couponInput">
              <button class="btn btn--teal btn--sm" onclick="applyCoupon()">Apply</button>
            </div>
          </div>

          <!-- Summary -->
          <div class="cart-drawer__summary" id="cartSummary"></div>

          <!-- Checkout button -->
          <button class="btn btn--primary btn--full btn--lg" onclick="Cart.checkout()">
            Proceed to Checkout →
          </button>
          <p class="cart-drawer__secure">
            🔒 Secure Checkout by Shopify · UPI · Cards · Wallets
          </p>
        </div>
      </div>
    </div>
  `;
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartItems();
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

function initCartDrawer() {
  const closeBtn = document.getElementById('cartClose');
  const overlay = document.getElementById('cartOverlay');

  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCartDrawer();
  });

  // Listen to cart changes
  Cart.onChange(() => {
    renderCartItems();
    updateCartBadge();
  });
}

function renderCartItems() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  const countEl = document.getElementById('drawerCartCount');
  if (!body) return;

  const lines = Cart.getLines();
  const cart = Cart.getCart();

  if (countEl) countEl.textContent = `(${Cart.getTotalQuantity()})`;

  if (lines.length === 0) {
    body.innerHTML = `
      <div class="cart-drawer__empty">
        <div class="cart-drawer__empty-icon">🥺</div>
        <h4>Your cart is empty</h4>
        <p>Let's fix that — explore our delicious menu!</p>
        <a href="#/menu" class="btn btn--primary btn--sm" onclick="closeCartDrawer()">Browse Menu →</a>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  body.innerHTML = lines.map(line => {
    const variant = line.merchandise;
    const product = variant.product;
    const image = product?.images?.edges?.[0]?.node?.url;

    return `
      <div class="cart-drawer__item" data-line-id="${line.id}">
        <div class="cart-drawer__item-image">
          ${image
            ? `<img src="${image}" alt="${product.title}" loading="lazy">`
            : `<div class="cart-drawer__item-placeholder">🎂</div>`}
        </div>
        <div class="cart-drawer__item-info">
          <h4 class="cart-drawer__item-name">${product?.title || 'Product'}</h4>
          <p class="cart-drawer__item-variant">${variant.title !== 'Default Title' ? variant.title : ''}</p>
          <div class="cart-drawer__item-price">₹${Math.round(parseFloat(variant.price.amount))}</div>
        </div>
        <div class="cart-drawer__item-actions">
          <div class="cart-drawer__qty">
            <button class="cart-drawer__qty-btn" onclick="updateCartQty('${line.id}', ${line.quantity - 1})">−</button>
            <span class="cart-drawer__qty-val">${line.quantity}</span>
            <button class="cart-drawer__qty-btn" onclick="updateCartQty('${line.id}', ${line.quantity + 1})">+</button>
          </div>
          <button class="cart-drawer__remove" onclick="removeCartLine('${line.id}')" aria-label="Remove">✕</button>
        </div>
      </div>
    `;
  }).join('');

  // Show footer with summary
  if (footer) {
    footer.style.display = 'block';
    const summary = document.getElementById('cartSummary');
    if (summary && cart) {
      const subtotal = parseFloat(cart.cost?.subtotalAmount?.amount || 0);
      const total = parseFloat(cart.cost?.totalAmount?.amount || 0);
      const discount = subtotal - total;

      summary.innerHTML = `
        <div class="cart-drawer__summary-row">
          <span>Subtotal</span>
          <span>₹${Math.round(subtotal)}</span>
        </div>
        ${discount > 0 ? `
          <div class="cart-drawer__summary-row cart-drawer__summary-row--discount">
            <span>Discount</span>
            <span>-₹${Math.round(discount)}</span>
          </div>
        ` : ''}
        <div class="cart-drawer__summary-row">
          <span>Delivery</span>
          <span class="text-light">Calculated at checkout</span>
        </div>
        ${subtotal >= 499 ? '<div class="cart-drawer__free-delivery">🚚 Free delivery on your order!</div>' : ''}
        <div class="cart-drawer__summary-row cart-drawer__summary-total">
          <span>Total</span>
          <span>₹${Math.round(total)}</span>
        </div>
      `;
    }
  }
}

async function updateCartQty(lineId, quantity) {
  if (quantity <= 0) {
    await Cart.removeLine(lineId);
  } else {
    await Cart.updateLine(lineId, quantity);
  }
}

async function removeCartLine(lineId) {
  await Cart.removeLine(lineId);
}

async function applyCoupon() {
  const input = document.getElementById('couponInput');
  if (!input || !input.value.trim()) return;
  try {
    await Cart.applyDiscount(input.value.trim());
    showToast('Coupon applied! 🎉', 'success');
  } catch {
    showToast('Invalid coupon code', 'error');
  }
}
