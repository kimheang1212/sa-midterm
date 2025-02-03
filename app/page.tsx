"use client";

import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define TypeScript interface for Product
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
}

// Define TypeScript interface for Cart Item
interface CartItem extends Product {
  quantity: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch products from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    // Load cart items from localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Function to add product to cart
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <>
      {/* Header Section */}
      <header className="py-6 px-32 flex justify-between items-center">
        <h1 className="font-bold text-3xl">Logo</h1>
        <div>
          <NavigationMenu>
            <Link href="/cart">
              <NavigationMenuList className="relative cursor-pointer">
                <ShoppingBag width={25} />
                {cartItems.length > 0 && (
                  <span className="bg-red-500 text-white w-5 h-5 rounded-full text-center text-xs flex items-center justify-center absolute top-[-8px] right-[-5px]">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </NavigationMenuList>
            </Link>
          </NavigationMenu>
        </div>
      </header>

      {/* Product Listing */}
      <main className="p-10">
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="border p-4 rounded-lg shadow-md flex flex-col justify-between"
              >
                <div>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-contain mb-4"
                  />
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-gray-600">${product.price}</p>
                </div>
                <Button className="w-full mt-4" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </div>
            ))
          ) : (
            <p>Loading products...</p>
          )}
        </div>
      </main>
    </>
  );
}
