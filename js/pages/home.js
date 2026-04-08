// ═══════════════════════════════════════════════
// HOMEPAGE — Screen 01
// ═══════════════════════════════════════════════

async function renderHomePage() {
  return `
    <!-- SECTION 1: CINEMATIC HERO -->
    <section class="hero" id="hero">
      <div class="hero__media">
        <video class="hero__video" autoplay muted loop playsinline preload="auto">
          <source src="assets/hero%20video.mp4" type="video/mp4">
        </video>
        <div class="hero__overlay"></div>
      </div>

      <div class="hero__content hero-slide-up">
        <div class="hero__eyebrow">🌸 Siliguri's Finest Artisan Bakery</div>
        <h1 class="hero__title">
          Baked with Love,<br>
          <span class="highlight">Made for You</span>
        </h1>
        <p class="hero__subtitle">
          Handcrafted cakes, pastries & café delights — freshly made every morning in the heart of Siliguri.
        </p>
        <div class="hero__ctas">
          <a href="#/menu" class="btn btn--primary">Explore Our Menu →</a>
          <a href="#/custom-cake" class="btn btn--ghost">Design Your Cake ✨</a>
        </div>
        <div class="hero__trust">
          <div class="hero__trust-item"><span>⭐</span> 4.9 Rating</div>
          <div class="hero__trust-item"><span>🎂</span> 5000+ Cakes Made</div>
          <div class="hero__trust-item"><span>🚚</span> Free Delivery ₹499+</div>
        </div>
      </div>

      <div class="hero__scroll scroll-chevron" onclick="document.getElementById('categories').scrollIntoView({behavior:'smooth'})">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 13l5 5 5-5M7 7l5 5 5-5"/>
        </svg>
      </div>
    </section>

    <!-- SECTION 2: CATEGORIES STRIP -->
    <section class="section section--cream" id="categories">
      <div class="container">
        <div class="section-header section-header--center scroll-fade">
          <h2 class="section-title">What Are You Craving?</h2>
          <p class="section-subtitle">Explore our handcrafted collections</p>
        </div>
        <div class="categories-scroll" id="categoriesScroll">
          ${renderCategoryCards()}
        </div>
      </div>
    </section>

    <!-- SECTION 3: FEATURED PRODUCTS -->
    <section class="section section--blush" id="featured">
      <div class="container">
        <div class="section-header scroll-fade" style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h2 class="section-title">Today's Favourites</h2>
            <p class="section-subtitle">Freshly baked — updated daily.</p>
          </div>
          <a href="#/menu" class="btn btn--secondary btn--sm" style="flex-shrink:0;">View Full Menu →</a>
        </div>
        <div class="grid grid-4 scroll-fade" id="featuredGrid">
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: STATS STRIP -->
    <section class="section section--espresso stats-strip" id="stats">
      <div class="container">
        <div class="grid grid-4 text-center">
          <div class="stat-item scroll-fade">
            <div class="stat-item__number" data-target="5000" data-suffix="+">0</div>
            <div class="stat-item__label stat-item__label--rose">Cakes Delivered</div>
          </div>
          <div class="stat-item scroll-fade">
            <div class="stat-item__number" data-target="4.9" data-suffix="★" data-decimal="true">0</div>
            <div class="stat-item__label stat-item__label--teal">Average Rating</div>
          </div>
          <div class="stat-item scroll-fade">
            <div class="stat-item__number" data-target="200" data-suffix="+">0</div>
            <div class="stat-item__label stat-item__label--gold">Custom Designs</div>
          </div>
          <div class="stat-item scroll-fade">
            <div class="stat-item__number" data-target="7" data-suffix=" Yrs">0</div>
            <div class="stat-item__label stat-item__label--rose">Baking with Love</div>
          </div>
        </div>
      </div>
    </section>

    <!-- DIVIDER: Separates stats from custom cake CTA -->
    <div class="section-divider" style="height:4px; background: linear-gradient(90deg, var(--cream) 0%, var(--rose-light) 50%, var(--cream) 100%);"></div>

    <!-- SECTION 5: CUSTOM CAKE CTA -->
    <section class="section custom-cta" id="customCta">
      <div class="container">
        <div class="custom-cta__grid scroll-fade">
          <div class="custom-cta__content">
            <div class="custom-cta__eyebrow">✨ Make It Yours</div>
            <h2 class="custom-cta__title">Design Your<br>Dream Cake</h2>
            <ul class="custom-cta__list">
              <li><span class="custom-cta__check">✓</span> Choose size, cream & flavour</li>
              <li><span class="custom-cta__check">✓</span> Add your personal message & decorations</li>
              <li><span class="custom-cta__check">✓</span> Upload reference images for design</li>
              <li><span class="custom-cta__check">✓</span> We'll call within 30 minutes</li>
            </ul>
            <div class="custom-cta__buttons">
              <a href="#/custom-cake" class="btn btn--primary btn--lg">Start Designing →</a>
              <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to order a custom cake 🎂')}" target="_blank" class="btn btn--ghost btn--lg">💬 WhatsApp Us</a>
            </div>
          </div>
          <div class="custom-cta__visual">
            <div class="custom-cta__image-wrap">
              <div class="custom-cta__placeholder">
                <div class="custom-cta__cake-builder">
                  <div class="custom-cta__cake-layer custom-cta__cake-layer--base">🎂</div>
                  <div class="custom-cta__cake-labels">
                    <span class="custom-cta__label-tag">Shape ✓</span>
                    <span class="custom-cta__label-tag">Flavour ✓</span>
                    <span class="custom-cta__label-tag">Frosting ✓</span>
                    <span class="custom-cta__label-tag">Message ✓</span>
                  </div>
                </div>
                <span class="custom-cta__placeholder-text">Your Dream<br>Starts Here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 6: REVIEWS MARQUEE -->
    <section class="section section--cream reviews-marquee" id="reviewsMarquee">
      <div class="container">
        <div class="section-header section-header--center scroll-fade">
          <h2 class="section-title">What Siliguri Loves ❤️</h2>
        </div>
      </div>
      <div class="marquee-container">
        <div class="marquee-track" id="marqueeTrack">
          <!-- Reviews loaded dynamically -->
        </div>
      </div>
    </section>

    <!-- SECTION 7: FIND US — MAPS SECTION -->
    <section class="section section--cream locations-section" id="locations">
      <div class="container">
        <div class="section-header section-header--center scroll-fade">
          <div class="section-eyebrow" style="justify-content:center;">📍 Visit Us</div>
          <h2 class="section-title">Find a Store Near You</h2>
          <p class="section-subtitle">Two locations in Siliguri — freshly baked happiness awaits!</p>
        </div>
        <div class="locations__grid scroll-fade">
          ${CONFIG.LOCATIONS.map((loc, i) => `
            <div class="location-card">
              <div class="location-card__map">
                <iframe 
                  src="${loc.mapsEmbed}"
                  width="100%" height="220" 
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
        <div class="locations__hours scroll-fade">
          <div class="locations__hours-card">
            <span class="locations__hours-icon">🕐</span>
            <div>
              <strong>Opening Hours</strong>
              <p style="margin:0;">Mon–Sat: 9:00 AM – 9:00 PM &nbsp;·&nbsp; Sunday: 10:00 AM – 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 8: INSTAGRAM CTA -->
    <section class="section section--blush instagram-section" id="instagram">
      <div class="container text-center scroll-fade">
        <h2 class="section-title">Follow Our Journey</h2>
        <p class="section-subtitle" style="margin:0 auto var(--space-xl);">@${CONFIG.INSTAGRAM_HANDLE}</p>
        <div class="instagram-grid" id="instagramGrid">
          ${Array(9).fill('').map(() => `
            <div class="instagram-grid__item">
              <div class="instagram-grid__placeholder">📸</div>
            </div>
          `).join('')}
        </div>
        <a href="https://instagram.com/${CONFIG.INSTAGRAM_HANDLE}" target="_blank" rel="noopener" class="btn btn--primary" style="margin-top:var(--space-xl);">
          Follow on Instagram
        </a>
      </div>
    </section>
  `;
}

function renderCategoryCards() {
  const categories = [
    { emoji: '🎂', name: 'Celebration Cakes', slug: 'celebration-cakes', color: 'var(--rose-light)' },
    { emoji: '🥐', name: 'Pastries & Minis', slug: 'pastries', color: 'var(--teal-light)' },
    { emoji: '🍰', name: 'Cheesecakes', slug: 'cheesecakes', color: 'var(--gold-light)' },
    { emoji: '☕', name: 'Café Items', slug: 'cafe-drinks', color: '#FFF0E3' },
    { emoji: '🧁', name: 'Café Drinks', slug: 'cafe-drinks', color: 'var(--lavender-light)' },
    { emoji: '🍪', name: 'Cookies & Bites', slug: 'cookies', color: 'var(--cream)' },
  ];

  return categories.map(cat => `
    <a href="#/menu?category=${cat.slug}" class="category-card stagger-child" style="background:${cat.color};">
      <div class="category-card__overlay"></div>
      <div class="category-card__name">
        <span class="category-card__emoji">${cat.emoji}</span>
        ${cat.name}
      </div>
    </a>
  `).join('');
}

async function initHomePage() {
  // Video error handling
  const video = document.querySelector('.hero__video');
  if (video) {
    video.addEventListener('error', () => console.warn('Hero video failed to load'));
    const source = video.querySelector('source');
    if (source) {
      source.addEventListener('error', () => console.warn('Hero video source failed to load'));
    }
  }

  // Load featured products from Shopify
  loadFeaturedProducts();

  // Load reviews for marquee
  loadReviewsMarquee();

  // Init count-up
  initCountUp();

  // Init scroll animations
  initScrollAnimations();
}

async function loadFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  try {
    const res = await shopifyFetch(SHOPIFY_QUERIES.GET_COLLECTION_PRODUCTS, {
      handle: 'featured',
      first: 4,
    });
    const products = res.data?.collection?.products?.edges?.map(e => e.node) || [];

    if (products.length > 0) {
      grid.innerHTML = products.map(p => renderProductCard(p)).join('');
    } else {
      // Show placeholder if no Shopify products
      grid.innerHTML = renderPlaceholderProducts();
    }
  } catch {
    grid.innerHTML = renderPlaceholderProducts();
  }
}

function renderPlaceholderProducts() {
  const placeholders = [
    { title: 'Red Velvet Dream', desc: 'Rich red velvet with cream cheese frosting', price: '₹650' },
    { title: 'Chocolate Truffle', desc: 'Dark chocolate ganache with gold leaf', price: '₹750' },
    { title: 'Strawberry Bliss', desc: 'Fresh strawberry layers with whipped cream', price: '₹550' },
    { title: 'Mango Mousse', desc: 'Seasonal mango with mirror glaze', price: '₹700' },
  ];

  return placeholders.map(p => `
    <div class="product-card hover-lift">
      <div class="product-card__image-wrap" style="background: linear-gradient(135deg, var(--rose-light) 0%, var(--gold-light) 100%); display:flex; align-items:center; justify-content:center;">
        <span style="font-size:64px;">🎂</span>
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${p.title}</h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__price">${p.price}</div>
        <button class="btn btn--add-to-cart" onclick="showToast('Connect Shopify to enable cart','error')">🛒 Add to Cart</button>
      </div>
    </div>
  `).join('');
}

async function loadReviewsMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  try {
    const reviews = await fetchApprovedReviews();
    if (reviews.length === 0) return;

    const cards = reviews.map(r => `
      <div class="review-card">
        <div class="review-card__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <p class="review-card__text">"${r.review_text}"</p>
        <div class="review-card__author">
          <div class="review-card__avatar">${r.avatar_initials || r.customer_name.substring(0, 2).toUpperCase()}</div>
          <span class="review-card__name">${r.customer_name}</span>
        </div>
      </div>
    `).join('');

    // Duplicate for seamless loop
    track.innerHTML = cards + cards;

    // Set duration based on number of cards
    const totalWidth = reviews.length * 360; // approx card width + gap
    const speed = 40; // px/s
    track.style.setProperty('--marquee-duration', `${totalWidth / speed}s`);
  } catch (err) {
    console.error('Failed to load reviews:', err);
  }
}

function initCountUp() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const isDecimal = el.dataset.decimal === 'true';
        animateCountUp(el, target, suffix, isDecimal);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-item__number').forEach(el => observer.observe(el));
}

function animateCountUp(el, target, suffix, isDecimal) {
  const duration = 1500;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out expo
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger children if parent is a grid
        const parent = entry.target.closest('.grid');
        if (parent) {
          const children = parent.querySelectorAll('.stagger-child, .product-card, .category-card');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 100);
          });
        }
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.scroll-fade, .stagger-child').forEach(el => {
    observer.observe(el);
  });
}
