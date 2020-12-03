import { each } from '../lib/util'

// https://github.com/trentrichardson/jQuery-Litelighter
export default function highlight(str, lang) {
  lang = lang || 'js'

  str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  lang = language[lang]

  let subLangSi = 0,
    subLangs = []

  each(lang, val => {
    if (!val.language) return

    str = str.replace(val.re, function($1, $2) {
      subLangs[subLangSi++] = highlight($2, val.language)
      return $1.replace($2, '___subtmpl' + (subLangSi - 1) + '___')
    })
  })

  each(lang, (val, key) => {
    if (language[val.language]) return

    str = str.replace(val.re, '___' + key + '___$1___end' + key + '___')
  })

  let levels = []

  str = str.replace(/___(?!subtmpl)\w+?___/g, function($0) {
    let end = $0.substr(3, 3) === 'end',
      tag = (!end ? $0.substr(3) : $0.substr(6)).replace(/_/g, ''),
      lastTag = levels.length > 0 ? levels[levels.length - 1] : null

    if (
      !end &&
      (lastTag == null ||
        tag == lastTag ||
        (lastTag != null &&
          lang[lastTag] &&
          lang[lastTag].embed != undefined &&
          lang[lastTag].embed.indexOf(tag) > -1))
    ) {
      levels.push(tag)

      return $0
    } else if (end && tag == lastTag) {
      levels.pop()

      return $0
    }

    return ''
  })

  each(lang, (val, key) => {
    str = str
      .replace(new RegExp('___end' + key + '___', 'g'), '</span>')
      .replace(
        new RegExp('___' + key + '___', 'g'),
        '<span style="' + style[val.style] + '">'
      )
  })

  each(lang, val => {
    if (!val.language) return

    str = str.replace(/___subtmpl\d+___/g, function($tmpl) {
      let i = parseInt($tmpl.replace(/___subtmpl(\d+)___/, '$1'), 10)

      return subLangs[i]
    })
  })

  return str
}

let style = {
  comment: 'color:#63a35c;',
  string: 'color:#183691;',
  number: 'color:#0086b3;',
  keyword: 'color:#a71d5d;',
  operators: 'color:#a71d5d;'
}

let language = {}

language.js = {
  comment: { re: /(\/\/.*|\/\*([\s\S]*?)\*\/)/g, style: 'comment' },
  string: { re: /(('.*?')|(".*?"))/g, style: 'string' },
  numbers: { re: /(-?(\d+|\d+\.\d+|\.\d+))/g, style: 'number' },
  keywords: {
    re: /(?:\b)(function|for|foreach|while|if|else|elseif|switch|break|as|return|this|class|self|default|var|false|true|null|undefined)(?:\b)/gi,
    style: 'keyword'
  },
  operators: {
    re: /(\+|-|\/|\*|%|=|&lt;|&gt;|\||\?|\.)/g,
    style: 'operators'
  }
}

language.html = {
  comment: { re: /(&lt;!--([\s\S]*?)--&gt;)/g, style: 'comment' },
  tag: {
    re: /(&lt;\/?\w(.|\n)*?\/?&gt;)/g,
    style: 'keyword',
    embed: ['string']
  },
  string: language.js.string,
  css: {
    re: /(?:&lt;style.*?&gt;)([\s\S]*)?(?:&lt;\/style&gt;)/gi,
    language: 'css'
  },
  script: {
    re: /(?:&lt;script.*?&gt;)([\s\S]*?)(?:&lt;\/script&gt;)/gi,
    language: 'js'
  }
}

language.css = {
  comment: language.js.comment,
  string: language.js.string,
  numbers: {
    re: /((-?(\d+|\d+\.\d+|\.\d+)(%|px|em|pt|in)?)|#[0-9a-fA-F]{3}[0-9a-fA-F]{3})/g,
    style: 'number'
  },
  keywords: { re: /(@\w+|:?:\w+|[a-z-]+:)/g, style: 'keyword' }
}
