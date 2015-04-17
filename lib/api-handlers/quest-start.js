var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')

function QuestStart (req, data, admiral) {
  console.log('[INFO] start quest no.', req.api_quest_id)
  console.log(gameData.quests[req.api_quest_id])
  admiral.activeQuests[req.api_quest_id] = gameData.quests[req.api_quest_id]
  console.log(admiral.activeQuests)
}

module.exports = function (socket) {
  io = socket
  return QuestStart
}
