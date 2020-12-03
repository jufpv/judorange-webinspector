import highlight from './highlight'
import beautify from 'js-beautify'

export default function(util) {
  Object.assign(util, {
    highlight,
    beautify
  })
}
