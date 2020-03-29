# JRF-AWAIT-RES

Выполнение асинхронного запроса с колбэком, к серверу socket.io, в синхронном стиле.

На вход принимает параметры:

| Name | Required | Description |
| --- | --- | --- |
| io | true | Клиент socket.io |
| eventName | true | Имя события, которое должен обработать сервер socket.io |
| data | false | Любое значение которое требуется передать серверу на обработку |
| timeout | false | Timeout по истичению которого будет вызвано исключение, если не придет ответ от сервера. По умолчанию 5000 мс. |
| cycleDelay | false | Асинхронная задержка между итерациями цикла ожидания ответа от сервера. По умолчанию 20 мс. |

## Пример

### Server

```js
const socketIO = require('socket.io');

const port = process.env.PORT || 4040;
const io = socketIO(port);

io.on('connection', function (socket) {
  socket.on('await res', async function (data, fn) {
    await wait(2000);
    fn({token: `${data.login}`});
  });
});

function wait(delay = 100) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
```

### Client

```js
const socketIO = require('socket.io-client');
const awaitRes = require('jrf-await-res');

const port = process.env.PORT || 4040;
const io = socketIO(`http://localhost:${port}`);

async function testAwaitRes() {

  await wait(200);

  const eventName = 'await res';
  const data = {login: 'rick', password: '12345'};
  const timeout = 5000;

  try {
    const token = await awaitRes({io, eventName, data, timeout});
    console.log(token);
  } catch(e) {
    console.error(e);
  }

  //... processToken(token)

}

function wait(delay = 100) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

Promise.resolve()
  .then(testAwaitRes)
  .catch(e => console.error(e));

```