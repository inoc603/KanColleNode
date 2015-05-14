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
        })
      }
    , updateDayBattle: function (data) {
        clearBattleTable()
        pageUtil.showBattleInfo(false)
        fleetDayBattle('#battle-table-friendly', data.friendly)
        fleetDayBattle('#battle-table-enemy', data.enemy)

        $('#stance').text(getStance(data.stance))
      }
    , updateNightBattle: function (data) {
        pageUtil.showBattleInfo(false)
        console.log(data)
        if (data.special == true) {
          console.log('special night battle')
          clearBattleTable()
          fillShipName('#battle-table-enemy', data.enemy)
          fillShipName('#battle-table-friendly', data.friendly)
          fillStart('#battle-table-enemy', data.enemy)
          fillStart('#battle-table-friendly', data.friendly)
        }
        fleetNightBattle('#battle-table-friendly', data.friendly)
        fleetNightBattle('#battle-table-enemy', data.enemy)
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
  console.log(fleet)

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
                     : fleet.ships[i].night_start_hp)
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
      , dayEndHp = fleet.ships[i].day_end_hp
    $('.day-end>.hp', $row).text(dayEndHp + '/' + maxHp)
    $('.day-end>.status', $row).html(getHpLabel(dayEndHp, maxHp))
  }
}

function fillNightEnd (table, fleet) {
  var $table = $(table)
  for (var i in fleet.ships) {
    var $row = $('#ship-'+(parseInt(i)+1), $table)
      , maxHp = fleet.ships[i].max_hp
      , nightEndHp = fleet.ships[i].night_end_hp
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
  $table = $(table)
  if (typeof fleet.name != 'undefined')
    $('.fleet-name', $table).text(fleet.name)
  $('.formation', $table).text(getFormation(fleet.formation))
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
  $table = $(table)
  if (fleet.name)
    $('.fleet-name', $table).text(fleet.name)
  if (fleet.formation)
    $('.formation', $table).text(fleet.formation)
  for (var i = 2; i <= fleet.ships.length+1; i++) {
    $row = $('tbody>tr:nth-child('+i+')', $table)
    var maxHp = fleet.ships[i-2].max_hp
      , nightStartHp = fleet.ships[i-2].night_start_hp
      , nightEndHp = Math.round(fleet.ships[i-2].night_end_hp)

    $('td.night-end>span.hp', $row).text(nightEndHp)
    $('td.night-end>span.status', $row).html(getHpLabel(nightEndHp, maxHp))

  }
}
