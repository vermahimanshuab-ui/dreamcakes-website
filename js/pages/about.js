// ═══════════════════════════════════════════════
// ABOUT US PAGE
// ═══════════════════════════════════════════════

async function renderAboutPage() {
  return `
    <!-- About Hero -->
    <section class="about-hero" id="aboutHero">
      <div class="container">
        <div class="about-hero__content">
          <div class="section-eyebrow" style="justify-content:center; color:var(--rose);">🌸 Our Story</div>
          <h1 class="about-hero__title">Crafted with Passion,<br><span class="highlight">Served with Love</span></h1>
          <p class="about-hero__subtitle">From a small kitchen to Siliguri's favourite bakery — every cake tells our story.</p>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="section section--cream" id="aboutStory">
      <div class="container">
        <div class="about-story scroll-fade">
          <div class="about-story__text">
            <h2 class="section-title">How It All Began</h2>
            <p>Dream Cakes & Cafe was born in ${CONFIG.FOUNDED_YEAR} from a simple belief: everyone deserves a cake that's as special as the moment it celebrates.</p>
            <p>What started as a passion project in a small home kitchen quickly grew into Siliguri's most loved artisan bakery. Our founder's obsession with quality ingredients, innovative flavours, and picture-perfect designs resonated with the community.</p>
            <p>Today, with <strong>two thriving outlets</strong> in New Milanpally and Babupara, we continue to handcraft every cake, pastry, and confection with the same love and attention as Day 1.</p>
          </div>
          <div class="about-story__visual">
            <div class="about-story__image-card">
              <div class="about-story__image-placeholder">
                <span>🎂</span>
                <p>Our Story</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Values -->
    <section class="section section--blush" id="aboutValues">
      <div class="container">
        <div class="section-header section-header--center scroll-fade">
          <h2 class="section-title">What We Stand For</h2>
          <p class="section-subtitle">The pillars behind every slice</p>
        </div>
        <div class="grid grid-4 about-values scroll-fade">
          <div class="about-value-card hover-lift">
            <div class="about-value-card__icon">🌾</div>
            <h3 class="about-value-card__title">Premium Ingredients</h3>
            <p class="about-value-card__desc">Imported Belgian chocolate, Madagascar vanilla, and locally sourced seasonal fruits. No shortcuts, ever.</p>
          </div>
          <div class="about-value-card hover-lift">
            <div class="about-value-card__icon">🤲</div>
            <h3 class="about-value-card__title">Handcrafted Daily</h3>
            <p class="about-value-card__desc">Every item is made fresh each morning by our team of skilled pastry chefs. No mass production.</p>
          </div>
          <div class="about-value-card hover-lift">
            <div class="about-value-card__icon">🎨</div>
            <h3 class="about-value-card__title">Artistic Design</h3>
            <p class="about-value-card__desc">From elegant minimalist cakes to elaborate themed creations — each is a work of art.</p>
          </div>
          <div class="about-value-card hover-lift">
            <div class="about-value-card__icon">💚</div>
            <h3 class="about-value-card__title">Community First</h3>
            <p class="about-value-card__desc">We're proud to be Siliguri's neighbourhood bakery. Your celebrations are our privilege.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Numbers -->
    <section class="section section--espresso about-numbers" id="aboutNumbers">
      <div class="container">
        <div class="grid grid-4 text-center scroll-fade">
          <div class="stat-item">
            <div class="stat-item__number">5000+</div>
            <div class="stat-item__label stat-item__label--rose">Happy Customers</div>
          </div>
          <div class="stat-item">
            <div class="stat-item__number">200+</div>
            <div class="stat-item__label stat-item__label--teal">Unique Designs</div>
          </div>
          <div class="stat-item">
            <div class="stat-item__number">2</div>
            <div class="stat-item__label stat-item__label--gold">Locations</div>
          </div>
          <div class="stat-item">
            <div class="stat-item__number">4.9★</div>
            <div class="stat-item__label stat-item__label--rose">Google Rating</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Visit CTA -->
    <section class="section section--cream" id="aboutCTA">
      <div class="container text-center scroll-fade">
        <h2 class="section-title">Come Visit Us!</h2>
        <p class="section-subtitle" style="margin-bottom: var(--space-xl);">Find us at our two locations in Siliguri — walk-ins always welcome!</p>
        <div class="about-cta-buttons">
          <a href="#/menu" class="btn btn--primary btn--lg">Explore Menu →</a>
          <a href="#/custom-cake" class="btn btn--secondary btn--lg">Design a Cake ✨</a>
          <a href="#/contact" class="btn btn--ghost btn--lg" style="color:var(--espresso); border-color:var(--espresso);">📍 Find Our Stores</a>
        </div>
      </div>
    </section>
  `;
}

function initAboutPage() {
  initScrollAnimations();
}
