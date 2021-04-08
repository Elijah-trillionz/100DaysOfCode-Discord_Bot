const users = [
  {
    name: 'elijahtrillionz',
    day: 2,
  },
];

function saveNewUser(username, day) {
  // do some mongodb activities
  const userInfo = validateInfo(username, day);
  if (!userInfo) return 'Unable to begin tracking';

  try {
    if (userInfo === 'update') {
      return upDateProgress();
    } else if (userInfo.isTracking) {
      return userInfo.msg;
    }

    return 'Now tracking your progress';
    // await Users.create(userInfo);
  } catch (err) {
    console.log(err);
  }
}

const validateInfo = (username, day) => {
  const alreadyExists = checkForExistingUsers(username);

  if (!username) {
    return false;
  } else if (!alreadyExists && +day !== 1) {
    return false;
  } else if (alreadyExists && +day > alreadyExists.day) {
    return 'update';
  } else if (alreadyExists && +day <= alreadyExists.day) {
    return alreadyExists;
  }

  const userInfo = {
    name: username,
    day,
  };
  return userInfo;
};

const checkForExistingUsers = (username) => {
  try {
    const userData = users.filter((user) => {
      return user.name === username;
    });

    if (userData.length <= 0) {
      return false;
    }

    return {
      msg: `Your progress is already being tracked. You are in day ${userData[0].day}`,
      day: userData[0].day,
      isTracking: true,
    };
  } catch (err) {
    console.log(err);
  }
};

function upDateProgress(day) {
  // saved number of days as an array
  return 'updated';
}

const value = saveNewUser('elijahtrillionz', 3);
console.log(value);
