const fs = require('fs')
const path = require('path')

const PluginClass = require('./src/connector')

const logo = fs.readFileSync(path.join(__dirname, 'logo.ico')).toString('base64')

module.exports = {
  PluginVersion: 1,
  PluginClass: PluginClass,
  PluginDesc: {
    name: 'Copilot',
    avatar: logo,
    provider: 'Microsoft',
    features: {
      intentResolution: false,
      intentConfidenceScore: false
    }
  }
}
