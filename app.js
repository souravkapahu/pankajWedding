const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Path to the public folder
const publicFolderPath = path.join(__dirname, 'public');

// Serve static files
app.use('/public', express.static(publicFolderPath));

// Route to list all files in a specific folder
app.get('/public/:folderName', (req, res) => {
    const folderName = req.params.folderName;
    const folderPath = path.join(publicFolderPath, folderName);

    // Check if the folder exists
    if (fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()) {
        // Read all files in the folder and filter for image types
        const images = fs.readdirSync(folderPath).filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });

        // Generate an HTML page with embedded images
        let html = `
        <h1>Photos in ${folderName}</h1>
        ${images.map(image => `<div><img src="/public/${folderName}/${image}" style="max-width: 100%; margin-bottom: 20px;" alt="${image}"></div>`).join('')}
      `;

        res.send(html);
    } else {
        res.status(404).send('<h1>Folder not found</h1>');
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
