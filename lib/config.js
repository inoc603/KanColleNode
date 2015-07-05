var config = {}
  , CONFIG_FILE = 'config/config.json'
  , DEFAULT_CONFIG = 'config/default-config.json'
  , fs = require('fs')

try {
  config = JSON.parse(fs.readFileSync(CONFIG_FILE).toString())
}
catch(e) {
  if (e.code == 'ENOENT') {
    var defaultConfig = fs.readFileSync(DEFAULT_CONFIG).toString()
    config = JSON.parse(defaultConfig)
    save()
  }
}

function save () {
  console.log('saving', config)
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config))
}

function update (newConfig) {
  config = newConfig
  save()
}

function get (key) {
  return config[key]
}

module.exports.config = config
module.exports.update = update
module.exports.save = save
module.exports.get = get
