import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Prepare the cart items to be sent to the server
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1,
  }));
}

// Convert the checkout form data into a JavaScript object
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;

    // Service responsible for communicating with the server
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + item.FinalPrice * (item.quantity || 1),
      0,
    );

    // The subtotal is available as soon as the checkout page loads.
    this.displayItemSummary();
  }

  displayItemSummary() {
    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);

    if (subtotal) {
      subtotal.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    // Tax is 6% of the subtotal
    this.tax = this.itemTotal * 0.06;

    // Count the actual number of items, including duplicate quantities.
    const itemCount = this.list.reduce(
      (total, item) => total + (item.quantity || 1),
      0,
    );

    // Shipping is $10 for the first item
    // and $2 for each additional item.
    if (itemCount > 0) {
      this.shipping = 10 + (itemCount - 1) * 2;
    } else {
      this.shipping = 0;
    }

    // Calculate final order total
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #order-total`,
    );

    if (subtotal) {
      subtotal.textContent = `$${this.itemTotal.toFixed(2)}`;
    }

    if (shipping) {
      shipping.textContent = `$${this.shipping.toFixed(2)}`;
    }

    if (tax) {
      tax.textContent = `$${this.tax.toFixed(2)}`;
    }

    if (orderTotal) {
      orderTotal.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout(form) {
    // Convert the form information into an object
    const order = formDataToJSON(form);

    // Add information calculated by CheckoutProcess
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    // Add products from the shopping cart
    order.items = packageItems(this.list);

    console.log("Order being sent:", order);

    // Send the order to the server
    const response = await this.services.checkout(order);

    console.log("Server response:", response);

    return response;
  }
}
