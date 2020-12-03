import TopBar from './TopBar'
import BottomBar from './BottomBar'
import logger from '../lib/logger'
import Tool from './Tool'
import emitter from '../lib/emitter'
import Settings from '../Settings/Settings'
import {
  Emitter,
  /*isMobile,*/
  evalCss,
  defaults,
  keys,
  last,
  each,
  isNum,
  safeStorage,
  orientation,
  nextTick,
  //$
  //pxToNum
} from '../lib/util'

import Draggabilly from 'draggabilly' // Ju

//import Interact from './interact'

export default class DevTools extends Emitter {
    
    
    
    constructor($container) {
        
        super()
        
        this._style = evalCss(require('./DevTools.scss'))
        
        this.$container = $container // = $el in other tools...
        this._isShow = true
        this._opacity = 1
        this._scale = 1
        this._tools = {}
        
        this._appendTpl()
        this._initBottomBar()
        this._initTopBar()
        this._registerListener()
        
        // Show by default
        //this.show()
        
        // Dragging :
        this._makeDraggable() // Ju
        
        // Snippets events :
        this._bindEvent()
    
    }
  
  
  
    // DRAGGING =============================
    
    _makeDraggable() { // Ju
    
        // USEFUL PROPERTIES
        let self = this
        
        // INIT DRAGABILITY
        this._draggabilly = new Draggabilly(this._$el.get(0), {
            containment: false,
            handle: '.eruda-drag-btn' // Activate dragging when touch this
        })
        
        // FIX DRAG ISSUE !!! - - - - - - - - - - - -
        // I dont know why and how to explain but when we scroll from top to bottom (with same window height ; so take care of the navbar on mobile)
        // sometimes the window doesn't respond to touch event after that... So we can't drag the window anymore.
        // Fix is to change somthing on the window (like opacity) when dom event to like together...
        document.body.addEventListener('touchstart',function(){ self._$el.get(0).style.opacity='0.99' })
        document.body.addEventListener('touchend', function(){ self._$el.get(0).style.opacity = '1' })
        // - - - - - - - - - - - - - - - - - - - - -
        
        // OPACITY 0.5 WHEN DRAGGING THE WINDOW
        self._$el.find('.eruda-drag-btn').on('touchstart', function(){
            self._$el.get(0).style.opacity = '0.7'
        })
        self._$el.find('.eruda-drag-btn').on('touchend', function(){
            self._$el.get(0).style.opacity = '1'
        })
        
        // RESET FUNCTION DEFAULT POSITION (called sometimes below...)
        function resetDragPos(){
            
            // SCREEN SIZE
            var w = window
            var d = document
            var e = d.documentElement
            var g = d.getElementsByTagName('body')[0]
            var x = w.innerWidth || e.clientWidth || g.clientWidth
            //y = w.innerHeight|| e.clientHeight|| g.clientHeight
            
            // RESET POSITION
            self._$el.get(0).style.left    = 'auto'
            self._$el.get(0).style.top     = 'auto' //'calc(100% - 75px)' //'auto'
            self._$el.get(0).style.right   = '2%'
            if( x > 1000 ) self._$el.get(0).style.right   = 'calc( ( 100% - 1000px ) / 2 ) !important' // center inspector on large screens
            self._$el.get(0).style.bottom  = '5%'
        }
        
        // Reset position when we resize (break if height resize only ; Mobile top bar make height change when we scroll)
        var previous_width = window.innerWidth
        window.addEventListener('resize', function(){
            if( previous_width == window.innerWidth ) return // dont execute code below
            previous_width = window.innerWidth    // update for next tick
            resetDragPos()
        })
        
        // Reset position when we rotate the device
        orientation.on('change', function(){
            resetDragPos()
        })
        
        // ESCAPE WINDOW TOO MUCH FAR
        this._$el[0].addEventListener('touchend', function() {
            nextTick(() => {
                
                // SETTINGS
                var auto_pos_trigger  = 100 // When do we start auto positionning
                var pos_anchor        = 75  // px visible after auto positionning
                
                // DONT TOUCH THIS :
                var inner_w   = window.innerWidth
                var inner_h   = window.innerHeight
                var box       = self._$el[0] // .eruda-dev-tools = web inspector box
                var box_w     = box.offsetWidth
                var box_h     = box.offsetHeight
                var box_l     = box.offsetLeft
                var box_r     = inner_w - box_w - box_l
                var box_t     = box.offsetTop
                var box_b     = inner_h - box_h - box_t
                var new_left  = 0
                var new_top   = 0
                
                // IF TOO MUCH ON THE RIGHT
                if( box_r < 0 - box_w + auto_pos_trigger){
                    new_left = inner_w - pos_anchor
                    self._$el.get(0).style.right   = 'auto'
                    self._$el.get(0).style.left    = ''+new_left+'px'
                }
                // IF TOO MUCH ON THE LEFT
                else if( box_l < 0 - box_w + auto_pos_trigger ){
                    new_left = 0 - box_w + pos_anchor
                    self._$el.get(0).style.right   = 'auto'
                    self._$el.get(0).style.left    = ''+new_left+'px'
                }
                
                // IF TOO MUCH ON THE BOTTOM
                if( box_b < 0 - box_h + auto_pos_trigger ){
                    new_top = inner_h - pos_anchor
                    self._$el.get(0).style.bottom  = 'auto'
                    self._$el.get(0).style.top     = ''+new_top+'px'
                }
                // IF TOO MUCH ON THE TOP
                else if( box_t < 0 - box_h + auto_pos_trigger ){
                    new_top = 0 - box_h + pos_anchor
                    self._$el.get(0).style.bottom  = 'auto'
                    self._$el.get(0).style.top     = ''+new_top+'px'
                }
                
            })
        })
            
    }
    
    // END OF dragging =============================
  
  
  
  show() {
    this._isShow = true
    this.emit('show')

    this._$el.show()
    this._bottomBar.resetStyle()

    // Need a delay after show to enable transition effect.
    setTimeout(() => {
      this._$el.css('opacity', this._opacity)
    }, 50)

    return this
    
  }
  
  
  
  hide() {
      
    // set vars
    this._isShow = false
    this.emit('hide')

    // animate
    this._$el.css({ opacity: 0 })
    setTimeout(() => this._$el.hide(), 300)
    
    // Disable highlight & select
    let tools = this._tools
    let tool = tools['elements']
    let eruda_container = this.$container.get(0)
    let eruda_toolbar = eruda_container.getElementsByClassName('eruda-toolbar')[0]
    // select
    let btn_select = eruda_toolbar.getElementsByClassName('eruda-toolbar-select')[0]
    btn_select.classList.remove('eruda-active')
    tool._selectElement = false
    tool._select.disable()
    // highlight
    let btn_highlight = eruda_toolbar.getElementsByClassName('eruda-toolbar-highlight')[0]
    btn_highlight.classList.remove('eruda-active')
    tool._highlightElement = false
    tool._render()

    // return
    return this
  }
  
  
  
  _bindEvent() {
    
    let container = this.$container
    
    // BORDER ALL
    let borderall_style = null
    container.on('click', '.eruda-toolbar-borderall', function() {
        if (borderall_style) {
            evalCss.remove(borderall_style)
            borderall_style = null
            container.find('.eruda-toolbar-borderall').rmClass('eruda-active')
        }
        else{
            borderall_style = evalCss( '* { outline: 1px dashed #fe7e00; outline-offset: -3px; }', document.head )
            container.find('.eruda-toolbar-borderall').addClass('eruda-active')
        }
    })
    
    // CONTENT EDITABLE
    container.on('click', '.eruda-toolbar-contentedit', function() {
        let body = document.body
        if(body.contentEditable == 'true'){
            body.contentEditable = 'false'
            container.find('.eruda-toolbar-contentedit').rmClass('eruda-active')
        }
        else{
            body.contentEditable = 'true'
            container.find('.eruda-toolbar-contentedit').addClass('eruda-active')
        }
    })
    
  }//Bind event
  
  
  
  toggle() {
    return this._isShow ? this.hide() : this.show()
  }
  
  
  
  add(tool) {
    if (!(tool instanceof Tool)) {
      let { init, show, hide, destroy } = new Tool()
      defaults(tool, { init, show, hide, destroy })
    }

    let name = tool.name
    if (!name) return logger.error('You must specify a name for a tool')
    name = name.toLowerCase()
    if (this._tools[name]) return logger.warn(`Tool ${name} already exists`)

    this._$tools.prepend(`<div class="eruda-${name} eruda-tool"></div>`)
    tool.init(this._$tools.find(`.eruda-${name}.eruda-tool`), this)
    tool.active = false
    this._tools[name] = tool

    this._bottomBar.add(name)

    return this
  }
  
  
  
  remove(name) {
    let tools = this._tools

    if (!tools[name]) return logger.warn(`Tool ${name} doesn't exist`)

    this._bottomBar.remove(name)

    let tool = tools[name]
    delete tools[name]
    if (tool.active) {
      let toolKeys = keys(tools)
      if (toolKeys.length > 0) this.showTool(tools[last(toolKeys)].name)
    }
    tool.destroy()

    return this
  }
  
  
  
  removeAll() {
    each(this._tools, tool => this.remove(tool.name))

    return this
  }
  
  
  
  get(name) {
    let tool = this._tools[name]

    if (tool) return tool
  }
  
  
  
  showTool(name) {
    if (this._curTool === name) return this
    this._curTool = name

    let tools = this._tools

    let tool = tools[name]
    if (!tool) return

    let lastTool = {}

    each(tools, tool => {
      if (tool.active) {
        lastTool = tool
        tool.active = false
        tool.hide()
      }
    })

    tool.active = true
    tool.show()

    this._bottomBar.activateTool(name)

    this.emit('showTool', name, lastTool)

    return this
  }
  
  
  
  initCfg(settings) {
    let cfg = (this.config = Settings.createCfg('dev-tools', {
      transparency: 1.00, /*Ju*/
      //displaySize: 50, /*Ju*/
      tinyNavBar: /*!isMobile()*/ false, /*Ju*/
      activeEruda: false,
      navBarBgColor: '#e5e5e5' /*Ju*/
    }))

    this._setTransparency(cfg.get('transparency'))
    //this._setDisplaySize(cfg.get('displaySize'))
    this.setBottomBarHeight(cfg.get('tinyNavBar') ? 30 : 40)
    this._bottomBar.setBgColor(cfg.get('navBarBgColor'))

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'transparency':
          return this._setTransparency(val)
        //case 'displaySize':
        //  return this._setDisplaySize(val)
        case 'activeEruda':
          return activeEruda(val)
        case 'tinyNavBar':
          return this.setBottomBarHeight(val ? 30 : 40)
        case 'navBarBgColor':
          return this._bottomBar.setBgColor(val)
      }
    })

    settings
      .separator()
      .switch(cfg, 'activeEruda', 'Always Activated')
      .switch(cfg, 'tinyNavBar', 'Tiny Navigation Bar')
      .color(cfg, 'navBarBgColor', 'Navigation Bar Background Color')
      .range(cfg, 'transparency', 'Transparency', {
        min: 0.2,
        max: 1,
        step: 0.01
      })
      .range(cfg, 'displaySize', 'Display Size', {
        min: 40,
        max: 100,
        step: 1
      })
      .separator()
  }
  
  
  
  setBottomBarHeight(height) {
    this._bottomBarHeight = height
    //this._$el.css('paddingTop', height * this._scale)
    this._bottomBar.setHeight(height * this._scale)
  }
  
  
  
  destroy() {
    evalCss.remove(this._style)
    this._unregisterListener()
    this.removeAll()
    this._bottomBar.destroy()
    this._$el.remove()
  }
  
  
  
  _registerListener() {
    this._scaleListener = scale => {
      this._scale = scale
      this.setBottomBarHeight(this._bottomBarHeight)
    }

    emitter.on(emitter.SCALE, this._scaleListener)
  }
  
  
  
  _unregisterListener() {
    emitter.off(emitter.SCALE, this._scaleListener)
  }
  
  
  
  _setTransparency(opacity) {
    if (!isNum(opacity)) return

    this._opacity = opacity
    if (this._isShow) this._$el.css({ opacity })
  }
  
  
  
  /*_setDisplaySize(height) {
    if (!isNum(height)) return
    this._$el.css({ height: height + '%' })
  }*/
  
  
  
  _appendTpl() {
    let $container = this.$container

    $container.append(require('./DevTools.hbs')())

    this._$el = $container.find('.eruda-dev-tools')
    this._$tools = this._$el.find('.eruda-tools')
  }
  
  
  
  _initBottomBar() {
    this._bottomBar = new BottomBar(this._$el.find('.eruda-toolbar-tools'))
    this._bottomBar.on('showTool', name => this.showTool(name))
  }
  
  
  
  _initTopBar() {
    this._topBar = new TopBar(this._$el.find('.eruda-nav-bar'))
  }
  
  
  
}



let localStore = safeStorage('local')

let activeEruda = flag => localStore.setItem('active-eruda', flag)
