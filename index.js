const fs = require('fs')
const path = require('path')

const PluginClass = require('./src/connector')

const logo = fs.readFileSync(path.join(__dirname, 'logo.png')).toString('base64')

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
    },
    capabilities: [
      {
        name: 'COPILOT_API_KEY',
        label: 'Copilot API key',
        description: 'In Copilot navigate to Settings->API',
        type: 'secret',
        required: true
      },
      {
        name: 'COPILOT_CHANNEL_ID',
        label: 'Copilot Channel id',
        description: 'You can find it in the URL if you navigate to a channel in Copilot Dashboard. The URL will be: https://dashboard.copilot.com/messaging?channelId=messaging:<<channel id>>',
        type: 'string',
        required: true
      },
      {
        name: 'COPILOT_SENDER_ID',
        label: 'Copilot Client id',
        description: 'You can find it in the URL if you navigate to a client in Copilot Dashboard. The URL will be: https://dashboard.copilot.com/clients/users/details?clientUserId=<<user id>>',
        type: 'string',
        required: true
      },
      {
        name: 'COPILOT_POLLING_INTERVAL',
        label: 'Copilot polling interval',
        description: 'The interval in milliseconds to poll for new messages. High interval can cause slow communication, low interval can cause reaching Copilot Api limits earlier. Default is 1000 ms',
        type: 'int',
        required: false,
        advanced: true
      },
      {
        name: 'COPILOT_POLLING_LIMIT',
        label: 'Copilot polling limit',
        description: 'The maximum number of messages to fetch in one poll. High polling limit can cause performance issues on booth sides. Low polling limit can cause data loss. Default is 10.',
        type: 'int',
        required: false,
        advanced: true
      }
    ]
  }
}
