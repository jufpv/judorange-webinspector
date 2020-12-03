import logger from '../lib/logger'
import emitter from '../lib/emitter'
import {
  evalCss,
  Url,
  now,
  safeStorage,
  each,
  isStr,
  startWith,
  $,
  isErudaEl,
  upperFirst,
  loadJs
} from '../lib/util'

let style = null

export default [
  {
    name: 'Border All',
    fn() {
      if (style) {
        evalCss.remove(style)
        style = null
        return
      }

      style = evalCss(
        '* { outline: 2px dashed #707d8b; outline-offset: -3px; }',
        document.head
      )
    },
    desc: 'Add color borders to all elements'
  },
  {
    name: 'Refresh Page',
    fn() {
      let url = new Url()
      url.setQuery('timestamp', now())

      window.location.replace(url.toString())
    },
    desc: 'Add timestamp to url and refresh'
  },
  {
    name: 'Search Text',
    fn() {
      let keyword = prompt('Enter the text')

      search(keyword)
    },
    desc: 'Highlight given text on page'
  },
  {
    name: 'Edit Page',
    fn() {
      let body = document.body

      body.contentEditable = body.contentEditable !== 'true'
    },
    desc: 'Toggle body contentEditable'
  },
  {
    name: 'Load Fps Plugin',
    fn() {
      loadPlugin('fps')
    },
    desc: 'Display page fps'
  },
  {
    name: 'Load Features Plugin',
    fn() {
      loadPlugin('features')
    },
    desc: 'Browser feature detections'
  },
  {
    name: 'Load Timing Plugin',
    fn() {
      loadPlugin('timing')
    },
    desc: 'Show performance and resource timing'
  },
  {
    name: 'Load Memory Plugin',
    fn() {
      loadPlugin('memory')
    },
    desc: 'Display memory'
  },
  /*{
    name: 'Load Code Plugin',
    fn() {
      loadPlugin('code')
    },
    desc: 'Edit and run JavaScript'
  },*/
  {
    name: 'Load Benchmark Plugin',
    fn() {
      loadPlugin('benchmark')
    },
    desc: 'Run JavaScript benchmarks'
  },
  {
    name: 'Load Geolocation Plugin',
    fn() {
      loadPlugin('geolocation')
    },
    desc: 'Test geolocation'
  },
  {
    name: 'Load Dom Plugin',
    fn() {
      loadPlugin('dom')
    },
    desc: 'Navigate dom tree'
  },
  {
    name: 'Load Orientation Plugin',
    fn() {
      loadPlugin('orientation')
    },
    desc: 'Test orientation api'
  },
  {
    name: 'Restore Settings',
    fn() {
      let store = safeStorage('local')

      let data = JSON.parse(JSON.stringify(store))

      each(data, (val, key) => {
        if (!isStr(val)) return

        if (startWith(key, 'eruda')) store.removeItem(key)
      })

      window.location.reload()
    },
    desc: 'Restore defaults and reload'
  }
]

evalCss(require('./searchText.scss'), document.head)

function search(text) {
  let root = document.body,
    regText = new RegExp(text, 'ig')

  traverse(root, node => {
    let $node = $(node)

    if (!$node.hasClass('eruda-search-highlight-block')) return

    return document.createTextNode($node.text())
  })

  traverse(root, node => {
    if (node.nodeType !== 3) return

    let val = node.nodeValue
    val = val.replace(
      regText,
      match => `<span class="eruda-keyword">${match}</span>`
    )
    if (val === node.nodeValue) return

    let $ret = $(document.createElement('div'))

    $ret.html(val)
    $ret.addClass('eruda-search-highlight-block')

    return $ret.get(0)
  })
}

function traverse(root, processor) {
  let childNodes = root.childNodes

  if (isErudaEl(root)) return

  for (let i = 0, len = childNodes.length; i < len; i++) {
    let newNode = traverse(childNodes[i], processor)
    if (newNode) root.replaceChild(newNode, childNodes[i])
  }

  return processor(root)
}

function loadPlugin(name) {
  let globalName = 'eruda' + upperFirst(name)
  if (window[globalName]) return

  loadJs(
    `//cdn.jsdelivr.net/npm/eruda-${name}@${pluginVersion[name]}`,
    isLoaded => {
      if (!isLoaded || !window[globalName])
        return logger.error('Fail to load plugin ' + name)

      emitter.emit(emitter.ADD, window[globalName])
      emitter.emit(emitter.SHOW, name)
    }
  )
}

const pluginVersion = {
  fps: '1.0.2',
  features: '1.0.2',
  timing: '1.1.2',
  memory: '1.0.1',
  /*code: '1.0.0',*/
  benchmark: '1.0.0',
  geolocation: '1.1.0',
  dom: '1.0.1',
  orientation: '1.0.0'
}
