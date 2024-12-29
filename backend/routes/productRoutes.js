// In your routes file
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');  // Assuming Product model is here

// Product details route
router.get('/:id', async (req, res) => {
  const { id } = req.params;  // Product ID passed from the frontend

  // Add validation for ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);  // Fetch product by ID
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);  // Return product data if found
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

