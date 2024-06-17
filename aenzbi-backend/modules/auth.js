const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const users = []; // Dummy user data

const initAuth = () => {
  const router = express.Router();

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
};

module.exports = { initAuth };
