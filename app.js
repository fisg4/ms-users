const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const app = express();
const port = (process.env.SERVER_PORT || 3000);
const DB_URL = (process.env.DB_URL || 'mongodb://localhost/test')

// Conexión con la BBDD
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
}

// Middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());

// Importar rutas
const transactionsRoute = require('./routes/transactions');

app.use('/api/v1/users', transactionsRoute);

// Home's endpoint

app.get('/', (req, res) => {
  res.send('Home')
});

// Configuración del puerto para el servidor de Express

app.listen(port, () => {
  console.log(`App listening on port ${port} and database ${DB_URL}`)
});