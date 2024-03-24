const express = require('express');
require('dotenv').config();
// console.log(process.env.JWT_SECRET);
const mongoose = require('mongoose');
const cors = require('cors');
const webRoutes = require('./routes/webRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();

// middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({credentials:true, origin: 'http://localhost:3000'}));
app.use(express.json());


const dbURI = process.env.DB_URL;
mongoose.connect(dbURI)
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

// app.get('*', checkUser);



app.use(webRoutes);