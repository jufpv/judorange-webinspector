const fs = require('fs')
const path = require('path')
const util = require('./util')

const nameMap = {
  Clearsearch: 'clear',
  Fill: 'error',
  arrow: 'arrow-left',
  right: 'arrow-right'
}

fs.readFile(path.resolve(__dirname, 'icon/iconfont.woff'), function(err, data) {
  if (err) return console.log(err)

  genCssFile(data.toString('base64'))
})

function genCssFile(fontData) {
  fs.readFile(path.resolve(__dirname, 'icon/iconfont.css'), 'utf-8', function(
    err,
    data
  ) {
    if (err) return console.log(err)

    data = data.split('\n')
    data.splice(
      2,
      5,
      "  src: url('data:application/x-font-woff;charset=utf-8;base64," +
        fontData +
        "') format('woff');"
    )
    data = data.join('\n')
    data = data.replace(
      /\.eruda-icon/g,
      "[class^='eruda-icon-'],\n[class*=' eruda-icon-']"
    )

    util.each(nameMap, (val, key) => {
      data = data.replace('icon-' + key + ':', 'icon-' + val + ':')
    })

    writeCssFile(data)
  })
}

function writeCssFile(data) {
  fs.writeFile(
    path.resolve(__dirname, '../src/style/icon.css'),
    data,
    'utf-8',
    function(err, data) {
      if (err) return console.log(err)

      console.log('icon.css generated!')
    }
  )
}
