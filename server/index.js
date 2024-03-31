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
// app.use(cors());
// // app.use(cors({credentials:true, origin: 'https://glidethrough-frontend.vercel.app'}));
// app.use((req, res, next) => {
  
//   res.setHeader('Access-Control-Allow-Origin', 'https://glidethrough-frontend.vercel.app'); // Change this to your frontend domain
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
//   res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (e.g., cookies)
//   next();
// });
app.use(cors({
  origin: 'https://glidethrough-frontend.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version'],
  credentials: true
}));

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());







const dbURI = process.env.DB_URL;
mongoose.connect(dbURI)
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

// app.get('*', checkUser);

app.use(webRoutes);
