import Storage from './Storage'
import logger from './logger'

let configs = {}

let config = {
  create(name) {
    logger.warn('createCfg is deprecated')

    if (!configs[name]) configs[name] = new Storage(name)

    return configs[name]
  }
}

export default config
