require('dotenv').config();
const express = require('express');
const cors = require('cors');           // <--- importa cors
const app = express();
const userRoutes = require('./src/routes/userRoutes');

app.use(express.json());

// <--- activa cors ANTES de usar tus rutas
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// rutas
app.use('/', userRoutes);

const startServer = () => {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
