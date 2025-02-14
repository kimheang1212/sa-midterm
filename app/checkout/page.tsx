"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define TypeScript Interface for Cart Item
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [error, setError] = useState("");
  const [botToken, setBotToken] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const router = useRouter();

  // Load cart items and bot settings from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCartItems(JSON.parse(storedCart));

    // Load bot settings
    const storedBotToken = localStorage.getItem("telegram_bot_token");
    const storedChatId = localStorage.getItem("telegram_chat_id");

    setBotToken(storedBotToken);
    setChatId(storedChatId);
  }, []);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Function to send order summary to Telegram
  const sendOrderToTelegram = async () => {
    if (!botToken || !chatId) {
      alert("Telegram Bot Token or Chat ID is missing. Please set it in Settings.");
      return;
    }

    const parseMode = "HTML";
    const message = `
🛒 <b>New Order Received!</b> 🛒

👤 <b>Customer Details:</b>
👨‍💼 Name: ${name}
📧 Email: ${email}
📍 Address: ${address}
💳 Payment Method: ${paymentMethod}

📦 <b>Order Summary:</b>
${cartItems
  .map(
    (item) =>
      `🔹 <b>${item.title}</b>\n📦 Quantity: ${item.quantity}\n💰 Price: $${(
        item.price * item.quantity
      ).toFixed(2)}`
  )
  .join("\n\n")}

💰 <b>Total Amount:</b> $${totalPrice.toFixed(2)}

✅ <i>Thank you for your order!</i>
`;

    // Correct Telegram API URL
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}&parse_mode=${parseMode}`;

    try {
      await fetch(url, {
        method: "GET",
      });
    } catch (error) {
      console.error("Error sending order to Telegram:", error);
    }
  };

  // Handle Checkout Submission
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !address) {
      setError("All fields are required.");
      return;
    }

    if (!botToken || !chatId) {
      alert("Telegram settings are missing! Please go to settings and add your Bot Token & Chat ID.");
      return;
    }

    // Send order to Telegram
    await sendOrderToTelegram();

    // Simulate order processing
    setTimeout(() => {
      alert("Order placed successfully!");
      localStorage.removeItem("cart"); // Clear cart
      router.push("/"); // Redirect to homepage
    }, 1000);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link href="/" className="text-blue-500">
            Go back to shopping.
          </Link>
        </p>
      ) : (
        <div>
          {/* Order Summary */}
          <div className="border p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2 mb-2"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-contain mr-3"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <h3 className="text-xl font-bold mt-3">
              Total: ${totalPrice.toFixed(2)}
            </h3>
          </div>

          {/* Checkout Form */}
          <form
            onSubmit={handleCheckout}
            className="space-y-4 border p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold">Billing Details</h3>

            <div>
              <label className="block font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded-lg"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded-lg"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border p-2 rounded-lg"
                placeholder="123 Main St, City, Country"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border p-2 rounded-lg"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
            >
              Place Order
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
