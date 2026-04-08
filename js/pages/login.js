// ═══════════════════════════════════════════════
// LOGIN / TRACK ORDER PAGE
// ═══════════════════════════════════════════════

async function renderLoginPage() {
  return `
    <section class="login-hero" id="loginHero">
      <div class="container">
        <div class="login-card scroll-fade">
          <div class="login-card__header">
            <div class="login-card__icon">🎂</div>
            <h1 class="login-card__title">Welcome Back</h1>
            <p class="login-card__subtitle">Track your custom cake order or contact us for updates</p>
          </div>

          <!-- Track Order Tab -->
          <div class="login-tabs">
            <button class="login-tab active" data-tab="track" onclick="switchLoginTab('track')">📦 Track Order</button>
            <button class="login-tab" data-tab="contact" onclick="switchLoginTab('contact')">📞 Quick Contact</button>
          </div>

          <!-- Track Order Form -->
          <div class="login-form" id="trackTab">
            <div class="form-group">
              <label class="form-label" for="trackPhone">Phone Number</label>
              <input type="tel" class="form-input" id="trackPhone" 
                     placeholder="Enter your phone number" maxlength="10">
            </div>
            <button class="btn btn--primary btn--full btn--lg" onclick="trackCakeOrder()">
              🔍 Track My Order
            </button>
            <div id="trackResults" class="login-results" style="display:none;"></div>
          </div>

          <!-- Quick Contact -->
          <div class="login-form" id="contactTab" style="display:none;">
            <div class="login-contact-options">
              <a href="tel:+91${CONFIG.BUSINESS_PHONE}" class="login-contact-card hover-lift">
                <div class="login-contact-card__icon">📞</div>
                <div class="login-contact-card__label">Call Us</div>
                <div class="login-contact-card__value">${CONFIG.BUSINESS_PHONE}</div>
              </a>
              <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to check on my order from Dream Cakes.')}" 
                 target="_blank" class="login-contact-card login-contact-card--wa hover-lift">
                <div class="login-contact-card__icon">💬</div>
                <div class="login-contact-card__label">WhatsApp</div>
                <div class="login-contact-card__value">Chat Now</div>
              </a>
              <a href="#/contact" class="login-contact-card hover-lift">
                <div class="login-contact-card__icon">📍</div>
                <div class="login-contact-card__label">Visit Store</div>
                <div class="login-contact-card__value">2 Locations</div>
              </a>
            </div>
          </div>

          <div class="login-card__footer">
            <p>New here? <a href="#/menu" class="text-rose">Browse our menu</a> or <a href="#/custom-cake" class="text-rose">design a custom cake</a>!</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function initLoginPage() {
  initScrollAnimations();
}

function switchLoginTab(tab) {
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.login-tab[data-tab="${tab}"]`)?.classList.add('active');

  document.getElementById('trackTab').style.display = tab === 'track' ? '' : 'none';
  document.getElementById('contactTab').style.display = tab === 'contact' ? '' : 'none';
}

async function trackCakeOrder() {
  const phone = document.getElementById('trackPhone')?.value.trim();
  const results = document.getElementById('trackResults');
  if (!phone || phone.length < 10) {
    showToast('Please enter a valid 10-digit phone number.', 'error');
    return;
  }

  if (results) {
    results.style.display = '';
    results.innerHTML = `<div class="login-loading"><div class="spinner"></div><p>Looking up your orders...</p></div>`;
  }

  try {
    const { data, error } = await getSupabase()
      .from('custom_cake_orders')
      .select('id, created_at, size, sponge_flavour, decoration_theme, delivery_date, status, customer_name')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    if (!data || data.length === 0) {
      results.innerHTML = `
        <div class="login-no-orders">
          <div class="login-no-orders__icon">🔍</div>
          <p>No orders found for this number.</p>
          <a href="#/custom-cake" class="btn btn--primary btn--sm" style="margin-top:var(--space-md);">Design Your Cake →</a>
        </div>
      `;
      return;
    }

    results.innerHTML = `
      <h3 class="login-results__title">Your Orders (${data.length})</h3>
      ${data.map(order => {
        const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const deliveryDate = order.delivery_date ? new Date(order.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD';
        const statusMap = {
          'pending': { label: 'Pending Review', color: '#f59e0b', emoji: '⏳' },
          'confirmed': { label: 'Confirmed', color: '#10b981', emoji: '✅' },
          'in_progress': { label: 'Being Made', color: '#3b82f6', emoji: '👨‍🍳' },
          'ready': { label: 'Ready!', color: '#8b5cf6', emoji: '🎉' },
          'delivered': { label: 'Delivered', color: '#6b7280', emoji: '📦' },
        };
        const status = statusMap[order.status] || statusMap['pending'];
        
        return `
          <div class="login-order-card">
            <div class="login-order-card__header">
              <span class="login-order-card__date">${date}</span>
              <span class="login-order-card__status" style="background:${status.color}15; color:${status.color};">
                ${status.emoji} ${status.label}
              </span>
            </div>
            <div class="login-order-card__body">
              <div class="login-order-card__detail"><strong>Shape:</strong> ${order.decoration_theme || 'N/A'}</div>
              <div class="login-order-card__detail"><strong>Size:</strong> ${order.size || 'N/A'}</div>
              <div class="login-order-card__detail"><strong>Flavour:</strong> ${order.sponge_flavour || 'N/A'}</div>
              <div class="login-order-card__detail"><strong>Delivery:</strong> ${deliveryDate}</div>
            </div>
          </div>
        `;
      }).join('')}
    `;
  } catch (err) {
    console.error('Track order error:', err);
    results.innerHTML = `
      <div class="login-no-orders">
        <p>Unable to look up orders. Please try WhatsApp instead.</p>
        <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to check my cake order. Phone: ' + phone)}" 
           target="_blank" class="btn btn--whatsapp btn--sm" style="margin-top:var(--space-md);">💬 Ask on WhatsApp</a>
      </div>
    `;
  }
}
