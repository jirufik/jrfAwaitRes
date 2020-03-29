const awaitRes = require('../index');
const serverSocketIO = require('socket.io');
const clientSocketIO = require('socket.io-client');
const wait = require('../utils/wait');
const port = process.env.PORT || 11222;

let serverIO;
let clientIO;

beforeAll(async () => {
  // INIT SERVER
  serverIO = serverSocketIO(port);

  serverIO.on('connection', function (socket) {
    socket.on('await res', async function (data, fn) {
      await wait(2000);
      fn({token: `${data.login}`});
    });
  });

  // DELAY FOR START SERVER
  await wait(200);

  // INIT CLIENT
  clientIO = clientSocketIO(`http://localhost:${port}`);

});

afterAll(() => {

  clientIO.close();
  serverIO.close();

});

test('Default timeout, res is valid', async () => {

  const io = clientIO;
  const eventName = 'await res';
  const data = {login: 'rick', password: '12345'};
  const timeout = 5000;

  const validRes = {token: 'rick'};
  const res = await awaitRes({io, eventName, data, timeout});

  const isValid = JSON.stringify(validRes) === JSON.stringify(res);

  expect(isValid).toBeTruthy();

});

test('Set timeout, res is valid', async () => {

  const io = clientIO;
  const eventName = 'await res';
  const data = {login: 'rick', password: '12345'};
  const timeout = 3000;

  const validRes = {token: 'rick'};
  const res = await awaitRes({io, eventName, data, timeout});

  const isValid = JSON.stringify(validRes) === JSON.stringify(res);

  expect(isValid).toBeTruthy();

});

test('Set timeout, res is invalid', async () => {

  const io = clientIO;
  const eventName = 'await res';
  const data = {login: 'rick', password: '12345'};
  const timeout = 1000;

  await expect(awaitRes({io, eventName, data, timeout})).rejects.toThrow('Timeout: 1000; Event name: await res');

});