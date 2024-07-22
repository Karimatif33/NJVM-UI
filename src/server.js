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
const querystring = require('querystring');
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const cookieSession = require('cookie-session');
const session = require('express-session');
const helmet = require("helmet");
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler.js');
// const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');



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





// ///////////////////////////
// Configure express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));


// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());


passport.use(new OIDCStrategy(configa.creds,
  function(iss, sub, profile, accessToken, refreshToken, done) {
    console.log('OIDCStrategy callback:');
    console.log('Issuer:', iss);
    console.log('Subject:', sub);
    console.log('Profile:', profile);
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('ID Token:', params.id_token);

    if (!profile.oid) {
      return done(new Error("No OID found"), null);
    }
    // Store the user profile and tokens in session
    req.session.userProfile = profile;
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
    req.session.idToken = params.id_token;
    return done(null, profile);
  }
));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Define routes
app.get('/login', (req, res, next) => {
  passport.authenticate('azuread-openidconnect', {
    failureRedirect: '/'
  })(req, res, next);
});

app.post('/auth-end', (req, res, next) => {
  passport.authenticate('azuread-openidconnect', {
    failureRedirect: '/'
  })(req, res, next, () => {
    res.redirect('/');
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


// Route to handle authentication
app.post('/api/auth', (req, res) => {
  const userData = req.user; // Extracted user data from the token

  console.log('User data from token:', userData); // Debug log

  res.status(200).json({
    message: 'Token is valid and user data is extracted',
    userData: userData
  });
});


// ////////////////////

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




// Read your SSL certificate files

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};


// app.on('request', proxy);

app.use(bodyParser.json());
app.use(express.json());
// app.use(cors());
// app.use(helmet());
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


// tabs.setup(app);



const port = 443
// console.log = function () {};


https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server is running on https://njmc.horus.edu.eg Port - ${port}`);
});