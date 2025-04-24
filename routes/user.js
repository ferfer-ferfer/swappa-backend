const express = require('express');
const { User} = require('../models');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

// GET /api/user/settings
router.get('/settings', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['language', 'dark_mode', 'status']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ settings: user });
  } catch (err) {
    console.error('[Settings Get Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// PUT /api/user/settings
router.put('/settings', authenticateJWT, async (req, res) => {
  const { language, dark_mode, status } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.language = language ?? user.language;
    user.dark_mode = dark_mode ?? user.dark_mode;
    user.status = status ?? user.status;

    await user.save();

    res.status(200).json({ message: 'Settings updated successfully', settings: user });
  } catch (err) {
    console.error('[Settings Update Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
