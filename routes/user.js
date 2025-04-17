const express = require('express');
const { User, Skill, UserSkill} = require('../models');
const authenticateJWT = require('../middleware/auth');
const calculateSP = require('../services/calculateSP');
const router = express.Router();

// POST /api/user/info
router.post('/info', authenticateJWT, async (req, res) => {
  const {
    Users_name,
    first_name,
    last_name,
    birthday,
    bio,
    gender,
    telegram,
    discord,
    whatsapp,
  } = req.body;

  try {
    const user = await User.findByPk(req.user.ID_Users);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedFields = {};

    if (user.Users_name !== Users_name) updatedFields.Users_name = Users_name;
    if (user.first_name !== first_name) updatedFields.first_name = first_name;
    if (user.last_name !== last_name) updatedFields.last_name = last_name;
    if (user.birthday !== birthday) updatedFields.birthday = birthday;
    if (user.bio !== bio) updatedFields.bio = bio;
    if (user.gender !== gender) updatedFields.gender = gender;
    if (user.telegram !== telegram) updatedFields.telegram = telegram;
    if (user.discord !== discord) updatedFields.discord = discord;
    if (user.whatsapp !== whatsapp) updatedFields.whatsapp = whatsapp;

    if (Object.keys(updatedFields).length > 0) {
      await user.update(updatedFields);

      const spEarned = await calculateSP(user.ID_Users, {
        type: 'profile-completion',
        value: 1,
      });

      return res.status(200).json({
        message: `${Object.keys(updatedFields).length} fields updated. ${spEarned} SP earned.`,
        user,
      });
    } else {
      return res.status(200).json({ message: 'No changes detected.' });
    }
  } catch (error) {
    console.error('Error in /info:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

// POST /api/user/skills
router.post('/skills', authenticateJWT, async (req, res) => {
  const { learnSkills = [], teachSkills = [] } = req.body;

  if (learnSkills.length === 0 && teachSkills.length === 0) {
    return res.status(400).json({ message: 'At least one skill is required.' });
  }

  try {
    const user = await User.findByPk(req.user.ID_Users);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addSkills = async (skills, type) => {
      let newSkills = 0;

      for (const skillName of skills) {
        const [skill] = await Skill.findOrCreate({ where: { name: skillName } });

        const exists = await UserSkill.findOne({
          where: { userId: user.ID_Users, skillId: skill.id, type },
        });

        if (!exists) {
          await UserSkill.create({
            userId: user.ID_Users,
            skillId: skill.id,
            type,
          });
          newSkills++;
        }
      }

      // SP condition based on how many new skills added
      if (newSkills >= 3) {
        await calculateSP(user.ID_Users, { type: 'skills', value: 3 });
      }
    };

    if (learnSkills.length) await addSkills(learnSkills, 'learn');
    if (teachSkills.length) await addSkills(teachSkills, 'teach');

    return res.status(200).json({ message: 'Skills updated successfully.' });
  } catch (error) {
    console.error('Error in /skills:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
