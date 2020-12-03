import { getType, lenToUtf8Bytes } from './util'
import {
  Emitter,
  fullUrl,
  uniqId,
  isStr,
  getFileName,
  now,
  toNum,
  fileSize
} from '../lib/util'

export default class FetchRequest extends Emitter {
  constructor(url, options = {}) {
    super()

    if (url instanceof window.Request) url = url.url

    this._url = fullUrl(url)
    this._id = uniqId('request')
    this._options = options
    this._method = options.method || 'GET'
  }
  send(fetchResult) {
    let options = this._options

    let data = isStr(options.body) ? options.body : ''

    this._fetch = fetchResult
    this.emit('send', this._id, {
      name: getFileName(this._url),
      url: this._url,
      data,
      method: this._method
    })

    fetchResult.then(res => {
      res = res.clone()

      let type = getType(res.headers.get('Content-Type'))

      res.text().then(resTxt => {
        this.emit('update', this._id, {
          type: type.type,
          subType: type.subType,
          time: now(),
          size: getSize(res, resTxt),
          resTxt: resTxt,
          resHeaders: getHeaders(res),
          status: res.status,
          done: true
        })
      })

      return res
    })
  }
}

function getSize(res, resTxt) {
  let size = 0

  let contentLen = res.headers.get('Content-length')

  if (contentLen) {
    size = toNum(contentLen)
  } else {
    size = lenToUtf8Bytes(resTxt)
  }

  return `${fileSize(size)}B`
}

function getHeaders(res) {
  let ret = {}

  res.headers.forEach((val, key) => (ret[key] = val))

  return ret
}
