import {
  evalCss,
  $,
  isStr,
  startWith,
  trim,
  isArr,
  contain,
  isObj,
  uniqId,
  upperFirst,
  isNum,
  toNum,
  isBool,
  escape,
  toStr,
  chunk,
  each,
  map,
  isNaN
} from './util'

export default class JsonViewer {
  constructor(data, $el) {
    evalCss(require('./json.scss'))

    this._data = [data]
    this._data.erudaId = uniqId('erudaJson')
    this._$el = $el
    this._map = {}
    createMap(this._map, this._data)

    this._appendTpl()
    this._bindEvent()
  }
  jsonToHtml(data, firstLevel) {
    let ret = ''

    for (let key in data) {
      let val = data[key]

      if (
        key === 'erudaObjAbstract' ||
        key === 'erudaCircular' ||
        key === 'erudaId' ||
        key === 'erudaSplitArr' ||
        (isStr(val) && startWith(val, 'erudaJson'))
      )
        continue

      if (Object.hasOwnProperty.call(data, key))
        ret += this.createEl(key, val, firstLevel)
    }

    return ret
  }
  createEl(key, val, firstLevel = false) {
    let type = 'object',
      isUnenumerable = false,
      id

    if (key === 'erudaProto') key = '__proto__'
    if (startWith(key, 'erudaUnenumerable')) {
      key = trim(key.replace('erudaUnenumerable', ''))
      isUnenumerable = true
    }

    if (isArr(val)) type = 'array'

    function wrapKey(key) {
      if (firstLevel) return ''
      if (isObj(val) && val.erudaSplitArr) return ''

      let keyClass = 'eruda-key'
      if (isUnenumerable || contain(LIGHTER_KEY, key))
        keyClass = 'eruda-key-lighter'

      return `<span class="${keyClass}">${encode(key)}</span>: `
    }

    if (val === null) {
      return `<li>
                        ${wrapKey(key)}
                        <span class="eruda-null">null</span>
                    </li>`
    }

    if (isObj(val)) {
      id = val.erudaId
      let circularId = val.erudaCircular
      let objAbstract = val['erudaObjAbstract'] || upperFirst(type)

      let obj = `<li ${
        firstLevel ? 'data-first-level="true"' : ''
      } ${'data-object-id="' + (circularId ? circularId : id) + '"'}>
                            <span class="${
                              firstLevel ? '' : 'eruda-expanded eruda-collapsed'
                            }"></span>
                            ${wrapKey(key)}
                            <span class="eruda-open">${
                              firstLevel ? '' : objAbstract
                            }</span>
                            <ul class="eruda-${type}" ${
        firstLevel ? '' : 'style="display:none"'
      }>`

      if (firstLevel) obj += this.jsonToHtml(this._map[id])

      return obj + '</ul><span class="eruda-close"></span></li>'
    }
    if (isNum(val) || isBool(val)) {
      return `<li>
                    ${wrapKey(key)}
                    <span class="eruda-${typeof val}">${encode(val)}</span>
                    </li>`
    }
    if (isStr(val) && startWith(val, 'function')) {
      return `<li>
                    ${wrapKey(key)}
                    <span class="eruda-function">${encode(val).replace(
                      'function',
                      ''
                    )}</span>
                    </li>`
    }
    if (val === 'undefined' || val === 'Symbol' || val === '(...)') {
      return `<li>
                    ${wrapKey(key)}
                    <span class="eruda-special">${val}</span>
                    </li>`
    }

    return `<li>
                    ${wrapKey(key)}
                    <span class="eruda-${typeof val}">"${encode(val)}"</span>
                </li>`
  }
  _appendTpl() {
    let data = this._map[this._data.erudaId]

    this._$el.html(this.jsonToHtml(data, true))
  }
  _bindEvent() {
    let map = this._map

    let self = this

    this._$el.on('click', 'li', function(e) {
      let $this = $(this),
        circularId = $this.data('object-id'),
        $firstSpan = $(this)
          .find('span')
          .eq(0)

      if ($this.data('first-level')) return
      if (circularId) {
        $this.find('ul').html(self.jsonToHtml(map[circularId], false))
        $this.rmAttr('data-object-id')
      }

      e.stopImmediatePropagation()

      if (!$firstSpan.hasClass('eruda-expanded')) return

      let $ul = $this.find('ul').eq(0)
      if ($firstSpan.hasClass('eruda-collapsed')) {
        $firstSpan.rmClass('eruda-collapsed')
        $ul.show()
      } else {
        $firstSpan.addClass('eruda-collapsed')
        $ul.hide()
      }
    })
  }
}

function createMap(map, data) {
  let id

  if (data.erudaId) {
    id = data.erudaId
  } else {
    id = uniqId('erudaJson')
    data.erudaId = id
  }

  if (id) {
    let objAbstract = data.erudaObjAbstract

    let isArr = objAbstract && startWith(objAbstract, 'Array')
    if (isArr) {
      let arr = objToArr(data)
      if (arr.length > 100) data = splitBigArr(objToArr(data), id)
    }
    map[id] = data
  }

  for (let key in data) {
    let val = data[key]
    if (isObj(val)) createMap(map, val)
  }
}

function splitBigArr(val, id) {
  let ret = chunk(val, 100)
  let idx = 0
  ret = map(ret, val => {
    let obj = {}
    let startIdx = idx
    obj.erudaObjAbstract = '[' + startIdx
    each(val, val => {
      obj[idx] = val
      idx += 1
    })
    let endIdx = idx - 1
    obj.erudaObjAbstract += (endIdx - startIdx > 0 ? ' … ' + endIdx : '') + ']'
    obj.erudaId = uniqId('erudaJson')
    obj.erudaSplitArr = true
    return obj
  })
  each(val.erudaStrKeys, (val, key) => (ret[key] = val))
  ret.erudaId = id

  return ret
}

function objToArr(val) {
  let ret = []

  let strKeys = {}

  each(val, (val, key) => {
    let idx = toNum(key)
    if (!isNaN(idx)) {
      ret[idx] = val
    } else {
      strKeys[key] = val
    }
  })

  ret['erudaStrKeys'] = strKeys

  return ret
}

const LIGHTER_KEY = ['__proto__']

let encode = str =>
  escape(toStr(str))
    .replace(/\n/g, '↵')
    .replace(/\f|\r|\t/g, '')
