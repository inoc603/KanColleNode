define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  ]
, function($, _, Backbone){
    var util = {
      hideBattleInfo: function () {
        $('#map-info').text('没有出击')
        $('.battle-table').hide()
        $('#battle-info').hide()
      }
    , showBattleInfo: function (combined) {
        // $('#map-info').text(' ')
        $('.battle-table').show()
        if (!combined) $('#battle-table-combined').hide()
        $('#battle-info').show()
      }
    , setTimer: function ($timer, time) {
        $timer.show()
        var countdown = setInterval(function () {
          d = new Date()
          remaining = Math.floor((time - d.getTime())/1000)
          if (remaining <= 0) {
            clearInterval(countdown)
            return
          }
          // make sure that h, m, s are all 2 digits
          h = (Math.floor(remaining / 3600) + 100).toString().substr(-2, 2)
          m = (Math.floor((remaining % 3600)/60) +100).toString().substr(-2, 2)
          s = (remaining % 60 + 100).toString().substr(-2, 2)
          remainStr = [h, m, s].join(':')
          $timer.text(remainStr)
        }, 500)
        return countdown
      }
    , getProgressBarHtml: function (max, now) {
        var percentage = now/max*100
          , color = ""

        if (percentage > 75)
          color = "green"
        else if (percentage > 50)
          color = "yellow"
        else if (percentage > 25)
          color = "orange"
        else
          color = "red"

        res = '<div class="progress health_bar">'
            + '<div class="progress-bar"'
            +     ' role="progressbar"'
            +     ' aria-valuemax="'+ max + '"'
            +     ' aria-valuemin="0"'
            +     ' aria-valuenow="'+ now + '"'
            +     ' style="width:'+percentage+'%;'
            +             'background-image:none;'
            +             'background-color:'+color+'">'
            + '</div></div>'
        return res
      }
    }
    return util
  }
)
