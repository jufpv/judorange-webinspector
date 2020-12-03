import Tool from '../DevTools/Tool'
import defInfo from './defInfo'
import { evalCss, each, isFn, isUndef, cloneDeep } from '../lib/util'

export default class Info extends Tool {
	
	
	
  constructor() {
    super()

    this._style = evalCss(require('./Info.scss'))

    this.name = 'info'
    this._tpl = require('./Info.hbs')
    this._infos = []
  }
  
  
  
  init($el) {
    super.init($el)
    this._addDefInfo()
  }
  
  
  
  show() {
    this._render()
    super.show()
    
    // Scroll management
    super.preventBackgroundScroll('.eruda-scrollcontainer')
    //--
  }
  
  
  
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
  }
  
  
  
  add(name, val) {
    let infos = this._infos
    let isUpdate = false

    each(infos, info => {
      if (name !== info.name) return

      info.val = val
      isUpdate = true
    })

    if (!isUpdate) infos.push({ name, val })

    this._render()

    return this
  }
  
  
  
  get(name) {
    let infos = this._infos

    if (isUndef(name)) {
      return cloneDeep(infos)
    }

    let result

    each(infos, info => {
      if (name === info.name) result = info.val
    })

    return result
  }
  
  
  
  remove(name) {
    let infos = this._infos

    for (let i = infos.length - 1; i >= 0; i--) {
      if (infos[i].name === name) infos.splice(i, 1)
    }

    this._render()

    return this
  }
  
  
  
  clear() {
    this._infos = []

    this._render()

    return this
  }
  
  
  
  _addDefInfo() {
    each(defInfo, info => this.add(info.name, info.val))
  }
  
  
  
  _render() {
    let infos = []

    each(this._infos, ({ name, val }) => {
      if (isFn(val)) val = val()

      infos.push({ name, val })
    })

    this._renderHtml(this._tpl({ infos }))
  }
  
  
  
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$el.html(html)
  }
  
  
  
}
