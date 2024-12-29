const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const multer = require('multer');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    secure_url: { type: String, required: true },
    stock: { type: Number, default: 0 },
    description: { type: String, required: true },
    tags: { type: [String] },
    size: { type: [String], enum: ['S', 'M', 'L', 'XL'], required: true },  // Size options
    color: { type: [String], required: true },  // Color options
});

// Add index on tags for better query performance
productSchema.index({ tags: 1 });

const Product = mongoose.model('Product', productSchema);

// Batch Upload Products via CSV File
app.post('/api/products/batch-upload', upload.single('csvFile'), (req, res) => {
    const filePath = req.file.path; // Use the dynamically uploaded file path

    const products = [];

    // Parse CSV file
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
            console.log('Parsed Row:', row); // Debug log to see the raw row data

            // Extract and validate fields
            const { name, price, secure_url, stock, description, tags, size, color } = row;

            if (!name || isNaN(price) || !secure_url || isNaN(stock) || !description || !tags || !size || !color) {
                console.error('Invalid Row:', row); // Log invalid rows
                return; // Skip this row if it's missing any required data
            }

            // Split and trim the values for tags, size, and color
            const parsedTags = tags.split(',').map(tag => tag.trim());
            const parsedSize = size.split(',').map(s => s.trim());
            const parsedColor = color.split(',').map(c => c.trim());

            // Cloudinary image upload (if not provided in CSV)
            let cloudinaryImageUrl = secure_url;
            if (!secure_url) {
                try {
                    const result = await cloudinary.uploader.upload(secure_url);
                    cloudinaryImageUrl = result.secure_url;
                } catch (error) {
                    console.error('Cloudinary upload failed:', error);
                    return; // Skip this row if image upload fails
                }
            }

            products.push({
                name,
                price: parseFloat(price),
                secure_url: cloudinaryImageUrl, // Use Cloudinary image URL if uploaded
                stock: parseInt(stock, 10),
                description,
                tags: parsedTags,
                size: parsedSize,
                color: parsedColor,
            });
        })
        .on('end', async () => {
            try {
                if (products.length === 0) {
                    return res.status(400).json({ error: 'No valid products found in CSV file' });
                }

                // Insert the products into the database
                const result = await Product.insertMany(products);
                console.log('Inserted Products:', result);

                // Send a success response
                res.status(201).json({
                    message: 'Products uploaded successfully!',
                    products: result,
                });
            } catch (error) {
                console.error('Error uploading products:', error);
                res.status(500).json({ error: 'Failed to upload products', details: error });
            }
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            res.status(500).json({ error: 'Failed to read CSV file', details: error });
        });
});

// Fetch Products Endpoint
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get Single Product by ID with Related Products
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID format' });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Ensure tags is an array (for safety)
        const tags = Array.isArray(product.tags) ? product.tags : product.tags.split(',').map(tag => tag.trim());

        // Fetch related products based on common tags
        const relatedProducts = await Product.find({
            _id: { $ne: product._id },  // Exclude the current product
            tags: { $in: tags },        // Match any of the tags
        }).limit(4); // Limit related products to a few for better performance

        console.log('Related Products:', relatedProducts); // Debug log to check related products

        res.json({ product, relatedProducts });
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


// Delete all products from MongoDB
app.delete('/api/products/delete-all', async (req, res) => {
    try {
        const result = await Product.deleteMany({});
        res.status(200).json({
            message: 'All products have been deleted successfully!',
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Error deleting products:', error);
        res.status(500).json({ error: 'Failed to delete products', details: error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
