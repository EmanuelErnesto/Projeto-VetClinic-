const express = require('express');
const app = express();
const router = require('./Infrastructure/Routes/router');
require("dotenv").config()

const PORT = process.env.PORT;
const petModel = require('./Infrastructure/database/Models/pet.model')
const tutorModel = require('./Infrastructure/database/Models/tutor.model')


// db
const db = require('./Infrastructure/database/Connection/connection');
db()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// rotas
app.get('/', (req, res) => {
  res.send('Rota funcionando')
})

app.use('/api', router)


app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`);
})

