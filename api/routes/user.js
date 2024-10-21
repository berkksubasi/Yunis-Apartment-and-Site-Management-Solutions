const express = require('express');
const router = express.Router();
const User = require('../models/User');

//REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//LOGIN
router.post('/login', (req, res) => {
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

//DELETE
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
