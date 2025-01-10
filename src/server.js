const express = require('express');
const path = require('path');

const app = express();

// Serve the static files from the dist directory
app.use(express.static(path.join(__dirname, 'member-connect/browser')));

// Redirect all requests to index.html (for Angular routing)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'member-connect/browser/index.html'));
});

// Start the app on the default Azure App Service port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
