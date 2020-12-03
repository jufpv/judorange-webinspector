import Tool from '../DevTools/Tool'
import CssStore from './CssStore'
import stringify from '../lib/stringify'
import Highlight from './Highlight'
import Select from './Select'
import Settings from '../Settings/Settings'
import {
  evalCss,
  $,
  keys,
  MutationObserver,
  each,
  isErudaEl,
  toStr,
  isEl,
  isStr,
  map,
  escape,
  startWith,
  isFn,
  isBool,
  safeGet,
  pxToNum,
  isNaN,
  isNum,
  toArr // ERUDA DOM
} from '../lib/util'



export default class Elements extends Tool {
    
    
  constructor() {
    super()
    this.name = 'elements'
    
    // ERUDA ELEMENTS (customized) :
    this._style = evalCss(require('./Elements.scss'))
    this._tpl = require('./Elements.hbs')
    
    // ERUDA DOM - - - - - - - - - - - - - - - - - - - - - - -
    //this._style = evalCss(require('./dom/style.scss'))
    this._isInit = false
    this._htmlTagTpl = require('./dom/htmlTag.hbs')
    this._textNodeTpl = require('./dom/textNode.hbs')
    this._selectedEl = document.documentElement
    this._htmlCommentTpl = require('./dom/htmlComment.hbs')
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
    // ERUDA ELEMENTS
    this._rmDefComputedStyle = true
    this._highlightElement   = false
    this._selectElement      = false
    this._observeElement     = true
  }
  
  
  
  init($el, container) {
    
    // INIT
    super.init($el)
    this._container = container
    
    // CONSTRUCT VIEW
    $el.append( require('./index.hbs')() )
    
    // GET VIEW ELEMENTS
    this._$showArea = $el.find('.eruda-show-area')  // Elements properties
    this._$domTree = $el.find('.eruda-dom-tree')    // Dom tree

    // ELEMENT PROPERTIES
    this._htmlEl = document.documentElement
    this._highlight = new Highlight(this._container.$container)
    this._select = new Select()
    this._bindEvent()
    this._initObserver()
    this._initCfg()
    
    // DOM TREE PROPERTIES
    this._$domTree.innerHTML = '' // New
    this._$domTree_dynamicTagId = 0 //ju
    this._$domTree_currentTagId = 0 //ju
    
    // DOM TREE INIT
    this._clearTree() // remove content of domTree
    this._initTree()
    
  }
  
  
  
  show() {
    super.show()

    if (this._observeElement) this._enableObserver()
    if (!this._curEl) this._setEl(this._htmlEl)
    
    // ERUDA DOM - - - - - - - - - - - - - - - - - - - - - - -
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
    this._render()
    
    // Scroll management
    super.preventBackgroundScroll('.eruda-scrollcontainer-left')
    super.preventBackgroundScroll('.eruda-scrollcontainer-right')
    // --
    
  }
  
  
  
  hide() {
    this._disableObserver()
    return super.hide()
  }
  
  
  
  set(e) {
    this._setEl(e)
    this.scrollToTop()
    this._render()
    return this
  }
  
  
  
  hightlightSelection(element){
      this.set(element) // eruda
      this._clearTree() // dom
      this._renderChildren(null, this._$domTree) // dom
      this.select(element) // dom
  }
  
  
  
  overrideEventTarget() {
    let winEventProto = getWinEventProto()

    let origAddEvent = (this._origAddEvent = winEventProto.addEventListener)
    let origRmEvent = (this._origRmEvent = winEventProto.removeEventListener)

    winEventProto.addEventListener = function(type, listener, useCapture) {
      addEvent(this, type, listener, useCapture)
      origAddEvent.apply(this, arguments)
    }

    winEventProto.removeEventListener = function(type, listener, useCapture) {
      rmEvent(this, type, listener, useCapture)
      origRmEvent.apply(this, arguments)
    }
  }
  
  
  
  scrollToTop() {
    let el = this._$showArea.get(0)
    el.scrollTop = 0
  }
  
  
  
  domtreeScrollToSelected(){
    // DOM : SCROLL TO SELECTED EL
    var container        = this._$el.find('.eruda-dom').get(0)
    var dom_selected     = this._$el.find('.eruda-selected').get(0)
    container.scrollTop  = dom_selected.offsetTop - (container.offsetHeight/2)
  }
  
  
  
  restoreEventTarget() {
    let winEventProto = getWinEventProto()

    if (this._origAddEvent) winEventProto.addEventListener = this._origAddEvent
    if (this._origRmEvent) winEventProto.removeEventListener = this._origRmEvent
  }
  
  
  
  destroy() {
    super.destroy()
    evalCss.remove(this._style)
    this._select.disable()
    this._highlight.destroy()
    this._disableObserver()
    this.restoreEventTarget()
    this._rmCfg()
  }
  
  
  
  _back() {
    if (this._curEl === this._htmlEl) return

    let parentQueue = this._curParentQueue
    let parent = parentQueue.shift()

    while (!isElExist(parent)) parent = parentQueue.shift()

    this.set(parent)
  }
  
  
  
  _bindEvent() {
    let self = this
    let container = this._container
    let select = this._select


    //$(document).on('touchmove', function(e) { e.preventDefault() })

    this._$el
    
        // PREVENT PARENT SCROLL PROPAGATION
        //.on('touchmove', '.eruda', function(e) { e.stopPropagation() })
        //.on('touchmove', function(e) {
        //    if() e.preventDefault();
        //}, false);
    
      .on('click', '.eruda-child', function() {
        let idx = $(this).data('idx')
        let curEl = self._curEl
        let el = curEl.childNodes[idx]

        if (el && el.nodeType === 3) {
          let curTagName = curEl.tagName
          let type

          switch (curTagName) {
            case 'SCRIPT':
              type = 'js'
              break
            case 'STYLE':
              type = 'css'
              break
            default:
              return
          }

          let sources = container.get('sources')

          if (sources) {
            sources.set(type, el.nodeValue)
            container.showTool('sources')
          }

          return
        }

        !isElExist(el) ? self._render() : self.set(el)
      })
      
      .on('click', '.eruda-listener-content', function() {
        //alert('yes') //this._container.get('elements').set(el)
        let text = $(this).text()
        let sources = container.get('sources')

        if (sources) {
          sources.set('js', text)
          container.showTool('sources')
        }
      })
      
      .on('click', '.eruda-breadcrumb', () => {
        let data = this._elData

        if (!data) {
          data = stringify(this._curEl, { getterVal: true })
          data = JSON.parse(data)
        }
        let sources = container.get('sources')

        this._elData = data

        if (sources) {
          sources.set('json', data)
          container.showTool('sources')
        }
      })
      
      .on('click', '.eruda-parent', function() {
        let idx = $(this).data('idx')
        let curEl = self._curEl
        let el = curEl.parentNode

        while (idx-- && el.parentNode) el = el.parentNode

        !isElExist(el) ? self._render() : self.set(el)
      })
      
      /*
      .on('click', '.eruda-toggle-all-computed-style', () =>
        this._toggleAllComputedStyle()
      )
      */
    
    // SELECT & HIGHLIGHT
    var erudacontainer = container._$el.get(0).parentNode    
    var btn_select = erudacontainer.getElementsByClassName('eruda-toolbar-select')[0]
    var btn_highlight = erudacontainer.getElementsByClassName('eruda-toolbar-highlight')[0]
    btn_select.addEventListener('click', () => this._toggleSelect() )
    btn_highlight.addEventListener('click', () => this._toggleHighlight() )
    select.on('select', target => this.hightlightSelection(target)) // Elements !
    
    // UPDATE STYLES
    this._$el.on('click', '.eruda-inlinestyles-validate', function(){
      let curEl = self._curEl
      let user_inline_style = self._$el.find('.eruda-inlinestyles-str').val().trim()
      curEl.style = user_inline_style // set new style
      self.hightlightSelection(curEl)
    })
    
    // UPDATE HTML
    this._$el.on('click', '.eruda-html-validate', function(){
      let curEl = self._curEl
      let user_outer_html = self._$el.find('.eruda-html-str').val().trim()
      let curEl_parent = curEl.parentNode
      // Get child index in parent node :
      var i = 0
      var tmp_el = curEl
      while( (tmp_el = tmp_el.previousSibling) != null ) i++;
      //childNodes
      //console.log(user_outer_html)
      curEl.outerHTML = user_outer_html //test // set new html
      self.hightlightSelection( curEl_parent.childNodes[i] )
    })
    
    // EXPAND RIGHT MENU
    this._$el.on('click', '.eruda-expand-side-right', function(){
        let side_left = self._$el.find('.eruda-side-left').get(0)
        let btn_expand = self._$el.find('.eruda-expand-side-right').get(0)
        if( side_left.style.width == '100%' ){
            side_left.style.removeProperty('width')
            btn_expand.innerHTML = '❯'
        }
        else{
            side_left.style.width = '100%'
            btn_expand.innerHTML = '❮'
        }
    })
    
    // ELEMENT PROPERTIES NAVIGATION
    this._$el.on('click', '.eruda-element-properties-navbar-btn-styles', () => this._togglePropertiesOfType('styles') )
    this._$el.on('click', '.eruda-element-properties-navbar-btn-html', () => this._togglePropertiesOfType('html') )
    this._$el.on('click', '.eruda-element-properties-navbar-btn-listeners', () => this._togglePropertiesOfType('listeners') )
    this._$el.on('click', '.eruda-element-properties-navbar-btn-attributes', () => this._togglePropertiesOfType('attributes') )
    this._$el.on('click', '.eruda-element-properties-navbar-btn-computed', () => this._togglePropertiesOfType('computed') )
    
  }
  
  
  
  // PROPERTIES NAVIGATION
  _togglePropertiesOfType(properties_of_type){
    // SELECT BTN
    let btn_list = this._$el.find('.eruda-element-properties-navbar-btn')
    btn_list.rmClass('eruda-active')
    btn_list.each(function(i){
        let btn = btn_list[i]
        if(btn.classList.contains('eruda-element-properties-navbar-btn-'+properties_of_type) == false) btn.classList.remove('eruda-active')
        else btn.classList.add('eruda-active')
    })
    // DISPLAY APPROPRIATE PROPERTIES
    let props_col_list = this._$el.find('.eruda-elements-col')
    props_col_list.rmClass('eruda-active')
    props_col_list.each(function(i){
        let props_col = props_col_list[i]
        if(props_col.classList.contains('eruda-elements-col-'+properties_of_type) == false) props_col.classList.remove('eruda-active')
        else props_col.classList.add('eruda-active')
    })
  }
    
  
  
  _toggleAllComputedStyle() {
    this._rmDefComputedStyle = !this._rmDefComputedStyle
    this._render()
  }
  
  
  
  _enableObserver() {
    this._observer.observe(this._htmlEl, {
      attributes: true,
      childList: true,
      subtree: true
    })
  }
  
  
  
  _disableObserver() {
    this._observer.disconnect()
  }
  
  
  
  _toggleHighlight() {
    
    //if (this._selectElement) return
    if (this._selectElement) this._toggleSelect()

    let erudacontainer = this._container._$el.get(0).parentNode
    let erudabottombar = erudacontainer.getElementsByClassName('eruda-toolbar')[0]
    let btn_highlight = erudabottombar.getElementsByClassName('eruda-toolbar-highlight')[0]
    
    if(btn_highlight.classList.contains('eruda-active'))
        btn_highlight.classList.remove('eruda-active')
    else
        btn_highlight.classList.add('eruda-active')
    
    this._highlightElement = !this._highlightElement
    this._render()
    
  }
  
  
  
  _toggleSelect() {
      
    let select = this._select

    let erudacontainer = this._container._$el.get(0).parentNode
    let erudabottombar = erudacontainer.getElementsByClassName('eruda-toolbar')[0]
    let btn_select = erudabottombar.getElementsByClassName('eruda-toolbar-select')[0]
    
    if(btn_select.classList.contains('eruda-active'))
        btn_select.classList.remove('eruda-active')
    else
        btn_select.classList.add('eruda-active')
    
    if (!this._selectElement && !this._highlightElement) this._toggleHighlight()
    this._selectElement = !this._selectElement

    if (this._selectElement)  select.enable()
    else                      select.disable()
    
  }
  
  
  
  _setEl(el) {
    this._curEl = el
    this._elData = null
    this._curCssStore = new CssStore(el)
    this._highlight.setEl(el)
    this._rmDefComputedStyle = true

    let parentQueue = []

    let parent = el.parentNode
    while (parent) {
      parentQueue.push(parent)
      parent = parent.parentNode
    }
    this._curParentQueue = parentQueue
  }
  
  
  
  _getData() {
    let ret = {}

    let el = this._curEl
    let cssStore = this._curCssStore

    let { className, id, attributes, tagName } = el 

    ret.parents = getParents(el)
    ret.children = formatChildNodes(el.childNodes)
    ret.attributes = formatAttr(attributes)
    ret.name = formatElName({ tagName, id, className, attributes })

    let events = el.erudaEvents
    if (events && keys(events).length !== 0) ret.listeners = events

    if (needNoStyle(tagName)) return ret


    // COMPUTED STYLES
    
    let computedStyle = cssStore.getComputedStyle()

    function getBoxModelValue(type) {
      let keys = ['top', 'left', 'right', 'bottom']
      if (type !== 'position') keys = map(keys, key => `${type}-${key}`)
      if (type === 'border') keys = map(keys, key => `${key}-width`)

      return {
        top: boxModelValue(computedStyle[keys[0]], type),
        left: boxModelValue(computedStyle[keys[1]], type),
        right: boxModelValue(computedStyle[keys[2]], type),
        bottom: boxModelValue(computedStyle[keys[3]], type)
      }
    }

    let boxModel = {
      margin: getBoxModelValue('margin'),
      border: getBoxModelValue('border'),
      padding: getBoxModelValue('padding'),
      content: {
        width: boxModelValue(computedStyle['width']),
        height: boxModelValue(computedStyle['height'])
      }
    }

    if (computedStyle['position'] !== 'static') {
      boxModel.position = getBoxModelValue('position')
    }
    ret.boxModel = boxModel

    //if (this._rmDefComputedStyle) {
    //  computedStyle = rmDefComputedStyle(computedStyle)
    //}
    //ret.rmDefComputedStyle = this._rmDefComputedStyle
    processStyleRules(computedStyle)
    ret.computedStyle = computedStyle
    
    
    // STYLES

    let styles = cssStore.getMatchedCSSRules()
    styles.unshift(getInlineStyle(el.style))
    styles.forEach(style => processStyleRules(style.style))
    ret.styles = styles
    
    
    // QUICK STYLES
    
    var inlineStyles = getInlineStyle(el.style).style // ju [0] -> element.style
    var inlineStylesStr='' // prevent undefined
    for (var key in inlineStyles){
        if (inlineStyles.hasOwnProperty(key)) {
            var value = inlineStyles[key]
            //console.log('Key is ' + key + ', value is' + value);
            inlineStylesStr += ''+key+':'+value+'; \n'
        }
    }
    inlineStylesStr = inlineStylesStr.replace('undefined','') // prevent undefined
    //console.log( inlineStyles )
    //console.log( inlineStylesStr )
    ret.inlineStyles = inlineStyles
    ret.inlineStylesStr = inlineStylesStr
    
    // OUTER HTML
    
    ret.outerHTML = el.outerHTML
    
    return ret
  }
  
  
  
  _render() {
    if (!isElExist(this._curEl)) return this._back()

    this._highlight[this._highlightElement ? 'show' : 'hide']()
    this._renderHtml(this._tpl(this._getData()))
  }
  
  
  
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$showArea.html(html)
  }
  
  
  
  _initObserver() {
    this._observer = new MutationObserver(mutations => {
      each(mutations, mutation => this._handleMutation(mutation))
    })
  }
  
  
  
  _handleMutation(mutation) {
    let i, len, node

    if (isErudaEl(mutation.target)) return

    if (mutation.type === 'attributes') {
      if (mutation.target !== this._curEl) return
      this._render()
    } else if (mutation.type === 'childList') {
      if (mutation.target === this._curEl) return this._render()

      let addedNodes = mutation.addedNodes

      for (i = 0, len = addedNodes.length; i < len; i++) {
        node = addedNodes[i]

        if (node.parentNode === this._curEl) return this._render()
      }

      let removedNodes = mutation.removedNodes

      for (i = 0, len = removedNodes.length; i < len; i++) {
        if (removedNodes[i] === this._curEl) return this.set(this._htmlEl)
      }
    }
  }
  
  
  
  _rmCfg() {
    let cfg = this.config

    let settings = this._container.get('settings')

    if (!settings) return

    settings
      .remove(cfg, 'overrideEventTarget')
      .remove(cfg, 'observeElement')
      .remove('Elements')
  }
  
  
  
  _initCfg() {
    let cfg = (this.config = Settings.createCfg('elements', {
      overrideEventTarget: true,
      observeElement: true
    }))

    if (cfg.get('overrideEventTarget')) this.overrideEventTarget()
    if (cfg.get('observeElement')) this._observeElement = false

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'overrideEventTarget':
          return val ? this.overrideEventTarget() : this.restoreEventTarget()
        case 'observeElement':
          this._observeElement = val
          return val ? this._enableObserver() : this._disableObserver()
      }
    })

    let settings = this._container.get('settings')
    settings
      .text('Elements')
      .switch(cfg, 'overrideEventTarget', 'Catch Event Listeners')

    if (this._observer) settings.switch(cfg, 'observeElement', 'Auto Refresh')

    settings.separator()
  }
  
  
  
  
  
  
  
      
    // ERUDA DOM - - - - - - - - - - - - - - - - - - - - - - -
    
    select(el) {
        const els = []
        els.push(el)
        
        // DOM : GET ALL PARENTS ELEMENTS FROM THE LAST ELEMENT
        while (el.parentElement) {
            els.unshift(el.parentElement)
            el = el.parentElement
        }
        
        // DOM : OPEN PARENTS THEN SELECT CURRENT ELEMENT
        while (els.length > 0) {
            el = els.shift()
            if (el.erudaDom.open) el.erudaDom.open()  // Ju : open if possible. If we can't, that signify there is no child
            el.erudaDom.select()                      // select element + add selection class
        }
        
        // DOM : SCROLL TO SELECTED EL
        this.domtreeScrollToSelected()
        
    }
    
    
    
    _setElement(el) {
      const elements = this._container.get('elements')
      if (!elements) return
      elements.set(el)
    }
    
    
    
    _clearTree(){ // Ju
        // this._isInit = false
        this._$el.find('.eruda-dom-tree').html('')
    }
    
    
    
    _initTree() {
        this._isInit = true
        this._renderChildren(null, this._$domTree)
        this.select(document.body)
    }
    
    
    
    _renderChildren(node, $container) {
      let children
      if (!node)  children = [document.documentElement]
      else        children = toArr(node.childNodes)
      const container = $container.get(0)
      if (node) {
        children.push({
          nodeType: 'END_TAG',
          node
        })
      }
      
      //each(children, child => this._renderChild(child, container))
      for(var i=0;i<children.length;i++){
          this._$domTree_dynamicTagId ++
          var dynamicTagId = this._$domTree_dynamicTagId //ju
          this._renderChild(children[i], container, dynamicTagId) // we send a unique tag id to se dom current tag with element hightlight inspector
      }
      
      
    }
    
    
    
    
    _renderChild(child, container, dynamicTagId) {
        
        const $tag    = createEl('li')
        let isEndTag  = false
        $tag.addClass('eruda-tree-item')
    
        // Element
        if (child.nodeType === child.ELEMENT_NODE) {
            const childCount = child.childNodes.length
            const expandable = childCount > 0
            
            /*const data = {
                get_html_tag_data,
                hasTail: expandable
            }*/
            
            var get_html_tag_data = {}
            get_html_tag_data = getHtmlTagData(child)
            get_html_tag_data.hasTail = expandable
            get_html_tag_data.dynamicTagId = dynamicTagId // regarder dans open et close plus bas aussi !!
             
            //alert(dynamicTagId)
            
            const hasOneTextNode =
                childCount === 1 && child.childNodes[0].nodeType === child.TEXT_NODE
                
            if (hasOneTextNode) {
                //data.text = child.childNodes[0].nodeValue
                get_html_tag_data.text = child.childNodes[0].nodeValue // New
            }
            
            //$tag.html(this._htmlTagTpl(data))
            $tag.html(this._htmlTagTpl(get_html_tag_data))
            
            // Extend
            if (expandable && !hasOneTextNode) $tag.addClass('eruda-expandable')
            
        }
    
        // Text
        else if (child.nodeType === child.TEXT_NODE) {
            const value = child.nodeValue
            if (value.trim() === '') return
    
            $tag.html(
                this._textNodeTpl({
                    value
                })
            )
        }
    
        // Comment
        else if (child.nodeType === child.COMMENT_NODE) {
            const value = child.nodeValue
            if (value.trim() === '') return
    
            $tag.html(
                this._htmlCommentTpl({
                    value
                })
            )
        }
    
        // End tag
        else if (child.nodeType === 'END_TAG') {
            isEndTag = true
            child = child.node
            $tag.html(
                `<span class="eruda-html-tag" style="margin-left: -12px;">&lt;<span class="eruda-tag-name">/${child.tagName.toLocaleLowerCase()}</span>&gt;</span><span class="eruda-selection"></span>`
            )
        }
        
        // Else
        else {
            return
        }
    
        const $children = createEl('ul')
        $children.addClass('eruda-children')
    
        container.appendChild($tag.get(0))
        container.appendChild($children.get(0))
    
        if (child.nodeType !== child.ELEMENT_NODE) return
    
        let erudaDom = {}
    
        // Has tag "eruda expandable" ?
        if ($tag.hasClass('eruda-expandable')) {
            
            const open = () => {
                /*$tag.html(
                    this._htmlTagTpl({
                        get_html_tag_data,
                        hasTail: false
                    })
                )*/
                var get_html_tag_data = {}
                get_html_tag_data = getHtmlTagData(child)
                get_html_tag_data.hasTail = false
                get_html_tag_data.dynamicTagId = dynamicTagId
                $tag.html( this._htmlTagTpl(get_html_tag_data) ) // New
                
                $tag.addClass('eruda-expanded')
                this._renderChildren(child, $children)
            }
            
            const close = () => {
                $children.html('')
                /*$tag.html(
                    this._htmlTagTpl({
                        get_html_tag_data,
                        hasTail: true
                    })
                )*/
                var get_html_tag_data = {}
                get_html_tag_data = getHtmlTagData(child)
                get_html_tag_data.hasTail = true
                get_html_tag_data.dynamicTagId = dynamicTagId
                $tag.html( this._htmlTagTpl(get_html_tag_data) ) // New
                
                $tag.rmClass('eruda-expanded')
            }
            
            const toggle = () => {
                if ($tag.hasClass('eruda-expanded')) close()
                else open()
            }
            
            $tag.on('click', '.eruda-toggle-btn', e => {
                e.stopPropagation()
                toggle()
            })
            
            erudaDom = { open, close }
            
        }
        
        
    
        const select = () => {
            this._$el.find('.eruda-selected').rmClass('eruda-selected')
            $tag.addClass('eruda-selected')
            this._selectedEl = child
            this._setElement(child)    // dom snippet
            this.set(this._selectedEl) // Default eruda Elements
        }
    
        $tag.on('click', select)
        
        erudaDom.select = select
        
        if (!isEndTag) child.erudaDom = erudaDom
    }
    
  
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
  
  
  
} //class






// ERUDA DOM - - - - - - - - - - - - - - - - - - - - - - -

  
  
  function getHtmlTagData(el) {
    const ret = {}
    ret.tagName = el.tagName.toLocaleLowerCase()
    //alert(el.tagName.toLocaleLowerCase())
    const attributes = []
    each(el.attributes, attribute => {
      const { name, value } = attribute
        attributes.push({
            name,
            value,
            underline: isUrlAttribute(el, name)
        })
    })
    ret.attributes = attributes

    return ret
  }
  
  

  function isUrlAttribute(el, name) {
    const tagName = el.tagName
    if (
      tagName === 'SCRIPT' ||
      tagName === 'IMAGE' ||
      tagName === 'VIDEO' ||
      tagName === 'AUDIO'
    ) {
      if (name === 'src') return true
    }

    if (tagName === 'LINK') {
      if (name === 'href') return true
    }

    return false
  }
  


  function createEl(name) {
      return $(document.createElement(name))
  }


// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  












function processStyleRules(style) {
  each(style, (val, key) => (style[key] = processStyleRule(val)))
}



let regColor = /rgba?\((.*?)\)/g,
  regCssUrl = /url\("?(.*?)"?\)/g



function processStyleRule(val) {
  // For css custom properties, val is unable to retrieved.
  val = toStr(val)

  return val
    .replace(
      regColor,
      '<span class="eruda-style-color" style="background-color: $&"></span>$&'
    )
    .replace(regCssUrl, (match, url) => `url("${wrapLink(url)}")`)
}



const isElExist = val => isEl(val) && val.parentNode

function formatElName(data, { noAttr = false } = {}) {
  let { id, className, attributes } = data

  let ret = `<span class="eruda-blue">${data.tagName.toLowerCase()}</span>`

  if (id !== '') ret += `#${id}`

  if (isStr(className)) {
    each(className.split(/\s+/g), val => {
      if (val.trim() === '') return
      ret += `.${val}`
    })
  }

  if (!noAttr) {
    each(attributes, attr => {
      let name = attr.name
      if (name === 'id' || name === 'class' || name === 'style') return
      ret += ` ${name}="${attr.value}"`
    })
  }

  return ret
}



let formatAttr = attributes =>
  map(attributes, attr => {
    let { name, value } = attr
    value = escape(value)

    let isLink =
      (name === 'src' || name === 'href') && !startWith(value, 'data')
    if (isLink) value = wrapLink(value)
    if (name === 'style') value = processStyleRule(value)

    return { name, value }
  })

function formatChildNodes(nodes) {
  let ret = []

  for (let i = 0, len = nodes.length; i < len; i++) {
    let child = nodes[i],
      nodeType = child.nodeType

    if (nodeType === 3 || nodeType === 8) {
      let val = child.nodeValue.trim()
      if (val !== '')
        ret.push({
          text: val,
          isCmt: nodeType === 8,
          idx: i
        })
      continue
    }

    let isSvg = !isStr(child.className)

    if (
      nodeType === 1 &&
      child.id !== 'eruda' &&
      (isSvg || child.className.indexOf('eruda') < 0)
    ) {
      ret.push({
        text: formatElName(child),
        isEl: true,
        idx: i
      })
    }
  }

  return ret
}



function getParents(el) {
  let ret = []
  let i = 0
  let parent = el.parentNode

  while (parent && parent.nodeType === 1) {
    ret.push({
      text: formatElName(parent, { noAttr: true }),
      idx: i++
    })

    parent = parent.parentNode
  }

  return ret.reverse()
}



function getInlineStyle(style) {
  let ret = {
    selectorText: 'element.style',
    style: {}
  }

  for (let i = 0, len = style.length; i < len; i++) {
    let s = style[i]

    ret.style[s] = style[s]
  }

  return ret
}



/*let defComputedStyle = require('./defComputedStyle.json')

function rmDefComputedStyle(computedStyle) {
  let ret = {}

  each(computedStyle, (val, key) => {
    if (val === defComputedStyle[key]) return

    ret[key] = val
  })

  return ret
}*/



let NO_STYLE_TAG = ['script', 'style', 'meta', 'title', 'link', 'head']



let needNoStyle = tagName => NO_STYLE_TAG.indexOf(tagName.toLowerCase()) > -1



function addEvent(el, type, listener, useCapture = false) {
  if (!isEl(el) || !isFn(listener) || !isBool(useCapture)) return

  let events = (el.erudaEvents = el.erudaEvents || {})

  events[type] = events[type] || []
  events[type].push({
    listener: listener,
    listenerStr: listener.toString(),
    useCapture: useCapture
  })
}



function rmEvent(el, type, listener, useCapture = false) {
  if (!isEl(el) || !isFn(listener) || !isBool(useCapture)) return

  let events = el.erudaEvents

  if (!(events && events[type])) return

  let listeners = events[type]

  for (let i = 0, len = listeners.length; i < len; i++) {
    if (listeners[i].listener === listener) {
      listeners.splice(i, 1)
      break
    }
  }

  if (listeners.length === 0) delete events[type]
  if (keys(events).length === 0) delete el.erudaEvents
}



let getWinEventProto = () => {
  return safeGet(window, 'EventTarget.prototype') || window.Node.prototype
}

let wrapLink = link => `<a href="${link}" target="_blank">${link}</a>`

function boxModelValue(val, type) {
  if (isNum(val)) return val

  if (!isStr(val)) return '‒'

  let ret = pxToNum(val)
  if (isNaN(ret)) return val

  if (type === 'position') return ret

  return ret === 0 ? '‒' : ret
}
