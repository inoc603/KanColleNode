var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')

function QuestClear (req, data, admiral) {
  console.log(req.api_quest_id)
  if (admiral.activeQuests[req.api_quest_id])
    delete admiral.activeQuests[req.api_quest_id]
  if (admiral.availableQuests[req.api_quest_id])
    delete admiral.availableQuests[req.api_quest_id]
  console.log(admiral.activeQuests)
}

module.exports.handler = function (socket) {
  io = socket
  return QuestClear
}

module.exports.api = ['/api_req_quest/clearitemget']
