export const MESSAGES = {
  auth: {
    invalidCredentials: 'Invalid email or password',
    emailNotVerified: 'Email not verified',
    emailVerified: 'Email verified successfully',
    emailVerificationFailed: 'Invalid or expired verification link',
  },

  user: {
    notFound: 'User not found',
    alreadyExists: 'User already exists',
    forbidden: 'Access denied',
  },

  product: {
    notFound: 'Product not found',
    insufficientStock: 'Insufficient stock available',
    created: 'Product created successfully',
    updated: 'Product updated successfully',
    deleted: 'Product deleted successfully',
  },

  cart: {
    notFound: 'Cart not found',
    empty: 'Cart is empty',
    itemNotFound: 'Item not found in cart',
    invalidQuantity: 'Invalid quantity',
    itemAdded: 'Item added to cart',
    itemUpdated: 'Cart item updated successfully',
    itemDeleted: 'Cart item removed successfully',
  },

  common: {
    notImplementedYet: 'Not implemented yet',
  },

  email: {
    verifySubject: 'Verify your email address',
    verifyTitle: 'Welcome! Please confirm your email',
    verifyInstruction: 'Click the link below to verify your account:',
    verifyLinkText: 'Verify my email',
  },

  order: {
    created: 'Order created sucessfully',
    notFound: 'Order not found',
    forbidden: 'Acess forbidden',
  },
};
