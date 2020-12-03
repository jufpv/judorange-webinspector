import { last } from '../lib/util'

export function getType(contentType) {
  if (!contentType) return 'unknown'

  let type = contentType.split(';')[0].split('/')

  return {
    type: type[0],
    subType: last(type)
  }
}

export function lenToUtf8Bytes(str) {
  let m = encodeURIComponent(str).match(/%[89ABab]/g)

  return str.length + (m ? m.length : 0)
}
