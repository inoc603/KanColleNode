// desktop.js
var SERVER = 'http://127.0.0.1:3001'
var gui = require('nw.gui')
var win = gui.Window.get()

// $('#game_panel').hide()

$('#close_window').click(function () {
  // console.log(win)
  win.close()
})

$('#minimize_window').click(function () {
  win.minimize()
})

function maximizeWin () {
  win.maximize()
  $('#maximize_window>span').toggleClass('glyphicon-resize-full glyphicon-resize-small')
  $('#maximize_window').click(unmaximizeWin)
}

function unmaximizeWin () {
  win.unmaximize()
  $('#maximize_window>span').toggleClass('glyphicon-resize-small glyphicon-resize-full')
  $('#maximize_window').click(maximizeWin)
}

$('#maximize_window').click(maximizeWin)

$('#refresh_window').click(function () {
  win.reload()
})

$('#open_console').click(function () {
  win.showDevTools()
})
