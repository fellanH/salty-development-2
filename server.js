const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8080;

// Set up CORS to allow your Webflow domain
const corsOptions = {
  origin: 'https://salty-dev.webflow.io'
};

app.use(cors(corsOptions));

// Serve static files (like index.js, index.html, etc.) from the current directory
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
  console.log('Serving files from:', __dirname);
});