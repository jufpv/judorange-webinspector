# Tool Api

Each default tool provided by eruda can be accessed by `eruda.get('Tool Name')`.

## Console

Display console logs. Implementation detail follows the [console api spec](https://console.spec.whatwg.org/).

### Config

|Name               |Type   |Desc                           |
|-------------------|-------|-------------------------------|
|catchGlobalErr     |boolean|Catch global errors            |
|overrideConsole    |boolean|Override console               |
|displayExtraInfo   |boolean|Display extra information      |
|displayUnenumerable|boolean|Display unenumerable properties|
|displayGetterVal   |boolean|Access getter value            |
|lazyEvaluation     |boolean|Stringify object when clicked  |
|viewLogInSources   |boolean|View log in sources panel      |
|displayIfErr       |boolean|Auto display if error occurs   |
|useWorker          |boolean|Use web worker                 |
|maxLogNum          |string |Max log number                 |

```javascript
let console = eruda.get('console');
console.config.set('catchGlobalErr', true);
```

### log, error, info, warn, dir, time/timeEnd, clear, count, assert, table

All these methods can be used in the same way as window.console object. 

Note: When called, a corresponding event is triggered.

```javascript
let console = eruda.get('console');
console.log('eruda is a console for %s.', 'mobile browsers');
console.table([{test: 1}, {test: 2}, {test2: 3}], 'test');
console.error(new Error('eruda'));
console.on('log', function () 
{
    // Do whatever you want, send to server or save on local storage.
});
```

### filter

Filter logs.

|Name  |Type                  |Desc         |
|------|----------------------|-------------|
|filter|string regexp function|Custom filter|

```javascript
console.filter('all'); // String parameter. Log, warn, debug, error is also supported.
console.filter(/^eruda/);
console.filter(function (log)
{
    return log.type === 'error';
});
```

### html

Log out html content.

|Name|Type  |Desc       |
|----|------|-----------|
|html|string|Html string|

```javascript
console.html('<span style="color:red">Red</span>');
```

## Elements

Check dom element status.

### Config

|Name               |Type   |Desc                 |
|-------------------|-------|---------------------|
|overrideEventTarget|boolean|Catch Event Listeners|
|observeElement     |boolean|Auto Refresh         |

### set

Set dom element to show.

|Name|Type   |Desc              |
|----|-------|------------------|
|el  |element|Element to display|

```javascript
elements.set(document.body);
```

## Network

Display requests.

### Config

|Name         |Type   |Desc                |
|-------------|-------|--------------------|
|overrideFetch|boolean|Catch Fetch Requests|

### clear

Clear requests.

```javascript
network.clear();
```

## Resources

LocalStorage, sessionStorage, cookies, scripts, styleSheets and images.

### Config

|Name            |Type   |Desc                 |
|----------------|-------|---------------------|
|hideErudaSetting|boolean|Hide Eruda Setting   |
|observeElement  |boolean|Auto Refresh Elements|

## Sources

View json, html, js, css and http request detail.

### Config

|Name       |Type   |Desc             |
|-----------|-------|-----------------|
|showLineNum|boolean|Show Line Numbers|
|formatCode |boolean|Beautify Code    |

## Info

Display special information, could be used for displaying user info to track
user logs.

By default, page url and browser user agent is shown.

### clear

Clear infos.

### add

Add info.

|Name   |Type           |Desc        |
|-------|---------------|------------|
|name   |string         |Info name   |
|content|string function|Info content|

```javascript
info.add('title', 'content');
info.add('location', () => location.href);
```

### get

Get info or infos.

|Name  |Type           |Desc        |
|------|---------------|------------|
|name  |string         |Info name   |
|return|string function|Info content|

```javascript
info.add('title', 'content')
info.get(); // -> [{name: 'title', val: 'content'}]
info.get('title') // -> 'content'
```

### remove

Remove specified info.

|Name|Type  |Desc     |
|----|------|---------|
|name|string|Info name|

```javascript
info.remove('title');
```

## Snippets

Allow you to register small functions that can be triggered multiple times.

### clear

Clear snippets.

### add

Add snippet.

|Name|Type    |Desc                    |
|----|--------|------------------------|
|name|string  |Snippet name            |
|fn  |function|Function to be triggered|
|desc|string  |Snippet description     |

### remove

Remove specified snippet.

|Name|Type  |Desc             |
|----|------|-----------------|
|name|string|Snippet to remove|

### run

Run specified snippet.

|Name|Type  |Desc          |
|----|------|--------------|
|name|string|Snippet to run|

```javascript
snippets.add('hello', function ()
{
    console.log('Hello World!');
}, 'Display hello on console');

snippets.run('hello');
snippets.remove('hello');
```

## Settings

Customization for all tools.

### clear

Clear settings.

### remove

Remove setting.

|Name|Type  |Desc         |
|----|------|-------------|
|cfg |object|Config object|
|name|string|Option name  |

### text

Add text.

|Name|Type  |Desc             |
|----|------|-----------------|
|str |string|String to display|

### switch

Add switch to toggle a boolean value.

|Name|Type  |Desc                                   |
|----|------|---------------------------------------|
|cfg |object|Config object created by util.createCfg|
|name|string|Option name                            |
|desc|string|Option description                     |

### select

Add select to select a number of string values.

|Name  |Type  |Desc                      |
|------|------|--------------------------|
|cfg   |object|Config object             |
|name  |string|Option name               |
|desc  |string|Option description        |
|values|array |Array of strings to select|

### range

Add range to input a number.

|Name  |Type  |Desc              |
|------|------|------------------|
|cfg   |object|Config object     |
|name  |string|Option name       |
|desc  |string|Option description|
|option|object|Min, max, step    |

### color

Add color to select a color.

|Name   |Type  |Desc              |
|-------|------|------------------|
|cfg    |object|Config object     |
|name   |string|Option name       |
|desc   |string|Option description|
|[color]|array |Color list        |

### separator

Add a separator.

```javascript
let cfg = eruda.util.createCfg('test');

cfg.set(eruda.util.defaults(cfg.get(), {
    testBool: true,
    testSelect: 'select1',
    testRange: 1
}));

settings.text('Test')
        .switch(cfg, 'testBool', 'Test Bool')
        .select(cfg, 'testSelect', 'Test Select', ['select1', 'select2'])
        .range(cfg, 'testRange', 'Test Range', {min: 0, max: 1, step: 0.1})
        .separator();

settings.remove(cfg, 'testBool')        
```
