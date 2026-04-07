// ═══════════════════════════════════════════════
// DREAM CAKES & CAFE — CONFIGURATION
// ═══════════════════════════════════════════════

const CONFIG = {
  // Shopify Storefront API
  SHOPIFY_DOMAIN: 'j2zhvg-sa.myshopify.com',
  STOREFRONT_TOKEN: 'fae5399097f5a68f1baa24127903337c',
  SHOPIFY_API_VERSION: '2024-04',

  // Supabase
  SUPABASE_URL: 'https://ohbvlswjtkwalaxvrtut.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYnZsc3dqdGt3YWxheHZydHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNDM1MTAsImV4cCI6MjA5MDYxOTUxMH0.Mbk0aaz46O0MBVt-azLXx8egp81FJCTZ3Ls31sdl2Rk',

  // Business Info
  BUSINESS_PHONE: '9064241290',
  BUSINESS_PHONE_2: '7029705013',
  BUSINESS_PHONE_3: '9263464951',
  WHATSAPP_NUMBER: '919064241290',
  BUSINESS_EMAIL: 'dreamcakescafe@gmail.com',

  // Locations
  LOCATIONS: [
    {
      name: 'Dream Cakes — New Milanpally',
      address: 'Road No. 1, New Milanpally, Ward 25, Saktigarh, Siliguri, WB',
      mapsUrl: 'https://maps.app.goo.gl/HJkT4vK4iiKkfzme9',
      mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.8!2d88.4158401!3d26.6993131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4415def439abd%3A0xe1235f9689e3aa24!2sDream%20Cakes%20%26%20Cafe!5e0!3m2!1sen!2sin',
      phone: '9064241290',
    },
    {
      name: 'Dream Cakes — Babupara',
      address: 'Road No. 8, Ward No. 31, Shaktigarh, Upper Colony, Babupara, Siliguri, WB',
      mapsUrl: 'https://maps.app.goo.gl/Pgs5gXaLyzjF59zC8',
      mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.8!2d88.42!3d26.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDream%20Cakes%20Babupara!5e0!3m2!1sen!2sin',
      phone: '7029705013',
    }
  ],

  BUSINESS_ADDRESS: 'Road No. 1, New Milanpally, Ward 25, Saktigarh, Siliguri, WB',
  INSTAGRAM_HANDLE: 'dreamcakescafe',
  FOUNDED_YEAR: '2022',
  OWNER_NAME: 'Dream Cakes',

  // API Endpoint
  get SHOPIFY_API_URL() {
    return `https://${this.SHOPIFY_DOMAIN}/api/${this.SHOPIFY_API_VERSION}/graphql.json`;
  }
};

// Freeze to prevent accidental mutation
Object.freeze(CONFIG);
