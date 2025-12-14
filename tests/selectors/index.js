module.exports = {
  home: {
    productCards: '#tbodyid .card',
    productLinks: '#tbodyid .card-title a',
  },
  product: {
    content: '.product-content',
    addToCartBtn: 'a.btn-success:has-text("Add to cart")',
  },
  cart: {
    link: '#cartur',
    items: '#tbodyid tr',
    placeOrderBtn: 'button:has-text("Place Order")',
  },
  checkout: {
    modal: '#orderModal',
    name: '#name',
    country: '#country',
    city: '#city',
    card: '#card',
    month: '#month',
    year: '#year',
    purchaseBtn: 'button:has-text("Purchase")',
  },
  confirmation: {
    modal: '.sweet-alert',
    title: '.sweet-alert h2',
    okBtn: '.confirm.btn-lg',
  },
};
