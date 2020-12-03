import stringify from './stringify'

onmessage = function(e) {
  let [id, obj, options] = e.data
  let result = stringify(obj, options)
  postMessage([id, result])
}
