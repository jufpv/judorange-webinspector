import { safeStorage, isObj, Emitter, isUndef, each } from './util'

let localStore = {
  _storage: safeStorage('local'),
  get(key) {
    let val = this._storage.getItem(key)

    try {
      val = JSON.parse(val)
      /* eslint-disable no-empty */
    } catch (e) {}

    return val
  },
  set(key, val) {
    if (isObj(val)) val = JSON.stringify(val)

    this._storage.setItem(key, val)

    return this
  },
  remove(key) {
    this._storage.removeItem(key)

    return this
  }
}

export default class Storage extends Emitter {
  constructor(name) {
    super()
    this._name = name
    this._val = localStore.get(name)
    if (!this._val || !isObj(this._val)) this._val = {}
  }
  save() {
    localStore.set(this._name, this._val)

    return this
  }
  get(key) {
    if (isUndef(key)) return this._val

    return this._val[key]
  }
  set(key, val) {
    let kv

    if (isObj(key)) {
      kv = key
    } else {
      kv = {}
      kv[key] = val
    }

    each(kv, (val, key) => {
      let preVal = this._val[key]
      this._val[key] = val
      if (preVal !== val) this.emit('change', key, val)
    })

    return this.save()
  }
}
