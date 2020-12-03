import Tool from '../DevTools/Tool'
import defSnippets from './defSnippets'
import { evalCss, $, each } from '../lib/util'

export default class Snippets extends Tool {
    
    
    
  constructor() {
    super()
    this._style = evalCss(require('./Snippets.scss'))
    this.name = 'snippets'
    this._snippets = []
    this._tpl = require('./Snippets.hbs')
  }
  
  
  
  init($el) {
    
    // INIT
    super.init($el)

    // INIT
    this._bindEvent()
    this._addDefSnippets()
    
    // SCROLL MANAGER
    //this.judevSnippetsScrollManager('.eruda-snippets-scrollparent','.eruda-snippets-scrollchild')
  }
  
  
  /*
  judevSnippetsScrollManager(parent_id, child_id){ //judevScrollManager('.eruda-side-left','.eruda-dom')
    
    // SETTINGS
    var propag_parent  = this._$el.find(parent_id) //document.getElementById('propag_parent')
    var propag_child   = this._$el.find(child_id)
    
    // Debug
    //console.log(propag_parent)
    //console.log(propag_child)
    
    // PROPERTIES
    var lastY          // Last touch pos
    var last_move_dir  // Last move direction : -1 -> slide_down ; 1 -> slide_up
    var array_move_dir = [0,0,0,0,0] // last directions to get average
    var cur_direction = -5 // current direction based in average. Default val prevent first scroll issue
    
    propag_child.on('touchmove', function(e){
        
        // DYNAMICALLY REFRESH TOUCH DIRECTION
        var currentY = e.origEvent.touches[0].pageY;  // touch pos
        if(currentY < lastY)       last_move_dir = 1  // Slide UP (or move down)
        else if(currentY > lastY)  last_move_dir = -1  // Slide DOWN (or move up)
        lastY = currentY
        
        // GET AVERAGE DIRECTION
        array_move_dir.unshift(last_move_dir) // add to the begginning
        while(array_move_dir.length>5) array_move_dir.pop()
        var sum = 0;
        for(var i=0; i<array_move_dir.length; i++) sum+=array_move_dir[i]
        cur_direction = sum
        // Debug
        //console.log(array_move_dir)
        //console.log(sum)
        
        // Scroll pos
        var parent_scroll_top     = propag_parent[0].scrollTop
        var parent_scroll_bottom  = propag_parent[0].scrollHeight - propag_parent[0].scrollTop - propag_parent[0].offsetHeight
        
        // Debug
        //console.log(parent_scroll_top + ' | ' + parent_scroll_bottom)
        
        // DISABLE SCROLL IF NEEDED
        if       ( parent_scroll_top<5 && cur_direction<0 ) e.origEvent.preventDefault() // AND IF WE TRY TO SLIDE DOWN EVEN IF WE ARE AT THE TOP OF BOX
        else if  ( parent_scroll_bottom<5 && cur_direction>0 ) e.origEvent.preventDefault()  // AND IF WE TRY TO SLIDE UP EVEN IF WE ARE AT THE BOTTOM OF BOX
        
    })
        
  }
  */
  
  
  
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
  }
  
  
  
  add(name, fn, desc) {
    this._snippets.push({ name, fn, desc })

    this._render()

    return this
  }
  
  
  
  remove(name) {
    let snippets = this._snippets

    for (let i = 0, len = snippets.length; i < len; i++) {
      if (snippets[i].name === name) snippets.splice(i, 1)
    }

    this._render()

    return this
  }
  
  
  
  run(name) {
    let snippets = this._snippets

    for (let i = 0, len = snippets.length; i < len; i++) {
      if (snippets[i].name === name) this._run(i)
    }

    return this
  }
  
  
  
  clear() {
    this._snippets = []
    this._render()

    return this
  }
  
  
  
  _bindEvent() {
    let self = this

    this._$el.on('click', '.eruda-run', function() {
      let idx = $(this).data('idx')

      self._run(idx)
    })
  }
  
  
  
  _run(idx) {
    this._snippets[idx].fn.call(null)
  }
  
  
  
  _addDefSnippets() {
    each(defSnippets, snippet => {
      this.add(snippet.name, snippet.fn, snippet.desc)
    })
  }
  
  
  
  _render() {
    this._renderHtml(
      this._tpl({
        snippets: this._snippets
      })
    )
  }
  
  
  
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$el.html(html)
  }
  
  
  
}
