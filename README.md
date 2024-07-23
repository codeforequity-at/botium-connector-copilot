# Botium Connector for Microsoft Copilot

[![NPM](https://nodei.co/npm/botium-connector-copilot.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/botium-connector-dialogflowcx/)

[![npm version](https://badge.fury.io/js/botium-connector-copilot.svg)](https://badge.fury.io/js/botium-connector-copilot)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

This is a [Botium](https://github.com/codeforequity-at/botium-core) connector for testing your Microsoft Copilot chatbots.

__Did you read the [Botium in a Nutshell](https://medium.com/@floriantreml/botium-in-a-nutshell-part-1-overview-f8d0ceaf8fb4) articles ? Be warned, without prior knowledge of Botium you won't be able to properly use this library!__

## How it works?
It can be used as any other Botium connector with all Botium Stack components:
* [Botium CLI](https://github.com/codeforequity-at/botium-cli/)
* [Botium Bindings](https://github.com/codeforequity-at/botium-bindings/)
* [Botium Box](https://www.botium.ai)

## Requirements

* __Node.js and NPM__
* a __Microsoft Copilot__ chatbot, and user account with administrative rights
* a __project directory__ on your workstation to hold test cases and Botium configuration

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

## Connecting Microsoft Copilot to Botium

You have to use Copilot Secret in order to connect to Copilot chatbot. See [here](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-web-security) for instructions.

Open the file _botium.json_ in your working directory and add the secret:

```
{
  "botium": {
    "Capabilities": {
      "PROJECTNAME": "<whatever>",
      "CONTAINERMODE": "copilot",
      "COPILOT_SECRET": "<copilot secret>"
    }
  }
}
```

To check the configuration, run the emulator (Botium CLI required) to bring up a chat interface in your terminal window:

```
> botium-cli emulator
```

Botium setup is ready, you can begin to write your [BotiumScript](https://botium-docs.readthedocs.io/en/latest/05_botiumscript/index.html) files.

## Finetuning Copilot Activity

For finetuning the [Activity object](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-connector-api-reference?view=azure-bot-service-4.0#activity-object) sent to your bot, you can use the [UPDATE_CUSTOM logic hook](https://botium-docs.readthedocs.io/en/latest/05_botiumscript/index.html#update-custom). This example will add some custom values to the [channelData](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-connector-channeldata?view=azure-bot-service-4.0):

    #me
    do some channel specific thingy ...
    UPDATE_CUSTOM SET_ACTIVITY_VALUE|channelData|{"channelData1": "botium", "channelData2": "something else"}

The parameters are:
1. SET_ACTIVITY_VALUE
2. The path to the activity field
3. The value of the activity field

Another option for having full control over the activity is to use the **COPILOT_ACTIVITY_TEMPLATE** capability. It is a JSON structure used as a template when sending an activity to the bot.

```
    ...
    "COPILOT_ACTIVITY_TEMPLATE": {
      "channelData": {
        "my-special-channel-data": "..."
      }
    }
    ...
```


## Supported Capabilities

Set the capability __CONTAINERMODE__ to __COPILOT__ to activate this connector.

### COPILOT_SECRET *
The secret for accessing your chatbot from the Azure Portal.

_Note: it is advised to not add this secret to a configuration file but hand it over by environment variable BOTIUM_COPILOT_SECRET_

### COPILOT_DOMAIN
If not using the default Copilot endpoint, e.g. if you are using a region-specific endpoint, put its full URL here

### COPILOT_WEBSOCKET
_true or false_
Wether to use Websocket connection or HTTP polling. Usually, using Websockets is prefered, but sometimes this is not possible (maybe with blocking proxies).

### COPILOT_POLLINGINTERVAL
_in milliseconds_
HTTP Polling interval

### COPILOT_BUTTON_TYPE and COPILOT_BUTTON_VALUE_FIELD
_Default type: event_

_Default field: name_

Activity fields to use for simulating button clicks by the user. Depending on your implementation, you maybe have to change the activity type or the field to use - see [here](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-backchannel) for some ideas.

Usually, the activity type is _event_, and the button value is submitted in the _name_ field, but using those capabilities you can adapt it to your implementation.

_Note: if you want to disable this, then set COPILOT_BUTTON_TYPE to "message" and COPILOT_BUTTON_VALUE_FIELD to "text", to make the button clicks appear as normal user text input_

### COPILOT_GENERATE_USERNAME
_Default: false_

Botium simulates conversations with username _me_. Depending on your implementation, running multiple conversations with the same username could make them fail (for example, session handling).

Setting this capability to _true_ will generate a new username (uuid) for each conversation.

### COPILOT_HANDLE_ACTIVITY_TYPES
_Default: "message"_

Activity types to handle (either JSON array or comma separated list). All other activity types will be ignored.

Example: set to "message,event" (or [ "message", "event" ]) to also handle Copilot event activities with Botium

### COPILOT_ACTIVITY_VALUE_MAP
_default: { 'event': 'name' }_

When using activity types other than _message_, this capability maps the activity type to the activity attribute to use as message text for Botium.

By default, for _event_ activities the _name_ attribute is used as message text, for other activity types the activity type itself.

### COPILOT_ACTIVITY_TEMPLATE
_default: {}_

JSON object holding the activity template used for sending activities to the bot. Can be used to hold for example channelData:

    ...
    "COPILOT_ACTIVITY_TEMPLATE": {
      "channelData": {
        "kb": "demo"
      }
    },
    ...

### COPILOT_ACTIVITY_VALIDATION
_default: 'error'_

Set to 'warning' if you want to suppress activity validation errors.

### COPILOT_WELCOME_ACTIVITY
_default: empty_

Send some activity upfront to start a session. Can be used to simulate the webchat/join event.

    ...
    "COPILOT_WELCOME_ACTIVITY": {
      "type": "event",
      "name": "webchat/join",
      "value": {
        "language": "de-DE"
      },
      "channelData": {
        "kb": "demo"
      }
    },
    ...
