import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext"; // Importing the CartContext
import { toast } from "react-toastify"; // Importing Toastify

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart(); // Access addToCart from CartContext
  const navigate = useNavigate(); // Used for navigation to product details page

  // Fetch product data from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products"); // Ensure the backend is running
        setProducts(response.data); // Set response data to products state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 }); // Add product to cart with quantity of 1
    toast.success(`${product.name} has been added to your cart!`); // Show success Toastify alert
  };

  return (
    <div className="product-carousel-container my-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Our Products</h2>
      <div
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        style={{ scrollBehavior: "smooth" }} // Enable smooth scrolling
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card min-w-[250px] flex-shrink-0 p-4 bg-white rounded-lg shadow-lg"
          >
            <div className="product-image">
              <img
                src={product.secure_url} // Use the Cloudinary URL
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="product-info mt-4">
              <h4 className="text-lg font-semibold">{product.name}</h4>
              <p className="text-gray-700">₦{product.price}</p> {/* Updated currency to Naira */}
              <div className="flex justify-between mt-4">
                <button
                  className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                  onClick={() => navigate(`/product/${product._id}`)} // Navigate to product details page
                >
                  View Details
                </button>
                {/* <button
                  className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => handleAddToCart(product)} // Add to Cart functionality
                >
                  Add to Cart
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;

