import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PluginClass from './src/connector.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logo = fs.readFileSync(path.join(__dirname, 'logo.ico')).toString('base64')

export default {
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
