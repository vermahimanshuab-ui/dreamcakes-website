// ═══════════════════════════════════════════════
// CART STATE MANAGEMENT
// Uses Shopify Cart API + localStorage for persistence
// ═══════════════════════════════════════════════

const Cart = {
  _cart: null,
  _listeners: [],

  // Subscribe to cart changes
  onChange(fn) {
    this._listeners.push(fn);
  },

  _notify() {
    this._listeners.forEach(fn => fn(this._cart));
  },

  // Get stored cart ID
  getCartId() {
    return localStorage.getItem('dc_cart_id');
  },

  // Save cart state after API response
  _saveCart(cart) {
    this._cart = cart;
    localStorage.setItem('dc_cart_id', cart.id);
    localStorage.setItem('dc_checkout_url', cart.checkoutUrl);
    this._notify();
  },

  // Get current cart data
  getCart() {
    return this._cart;
  },

  // Get total quantity
  getTotalQuantity() {
    return this._cart?.totalQuantity || 0;
  },

  // Get cart lines (items)
  getLines() {
    if (!this._cart?.lines?.edges) return [];
    return this._cart.lines.edges.map(e => e.node);
  },

  // Initialize or restore cart
  async init() {
    const cartId = this.getCartId();
    if (cartId) {
      try {
        const res = await shopifyFetch(SHOPIFY_QUERIES.GET_CART, { cartId });
        if (res.data?.cart) {
          this._saveCart(res.data.cart);
          return;
        }
      } catch (e) {
        console.warn('Cart restore failed, creating new cart');
      }
    }
    await this._createCart();
  },

  async _createCart() {
    const res = await shopifyFetch(SHOPIFY_QUERIES.CREATE_CART);
    if (res.data?.cartCreate?.cart) {
      this._saveCart(res.data.cartCreate.cart);
    }
  },

  // Add item to cart
  async addItem(merchandiseId, quantity = 1) {
    let cartId = this.getCartId();
    if (!cartId) {
      await this._createCart();
      cartId = this.getCartId();
    }
    const res = await shopifyFetch(SHOPIFY_QUERIES.ADD_TO_CART, {
      cartId,
      lines: [{ merchandiseId, quantity }],
    });
    if (res.data?.cartLinesAdd?.cart) {
      this._saveCart(res.data.cartLinesAdd.cart);
      this._animateCartBadge();
    }
    return res;
  },

  // Update line quantity
  async updateLine(lineId, quantity) {
    const cartId = this.getCartId();
    if (!cartId) return;
    const res = await shopifyFetch(SHOPIFY_QUERIES.UPDATE_CART_LINE, {
      cartId,
      lines: [{ id: lineId, quantity }],
    });
    if (res.data?.cartLinesUpdate?.cart) {
      this._saveCart(res.data.cartLinesUpdate.cart);
    }
  },

  // Remove line from cart
  async removeLine(lineId) {
    const cartId = this.getCartId();
    if (!cartId) return;
    const res = await shopifyFetch(SHOPIFY_QUERIES.REMOVE_CART_LINE, {
      cartId,
      lineIds: [lineId],
    });
    if (res.data?.cartLinesRemove?.cart) {
      this._saveCart(res.data.cartLinesRemove.cart);
    }
  },

  // Apply discount code
  async applyDiscount(code) {
    const cartId = this.getCartId();
    if (!cartId) return;
    const res = await shopifyFetch(SHOPIFY_QUERIES.APPLY_DISCOUNT, {
      cartId,
      discountCodes: [code],
    });
    if (res.data?.cartDiscountCodesUpdate?.cart) {
      this._saveCart(res.data.cartDiscountCodesUpdate.cart);
    }
    return res;
  },

  // Proceed to Shopify checkout
  checkout() {
    const url = this._cart?.checkoutUrl || localStorage.getItem('dc_checkout_url');
    if (url) {
      // Save current cart summary for order-confirmed page
      localStorage.setItem('dc_last_cart', JSON.stringify(this.getLines()));
      window.location.href = url;
    }
  },

  // Cart badge bounce animation
  _animateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.classList.add('bounce');
      setTimeout(() => badge.classList.remove('bounce'), 600);
    }
  },
};

// Wishlist (localStorage only, no auth required)
const Wishlist = {
  _key: 'dc_wishlist',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this._key)) || [];
    } catch { return []; }
  },

  has(productId) {
    return this.getAll().includes(productId);
  },

  toggle(productId) {
    const list = this.getAll();
    const idx = list.indexOf(productId);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(productId);
    }
    localStorage.setItem(this._key, JSON.stringify(list));
    return idx === -1; // returns true if added
  },
};
