// used to test new api
var fs= require('fs')
var tester = function (req, data, admiral) {
  console.log(req)
  // console.log(data)
  fs.writeFileSync('ship_deck'+new Date().getTime()+'.json', JSON.stringify(data))
}
module.exports.handler = function (socket) {
  return tester
}

// module.exports.api = ['/api_get_member/ship_deck']
