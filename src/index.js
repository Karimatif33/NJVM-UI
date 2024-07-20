// "use strict";

// const express = require("express");
// const morgan = require("morgan");
// const logger = require("./model/logger");
// const bodyParser = require("body-parser");
// const AllRoutes = require("./routes/AllRoutes");
// const UiRoutes = require("./routes/UiRoutes");
// const fs = require("fs");
// const path = require("path");
// const app = express();

// const logStream = fs.createWriteStream("output.log", { flags: "a" });

// // if that is not commented the thirminal not gona work
// // process.stdout.write = logStream.write.bind(logStream);
// // process.stderr.write = logStream.write.bind(logStream);



// const morganStream = {
//   write: (message) => {
//     // Write the message to the Winston logger
//     logger.info(message.trim());
//   },
// };

// // Set up Morgan middleware with the custom stream
// app.use(morgan("combined", { stream: morganStream }));

// // Set up CORS middleware
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Specify the allowed HTTP methods
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Specify the allowed headers
//   if (req.method === "OPTIONS") {
//     res.sendStatus(200); // Respond to preflight requests
//   } else {
//     next();
//   }
// });

// // Body parser middleware
// app.use(bodyParser.json());
// app.use(express.json());

// // Routes
// app.use("/api/hue/portal/v1", AllRoutes);
// app.use("/api/hue/portal/v1", UiRoutes);

// module.exports = app;


