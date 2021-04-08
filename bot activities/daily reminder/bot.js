const randomReminderMessage = [
  "Hello, we all did great yesterday. Today is another day to improve ourselves. Let's code and learn.",
  "Wow, what a day to code. Your coffee ready yet? Let's make it a day to improve ourselves",
];

function sayHello() {
  const randomedMsg =
    randomReminderMessage[
      Math.floor(Math.random() * randomReminderMessage.length)
    ];
  return randomedMsg;
}

module.exports = sayHello;
