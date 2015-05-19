// apps/updater/quest.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'collections/updater'
  , 'apps/common/socket'
  ]
, function($, _, Backbone, UpdaterCollection, socket){
    var questUpdater = {
      initialize: function () {
        this.collection = new UpdaterCollection()
        this.collection.add({name: 'quest'})
        socket.on('quest_update', function (data) {
          questUpdate(data)
        })

      }
    }
    return questUpdater
  }
)

function questUpdate (data) {
  console.log(data)
  $fTable = $('.quest-table')
  len = data.quests.length
  pos = 1
  for (var i in data.quests) {
    $row = $('tbody>tr:nth-child('+pos+')', $fTable)
    $('td.type', $row).html(getQuestType(data.quests[i].category))
    $('td.name', $row).text(data.quests[i].name)
    $('td.quest-progress', $row).html(getQuestProgress(data.quests[i].state
                                                    , data.quests[i].progress))
    pos++
  }
  while (pos <= data.count) {
    $row = $('tbody>tr:nth-child('+pos+')', $fTable)
    $('td.type', $row).html(getQuestType(0))
    $('td.name', $row).text('unknown')
    $('td.quest-progress', $row).text(' ')
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
