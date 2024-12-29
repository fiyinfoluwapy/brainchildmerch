import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // Import CartProvider
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection'; 
import AdventureWB from './components/AdventureWB'; 
import Perks from './components/perks'; 
import ProductCarousel from './components/ProductCarousel'; 
import ProductDetails from './components/ProductDetails'; 
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch your products from an API or any other source
    const fetchedProducts = [
      // Example of static data for illustration
      { _id: '1', name: 'Product 1', price: 5000, image: '/path/to/image1.jpg' },
      { _id: '2', name: 'Product 2', price: 7000, image: '/path/to/image2.jpg' },
      // Add more products here
    ];
    setProducts(fetchedProducts);
  }, []);

  return (
    <CartProvider> {/* Wrapping with CartProvider */}
      <Router>
        <Navbar />
        <Routes>
          {/* Root path displaying main sections */}
          <Route 
            path="/" 
            element={
              <>
                <HeroSection />
                <AdventureWB />
                <Perks />
                <ProductCarousel products={products} /> {/* Passing products as a prop */}
              </>
            } 
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Fallback for unmatched paths */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
        <ToastContainer /> {/* Adding ToastContainer to show toasts */}
      </Router>
    </CartProvider>
  );
}

export default App;

