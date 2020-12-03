import { Class } from '../lib/util'

export default Class({
  init($el) {
    this._$el = $el
  },
  show() {
    this._$el.show()

    return this
  },
  hide() {
    this._$el.hide()

    return this
  },
  destroy() {
    this._$el.remove()
  },
  
  
  
  
  preventBackgroundScroll(scrollcontainer_class){ // disable background scrolling
  
      // USEFUL VALUES
      let self             = this
      let preventMove      = false
      
      
      // INIT WITH TOP =1
      //self._$el.find(scrollcontainer_class).get(0).scrollTop = 1
      
  
      // SECURITY 1 : TOUCHSTART EVENT
      this._$el.on('touchstart', scrollcontainer_class, function(e){
          // Values
          let scrollcontainer  = self._$el.find(scrollcontainer_class).get(0)
          let top = scrollcontainer.scrollTop
          let totalScroll = scrollcontainer.scrollHeight
          let currentScroll = top + scrollcontainer.offsetHeight
          // Prepare
          //INNER INSTEDscrollcontainer.style.minHeight = 'calc( 100% + 1px )'
          // Checks
          if (top === 0) {
              scrollcontainer.scrollTop = 1 // when content is on the top, reset scrollTop to lower position to prevent iOS apply scroll action to background
              //if (content.scrollTop === 0) preventMove = true // however, when content's height is less than its container's height, scrollTop always equals to 0 (it is always on the top), so we need to prevent scroll event manually
          }
          else if (currentScroll === totalScroll){ // when content is on the bottom, do similar processing
              scrollcontainer.scrollTop = top - 1
              //if (content.scrollTop === top) preventMove = true
          }
          // Prevent default immediatly if needed
          if(preventMove) e.preventDefault()
      })
      // --
      this._$el.on('touchmove', scrollcontainer_class, function(e) {
          if(preventMove) e.preventDefault()
      })
      // --
      this._$el.on('touchend', scrollcontainer_class, function() {
          preventMove = false
      })
      
      
      // SECURITY 2 : CONSTANT CHECK
      function checkScrollTop(){
          // Values
          let scrollcontainer  = self._$el.find(scrollcontainer_class).get(0)
          let top = scrollcontainer.scrollTop
          let totalScroll = scrollcontainer.scrollHeight
          let currentScroll = top + scrollcontainer.offsetHeight
          // Prepare
          //INNER INSTEDscrollcontainer.style.minHeight = 'calc( 100% + 1px )'
          // Checks
          if (top === 0) scrollcontainer.scrollTop = 1 // when scrollcontainer is on the top
          else if (currentScroll === totalScroll) scrollcontainer.scrollTop = top - 1 // when scrollcontainer is on the bottom
      }
      setInterval(checkScrollTop,100); // check every 100ms
      
  }
  
  
  
  
  
})
