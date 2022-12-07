const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = (process.env.SERVER_PORT || 3000);
const DB_URL = (process.env.DB_URL || 'mongodb://localhost/test')

// Conexión con la BBDD

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
}

// Middleware para extraer datos de peticiones entrantes

app.use(bodyParser.json());

// Importar rutas

const transactionsRoute = require('./routes/transactions');

app.use('/users', transactionsRoute);

// Home's endpoint

app.get('/', (req, res) => {
  res.send('Home')
});

// Configuración del puerto para el servidor de Express

app.listen(port, () => {
  console.log(`App listening on port ${port} and database ${DB_URL}`)
});