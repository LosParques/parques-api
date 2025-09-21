require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./src/routes/userRoutes');

app.use(express.json());
app.use('/', userRoutes);

const startServer = () => {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
  return server;
};

// This ensures that the server starts when you run `node index.js`
if (require.main === module) {
  startServer();  // Only start the server when running this file directly
}

// Export both the app and the startServer function for use in tests
module.exports = { app, startServer };
