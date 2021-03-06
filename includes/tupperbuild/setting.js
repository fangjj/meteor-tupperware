var fs = require('fs'),
    async = require('async'),
    child_process = require('child_process');



var copyPath = '/app',
    settingsJson = {};

var log = {};

var exec_options = {
    maxBuffer: 2*1024*1024  /*stdout和stderr的最大长度*/
};

log.info = function () {
  var args = Array.prototype.slice.apply(arguments);
  args.splice(0, 0, '[-]');
  return console.log.apply(console, args);
};

log.error = function () {
  var args = Array.prototype.slice.apply(arguments);
  args.splice(0, 0, '[!]');
  return console.log.apply(console, args);
};

/* Utils */
function suicide () {
  log.info('Container build failed. meteor-tupperware is exiting...');
  process.exit(1);
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
    var cmd = '';
    var settingsJsonStr = '';
	try {
      settingsJson = require('/settings.json');
        if(typeof settingsJson == 'string'){
          settingsJson = JSON.parse(settingsJson);
        }
        settingsJsonStr = JSON.stringify(settingsJson);

        cmd = "sh /tupperware/scripts/_setting.sh '" + settingsJsonStr+"'";
    } catch (e) {
	  log.info('settings.json is not registered, please set METEOR_SETTINGS by yourself...');
        cmd = 'sh /tupperware/scripts/_start_main.sh';
	} finally {
        if(settingsJsonStr){
            log.info('Settings in settings.json registered.');
            fs.unlink('/settings.json');
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
    var cmd = '';
    var settingsJsonStr = '';
    var settingsFileName = 'settings.json';
  try {
        if(process.env.METEOR_SETTINGS){
          throw new error('METEOR_SETTINGS has already in ENV!');
        }
        if(process.env.SETTINGS_FILE_NAME){
          settingsFileName = process.env.SETTINGS_FILE_NAME;
        }
        settingsFileName = '/' + settingsFileName;
        //settingsJson = require(copyPath + '/settings.json');
        settingsJson = fs.readFileSync(settingsFileName,'utf-8');
        if(typeof settingsJson == 'string'){
          settingsJson = JSON.parse(settingsJson);
        }
        settingsJsonStr = JSON.stringify(settingsJson);
        cmd = '/tupperware/scripts/_setting.sh';
  } catch (e) {
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
function clearSttings (done) {
  //log.info("clearSttings...");
  var cmd = 'find / -maxdepth 1 -name "settings*.json" | xargs -i rm {}';
  child_process.exec(cmd);
  done();
}

async.series([
  setEnv2,
  clearSttings
]);
