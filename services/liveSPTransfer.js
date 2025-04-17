
const {  Class, User } = require('../models');

const startLiveSPTransfer = () => {
    setInterval(async () => {
      try {
        const activeClasses = await Class.findAll({ where: { is_active: true } });
  
        for (const session of activeClasses) {
          if (session.is_paused) continue; // ⏸ skip paused classes
  
          const now = new Date();
          const start = new Date(session.start_time);
          const lastUpdate = new Date(session.last_sp_update || start);
          const minutesElapsed = Math.floor((now - lastUpdate) / (1000 * 60));
  
          // Every 5 minutes since last SP update
          if (minutesElapsed >= 5) {
            const student = await User.findByPk(session.sender_id);
            const teacher = await User.findByPk(session.reciver_id);
  
            if (student && teacher && student.SP > 0) {
              student.SP -= 1;
              teacher.SP += 1;
              await student.save();
              await teacher.save();
  
              session.SP_N_P += 1;
              session.last_sp_update = new Date();
              await session.save();
  
              console.log(`[SP Transfer] 1 SP moved from student ${student.ID_Users} to teacher ${teacher.ID_Users}`);
            }
  
            // Auto-end session if student runs out of SP
            if (student.SP <= 0) {
              session.is_active = false;
              session.end_time = new Date();
              await session.save();
  
              console.log(`[Class Stopped] Student ${student.ID_Users} has no more SP.`);
            }
          }
        }
      } catch (err) {
        console.error('[Live SP Transfer Error]', err);
      }
    }, 60 * 1000); // Check every 1 minute
  };
  
  module.exports = startLiveSPTransfer;
  
