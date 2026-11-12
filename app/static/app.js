
let cart = [];

async function loadMenu() {
    const response = await fetch("/api/menu");
    const foods = await response.json();

    const menu = document.getElementById("food-menu");
    menu.innerHTML = "";

    foods.forEach(food => {
        menu.innerHTML += `
            <div class="food-card">
                <h3>${food.name}</h3>
                <p>Price: ₹${food.price}</p>
                <button onclick="addToCart(${food.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

async function addToCart(id) {
    const response = await fetch("/api/menu");
    const foods = await response.json();

    const food = foods.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            quantity: 1
        });
    }

    updateCart();
}

function updateCart() {
    const cartDiv = document.getElementById("cart-items");
    const totalDiv = document.getElementById("total");

    cartDiv.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartDiv.innerText = "Your cart is empty.";
    }

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        cartDiv.innerHTML += `
            <div class="cart-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${subtotal}</span>
                <button onclick="removeItem(${item.id})">-</button>
            </div>
        `;
    });

    totalDiv.innerText = total;
}

function removeItem(id) {
    const item = cart.find(food => food.id === id);

    if (item) {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(food => food.id !== id);
        }
    }

    updateCart();
}

async function placeOrder() {
    if (cart.length === 0) {
        document.getElementById("message").innerText =
            "Please add food items first!";
        return;
    }

    const response = await fetch("/api/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity
            }))
        })
    });

    const result = await response.json();

    document.getElementById("message").innerText =
        result.message + " Total: ₹" + result.total;

    if (response.ok) {
        cart = [];
        updateCart();
    }
}

loadMenu();
