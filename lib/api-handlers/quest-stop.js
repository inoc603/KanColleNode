var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')

function QuestStop (req, data, admiral) {
  console.log('[INFO] stop quest no.', req.api_quest_id)
  if (admiral.activeQuests[req.api_quest_id])
    delete admiral.activeQuests[req.api_quest_id]
  console.log(admiral.activeQuests)
}

module.exports = function (socket) {
  io = socket
  return QuestStop
}
