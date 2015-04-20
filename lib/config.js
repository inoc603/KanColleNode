var config = {}
  , CONFIG_FILE = 'config/config.json'
  , fs = require('fs')

config = JSON.parse(fs.readFileSync(CONFIG_FILE).toString())
function save () {
  console.log('saving', config)
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config))
}
function update (newConfig) {
  config = newConfig
  save()
}
module.exports.config = config
module.exports.update = update
module.exports.save = save