define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'collections/updater'
  , 'apps/common/socket'
  , 'apps/common/page-util'
  , 'apps/common/service'
  , 'apps/common/globals'
  ]
, function ($, _, Backbone, UpdaterCollection, socket, pageUtil, service
           , globals){
    var updater = {
      initialize: function () {
        this.collection = new UpdaterCollection()
        this.collection.add({name: 'battle'})
        socket.on('day_battle_update', function (data) {
          updater.updateDayBattle(data)
        })
        .on('night_battle_update', function (data) {
          updater.updateNightBattle(data)
        })
        .on('day_combined_battle_update', function (data) {
          updater.updateDayBattleCombined(data)
        })
        .on('combined_night_battle_update', function (data) {
          updater.updateNightBattleCombined(data)
        })
        .on('map_start', function (data) {
          updater.mapStart(data)
        })
        .on('clear_battle', function (data) {
        })
        .on('map_next', function (data) {
          updater.mapNext(data)
        })
        .on('battle_result', function (data) {
          updater.updateResult(data)
        })
      }
    , updateDayBattle: function (data) {
        console.log(data)
        // clearBattleTable()
        pageUtil.showBattleInfo(false)
        fillFleetInfo(tableFriendly, data.friendly)
        fillFleetInfo(tableEnemy, data.enemy)
        fleetDayBattle(tableFriendly, data.friendly)
        fleetDayBattle(tableEnemy, data.enemy)

        $('#stance').text(getStance(data.stance))
        $('#battle-result>#rank').text(data.rank)
        $('#battle-result>#mvp').text(data.mvp)
      }
    , updateNightBattle: function (data) {
        pageUtil.showBattleInfo(false)
        console.log(data)
        if (data.special == true) {
          console.log('special night battle')
          // clearBattleTable()
          fillFleetInfo(tableFriendly, data.friendly)
          fillFleetInfo(tableEnemy, data.enemy)
          fillShipName(tableEnemy, data.enemy)
          fillShipName(tableFriendly, data.friendly)
          fillStart(tableEnemy, data.enemy)
          fillStart(tableFriendly, data.friendly)
        }
        fleetNightBattle(tableFriendly, data.friendly)
        fleetNightBattle(tableEnemy, data.enemy)
        $('#battle-result>#rank').text(data.rank)

      }
    , updateDayBattleCombined: function (data) {
        pageUtil.showBattleInfo(true)
        // clearBattleTable()
        console.log(data)
        fleetDayBattle(tableFriendly, data.friendly.back)
        fleetDayBattle(tableCombined, data.friendly.front)
        fleetDayBattle(tableEnemy, data.enemy)
        $('#battle-table-friendly .fleet-name')
          .text(data.friendly.back.name+' & '+data.friendly.front.name)
        $('#battle-table-friendly .formation')
          .text(getFormation(data.friendly.formation))

        $('#stance').text(getStance(data.stance))
      }
    , updateNightBattleCombined: function (data) {
        if (data.special == true) {
          console.log('special night battle')
          pageUtil.showBattleInfo(true)
          // clearBattleTable()
          fillShipName(tableEnemy, data.enemy)
          fillShipName(tableFriendly, data.friendly.back)
          fillShipName(tableCombined, data.friendly.front)
          fillStart(tableEnemy, data.enemy)
          fillStart(tableFriendly, data.friendly.back)
          fillStart(tableCombined, data.friendly.front)
        }
        fleetNightBattle(tableCombined, data.friendly.front)
        fleetNightBattle(tableEnemy, data.enemy)

        var $fTable = $(tableFriendly)

        if (data.special) {
          // copy the status from day start for the back fleet
          for (var i = 2; i <= 7; i++) {
            var $row = $('tbody>tr:nth-child('+i+')', $fTable)
              , dayStartHp = $('td.day-start>span.hp', $row).text()
              , dayStartStatus = $('td.day-start>span.status', $row).html()

            $('td.night-end>span.hp', $row).text(dayStartHp)
            $('td.night-end>span.status', $row).html(dayStartStatus)

          }
        }
        // copy the status from day end for the back fleet
        else {
          for (var i = 2; i <= 7; i++) {
            var $row = $('tbody>tr:nth-child('+i+')', $fTable)
              , dayEndHp = $('td.day-end>span.hp', $row).text()
              , dayEndStatus = $('td.day-end>span.status', $row).html()

            $('td.night-end>span.hp', $row).text(dayEndHp)
            $('td.night-end>span.status', $row).html(dayEndStatus)
          }
        }
      }
    , mapStart: function (data) {
        var battleEvents = ['battle', 'air_battle', 'night_battle']
        console.log(data)
        var map = data.map_area+'-'+data.map_num
        $('#map-info').text(map)
        clearBattleTable()
        pageUtil.showBattleInfo(typeof data.fleet_combined != 'undefined')
        $('#battle-info>span').text(' ')

        this.neta(tableFriendly, data.fleet)

        if (data.fleet_combined) {
          this.neta(tableCombined, data.fleet_combined)
          $('#battle-table-friendly .fleet-name')
            .text( data.fleet.name
                 + ' & ' + data.fleet_combined.name
                 + ' 联合舰队')
        }

        if (_.contains(battleEvents, data.event))
          this.neta(tableEnemy, data.enemy)

      }
    , mapNext: function (data) {
        var battleEvents = ['battle', 'air_battle', 'night_battle']
        console.log(data)
        clearBattleTable()
        pageUtil.showBattleInfo(typeof data.fleet_combined != 'undefined')
        $('#battle-info>span').text(' ')
        this.neta(tableFriendly, data.fleet)

        if (data.fleet_combined) {
          this.neta(tableCombined, data.fleet_combined)
          $('#battle-table-friendly .fleet-name')
            .text( data.fleet.name
                 + ' & ' + data.fleet_combined.name
                 + ' 联合舰队')
        }

        if (_.contains(battleEvents, data.event))
          this.neta(tableEnemy, data.enemy)

      }
    , neta: function (table, fleet) {
        fillFleetInfo(table, fleet)
        fillShipName(table, fleet)
        fillStart(table, fleet)
      }
    , updateResult: function (res) {
        // console.log('battle result', res)
        $('#battle-result>#mvp').text(res.mvp_name)
        $('#battle-result #ship-get').text(res.get_ship_name)
        var oldRank = $('#battle-result>#rank').text()
        if (oldRank != res.rank) {
          if (oldRank != 'SS') {
            $('#battle-result>#rank').text(res.rank)
          }
        }
        var send = {}
        send.code = globals.user.code
        send.place = res.map_area + '-' + res.map_number
        send.point = res.map_point
        send.shipid = res.get_ship_id
        send.shiptype = res.get_ship_type
        send.rank = res.rank
        service.ship.uploadShipGet(send, function (uploadRes) {
          console.log(uploadRes)
        })
        console.log(send)
      }

    }
    return updater
  }
)

var tableEnemy = '#battle-table-enemy'
  , tableFriendly = '#battle-table-friendly'
  , tableCombined = '#battle-table-combined'

function clearBattleTable () {
  $('.name,.hp,.status,.fleet-name,.formation', $('.battle-table')).text('')
}

function fillFleetInfo (table, fleet) {
  if (fleet.name)
    $('.fleet-name', $(table)).text(fleet.name)
  if (fleet.formation)
    $('.formation', $(table)).text(getFormation(fleet.formation))
}

function fillShipName (table, fleet) {
  var isEnemy = (table == tableEnemy)
  var $table = $(table)
  for (var i in fleet.ships) {
    var $row = $('#ship-'+(parseInt(i)+1), $table)
      , suffix = ( isEnemy
                 ? (fleet.ships[i].yomi=='-'?'':' '+fleet.ships[i].yomi)
                 : '-LV.' + fleet.ships[i].level
                 )
    $('.name', $row).text(fleet.ships[i].name + suffix)
  }
}

function fillStart (table, fleet) {
  var isEnemy = (table == tableEnemy)
  var $table = $(table)
  for (var i in fleet.ships) {
    var $row = $('#ship-'+(parseInt(i)+1), $table)
      , maxHp = fleet.ships[i].max_hp
      , dayStartHp = ( fleet.ships[i].start_hp
                     ? fleet.ships[i].start_hp
                     : fleet.ships[i].current_hp)
    if (maxHp && dayStartHp)
      $('.day-start>.hp', $row).text(dayStartHp + '/' + maxHp)
    if (!isEnemy)
      $('.day-start>.status', $row).html(getHpLabel(dayStartHp, maxHp))
  }
}

function fillDayEnd (table, fleet) {
  var $table = $(table)
  for (var i in fleet.ships) {
    var $row = $('#ship-'+(parseInt(i)+1), $table)
      , maxHp = fleet.ships[i].max_hp
      , dayEndHp = Math.round(fleet.ships[i].end_hp)
    $('.day-end>.hp', $row).text(dayEndHp + '/' + maxHp)
    $('.day-end>.status', $row).html(getHpLabel(dayEndHp, maxHp))
  }
}

function fillNightEnd (table, fleet) {
  var $table = $(table)
  for (var i in fleet.ships) {
    var $row = $('#ship-'+(parseInt(i)+1), $table)
      , maxHp = fleet.ships[i].max_hp
      , nightEndHp = Math.round(fleet.ships[i].end_hp)
    $('.night-end>.hp', $row).text(nightEndHp + '/' + maxHp)
    $('.night-end>.status', $row).html(getHpLabel(nightEndHp, maxHp))
  }
}

function getHpLabel (now, max) {
  var percentage = now/max*100
  if (percentage == 100) {
    status = "无伤"
    decorator = 'label-success'
  }
  else if (percentage > 75) {
    status = "健在"
    decorator = 'label-success'
  }
  else if (percentage > 50) {
    status = "小破"
    decorator = 'label-caution'
  }
  else if (percentage > 25) {
    status = "中破"
    decorator = 'label-warning'
  }
  else if (percentage > 0) {
    status = "大破"
    decorator = 'label-danger'
  }
  else {
    status = '击沉'
    decorator = 'label-primary'
  }

  var res = '<span class="label hp-label '+decorator+'">'+status+'</span>'
  return res
}

function getFormation (num) {
  var formation = { '1': '单纵阵'
                  , '2': '复纵阵'
                  , '3': '轮型阵'
                  , '4': '梯形阵'
                  , '5': '单横阵'
                  , '14': '战斗队形'
                  , '13': '轮型阵'
                  , '12': '前方警戒'
                  , '11': '对潜警戒'
                  }
  return formation[num.toString()]
}

function fleetDayBattle (table, fleet) {
  fillShipName(table, fleet)
  fillStart(table, fleet)
  fillDayEnd(table, fleet)
}

function getStance (num) {
  switch (num) {
    case 1:
      return '同航战'
    case 2:
      return '反航战'
    case 3:
      return 'T字有利'
    case 4:
      return 'T字不利'
    default:
      return 'unknown'
  }
}

function fleetNightBattle (table, fleet) {
  fillShipName(table, fleet)
  fillNightEnd(table, fleet)
}
