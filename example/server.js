const socketIO = require('socket.io');
const wait = require('../utils/wait');

const port = process.env.PORT || 4040;
const io = socketIO(port);

io.on('connection', function (socket) {
  socket.on('await res', async function (data, fn) {
    await wait(2000);
    fn({token: `${data.login}`});
  });
});