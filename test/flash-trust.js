var path = require('path');
var flashTrust = require('nw-flash-trust');
 
// appName could be any globally unique string containing only 
// big and small letters, numbers and chars "-._" 
// It specifies name of file where trusted paths will be stored. 
// Best practice is to feed it with "name" value from your package.json file. 
var appName = 'myApp';
 
try {
    // Initialization and parsing config file for given appName (if already exists). 
    var trustManager = flashTrust.initSync(appName);
} catch(err) {
    if (err.message === 'Flash Player config folder not found.') {
      console.log(err.message)
        // Directory needed to do the work doesn't exist. 
        // Probably Flash Player is not installed, there is nothing I can do. 
    }
}

var list = trustManager.list();

console.log(list)