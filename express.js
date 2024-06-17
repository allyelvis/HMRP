const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware setup
app.use(bodyParser.json());

module.exports = app;
