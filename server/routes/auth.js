const express = require('express');
const router = express.Router();

// Simple auth - password stored in env variable
const AUTH_PASSWORD = process.env.EXPENSE_PASSWORD || 'kannan60';

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === AUTH_PASSWORD) {
    res.json({ success: true, token: Buffer.from(`auth_${Date.now()}`).toString('base64') });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

router.post('/verify', (req, res) => {
  const { token } = req.body;
  if (token && token.length > 0) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
