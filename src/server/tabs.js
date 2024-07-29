"use strict";
const express = require("express");
const path = require('path');

module.exports.setup = function (app) {
    console.log("Taps file connected");

    // Middleware setup
    app.use(express.urlencoded({ extended: true, limit: '5MB' }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // Define API routes with detailed logging
    app.get("/ssoDemo", (req, res) => {
        console.log("Accessed /ssoDemo route");
        res.send("SSO Demo");
    });

    app.get("/test", (req, res) => {
        console.log("Accessed /test route");
        res.send("Test route");
    }); 

    // Serve React app for any other routes
    app.use(express.static(path.join(__dirname, '..', 'build')));

    app.get('*', (req, res) => {
        console.log(`Serving React app for route: ${req.originalUrl}`);
        res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
    });

    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });
};
