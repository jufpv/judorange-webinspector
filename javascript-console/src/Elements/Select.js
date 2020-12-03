import { Emitter, isErudaEl } from '../lib/util'

export default class Select extends Emitter {
    
    
    
  constructor() {
    super()

    let self = this

    this._startListener = function(e) {
      if (isErudaEl(e.target)) return

      self._timer = setTimeout(function() {
        self.emit('select', e.target)
      }, 200)

      return false
    }

    this._moveListener = function() {
      clearTimeout(self._timer)
    }

    this._clickListener = function(e) {
      if (isErudaEl(e.target)) return

      self.emit('select', e.target) // ju test

      e.preventDefault()
      e.stopImmediatePropagation()
    }
  }
  
  
  
  enable() {
    this.disable()
    function addEvent(type, listener) {
      document.body.addEventListener(type, listener, true)
    }
    addEvent('touchstart', this._startListener)
    addEvent('touchmove', this._moveListener)
    //addEvent('mousedown', this._startListener)
    //addEvent('mouseup', this._moveListener)
    addEvent('click', this._clickListener)

    return this
  }
  
  
  
  disable() {
    function rmEvent(type, listener) {
      document.body.removeEventListener(type, listener, true)
    }
    rmEvent('touchstart', this._startListener)
    rmEvent('touchmove', this._moveListener)
    rmEvent('click', this._clickListener)

    return this
  }
  
  
  
}
