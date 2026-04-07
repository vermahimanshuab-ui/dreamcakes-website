// ═══════════════════════════════════════════════
// SHOPIFY STOREFRONT API CLIENT
// ═══════════════════════════════════════════════

async function shopifyFetch(query, variables = {}) {
  try {
    const res = await fetch(CONFIG.SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': CONFIG.STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
    const data = await res.json();
    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }
    return data;
  } catch (err) {
    console.error('Shopify fetch failed:', err);
    throw err;
  }
}

// ── GRAPHQL QUERIES ──

const SHOPIFY_QUERIES = {
  // Fetch products by collection handle
  GET_COLLECTION_PRODUCTS: `
    query GetCollectionProducts($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        title
        description
        products(first: $first, after: $after) {
          pageInfo { hasNextPage endCursor }
          edges {
            node {
              id
              title
              handle
              description
              tags
              productType
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              images(first: 4) {
                edges { node { url altText width height } }
              }
              variants(first: 10) {
                edges {
                  node {
                    id title
                    price { amount currencyCode }
                    availableForSale
                    selectedOptions { name value }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  // Fetch single product by handle
  GET_PRODUCT: `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id title handle description descriptionHtml tags productType
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        images(first: 8) {
          edges { node { url altText width height } }
        }
        variants(first: 20) {
          edges {
            node {
              id title
              price { amount currencyCode }
              availableForSale
              selectedOptions { name value }
            }
          }
        }
        metafields(identifiers: [
          { namespace: "custom", key: "ingredients" },
          { namespace: "custom", key: "allergens" }
        ]) {
          key value
        }
      }
    }
  `,

  // Search products
  SEARCH_PRODUCTS: `
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id title handle description tags productType
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 1) {
              edges { node { url altText } }
            }
            variants(first: 5) {
              edges {
                node { id title price { amount } availableForSale }
              }
            }
          }
        }
      }
    }
  `,

  // Cart mutations
  CREATE_CART: `
    mutation CreateCart {
      cartCreate {
        cart {
          id checkoutUrl totalQuantity
          cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
          lines(first: 20) {
            edges {
              node {
                id quantity
                cost { totalAmount { amount } }
                merchandise {
                  ... on ProductVariant {
                    id title
                    price { amount }
                    product {
                      title handle
                      images(first: 1) { edges { node { url } } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  ADD_TO_CART: `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id checkoutUrl totalQuantity
          cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
          lines(first: 20) {
            edges {
              node {
                id quantity
                cost { totalAmount { amount } }
                merchandise {
                  ... on ProductVariant {
                    id title
                    price { amount }
                    product {
                      title handle
                      images(first: 1) { edges { node { url } } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  UPDATE_CART_LINE: `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id checkoutUrl totalQuantity
          cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
          lines(first: 20) {
            edges {
              node {
                id quantity
                cost { totalAmount { amount } }
                merchandise {
                  ... on ProductVariant {
                    id title
                    price { amount }
                    product {
                      title handle
                      images(first: 1) { edges { node { url } } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  REMOVE_CART_LINE: `
    mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id checkoutUrl totalQuantity
          cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
          lines(first: 20) {
            edges {
              node {
                id quantity
                cost { totalAmount { amount } }
                merchandise {
                  ... on ProductVariant {
                    id title
                    price { amount }
                    product {
                      title handle
                      images(first: 1) { edges { node { url } } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  APPLY_DISCOUNT: `
    mutation ApplyDiscount($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          id checkoutUrl totalQuantity
          cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
          discountCodes { applicable code }
        }
      }
    }
  `,

  // Fetch cart
  GET_CART: `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id checkoutUrl totalQuantity
        cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
        discountCodes { applicable code }
        lines(first: 20) {
          edges {
            node {
              id quantity
              cost { totalAmount { amount } }
              merchandise {
                ... on ProductVariant {
                  id title
                  price { amount }
                  product {
                    title handle
                    images(first: 1) { edges { node { url } } }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
};
