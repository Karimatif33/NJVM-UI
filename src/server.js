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
const crypto = require('crypto');
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const session = require('express-session');
const querystring = require('querystring');
const fetch = require('node-fetch');

const helmet = require("helmet");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler.js');
// const { expressjwt: jwt } = require('express-jwt');
require("dotenv").config();
require("./db/dbConnect.js");


const configa = require('./config');
app.use(errorHandler);
const morganStream = {
  write: (message) => {
    // Write the message to the Winston logger
    logger.info(message.trim());
  },
};











const verifyToken = async (token) => {
  // Replace this with your actual token verification logic
  // and return user information extracted from the token
  return {
    email: 'Username', // Extracted email from the token
    name: 'Name',
    Authorization: 'Authorization',          // Extracted name from the token
              // Extracted name from the token
  };
};

app.post('/api/auth', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
  const username = req.headers['username'];
  const name = req.headers['name'];

  if (!token || !username || !name) {
    return res.status(400).json({ error: 'Missing token or user information' });
  }

  try {
    // Verify token and extract user info
    const { email } = await verifyToken(token);
    const userId = username; // Assuming username is the userId for simplicity

    // Determine user role based on userId
    let role = 'unknown';
    if (/^\d+$/.test(userId)) {
      role = 'student';
    } else if (typeof userId === 'string') {
      role = 'admin';
    }

    // Respond with user info and role
    res.json({
      message: `Hello ${name}, your username is ${username}, your role is ${role}`,
      user: {
        username,
        name,
        email,
        userId,
        role,
        token,
      },
    });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.sendStatus(403); // Forbidden
  }
});





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




// Read your SSL certificate files

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};


// app.on('request', proxy);

app.use(bodyParser.json());
app.use(express.json());



app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://login.microsoftonline.com"],
      // Add other CSP directives as needed
    },
  },
}));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors({
  origin: 'https://njmc.horus.edu.eg',
  allowedHeaders: ['Authorization', 'Content-Type'], // Explicitly allow the Authorization header
  credentials: true // If you are using cookies or credentials
}));

// Routes
app.use("/api/hue/portal/v1", AllRoutes);
app.use("/api/hue/portal/v1", UiRoutes);


app.use(express.static(path.join(__dirname, 'client/build')));

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});



app.post('/getProfileOnBehalfOf', async (req, res) => {
  const token = req.body.token;
  const authHeader = req.headers['authorization'];
console.log(token,authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ error: 'Authorization header missing or invalid' });
  }

  try {
      const profileResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      res.json(profileResponse.data);
      console.log(profileResponse.data)
  } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
  }
});


// console.log("Before setup call");
// tabs.setup(app);
// console.log("After setup call");

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

const port = process.env.PORT
// console.log = function () {};


https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server is running on https://njmc.horus.edu.eg Port - ${port}`);
});