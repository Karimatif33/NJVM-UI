"use strict";
const config = require("config");
const msal = require("@azure/msal-node");
const fetch = require('node-fetch');
const path = require('path');
const express = require("express");

module.exports.setup = function (app) {
    console.log("Taps file conected ")
  // Configure the view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));

  // Configure the middleware
  app.use(express.urlencoded({ extended: true, limit: '5MB' }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Define API routes
  app.get("/configure", function (req, res) {
    res.render("configure", { title: "Configure" });
    console.log("Configuration success");
  });

  app.get("/ssodemo", function (req, res) {
    // res.set('Cache-Control', 'no-store');
    // res.render("ssoDemo");
    console.log("Aaaaaaaaaaaaaaaaaaaaaaddddddddddddddddd")
  });
  

  app.get("/auth-start", function (req, res) {
    const clientId = config.get("tab.appId");
    res.render("auth-start", { clientId: clientId });
  });

  app.get("/auth-end", function (req, res) {
    const clientId = config.get("tab.appId");
    res.render("auth-end", { clientId: clientId });
  });

  app.post("/getProfileOnBehalfOf", function (req, res) {
    const tid = req.body.tid;
    const token = req.body.token;
    const scopes = ["https://graph.microsoft.com/User.Read"];

    const msalClient = new msal.ConfidentialClientApplication({
      auth: {
        clientId: config.get("tab.appId"),
        clientSecret: config.get("tab.appPassword"),
      },
    });

    msalClient.acquireTokenOnBehalfOf({
      authority: `https://login.microsoftonline.com/${tid}`,
      oboAssertion: token,
      scopes: scopes,
      skipCache: true,
    })
    .then((result) => {
      return fetch("https://graph.microsoft.com/v1.0/me/", {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: "bearer " + result.accessToken,
        },
      });
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw `Error ${response.status}: ${response.statusText}`;
      }
    })
    .then(async (profile) => {
      const code = profile.mail.split('@')[0];
      const loggedUser = await login(code);

      if (loggedUser?.type) {
        const { type, data } = loggedUser;

        if (type === 'ADMIN') {
          req.session.username = data.enName;
          req.session.code = data.code;
          req.session.userId = data.id;
          req.session.role = type;
        } else if (type === 'STUDENT') {
          req.session.username = data.enName;
          req.session.code = data.Code;
          req.session.userId = data.ID;
          req.session.role = type;
          req.session.studentId = data.ID;
          req.session.facultyId = data.FacultyID;
          req.session.courseId = data.CourseID;
        }

        if (req.session.studentId) {
          await updateStudentData(req.session.studentId);
        }

        res.json(profile);
      } else {
        res.status(404).json({ error: "404 not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.errorCode });
    });
  });

  app.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect('/');
    });
  });

  // Serve React app for any other routes
  app.use(express.static(path.join(__dirname, '..', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });

  process.on('uncaughtException', (error) => {
    process.exit();
  });
};
