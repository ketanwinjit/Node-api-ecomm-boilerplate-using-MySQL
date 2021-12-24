const express = require("express");
const app = express();
const api = require("./api");

/**
 * MIDDLEWARE
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);

module.exports = app;
