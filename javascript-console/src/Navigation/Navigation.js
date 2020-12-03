import Tool from '../DevTools/Tool'
import {
    evalCss
} from '../lib/util'



export default class Navigation extends Tool {
    
    

  constructor() {
    super()
    
    // NAVIGATION
    this.name = 'navigation'
    this._style = evalCss(require('./style.scss'))
    this._tpl = require('./Navigation.hbs')
    
  }
  
  
  
  init($el) {
    super.init($el)
    
    // CONSTRUCT VIEW
    $el.append( require('./Navigation.hbs')() )                 // Load base template
    //$el.find('.eruda-navigation-address').html(window.location)  // Set current location
    
    // ADD EVENTS
    this._bindEvent()
    
    // UTILS
    // ...
    
  }
  
  
  
  destroy() {
    super.destroy()
    evalCss.remove(this._style)
  }
  
  
  
  clear() {
    this._render()
    return this
  }
  
  
  
  _bindEvent() {
      
      //let el = this._$el
    
  }
  
  
  
  
  
  
  
} // CLASS
