const express = require('express');
const { User, Skill, UserSkill, UserActivity } = require('../models'); 
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

// Helper function to calculate and add SP based on activity
const calculateSP = async (userId, activity) => {
  let spEarned = 0;

  // Example Activity Check:
  if (activity.type === 'profile-completion') {
    spEarned = 5;  // Profile completion gives 5 SP
  } else if (activity.type === 'teaching') {
    const hours = activity.value;
    if (hours === 0.25) { // 15 minutes of teaching
      spEarned = 3;
    } else if (hours === 4) { // 4 hours of teaching
      spEarned = 12;
    } else if (hours === 12) { // 12 hours of teaching
      spEarned = 20;
    } else if (hours >= 4) { // General rate per hour
      spEarned = 7 * hours; // 7 SP per hour
    }
  } else if (activity.type === 'applications') {
    const applications = activity.value;
    if (applications === 5) {
      spEarned = 10;
    } else if (applications === 30) {
      spEarned = 25;
    }
  } else if (activity.type === 'skills') {
    const skills = activity.value;
    if (skills === 3) { // Teaching or Learning 3 different skills
      spEarned = 12;
    } else if (skills === 5) { // Learning 5 hours in the same skill
      spEarned = 15;
    }
  }

  // Save the activity and update SP
  try {
    await UserActivity.create({
      userId,
      activityType: activity.type,
      value: activity.value,
      spEarned,
    });
  } catch (error) {
    console.error("Error saving activity:", error);
  }

  // Update User SP Points
  const user = await User.findByPk(userId);
  if (user) {
    user.SP += spEarned; // Update the 'SP' field
    await user.save();
  }

  return spEarned;
};

// POST /api/user/info - Save additional user information
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
    whatsapp
  } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedFields = {};

    // Check if fields have changed and prepare update fields
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
      // Apply the changes to the user's profile
      await user.update(updatedFields);

      // Calculate and add SP for profile completion if fields have been updated
      const spEarned = await calculateSP(user.id, { type: 'profile-completion', value: 1 });

      return res.status(200).json({
        message: `${Object.keys(updatedFields).length} fields updated successfully. ${spEarned} SP earned for profile completion.`,
        user,
      });
    } else {
      return res.status(200).json({ message: 'No changes detected for user info' });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;

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

      // Calculate SP based on skills added
      if (skills.length === 3) {
        await calculateSP(user.id, { type: 'skills', value: 3 });
      } else if (skills.length === 5) {
        await calculateSP(user.id, { type: 'skills', value: 5 });
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
