document.addEventListener("DOMContentLoaded", () => {
    setupContactForm();
    setupCustomOrderForm();
    setupAddToCartButtons();
    updateCartCount();
    renderCartPage();
    renderCheckoutPage();
    setupCheckoutForm();
});

function setupContactForm() {
    const form = document.querySelector("#contact-form");
    const messageBox = document.querySelector("#contact-form-message");

    if (!form || !messageBox) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const firstName = document.querySelector("#first-name").value.trim();
        const lastName = document.querySelector("#last-name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const message = document.querySelector("#message").value.trim();

        if (!firstName || !lastName || !email || !message) {
            showFormMessage(messageBox, "Please fill out all contact form fields before submitting.", false);
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage(messageBox, "Please enter a valid email address.", false);
            return;
        }

        showFormMessage(messageBox, "Thanks! Your message has been submitted successfully.", true);
        form.reset();
    });
}

function setupCustomOrderForm() {
    const form = document.querySelector("#custom-order-form");
    const messageBox = document.querySelector("#custom-order-message");

    if (!form || !messageBox) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedProduct = document.querySelector('input[name="product"]:checked');
        const details = document.querySelector("#details").value.trim();
        const customerName = document.querySelector("#customer-name").value.trim();
        const customerEmail = document.querySelector("#customer-email").value.trim();

        if (!selectedProduct) {
            showFormMessage(messageBox, "Please choose a product for your custom order.", false);
            return;
        }

        if (!details || !customerName || !customerEmail) {
            showFormMessage(messageBox, "Please complete all custom order fields before submitting.", false);
            return;
        }

        if (!isValidEmail(customerEmail)) {
            showFormMessage(messageBox, "Please enter a valid email address for your custom order.", false);
            return;
        }

        showFormMessage(messageBox, "Thanks! Your custom order request has been submitted successfully.", true);
        form.reset();
    });
}

function setupAddToCartButtons() {
    const buttons = document.querySelectorAll(".add-to-cart-btn");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const item = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: Number(button.dataset.price),
                description: button.dataset.description
            };

            addToCart(item);
            updateCartCount();
            button.textContent = "Added!";
            setTimeout(() => {
                button.textContent = "Add to Cart";
            }, 1200);
        });
    });
}

function getCart() {
    return JSON.parse(localStorage.getItem("vault96Cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("vault96Cart", JSON.stringify(cart));
}

function addToCart(item) {
    const cart = getCart();
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart(cart);
}

function updateCartCount() {
    const cartCount = document.querySelector("#cart-count");
    if (!cartCount) {
        return;
    }

    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

function renderCartPage() {
    const cartItemsContainer = document.querySelector("#cart-items");
    const cartSummaryContainer = document.querySelector("#cart-summary");

    if (!cartItemsContainer || !cartSummaryContainer) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <section class="empty-cart">
                <h2 style="color:#6e6bf0; font-family: Georgia, serif; margin-bottom: 12px;">Your cart is empty.</h2>
                <p style="color:#6e6bf0; margin-bottom: 18px;">Browse products and add something to your cart to continue.</p>
                <a href="products.html" class="main-btn">Go to Shop</a>
            </section>
        `;
        cartSummaryContainer.innerHTML = "";
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item) => `
        <article class="cart-item">
            <div class="cart-item-image"></div>

            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
            </div>

            <div class="cart-item-actions">
                <div class="qty-row">
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">−</button>
                    <span style="color:#6e6bf0; font-weight:700;">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>

                <p style="color:#6e6bf0; font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</p>

                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        </article>
    `).join("");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 6.99 : 0;
    const total = subtotal + shipping;

    cartSummaryContainer.innerHTML = `
        <section class="cart-summary">
            <h2>Order Summary</h2>
            <div class="summary-line">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Shipping</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-line total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>

            <div class="button-row" style="justify-content:flex-start;">
                <a href="checkout.html" class="main-btn">Proceed to Checkout</a>
            </div>
        </section>
    `;
}

function changeQuantity(id, change) {
    const cart = getCart();
    const item = cart.find((cartItem) => cartItem.id === id);

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        const updatedCart = cart.filter((cartItem) => cartItem.id !== id);
        saveCart(updatedCart);
    } else {
        saveCart(cart);
    }

    updateCartCount();
    renderCartPage();
    renderCheckoutPage();
}

function removeFromCart(id) {
    const cart = getCart().filter((item) => item.id !== id);
    saveCart(cart);
    updateCartCount();
    renderCartPage();
    renderCheckoutPage();
}

function renderCheckoutPage() {
    const orderItemsContainer = document.querySelector("#checkout-order-items");
    const orderTotalsContainer = document.querySelector("#checkout-order-totals");

    if (!orderItemsContainer || !orderTotalsContainer) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
        orderTotalsContainer.innerHTML = `<a href="products.html" class="main-btn">Go to Shop</a>`;
        return;
    }

    orderItemsContainer.innerHTML = cart.map((item) => `
        <div class="summary-line">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join("");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 6.99;
    const total = subtotal + shipping;

    orderTotalsContainer.innerHTML = `
        <div class="summary-line">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-line">
            <span>Shipping</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="summary-line total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

function setupCheckoutForm() {
    const form = document.querySelector("#checkout-form");
    const messageBox = document.querySelector("#checkout-message");

    if (!form || !messageBox) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const fullName = document.querySelector("#checkout-name").value.trim();
        const email = document.querySelector("#checkout-email").value.trim();
        const address = document.querySelector("#checkout-address").value.trim();
        const city = document.querySelector("#checkout-city").value.trim();
        const zip = document.querySelector("#checkout-zip").value.trim();
        const card = document.querySelector("#checkout-card").value.trim();

        if (!fullName || !email || !address || !city || !zip || !card) {
            showFormMessage(messageBox, "Please complete all checkout fields before placing your order.", false);
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage(messageBox, "Please enter a valid email address.", false);
            return;
        }

        if (getCart().length === 0) {
            showFormMessage(messageBox, "Your cart is empty.", false);
            return;
        }

        localStorage.removeItem("vault96Cart");
        updateCartCount();
        window.location.href = "order-confirmation.html";
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(messageBox, message, isSuccess) {
    messageBox.textContent = message;
    messageBox.classList.remove("success-message", "error-message");
    messageBox.classList.add(isSuccess ? "success-message" : "error-message");
}