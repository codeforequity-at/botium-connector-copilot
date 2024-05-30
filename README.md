# Botium Connector for QnA Maker

[![NPM](https://nodei.co/npm/botium-connector-copilot.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/botium-connector-dialogflowcx/)

[![npm version](https://badge.fury.io/js/botium-connector-copilot.svg)](https://badge.fury.io/js/botium-connector-copilot)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

This is a [Botium](https://github.com/codeforequity-at/botium-core) connector for testing your [Copilot App](https://www.copilot.com/) via [Copilot Message Channel](https://docs.copilot.com/reference/message-channels).

__Did you read the [Botium in a Nutshell](https://medium.com/@floriantreml/botium-in-a-nutshell-part-1-overview-f8d0ceaf8fb4) articles? Be warned, without prior knowledge of Botium you won't be able to properly use this library!__

## How it works
Botium connects to the [Copilot API](https://docs.copilot.com/reference/).

> [Copilot API allows just 2000 requests per day](https://docs.copilot.com/reference/getting-started-introduction#rate-limits).
> It means Botium can send/receive roughly 2000 messages per day. 
> (Copilot messages are read via batched polling, one API request can read 0, 1, or more messages)


It can be used as any other Botium connector with all Botium Stack components:
* [Botium CLI](https://github.com/codeforequity-at/botium-cli/)
* [Botium Bindings](https://github.com/codeforequity-at/botium-bindings/)
* [Botium Box](https://www.botium.at)

This connector is pure text based (no rich components like buttons, no NLP test possible).

## Requirements
* **Node.js and NPM**
* a **Copilot app**
* a **project directory** on your workstation to hold test cases and Botium configuration

## Install Botium and Copilot Connector

When using __Botium CLI__:

```
> npm install -g botium-cli
> npm install -g botium-connector-copilot
> botium-cli init
> botium-cli run
```

When using __Botium Bindings__:

```
> npm install -g botium-bindings
> npm install -g botium-connector-copilot
> botium-bindings init mocha
> npm install && npm run mocha
```

When using __Botium Box__:

_Already integrated into Botium Box, no setup required_

## Connecting Copilot to Botium

You need a 
- [Copilot API key](https://docs.copilot.com/reference/getting-started-introduction#if-you-are-building-any-other-type-of-api-integration)
- Copilot Channel id (you can find it in the URL if you navigate to a channel in Copilot Dashboard. The URL will be: https://dashboard.copilot.com/messaging?channelId=messaging:<<channel id>>)
  - Copilot Client id (you can find it in the URL if you navigate to a client in Copilot Dashboard. The URL will be: https://dashboard.copilot.com/clients/users/details?clientUserId=<<user id>>)

The botium.json file should look something like this:

```
{
  "botium": {
    "Capabilities": {
      "PROJECTNAME": "<whatever>",
      "CONTAINERMODE": "copilot",
      "COPILOT_API_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxx",
      "COPILOT_CHANNEL_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "COPILOT_SENDER_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  }
}
```

To check the configuration, run the emulator (Botium CLI required) to bring up a chat interface in your terminal window:

```
> botium-cli emulator
```

Botium setup is ready, you can begin to write your [BotiumScript](https://botium.atlassian.net/wiki/spaces/BOTIUM/pages/491664/Botium+Scripting+-+BotiumScript) files.

## Supported Capabilities

Set the capability __CONTAINERMODE__ to __copilot__ to activate this connector.

### COPILOT_API_KEY
Copilot API key

### COPILOT_CHANNEL_ID
Copilot Channel id

### COPILOT_SENDER_ID
Copilot Client id

### COPILOT_POLLING_INTERVAL
The interval in milliseconds to poll for new messages. High interval can cause slow communication, low interval can cause reaching Copilot Api limits earlier. 
_Default: 1000 (ms)_

### COPILOT_POLLING_LIMIT
The maximum number of messages to fetch in one poll. High polling limit can cause performance issues on booth sides. Low polling limit can cause data loss.
_Default: 10
