export const serviceConfig = {
  users: {
    url: process.env.USERS_URL || 'http://localhost:3001',
    timeout: 10000,
  },
  products: {
    url: process.env.PRODUCTS_URL || 'http://localhost:3002',
    timeout: 10000,
  },
  checkout: {
    url: process.env.CHECKOUT_URL || 'http://localhost:3003',
    timeout: 10000,
  },
  payment: {
    url: process.env.PAYMENT_URL || 'http://localhost:3004',
    timeout: 10000,
  },
} as const;
