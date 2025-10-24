require('dotenv').config();
const express = require('express');
const cors = require("cors");
const app = express();
const userRoutes = require('./src/routes/userRoutes');

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:8080"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

app.use('/', userRoutes);

const startServer = () => {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT,"0.0.0.0", () => {
    console.log(`🚀 Server is running on http://api:${PORT} CORS ENABLE`);
  });
  return server;
};

// This ensures that the server starts when you run `node index.js`
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
