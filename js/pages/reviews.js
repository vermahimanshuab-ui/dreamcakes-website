// ═══════════════════════════════════════════════
// REVIEWS PAGE
// ═══════════════════════════════════════════════

async function renderReviewsPage() {
  return `
    <!-- Reviews Hero -->
    <section class="reviews-hero" id="reviewsHero">
      <div class="container">
        <div class="section-eyebrow" style="justify-content:center; color:var(--rose);">❤️ Customer Love</div>
        <h1 class="reviews-hero__title">What Our Customers Say</h1>
        <p class="reviews-hero__subtitle">Real reviews from real people. Your feedback makes us better!</p>
      </div>
    </section>

    <!-- Stats Summary -->
    <section class="section reviews-stats" id="reviewsStats">
      <div class="container">
        <div class="reviews-stats__card scroll-fade">
          <div class="reviews-stats__rating">
            <span class="reviews-stats__number" id="avgRating">4.9</span>
            <div class="reviews-stats__stars">★★★★★</div>
            <span class="reviews-stats__label" id="totalReviewsLabel">Based on all reviews</span>
          </div>
          <div class="reviews-stats__breakdown" id="ratingBreakdown">
            ${[5,4,3,2,1].map(n => `
              <div class="reviews-stats__bar-row">
                <span class="reviews-stats__bar-label">${n}★</span>
                <div class="reviews-stats__bar"><div class="reviews-stats__bar-fill" data-stars="${n}" style="width:0%;"></div></div>
                <span class="reviews-stats__bar-count" data-stars="${n}">0</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Write Review CTA -->
    <section class="section section--cream" id="writeReview">
      <div class="container">
        <div class="reviews-write scroll-fade">
          <div class="reviews-write__header">
            <h2 class="reviews-write__title">Share Your Experience</h2>
            <p class="reviews-write__subtitle">Love our cakes? Let us know! ❤️</p>
          </div>
          <form class="reviews-write__form" id="reviewForm" onsubmit="handleReviewSubmit(event)">
            <div class="reviews-write__form-row">
              <div class="form-group">
                <label class="form-label">Your Name *</label>
                <input type="text" class="form-input" id="reviewName" required placeholder="Your name">
              </div>
              <div class="form-group">
                <label class="form-label">Rating *</label>
                <div class="star-picker" id="starPicker">
                  ${[1,2,3,4,5].map(n => `
                    <button type="button" class="star-picker__star ${n <= 5 ? 'active' : ''}" 
                            data-rating="${n}" 
                            onclick="setReviewRating(${n})">★</button>
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Your Review *</label>
              <textarea class="form-textarea" id="reviewText" required placeholder="What did you love about your experience?" rows="4"></textarea>
            </div>
            <button type="submit" class="btn btn--primary btn--lg" id="reviewSubmitBtn">Submit Review ❤️</button>
          </form>
        </div>
      </div>
    </section>

    <!-- All Reviews Grid -->
    <section class="section section--blush" id="allReviews">
      <div class="container">
        <div class="section-header section-header--center scroll-fade">
          <h2 class="section-title">All Reviews</h2>
        </div>
        <div class="reviews-grid" id="reviewsGrid">
          <div class="skeleton skeleton--card" style="height:200px;"></div>
          <div class="skeleton skeleton--card" style="height:200px;"></div>
          <div class="skeleton skeleton--card" style="height:200px;"></div>
        </div>
        <div class="reviews-empty" id="reviewsEmpty" style="display:none;">
          <p>No reviews yet. Be the first to share your experience! 🎂</p>
        </div>
      </div>
    </section>
  `;
}

let _reviewRating = 5;

async function initReviewsPage() {
  await loadAllReviews();
  initScrollAnimations();
}

function setReviewRating(rating) {
  _reviewRating = rating;
  document.querySelectorAll('.star-picker__star').forEach(star => {
    const val = parseInt(star.dataset.rating);
    star.classList.toggle('active', val <= rating);
  });
}

async function loadAllReviews() {
  const grid = document.getElementById('reviewsGrid');
  const empty = document.getElementById('reviewsEmpty');
  if (!grid) return;

  try {
    const reviews = await fetchApprovedReviews();

    if (reviews.length === 0) {
      grid.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }

    // Render reviews grid
    grid.innerHTML = reviews.map(r => `
      <div class="review-card-full">
        <div class="review-card-full__header">
          <div class="review-card__avatar">${r.avatar_initials || r.customer_name.substring(0, 2).toUpperCase()}</div>
          <div>
            <div class="review-card-full__name">${r.customer_name}</div>
            <div class="review-card-full__date">${new Date(r.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
          </div>
          <div class="review-card-full__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        </div>
        <p class="review-card-full__text">"${r.review_text}"</p>
      </div>
    `).join('');

    // Update stats
    updateReviewStats(reviews);

    // Stagger animation
    grid.querySelectorAll('.review-card-full').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      setTimeout(() => {
        card.style.transition = 'all 0.4s var(--ease-out)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 60);
    });
  } catch (err) {
    console.error('Failed to load reviews:', err);
    grid.innerHTML = '<p style="text-align:center; color:var(--text-mid); padding:var(--space-2xl);">Could not load reviews. Please try again later.</p>';
  }
}

function updateReviewStats(reviews) {
  const total = reviews.length;
  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);

  const avgEl = document.getElementById('avgRating');
  const labelEl = document.getElementById('totalReviewsLabel');

  if (avgEl) avgEl.textContent = avg;
  if (labelEl) labelEl.textContent = `Based on ${total} review${total !== 1 ? 's' : ''}`;

  // Update breakdown bars
  const counts = { 5:0, 4:0, 3:0, 2:0, 1:0 };
  reviews.forEach(r => { if (counts[r.rating] !== undefined) counts[r.rating]++; });

  Object.entries(counts).forEach(([stars, count]) => {
    const pct = total > 0 ? (count / total) * 100 : 0;
    const fill = document.querySelector(`.reviews-stats__bar-fill[data-stars="${stars}"]`);
    const countEl = document.querySelector(`.reviews-stats__bar-count[data-stars="${stars}"]`);
    if (fill) fill.style.width = `${pct}%`;
    if (countEl) countEl.textContent = count;
  });
}

async function handleReviewSubmit(event) {
  event.preventDefault();

  const btn = document.getElementById('reviewSubmitBtn');
  const name = document.getElementById('reviewName')?.value.trim();
  const text = document.getElementById('reviewText')?.value.trim();

  if (!name || !text) {
    showToast('Please fill in your name and review.', 'error');
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

  try {
    await submitReview({
      customer_name: name,
      rating: _reviewRating,
      review_text: text,
    });

    showToast('Thank you! Your review has been submitted for approval. ❤️', 'success');

    // Reset form
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewText').value = '';
    setReviewRating(5);

    if (btn) { btn.disabled = false; btn.textContent = 'Submit Review ❤️'; }
  } catch (err) {
    showToast('Failed to submit review. Please try again.', 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Submit Review ❤️'; }
  }
}
