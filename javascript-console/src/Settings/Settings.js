import Tool from '../DevTools/Tool'
import {
  evalCss,
  $,
  LocalStore,
  uniqId,
  each,
  filter,
  isStr,
  clone
} from '../lib/util'

export default class Settings extends Tool {
    
    
    
  constructor() {
    super()

    this._style = evalCss(require('./Settings.scss'))

    this.name = 'settings'
    this._switchTpl = require('./switch.hbs')
    this._selectTpl = require('./select.hbs')
    this._rangeTpl = require('./range.hbs')
    this._colorTpl = require('./color.hbs')
    this._settings = []
  }
  
  
  
  init($el) {
    super.init($el)
    this._bindEvent()
    
    // Ju SCROLL MANAGER
    $el.append( require('./template.hbs')() )
    this.judevSettingsScrollManager('.eruda-settings-scrollcontainer')
  }
  
  
  
  judevSettingsScrollManager(scroll_container_id){
    
    // SETTINGS
    var scroll_container  = this._$el.find(scroll_container_id)
    
    // DEBUG
    //console.log(scroll_container)
    
    // PROPERTIES
    var lastY           = 0             // Last touch position
    var last_move_dir   = 0             // Last move direction : -1 -> slide_down ; 1 -> slide_up
    var array_move_dir  = [0,0,0,0,0]  // last directions to get average. -2 prevent issues when first scroll
    var cur_direction   = 0             // current direction based on average. Default val prevent first scroll issue
    
    scroll_container.on('touchmove', function(e){ // WHEN SCROLL BEGIN ON THE SCROLL CONTAINER 
        
        // DYNAMICALLY REFRESH TOUCH DIRECTION
        var currentY = e.origEvent.touches[0].pageY;   // touch pos
        if(currentY < lastY)       last_move_dir = 1   // Slide UP (or move down)
        else if(currentY > lastY)  last_move_dir = -1  // Slide DOWN (or move up)
        lastY = currentY
        
        // GET AVERAGE DIRECTION
        array_move_dir.unshift(last_move_dir)  // add to the begginning
        while(array_move_dir.length>5) array_move_dir.pop()
        var sum = 0;
        for(var i=0; i<array_move_dir.length; i++) sum+=array_move_dir[i]
        cur_direction = sum
        
        // SCROLL POSITION
        var container_scroll_top     = scroll_container[0].scrollTop
        var container_scroll_bottom  = scroll_container[0].scrollHeight - scroll_container[0].scrollTop - scroll_container[0].offsetHeight
        
        // DEBUG
        //console.log( 'parent.sH' + scroll_container[0].scrollHeight + ' | top:'+ container_scroll_top + ' | bottom:' + container_scroll_bottom )
        
        // DISABLE SCROLL IF NEEDED
        if       ( container_scroll_top<5 && cur_direction<0 ) e.origEvent.preventDefault()     // IF WE TRY TO SLIDE DOWN EVEN IF WE ARE AT THE TOP OF BOX
        else if  ( container_scroll_bottom<5 && cur_direction>0 ) e.origEvent.preventDefault()  // IF WE TRY TO SLIDE UP EVEN IF WE ARE AT THE BOTTOM OF BOX
        
    })
    
  }
  
  
  
  remove(config, key) {
    if (isStr(config)) {
      this._$el.find('.eruda-text').each(function() {
        let $this = $(this)
        if ($this.text() === config) $this.remove()
      })
    } else {
      this._settings = filter(this._settings, setting => {
        if (setting.config === config && setting.key === key) {
          this._$el.find('#' + setting.id).remove()
          return false
        }

        return true
      })
    }

    this._cleanSeparator()

    return this
  }
  
  
  
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
  }
  
  
  
  clear() {
    this._settings = []
    /*this._$el.html('')*/
    this._$el.find('.eruda-settings-scrollcontainer').html('')
  }
  
  
  
  switch(config, key, desc) {
    let id = this._genId('settings')

    this._settings.push({ config, key, id })

    //this._$el.append(
    this._$el.find('.eruda-settings-scrollcontainer').append(
      this._switchTpl({
        desc,
        key,
        id,
        val: config.get(key)
      })
    )

    return this
  }
  
  
  
  color(
    config,
    key,
    desc,
    colors = ['#e6e6e6', '#e5e5e5', '#d3d3d3', '#707d8b', '#2196f3', '#f44336', '#009688', '#ffc107'] /*Ju*/
  ) {
    let id = this._genId('settings')

    this._settings.push({ config, key, id })

    //this._$el.append(
    this._$el.find('.eruda-settings-scrollcontainer').append(
      this._colorTpl({
        desc,
        colors,
        id,
        val: config.get(key)
      })
    )

    return this
  }
  
  
  
  select(config, key, desc, selections) {
    let id = this._genId('settings')

    this._settings.push({ config, key, id })

    //this._$el.append(
    this._$el.find('.eruda-settings-scrollcontainer').append(
      this._selectTpl({
        desc,
        selections,
        id,
        val: config.get(key)
      })
    )

    return this
  }
  
  
  
  range(config, key, desc, { min = 0, max = 1, step = 0.1 }) {
    let id = this._genId('settings')

    this._settings.push({ config, key, min, max, step, id })

    let val = config.get(key)

    //this._$el.append(
    this._$el.find('.eruda-settings-scrollcontainer').append(
      this._rangeTpl({
        desc,
        min,
        max,
        step,
        val,
        progress: progress(val, min, max),
        id
      })
    )

    return this
  }
  
  
  
  separator() {
    //this._$el.append('<div class="eruda-separator"></div>')
    this._$el.find('.eruda-settings-scrollcontainer').append('<div class="eruda-separator"></div>')

    return this
  }
  
  
  
  text(text) {
    //this._$el.append(`<div class="eruda-text">${text}</div>`)
    this._$el.find('.eruda-settings-scrollcontainer').append(`<div class="eruda-text">${text}</div>`)
    return this
  }
  
  
  
  // Merge adjacent separators
  _cleanSeparator() {
    let children = clone(this._$el.get(0).children)

    function isSeparator(node) {
      return node.getAttribute('class') === 'eruda-separator'
    }

    for (let i = 0, len = children.length; i < len - 1; i++) {
      if (isSeparator(children[i]) && isSeparator(children[i + 1])) {
        $(children[i]).remove()
      }
    }
  }
  
  
  
  _genId() {
    return uniqId('eruda-settings')
  }
  
  
  
  _closeAll() {
    this._$el.find('.eruda-open').rmClass('eruda-open')
  }
  
  
  
  _getSetting(id) {
    let ret

    each(this._settings, setting => {
      if (setting.id === id) ret = setting
    })

    return ret
  }
  
  
  
  _bindEvent() {
    let self = this

    this._$el
      .on('click', '.eruda-checkbox', function() {
        let $input = $(this).find('input')
        let id = $input.data('id')
        let val = $input.get(0).checked

        let setting = self._getSetting(id)
        setting.config.set(setting.key, val)
      })
      .on('click', '.eruda-select .eruda-head', function() {
        let $el = $(this)
          .parent()
          .find('ul')
        let isOpen = $el.hasClass('eruda-open')

        self._closeAll()
        isOpen ? $el.rmClass('eruda-open') : $el.addClass('eruda-open')
      })
      .on('click', '.eruda-select li', function() {
        let $this = $(this)
        let $ul = $this.parent()
        let val = $this.text()
        let id = $ul.data('id')
        let setting = self._getSetting(id)

        $ul.rmClass('eruda-open')
        $ul
          .parent()
          .find('.eruda-head span')
          .text(val)

        setting.config.set(setting.key, val)
      })
      .on('click', '.eruda-range .eruda-head', function() {
        let $el = $(this)
          .parent()
          .find('.eruda-input-container')
        let isOpen = $el.hasClass('eruda-open')

        self._closeAll()
        isOpen ? $el.rmClass('eruda-open') : $el.addClass('eruda-open')
      })
      .on('change', '.eruda-range input', function() {
        let $this = $(this)
        let $container = $this.parent()
        let id = $container.data('id')
        let val = +$this.val()
        let setting = self._getSetting(id)

        setting.config.set(setting.key, val)
      })
      .on('input', '.eruda-range input', function() {
        let $this = $(this)
        let $container = $this.parent()
        let id = $container.data('id')
        let val = +$this.val()
        let setting = self._getSetting(id)
        let { min, max } = setting

        $container
          .parent()
          .find('.eruda-head span')
          .text(val)
        $container
          .find('.eruda-range-track-progress')
          .css('width', progress(val, min, max) + '%')
      })
      .on('click', '.eruda-color .eruda-head', function() {
        let $el = $(this)
          .parent()
          .find('ul')
        let isOpen = $el.hasClass('eruda-open')

        self._closeAll()
        isOpen ? $el.rmClass('eruda-open') : $el.addClass('eruda-open')
      })
      .on('click', '.eruda-color li', function() {
        let $this = $(this)
        let $ul = $this.parent()
        let val = $this.css('background-color')
        let id = $ul.data('id')
        let setting = self._getSetting(id)

        $ul.rmClass('eruda-open')
        $ul
          .parent()
          .find('.eruda-head span')
          .css('background-color', val)

        setting.config.set(setting.key, val)
      })
  }
  
  
  
  static createCfg(name, data) {
    return new LocalStore('eruda-' + name, data)
  }
  
  
  
} // Class end





let progress = (val, min, max) => (((val - min) / (max - min)) * 100).toFixed(2)
