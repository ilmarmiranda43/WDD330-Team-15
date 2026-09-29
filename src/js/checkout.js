import CheckoutProcess from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess("so-cart", "#order-summary");

checkout.init();

const form = document.querySelector("#checkout-form");
const zipInput = form.querySelector("[name=\"zip\"]");

// BYU activity requirement: calculate tax, shipping, and order total
// after the user finishes entering the ZIP code.
zipInput.addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Recalculate once more before sending so the submitted values are current.
  checkout.calculateOrderTotal();

  try {
    const response = await checkout.checkout(form);

    console.log("Checkout successful:", response);
  } catch (error) {
    console.error("Checkout error:", error);
  }
});
