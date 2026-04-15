// INDEX.JS - Cart, GST (18%), Checkout Logic for Portfolio Sales

const GST_RATE = 0.18;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scroll
function scrollToSection(sectionId) {
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        scrollToSection(href);
        navMenu.classList.remove('active');
    });
});

// Add to cart
function addToCart(button) {
    const card = button.closest('.service-card');
    const product = JSON.parse(card.dataset.product);

    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();

    // Visual feedback
    button.textContent = 'Added!';
    setTimeout(() => {
        button.textContent = 'Buy Now';
    }, 1000);
}

// Update cart display
function updateCartDisplay() {
    const cartItemsEl = document.getElementById('cartItems');
    const gstDisplay = document.getElementById('gstDisplay');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartEmpty = document.getElementById('cartEmpty');

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '';
        gstDisplay.style.display = 'none';
        checkoutBtn.style.display = 'none';
        cartEmpty.style.display = 'block';
        return;
    }

    cartEmpty.style.display = 'none';
    let html = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong> 
                    <small>₹${item.price} x ${item.quantity}</small>
                </div>
                <div>
                    ₹${itemTotal}
                    <button onclick="removeFromCart(${index})" style="background:#ff4444;color:white;border:none;border-radius:50%;width:25px;height:25px;cursor:pointer;margin-left:10px;">&times;</button>
                </div>
            </div>
        `;
    });

    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;

    cartItemsEl.innerHTML = html;
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('gst').textContent = `₹${gst.toLocaleString()}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString()}`;

    gstDisplay.style.display = 'block';
    checkoutBtn.style.display = 'block';
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Open/close cart
function openCart() {
    updateCartDisplay();
    cartModal.style.display = 'block';
}

function closeCart() {
    cartModal.style.display = 'none';
}

// Open checkout
function checkout() {
    if (cart.length === 0) return;

    // Populate invoice cart
    const invoiceCart = document.getElementById('invoiceCart');
    let html = '<h3>Order Summary</h3>';
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `<div>${item.name} x${item.quantity}: ₹${itemTotal}</div>`;
    });
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;
    html += `
        <div style="font-weight:bold;margin-top:10px;">
            Subtotal: ₹${subtotal.toLocaleString()}<br>
            GST (18%): ₹${gst.toLocaleString()}<br>
            <span style="font-size:1.2rem;color:#00d4ff;">Total: ₹${total.toLocaleString()}</span>
        </div>
    `;
    invoiceCart.innerHTML = html;

    document.getElementById('invoiceSummary').innerHTML = `Total Payable: ₹${total.toLocaleString()}`;

    checkoutModal.style.display = 'block';
    cartModal.style.display = 'none';
}

function closeCheckout() {
    checkoutModal.style.display = 'none';
}

// Generate invoice
function generateInvoice(event) {
    event.preventDefault();

    const name = document.getElementById('buyerName').value;
    const email = document.getElementById('buyerEmail').value;
    const phone = document.getElementById('buyerPhone').value;

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;

    const invoice = `
        <div class="invoice">
            <h2>GST Invoice - Harshit Sharma Services</h2>
            <p><strong>Seller:</strong> Harshit Sharma, Web Developer</p>
            <p><strong>Buyer:</strong> ${name}, ${email} ${phone ? `(${phone})` : ''}</p>
            <div style="margin:20px 0;">
                ${cart.map(item => `${item.name} x${item.quantity}: ₹${(item.price * item.quantity).toLocaleString()}`).join('<br>')}
            </div>
            <div style="text-align:right;">
                <div>Subtotal: ₹${subtotal.toLocaleString()}</div>
                <div>GST @18%: ₹${gst.toLocaleString()}</div>
                <div style="font-size:1.5rem;font-weight:bold;color:green;">Total: ₹${total.toLocaleString()}</div>
            </div>
            <p style="font-size:0.9rem;margin-top:20px;">Payment: Simulated Success! (Real integration: Razorpay/Stripe)</p>
            <button class="print-btn" onclick="window.print()">Print/Download</button>
            <button class="buy-btn" onclick="completePurchase()" style="margin-left:10px;">Complete Purchase</button>
        </div>
    `;

    document.getElementById('invoiceResult').innerHTML = invoice;
    document.getElementById('invoiceResult').style.display = 'block';
    document.getElementById('checkoutForm').style.display = 'none';
}

// Complete purchase
function completePurchase() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Purchase completed successfully! Thank you for your business. Check email for invoice.');
    closeCheckout();
    updateCartDisplay();
}

// Contact form
function submitContact(event) {
    event.preventDefault();
    alert('Message sent successfully! I&#39;ll respond within 24 hours.');
    event.target.reset();
}

// Close modals on outside click
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

