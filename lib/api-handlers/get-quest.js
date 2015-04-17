var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , newKey = { 'api_type': 'type'
             , 'api_get_material': 'material'
             , 'api_category': 'category'
             , 'api_detail': 'detail'
             , 'api_title': 'name'
             , 'api_no': 'id'
             }

function getQuestPage (req, data, admiral) {
  // console.log(data)
  var questList = data.api_list
    , updateFlag = false

  if (!admiral.activeQuests)
    admiral.activeQuests = {}

  if (!admiral.availableQuests)
    admiral.availableQuests = {}

  admiral.activeQuestsCount = data.api_exec_count

  for (var i in questList) {
    if (questList[i] == -1) continue

    var questId = questList[i].api_no
    if (!gameData.quests[questId]) {
      var temp = {}
      for (var key in newKey) 
        temp[newKey[key]] = questList[i][key]
      gameData.quests[questId] = temp
      updateFlag = true
    }


    admiral.availableQuests[questId] = gameData.quests[questId]
      
    if (questList[i].api_state == 2 || questList[i].api_state == 3) {
      admiral.activeQuests[questId] = gameData.quests[questId]
      admiral.activeQuests[questId].progress = questList[i].api_progress_flag
      admiral.activeQuests[questId].state = questList[i].api_state
    }

    console.log(questList[i].api_state, questList[i].api_progress_flag)
  }
  if (updateFlag)
    gameData.store('quests')
  // console.log(admiral.activeQuests)

  var send = {}
  send.quests = admiral.activeQuests
  send.count = admiral.activeQuestsCount
  if (admiral.client)
    io.to(admiral.client).emit('quest_update', send)
  else
    io.emit('quest_update', send)
}

module.exports = function (socket) {
  io = socket
  return getQuestPage
}
