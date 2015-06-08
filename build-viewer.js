var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
    files: '../KanColleNode-build-test/**/**', // use the glob format
    platforms: ['win64'],
    version: '0.12.0'
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
