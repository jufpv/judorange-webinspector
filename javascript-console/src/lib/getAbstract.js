// Simple version for stringify, used for displaying object abstract.
import {
  escape,
  toStr,
  contain,
  startWith,
  escapeJsonStr,
  each,
  getObjType,
  endWith,
  isEmpty
} from './util'

// Modified from: https://jsconsole.com/
export default function getAbstract(
  obj,
  { topObj, level = 0, getterVal = false, unenumerable = true } = {}
) {
  let json = ''
  let type = ''
  let keyNum = 5
  let parts = []
  let names = []
  let objEllipsis = ''
  let circular = false
  let i

  topObj = topObj || obj

  let passOpts = { getterVal, unenumerable, level: level + 1 }
  let doStringify = level === 0

  let keyWrapper = '<span style="color: #a71d5d;">'
  let numWrapper = '<span style="color: #0086b3;">'
  let nullWrapper = '<span style="color: #0086b3;">'
  let strWrapper = '<span style="color: #183691;">'
  let boolWrapper = '<span style="color: #0086b3;">'
  let specialWrapper = '<span style="color: #707d8b;">'
  let strEscape = str =>
    escape(str)
      .replace(/\\n/g, '↵')
      .replace(/\\f|\\r|\\t/g, '')
      .replace(/\\/g, '')
  let wrapperEnd = '</span>'

  let wrapKey = key => keyWrapper + strEscape(key) + wrapperEnd
  let wrapNum = num => numWrapper + num + wrapperEnd
  let wrapRegExp = str => strWrapper + str + wrapperEnd
  let wrapBool = bool => boolWrapper + bool + wrapperEnd
  let wrapNull = str => nullWrapper + str + wrapperEnd

  function wrapStr(str) {
    str = toStr(str)

    if (contain(SPECIAL_VAL, str) || startWith(str, 'Array[')) {
      return specialWrapper + strEscape(str) + wrapperEnd
    }

    return strWrapper + strEscape(`"${str}"`) + wrapperEnd
  }

  function objIteratee(name) {
    if (i > keyNum) {
      objEllipsis = ', …'
      return
    }
    let key = wrapKey(escapeJsonStr(name))

    if (!getterVal) {
      let descriptor = Object.getOwnPropertyDescriptor(obj, name)
      if (descriptor.get) {
        parts.push(`${key}: ${wrapStr('(...)')}`)
        i++
        return
      }
    }
    parts.push(`${key}: ${getAbstract(topObj[name], passOpts)}`)
    i++
  }

  try {
    type = {}.toString.call(obj)
  } catch (e) {
    type = '[object Object]'
  }

  let isStr = type == '[object String]'
  let isArr = type == '[object Array]'
  let isObj = type == '[object Object]'
  let isNum = type == '[object Number]'
  let isRegExp = type == '[object RegExp]'
  let isSymbol = type == '[object Symbol]'
  let isFn = type == '[object Function]'
  let isBool = type == '[object Boolean]'

  if (circular) {
    json = wrapStr('[circular]')
  } else if (isStr) {
    json = wrapStr(escapeJsonStr(obj))
  } else if (isRegExp) {
    json = wrapRegExp(escapeJsonStr(obj.toString()))
  } else if (isFn) {
    json = wrapStr('function')
  } else if (isArr) {
    if (doStringify) {
      json = '['
      let len = obj.length
      let arrEllipsis = ''

      if (len > 100) {
        len = 100
        arrEllipsis = ', …'
      }
      for (let i = 0; i < len; i++) {
        parts.push(`${getAbstract(obj[i], passOpts)}`)
      }
      json += parts.join(', ') + arrEllipsis + ']'
    } else {
      json = `Array(${obj.length})`
    }
  } else if (isObj) {
    if (canBeProto(obj)) {
      obj = Object.getPrototypeOf(obj)
    }

    names = unenumerable ? Object.getOwnPropertyNames(obj) : Object.keys(obj)
    if (doStringify) {
      i = 1
      json = '{ '
      each(names, objIteratee)
      json += parts.join(', ') + objEllipsis + ' }'
    } else {
      json = getObjType(obj)
      if (json === 'Object') json = '{…}'
    }
  } else if (isNum) {
    json = obj + ''
    if (endWith(json, 'Infinity') || json === 'NaN') {
      json = `"${json}"`
    } else {
      json = wrapNum(json)
    }
  } else if (isBool) {
    json = wrapBool(obj ? 'true' : 'false')
  } else if (obj === null) {
    json = wrapNull('null')
  } else if (isSymbol) {
    json = wrapStr('Symbol')
  } else if (obj === undefined) {
    json = wrapStr('undefined')
  } else {
    try {
      if (canBeProto(obj)) {
        obj = Object.getPrototypeOf(obj)
      }

      if (doStringify) {
        i = 1
        json = '{ '
        names = unenumerable
          ? Object.getOwnPropertyNames(obj)
          : Object.keys(obj)
        each(names, objIteratee)
        json += parts.join(', ') + objEllipsis + ' }'
      } else {
        json = getObjType(obj)
        if (json === 'Object') json = '{…}'
      }
    } catch (e) {
      json = wrapStr(obj)
    }
  }

  return json
}

const SPECIAL_VAL = ['(...)', 'undefined', 'Symbol', 'Object', 'function']

function canBeProto(obj) {
  let emptyObj = isEmpty(Object.getOwnPropertyNames(obj))
  let proto = Object.getPrototypeOf(obj)

  return emptyObj && proto && proto !== Object.prototype
}
