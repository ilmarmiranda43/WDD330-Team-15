// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function updateCartCount() {
  const cart = getLocalStorage('so-cart') || [];
  const cartCount = document.querySelector('.cart-count');

  if (!cartCount) {
    return;
  }

  if (cart.length > 0) {
    cartCount.textContent = cart.length;
    cartCount.classList.add('show');
  } else {
    cartCount.textContent = '';
    cartCount.classList.remove('show');
  }
}