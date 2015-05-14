// apps/updater/fleet.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'collections/updater'
  , 'apps/common/page-util'
  , 'apps/common/socket'
  ]
, function($, _, Backbone, UpdaterCollection, pageUtil, socket){
    var updater = {
      initialize: function () {
        this.collection = new UpdaterCollection()
        this.collection.add({name: 'fleet'})
        socket.on('fleet_update', function (data) {
          updater.updateFleet(data)
        })
      }
    , fleetTimers: {}
    , expeditionTimers: {}
    , updateFleet: function (data) {
        for (var i in data) {
          var fleet = data[i]
            , fleetNum = parseInt(i)+1
          // write fleet name
          $('#fleet-name-'+fleetNum).text(fleet.name)

          $fleetTable = $('#fleet-' + fleetNum + '>table>tbody', '#tab-fleet')
          $fleetTable.html(Array(fleet.ships.length+1).join(fleetTableRowHtml))

          $fleetStatus = $('#fleet-' + fleetNum + '>.fleet-status', '#tab-fleet')


          clearInterval(updater.expeditionTimers[i])

          if (fleet.mission[0] != 0) {
            $('.status-detail', $fleetStatus).text( '#' + fleet.mission[1]
                                                  + ' '
                                                  + fleet.mission_name
                                                  + ' - ')
            if (fleet.mission[0] == 1) {
              $('.status-info', $fleetStatus).text('远征中')
              $fleetStatus.attr('class', 'fleet-status alert alert-info')
              updater.fleetTimers[i] = pageUtil.setTimer( $('.status-timer', $fleetStatus)
                                       , fleet.mission[2])

              $eTime = $( '.expedition-table>tbody>tr:nth-child('
                                + (fleetNum-1)+')>.time')
              $eTime.text('')
              updater.expeditionTimers[i] = pageUtil.setTimer($eTime, fleet.mission[2])

            }
            else {
              $('.status-info', $fleetStatus).text('远征归来')
              $fleetStatus.attr('class', 'fleet-status alert alert-warning')
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

            $detail = $('.status-detail', $fleetStatus)
            if (major  > 0) {
              $detail.text('船只大破')
              $fleetStatus.attr('class', 'fleet-status alert alert-danger')
              clearInterval(updater.fleetTimers[i])
              $('.status-timer', $fleetStatus).text('')
            }
            else if (tired > 0 || almostTired > 0 || ok > 0) {
              $detail.text('疲劳恢复中 -')
              if (tired > 0 || almostTired > 0)
                $fleetStatus.attr('class', 'fleet-status alert alert-warning')
              else
                $fleetStatus.attr('class', 'fleet-status alert alert-success')
              d = new Date()
              // clearInterval(updater.fleetTimers[i])
              var timeLeft = $('.status-timer', $fleetStatus).text()
                , oldTick = Math.ceil(parseInt(timeLeft.split(':')[1])/3)
                , newTick = Math.ceil((49 - min_cond)/3)
              if (oldTick > newTick || !oldTick) {
                clearInterval(updater.fleetTimers[i])
                updater.fleetTimers[i] = pageUtil.setTimer( $('.status-timer', $fleetStatus)
                               , d.getTime()+newTick*180000)
              }

            } else {
              $detail.text('可以出击')
              $fleetStatus.attr('class', 'fleet-status alert alert-success')
              clearInterval(updater.fleetTimers[i])
              $('.status-timer', $fleetStatus).text('')
            }
            $('.status-info', $fleetStatus).text('母港待命')
          }

          for (var j in fleet.ships) {
            var ship = fleet.ships[j]
            $row = $('tr:nth-child('+(parseInt(j)+1)+')', $fleetTable)
            // console.log($row, ship)
            if (fleet.ships[j]) {
              $('.ship-name', $row).text(ship.name)
              $('.ship-type', $row).text(ship.type)
              $('.ship-level', $row).text('LV.'+ship.level)
              $('.exp-next', $row).text('Next: '+ship.exp[1])
              $('.ship-condition', $row).html(
                getConditionLabel(ship.condition))
              $('.ship-health-number', $row).text('HP: '
                                                 + ship.current_hp
                                                 + '/' +ship.max_hp)
              $('.ship-health', $row).html(
                pageUtil.getProgressBarHtml( ship.max_hp
                                  , ship.current_hp)
              )

              for (var k = 0; k < 4; k++) {
                // console.log(ship.equipment[k])
                if (ship.equipment[k])
                  $('#slot-'+(k+1), $row).html('<i class="fa fa-question-circle equipment-icon" data-toggle="tooltip" data-placement="top" title="'
                    + ship.equipment[k].name
                    +'"></i>')
                else
                  $('#slot-'+(k+1), $row).text(' ')
                // console.log(ship.equipment[i])
              }
            }
          }
          $('.equipment-icon').bstooltip()

          $footer = $('#fleet-footer-'+fleetNum)
          $('.fleet-anti-air', $footer).text(fleet.anti_air)
          $('.fleet-tracking', $footer).text(fleet.tracking)
          var totalLv = fleet.ships.reduce(function (pv, cv) {
            return pv + cv.level
          }, 0)
          $('.fleet-avg-lv', $footer).text(Math.floor(totalLv / fleet.ships.length))
          $('.fleet-total-lv', $footer).text(totalLv)

          var highSpeed = fleet.ships.reduce(function (pv, cv) {
            return (pv && cv.speed == 10)
          }, true)
          $('.fleet-speed', $footer).text((highSpeed?'高速舰队':'低速舰队'))
        }
      }

    }
    return updater
  }
)
var fleetTableRowHtml = '<tr>'
                      + '<td>'
                      +   '<span class="ship-name"></span>'
                      +   '</br>'
                      +   '<span class="ship-type"></span>'
                      + '</td>'
                      + '<td>'
                      +   '<span class="ship-level"></span>'
                      +   '</br>'
                      +   '<span class="exp-next"></span>'
                      + '</td>'
                      + '<td>'
                      +   '<span class="ship-health-number"></span>'
                      +   '</br>'
                      +   '<span class="ship-health"></span>'
                      + '</td>'
                      + '<td class="ship-condition"></td>'
                      + '<td class="ship-equipment hidden-td" id="slot-1">1</td>'
                      + '<td class="ship-equipment hidden-td" id="slot-2">2</td>'
                      + '<td class="ship-equipment hidden-td" id="slot-3">3</td>'
                      + '<td class="ship-equipment hidden-td" id="slot-4">4</td>'
                      + '</tr>'


function getConditionLabel (cond) {
  if (cond > 49)
    color = 'yellow'
  else if (cond > 39)
    color = 'grey'
  else if (cond > 29)
    color = '#F5DEB3'
  else if (cond > 19)
    color = 'orange'
  else
    color = 'red'

  if (color == 'yellow')
    textColor = 'orange'
  else
    textColor = 'white'

  res = '<span class="label" '
      +       'style="background-color:' + color + ';'
      +              'color:' + textColor + ';">'
      +  cond + '</span>'
  return res
}
