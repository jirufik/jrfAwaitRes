const wait = require('./utils/wait');

module.exports = async function awaitRes({io, eventName, data, timeout = 5000, cycleDelay = 20}) {

  let res;
  let gotRes = false;

  io.emit(eventName, data, function (dataRes) {
    res = dataRes;
    gotRes = true;
  });

  const timeStart = new Date();

  while (true) {

    await wait(cycleDelay);

    if (gotRes) break;

    const timeDiff = new Date() - timeStart;
    if (timeDiff >= timeout) {
      const str = `Timeout: ${timeout}; Event name: ${eventName}`;
      throw  new Error(str);
    }

  }

  return res;

};

