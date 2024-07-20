"use strict";
const express = require("express");
const https = require("https");
const rateLimit = require('express-rate-limit')
const config = require('config');
const morgan = require("morgan");
const logger = require("./model/logger");
const bodyParser = require("body-parser");
const AllRoutes = require("./routes/AllRoutes");
const UiRoutes = require("./routes/UiRoutes");
const fs = require("fs");
const path = require("path");
const app = express();
const tabs = require('./server/tabs');
const jwt = require('jsonwebtoken');
const helmet = require("helmet");
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');
require("dotenv").config();
require("./db/dbConnect.js");


const morganStream = {
  write: (message) => {
    // Write the message to the Winston logger
    logger.info(message.trim());
  },
};


const limiter = rateLimit({
  windowMs: 15 * 30 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 500 requests per `windowMs` (here, per 15 minutes).
  handler: (req, res, next, options) => {
    const ip = req.ip;
    const timeLeftMs = options.windowMs - (Date.now() - req.rateLimit.resetTime);
    const minutesLeft = Math.floor(timeLeftMs / (60 * 1000));
    const secondsLeft = Math.ceil((timeLeftMs % (60 * 1000)) / 1000);
    const message = `Rate limit exceeded . Try again after ${minutesLeft} minutes and ${secondsLeft} seconds. Or contact your Admin !!`;
    console.log(message); // Log the message

    // Respond with rate limit exceeded message including time left
    res.status(options.statusCode).json({
      message: message,
    });
  },
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// Apply the rate limiting middleware to all requests
// app.use(limiter);

// Set up Morgan middleware with the custom stream
app.use(morgan("combined", { stream: morganStream }));

// Set up CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Specify the allowed HTTP methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Specify the allowed headers
  res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' https://10.11.11.181;");
  if (req.method === "OPTIONS") {
    res.sendStatus(200); // Respond to preflight requests
  } else {
    next();
  }
});

app.use(cookieParser());


// Axios configuration
// const axiosInstance = axios.create({
//   httpsAgent: httpsAgent,
//   baseURL: 'https://njmc.horus.edu.eg', // Base URL for the API
//   headers: {
//     'Accept': 'application/json, text/plain, */*'
//   },
//   transitional: {
//     silentJSONParsing: true,
//     forcedJSONParsing: true,
//     clarifyTimeoutError: false
//   },
//   adapter: ['xhr', 'http', 'fetch'],
//   transformRequest: [null],
//   transformResponse: [null],
//   timeout: 0,
//   xsrfCookieName: 'XSRF-TOKEN',
//   xsrfHeaderName: 'X-XSRF-TOKEN',
//   maxContentLength: -1,
//   maxBodyLength: -1,
// });

// const proxy = createProxyMiddleware({
//   target: 'http://localhost:3000',  // Your React development server URL
//   changeOrigin: true,
// });


// Read your SSL certificate files

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};


// app.on('request', proxy);

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use(helmet({
//   contentSecurityPolicy: false, 
//   // xssFilter: false,
//   hidePoweredBy: true,
//   noSniff: true,
//   referrerPolicy: false, 
//   frameguard: false,
// }));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use("/api/hue/portal/v1", AllRoutes);
app.use("/api/hue/portal/v1", UiRoutes);

// module.exports = app;

// Import routes for handling tabs
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


// tabs.setup(app);



const port = 443
console.log = function () {};


https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server is running on https://njmc.horus.edu.eg Port - ${port}`);
});