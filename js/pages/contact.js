// ═══════════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════════

async function renderContactPage() {
  return `
    <!-- Contact Hero -->
    <section class="contact-hero" id="contactHero">
      <div class="container">
        <div class="section-eyebrow" style="justify-content:center; color:var(--rose);">📬 Get in Touch</div>
        <h1 class="contact-hero__title">We'd Love to Hear from You</h1>
        <p class="contact-hero__subtitle">Questions, bulk orders, catering enquiries — or just want to say hello!</p>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="section section--cream contact-content" id="contactContent">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="contact-form-wrapper scroll-fade">
            <h2 class="contact-form__title">Send Us a Message</h2>
            <form class="contact-form" id="contactForm" onsubmit="handleContactSubmit(event)">
              <div class="contact-form__row">
                <div class="form-group">
                  <label class="form-label">Full Name *</label>
                  <input type="text" class="form-input" id="contactName" required placeholder="Your name">
                </div>
                <div class="form-group">
                  <label class="form-label">Phone *</label>
                  <input type="tel" class="form-input" id="contactPhone" required placeholder="10-digit mobile">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="contactEmail" placeholder="your@email.com">
              </div>
              <div class="form-group">
                <label class="form-label">Enquiry Type</label>
                <select class="form-select" id="contactType">
                  <option value="general">General Question</option>
                  <option value="bulk-order">Bulk / Corporate Order</option>
                  <option value="catering">Catering Enquiry</option>
                  <option value="custom-cake">Custom Cake</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Message *</label>
                <textarea class="form-textarea" id="contactMessage" required placeholder="Tell us what's on your mind..." rows="5"></textarea>
              </div>
              <button type="submit" class="btn btn--primary btn--lg btn--full" id="contactSubmitBtn">
                Send Message →
              </button>
            </form>
          </div>

          <!-- Contact Info Sidebar -->
          <div class="contact-sidebar scroll-fade">
            <!-- Quick Actions -->
            <div class="contact-info-card">
              <h3 class="contact-info-card__title">Quick Contact</h3>
              <div class="contact-info-card__items">
                <a href="tel:+91${CONFIG.BUSINESS_PHONE}" class="contact-link">
                  <span class="contact-link__icon">📞</span>
                  <div>
                    <strong>Call Us</strong>
                    <span>+91 ${CONFIG.BUSINESS_PHONE}</span>
                  </div>
                </a>
                <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I have a question about Dream Cakes & Cafe')}" target="_blank" class="contact-link">
                  <span class="contact-link__icon">💬</span>
                  <div>
                    <strong>WhatsApp</strong>
                    <span>Chat with us instantly</span>
                  </div>
                </a>
                <a href="mailto:${CONFIG.BUSINESS_EMAIL}" class="contact-link">
                  <span class="contact-link__icon">✉️</span>
                  <div>
                    <strong>Email</strong>
                    <span>${CONFIG.BUSINESS_EMAIL}</span>
                  </div>
                </a>
              </div>
            </div>

            <!-- Locations -->
            ${CONFIG.LOCATIONS.map((loc, i) => `
              <div class="contact-info-card">
                <h3 class="contact-info-card__title">${i === 0 ? '🏠' : '🏪'} ${loc.name}</h3>
                <p class="contact-info-card__address">${loc.address}</p>
                <div class="contact-info-card__actions">
                  <a href="${loc.mapsUrl}" target="_blank" class="btn btn--primary btn--sm">📍 Directions</a>
                  <a href="tel:+91${loc.phone}" class="btn btn--secondary btn--sm">📞 ${loc.phone}</a>
                </div>
              </div>
            `).join('')}

            <!-- Hours -->
            <div class="contact-info-card">
              <h3 class="contact-info-card__title">🕐 Opening Hours</h3>
              <div class="contact-hours">
                <div class="contact-hours__row"><span>Monday – Saturday</span><strong>9:00 AM – 9:00 PM</strong></div>
                <div class="contact-hours__row"><span>Sunday</span><strong>10:00 AM – 8:00 PM</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Maps Section -->
    <section class="section section--blush contact-maps" id="contactMaps">
      <div class="container">
        <div class="section-header section-header--center scroll-fade">
          <h2 class="section-title">Find Our Stores</h2>
        </div>
        <div class="locations__grid scroll-fade">
          ${CONFIG.LOCATIONS.map((loc, i) => `
            <div class="location-card">
              <div class="location-card__map">
                <iframe src="${loc.mapsEmbed}" width="100%" height="250" 
                  style="border:0; border-radius:16px 16px 0 0;" 
                  allowfullscreen="" loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
              <div class="location-card__info">
                <div class="location-card__badge">${i === 0 ? '🏠 Main Outlet' : '🏪 Branch'}</div>
                <h3 class="location-card__name">${loc.name}</h3>
                <p class="location-card__address">${loc.address}</p>
                <div class="location-card__actions">
                  <a href="${loc.mapsUrl}" target="_blank" rel="noopener" class="btn btn--primary btn--sm">📍 Get Directions</a>
                  <a href="tel:+91${loc.phone}" class="btn btn--secondary btn--sm">📞 ${loc.phone}</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function initContactPage() {
  initScrollAnimations();
}

async function handleContactSubmit(event) {
  event.preventDefault();

  const btn = document.getElementById('contactSubmitBtn');
  const name = document.getElementById('contactName')?.value.trim();
  const phone = document.getElementById('contactPhone')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  const type = document.getElementById('contactType')?.value;
  const message = document.getElementById('contactMessage')?.value.trim();

  if (!name || !phone || !message) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

  try {
    await submitCateringEnquiry({
      name: name,
      phone: phone,
      event_type: type,
      message: `${email ? '[Email: ' + email + '] ' : ''}${message}`,
      status: 'new',
    });

    // Send WhatsApp notification to business owners
    sendOrderWhatsAppNotification('enquiry', {
      name: name,
      phone: phone,
      email: email || 'N/A',
      type: type,
      message: message,
    });

    // Success
    const form = document.getElementById('contactForm');
    if (form) {
      form.innerHTML = `
        <div class="contact-success">
          <div class="contact-success__icon">✅</div>
          <h3 class="contact-success__title">Message Sent!</h3>
          <p class="contact-success__text">Thank you, ${name}! We'll get back to you within 24 hours.</p>
          <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I just submitted a contact form on your website.')}" 
             target="_blank" class="btn btn--whatsapp" style="margin-top: var(--space-md);">
            💬 Follow Up on WhatsApp
          </a>
        </div>
      `;
    }
  } catch (err) {
    showToast('Failed to send message. Please try WhatsApp instead.', 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
  }
}
