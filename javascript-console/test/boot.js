function boot(name, cb) {
  // Need a little delay to make sure width and height of webpack dev server iframe are initialized.
  setTimeout(function() {
    let options = {
      useShadowDom: false
    }
    if (name) {
      options.tool = name === 'settings' ? [] : name
    }

    try {
      eruda.init(options)
    } catch (e) {
      alert(e)
    }
    eruda
      .show()
      .get()
      .config.set('displaySize', 50)

    cb && cb()

    if (name == null) return

    loadJs('lib/boot', function() {
      loadJs('lib/jasmine-jquery', function() {
        // This is needed to trigger jasmine initialization.
        loadJs(name, function() {
          window.onload()
        })
      })
    })
  }, 500)
}

function loadJs(src, cb) {
  let script = document.createElement('script')
  script.src = src + '.js'
  script.onload = cb
  document.body.appendChild(script)
}
