# JRF-AWAIT-RES

Run an asynchronous request with a callback to the socket.io server in a synchronous style.

The input accepts the parameters:

| Name | Required | Description |
| --- | --- | --- |
| io | true | Client socket.io |
| eventName | true | The name of the event socket.io server should handle |
| data | false | Any value that needs to be passed to the server for processing |
| timeout | false | Timeout after which an exception will be raised if a response from the server does not come. The default is 5000 ms. |
| cycleDelay | false | Asynchronous delay between iterations of the waiting loop for a response from the server. The default is 20 ms. |

## Example

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