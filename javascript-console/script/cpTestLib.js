const copy = require('copy')
const path = require('path')
const util = require('./util')

util.mkdir(path.resolve(__dirname, '../test/lib'), function(err) {
  if (err) return console.log(err)

  cpTestFiles()
})

function cpTestFiles() {
  util.parallel(
    [
      genCpCb(
        '/jasmine-core/lib/jasmine-core/{jasmine.css,jasmine.js,jasmine-html.js,boot.js}',
        '/lib',
        {
          srcBase: '/jasmine-core/lib/jasmine-core/'
        }
      ),
      genCpCb('/jasmine-jquery/lib/jasmine-jquery.js', '/lib', {
        srcBase: '/jasmine-jquery/lib/'
      }),
      genCpCb('/jquery/dist/jquery.js', '/lib', {
        srcBase: '/jquery/dist/'
      })
    ],
    function(err) {
      if (err) return console.log(err)

      console.log('Copy test lib successfully!')
    }
  )
}

function genCpCb(src, dest, options) {
  options = options || {}
  if (options.srcBase)
    options.srcBase =
      path.resolve(__dirname, '../node_modules/') + options.srcBase

  src = path.resolve(__dirname, '../node_modules/') + src
  dest = path.resolve(__dirname, '../test/') + dest

  return function(cb) {
    console.log('Copy %s to %s', src, dest)
    copy(src, dest, options, function(err) {
      if (err) return cb(err)

      cb()
    })
  }
}
