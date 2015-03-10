var dataHandler = new Object()

  , handlers = { '/api_port/port' : updatePort
               // , '/api_get_member/basic' : startBasic
               }
  , io = null

dataHandler.process = function (rawBody, api, admiral) {
  // check if the response body is valid
  if (rawBody.slice(0, 7) == 'svdata=') {
    var bodyJson = JSON.parse(rawBody.slice(7))
    // check if result is normal
    if (bodyJson['api_result'] = 1)
      // check if there's a handler for the api
      if (api in handlers)
        // invoke the handler
        handlers[api](bodyJson['api_data'], admiral)
      else
        console.log('no handler for api')
    else
      console.log('kancolle server error')
  }
  else
    console.log('wrong data content')
}

function updatePort (data, admiral) {
  // console.log(data['api_basic']['api_nickname'])
  // io.emit('port_update', JSON.stringify(data))
  _portBasic(data['api_basic'], admiral)
  _portMaterial(data['api_material'], admiral)
  _portShip(data['api_ship'], admiral)

}

function _portBasic (data, admiral) {
  var send = {}
    , newKeyForBasic = { 'api_level' : 'level'
                       , 'api_rank' : 'rank'
                       , 'api_experience' : 'exp'
                       , 'api_max_chara' : 'max_ship'
                       , 'api_max_slotitem' : 'max_equipment'
                       , 'api_count_deck' : 'fleet_count'
                       , 'api_count_ndock' : 'repair_dock_count'
                       , 'api_count_kdock' : 'build_dock_count'
                       , 'api_nickname' : 'name'
                       }

  for (key in newKeyForBasic)
    send[newKeyForBasic[key]] = data[key]

  if (!admiral.memberId)
    send['mix_id'] = data['api_member_id'] + data['api_nickname_id']

  io.emit('basic_update', send)
}

function _portMaterial (data) {
  var send = {}
  for (i in data) {
    send[data[i]['api_id'].toString()] = data[i]['api_value']
  }
  io.emit('material_update', send)
}

function _portShip (data) {
  var send = { 'current_ship' : data.length}
  io.emit('basic_update', send)
}

function startBasic (data) {
  
}

module.exports = function (socket) {
  io = socket
  return dataHandler
}