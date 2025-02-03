"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router

// Define TypeScript Interface for Cart Item
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter(); // Initialize Next.js router

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Function to update cart in localStorage
  const updateCartStorage = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // Function to handle quantity increase
  const increaseQuantity = (id: number) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCartStorage(updatedCart);
  };

  // Function to handle quantity decrease
  const decreaseQuantity = (id: number) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0); // Remove item if quantity is 0
    updateCartStorage(updatedCart);
  };

  // Function to remove item from cart
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateCartStorage(updatedCart);
  };

  // Function to handle "Proceed to Checkout"
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    router.push("/checkout"); // Navigate to checkout page
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty. <a href="/" className="text-blue-500">Go back to shopping.</a></p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center border p-4 rounded-lg shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-contain mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="px-3 py-1 border rounded-lg bg-gray-200"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="px-3 py-1 border rounded-lg bg-gray-200"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 px-3 py-1 border rounded-lg bg-red-500 text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6">
            <h3 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h3>
            <button
              onClick={handleCheckout}
              className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
