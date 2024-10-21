const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Yeni kullanıcı ekleme
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Giriş işlemi
router.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return res.json({ userType: 'admin' });
  } else if (username === process.env.RESIDENT_USERNAME && password === process.env.RESIDENT_PASSWORD) {
    return res.json({ userType: 'resident' });
  } else if (username === process.env.SECURITY_USERNAME && password === process.env.SECURITY_PASSWORD) {
    return res.json({ userType: 'security' });
  } else {
    return res.status(401).json({ message: 'Hatalı kullanıcı adı veya şifre' });
  }
});

module.exports = router;