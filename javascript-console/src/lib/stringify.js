import {
  escapeJsonStr,
  toStr,
  each,
  endWith,
  contain,
  filter,
  isEmpty,
  isArr,
  isFn,
  isRegExp,
  uniqId,
  last,
  extend
} from './stringifyUtil'

// Modified from: https://jsconsole.com/
export default function stringify(
  obj,
  {
    visitor = new Visitor(),
    topObj,
    level = 0,
    getterVal = false,
    unenumerable = true
  } = {}
) {
  let json = ''
  let type
  let parts = []
  let names = []
  let proto
  let objAbstract
  let circularObj
  let allKeys
  let keys
  let id = ''

  topObj = topObj || obj

  let passOpts = { visitor, getterVal, unenumerable, level: level + 1 }
  let passProtoOpts = {
    visitor,
    getterVal,
    topObj,
    unenumerable,
    level: level + 1
  }

  let wrapKey = key => `"${escapeJsonStr(key)}"`
  let wrapStr = str => `"${escapeJsonStr(toStr(str))}"`

  type = getType(obj)

  let isFn = type === '[object Function]'
  let isStr = type === '[object String]'
  let isArr = type === '[object Array]'
  let isObj = type === '[object Object]'
  let isNum = type === '[object Number]'
  let isSymbol = type === '[object Symbol]'
  let isBool = type === '[object Boolean]'

  circularObj = visitor.check(obj)

  if (circularObj) {
    let abstract = circularObj.abstract
    json = `{"erudaObjAbstract": ${wrapStr(
      abstract.erudaObjAbstract
    )}, "erudaCircular": ${wrapStr(abstract.erudaCircular)}}`
  } else if (isStr) {
    json = wrapStr(obj)
  } else if (isArr || isObj || isFn) {
    id = visitor.visit(obj)

    if (canBeProto(obj)) {
      obj = Object.getPrototypeOf(obj)
      id = visitor.visit(obj)
    }

    names = getKeys(obj)
    keys = names.keys
    allKeys = names.allKeys
    names = unenumerable ? allKeys : keys

    proto = Object.getPrototypeOf(obj)
    if (proto) {
      proto = `${wrapKey('erudaProto')}: ${stringify(proto, passProtoOpts)}`
    }
    if (isFn) {
      // We don't need these properties to display for functions.
      names = names.filter(val => ['arguments', 'caller'].indexOf(val) < 0)
    }
    json = '{ '
    objAbstract = getObjAbstract(obj)
    visitor.updateAbstract(id, {
      erudaObjAbstract: objAbstract,
      erudaCircular: id
    })
    parts.push(`${wrapKey('erudaObjAbstract')}: ${wrapStr(objAbstract)}`)
    parts.push(`"erudaId": "${id}"`)
    each(names, objIteratee)
    if (proto) parts.push(proto)
    json += parts.join(', ') + ' }'
  } else if (isNum) {
    json = obj + ''
    if (endWith(json, 'Infinity') || json === 'NaN') json = `"${json}"`
  } else if (isBool) {
    json = obj ? 'true' : 'false'
  } else if (obj === null) {
    json = 'null'
  } else if (isSymbol) {
    json = wrapStr('Symbol')
  } else if (obj === undefined) {
    json = wrapStr('undefined')
  } else if (type === '[object HTMLAllCollection]') {
    // https://docs.webplatform.org/wiki/dom/HTMLAllCollection
    // Might cause a performance issue when stringify a dom element.
    json = wrapStr('[object HTMLAllCollection]')
  } else if (type === '[object HTMLDocument]' && level > 1) {
    // Same as reason above.
    json = wrapStr('[object HTMLDocument]')
  } else {
    try {
      id = visitor.visit(obj)
      if (canBeProto(obj)) {
        obj = Object.getPrototypeOf(obj)
        id = visitor.visit(obj)
      }

      json = '{ '
      objAbstract = getObjAbstract(obj)
      visitor.updateAbstract(id, {
        erudaObjAbstract: objAbstract,
        erudaCircular: id
      })
      parts.push(`${wrapKey('erudaObjAbstract')}: ${wrapStr(objAbstract)}`)
      parts.push(`"erudaId": "${id}"`)

      names = getKeys(obj)
      keys = names.keys
      allKeys = names.allKeys
      names = unenumerable ? allKeys : keys

      proto = Object.getPrototypeOf(obj)
      if (proto) {
        try {
          proto = `${wrapKey('erudaProto')}: ${stringify(proto, passProtoOpts)}`
        } catch (e) {
          proto = `${wrapKey('erudaProto')}: ${wrapStr(e.message)}`
        }
      }
      each(names, objIteratee)
      if (proto) parts.push(proto)
      json += parts.join(', ') + ' }'
    } catch (e) {
      json = wrapStr(obj)
    }
  }

  function objIteratee(name) {
    let unenumerable = !contain(keys, name) ? 'erudaUnenumerable ' : ''
    let key = wrapKey(unenumerable + name)
    let getKey = wrapKey(unenumerable + 'get ' + name)
    let setKey = wrapKey(unenumerable + 'set ' + name)

    let descriptor = Object.getOwnPropertyDescriptor(obj, name)
    let hasGetter = descriptor && descriptor.get
    let hasSetter = descriptor && descriptor.set

    if (!getterVal && hasGetter) {
      parts.push(`${key}: "(...)"`)
      parts.push(`${getKey}: ${stringify(descriptor.get, passOpts)}`)
    } else {
      let val
      try {
        val = topObj[name]
      } catch (e) {
        val = e.message
      }
      parts.push(`${key}: ${stringify(val, passOpts)}`)
    }
    if (hasSetter) {
      parts.push(`${setKey}: ${stringify(descriptor.set, passOpts)}`)
    }
  }

  return json
}

function getKeys(obj) {
  let allKeys = Object.getOwnPropertyNames(obj)
  let keys = Object.keys(obj).sort(sortObjName)

  allKeys = keys.concat(
    filter(allKeys, val => !contain(keys, val)).sort(sortObjName)
  )

  return { keys, allKeys }
}

// $, upperCase, lowerCase, _
function sortObjName(a, b) {
  let lenA = a.length
  let lenB = b.length
  let len = lenA > lenB ? lenB : lenA

  for (let i = 0; i < len; i++) {
    let codeA = a.charCodeAt(i)
    let codeB = b.charCodeAt(i)
    let cmpResult = cmpCode(codeA, codeB)

    if (cmpResult !== 0) return cmpResult
  }

  if (lenA > lenB) return 1
  if (lenA < lenB) return -1

  return 0
}

function cmpCode(a, b) {
  a = transCode(a)
  b = transCode(b)

  if (a > b) return 1
  if (a < b) return -1
  return 0
}

function transCode(code) {
  // _ should be placed after lowercase chars.
  if (code === 95) return 123
  return code
}

let regFnHead = /function(.*?)\((.*?)\)/

function extractFnHead(fn) {
  let str = fn.toString(),
    fnHead = str.match(regFnHead)

  if (fnHead) return fnHead[0]

  return str
}

function getFnAbstract(fn) {
  let fnStr = fn.toString()
  if (fnStr.length > 500) fnStr = fnStr.slice(0, 500) + '...'

  return extractFnHead(fnStr).replace('function', '')
}

function canBeProto(obj) {
  let emptyObj = isEmpty(Object.getOwnPropertyNames(obj))
  let proto = Object.getPrototypeOf(obj)

  return emptyObj && proto && proto !== Object.prototype
}

function getObjAbstract(obj) {
  if (isArr(obj)) return `Array(${obj.length})`
  if (isFn(obj)) return getFnAbstract(obj)
  if (isRegExp(obj)) return obj.toString()

  let type = getType(obj)

  return type.replace(/(\[object )|]/g, '')
}

function getType(obj) {
  let type

  try {
    type = {}.toString.call(obj)
  } catch (e) {
    type = '[object Object]'
  }

  return type
}

class Visitor {
  constructor() {
    this._visited = []
    this._map = {}
  }
  visit(val) {
    /* Add 0 to distinguish stringify generated id from JsonViewer id.
     * When used in web worker, they are not calling the same uniqId method, thus result may be repeated.
     */
    let id = uniqId('erudaJson0')

    this._visited.push({ id, val, abstract: {} })
    this._map[id] = last(this._visited)

    return id
  }
  check(val) {
    let visited = this._visited

    for (let i = 0, len = visited.length; i < len; i++) {
      if (val === visited[i].val) return visited[i]
    }

    return false
  }
  update(id, data) {
    extend(this._map[id], data)
  }
  updateAbstract(id, abstract) {
    this.update(id, { abstract })
  }
}
