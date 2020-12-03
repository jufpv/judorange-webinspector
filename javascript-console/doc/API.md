# Api

## init

Initialize eruda.

### Options

|Name             |Type        |Desc                                                                                     |
|-----------------|------------|-----------------------------------------------------------------------------------------|
|container        |element     |Container element. If not set, it will append an element directly under html root element|
|tool             |string array|Choose which default tools you want, by default all will be added                        |
|autoScale=true   |boolean     |Auto scale eruda for different viewport settings                                         |
|useShadowDom=true|boolean     |Use shadow dom for css encapsulation                                                     |

```javascript
let el = document.createElement('div');
document.body.appendChild(el);

eruda.init({
    container: el,
    tool: ['console', 'elements'],
    useShadowDom: true,
    autoScale: true
});
```

## destroy

Destory eruda. 

Note: You can call **init** method again after destruction.

```javascript
eruda.destroy();
```

## scale

Set or get scale.

```javascript
eruda.scale(); // -> 1
eruda.scale(1.5);
```

## position

Set or get entry button position.

It will not take effect if given pos is out of range.

```javascript
eruda.position({x: 20, y: 20});
eruda.position(); // -> {x: 20, y: 20}
```

## get

Get tool, eg. console, elements panels.

```javascript
let console = eruda.get('console');
console.log('eruda');
```

## add

Add tool.

```javascript
eruda.add(eruda.Tool.extend({
    name: 'test'
}));
```

## remove

Remove tool.

```javascript
eruda.remove('console');
```

## show

Show eruda panel.

```javascript
eruda.show();
eruda.show('console');
```

## hide

Hide eruda panel.

```javascript
eruda.hide();
```