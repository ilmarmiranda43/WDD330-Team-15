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

    checkout.calculateOrderTotal();

    try {
        await checkout.checkout(form);
    } catch (error) {
        const errorMessage = document.querySelector("#checkout-error");

        errorMessage.textContent =
            error.message?.message ||
            error.message ||
            "There was a problem processing your order.";

        errorMessage.hidden = false;
    }
});
