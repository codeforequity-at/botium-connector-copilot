const debug = require('debug')('botium-connector-copilot')
const axios = require('axios')
const moment = require('moment')

const Capabilities = {
  COPILOT_SENDER_ID: 'COPILOT_SENDER_ID',
  COPILOT_CHANNEL_ID: 'COPILOT_CHANNEL_ID',
  COPILOT_API_KEY: 'COPILOT_API_KEY',
  COPILOT_POLLING_LIMIT: 'COPILOT_POLLING_LIMIT',
  COPILOT_POLLING_INTERVAL: 'COPILOT_POLLING_INTERVAL'
}

class BotiumConnectorCopilot {
  constructor ({ queueBotSays, caps }) {
    this.queueBotSays = queueBotSays
    this.caps = caps
    this.pollingEnabled = false
  }

  async Validate () {
    debug('Validate called')
    if (!this.caps[Capabilities.COPILOT_SENDER_ID]) throw new Error('COPILOT_SENDER_ID capability required')
    if (!this.caps[Capabilities.COPILOT_CHANNEL_ID]) throw new Error('COPILOT_CHANNEL_ID capability required')
    if (!this.caps[Capabilities.COPILOT_API_KEY]) throw new Error('COPILOT_API_KEY capability required')
  }

  async Build () {
    debug('Build called')
  }

  async Start () {
    debug('Start called')

    const startPolling = async () => {
      debug('Started polling bot messages')
      this.pollingEnabled = true
      let pollingFrom = moment()
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API-KEY': this.caps[Capabilities.COPILOT_API_KEY]
        }
      }

      while (this.pollingEnabled) {
        // polling interval default 1000 is because copilot api has heavy daily limit, 2000 requests per day
        await new Promise(resolve => setTimeout(resolve, this.caps[Capabilities.COPILOT_POLLING_INTERVAL] || 1000))
        try {
          const response = this.pollingEnabled && await axios(`https://api.copilot.com/v1/messages?limit=${this.caps[Capabilities.COPILOT_POLLING_LIMIT] || 10}&channelId=${this.caps[Capabilities.COPILOT_CHANNEL_ID]}`, options)
          if (response.data?.data?.length) {
            for (let i = response.data.data.length - 1; i >= 0; i--) {
              const msg = response.data.data[i]
              const createdAt = moment.utc(msg.createdAt)
              if (this.pollingEnabled && createdAt.isAfter(pollingFrom) && msg.senderId !== this.caps[Capabilities.COPILOT_SENDER_ID]) {
                this.queueBotSays({ messageText: msg.text, sourceData: msg })
                pollingFrom = createdAt
              }
            }
          }
        } catch (error) {
          // see https://axios-http.com/docs/handling_errors
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`Axios error occured. Code: ${error.response.status} data: "${JSON.stringify(error.response.data)}"`)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            throw new Error(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error occured while setting up request: ${error.message}`)
          }
        }
      }
      debug('Finished polling bot messages')
    }

    startPolling().catch(err => debug(`Polling has failed with error ${err.message || err}`))
  }

  async UserSays (msg) {
    debug('UserSays called')
    const options = {
      method: 'POST',
      data: JSON.stringify({
        text: msg.messageText,
        channelId: this.caps[Capabilities.COPILOT_CHANNEL_ID],
        senderId: this.caps[Capabilities.COPILOT_SENDER_ID]
      }),
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': this.caps[Capabilities.COPILOT_API_KEY]
      }
    }

    try {
      await axios('https://api.copilot.com/v1/messages', options)
    } catch (error) {
      // see https://axios-http.com/docs/handling_errors
      if (error.response) {
        if (error.response.data?.message?.startsWith("invalid value '") && error.response.data?.message?.endsWith("' for text")) {
          throw new Error(`Cognigy API is not able to handle message "${msg.messageText || ''}"`)
        }
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`Axios error occured. Code: ${error.response.status} data: "${JSON.stringify(error.response.data)}"`)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw new Error(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error occured while setting up request: ${error.message}`)
      }
    }
  }

  Stop () {
    debug('Stop called')

    this.pollingEnabled = false
  }

  Clean () {
    debug('Clean called')
  }
}

module.exports = BotiumConnectorCopilot
