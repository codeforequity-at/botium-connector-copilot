const debug = require('debug')('botium-connector-copilot')
const _ = require('lodash')

const DirectlineConnector = require('botium-connector-directline3').PluginClass
const util = require('util')

const Defaults = {
  COPILOT_BUTTON_TYPE: 'message',
  COPILOT_BUTTON_VALUE_FIELD: 'text'
}

class BotiumConnectorCopilot {
  constructor ({ queueBotSays, caps }) {
    this.queueBotSays = queueBotSays
    this.caps = caps
    this.delegateConnector = null
    this.delegateCaps = null
  }

  async Validate () {
    debug('Validate called')

    this._getDelegate().Validate()
  }

  async Build () {
    debug('Build called')

    this._getDelegate().Build()
  }

  async Start () {
    debug('Start called')
    this.delegateConnector.Start()
  }

  async UserSays (msg) {
    debug('UserSays called')
    this.delegateConnector.UserSays(msg)
  }

  Stop () {
    debug('Stop called')

    this.delegateConnector.Stop()
  }

  Clean () {
    debug('Clean called')

    this.delegateConnector.Clean()
    this.delegateConnector = null
    this.delegateCaps = null
  }

  _getDelegate () {
    if (!this.delegateConnector) {
      const tempCaps = Object.assign({}, Defaults, _.pickBy(this.caps, (value, key) => !Object.prototype.hasOwnProperty.call(Defaults, key) || !_.isString(value) || value !== ''))
      this.delegateCaps = {}

      for (const capName of Object.keys(tempCaps)) {
        if (capName.startsWith('COPILOT_')) {
          this.delegateCaps[capName.replace('COPILOT_', 'DIRECTLINE3_')] = tempCaps[capName]
        } else {
          this.delegateCaps[capName] = this.caps[capName]
        }
      }
      debug(`delegateCaps ${util.inspect(this.delegateCaps)}`)
      this.delegateConnector = new DirectlineConnector({ queueBotSays: this.queueBotSays, caps: this.delegateCaps })
    }
    return this.delegateConnector
  }
}

module.exports = BotiumConnectorCopilot
