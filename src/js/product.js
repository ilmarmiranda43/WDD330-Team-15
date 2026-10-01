// import { setLocalStorage } from "./utils.mjs";
// import ProductData from "./ProductData.mjs";

// const dataSource = new ProductData("tents");

// function addProductToCart(product) {
//   setLocalStorage("so-cart", product);
// }
// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);

import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

import ExternalServices from "./ExternalServices.mjs";

const dataSource = new ExternalServices("tents");

function animateCartIcon() {
  const cartIcon = document.querySelector(".cart");

  if (!cartIcon) return;

  cartIcon.classList.remove("cart-animate");

  // Forces the browser to restart the animation
  void cartIcon.offsetWidth;

  cartIcon.classList.add("cart-animate");
}


function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") || [];

  const existingProduct = cart.find((item) => item.Id === product.Id);

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  setLocalStorage("so-cart", cart);
  updateCartCount();
  animateCartIcon();
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);

  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

updateCartCount();
