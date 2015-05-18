define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'collections/updater'
  , 'apps/common/socket'
  , 'apps/common/page-util'
  ]
, function ($, _, Backbone, UpdaterCollection, socket, pageUtil){
    var updater = {
      initialize: function () {
        this.collection = new UpdaterCollection()
        this.collection.add({name: 'battle'})
        socket.on('day_battle_update', function (data) {
          updater.updateDayBattle(data)
          console.log('day battle')
        }).on('night_battle_update', function (data) {
          updater.updateNightBattle(data)
          console.log('night battle')
        }).on('day_combined_battle_update', function (data) {
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
      }
    , updateDayBattle: function (data) {
        console.log(data)
        // clearBattleTable()
        pageUtil.showBattleInfo(false)
        fillFleetInfo('#battle-table-friendly', data.friendly)
        fillFleetInfo('#battle-table-enemy', data.enemy)
        fleetDayBattle('#battle-table-friendly', data.friendly)
        fleetDayBattle('#battle-table-enemy', data.enemy)

        $('#stance').text(getStance(data.stance))
      }
    , updateNightBattle: function (data) {
        pageUtil.showBattleInfo(false)
        console.log(data)
        if (data.special == true) {
          console.log('special night battle')
          // clearBattleTable()
          fillFleetInfo('#battle-table-friendly', data.friendly)
          fillFleetInfo('#battle-table-enemy', data.enemy)
          fillShipName('#battle-table-enemy', data.enemy)
          fillShipName('#battle-table-friendly', data.friendly)
          fillStart('#battle-table-enemy', data.enemy)
          fillStart('#battle-table-friendly', data.friendly)
        }
        fleetNightBattle('#battle-table-friendly', data.friendly)
        fleetNightBattle('#battle-table-enemy', data.enemy)
      }
    , updateDayBattleCombined: function (data) {
        pageUtil.showBattleInfo(true)
        // clearBattleTable()
        console.log(data)
        fleetDayBattle('#battle-table-friendly', data.friendly.back)
        fleetDayBattle('#battle-table-combined', data.friendly.front)
        fleetDayBattle('#battle-table-enemy', data.enemy)
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
          fillShipName('#battle-table-enemy', data.enemy)
          fillShipName('#battle-table-friendly', data.friendly.back)
          fillShipName('#battle-table-combined', data.friendly.front)
          fillStart('#battle-table-enemy', data.enemy)
          fillStart('#battle-table-friendly', data.friendly.back)
          fillStart('#battle-table-combined', data.friendly.front)
        }
        fleetNightBattle('#battle-table-combined', data.friendly.front)
        fleetNightBattle('#battle-table-enemy', data.enemy)

        var $fTable = $('#battle-table-friendly')

        if (data.special) {
          // copy the status from day start for the back fleet
          for (var i = 2; i <= 7; i++) {
            $row = $('tbody>tr:nth-child('+i+')', $fTable)
            var dayStartHp = $('td.day-start>span.hp', $row).text()
              , dayStartStatus = $('td.day-start>span.status', $row).html()
            // console.log(dayStartHp, dayStartStatus)

            $('td.night-end>span.hp', $row).text(dayStartHp)
            $('td.night-end>span.status', $row).html(dayStartStatus)

          }
        }
        // copy the status from day end for the back fleet
        else {
          for (var i = 2; i <= 7; i++) {
            $row = $('tbody>tr:nth-child('+i+')', $fTable)
            var dayEndHp = $('td.day-end>span.hp', $row).text()
              , dayEndStatus = $('td.day-end>span.status', $row).html()
            // console.log(dayEndHp, dayEndStatus)

            $('td.night-end>span.hp', $row).text(dayEndHp)
            $('td.night-end>span.status', $row).html(dayEndStatus)
          }
        }
      }
    , mapStart: function (data) {
        var battleEvents = ['battle', 'air_battle', 'night_battle']
        console.log(data)
        var map = data.map_area+'-'+data.map_num
          // , fleet = data.enemy
        $('#map-info').text(map)
        clearBattleTable()
        pageUtil.showBattleInfo(typeof data.fleet_combined != 'undefined')
        $('#battle-info>span').text(' ')

        this.neta('#battle-table-friendly', data.fleet)

        if (data.fleet_combined) {
          this.neta('#battle-table-combined', data.fleet_combined)
          $('#battle-table-friendly .fleet-name')
            .text( data.fleet.name
                 + ' & ' + data.fleet_combined.name
                 + ' 联合舰队')
        }

        if (_.contains(battleEvents, data.event))
          this.neta('#battle-table-enemy', data.enemy)

      }
    , mapNext: function (data) {
        var battleEvents = ['battle', 'air_battle', 'night_battle']
        console.log(data)
        clearBattleTable()
        pageUtil.showBattleInfo(typeof data.fleet_combined != 'undefined')
        $('#battle-info>span').text(' ')
        this.neta('#battle-table-friendly', data.fleet)

        if (data.fleet_combined) {
          this.neta('#battle-table-combined', data.fleet_combined)
          $('#battle-table-friendly .fleet-name')
            .text( data.fleet.name
                 + ' & ' + data.fleet_combined.name
                 + ' 联合舰队')
        }

        if (_.contains(battleEvents, data.event))
          this.neta('#battle-table-enemy', data.enemy)

      }
    , neta: function (table, fleet) {
        var $table = $(table)
        fillFleetInfo(table, fleet)
        fillShipName(table, fleet)
        fillStart(table, fleet)
      }
    }
    return updater
  }
)

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
  var isEnemy = (table == '#battle-table-enemy')
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
  var isEnemy = (table == '#battle-table-enemy')
  var $table = $(table)
  for (var i in fleet.ships) {
    var $row = $('#ship-'+(parseInt(i)+1), $table)
      , maxHp = fleet.ships[i].max_hp
      // in a special night battle, there's no day battle
      , dayStartHp = ( fleet.ships[i].day_start_hp
                     ? fleet.ships[i].day_start_hp
                     : (fleet.ships[i].night_start_hp
                       ?fleet.ships[i].night_start_hp
                       :fleet.ships[i].current_hp))
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
      , dayEndHp = Math.round(fleet.ships[i].day_end_hp)
    $('.day-end>.hp', $row).text(dayEndHp + '/' + maxHp)
    $('.day-end>.status', $row).html(getHpLabel(dayEndHp, maxHp))
  }
}

function fillNightEnd (table, fleet) {
  var $table = $(table)
  for (var i in fleet.ships) {
    var $row = $('#ship-'+(parseInt(i)+1), $table)
      , maxHp = fleet.ships[i].max_hp
      , nightEndHp = Math.round(fleet.ships[i].night_end_hp)
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
  var $table = $(table)
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
  var $table = $(table)
  fillShipName(table, fleet)
  fillNightEnd(table, fleet)
}
