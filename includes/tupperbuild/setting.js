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

var exec_options = {
    maxBuffer: 2*1024*1024  /*stdout和stderr的最大长度*/
};

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
    done();
  } else {
    //log.error('While attempting to ' + taskDesc + ', the command:', cmd);
    log.error('Failed with the exit code ' + error.code + '. The signal was ' + error.signal + '.');
    if (stdout) {
      log.info('The task produced the following stdout:');
      console.log(stdout);
    }
    if (stderr) {
      log.info('The task produced the following stderr:');
      console.log(stderr);
    }
    //suicide();
  }
}

/* Steps */

function setEnv (done) {
    log.info('setting Env commands...');
    var cmd = '';
    var settingsJsonStr = '';
	try {
      settingsJson = require(copyPath + '/settings.json');
        settingsJsonStr = StringAs(JSON.stringify(settingsJson));

        cmd = 'sh /tupperware/scripts/_setting.sh ' + settingsJsonStr;
    } catch (e) {
	  log.info('settings.json is not registered, please set METEOR_SETTINGS by yourself...');
        cmd = 'sh /tupperware/scripts/_start_main.sh';
	} finally {
        if(settingsJsonStr){
            log.info('Settings in settings.json registered.');
        }
        var child = child_process.exec(cmd,exec_options);
        if(child){
            child.stdout.on('data', function(data) {
                console.log(data.toString('utf-8'));
            });
            child.stderr.on('data', function(data) {
                console.log(data.toString('utf-8'));
            });
            child.on('close', function(code) {
                console.log('Failed with the exit code '+code);
            });
        }
        done();
    }
}

function setEnv2 (done) {
    log.info('setting Env commands...');
    var cmd = '';
    var settingsJsonStr = '';
  try {
      // settingsJson = require(copyPath + '/settings.json');
        // settingsJsonStr = JSON.stringify(settingsJson);
        settingsJsonStr = fs.readFileSync(copyPath + '/settings.json').toString();
        cmd = '/tupperware/scripts/_setting.sh';
  } catch (e) {
      log.info('settings.json is not registered, please set METEOR_SETTINGS by yourself...');
        cmd = '/tupperware/scripts/_start_main.sh';
  } finally {
        var paramArray = [cmd];
        if(settingsJsonStr){
            log.info('Settings in settings.json registered.');
            paramArray.push(settingsJsonStr);
        }
        var child = child_process.spawn('sh',paramArray,{stdio:'pipe'});
        if(child){
            child.stdout.on('data', function(data) {
                console.log(data.toString('utf-8'));
            });
            child.stderr.on('data', function(data) {
                console.log(data.toString('utf-8'));
            });
            child.on('close', function(code) {
                console.log('Failed with the exit code '+code);
            });
        }
        done();
    }
}

async.series([
  setEnv2
]);
