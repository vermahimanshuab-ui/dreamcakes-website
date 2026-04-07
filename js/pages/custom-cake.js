// ═══════════════════════════════════════════════
// CUSTOM CAKE DESIGNER — Multi-step Form Wizard
// ═══════════════════════════════════════════════

let _cakeState = {
  step: 1,
  totalSteps: 4,
  shape: '',
  size: '',
  flavour: '',
  frosting: '',
  message: '',
  decorations: [],
  referenceImage: null,
  name: '',
  phone: '',
  deliveryDate: '',
  notes: '',
};

async function renderCustomCakePage() {
  return `
    <section class="cake-designer" id="cakeDesigner">
      <div class="container">
        <!-- Hero -->
        <div class="cake-designer__hero">
          <div class="section-eyebrow" style="justify-content:center; color:var(--rose);">✨ Cake Designer</div>
          <h1 class="cake-designer__title">Design Your Dream Cake</h1>
          <p class="cake-designer__subtitle">Build your perfect cake step by step — we'll bring it to life!</p>
        </div>

        <!-- Progress Bar -->
        <div class="cake-progress" id="cakeProgress">
          ${[1,2,3,4].map(s => `
            <div class="cake-progress__step ${s === 1 ? 'active' : ''}" data-step="${s}">
              <div class="cake-progress__dot">${s}</div>
              <span class="cake-progress__label">${['Shape & Size', 'Flavour', 'Personalise', 'Confirm'][s-1]}</span>
            </div>
          `).join('')}
          <div class="cake-progress__bar">
            <div class="cake-progress__fill" id="cakeProgressFill" style="width:25%;"></div>
          </div>
        </div>

        <!-- Main Layout: Steps + Live Preview -->
        <div class="cake-designer__layout">
          <!-- Steps Container -->
          <div class="cake-steps" id="cakeSteps">
            ${renderCakeStep1()}
          </div>

          <!-- Live Cake Preview -->
          <div class="cake-preview" id="cakePreview">
            <div class="cake-preview__card">
              <h3 class="cake-preview__heading">Your Cake Preview</h3>
              <div class="cake-preview__visual" id="cakePreviewVisual">
                ${renderCakePreview()}
              </div>
              <div class="cake-preview__selections" id="cakePreviewSelections">
                <span class="cake-preview__tag cake-preview__tag--empty">Select options to see your cake</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="cake-nav" id="cakeNav">
          <button class="btn btn--secondary" id="cakePrevBtn" onclick="cakePrevStep()" style="visibility:hidden;">← Back</button>
          <button class="btn btn--primary btn--lg" id="cakeNextBtn" onclick="cakeNextStep()">Next: Choose Flavour →</button>
        </div>
      </div>
    </section>
  `;
}

function initCustomCakePage() {
  _cakeState = { step:1, totalSteps:4, shape:'', size:'', flavour:'', frosting:'', message:'', decorations:[], referenceImage:null, name:'', phone:'', deliveryDate:'', notes:'' };
}

function renderCakeStep1() {
  const shapes = [
    { id: 'round', emoji: '🟤', name: 'Round', desc: 'Classic circle shape' },
    { id: 'square', emoji: '🟫', name: 'Square', desc: 'Modern and elegant' },
    { id: 'heart', emoji: '💖', name: 'Heart', desc: 'Perfect for loved ones' },
    { id: 'tiered', emoji: '🎂', name: 'Tiered', desc: '2-3 tier celebration' },
    { id: 'custom', emoji: '✨', name: 'Custom Shape', desc: 'Tell us your idea' },
  ];
  const sizes = [
    { id: '0.5kg', name: '0.5 Kg', serves: '4–6', price: 'From ₹399' },
    { id: '1kg', name: '1 Kg', serves: '8–10', price: 'From ₹599' },
    { id: '1.5kg', name: '1.5 Kg', serves: '12–15', price: 'From ₹799' },
    { id: '2kg', name: '2 Kg', serves: '16–20', price: 'From ₹999' },
    { id: '3kg', name: '3 Kg', serves: '25–30', price: 'From ₹1399' },
  ];

  return `
    <div class="cake-step" data-step="1">
      <h2 class="cake-step__title">Choose Shape & Size</h2>
      <div class="cake-step__section">
        <h3 class="cake-step__label">Shape</h3>
        <div class="cake-option-grid cake-option-grid--shapes">
          ${shapes.map(s => `
            <button class="cake-option-card ${_cakeState.shape === s.id ? 'active' : ''}" onclick="selectCakeOption('shape','${s.id}', this)">
              <span class="cake-option-card__emoji">${s.emoji}</span>
              <strong>${s.name}</strong>
              <small>${s.desc}</small>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="cake-step__section">
        <h3 class="cake-step__label">Size</h3>
        <div class="cake-option-grid cake-option-grid--sizes">
          ${sizes.map(s => `
            <button class="cake-option-card cake-option-card--size ${_cakeState.size === s.id ? 'active' : ''}" onclick="selectCakeOption('size','${s.id}', this)">
              <strong>${s.name}</strong>
              <small>Serves ${s.serves}</small>
              <span class="cake-option-card__price">${s.price}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderCakeStep2() {
  const flavours = [
    { id: 'vanilla', emoji: '🍦', name: 'Vanilla' },
    { id: 'chocolate', emoji: '🍫', name: 'Chocolate' },
    { id: 'red-velvet', emoji: '❤️', name: 'Red Velvet' },
    { id: 'butterscotch', emoji: '🧈', name: 'Butterscotch' },
    { id: 'strawberry', emoji: '🍓', name: 'Strawberry' },
    { id: 'mango', emoji: '🥭', name: 'Mango' },
    { id: 'pineapple', emoji: '🍍', name: 'Pineapple' },
    { id: 'black-forest', emoji: '🍒', name: 'Black Forest' },
    { id: 'blueberry', emoji: '🫐', name: 'Blueberry' },
    { id: 'coffee', emoji: '☕', name: 'Coffee Mocha' },
  ];
  const frostings = [
    { id: 'buttercream', name: 'Buttercream', desc: 'Classic & smooth' },
    { id: 'fondant', name: 'Fondant', desc: 'Sleek & decorative' },
    { id: 'cream-cheese', name: 'Cream Cheese', desc: 'Rich & tangy' },
    { id: 'whipped-cream', name: 'Whipped Cream', desc: 'Light & fluffy' },
    { id: 'ganache', name: 'Chocolate Ganache', desc: 'Decadent & glossy' },
  ];

  return `
    <div class="cake-step" data-step="2">
      <h2 class="cake-step__title">Choose Flavour & Frosting</h2>
      <div class="cake-step__section">
        <h3 class="cake-step__label">Cake Flavour</h3>
        <div class="cake-option-grid cake-option-grid--flavours">
          ${flavours.map(f => `
            <button class="cake-option-card ${_cakeState.flavour === f.id ? 'active' : ''}" onclick="selectCakeOption('flavour','${f.id}', this)">
              <span class="cake-option-card__emoji">${f.emoji}</span>
              <strong>${f.name}</strong>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="cake-step__section">
        <h3 class="cake-step__label">Frosting Style</h3>
        <div class="cake-option-grid cake-option-grid--frostings">
          ${frostings.map(f => `
            <button class="cake-option-card ${_cakeState.frosting === f.id ? 'active' : ''}" onclick="selectCakeOption('frosting','${f.id}', this)">
              <strong>${f.name}</strong>
              <small>${f.desc}</small>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderCakeStep3() {
  const decorations = ['Sprinkles', 'Fresh Flowers', 'Gold Leaf', 'Macarons', 'Berries', 'Chocolate Shards', 'Edible Pearls', 'Photo Print'];

  return `
    <div class="cake-step" data-step="3">
      <h2 class="cake-step__title">Personalise Your Cake</h2>
      <div class="cake-step__section">
        <h3 class="cake-step__label">Message on Cake</h3>
        <input type="text" class="form-input" id="cakeMessage" maxlength="60" placeholder="e.g. Happy Birthday Priya! 🎉" 
               value="${_cakeState.message}" oninput="_cakeState.message = this.value; updateCakePreview();">
        <small style="color:var(--text-light); margin-top:4px; display:block;">Max 60 characters</small>
      </div>
      <div class="cake-step__section">
        <h3 class="cake-step__label">Decorations (select multiple)</h3>
        <div class="cake-deco-grid">
          ${decorations.map(d => `
            <label class="cake-deco-chip ${_cakeState.decorations.includes(d) ? 'active' : ''}">
              <input type="checkbox" ${_cakeState.decorations.includes(d) ? 'checked' : ''} 
                     onchange="toggleCakeDecoration('${d}', this.parentElement)">
              ${d}
            </label>
          `).join('')}
        </div>
      </div>
      <div class="cake-step__section">
        <h3 class="cake-step__label">Reference Image (optional)</h3>
        <div class="cake-upload" id="cakeUpload" onclick="document.getElementById('cakeFileInput').click()">
          <input type="file" id="cakeFileInput" accept="image/*" style="display:none" onchange="handleCakeImageUpload(event)">
          <div class="cake-upload__content" id="cakeUploadContent">
            <span class="cake-upload__icon">📷</span>
            <p>Click to upload a reference image</p>
            <small>JPG, PNG up to 5MB</small>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCakeStep4() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return `
    <div class="cake-step" data-step="4">
      <h2 class="cake-step__title">Review & Confirm</h2>

      <!-- Order Summary -->
      <div class="cake-summary">
        <h3 class="cake-summary__heading">Your Custom Cake</h3>
        <div class="cake-summary__grid">
          <div class="cake-summary__item"><span>Shape:</span> <strong>${_cakeState.shape || '—'}</strong></div>
          <div class="cake-summary__item"><span>Size:</span> <strong>${_cakeState.size || '—'}</strong></div>
          <div class="cake-summary__item"><span>Flavour:</span> <strong>${_cakeState.flavour || '—'}</strong></div>
          <div class="cake-summary__item"><span>Frosting:</span> <strong>${_cakeState.frosting || '—'}</strong></div>
          ${_cakeState.message ? `<div class="cake-summary__item cake-summary__item--full"><span>Message:</span> <strong>"${_cakeState.message}"</strong></div>` : ''}
          ${_cakeState.decorations.length ? `<div class="cake-summary__item cake-summary__item--full"><span>Decorations:</span> <strong>${_cakeState.decorations.join(', ')}</strong></div>` : ''}
        </div>
      </div>

      <!-- Contact Details -->
      <div class="cake-step__section">
        <h3 class="cake-step__label">Your Details</h3>
        <div class="cake-form-grid">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" id="cakeCustomerName" required placeholder="Your name" value="${_cakeState.name}" oninput="_cakeState.name=this.value">
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number *</label>
            <input type="tel" class="form-input" id="cakeCustomerPhone" required placeholder="10-digit mobile" value="${_cakeState.phone}" oninput="_cakeState.phone=this.value">
          </div>
          <div class="form-group">
            <label class="form-label">Delivery/Pickup Date *</label>
            <input type="date" class="form-input" id="cakeDeliveryDate" required min="${minDate}" value="${_cakeState.deliveryDate}" oninput="_cakeState.deliveryDate=this.value">
          </div>
          <div class="form-group">
            <label class="form-label">Special Notes</label>
            <textarea class="form-textarea" id="cakeNotes" placeholder="Allergies, dietary preferences, etc." rows="3" oninput="_cakeState.notes=this.value">${_cakeState.notes}</textarea>
          </div>
        </div>
      </div>
    </div>
  `;
}

function selectCakeOption(field, value, btn) {
  _cakeState[field] = value;
  const grid = btn.closest('.cake-option-grid');
  grid.querySelectorAll('.cake-option-card').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  updateCakePreview();
}

function toggleCakeDecoration(name, label) {
  const idx = _cakeState.decorations.indexOf(name);
  if (idx > -1) {
    _cakeState.decorations.splice(idx, 1);
    label.classList.remove('active');
  } else {
    _cakeState.decorations.push(name);
    label.classList.add('active');
  }
  updateCakePreview();
}

function handleCakeImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image must be under 5MB', 'error');
    return;
  }

  const content = document.getElementById('cakeUploadContent');
  const reader = new FileReader();
  reader.onload = (e) => {
    _cakeState.referenceImage = e.target.result;
    if (content) {
      content.innerHTML = `
        <img src="${e.target.result}" style="max-height:140px; border-radius:8px; object-fit:contain;">
        <p style="margin-top:8px; color:var(--teal); font-weight:600;">✓ Image uploaded</p>
      `;
    }
  };
  reader.readAsDataURL(file);
}

function cakeNextStep() {
  if (_cakeState.step < _cakeState.totalSteps) {
    _cakeState.step++;
    updateCakeWizard();
  } else {
    submitCakeOrder();
  }
}

function cakePrevStep() {
  if (_cakeState.step > 1) {
    _cakeState.step--;
    updateCakeWizard();
  }
}

function updateCakeWizard() {
  const stepsContainer = document.getElementById('cakeSteps');
  const prevBtn = document.getElementById('cakePrevBtn');
  const nextBtn = document.getElementById('cakeNextBtn');
  const progressFill = document.getElementById('cakeProgressFill');

  if (!stepsContainer) return;

  // Update step content
  switch (_cakeState.step) {
    case 1: stepsContainer.innerHTML = renderCakeStep1(); break;
    case 2: stepsContainer.innerHTML = renderCakeStep2(); break;
    case 3: stepsContainer.innerHTML = renderCakeStep3(); break;
    case 4: stepsContainer.innerHTML = renderCakeStep4(); break;
  }

  // Animate in
  const step = stepsContainer.querySelector('.cake-step');
  if (step) {
    step.style.opacity = '0';
    step.style.transform = 'translateX(20px)';
    requestAnimationFrame(() => {
      step.style.transition = 'all 0.4s var(--ease-out)';
      step.style.opacity = '1';
      step.style.transform = 'translateX(0)';
    });
  }

  // Update progress
  const pct = (_cakeState.step / _cakeState.totalSteps) * 100;
  if (progressFill) progressFill.style.width = `${pct}%`;

  document.querySelectorAll('.cake-progress__step').forEach(s => {
    const sNum = parseInt(s.dataset.step);
    s.classList.toggle('active', sNum === _cakeState.step);
    s.classList.toggle('completed', sNum < _cakeState.step);
  });

  // Update buttons
  if (prevBtn) prevBtn.style.visibility = _cakeState.step > 1 ? 'visible' : 'hidden';
  if (nextBtn) {
    const labels = ['Next: Choose Flavour →', 'Next: Personalise →', 'Next: Review Order →', '🎂 Submit Order'];
    nextBtn.textContent = labels[_cakeState.step - 1];
  }

  // Update cake preview
  updateCakePreview();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function submitCakeOrder() {
  if (!_cakeState.name || !_cakeState.phone || !_cakeState.deliveryDate) {
    showToast('Please fill in your name, phone, and delivery date.', 'error');
    return;
  }

  const btn = document.getElementById('cakeNextBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

  try {
    await submitCustomCakeOrder({
      customer_name: _cakeState.name,
      customer_phone: _cakeState.phone,
      size: _cakeState.size,
      cream_type: _cakeState.frosting,
      sponge_flavour: _cakeState.flavour,
      decoration_theme: _cakeState.shape,
      cake_message: _cakeState.message,
      toppings: _cakeState.decorations,
      delivery_date: _cakeState.deliveryDate,
      special_notes: _cakeState.notes,
      status: 'pending',
    });

    // Send WhatsApp notification to business owners
    sendOrderWhatsAppNotification('custom-cake', {
      name: _cakeState.name,
      phone: _cakeState.phone,
      shape: _cakeState.shape,
      size: _cakeState.size,
      flavour: _cakeState.flavour,
      frosting: _cakeState.frosting,
      message: _cakeState.message,
      decorations: _cakeState.decorations,
      deliveryDate: _cakeState.deliveryDate,
      notes: _cakeState.notes,
    });

    // Redirect to order confirmed page
    const customerName = encodeURIComponent(_cakeState.name);
    window.location.hash = `#/order-confirmed?type=custom-cake&name=${customerName}`;
  } catch (err) {
    showToast('Failed to submit order. Please try again or WhatsApp us.', 'error');
    if (btn) { btn.disabled = false; btn.textContent = '🎂 Submit Order'; }
  }
}

// ── Live Cake Preview ──

const _cakeColors = {
  vanilla: { base: '#FFF8DC', accent: '#F5E6C8', label: '🍦 Vanilla' },
  chocolate: { base: '#6B3A2A', accent: '#8B5E3C', label: '🍫 Chocolate' },
  'red-velvet': { base: '#C0392B', accent: '#E74C3C', label: '❤️ Red Velvet' },
  butterscotch: { base: '#E8A317', accent: '#F4C430', label: '🧈 Butterscotch' },
  strawberry: { base: '#FFB6C1', accent: '#FF69B4', label: '🍓 Strawberry' },
  mango: { base: '#FFD700', accent: '#FFA500', label: '🥭 Mango' },
  pineapple: { base: '#FFEB3B', accent: '#FFC107', label: '🍍 Pineapple' },
  'black-forest': { base: '#3E1F1F', accent: '#5C2E2E', label: '🍒 Black Forest' },
  blueberry: { base: '#6A5ACD', accent: '#9370DB', label: '🫐 Blueberry' },
  coffee: { base: '#795548', accent: '#A1887F', label: '☕ Coffee Mocha' },
};

const _shapeEmojis = {
  round: '⬤', square: '⬛', heart: '💖', tiered: '🎂', custom: '✨',
};

function renderCakePreview() {
  const baseColor = _cakeState.flavour && _cakeColors[_cakeState.flavour] ? _cakeColors[_cakeState.flavour].base : '#F5E6C8';
  const accentColor = _cakeState.flavour && _cakeColors[_cakeState.flavour] ? _cakeColors[_cakeState.flavour].accent : '#EDD9B7';
  const sizeScale = { '0.5kg': 0.55, '1kg': 0.68, '1.5kg': 0.78, '2kg': 0.88, '3kg': 1.0 };
  const scale = _cakeState.size ? (sizeScale[_cakeState.size] || 0.7) : 0.7;

  // Frosting color mapping
  const frostingColors = {
    buttercream: { top: '#FFFDE7', drip: '#FFF9C4' },
    fondant: { top: '#F8F8F8', drip: '#E8E8E8' },
    'cream-cheese': { top: '#FFF8E1', drip: '#FFECB3' },
    'whipped-cream': { top: '#FFFFFF', drip: '#FAFAFA' },
    ganache: { top: '#4E342E', drip: '#3E2723' },
  };
  const frostColor = _cakeState.frosting && frostingColors[_cakeState.frosting]
    ? frostingColors[_cakeState.frosting]
    : { top: '#FFFDE7', drip: '#FFF9C4' };

  const isTiered = _cakeState.shape === 'tiered';
  const isHeart = _cakeState.shape === 'heart';
  const isSquare = _cakeState.shape === 'square';

  // SVG dimensions
  const svgW = 220;
  const svgH = 200;

  // Plate / shadow
  const plateY = svgH - 28;
  const plateRx = 80 * scale;
  const plateRy = 14;

  const frostingTextColor = _cakeState.frosting === 'ganache' ? 'rgba(255,255,255,0.85)' : 'rgba(80,40,20,0.7)';

  if (isTiered) {
    const tiers = [
      { w: 56 * scale, h: 28 * scale, color: accentColor },
      { w: 80 * scale, h: 32 * scale, color: baseColor },
      { w: 110 * scale, h: 36 * scale, color: accentColor },
    ];
    let totalH = tiers.reduce((s,t) => s + t.h, 0) + 8;
    let y = plateY - totalH;

    let tieredSVG = tiers.map((t) => {
      const tierSVG = `
        <rect x="${(svgW - t.w) / 2}" y="${y}" width="${t.w}" height="${t.h}" rx="6" ry="6"
              fill="${t.color}" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>
        ${_cakeState.frosting ? `
          <rect x="${(svgW - t.w) / 2}" y="${y}" width="${t.w}" height="${Math.max(6, t.h * 0.22)}" rx="6" ry="4"
                fill="${frostColor.top}" opacity="0.85"/>
          ${_renderDrips((svgW - t.w) / 2, y + 5, t.w, frostColor.drip, 3, t.h * 0.35)}
        ` : ''}
      `;
      y += t.h + 2;
      return tierSVG;
    }).join('');

    return `
      <div class="cake-preview__visual-wrapper" style="animation: cakeFloat 3s ease-in-out infinite;">
        <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" style="max-width:220px;">
          <defs>
            <filter id="plateShadow"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>
          <!-- Plate shadow -->
          <ellipse cx="${svgW/2}" cy="${plateY + 6}" rx="${plateRx + 10}" ry="${plateRy}" fill="rgba(0,0,0,0.08)" filter="url(#plateShadow)" />
          <!-- Plate -->
          <ellipse cx="${svgW/2}" cy="${plateY}" rx="${plateRx + 6}" ry="${plateRy}" fill="#F5F0EB" stroke="#E8E0D8" stroke-width="1"/>
          <ellipse cx="${svgW/2}" cy="${plateY - 2}" rx="${plateRx - 2}" ry="${plateRy - 3}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
          <!-- Tiers -->
          ${tieredSVG}
          <!-- Top decoration -->
          ${_renderTopDecor(svgW / 2, plateY - totalH - 4, scale)}
          <!-- Decorations -->
          ${_cakeState.decorations.length > 0 ? _renderDecoSparkles(svgW, plateY - totalH / 2, scale) : ''}
        </svg>
        ${_cakeState.message ? `<div class="cake-preview__msg">"${_cakeState.message.substring(0,22)}"</div>` : ''}
      </div>
    `;
  }

  if (isHeart) {
    const heartW = 100 * scale;
    const heartH = 90 * scale;
    const hx = svgW / 2;
    const hy = plateY - heartH / 2 - 10;

    return `
      <div class="cake-preview__visual-wrapper" style="animation: cakeFloat 3s ease-in-out infinite;">
        <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" style="max-width:220px;">
          <defs>
            <filter id="plateShadow"><feGaussianBlur stdDeviation="3" /></filter>
            <clipPath id="heartClip">
              <path d="M${hx},${hy + heartH * 0.85}
                       C${hx - heartW * 0.05},${hy + heartH * 0.6}
                        ${hx - heartW * 0.55},${hy + heartH * 0.4}
                        ${hx - heartW * 0.5},${hy + heartH * 0.15}
                       C${hx - heartW * 0.45},${hy - heartH * 0.15}
                        ${hx - heartW * 0.1},${hy - heartH * 0.15}
                        ${hx},${hy + heartH * 0.15}
                       C${hx + heartW * 0.1},${hy - heartH * 0.15}
                        ${hx + heartW * 0.45},${hy - heartH * 0.15}
                        ${hx + heartW * 0.5},${hy + heartH * 0.15}
                       C${hx + heartW * 0.55},${hy + heartH * 0.4}
                        ${hx + heartW * 0.05},${hy + heartH * 0.6}
                        ${hx},${hy + heartH * 0.85} Z"/>
            </clipPath>
          </defs>
          <!-- Plate shadow -->
          <ellipse cx="${svgW/2}" cy="${plateY + 6}" rx="${plateRx}" ry="${plateRy}" fill="rgba(0,0,0,0.08)" filter="url(#plateShadow)" />
          <!-- Plate -->
          <ellipse cx="${svgW/2}" cy="${plateY}" rx="${plateRx + 2}" ry="${plateRy}" fill="#F5F0EB" stroke="#E8E0D8" stroke-width="1"/>
          <!-- Heart cake body -->
          <rect x="${hx - heartW * 0.55}" y="${hy - heartH * 0.2}" width="${heartW * 1.1}" height="${heartH * 1.1}" rx="0" 
                clip-path="url(#heartClip)"
                fill="${baseColor}" />
          <!-- Heart highlight -->
          <rect x="${hx - heartW * 0.55}" y="${hy - heartH * 0.2}" width="${heartW * 1.1}" height="${heartH * 0.3}" rx="0" 
                clip-path="url(#heartClip)"
                fill="${accentColor}" opacity="0.5"/>
          ${_cakeState.frosting ? `
            <rect x="${hx - heartW * 0.55}" y="${hy - heartH * 0.2}" width="${heartW * 1.1}" height="${heartH * 0.25}" rx="0" 
                  clip-path="url(#heartClip)"
                  fill="${frostColor.top}" opacity="0.7"/>
          ` : ''}
          <!-- Decorations -->
          ${_cakeState.decorations.length > 0 ? _renderDecoSparkles(svgW, hy, scale) : ''}
        </svg>
        ${_cakeState.message ? `<div class="cake-preview__msg">"${_cakeState.message.substring(0,22)}"</div>` : ''}
      </div>
    `;
  }

  // Round, Square, Custom
  const cakeW = 120 * scale;
  const cakeH = 70 * scale;
  const cakeX = (svgW - cakeW) / 2;
  const cakeY = plateY - cakeH - 4;
  const rx = isSquare ? 8 : cakeW / 2;
  const ry = isSquare ? 8 : 10;

  return `
    <div class="cake-preview__visual-wrapper" style="animation: cakeFloat 3s ease-in-out infinite;">
      <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" style="max-width:220px;">
        <defs>
          <filter id="plateShadow"><feGaussianBlur stdDeviation="3" /></filter>
          <linearGradient id="cakeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${accentColor}" />
            <stop offset="100%" stop-color="${baseColor}" />
          </linearGradient>
        </defs>
        <!-- Plate shadow -->
        <ellipse cx="${svgW/2}" cy="${plateY + 6}" rx="${plateRx + 8}" ry="${plateRy}" fill="rgba(0,0,0,0.08)" filter="url(#plateShadow)" />
        <!-- Plate -->
        <ellipse cx="${svgW/2}" cy="${plateY}" rx="${plateRx + 4}" ry="${plateRy}" fill="#F5F0EB" stroke="#E8E0D8" stroke-width="1"/>
        <ellipse cx="${svgW/2}" cy="${plateY - 2}" rx="${plateRx - 4}" ry="${plateRy - 3}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
        <!-- Cake body -->
        <rect x="${cakeX}" y="${cakeY}" width="${cakeW}" height="${cakeH}" rx="${ry}" ry="${ry}"
              fill="url(#cakeGrad)" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>
        <!-- Side texture (layer line) -->
        <line x1="${cakeX + 4}" y1="${cakeY + cakeH * 0.5}" x2="${cakeX + cakeW - 4}" y2="${cakeY + cakeH * 0.5}" 
              stroke="rgba(0,0,0,0.06)" stroke-width="1" stroke-dasharray="3,4"/>
        ${_cakeState.frosting ? `
          <!-- Frosting top -->
          <rect x="${cakeX}" y="${cakeY}" width="${cakeW}" height="${Math.max(10, cakeH * 0.2)}" rx="${ry}" ry="${Math.min(ry, 8)}"
                fill="${frostColor.top}" opacity="0.9"/>
          <!-- Frosting drips -->
          ${_renderDrips(cakeX, cakeY + 8, cakeW, frostColor.drip, 5, cakeH * 0.45)}
        ` : ''}
        <!-- Top decoration -->
        ${_renderTopDecor(svgW / 2, cakeY - 2, scale)}
        <!-- Message on cake -->
        ${_cakeState.message ? `
          <text x="${svgW/2}" y="${cakeY + cakeH * 0.65}" text-anchor="middle" 
                font-size="${Math.max(8, 10 * scale)}" font-style="italic" fill="${frostingTextColor}" 
                font-family="'Playfair Display', serif">"${_cakeState.message.substring(0,18)}"</text>
        ` : ''}
        <!-- Decorations -->
        ${_cakeState.decorations.length > 0 ? _renderDecoSparkles(svgW, cakeY + cakeH / 2, scale) : ''}
      </svg>
    </div>
  `;
}

// ── SVG Helper: Frosting Drips ──
function _renderDrips(startX, topY, width, color, count, maxLen) {
  let drips = '';
  const step = width / (count + 1);
  for (let i = 1; i <= count; i++) {
    const dx = startX + step * i + (Math.sin(i * 7) * 4);
    const len = maxLen * (0.5 + Math.abs(Math.sin(i * 3.7)) * 0.5);
    drips += `<path d="M${dx},${topY} Q${dx + 2},${topY + len * 0.6} ${dx},${topY + len}" 
                    stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  }
  return drips;
}

// ── SVG Helper: Top Decoration (cherry/candle hint) ──
function _renderTopDecor(cx, cy, scale) {
  if (!_cakeState.shape && !_cakeState.flavour) return '';
  const s = Math.max(0.6, scale);
  return `
    <g transform="translate(${cx}, ${cy}) scale(${s})">
      <!-- Candle -->
      <rect x="-2" y="-18" width="4" height="14" rx="2" fill="#FF8A80" opacity="0.9"/>
      <ellipse cx="0" cy="-22" rx="3" ry="5" fill="#FFD54F" opacity="0.9"/>
      <ellipse cx="0" cy="-24" rx="1.5" ry="2.5" fill="#FFFFFF" opacity="0.6"/>
    </g>
  `;
}

// ── SVG Helper: Sparkle Decorations ──
function _renderDecoSparkles(svgW, centerY, scale) {
  const count = Math.min(_cakeState.decorations.length, 6);
  const sparkles = [];
  const positions = [
    { x: 28, y: -15 }, { x: svgW - 28, y: -10 },
    { x: 20, y: 15 }, { x: svgW - 20, y: 20 },
    { x: 45, y: -25 }, { x: svgW - 45, y: -22 },
  ];
  for (let i = 0; i < count; i++) {
    const p = positions[i];
    const delay = i * 0.3;
    sparkles.push(`
      <g transform="translate(${p.x}, ${centerY + p.y})" opacity="0.85">
        <animateTransform attributeName="transform" type="scale" values="1;1.3;1" dur="2s" begin="${delay}s" repeatCount="indefinite" additive="sum"/>
        <path d="M0,-5 L1.2,-1.2 L5,0 L1.2,1.2 L0,5 L-1.2,1.2 L-5,0 L-1.2,-1.2 Z" fill="#D4A853" opacity="0.7">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" begin="${delay}s" repeatCount="indefinite"/>
        </path>
      </g>
    `);
  }
  return sparkles.join('');
}

function updateCakePreview() {
  const visual = document.getElementById('cakePreviewVisual');
  const selections = document.getElementById('cakePreviewSelections');
  if (!visual || !selections) return;

  // Update visual
  visual.innerHTML = renderCakePreview();

  // Update selection tags
  const tags = [];
  if (_cakeState.shape) tags.push(`<span class="cake-preview__tag">${_shapeEmojis[_cakeState.shape] || ''} ${_cakeState.shape}</span>`);
  if (_cakeState.size) tags.push(`<span class="cake-preview__tag">📏 ${_cakeState.size}</span>`);
  if (_cakeState.flavour && _cakeColors[_cakeState.flavour]) tags.push(`<span class="cake-preview__tag">${_cakeColors[_cakeState.flavour].label}</span>`);
  if (_cakeState.frosting) tags.push(`<span class="cake-preview__tag">🧁 ${_cakeState.frosting}</span>`);
  if (_cakeState.message) tags.push(`<span class="cake-preview__tag">✏️ Message</span>`);
  if (_cakeState.decorations.length) tags.push(`<span class="cake-preview__tag">✨ ${_cakeState.decorations.length} decor</span>`);

  selections.innerHTML = tags.length > 0 ? tags.join('') : '<span class="cake-preview__tag cake-preview__tag--empty">Select options to see your cake</span>';
}
