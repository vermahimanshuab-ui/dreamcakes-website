// ═══════════════════════════════════════════════
// ORDER CONFIRMED PAGE — Post-order success
// ═══════════════════════════════════════════════

async function renderOrderConfirmedPage(params) {
  const type = params?.get('type') || 'order';
  const name = params?.get('name') || 'Customer';

  const isCustomCake = type === 'custom-cake';

  return `
    <section class="order-confirmed" id="orderConfirmed">
      <div class="container">
        <div class="order-confirmed__card scroll-fade">
          <!-- Success Animation -->
          <div class="order-confirmed__checkmark">
            <svg class="order-confirmed__svg" viewBox="0 0 120 120" fill="none">
              <circle class="order-confirmed__circle" cx="60" cy="60" r="54" stroke="var(--rose)" stroke-width="4"/>
              <path class="order-confirmed__check" d="M38 62 L52 76 L82 46" stroke="var(--rose)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <div class="order-confirmed__icon">${isCustomCake ? '🎂' : '✅'}</div>
          <h1 class="order-confirmed__title">
            ${isCustomCake ? 'Cake Order Received!' : 'Thank You!'}
          </h1>
          <p class="order-confirmed__subtitle">
            ${isCustomCake 
              ? `Thank you, ${name}! Your custom cake design has been submitted successfully. Our bakers will review your order and reach out within 2-3 hours to confirm.`
              : `Your message has been received, ${name}. We'll get back to you soon!`
            }
          </p>

          <!-- Order Steps -->
          ${isCustomCake ? `
          <div class="order-confirmed__steps">
            <div class="order-step">
              <div class="order-step__icon">📋</div>
              <div class="order-step__label">Order Received</div>
              <div class="order-step__status order-step__status--done">✓</div>
            </div>
            <div class="order-step__line"></div>
            <div class="order-step">
              <div class="order-step__icon">👨‍🍳</div>
              <div class="order-step__label">Baker Review</div>
              <div class="order-step__status order-step__status--pending">⏳</div>
            </div>
            <div class="order-step__line"></div>
            <div class="order-step">
              <div class="order-step__icon">📞</div>
              <div class="order-step__label">Confirmation Call</div>
              <div class="order-step__status order-step__status--pending">⏳</div>
            </div>
            <div class="order-step__line"></div>
            <div class="order-step">
              <div class="order-step__icon">🎉</div>
              <div class="order-step__label">Ready!</div>
              <div class="order-step__status order-step__status--pending">⏳</div>
            </div>
          </div>
          ` : ''}

          <!-- Action Buttons -->
          <div class="order-confirmed__actions">
            <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I just placed a ${isCustomCake ? 'custom cake' : ''} order on your website. My name is ${name}.`)}" 
               target="_blank" rel="noopener" 
               class="btn btn--whatsapp btn--lg">
              💬 Follow Up on WhatsApp
            </a>
            <a href="#/" class="btn btn--secondary btn--lg">
              ← Back to Home
            </a>
          </div>

          <!-- Confetti -->
          <div class="order-confirmed__confetti" id="confetti"></div>
        </div>
      </div>
    </section>
  `;
}

function initOrderConfirmedPage() {
  // Trigger check animation
  setTimeout(() => {
    const svg = document.querySelector('.order-confirmed__svg');
    if (svg) svg.classList.add('animate');
  }, 200);

  // Spawn confetti
  spawnConfetti();
  initScrollAnimations();
}

function spawnConfetti() {
  const container = document.getElementById('confetti');
  if (!container) return;

  const emojis = ['🎉', '🎊', '🎂', '✨', '🍰', '🧁', '⭐'];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'confetti-piece';
    span.textContent = emojis[i % emojis.length];
    span.style.left = `${Math.random() * 100}%`;
    span.style.animationDelay = `${Math.random() * 2}s`;
    span.style.animationDuration = `${2 + Math.random() * 3}s`;
    span.style.fontSize = `${14 + Math.random() * 16}px`;
    container.appendChild(span);
  }
}
