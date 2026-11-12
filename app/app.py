
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Food menu
food_items = [
    {"id": 1, "name": "Burger", "price": 120},
    {"id": 2, "name": "Pizza", "price": 250},
    {"id": 3, "name": "Sandwich", "price": 100},
    {"id": 4, "name": "French Fries", "price": 80},
    {"id": 5, "name": "Pasta", "price": 180},
    {"id": 6, "name": "Cold Coffee", "price": 90}
]

# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Get food menu
@app.route("/api/menu")
def get_menu():
    return jsonify(food_items)


# Place customer order
@app.route("/api/order", methods=["POST"])
def place_order():

    data = request.get_json()
    items = data.get("items", [])

    if not items:
        return jsonify({"message": "Your cart is empty"}), 400

    total = 0
    order_details = []

    for item in items:
        food = next(
            (f for f in food_items if f["id"] == item["id"]),
            None
        )

        quantity = item.get("quantity", 0)

        if food is None or not isinstance(quantity, int) or isinstance(quantity, bool) or quantity <= 0:
            return jsonify({"message": "Invalid order details"}), 400

        subtotal = food["price"] * quantity
        total += subtotal

        order_details.append({
            "name": food["name"],
            "quantity": quantity,
            "subtotal": subtotal
        })

    return jsonify({
        "message": "Order placed successfully!",
        "items": order_details,
        "total": total
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
