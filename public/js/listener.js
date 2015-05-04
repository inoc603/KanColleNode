function update_material (data) {
	for (key in data)
		$('.amount', '.test_division#resource>#res'+key).text(data[key])
}

function update_basic (data) {
  // for (key in data)
  //   $('#'+key, '#tab_basic').text(data[key])
  // console.log(data)
  if (data.name)
    if ($('span#admiral_name').text() == '') {
      $('span#admiral_name').text(data.name)
      $('span#admiral_lv').text('lv.'+data.level)
      $('span#admiral_rank').text(getRank(data.rank))
    }
    else if (data.name == $('span#admiral_name').text()) {
      $('span#admiral_lv').text('lv.'+data.level)
      $('span#admiral_rank').text(getRank(data.rank))
    }
}

function getRank (num) {
  switch (num) {
    case 1: return '元帅'; break
    case 2: return '大将'; break
    case 3: return '中将'; break
    case 4: return '少将'; break
    case 5: return '大佐'; break
    case 6: return '中佐'; break
    case 7: return '新米中佐'; break
    case 8: return '少佐'; break
    case 9: return '中坚少佐'; break
    case 10: return '新米少佐'; break
    default: return num; break
  }
}

var fleetTableRowHtml = '<tr>'
                      // + '<td class="col-md-4">'
                      + '<td>'
                      +   '<span class="ship_name"></span>'
                      +   '</br>'
                      +   '<span class="ship_type"></span>'
                      + '</td>'
                      // + '<td class="col-md-4">'
                      + '<td>'
                      +   '<span class="ship_level"></span>'
                      +   '</br>'
                      +   '<span class="exp_next"></span>'
                      + '</td>'
                      + '<td>'
                      // + '<td class="col-md-6">'
                      + '<td>'
                      +   '<span class="ship_health_number"></span>'
                      +   '</br>'
                      +   '<span class="ship_health"></span>'
                      + '</td>'
                      // + '<td class="ship_condition col-md-2"></td>'
                      + '<td class="ship_condition col-md-2"></td>'
                      + '</tr>'
var fleetTimers = {}
var expeditionTimers = {}

function updateFleet (data) {
  for (var i in data) {
    var fleet = data[i]
      , fleetNum = parseInt(i)+1
    $fleetNameSpan = $( '.fleet_tab>a[href="#fleet_'
                      + fleetNum + '"]>span:last-child')

    // console.log($fleetNameSpan)
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

var repairTimers = {}

function updateRepair (data) {
  for (var i in data) {
    
    $row = $('.repair_table>tbody>tr:nth-child('+i+')')
    $name = $('.ship', $row)
    $time = $('.time', $row)
    clearInterval(repairTimers[i])
    $time.text('')
    switch (data[i].state) {
      case 'occupied':
        $name.text(data[i].ship.name)
        repairTimers[i] = setTimer($time, data[i].complete_time)
        break;
      case 'empty':
        $name.text('空闲')
        break;
      case 'locked':
        $name.text('未解锁')
        break;
    }
  }
}

function setTimer ($timer, time) {
  $timer.show()
  var countdown = setInterval(function () {
    d = new Date()
    remaining = Math.floor((time - d.getTime())/1000)
    if (remaining <= 0) {
      clearInterval(countdown)
      return
    }
    h = (Math.floor(remaining / 3600) + 100).toString().substr(-2, 2)
    m = (Math.floor((remaining % 3600)/60) +100).toString().substr(-2, 2)
    s = (remaining % 60 + 100).toString().substr(-2, 2)
    remainStr = [h, m, s].join(':')
    $timer.text(remainStr)
  }, 500)
  return countdown
}

function getProgressBarHtml (max, now) {
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

var buildTimers = {}

function updateBuild (data) {
  for (var i in data) {
    $row = $('.build_table>tbody>tr:nth-child('+i+')')
    $name = $('.ship', $row)
    $time = $('.time', $row)
    clearInterval(buildTimers[i])
    $time.text('')
    if (data[i]['state'] == -1) {
      $name.text('未解锁')
    }
    else if (data[i]['state'] == 0) {
      $name.text('空闲')
    }
    else if (data[i]['state'] == 3) {
      $name.text(data[i]['name'])
      $time.text('完成')
    }
    else {
      // console.log(i, data[i]['state'])
      $name.text(data[i]['name'])
      buildTimers[i] = setTimer($time, data[i].complete_time)
    }
  }
}

function updateDayBattle (data) {
  showBattleInfo()
  console.log(data.air)
  fleetDayBattle('.battle_table_friendly', data.friendly)
  fleetDayBattle('.battle_table_enemy', data.enemy)
  
  $('#stance').text(getStance(data.stance))
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
    
  var res = '<span class="label hp_label '+decorator+'">'+status+'</span>'
  return res
}

function getFormation (num) {
  switch (num) {
    case 1:
      return '单纵阵'
    case 2:
      return '复纵阵'
    case 3:
      return '轮型阵'
    case 4:
      return '梯形阵'
    case 5:
      return '单横阵'
    case '14':
      return '战斗队形'
    case '13':
      return '轮型阵'
    case '12':
      return '前方警戒'
    case '11':
      return '对潜警戒'
    default:
      return 'unknown'
  }
}

function fleetDayBattle (table, fleet) {
  $fTable = $(table)
  if (typeof fleet.name != 'undefined')
    $('.fleet_name', $fTable).text(fleet.name)
  // console.log(fleet)
  $('.formation', $fTable).text(getFormation(fleet.formation))
  // $('span.casualty', $fTable).text(Math.round(fleet.casualty*100, -2)+'%')
  for (var i = 2; i <= fleet.ships.length+1; i++) {
    $row = $('tbody>tr:nth-child('+i+')', $fTable)
    $row.find('span').text(' ')
    if (table == '.battle_table_friendly' || table == '.battle_table_combined')
      suffix = '-LV.' + fleet.ships[i-2].level
    else
      suffix = (fleet.ships[i-2].yomi == '-'?'':' '+fleet.ships[i-2].yomi)
    $('td.name', $row).text( fleet.ships[i-2].name + suffix)
    var maxHp = fleet.ships[i-2]['max_hp']
      , dayStartHp = fleet.ships[i-2]['day_start_hp']
      , dayEndHp = Math.round(fleet.ships[i-2]['day_end_hp'])

    $('td.day_start>span.hp', $row).text(dayStartHp + '/' + maxHp)
    if (table != '.battle_table_enemy')
      $('td.day_start>span.status', $row).html(getHpLabel(dayStartHp, maxHp))
    $('td.day_end>span.hp', $row).text(dayEndHp)
    $('td.day_end>span.status', $row).html(getHpLabel(dayEndHp, maxHp))

  }
  for (var i = fleet.ships.length+2; i<=7; i++) {
    $row = $('tbody>tr:nth-child('+i+')', $fTable)
    $row.find('span').text(' ')
    $('td.name', $row).text(' ')
  }
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

function updateNightBattle (data) {
  if ($('#peace').css('display') != 'none') {
    $('#peace').hide()
    // $('#battle_info').
    $('.battle_table_enemy').show()
  }
  if (data.special) {
    $fTable = $('.battle_table_enemy')
    var fleet = data.enemy
    for (var i = 2; i <= fleet.ships.length+1; i++) {
      $row = $('tbody>tr:nth-child('+i+')', $fTable)
      $row.find('span').text(' ')
      suffix = (fleet.ships[i-2].yomi == '-'?'':' '+fleet.ships[i-2].yomi)
      $('td.name', $row).text( fleet.ships[i-2].name + suffix)
      var maxHp = fleet.ships[i-2].max_hp
        , dayStartHp = fleet.ships[i-2].night_start_hp

      $('td.day_start>span.hp', $row).text(dayStartHp + '/' + maxHp)
    }
    for (var i = fleet.ships.length+2; i<=7; i++) {
      $row = $('tbody>tr:nth-child('+i+')', $fTable)
      $row.find('span').text(' ')
      $('td.name', $row).text(' ')
    }
  }
  fleetNightBattle('.battle_table_friendly', data.friendly)
  fleetNightBattle('.battle_table_enemy', data.enemy)
}

function fleetNightBattle (table, fleet) {
  $fTable = $(table)
  if (fleet.name)
    $('.fleet_name', $fTable).text(fleet.name)
  if (fleet.formation)
    $('.formation', $fTable).text(fleet.formation)
  for (var i = 2; i <= fleet.ships.length+1; i++) {
    $row = $('tbody>tr:nth-child('+i+')', $fTable)
    var maxHp = fleet.ships[i-2].max_hp
      , nightStartHp = fleet.ships[i-2].night_start_hp
      , nightEndHp = Math.round(fleet.ships[i-2].night_end_hp)

    $('td.night_end>span.hp', $row).text(nightEndHp)
    $('td.night_end>span.status', $row).html(getHpLabel(nightEndHp, maxHp))

  }
}

function mapStart (data) {
  console.log(data)
  var map = data.map_area+'-'+data.map_num
    // , fleet = data.enemy
  $('#map').text(map)
  showBattleInfo()
  $('p#battle_info>span').text(' ')
  netaBattle('.battle_table_friendly', data.fleet)

  if (data.fleet_combined) {
    $('.battle_table_combined').show()
    netaBattle('.battle_table_combined', data.fleet_combined)
    $('.battle_table_friendly>thead>tr>td>span.fleet_name')
      .text( data.fleet.name
           + ' & ' + data.fleet_combined.name
           + ' 联合舰队')
  }

  if (data.event == 'battle' || data.event == 'air_battle' || data.event == 'night_battle')
    netaBattle('.battle_table_enemy', data.enemy)
  else
    netaPeace()
}

function showBattleInfo () {
  $('div#no_battle').hide()
  $('.battle_table_friendly').show()
  $('.battle_table_enemy').show()
  $('p#battle_info').show()
  $('p#peace').hide()
}

function hideBattleInfo () {
  $('div#no_battle').show()
  $('.battle_table_friendly').hide()
  $('.battle_table_enemy').hide()
  $('.battle_table_combined').hide()
  $('p#battle_info').hide()
  $('p#peace').hide()
}

function mapNext (data) {
  console.log(data)
  $('p#battle_info>span').text(' ')
  netaBattle('.battle_table_friendly', data.fleet)

  if (data.fleet_combined) {
    $('.battle_table_combined').show()
    netaBattle('.battle_table_combined', data.fleet_combined)
    $('.battle_table_friendly>thead>tr>td>span.fleet_name')
      .text( data.fleet.name
           + ' & ' + data.fleet_combined.name
           + ' 联合舰队')
  }

  if (data.event == 'battle' || data.event == 'air_battle' || data.event == 'night_battle')
    netaBattle('.battle_table_enemy', data.enemy)
  else
    netaPeace()
}

function netaBattle (table, fleet) {
  $fTable = $(table)
    
  // console.log(fleet)
  showBattleInfo()

  $('.casualty', $fTable).text(' ')

  if (table == '.battle_table_friendly')
    $('.formation', $fTable).text(' ')
  else
    $('.formation', $fTable).text(getFormation(fleet.formation))

  if (typeof fleet.name != 'undefined') {
    $('.fleet_name', $fTable).text(fleet.name)
    for (var i = 2; i <= fleet.ships.length+1; i++) {
      $row = $('tbody>tr:nth-child('+i+')', $fTable)
      $row.find('span').text(' ')
        
      if (table != '.battle_table_enemy') {
        var maxHp = fleet.ships[i-2]['max_hp']
          , dayStartHp = fleet.ships[i-2]['current_hp']

        suffix = '-LV.' + fleet.ships[i-2].level
        $('td.day_start>span.hp', $row).text(dayStartHp + '/' + maxHp)
        $('td.day_start>span.status', $row).html(getHpLabel(dayStartHp, maxHp))
      }
      else {
        suffix = (fleet.ships[i-2].yomi == '-'?'':' '+fleet.ships[i-2].yomi)
      }
      $('td.name', $row).text(fleet.ships[i-2].name + suffix)
    }

    for (var i = fleet.ships.length+2; i<=7; i++) {
      $row = $('tbody>tr:nth-child('+i+')', $fTable)
      $row.find('span').text(' ')
      $('td.name', $row).text(' ')
    }
  }
  else if (typeof fleet.id != 'undefined') {
    $('.fleet_name', $fTable).text('敌方舰队No.' + fleet.id)
    for (var i = 1; i<=7; i++) {
      $row = $('tbody>tr:nth-child('+i+')', $fTable)
      $row.find('span').text(' ')
      $('td.name', $row).text(' ')
    }
  }
}

// preview non-battle points
function netaPeace () {
  $fTable = $('.battle_table_enemy')
  for (var i = 1; i<=7; i++) {
    $row = $('tbody>tr:nth-child('+i+')', $fTable)
    $row.find('span').text(' ')
    $('td.name', $row).text(' ')
  }
  $('.battle_table_enemy').hide()
  $('p#battle_info').hide()
  $('p#peace').show()
  $('p#peace').text('Love and Peace, baby!')
}

function questUpdate (data) {
  console.log(data)
  $fTable = $('.quest_table')
  len = data.quests.length
  pos = 1
  for (var i in data.quests) {
    $row = $('tbody>tr:nth-child('+pos+')', $fTable)
    $('td.type', $row).html(getQuestType(data.quests[i].category))
    $('td.name', $row).text(data.quests[i].name)
    $('td.quest_progress', $row).html(getQuestProgress(data.quests[i].state
                                                    , data.quests[i].progress))
    pos++
  }
  while (pos <= data.count) {
    $row = $('tbody>tr:nth-child('+pos+')', $fTable)
    $('td.type', $row).html(getQuestType(0))
    $('td.name', $row).text('unknown')
    $('td.quest_progress', $row).text(' ')
    pos++
  }
  while (pos <= 7) {
    $row = $('tbody>tr:nth-child('+pos+')', $fTable)
    $row.children().each(function () {
      $(this).text(' ')
    })
    pos++
  }
}

function getQuestType (category) {
  var questColors = [ '#7E7E7E' ,'#33CC33', 'red', '#99FF66'
                    , '#66CCFF', '#FFD633', '#7C3B19', '#CC99FF']
    , questType = [ '未知', '编成', '出击', '演习', '远征'
                  ,'补给', '工厂', '改修']
    , res = '<span class="label" style="background-color:'
          + questColors[category] + ';">' + questType[category] + '</span>'
  console.log(category, res)
  return res
}

function getQuestProgress (state, progress) {
  var text, labelClass
  if (state == 3) {
    labelClass = 'label-primary'
    text = '完成'
  }
  else {
    switch (progress) {
      case 1:
        labelClass = 'label-success'
        text = '50%'
        break
      case 2:
        labelClass = 'label-success'
        text = '80%'
        break
      default:
        return ''
    }
  }
  var res = '<span class="label '+labelClass+'">'+text+'</span>'
  return res
}

function updateDayBattleCombined (data) {
  showBattleInfo()
  $('.battle_table_combined').show()
  console.log(data)
  fleetDayBattle('.battle_table_friendly', data.friendly.back)
  fleetDayBattle('.battle_table_combined', data.friendly.front)
  fleetDayBattle('.battle_table_enemy', data.enemy)
  $('.battle_table_friendly>thead>tr>td>span.fleet_name')
    .text(data.friendly.back.name+' & '+data.friendly.front.name)
  $('.battle_table_friendly>thead>tr>td>span.formation')
    .text(getFormation(data.friendly.formation))
  // $('.battle_table_friendly>thead>tr>td>span.casualty')
    // .text(Math.round(data.friendly.casualty*100, -2)+'%')
  
  $('#stance').text(getStance(data.stance))
}

function updateNightBattleCombined (data) {
  
  $fTable = $('.battle_table_friendly')

  if (data.special) {
    // fill start for the enemy
    $eTable = $('.battle_table_enemy')
    var fleet = data.enemy
    for (var i = 2; i <= fleet.ships.length+1; i++) {
      $row = $('tbody>tr:nth-child('+i+')', $eTable)
      $row.find('span').text(' ')
      suffix = (fleet.ships[i-2].yomi == '-'?'':' '+fleet.ships[i-2].yomi)
      $('td.name', $row).text( fleet.ships[i-2].name + suffix)
      var maxHp = fleet.ships[i-2].max_hp
        , dayStartHp = fleet.ships[i-2].night_start_hp

      $('td.day_start>span.hp', $row).text(dayStartHp + '/' + maxHp)
    }
    for (var i = fleet.ships.length+2; i<=7; i++) {
      $row = $('tbody>tr:nth-child('+i+')', $eTable)
      $row.find('span').text(' ')
      $('td.name', $row).text(' ')
    }

    // copy the status from day start for the front fleet
    for (var i = 2; i <= 7; i++) {
      $row = $('tbody>tr:nth-child('+i+')', $fTable)
      var dayStartHp = $('td.day_start>span.hp', $row).text()
        , dayStartStatus = $('td.day_start>span.status', $row).html()
      console.log(dayStartHp, dayStartStatus)

      $('td.night_end>span.hp', $row).text(dayStartHp)
      $('td.night_end>span.status', $row).html(dayStartStatus)

    }
  }
  // copy the status from day end for the front fleet
  else {
    for (var i = 2; i <= 7; i++) {
      $row = $('tbody>tr:nth-child('+i+')', $fTable)
      var dayEndHp = $('td.day_end>span.hp', $row).text()
        , dayEndStatus = $('td.day_end>span.status', $row).html()
      console.log(dayEndHp, dayEndStatus)

      $('td.night_end>span.hp', $row).text(dayEndHp)
      $('td.night_end>span.status', $row).html(dayEndStatus)
    }
  }
  
  fleetNightBattle('.battle_table_combined', data.friendly)
  fleetNightBattle('.battle_table_enemy', data.enemy)
}