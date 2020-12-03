import { Emitter, evalCss, $, isNum } from '../lib/util'



export default class BottomBar extends Emitter {
    
    
    
  constructor($el) {
    super()

    this._style = evalCss(require('./BottomBar.scss'))

    this._$el = $el

    $el.append('<div class="eruda-toolbar-selection-bar"></div>')
    this._$bottomBar = $el.find('.eruda-toolbar-selection-bar')
    
/*
    var store = new LocalStore('history')
    store.set('last_action', 'history')
    console.log('history')
    $el.find('.eruda-navigation-back').addClass('eruda-activebtn')
    $el.find('.eruda-navigation-forward').addClass('eruda-activebtn')
*/
    this._len = 0
    this._height = 55

    this._bindEvent()
  }
  
  
  
  add(name) {
    this._len++
    
    // hide settings :
    if(name=='settings')         this._$el.append('<div class="eruda-toolbar-item" style="display:none;">${name}</div>')
    /*
    else if(name=='navigation')  this._$el.append('<div class="eruda-nav-bar-item">☆</div>')
    else if(name=='elements') this._$el.append('<div class="eruda-nav-bar-item">☲</div>')
    else if(name=='console')     this._$el.append('<div class="eruda-nav-bar-item">⊚</div>')
    else if(name=='resources')     this._$el.append('<div class="eruda-nav-bar-item">▤</div>')
    */
    else                         this._$el.append('<div class="eruda-toolbar-item eruda-toolbar-icon eruda-toolbar-'+name+'">'+name+'</div>')
    
    //✎⬚❮❯▤
    
    this.resetStyle()
  }
  
  
  
  remove(name) {
    this._len--
    this._$el.find('.eruda-toolbar-item').each(function() {
      let $this = $(this)
      if ($this.text().toLowerCase() === name.toLowerCase()) $this.remove()
    })
    this._resetBottomBar()
  }
  
  
  
  setHeight(height) {
    this._height = height
    this.resetStyle()
  }
  
  
  
  setBgColor(color) {
    this._$el.css('background-color', color)
  }
  
  
  
  activateTool(name) {
    let self = this

    this._$el.find('.eruda-toolbar-item').each(function() {
      let $this = $(this)

      if ($this.text() === name) {
        $this.addClass('eruda-active')
        self._resetBottomBar()
        self._scrollItemToView()
      }
      else {
        $this.rmClass('eruda-active')
      }
    })
  }
  
  
  
  destroy() {
    evalCss.remove(this._style)
    this._$el.remove()
  }
  
  
  
  _scrollItemToView() {
    let $el = this._$el,
      li = $el.find('.eruda-active').get(0),
      container = $el.get(0)

    let itemLeft = li.offsetLeft,
      itemWidth = li.offsetWidth,
      containerWidth = container.offsetWidth,
      scrollLeft = container.scrollLeft,
      targetScrollLeft

    if (itemLeft < scrollLeft) {
      targetScrollLeft = itemLeft
    } else if (itemLeft + itemWidth > containerWidth + scrollLeft) {
      targetScrollLeft = itemLeft + itemWidth - containerWidth
    }

    if (!isNum(targetScrollLeft)) return

    container.scrollLeft = targetScrollLeft
  }
  
  
  
  _resetBottomBar() {
    let $bottomBar = this._$bottomBar

    let li = this._$el.find('.eruda-active').get(0)

    if (!li) return

    $bottomBar.css({
      width: li.offsetWidth,
      left: li.offsetLeft
    })
  }
  
  
  
  resetStyle() {
    let height = this._height

    this._$el.css('height', height)

    let $el = this._$el

    $el.css({
      height: height
    })
    $el.find('.eruda-toolbar-item').css({
      height: height,
      lineHeight: height
    })

    this._resetBottomBar()
  }
  
  
  
  _bindEvent() {
    
    let self = this

    this._$el.on('click', '.eruda-toolbar-item', function() {
      self.emit('showTool', $(this).text())
    })
    
  }//Bind event
  
  
  
}
