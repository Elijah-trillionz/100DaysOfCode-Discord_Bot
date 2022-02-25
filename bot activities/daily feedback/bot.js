const Users = require('../../model/Users');

async function givePersonalFeedback(username, channel) {
  try {
    const userData = await Users.find({ name: username });

    const currentDay = userData.length > 0 ? channel === '100daysofcode' ? userData[0].codeDay : userData[0].learnDay : 'not available';

    const customedMessage = `Hello @${username}, you are currently in day ${currentDay} of the ${channel} challenge.`

    return currentDay !== 'not available' ? customedMessage : 'Unable to fetch your data, seems like you haven\'t started any challenge yet.' 
  } catch(err) {
    return 'There has been an error'
  }
}

module.exports = givePersonalFeedback