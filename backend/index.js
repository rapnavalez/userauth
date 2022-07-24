require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const DB_CONNECT = process.env.DB_CONNECT;

const UserAuth = require('./routes/UserAuth');

//middleware
app.use(express.json());

//db connection
mongoose
  .connect(DB_CONNECT, console.log('Connected to DB!'))
  .then((response) => {
    app.listen(PORT, console.log(`Listening to port ${PORT}...`));
  })
  .catch((error) => {
    console.log(error);
  });

app.use(UserAuth);
