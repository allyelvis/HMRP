const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const router = express.Router();

const users = []; // Dummy user data

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    const token = jwt.sign({ id: user.id }, config.secretKey, { expiresIn: 86400 });
    res.status(200).send({ auth: true, token: token });
  } else {
    res.status(401).send({ auth: false, token: null });
  }
});

module.exports = router;
