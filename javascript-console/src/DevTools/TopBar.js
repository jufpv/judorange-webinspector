import {
    Emitter,
    //evalCss,
    //$,
    //isNum
} from '../lib/util'



export default class TopBar extends Emitter {
    
    
    
    constructor($el) {
        super()
        this._$el = $el
        $el.find('.eruda-navigation-address').html(window.location)  // Set current location
        this._bindEvent()
    }
  
  
  
    _bindEvent() {
    
        //let self = this
        let el = this._$el // if needed Ju
    
        // REFRESH
        this._$el.on('click', '.eruda-navigation-refresh', function() {
            el.find('.eruda-navigation-refresh').addClass('eruda-activebtn')
            document.location.reload(true) // Recharge la page actuelle, sans utiliser le cache
        })
    
        // BACK
        this._$el.on('click', '.eruda-navigation-back', function() {
            el.find('.eruda-navigation-back').addClass('eruda-activebtn')
            window.history.back()
        })
    
        // FORWARD
        this._$el.on('click', '.eruda-navigation-forward', function() {
            el.find('.eruda-navigation-forward').addClass('eruda-activebtn')
            window.history.forward()
        })
    
        // ADDRESS BAR
        this._$el.on('keydown', '.eruda-navigation-address', function(event) {
            //console.log(event)
            if( event.origEvent.key == 'Enter' ){
                event.origEvent.preventDefault()
                window.location = el.find('.eruda-navigation-address').val().trim()
            }
        })
        /*this._$el.on('click', '.eruda-navigation-address', function() {
            // check for focus
            var is_focused = ( document.activeElement === el.find('.eruda-navigation-address').get(0) )
            if(is_focused == false) el.find('.eruda-navigation-address').get(0).select()
        })*/
    
        // SMALLADDRESS BAR
        this._$el.on('click', '.eruda-navigation-smalladdress', function() {
            //console.log('click on smalladdress button')
            el.find('.eruda-navigation-address').addClass('eruda-navigation-address-display')
            el.find('.eruda-navigation-smallclose').addClass('eruda-navigation-smallclose-display')
        })
        this._$el.on('click', '.eruda-navigation-smallclose', function() {
            el.find('.eruda-navigation-address').rmClass('eruda-navigation-address-display')
            el.find('.eruda-navigation-smallclose').rmClass('eruda-navigation-smallclose-display')
        })
    
        // SEARCH
        this._$el.on('click', '.eruda-navigation-search', function() {
            window.location = el.find('.eruda-navigation-address').val().trim()
        })
    
    } //Bind event
    
    
}