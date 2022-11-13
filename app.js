const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Conexión con la BBDD

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/users');
}

// Middleware para extraer datos de peticiones entrantes

app.use(bodyParser.json());

// Importar rutas

const transactionsRoute = require('./routes/transactions');

app.use('/transactions', transactionsRoute);

// Home's endpoint

app.get('/', (req, res) => {
  res.send('Home')
});

// Configuración del puerto para el servidor de Express

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});