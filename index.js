const express = require('express');
const app = express();
const uploadRoutes = require('./src/routes/upload.routes.js');
require('dotenv').config();

app.use(uploadRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});
