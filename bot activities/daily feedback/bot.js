// send feedback of users who submitted report and congratulate them
// send feedback of users who didn't submit report and encourage them
// on hault
const BotTracker = require('../../model/BotTracker');
const Users = require('../../model/Users');

const randomCongratMsgs = [
  'You did awesome guys. Keep it up.',
  'Yahoo, we made it. Tomorrow we move.',
];

function feedbackForReportsSubmitted() {
  getUsersWithReports();
  return 'Ok done';
}

const getUsersWithReports = async () => {
  try {
    const usersIds = await BotTracker.find({ bot: 'bot-tracker' }).map(
      (doc) => {
        return doc[0].submittedReportsIds;
      }
    );

    const users = await usersIds.map(async (id) => {
      return await Users.findById(id);
    });

    console.log(users);
  } catch (err) {
    console.log(err);
  }
};
getUsersWithReports();

const randomEncouragMsgs = [
  'It may not have been possible today, but tomorrow holds a great deal.',
  'You can and you will.',
];

function feedbackForNoReports() {
  // here is a feedback for you
  return 'Ok done';
}

module.exports = { feedbackForNoReports, feedbackForReportsSubmitted };
