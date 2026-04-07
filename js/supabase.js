// ═══════════════════════════════════════════════
// SUPABASE CLIENT
// Uses the Supabase JS CDN (loaded in index.html)
// ═══════════════════════════════════════════════

let _supabaseClient = null;

function getSupabase() {
  if (!_supabaseClient) {
    _supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  }
  return _supabaseClient;
}

// ── Reviews ──

async function fetchApprovedReviews(productId = null) {
  let query = getSupabase()
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error } = await query;
  if (error) { console.error('Error fetching reviews:', error); return []; }
  return data;
}

async function submitReview({ customer_name, rating, review_text, product_id }) {
  const avatar_initials = customer_name.trim().substring(0, 2).toUpperCase();
  const { data, error } = await getSupabase()
    .from('reviews')
    .insert([{ customer_name, rating, review_text, product_id, avatar_initials }]);

  if (error) { console.error('Error submitting review:', error); throw error; }
  return data;
}

// ── Custom Cake Orders ──

async function submitCustomCakeOrder(orderData) {
  const { data, error } = await getSupabase()
    .from('custom_cake_orders')
    .insert([orderData]);

  if (error) { console.error('Error submitting cake order:', error); throw error; }
  return data;
}

// ── Catering Enquiries ──

async function submitCateringEnquiry(enquiryData) {
  const { data, error } = await getSupabase()
    .from('catering_enquiries')
    .insert([enquiryData]);

  if (error) { console.error('Error submitting enquiry:', error); throw error; }
  return data;
}

// ── WhatsApp Order Notification ──
// Sends order details to all business WhatsApp numbers

async function sendOrderWhatsAppNotification(type, orderData) {
  try {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/functions/v1/notify-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data: orderData }),
    });

    const result = await res.json();

    if (result.success && result.whatsappLinks?.length > 0) {
      // Open WhatsApp to primary number with full order details
      window.open(result.whatsappLinks[0], '_blank');
    }
  } catch (err) {
    // Non-blocking — don't prevent order flow if notification fails
    console.warn('WhatsApp notification error:', err);
  }
}
