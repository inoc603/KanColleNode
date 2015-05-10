// apps/updater/fleet.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'collections/updater'
  , 'apps/common/socket'
  ]
, function($, _, Backbone, UpdaterCollection, socket){
    var fleetUpdater = {
      initialize: function () {
        this.collection = new UpdaterCollection()
        this.collection.add({name: 'fleet'})
        socket.on('fleet_update', function (data) {
          updateFleet(data)
        })
      }
    }
    return fleetUpdater
  }
)

function updateFleet (data) {
  for (var i in data) {
    var fleet = data[i]
      , fleetNum = parseInt(i)+1
    $fleetNameSpan = $( '.fleet_tab>a[href="#fleet_'
                      + fleetNum + '"]>span:last-child')

    $fleetNameSpan.text(fleet.name)
    $fleetTable = $('#fleet_' + fleetNum + '>table>tbody', '#tab_fleet')
    $fleetTable.html(Array(fleet.ships.length+1).join(fleetTableRowHtml))

    $fleetStatus = $('#fleet_' + fleetNum + '>.fleet_status', '#tab_fleet')


    clearInterval(expeditionTimers[i])

    if (fleet.mission[0] != 0) {
      $('.status_detail', $fleetStatus).text( '#' + fleet.mission[1]
                                            + ' '
                                            + fleet.mission_name
                                            + ' - ')
      if (fleet.mission[0] == 1) {
        $('.status_info', $fleetStatus).text('远征中')
        $fleetStatus.attr('class', 'fleet_status alert alert-info')
        fleetTimers[i] = setTimer( $('.status_timer', $fleetStatus)
                                 , fleet.mission[2])

        $eTime = $( '.expedition_table>tbody>tr:nth-child('
                          + (fleetNum-1)+')>.time')
        $eTime.text('')
        expeditionTimers[i] = setTimer($eTime, fleet.mission[2])

      }
      else {
        $('.status_info', $fleetStatus).text('远征归来')
        $fleetStatus.attr('class', 'fleet_status alert alert-warning')
      }
    }
    else {
      var moderate = 0
        , major = 0
        , tired = 0
        , almostTired = 0
        , ok = 0
        , min_cond = 101

      for (var j in fleet.ships) {
        var ship = fleet.ships[j]

        if (ship.condition < 49)
          if (ship.condition < 40)
            if (ship.condition < 30) tired++
            else almostTired++
          else ok++

        if (ship.condition < min_cond) min_cond = ship.condition

        if (ship.current_hp / ship.max_hp < 0.25) major++
      }

      $detail = $('.status_detail', $fleetStatus)
      if (major  > 0) {
        $detail.text('船只大破')
        $fleetStatus.attr('class', 'fleet_status alert alert-danger')
        clearInterval(fleetTimers[i])
        $('.status_timer', $fleetStatus).text('')
      }
      else if (tired > 0 || almostTired > 0 || ok > 0) {
        $detail.text('疲劳恢复中 -')
        if (tired > 0 || almostTired > 0)
          $fleetStatus.attr('class', 'fleet_status alert alert-warning')
        else
          $fleetStatus.attr('class', 'fleet_status alert alert-success')
        d = new Date()
        // clearInterval(fleetTimers[i])
        var timeLeft = $('.status_timer', $fleetStatus).text()
          , oldTick = Math.ceil(parseInt(timeLeft.split(':')[1])/3)
          , newTick = Math.ceil((49 - min_cond)/3)
        if (oldTick > newTick || !oldTick) {
          clearInterval(fleetTimers[i])
          fleetTimers[i] = setTimer( $('.status_timer', $fleetStatus)
                         , d.getTime()+newTick*180000)
        }

      } else {
        $detail.text('可以出击')
        $fleetStatus.attr('class', 'fleet_status alert alert-success')
        clearInterval(fleetTimers[i])
        $('.status_timer', $fleetStatus).text('')
      }
      $('.status_info', $fleetStatus).text('母港待命')
    }

    for (var j in fleet.ships) {
      ship = parseInt(j)+1
      $row = $('tr:nth-child('+ship+')', $fleetTable)
      if (fleet.ships[j]) {
        $('.ship_name', $row).text(fleet.ships[j].name)
        $('.ship_type', $row).text(fleet.ships[j].type)
        $('.ship_level', $row).text('LV.'+fleet.ships[j].level)
        $('.exp_next', $row).text('Next: '+fleet.ships[j].exp[1])
        $('.ship_condition', $row).html(
          getConditionLabel(fleet.ships[j].condition))
        $('.ship_health_number', $row).text('HP: '
                                           + fleet.ships[j].current_hp
                                           + '/' +fleet.ships[j].max_hp)
        $('.ship_health', $row).html(
          getProgressBarHtml( fleet.ships[j].max_hp
                            , fleet.ships[j].current_hp)
        )
      }
    }

    $footer = $('#fleet_footer_'+fleetNum)
    $('.fleet_anti_air', $footer).text(fleet.anti_air)
    $('.fleet_tracking', $footer).text(fleet.tracking)
    var totalLv = fleet.ships.reduce(function (pv, cv) {
      return pv + cv.level
    }, 0)
    $('.fleet_avg_lv', $footer).text(Math.floor(totalLv / fleet.ships.length))
    $('.fleet_total_lv', $footer).text(totalLv)

    var highSpeed = fleet.ships.reduce(function (pv, cv) {
      return (pv && cv.speed == 10)
    }, true)
    $('.fleet_speed', $footer).text((highSpeed?'高速舰队':'低速舰队'))
  }
}
