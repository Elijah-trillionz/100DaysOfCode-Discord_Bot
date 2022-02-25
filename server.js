const express = require('express');

const server = express();

server.all('/', (req, res) => {
  res.send('Bot is running');
});

function keepAlive() {
  server.listen(4000, () => console.log('Server running at port 4000'))
}

module.exports = keepAlive