require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Endpoint to fetch images
app.get('/api/images', async (req, res) => {
    try {
        // Use the correct expression to fetch images from the folder 'brainchildMerch'
        const response = await cloudinary.search
            .expression('folder:brainchildMerch') // Specify the folder name
            .execute();

        // Respond with the fetched images
        res.json(response.resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
