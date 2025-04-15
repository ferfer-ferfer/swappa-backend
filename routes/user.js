const express = require('express');
const { User, Skill, UserSkill } = require('../models');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

// POST /api/user/info - Save additional user information
router.post('/info', authenticateJWT, async (req, res) => {
  const {
    username,
    firstName,
    lastName,
    birthday,
    bio,
    gender,
    telegram,
    discord,
    whatsapp
  } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if any of the fields are different
    if (
      user.username === username &&
      user.firstName === firstName &&
      user.lastName === lastName &&
      user.birthday === birthday &&
      user.bio === bio &&
      user.gender === gender &&
      user.telegram === telegram &&
      user.discord === discord &&
      user.whatsapp === whatsapp
    ) {
      return res.status(200).json({ message: 'No changes detected for user info' });
    }

    // Update the user's info if different
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthday = birthday;
    user.bio = bio;
    user.gender = gender;
    user.telegram = telegram;
    user.discord = discord;
    user.whatsapp = whatsapp;

    await user.save();

    return res.status(200).json({ message: 'User info updated successfully', user });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

// POST /api/user/skills - Add or update skills
router.post('/skills', authenticateJWT, async (req, res) => {
  const { learnSkills, teachSkills } = req.body; // Two arrays

  if ((!learnSkills || learnSkills.length === 0) && (!teachSkills || teachSkills.length === 0)) {
    return res.status(400).json({ message: 'At least one learn or teach skill is required' });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addSkills = async (skills, type) => {
      for (const skillName of skills) {
        const [skill] = await Skill.findOrCreate({ where: { name: skillName } });

        // Check if the skill already exists for the user
        const existingSkill = await UserSkill.findOne({
          where: { userId: user.id, skillId: skill.id, type }
        });
        if (existingSkill) {
          console.log(`User already has the ${type} skill: ${skillName}`);
          continue; // Skip adding the skill if it's already associated
        }

        await UserSkill.findOrCreate({
          where: { userId: user.id, skillId: skill.id, type }
        });
      }
    };

    if (learnSkills?.length) await addSkills(learnSkills, 'learn');
    if (teachSkills?.length) await addSkills(teachSkills, 'teach');

    return res.status(200).json({ message: 'Skills updated successfully' });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;

