const Discord = require('discord.js');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// bot activities (functions)
const sayHello = require('./bot activities/daily reminder/bot');
const {
  saveNewUser,
  isConfirmedInDatabase,
  restartChallenge,
} = require('./bot activities/users/bot');
// const {
//   feedbackForReportsSubmitted,
//   feedbackForNoReports,
// } = require('./bot activities/daily feedback/bot');

dotenv.config({ path: './config/config.env' });

connectDB();

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Logged in as ' + client.user.tag);
});

// @about::    for tracking progress for 100daysofcode and 100daysoflearning
// @command::   $Day${anyNum from 1 to 100} && 100daysofcode || 100daysoflearning
// @access::    all channels of this bot
client.on('message', (msg) => {
  if (msg.author.bot) return;

  const msgInLowerCase = msg.content.toLowerCase();
  if (
    msgInLowerCase.indexOf(`${msg.channel.name}`) !== -1 &&
    msg.channel.name === `${msg.channel.name}` &&
    msgInLowerCase.indexOf(`-${msg.channel.name}`) === -1
  ) {
    const dateIsValid = validateDay(msgInLowerCase);

    if (dateIsValid) {
      const saveProfile = saveNewUser(
        msg.author.username,
        dateIsValid,
        msg.channel.name
      );
      saveProfile
        .then((response) => {
          if (response) msg.reply(response);

          isConfirmedInDatabase(msg.author.username, msg.channel.name)
            .then((isCompleted) => {
              if (isCompleted) {
                msg.author.send(
                  `Wow, you did it! How wonderful. You have successfully completed the ${msg.channel.name} challenge. You should be proud. Congratulations.`
                );
              }
            })
            .catch((err) => {
              msg.reply('There has been an error');
            });
        })
        .catch((err) => {
          msg.reply('There has been an error');
        });
    } else
      msg.reply(
        `Invalid day, 100 Days only. Command to restart this challenge is $restart-${msg.channel.name}`
      );
  }
});

const validateDay = (msg) => {
  const dayInMsg = msg.match(/(\$day\d+)/)[0];

  const dayInNum = dayInMsg.match(/(\d+)/)[0];

  if (dayInNum <= 0 || dayInNum > 100) {
    return false;
  }

  return dayInNum;
};

// @about::   restarting a challenge
// @bot-command::   $restart-100daysofcode || #restart-100daysoflearning
// @access: all channels of this bot
client.on('message', (msg) => {
  if (msg.author.bot) return;

  if (msg.content === `$restart-${msg.channel.name}`) {
    restartChallenge(msg.author.username, msg.channel.name)
      .then((res) => {
        msg.reply(res);
      })
      .catch((err) => {
        msg.reply('There has been an error');
      });
  }
});

// @about::   posting daily encouragements
// @bot-command::   $start-bot
// @access:   developing-bots channel only
client.on('message', (msg) => {
  if (msg.author.bot) return;

  if (msg.content === '$start-bot' && msg.channel.name === 'developing-bots') {
    client.guilds.cache.forEach((guild) => {
      guild.channels.cache.forEach((channel) => {
        if (
          channel.name === '100daysofcode' ||
          channel.name === 'developing-bots' ||
          channel.name === '100daysoflearning'
        ) {
          channel.send(`@everyone: ${sayHello()}`);
        }
      });
    });
  }
});

// @about::   posting daily feedbacks
// @bot-command::   $give-feedback-100daysofcode || $give-feedback-100daysoflearning
// @access::    developing-bots channel only
// client.on('message', (msg) => {
//   if (msg.author.bot) return;

//   const msgInLowerCase = msg.content.toLowerCase();
//   const challenge =
//     msgInLowerCase.indexOf('100daysofcode') !== -1
//       ? '100daysofcode'
//       : '100daysoflearning';
//   if (msgInLowerCase === `$give-feedback-${challenge}`) {
//     feedbackForReportsSubmitted();
//   }
// });

client.login(process.env.DISCORD_TOKEN);
