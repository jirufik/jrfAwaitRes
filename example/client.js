const socketIO = require('socket.io-client');
const awaitRes = require('../index');
const wait = require('../utils/wait');

const port = process.env.PORT || 4040;
const io = socketIO(`http://localhost:${port}`);

async function testAwaitRes() {

  await wait(200);

  const eventName = 'await res';
  const data = {login: 'rick', password: '12345'};
  const timeout = 5000;

  const res = await awaitRes({io, eventName, data, timeout});
  console.log(res);

}

Promise.resolve()
  .then(testAwaitRes)
  .catch(e => console.error(e));

