const path = require('path')
const util = require('./util')
const istanbul = require('istanbul')

let collector = new istanbul.Collector()
let reporter = new istanbul.Reporter()

let remappedJson = require('../coverage/coverage-remapped.json')

let coverage = util.reduce(
  util.keys(remappedJson),
  function(result, source) {
    if (isSrc()) {
      let correctPath = source.replace(
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../')
      )

      let val = remappedJson[source]
      val.path = correctPath
      result[correctPath] = val
    }

    function isSrc(src) {
      return (
        source.match(/src.*\.js$/) &&
        source.indexOf('node_modules') < 0 &&
        source.indexOf('util') < 0
      )
    }

    return result
  },
  {}
)

collector.add(coverage)

reporter.addAll(['html', 'lcov'])
reporter.write(collector, true, function() {
  console.log('open coverage/index.html to see the coverage report.')
})
