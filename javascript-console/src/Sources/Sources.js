import Tool from '../DevTools/Tool'
import beautify from 'js-beautify'
import highlight from '../lib/highlight'
import JsonViewer from '../lib/JsonViewer'
import Settings from '../Settings/Settings'
import { evalCss, ajax, isEmpty, escape, trim, isStr } from '../lib/util'

export default class Sources extends Tool {
    
    
    
  constructor() {
    super()

    this._style = evalCss(require('./Sources.scss'))

    this.name = 'sources'
    this._showLineNum = true
    this._formatCode = true
    
    this._loadTpl()
  }
  
  
  
  init($el, container) {
    super.init($el)

    this._container = container
    this._bindEvent()
    this._initCfg()
    
    // Ju SCROLL MANAGER
    /*
    WHEN WE WOULD LIKE TO ADD SCROLL MANAGER TO IMG ETC...
    ADD .fin(child) when 'html()' occured
    */
    $el.append( require('./template.hbs')() )
    
  }
  
  
  
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
    this._rmCfg()
  }
  
  
  
  set(type, val) {
    if (type === 'img') {
      this._isFetchingData = true

      let img = new Image()

      let self = this

      img.onload = function() {
        self._isFetchingData = false
        self._data = {
          type: 'img',
          val: {
            width: this.width,
            height: this.height,
            src: val
          }
        }

        self._render()
      }
      img.onerror = function() {
        self._isFetchingData = false
      }

      img.src = val

      return
    }

    this._data = { type, val }

    this._render()

    return this
  }
  
  
  
  show() {
    super.show()

    if (!this._data && !this._isFetchingData) {
      this._renderDef()
    }
    
    // Scroll management
    super.preventBackgroundScroll('.eruda-scrollcontainer')
    //--
    
    return this
  }
  
  
  
  _renderDef() {
    if (this._html) {
      this._data = {
        type: 'html',
        val: this._html
      }

      return this._render()
    }

    if (this._isGettingHtml) return
    this._isGettingHtml = true

    ajax({
      url: location.href,
      success: data => (this._html = data),
      error: () => (this._html = 'Sorry, unable to fetch source code :('),
      complete: () => {
        this._isGettingHtml = false
        this._renderDef()
      },
      dataType: 'raw'
    })
  }
  
  
  
  _bindEvent() {
    this._container.on('showTool', (name, lastTool) => {
      if (name !== this.name && lastTool.name === this.name) {
        delete this._data
      }
    })

    this._$el.on('click', '.eruda-http .eruda-response', () => {
      let data = this._data.val,
        resTxt = data.resTxt

      switch (data.subType) {
        case 'css':
          return this.set('css', resTxt)
        case 'html':
          return this.set('html', resTxt)
        case 'javascript':
          return this.set('js', resTxt)
        case 'json':
          return this.set('json', resTxt)
      }
      switch (data.type) {
        case 'image':
          return this.set('img', data.url)
      }
    })
  }
  
  
  
  _loadTpl() {
    this._codeTpl = require('./code.hbs')
    this._imgTpl = require('./image.hbs')
    this._httpTpl = require('./http.hbs')
    this._jsonTpl = require('./json.hbs')
    this._rawTpl = require('./raw.hbs')
    this._iframeTpl = require('./iframe.hbs')
  }
  
  
  
  _rmCfg() {
    let cfg = this.config

    let settings = this._container.get('settings')

    if (!settings) return

    settings
      .remove(cfg, 'showLineNum')
      .remove(cfg, 'formatCode')
      .remove('Sources')
  }
  
  
  
  _initCfg() {
    let cfg = (this.config = Settings.createCfg('sources', {
      showLineNum: true,
      formatCode: true
    }))

    if (!cfg.get('showLineNum')) this._showLineNum = false
    if (!cfg.get('formatCode')) this._formatCode = false

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'showLineNum':
          this._showLineNum = val
          return
        case 'formatCode':
          this._formatCode = val
          return
      }
    })

    let settings = this._container.get('settings')
    settings
      .text('Sources')
      .switch(cfg, 'showLineNum', 'Show Line Numbers')
      .switch(cfg, 'formatCode', 'Beautify Code')
      .separator()
  }
  
  
  
  _render() {
    this._isInit = true

    let data = this._data

    switch (data.type) {
      case 'html':
      case 'js':
      case 'css':
        return this._renderCode()
      case 'img':
        return this._renderImg()
      case 'http':
        return this._renderHttp()
      case 'json':
        return this._renderJson()
      case 'raw':
        return this._renderRaw()
      case 'iframe':
        return this._renderIframe()
    }
  }
  
  
  
  _renderImg() {
    this._renderHtml(this._imgTpl(this._data.val))
  }
  
  
  
  _renderHttp() {
    let val = this._data.val

    if (val.resTxt.trim() === '') delete val.resTxt
    if (isEmpty(val.resHeaders)) delete val.resHeaders

    this._renderHtml(this._httpTpl(this._data.val))
  }
  
  
  
  _renderCode() {
    let data = this._data

    let code = data.val,
      len = data.val.length

    // If source code too big, don't process it.
    if (len < MAX_BEAUTIFY_LEN && this._formatCode) {
      switch (data.type) {
        case 'html':
          code = beautify.html(code, { unformatted: [] })
          break
        case 'css':
          code = beautify.css(code)
          break
        case 'js':
          code = beautify(code)
          break
      }

      code = highlight(code, data.type)
    } else {
      code = escape(code)
    }

    if (len < MAX_LINE_NUM_LEN && this._showLineNum) {
      code = code.split('\n').map((line, idx) => {
        if (trim(line) === '') line = '&nbsp;'

        return {
          idx: idx + 1,
          val: line
        }
      })
    }

    this._renderHtml(
      this._codeTpl({
        code,
        showLineNum: len < MAX_LINE_NUM_LEN && this._showLineNum
      })
    )
  }
  
  
  
  _renderJson() {
    // Using cache will keep binding json events to the same elements.
    this._renderHtml(this._jsonTpl(), false)

    let val = this._data.val

    try {
      if (isStr(val)) val = JSON.parse(val)
      /* eslint-disable no-empty */
    } catch (e) {}

    new JsonViewer(val, this._$el.find('.eruda-json'))
  }
  
  
  
  _renderRaw() {
    this._renderHtml(this._rawTpl({ val: this._data.val }))
  }
  
  
  
  _renderIframe() {
    this._renderHtml(this._iframeTpl({ src: this._data.val }))
  }
  
  
  
  _renderHtml(html, cache = true) {
    if (cache && html === this._lastHtml) return
    this._lastHtml = html
    /*this._$el.html(html)*/
    this._$el.find('.eruda-sources-content').html(html)
    // Need setTimeout to make it work
    setTimeout(() => (this._$el.get(0).scrollTop = 0), 0)
  }
  
  
  
}

const MAX_BEAUTIFY_LEN = 100000,
  MAX_LINE_NUM_LEN = 400000
