// save new user in database
// update daily progress of users
const Users = require('../../model/Users');
const BotTracker = require('../../model/BotTracker');

async function saveNewUser(username, day, channel) {
  // do some mongodb activities
  try {
    const userInfo = await validateInfo(username, day, channel);
    if (!userInfo) return 'Unable to begin tracking';

    if (userInfo === 'update') {
      return upDateProgress(username, day, channel);
    } else if (userInfo.isTracking) {
      return userInfo.msg;
    }

    await Users.create(userInfo);
    addUserReportToBotTracker(username);
    return 'Now tracking your progress';
  } catch (err) {
    return 'An error occured while trying to track your progress. Try again';
  }
}

const validateInfo = async (username, day, channel) => {
  try {
    const alreadyExists = await checkForExistingUsers(username, channel);

    if (!username) {
      return false;
    } else if (!alreadyExists && +day !== 1) {
      return false;
    } else if (alreadyExists && +day > alreadyExists.day) {
      return 'update';
    } else if (alreadyExists && +day <= alreadyExists.day) {
      return alreadyExists;
    }

    const isCodeChannel = channel === '100daysofcode' ? true : false;

    const userInfo = {
      name: username,
      codeDay: isCodeChannel && day,
      learnDay: !isCodeChannel && day,
    };
    return userInfo;
  } catch (err) {
    return 'An error occured while trying to track your progress. Try again';
  }
};

const checkForExistingUsers = async (username, channel) => {
  try {
    const userData = await Users.find({ name: username });
    if (userData.length <= 0) {
      return false;
    }
    const day =
      channel === '100daysofcode' ? userData[0].codeDay : userData[0].learnDay;

    return {
      msg:
        day === 100
          ? `You have completed the ${channel} challenge, you can restart by using the command $restart-${channel}`
          : `Your progress is already being tracked. You are in day ${day}`,
      day,
      isTracking: true,
    };
  } catch (err) {
    return 'An error occured while trying to track your progress. Try again';
  }
};

async function upDateProgress(username, day, channel) {
  const isCodeChannel = channel === '100daysofcode' ? true : false;
  try {
    if (isCodeChannel)
      await Users.updateOne({ name: username }, { codeDay: +day });
    else await Users.updateOne({ name: username }, { learnDay: +day });

    addUserReportToBotTracker(username);

    if (+day === 1) {
      return `I am now tracking your progress for the ${channel} challenge`;
    }

    return 'You just stepped up. Great Job.';
  } catch (err) {
    return 'An error occurred while trying to update your progress. Try again';
  }
}

async function isConfirmedInDatabase(username, channel) {
  try {
    const response = await Users.find({ name: username });
    return response.map((thisUser) => {
      const day =
        channel === '100daysofcode' ? thisUser.codeDay : thisUser.learnDay;
      if (day === 100) return true;

      return false;
    })[0];
  } catch (err) {
    return 'An error occured while trying to track your progress. Try again';
  }
}

// for daily feedback // not yet in use
async function addUserReportToBotTracker(username) {
  try {
    const users = await Users.find({ name: username }).map((user) => {
      return user;
    });

    await BotTracker.updateOne(
      { bot: 'bot-tracker' },
      { $addToSet: { submittedReportsIds: [users[0]._id] } }
    );
  } catch (err) {
    // console.log(err);
  }
}

// restarting challenges
async function restartChallenge(username, channel) {
  const isCodeChannel = channel === '100daysofcode' ? true : false;
  try {
    if (isCodeChannel)
      await Users.updateOne({ name: username }, { codeDay: 0 });
    else await Users.updateOne({ name: username }, { learnDay: 0 });

    return `You have restarted your ${channel} challenge`;
  } catch (err) {
    return 'An error occured while trying to restart your challenge. Try again';
  }
}

module.exports = { saveNewUser, isConfirmedInDatabase, restartChallenge };
