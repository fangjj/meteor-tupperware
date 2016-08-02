var pkgjson = require('./package.json'),
    fs = require('fs'),
    _ = require('lodash'),
    async = require('async'),
    child_process = require('child_process'),
    // https = require('follow-redirects').https;
    request = require('request');


var copyPath = '/app',
    settingsJson = {};

var log = {};

log.info = function () {
  var args = Array.prototype.slice.apply(arguments);
  args.splice(0, 0, '[-] ');
  return console.log.apply(console, args);
};

log.error = function () {
  var args = Array.prototype.slice.apply(arguments);
  args.splice(0, 0, '[!] ');
  return console.log.apply(console, args);
};

/* Utils */
function suicide () {
  log.info('Container build failed. meteor-tupperware is exiting...');
  process.exit(1);
}

function StringAs(string) {
  return '"' + string.replace(/(\\|\"|\n|\r|\t|!|\$)/g, "\\$1") + '"';
}

function handleExecError(done, cmd, taskDesc, error, stdout, stderr) {
  if (! error) {
    done();
  } else {
    log.error('While attempting to ' + taskDesc + ', the command:', cmd);
    log.error('Failed with the exit code ' + error.code + '. The signal was ' + error.signal + '.');
    if (stdout) {
      log.info('The task produced the following stdout:');
      console.log(stdout);
    }
    if (stderr) {
      log.info('The task produced the following stderr:');
      console.log(stderr);
    }
    suicide();
  }
}

/* Steps */

function extractSettingsJson (done) {
  /* Attempt to read in settings.json file for settings */
  try {
    settingsJson = require(copyPath + '/settings.json');
    log.info('Settings in settings.json registered.');
  } catch (e) {
    log.info('No settings.json found.');
  }
  done();
}

function setEnv (done) {
  if (_.keys(settingsJson).length > 0) {
    log.info('setting Env commands...');
    async.series([
      function (done) {
        var settingsJsonStr = StringAs(JSON.stringify(settingsJson));
        var cmd = 'sh /tupperware/scripts/_setting.sh ' + settingsJsonStr;
        //log.info("cmd..."+cmd);
        child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'set env'));
      },
      function () {
        done();
      }
    ]);
  }else{
    done();
  }
}


async.series([
  extractSettingsJson,
  setEnv
]);
