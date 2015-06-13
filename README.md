# KanColleNode

A KanColle viwer written in Node.js.

Currently the app is wrapped as a cross-platform desktop application using [nwjs], working on Windows, OSX and Linux.

## FEATURES

This Project is currently under heavy development.

Full description will be here soon.

## INSTALL

```bash
git clone https://github.com/inoc603/KanColleNode.git
cd KanColleNode
npm i
```

After the install, a script using [install-nw] will start to download [nwjs] to *./nw-cache*, which can fail or take a long time. In that case you can press `ctrl + c` to stop the download, then manully download it from (this-link)[1].

When download is finished, due to bugs in install-nw, the script will end in error. However the download is finished. Extract *./nw-cache/nwjs-v0.12.1-\*.zip*, and copy its content to *./* and *./game-viewr*

## USAGE

For debugging, run `node ./bin/www` to start the background program, where you can see debug output on console. Then navigate to *game-viwer* folder, run `nw`, or just click `nw.exe` to open up the graphic interface.

## BUILD

To build the app for distribution, run:

```bash
grunt prepare
grunt build --platforms=win,osx,linux
```

After a while, you should get the built app under *build* folder.

To clean up temp files for building, just run `grunt clean`.

[1]: http://dl.nwjs.io/v0.12.1
[nwjs]: http://nwjs.io/
[install-nw]: https://github.com/davidmarkclements/install-nw


