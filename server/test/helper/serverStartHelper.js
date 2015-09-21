var cp = require('child_process');

exports = module.exports = function (callback) {

  var nodeProcess = cp.spawn('node', ["server.js"], {env: {NODE_ENV: "test", PATH: process.env.PATH}, stdio: ['ipc']});

  nodeProcess.on('message', function (message) {
    if (message.event == "ready") callback(message);
  });

  nodeProcess.stdout.on('data', function (data) {
    console.log("[APPLICATION STDOUT]", data.toString());
  });

  nodeProcess.stderr.on('data', function (data) {
    console.log("[APPLICATION STDERR]", data.toString());
  });

  process.on("exit", function () {
    try {
      nodeProcess.kill();
    } catch (c) {
    }
  });

  return nodeProcess;
};