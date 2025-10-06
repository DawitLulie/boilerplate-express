const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware to parse URL-encoded POST bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Root-level logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Serve static assets from /public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve HTML file at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// /now route with chained middleware
app.get('/now', (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => {
  res.json({ time: req.time });
});

// Serve JSON with environment variable option
app.get('/json', (req, res) => {
  let message = 'Hello json';
  if (process.env.MESSAGE_STYLE === "uppercase") {
    message = message.toUpperCase();
  }
  res.json({ message: message });
});

// Echo route for route parameter
app.get('/:word/echo', (req, res) => {
  const word = req.params.word;
  res.json({ echo: word });
});

// /name route handles GET query parameters and POST body
app.route('/name')
  .get((req, res) => {
    const { first, last } = req.query;
    res.json({ name: `${first} ${last}` });
  })
  .post((req, res) => {
    const { first, last } = req.body;
    res.json({ name: `${first} ${last}` });
  });

module.exports = app;
