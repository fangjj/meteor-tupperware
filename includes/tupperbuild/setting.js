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
  //return '"' + string.replace(/(\\|\"|\n|\r|\t|!|\$)/g, "\\$1") + '"';
  string = string.replace(/\s/g, '');
  return "'" + string + "'";
}

function handleExecError(done, cmd, taskDesc, error, stdout, stderr) {
  if (! error) {
      //if (stdout) {
      //    console.log(stdout);
      //}
      //if (stderr) {
      //    console.log(stderr);
      //}
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

function setEnv (done) {
    log.info('setting Env commands...');
	try {
	  settingsJson = require(copyPath + '/settings.json');
	  var settingsJsonStr = StringAs(JSON.stringify(settingsJson));
	  var cmd = 'sh /tupperware/scripts/_setting.sh ' + settingsJsonStr;
	  //log.info("cmd..."+cmd);
	  log.info('Settings in settings.json registered.');
	  var handler = child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'set env'));
        handler.stdout.on('data', function (data) {
            log.info('stdout: ' + data);
        });

        handler.stderr.on('data', function (data) {
            log.info('stderr: ' + data);
        });

        handler.on('exit', function (code) {
            log.info('child process exited with code ' + code);
        });
	} catch (e) {
	  log.info('settings.json is not registered, please set METEOR_SETTINGS by yourself...');
	  var cmd = 'sh /tupperware/scripts/_start_main.sh';
        var handler = child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'node main.js'));
        handler.stdout.on('data', function (data) {
            log.info(data);
        });

        handler.stderr.on('data', function (data) {
            log.info(data);
        });

        handler.on('exit', function (code) {
            log.info('child process exited with code ' + code);
        });
	}
}

async.series([
  setEnv
]);
