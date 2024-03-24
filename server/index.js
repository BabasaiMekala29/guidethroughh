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
app.use(cors());
app.use(cors({credentials:true, origin: 'https://glidethrough-frontend.vercel.app'}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', 'https://glidethrough-frontend.vercel.app')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}




const dbURI = process.env.DB_URL;
mongoose.connect(dbURI)
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

// app.get('*', checkUser);


module.exports = allowCors(handler)
app.use(webRoutes);
