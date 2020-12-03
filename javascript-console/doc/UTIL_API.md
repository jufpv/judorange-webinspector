# Eruda Util Documentation

## $ 

jQuery like style dom manipulator.

### Available methods

offset, hide, show, first, last, get, eq, on, off, html, text, val, css, attr,
data, rmAttr, remove, addClass, rmClass, toggleClass, hasClass, append, prepend,
before, after

```javascript
var $btn = $('#btn');
$btn.html('eustia');
$btn.addClass('btn');
$btn.show();
$btn.on('click', function ()
{
    // Do something...
});
```

## $attr 

Element attribute manipulation.

Get the value of an attribute for the first element in the set of matched elements.

|Name   |Type                |Desc                            |
|-------|--------------------|--------------------------------|
|element|string array element|Elements to manipulate          |
|name   |string              |Attribute name                  |
|return |string              |Attribute value of first element|

Set one or more attributes for the set of matched elements.

|Name   |Type                |Desc                  |
|-------|--------------------|----------------------|
|element|string array element|Elements to manipulate|
|name   |string              |Attribute name        |
|value  |string              |Attribute value       |

|Name      |Type                |Desc                                  |
|----------|--------------------|--------------------------------------|
|element   |string array element|Elements to manipulate                |
|attributes|object              |Object of attribute-value pairs to set|

### remove

Remove an attribute from each element in the set of matched elements.

|Name   |Type                |Desc                  |
|-------|--------------------|----------------------|
|element|string array element|Elements to manipulate|
|name   |string              |Attribute name        |

```javascript
$attr('#test', 'attr1', 'test');
$attr('#test', 'attr1'); // -> test
$attr.remove('#test', 'attr1');
$attr('#test', {
    'attr1': 'test',
    'attr2': 'test'
});
```

## $class 

Element class manipulations.

### add

Add the specified class(es) to each element in the set of matched elements.

|Name   |Type                |Desc                  |
|-------|--------------------|----------------------|
|element|string array element|Elements to manipulate|
|names  |string array        |Classes to add        |

### has

Determine whether any of the matched elements are assigned the given class.

|Name   |Type                |Desc                                 |
|-------|--------------------|-------------------------------------|
|element|string array element|Elements to manipulate               |
|name   |string              |Class name                           |
|return |boolean             |True if elements has given class name|

### toggle

Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.

|Name   |Type                |Desc                  |
|-------|--------------------|----------------------|
|element|string array element|Elements to manipulate|
|name   |string              |Class name to toggle  |

### remove

Remove a single class, multiple classes, or all classes from each element in the set of matched elements.

|Name   |Type                |Desc                  |
|-------|--------------------|----------------------|
|element|string array element|Elements to manipulate|
|names  |string              |Class names to remove |

```javascript
$class.add('#test', 'class1');
$class.add('#test', ['class1', 'class2']);
$class.has('#test', 'class1'); // -> true
$class.remove('#test', 'class1');
$class.has('#test', 'class1'); // -> false
$class.toggle('#test', 'class1');
$class.has('#test', 'class1'); // -> true
```

## $css 

Element css manipulation.

Get the computed style properties for the first element in the set of matched elements.

|Name   |Type                |Desc                      |
|-------|--------------------|--------------------------|
|element|string array element|Elements to manipulate    |
|name   |string              |Property name             |
|return |string              |Css value of first element|

Set one or more CSS properties for the set of matched elements.

|Name   |Type                |Desc                  |
|-------|--------------------|----------------------|
|element|string array element|Elements to manipulate|
|name   |string              |Property name         |
|value  |string              |Css value             |

|Name      |Type                |Desc                            |
|----------|--------------------|--------------------------------|
|element   |string array element|Elements to manipulate          |
|properties|object              |Object of css-value pairs to set|

```javascript
$css('#test', {
    'color': '#fff',
    'background': 'black'
});
$css('#test', 'display', 'block');
$css('#test', 'color'); // -> #fff
```

## $data 

Wrapper of $attr, adds data- prefix to keys.

```javascript
$data('#test', 'attr1', 'eustia');
```

## $event 

bind events to certain dom elements.

```javascript
function clickHandler()
{
    // Do something...
}
$event.on('#test', 'click', clickHandler);
$event.off('#test', 'click', clickHandler);
```

## $insert 

Insert html on different position.

### before

Insert content before elements.

### after

Insert content after elements.

### prepend

Insert content to the beginning of elements.

### append

Insert content to the end of elements.

|Name   |Type                |Desc                  |
|-------|--------------------|----------------------|
|element|string array element|Elements to manipulate|
|content|string              |Html strings          |

```javascript
// <div id="test"><div class="mark"></div></div>
$insert.before('#test', '<div>licia</div>');
// -> <div>licia</div><div id="test"><div class="mark"></div></div>
$insert.after('#test', '<div>licia</div>');
// -> <div id="test"><div class="mark"></div></div><div>licia</div>
$insert.prepend('#test', '<div>licia</div>');
// -> <div id="test"><div>licia</div><div class="mark"></div></div>
$insert.append('#test', '<div>licia</div>');
// -> <div id="test"><div class="mark"></div><div>licia</div></div>
```

## $offset 

Get the position of the element in document.

|Name   |Type                |Desc                  |
|-------|--------------------|----------------------|
|element|string array element|Elements to get offset|

```javascript
$offset('#test'); // -> {left: 0, top: 0, width: 0, height: 0}
```

## $property 

Element property html, text, val getter and setter.

### html

Get the HTML contents of the first element in the set of matched elements or
set the HTML contents of every matched element.

### text

Get the combined text contents of each element in the set of matched
elements, including their descendants, or set the text contents of the
matched elements.

### val

Get the current value of the first element in the set of matched elements or
set the value of every matched element.

```javascript
$property.html('#test', 'licia');
$property.html('#test'); // -> licia
```

## $remove 

Remove the set of matched elements from the DOM.

|Name   |Type                |Desc              |
|-------|--------------------|------------------|
|element|string array element|Elements to delete|

```javascript
$remove('#test');
```

## $safeEls 

Convert value into an array, if it's a string, do querySelector.

|Name  |Type                |Desc             |
|------|--------------------|-----------------|
|value |element array string|Value to convert |
|return|array               |Array of elements|

```javascript
$safeEls('.test'); // -> Array of elements with test class
```

## $show 

Show elements.

|Name   |Type                |Desc            |
|-------|--------------------|----------------|
|element|string array element|Elements to show|

```javascript
$show('#test');
```

## Class 

Create JavaScript class.

|Name     |Type    |Desc                             |
|---------|--------|---------------------------------|
|methods  |object  |Public methods                   |
|[statics]|object  |Static methods                   |
|return   |function|Function used to create instances|

```javascript
var People = Class({
    initialize: function People(name, age)
    {
        this.name = name;
        this.age = age;
    },
    introduce: function ()
    {
        return 'I am ' + this.name + ', ' + this.age + ' years old.';
    }
});

var Student = People.extend({
    initialize: function Student(name, age, school)
    {
        this.callSuper(People, 'initialize', arguments);

        this.school = school;
    },
    introduce: function ()
    {
        return this.callSuper(People, 'introduce') + '\n I study at ' + this.school + '.';
    }
}, {
    is: function (obj)
    {
        return obj instanceof Student;
    }
});

var a = new Student('allen', 17, 'Hogwarts');
a.introduce(); // -> 'I am allen, 17 years old. \n I study at Hogwarts.'
Student.is(a); // -> true
```

## Emitter 

Event emitter class which provides observer pattern.

### on

Bind event.

### off

Unbind event.

### once

Bind event that trigger once.

|Name    |Type    |Desc          |
|--------|--------|--------------|
|event   |string  |Event name    |
|listener|function|Event listener|

### emit

Emit event.

|Name   |Type  |Desc                        |
|-------|------|----------------------------|
|event  |string|Event name                  |
|...args|*     |Arguments passed to listener|

### mixin

[static] Mixin object class methods.

|Name|Type  |Desc           |
|----|------|---------------|
|obj |object|Object to mixin|

```javascript
var event = new Emitter();
event.on('test', function () { console.log('test') });
event.emit('test'); // Logs out 'test'.
Emitter.mixin({});
```

## Enum 

Enum type implementation.

### constructor

|Name|Type |Desc            |
|----|-----|----------------|
|arr |array|Array of strings|

|Name|Type  |Desc                  |
|----|------|----------------------|
|obj |object|Pairs of key and value|

```javascript
var importance = new Enum([
    'NONE', 'TRIVIAL', 'REGULAR', 'IMPORTANT', 'CRITICAL'
]);

if (val === importance.CRITICAL)
{
    // Do something.
}
```

## LocalStore 

LocalStorage wrapper.

Extend from Store.

### constructor

|Name|Type  |Desc                  |
|----|------|----------------------|
|name|string|LocalStorage item name|
|data|object|Default data          |

```javascript
var store = new LocalStore('licia');
store.set('name', 'licia');
```

## Logger 

Simple logger with level filter.

### constructor

|Name         |Type  |Desc        |
|-------------|------|------------|
|name         |string|Logger name |
|[level=DEBUG]|number|Logger level|

### setLevel

|Name |Type         |Desc        |
|-----|-------------|------------|
|level|number string|Logger level|

### getLevel

Get current level.

### trace, debug, info, warn, error

Logging methods.

### Log Levels

TRACE, DEBUG, INFO, WARN, ERROR and SILENT.

```javascript
var logger = new Logger('licia', Logger.level.ERROR);
logger.trace('test');

// Format output.
logger.formatter = function (type, argList)
{
    argList.push(new Date().getTime());

    return argList;
};

logger.on('all', function (type, argList)
{
    // It's not affected by log level.
});

logger.on('debug', function (argList)
{
    // Affected by log level.
});
```

## MutationObserver 

Safe MutationObserver, does nothing if MutationObserver is not supported.

```javascript
var observer = new MutationObserver(function (mutations)
{
    // Do something.
});
observer.observe(document.htmlElement);
observer.disconnect();
```

## Select 

Simple wrapper of querySelectorAll to make dom selection easier.

### constructor

|Name    |Type  |Desc               |
|--------|------|-------------------|
|selector|string|Dom selector string|

### find

Get desdendants of current matched elements.

|Name    |Type  |Desc               |
|--------|------|-------------------|
|selector|string|Dom selector string|

### each

Iterate over matched elements.

|Name|Type    |Desc                                |
|----|--------|------------------------------------|
|fn  |function|Function to execute for each element|

```javascript
var $test = new Select('#test');
$test.find('.test').each(function (idx, element)
{
    // Manipulate dom nodes
});
```

## Store 

Memory storage.

Extend from Emitter.

### constructor

|Name|Type  |Desc        |
|----|------|------------|
|data|object|Initial data|

### set

Set value.

|Name|Type  |Desc        |
|----|------|------------|
|key |string|Value key   |
|val |*     |Value to set|

Set values.

|Name|Type  |Desc           |
|----|------|---------------|
|vals|object|Key value pairs|

This emit a change event whenever is called.

### get

Get value.

|Name  |Type  |Desc              |
|------|------|------------------|
|key   |string|Value key         |
|return|*     |Value of given key|

Get values.

|Name  |Type  |Desc           |
|------|------|---------------|
|keys  |array |Array of keys  |
|return|object|Key value pairs|

### remove

Remove value.

|Name|Type        |Desc         |
|----|------------|-------------|
|key |string array|Key to remove|

### clear

Clear all data.

### each

Iterate over values.

|Name|Type    |Desc                           |
|----|--------|-------------------------------|
|fn  |function|Function invoked per interation|

```javascript
var store = new Store('test');
store.set('user', {name: 'licia'});
store.get('user').name; // -> 'licia'
store.clear();
store.each(function (val, key)
{
    // Do something.
});
store.on('change', function (key, newVal, oldVal)
{
    // It triggers whenever set is called.
});
```

## Url 

Simple url manipulator.

### constructor

|Name        |Type  |Desc      |
|------------|------|----------|
|url=location|string|Url string|

### setQuery

Set query value.

|Name  |Type  |Desc       |
|------|------|-----------|
|name  |string|Query name |
|value |string|Query value|
|return|Url   |this       |

|Name  |Type  |Desc        |
|------|------|------------|
|names |object|query object|
|return|Url   |this        |

### rmQuery

Remove query value.

|Name  |Type        |Desc      |
|------|------------|----------|
|name  |string array|Query name|
|return|Url         |this      |

### parse

[static] Parse url into an object.

|Name  |Type  |Desc      |
|------|------|----------|
|url   |string|Url string|
|return|object|Url object|

### stringify

[static] Stringify url object into a string.

|Name  |Type  |Desc      |
|------|------|----------|
|url   |object|Url object|
|return|string|Url string|

An url object contains the following properties:

|Name    |Desc                                                                                  |
|--------|--------------------------------------------------------------------------------------|
|protocol|The protocol scheme of the URL (e.g. http:)                                           |
|slashes |A boolean which indicates whether the protocol is followed by two forward slashes (//)|
|auth    |Authentication information portion (e.g. username:password)                           |
|hostname|Host name without port number                                                         |
|port    |Optional port number                                                                  |
|pathname|URL path                                                                              |
|query   |Parsed object containing query string                                                 |
|hash    |The "fragment" portion of the URL including the pound-sign (#)                        |

```javascript
var url = new Url('http://example.com:8080?eruda=true');
console.log(url.port); // -> '8080'
url.query.foo = 'bar';
url.rmQuery('eruda');
utl.toString(); // -> 'http://example.com:8080/?foo=bar'
```

## ajax 

Perform an asynchronous HTTP request.

|Name   |Type  |Desc        |
|-------|------|------------|
|options|object|Ajax options|

Available options:

|Name                                         |Type         |Desc                       |
|---------------------------------------------|-------------|---------------------------|
|url                                          |string       |Request url                |
|data                                         |string object|Request data               |
|dataType=json                                |string       |Response type(json, xml)   |
|contentType=application/x-www-form-urlencoded|string       |Request header Content-Type|
|success                                      |function     |Success callback           |
|error                                        |function     |Error callback             |
|complete                                     |function     |Callback after request     |
|timeout                                      |number       |Request timeout            |

### get

Shortcut for type = GET;

### post

Shortcut for type = POST;

|Name    |Type         |Desc            |
|--------|-------------|----------------|
|url     |string       |Request url     |
|[data]  |string object|Request data    |
|success |function     |Success callback|
|dataType|function     |Response type   |

```javascript
ajax({
    url: 'http://example.com',
    data: {test: 'true'},
    error: function () {},
    success: function (data)
    {
        // ...
    },
    dataType: 'json'
});

ajax.get('http://example.com', {}, function (data)
{
    // ...
});
```

## allKeys 

Retrieve all the names of object's own and inherited properties.

|Name  |Type  |Desc                       |
|------|------|---------------------------|
|obj   |object|Object to query            |
|return|array |Array of all property names|

> Members of Object's prototype won't be retrieved.

```javascript
var obj = Object.create({zero: 0});
obj.one = 1;
allKeys(obj) // -> ['zero', 'one']
```

## before 

Create a function that invokes less than n times.

|Name  |Type    |Desc                                            |
|------|--------|------------------------------------------------|
|n     |number  |Number of calls at which fn is no longer invoked|
|fn    |function|Function to restrict                            |
|return|function|New restricted function                         |

Subsequent calls to the created function return the result of the last fn invocation.

```javascript
$(element).on('click', before(5, function() {}));
// -> allow function to be call 4 times at last.
```

## camelCase 

Convert string to "camelCase".

|Name  |Type  |Desc              |
|------|------|------------------|
|str   |string|String to convert |
|return|string|Camel cased string|

```javascript
camelCase('foo-bar'); // -> fooBar
camelCase('foo bar'); // -> fooBar
camelCase('foo_bar'); // -> fooBar
camelCase('foo.bar'); // -> fooBar
```

## castPath 

Cast value into a property path array.

|Name  |Type  |Desc               |
|------|------|-------------------|
|str   |*     |Value to inspect   |
|[obj] |object|Object to query    |
|return|array |Property path array|

```javascript
castPath('a.b.c'); // -> ['a', 'b', 'c']
castPath(['a']); // -> ['a']
castPath('a[0].b'); // -> ['a', '0', 'b']
castPath('a.b.c', {'a.b.c': true}); // -> ['a.b.c']
```

## chunk 

Split array into groups the length of given size.

|Name  |Type  |Desc                |
|------|------|--------------------|
|arr   |array |Array to process    |
|size=1|number|Length of each chunk|

```javascript
chunk([1, 2, 3, 4], 2); // -> [[1, 2], [3, 4]]
chunk([1, 2, 3, 4], 3); // -> [[1, 2, 3], [4]]
chunk([1, 2, 3, 4]); // -> [[1], [2], [3], [4]]
```

## clamp 

Clamp number within the inclusive lower and upper bounds.

|Name   |Type  |Desc           |
|-------|------|---------------|
|n      |number|Number to clamp|
|[lower]|number|Lower bound    |
|upper  |number|Upper bound    |
|return |number|Clamped number |

```javascript
clamp(-10, -5, 5); // -> -5
clamp(10, -5, 5); // -> 5
clamp(2, -5, 5); // -> 2
clamp(10, 5); // -> 5
clamp(2, 5); // -> 2
```

## clone 

Create a shallow-copied clone of the provided plain object.

Any nested objects or arrays will be copied by reference, not duplicated.

|Name  |Type|Desc          |
|------|----|--------------|
|val   |*   |Value to clone|
|return|*   |Cloned value  |

```javascript
clone({name: 'eustia'}); // -> {name: 'eustia'}
```

## cloneDeep 

Recursively clone value.

|Name  |Type|Desc             |
|------|----|-----------------|
|val   |*   |Value to clone   |
|return|*   |Deep cloned Value|

```javascript
var obj = [{a: 1}, {a: 2}];
var obj2 = cloneDeep(obj);
console.log(obj[0] === obj2[1]); // -> false
```

## concat 

Concat multiple arrays into a single array.

|Name  |Type |Desc              |
|------|-----|------------------|
|...arr|array|Arrays to concat  |
|return|array|Concatenated array|

```javascript
concat([1, 2], [3], [4, 5]); // -> [1, 2, 3, 4, 5]
```

## contain 

Check if the value is present in the list.

|Name  |Type        |Desc                                |
|------|------------|------------------------------------|
|array |array object|Target list                         |
|value |*           |Value to check                      |
|return|boolean     |True if value is present in the list|

```javascript
contain([1, 2, 3], 1); // -> true
contain({a: 1, b: 2}, 1); // -> true
```

## cookie 

Simple api for handling browser cookies.

### get

Get cookie value.

|Name  |Type  |Desc                      |
|------|------|--------------------------|
|key   |string|Cookie key                |
|return|string|Corresponding cookie value|

### set

Set cookie value.

|Name     |Type   |Desc          |
|---------|-------|--------------|
|key      |string |Cookie key    |
|val      |string |Cookie value  |
|[options]|object |Cookie options|
|return   |exports|Module cookie |

### remove

Remove cookie value.

|Name     |Type   |Desc          |
|---------|-------|--------------|
|key      |string |Cookie key    |
|[options]|object |Cookie options|
|return   |exports|Module cookie |

```javascript
cookie.set('a', '1', {path: '/'});
cookie.get('a'); // -> '1'
cookie.remove('a');
```

## createAssigner 

Used to create extend, extendOwn and defaults.

|Name    |Type    |Desc                          |
|--------|--------|------------------------------|
|keysFn  |function|Function to get object keys   |
|defaults|boolean |No override when set to true  |
|return  |function|Result function, extend...    |

## dateFormat 

Simple but extremely useful date format function.

|Name           |Type   |Desc                 |
|---------------|-------|---------------------|
|[date=new Date]|Date   |Date object to format|
|mask           |string |Format mask          |
|[utc=false]    |boolean|UTC or not           |
|[gmt=false]    |boolean|GMT or not           |

|Mask|Description                                                      |
|----|-----------------------------------------------------------------|
|d   |Day of the month as digits; no leading zero for single-digit days|
|dd  |Day of the month as digits; leading zero for single-digit days   |
|ddd |Day of the week as a three-letter abbreviation                   |
|dddd|Day of the week as its full name                                 |
|m   |Month as digits; no leading zero for single-digit months         |
|mm  |Month as digits; leading zero for single-digit months            |
|mmm |Month as a three-letter abbreviation                             |
|mmmm|Month as its full name                                           |
|yy  |Year as last two digits; leading zero for years less than 10     |
|yyyy|Year represented by four digits                                  |
|h   |Hours; no leading zero for single-digit hours (12-hour clock)    |
|hh  |Hours; leading zero for single-digit hours (12-hour clock)       |
|H   |Hours; no leading zero for single-digit hours (24-hour clock)    |
|HH  |Hours; leading zero for single-digit hours (24-hour clock)       |
|M   |Minutes; no leading zero for single-digit minutes                |
|MM  |Minutes; leading zero for single-digit minutes                   |
|s   |Seconds; no leading zero for single-digit seconds                |
|ss  |Seconds; leading zero for single-digit seconds                   |
|l L |Milliseconds. l gives 3 digits. L gives 2 digits                 |
|t   |Lowercase, single-character time marker string: a or p           |
|tt  |Lowercase, two-character time marker string: am or pm            |
|T   |Uppercase, single-character time marker string: A or P           |
|TT  |Uppercase, two-character time marker string: AM or PM            |
|Z   |US timezone abbreviation, e.g. EST or MDT                        |
|o   |GMT/UTC timezone offset, e.g. -0500 or +0230                     |
|S   |The date's ordinal suffix (st, nd, rd, or th)                    |
|UTC:|Must be the first four characters of the mask                    |

```javascript
dateFormat('isoDate'); // -> 2016-11-19
dateFormat('yyyy-mm-dd HH:MM:ss'); // -> 2016-11-19 19:00:04
dateFormat(new Date(), 'yyyy-mm-dd'); // -> 2016-11-19
```

## decodeUriComponent 

Better decodeURIComponent that does not throw if input is invalid.

|Name  |Type  |Desc            |
|------|------|----------------|
|str   |string|String to decode|
|return|string|Decoded string  |

```javascript
decodeUriComponent('%%25%'); // -> '%%%'
decodeUriComponent('%E0%A4%A'); // -> '\xE0\xA4%A'
```

## defaults 

Fill in undefined properties in object with the first value present in the following list of defaults objects.

|Name  |Type  |Desc              |
|------|------|------------------|
|obj   |object|Destination object|
|*src  |object|Sources objects   |
|return|object|Destination object|

```javascript
defaults({name: 'RedHood'}, {name: 'Unknown', age: 24}); // -> {name: 'RedHood', age: 24}
```

## delegate 

Event delegation.

### add

Add event delegation.

|Name    |Type    |Desc          |
|--------|--------|--------------|
|el      |element |Parent element|
|type    |string  |Event type    |
|selector|string  |Match selector|
|cb      |function|Event callback|

### remove

Remove event delegation.

```javascript
var container = document.getElementById('container');
function clickHandler()
{
    // Do something...
}
delegate.add(container, 'click', '.children', clickHandler);
delegate.remove(container, 'click', '.children', clickHandler);
```

## detectBrowser 

Detect browser info using ua.

|Name                    |Type  |Desc                              |
|------------------------|------|----------------------------------|
|[ua=navigator.userAgent]|string|Browser userAgent                 |
|return                  |object|Object containing name and version|

Browsers supported: ie, chrome, edge, firefox, opera, safari, ios(mobile safari), android(android browser)

```javascript
var browser = detectBrowser();
if (browser.name === 'ie' && browser.version < 9)
{
    // Do something about old IE...
}
```

## detectMocha 

Detect if mocha is running.

```javascript
detectMocha(); // -> True if mocha is running.
```

## detectOs 

Detect operating system using ua.

|Name                    |Type  |Desc                 |
|------------------------|------|---------------------|
|[ua=navigator.userAgent]|string|Browser userAgent    |
|return                  |string|Operating system name|

Supported os: windows, os x, linux, ios, android, windows phone

```javascript
if (detectOs() === 'ios')
{
    // Do something about ios...
}
```

## each 

Iterate over elements of collection and invokes iteratee for each element.

|Name    |Type        |Desc                          |
|--------|------------|------------------------------|
|obj     |object array|Collection to iterate over    |
|iteratee|function    |Function invoked per iteration|
|[ctx]   |*           |Function context              |

```javascript
each({'a': 1, 'b': 2}, function (val, key) {});
```

## endWith 

Check if string ends with the given target string.

|Name  |Type   |Desc                           |
|------|-------|-------------------------------|
|str   |string |The string to search           |
|suffix|string |String suffix                  |
|return|boolean|True if string ends with target|

```javascript
endWith('ab', 'b'); // -> true
```

## escape 

Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.

|Name  |Type  |Desc            |
|------|------|----------------|
|str   |string|String to escape|
|return|string|Escaped string  |

```javascript
escape('You & Me'); -> // -> 'You &amp; Me'
```

## escapeJsStr 

Escape string to be a valid JavaScript string literal between quotes.

http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4

|Name  |Type  |Desc            |
|------|------|----------------|
|str   |string|String to escape|
|return|string|Escaped string  |

```javascript
escapeJsStr('\"\n'); // -> '\\"\\\\n'
```

## escapeJsonStr 

Escape json string.

## escapeRegExp 

Escape special chars to be used as literals in RegExp constructors.

|Name  |Type  |Desc            |
|------|------|----------------|
|str   |string|String to escape|
|return|string|Escaped string  |

```javascript
escapeRegExp('[licia]'); // -> '\\[licia\\]'
```

## evalCss 

Eval css.

## extend 

Copy all of the properties in the source objects over to the destination object.

|Name  |Type  |Desc              |
|------|------|------------------|
|obj   |object|Destination object|
|...src|object|Sources objects   |
|return|object|Destination object|

```javascript
extend({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
```

## extendOwn 

Like extend, but only copies own properties over to the destination object.

|Name  |Type  |Desc              |
|------|------|------------------|
|obj   |object|Destination object|
|*src  |object|Sources objects   |
|return|object|Destination object|

```javascript
extendOwn({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
```

## fileSize 

Turn bytes into human readable file size.

|Name  |Type  |Desc              |
|------|------|------------------|
|bytes |number|File bytes        |
|return|string|Readable file size|

```javascript
fileSize(5); // -> '5'
fileSize(1500); // -> '1.46K'
fileSize(1500000); // -> '1.43M'
fileSize(1500000000); // -> '1.4G'
fileSize(1500000000000); // -> '1.36T'
```

## filter 

Iterates over elements of collection, returning an array of all the values that pass a truth test.

|Name     |Type    |Desc                                   |
|---------|--------|---------------------------------------|
|obj      |array   |Collection to iterate over             |
|predicate|function|Function invoked per iteration         |
|[ctx]    |*       |Predicate context                      |
|return   |array   |Array of all values that pass predicate|

```javascript
filter([1, 2, 3, 4, 5], function (val)
{
    return val % 2 === 0;
}); // -> [2, 4]
```

## freeze 

Shortcut for Object.freeze.

Use Object.defineProperties if Object.freeze is not supported.

|Name  |Type  |Desc            |
|------|------|----------------|
|obj   |object|Object to freeze|
|return|object|Object passed in|

```javascript
var a = {b: 1};
freeze(a);
a.b = 2;
console.log(a); // -> {b: 1}
```

## fullUrl 

Add origin to url if needed.

## getFileName 

Extract file name from url.

## getObjType 

Get object type.

## has 

Checks if key is a direct property.

|Name  |Type   |Desc                            |
|------|-------|--------------------------------|
|obj   |object |Object to query                 |
|key   |string |Path to check                   |
|return|boolean|True if key is a direct property|

```javascript
has({one: 1}, 'one'); // -> true
```

## identity 

Return the first argument given.

|Name  |Type|Desc       |
|------|----|-----------|
|val   |*   |Any value  |
|return|*   |Given value|

```javascript
identity('a'); // -> 'a'
```

## idxOf 

Get the index at which the first occurrence of value.

|Name     |Type  |Desc                |
|---------|------|--------------------|
|arr      |array |Array to search     |
|val      |*     |Value to search for |
|fromIdx=0|number|Index to search from|

```javascript
idxOf([1, 2, 1, 2], 2, 2); // -> 3
```

## inherits 

Inherit the prototype methods from one constructor into another.

|Name      |Type    |Desc       |
|----------|--------|-----------|
|Class     |function|Child Class|
|SuperClass|function|Super Class|

```javascript
function People(name)
{
    this._name = name;
}
People.prototype = {
    getName: function ()
    {
        return this._name;
    }
};
function Student(name)
{
    this._name = name;
}
inherits(Student, People);
var s = new Student('RedHood');
s.getName(); // -> 'RedHood'
```

## isArgs 

Check if value is classified as an arguments object.

|Name  |Type   |Desc                                |
|------|-------|------------------------------------|
|val   |*      |Value to check                      |
|return|boolean|True if value is an arguments object|

```javascript
(function () {
    isArgs(arguments); // -> true
})();
```

## isArr 

Check if value is an `Array` object.

|Name  |Type   |Desc                              |
|------|-------|----------------------------------|
|val   |*      |Value to check                    |
|return|boolean|True if value is an `Array` object|

```javascript
isArr([]); // -> true
isArr({}); // -> false
```

## isArrLike 

Check if value is array-like.

|Name  |Type   |Desc                       |
|------|-------|---------------------------|
|val   |*      |Value to check             |
|return|boolean|True if value is array like|

> Function returns false.

```javascript
isArrLike('test'); // -> true
isArrLike(document.body.children); // -> true;
isArrLike([1, 2, 3]); // -> true
```

## isBool 

Check if value is a boolean primitive.

|Name  |Type   |Desc                      |
|------|-------|--------------------------|
|val   |*      |Value to check            |
|return|boolean|True if value is a boolean|

```javascript
isBool(true); // -> true
isBool(false); // -> true
isBool(1); // -> false
```

## isBrowser 

Check if running in a browser.

```javascript
console.log(isBrowser); // -> true if running in a browser
```

## isCrossOrig 

Check if a url is cross origin.

## isDate 

Check if value is classified as a Date object.

|Name  |Type   |Desc                          |
|------|-------|------------------------------|
|val   |*      |value to check                |
|return|boolean|True if value is a Date object|

```javascript
isDate(new Date()); // -> true
```

## isEl 

Check if value is a DOM element.

|Name  |Type   |Desc                          |
|------|-------|------------------------------|
|val   |*      |Value to check                |
|return|boolean|True if value is a DOM element|

```javascript
isEl(document.body); // -> true
```

## isEmpty 

Check if value is an empty object or array.

|Name  |Type   |Desc                  |
|------|-------|----------------------|
|val   |*      |Value to check        |
|return|boolean|True if value is empty|

```javascript
isEmpty([]); // -> true
isEmpty({}); // -> true
isEmpty(''); // -> true
```

## isErr 

Check if value is an error.

|Name  |Type   |Desc                     |
|------|-------|-------------------------|
|val   |*      |Value to check           |
|return|boolean|True if value is an error|

```javascript
isErr(new Error()); // -> true
```

## isErudaEl 

See if an element is within eruda.

## isFn 

Check if value is a function.

|Name  |Type   |Desc                       |
|------|-------|---------------------------|
|val   |*      |Value to check             |
|return|boolean|True if value is a function|

Generator function is also classified as true.

```javascript
isFn(function() {}); // -> true
isFn(function*() {}); // -> true
```

## isMatch 

Check if keys and values in src are contained in obj.

|Name  |Type   |Desc                              |
|------|-------|----------------------------------|
|obj   |object |Object to inspect                 |
|src   |object |Object of property values to match|
|return|boolean|True if object is match           |

```javascript
isMatch({a: 1, b: 2}, {a: 1}); // -> true
```

## isMiniProgram 

Check if running in wechat mini program.

```javascript
console.log(isMiniProgram); // -> true if running in mini program.
```

## isMobile 

Check whether client is using a mobile browser using ua.

|Name                    |Type   |Desc                                 |
|------------------------|-------|-------------------------------------|
|[ua=navigator.userAgent]|string |User agent                           |
|return                  |boolean|True if ua belongs to mobile browsers|

```javascript
isMobile(navigator.userAgent);
```

## isNaN 

Check if value is an NaN.

|Name  |Type   |Desc                   |
|------|-------|-----------------------|
|val   |*      |Value to check         |
|return|boolean|True if value is an NaN|

Undefined is not an NaN, different from global isNaN function.

```javascript
isNaN(0); // -> false
isNaN(NaN); // -> true
```

## isNative 

Check if value is a native function.

|Name  |Type   |Desc                              |
|------|-------|----------------------------------|
|val   |*      |Value to check                    |
|return|boolean|True if value is a native function|

```javascript
isNative(function () {}); // -> false
isNative(Math.min); // -> true
```

## isNil 

Check if value is null or undefined, the same as value == null.

|Name  |Type   |Desc                              |
|------|-------|----------------------------------|
|val   |*      |Value to check                    |
|return|boolean|True if value is null or undefined|

```javascript
isNil(null); // -> true
isNil(void 0); // -> true
isNil(undefined); // -> true
isNil(false); // -> false
isNil(0); // -> false
isNil([]); // -> false
```

## isNull 

Check if value is an Null.

|Name  |Type   |Desc                    |
|------|-------|------------------------|
|val   |*      |Value to check          |
|return|boolean|True if value is an Null|

```javascript
isNull(null); // -> true
```

## isNum 

Check if value is classified as a Number primitive or object.

|Name  |Type   |Desc                                 |
|------|-------|-------------------------------------|
|val   |*      |Value to check                       |
|return|boolean|True if value is correctly classified|

```javascript
isNum(5); // -> true
isNum(5.1); // -> true
isNum({}); // -> false
```

## isObj 

Check if value is the language type of Object.

|Name  |Type   |Desc                      |
|------|-------|--------------------------|
|val   |*      |Value to check            |
|return|boolean|True if value is an object|

[Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)

```javascript
isObj({}); // -> true
isObj([]); // -> true
```

## isRegExp 

Check if value is a regular expression.

|Name  |Type   |Desc                                 |
|------|-------|-------------------------------------|
|val   |*      |Value to check                       |
|return|boolean|True if value is a regular expression|

```javascript
isRegExp(/a/); // -> true
```

## isStr 

Check if value is a string primitive.

|Name  |Type   |Desc                               |
|------|-------|-----------------------------------|
|val   |*      |Value to check                     |
|return|boolean|True if value is a string primitive|

```javascript
isStr('licia'); // -> true
```

## isUndef 

Check if value is undefined.

|Name  |Type   |Desc                      |
|------|-------|--------------------------|
|val   |*      |Value to check            |
|return|boolean|True if value is undefined|

```javascript
isUndef(void 0); // -> true
isUndef(null); // -> false
```

## kebabCase 

Convert string to "kebabCase".

|Name  |Type  |Desc              |
|------|------|------------------|
|str   |string|String to convert |
|return|string|Kebab cased string|

```javascript
kebabCase('fooBar'); // -> foo-bar
kebabCase('foo bar'); // -> foo-bar
kebabCase('foo_bar'); // -> foo-bar
kebabCase('foo.bar'); // -> foo-bar
```

## keys 

Create an array of the own enumerable property names of object.

|Name  |Type  |Desc                   |
|------|------|-----------------------|
|obj   |object|Object to query        |
|return|array |Array of property names|

```javascript
keys({a: 1}); // -> ['a']
```

## last 

Get the last element of array.

|Name  |Type |Desc                     |
|------|-----|-------------------------|
|arr   |array|The array to query       |
|return|*    |The last element of array|

```javascript
last([1, 2]); // -> 2
```

## loadJs 

Inject script tag into page with given src value.

|Name|Type    |Desc           |
|----|--------|---------------|
|src |string  |Script source  |
|cb  |function|Onload callback|

```javascript
loadJs('main.js', function (isLoaded)
{
    // Do something...
});
```

## lpad 

Pad string on the left side if it's shorter than length.

|Name   |Type  |Desc                  |
|-------|------|----------------------|
|str    |string|String to pad         |
|len    |number|Padding length        |
|[chars]|string|String used as padding|
|return |string|Resulted string       |

```javascript
lpad('a', 5); // -> '    a'
lpad('a', 5, '-'); // -> '----a'
lpad('abc', 3, '-'); // -> 'abc'
lpad('abc', 5, 'ab'); // -> 'ababc'
```

## ltrim 

Remove chars or white-spaces from beginning of string.

|Name  |Type        |Desc              |
|------|------------|------------------|
|str   |string      |String to trim    |
|chars |string array|Characters to trim|
|return|string      |Trimmed string    |

```javascript
ltrim(' abc  '); // -> 'abc  '
ltrim('_abc_', '_'); // -> 'abc_'
ltrim('_abc_', ['a', '_']); // -> 'bc_'
```

## map 

Create an array of values by running each element in collection through iteratee.

|Name    |Type        |Desc                          |
|--------|------------|------------------------------|
|obj     |array object|Collection to iterate over    |
|iteratee|function    |Function invoked per iteration|
|[ctx]   |*           |Function context              |
|return  |array       |New mapped array              |

```javascript
map([4, 8], function (n) { return n * n; }); // -> [16, 64]
```

## mapObj 

Map for objects.

|Name    |Type    |Desc                          |
|--------|--------|------------------------------|
|obj     |object  |Object to iterate over        |
|iteratee|function|Function invoked per iteration|
|[ctx]   |*       |Function context              |
|return  |object  |New mapped object             |

```javascript
mapObj({a: 1, b: 2}, function (val, key) { return val + 1 }); // -> {a: 2, b: 3}
```

## matcher 

Return a predicate function that checks if attrs are contained in an object.

|Name  |Type    |Desc                              |
|------|--------|----------------------------------|
|attrs |object  |Object of property values to match|
|return|function|New predicate function            |

```javascript
var objects = [
    {a: 1, b: 2, c: 3 },
    {a: 4, b: 5, c: 6 }
];
filter(objects, matcher({a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6 }]
```

## memStorage 

Memory-backed implementation of the Web Storage API.

A replacement for environments where localStorage or sessionStorage is not available.

```javascript
var localStorage = window.localStorage || memStorage;
localStorage.setItem('test', 'licia');
```

## memoize 

Memoize a given function by caching the computed result.

|Name    |Type    |Desc                                |
|--------|--------|------------------------------------|
|fn      |function|Function to have its output memoized|
|[hashFn]|function|Function to create cache key        |
|return  |function|New memoized function               |

```javascript
var fibonacci = memoize(function(n)
{
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
});
```

## meta 

Document meta manipulation, turn name and content into key value pairs.

Get meta content with given name. If name is omitted, all pairs will be return.

|Name  |Type        |Desc        |
|------|------------|------------|
|[name]|string array|Meta name   |
|return|string      |Meta content|

Set meta content.

|Name   |Type  |Desc        |
|-------|------|------------|
|name   |string|Meta name   |
|content|string|Meta content|

|Name |Type  |Desc                        |
|-----|------|----------------------------|
|metas|object|Object of name content pairs|

### remove

Remove metas.

|Name|Type        |Desc     |
|----|------------|---------|
|name|string array|Meta name|

```javascript
// <meta name="a" content="1"/> <meta name="b" content="2"/> <meta name="c" content="3"/>
meta(); // -> {a: '1', b: '2', c: '3'}
meta('a'); // -> '1'
meta(['a', 'c']); // -> {a: '1', c: '3'}
meta('d', '4');
meta({
    d: '5',
    e: '6',
    f: '7'
});
meta.remove('d');
meta.remove(['e', 'f']);
```

## ms 

Convert time string formats to milliseconds.

Turn time string into milliseconds.

|Name  |Type  |Desc         |
|------|------|-------------|
|str   |string|String format|
|return|number|Milliseconds |

Turn milliseconds into time string.

|Name  |Type  |Desc         |
|------|------|-------------|
|num   |number|Milliseconds |
|return|string|String format|

```javascript
ms('1s'); // -> 1000
ms('1m'); // -> 60000
ms('1.5h'); // -> 5400000
ms('1d'); // -> 86400000
ms('1y'); // -> 31557600000
ms('1000'); // -> 1000
ms(1500); // -> '1.5s'
ms(60000); // -> '1m'
```

## nextTick 

Next tick for both node and browser.

|Name|Type    |Desc            |
|----|--------|----------------|
|cb  |function|Function to call|

Use process.nextTick if available.

Otherwise setImmediate or setTimeout is used as fallback.

```javascript
nextTick(function ()
{
    // Do something...
});
```

## noop 

A no-operation function.

```javascript
noop(); // Does nothing
```

## now 

Gets the number of milliseconds that have elapsed since the Unix epoch.

```javascript
now(); // -> 1468826678701
```

## objToStr 

Alias of Object.prototype.toString.

|Name  |Type  |Desc                                |
|------|------|------------------------------------|
|value |*     |Source value                        |
|return|string|String representation of given value|

```javascript
objToStr(5); // -> '[object Number]'
```

## once 

Create a function that invokes once.

|Name  |Type    |Desc                   |
|------|--------|-----------------------|
|fn    |function|Function to restrict   |
|return|function|New restricted function|

```javascript
function init() {};
var initOnce = once(init);
initOnce();
initOnce(); // -> init is invoked once
```

## optimizeCb 

Used for function context binding.

## orientation 

Screen orientation helper.

### on

Bind change event.

### off

Unbind change event.

### get

Get current orientation(landscape or portrait).

```javascript
orientation.on('change', function (direction)
{
    console.log(direction); // -> 'portrait'
});
orientation.get(); // -> 'landscape'
```

## partial 

Partially apply a function by filling in given arguments.

|Name       |Type    |Desc                                    |
|-----------|--------|----------------------------------------|
|fn         |function|Function to partially apply arguments to|
|...partials|*       |Arguments to be partially applied       |
|return     |function|New partially applied function          |

```javascript
var sub5 = partial(function (a, b) { return b - a }, 5);
sub(20); // -> 15
```

## perfNow 

High resolution time up to microsecond precision.

```javascript
var start = perfNow();

// Do something.

console.log(perfNow() - start);
```

## prefix 

Add vendor prefixes to a CSS attribute.

|Name  |Type  |Desc                  |
|------|------|----------------------|
|name  |string|Property name         |
|return|string|Prefixed property name|

### dash

Create a dasherize version.

```javascript
prefix('text-emphasis'); // -> 'WebkitTextEmphasis'
prefix.dash('text-emphasis'); // -> '-webkit-text-emphasis'
prefix('color'); // -> 'color'
```

## pxToNum 

Turn string like '0px' to number.

## query 

Parse and stringify url query strings.

### parse

Parse a query string into an object.

|Name  |Type  |Desc        |
|------|------|------------|
|str   |string|Query string|
|return|object|Query object|

### stringify

Stringify an object into a query string.

|Name  |Type  |Desc        |
|------|------|------------|
|obj   |object|Query object|
|return|string|Query string|

```javascript
query.parse('foo=bar&eruda=true'); // -> {foo: 'bar', eruda: 'true'}
query.stringify({foo: 'bar', eruda: 'true'}); // -> 'foo=bar&eruda=true'
query.parse('name=eruda&name=eustia'); // -> {name: ['eruda', 'eustia']}
```

## repeat 

Repeat string n-times.

|Name  |Type  |Desc            |
|------|------|----------------|
|str   |string|String to repeat|
|n     |number|Repeat times    |
|return|string|Repeated string |

```javascript
repeat('a', 3); // -> 'aaa'
repeat('ab', 2); // -> 'abab'
repeat('*', 0); // -> ''
```

## restArgs 

This accumulates the arguments passed into an array, after a given index.

|Name      |Type    |Desc                                   |
|----------|--------|---------------------------------------|
|function  |function|Function that needs rest parameters    |
|startIndex|number  |The start index to accumulates         |
|return    |function|Generated function with rest parameters|

```javascript
var paramArr = restArgs(function (rest) { return rest });
paramArr(1, 2, 3, 4); // -> [1, 2, 3, 4]
```

## rmCookie 

Loop through all possible path and domain to remove cookie.

|Name|Type  |Desc      |
|----|------|----------|
|key |string|Cookie key|

```javascript
rmCookie('test');
```

## root 

Root object reference, `global` in nodeJs, `window` in browser.

## rtrim 

Remove chars or white-spaces from end of string.

|Name  |Type        |Desc              |
|------|------------|------------------|
|str   |string      |String to trim    |
|chars |string array|Characters to trim|
|return|string      |Trimmed string    |

```javascript
rtrim(' abc  '); // -> ' abc'
rtrim('_abc_', '_'); // -> '_abc'
rtrim('_abc_', ['c', '_']); // -> '_ab'
```

## safeCb 

Create callback based on input value.

## safeGet 

Get object property, don't throw undefined error.

|Name  |Type        |Desc                     |
|------|------------|-------------------------|
|obj   |object      |Object to query          |
|path  |array string|Path of property to get  |
|return|*           |Target value or undefined|

```javascript
var obj = {a: {aa: {aaa: 1}}};
safeGet(obj, 'a.aa.aaa'); // -> 1
safeGet(obj, ['a', 'aa']); // -> {aaa: 1}
safeGet(obj, 'a.b'); // -> undefined
```

## safeStorage 

Safe localStorage and sessionStorage.

## slice 

Create slice of source array or array-like object.

|Name              |Type  |Desc                      |
|------------------|------|--------------------------|
|array             |array |Array to slice            |
|[start=0]         |number|Start position            |
|[end=array.length]|number|End position, not included|

```javascript
slice([1, 2, 3, 4], 1, 2); // -> [2]
```

## some 

Check if predicate return truthy for any element.

|Name     |Type        |Desc                                          |
|---------|------------|----------------------------------------------|
|obj      |array object|Collection to iterate over                    |
|predicate|function    |Function to invoked per iteration             |
|ctx      |*           |Predicate context                             |
|return   |boolean     |True if any element passes the predicate check|

```javascript
some([2, 5], function (val)
{
    return val % 2 === 0;
}); // -> true
```

## splitCase 

Split different string case to an array.

|Name  |Type  |Desc           |
|------|------|---------------|
|str   |string|String to split|
|return|array |Result array   |

```javascript
splitCase('foo-bar'); // -> ['foo', 'bar']
splitCase('foo bar'); // -> ['foo', 'bar']
splitCase('foo_bar'); // -> ['foo', 'bar']
splitCase('foo.bar'); // -> ['foo', 'bar']
splitCase('fooBar'); // -> ['foo', 'bar']
splitCase('foo-Bar'); // -> ['foo', 'bar']
```

## startWith 

Check if string starts with the given target string.

|Name  |Type   |Desc                             |
|------|-------|---------------------------------|
|str   |string |String to search                 |
|prefix|string |String prefix                    |
|return|boolean|True if string starts with prefix|

```javascript
startWith('ab', 'a'); // -> true
```

## stringify 

JSON stringify with support for circular object, function etc.

Undefined is treated as null value.

|Name  |Type  |Desc               |
|------|------|-------------------|
|obj   |object|Object to stringify|
|spaces|number|Indent spaces      |
|return|string|Stringified object |

```javascript
stringify({a: function () {}}); // -> '{"a":"[Function function () {}]"}'
var obj = {a: 1};
obj.b = obj;
stringify(obj); // -> '{"a":1,"b":"[Circular ~]"}'
```

## stripHtmlTag 

Strip html tags from a string.

|Name  |Type  |Desc           |
|------|------|---------------|
|str   |string|String to strip|
|return|string|Resulted string|

```javascript
stripHtmlTag('<p>Hello</p>'); // -> 'Hello'
```

## toArr 

Convert value to an array.

|Name  |Type |Desc            |
|------|-----|----------------|
|val   |*    |Value to convert|
|return|array|Converted array |

```javascript
toArr({a: 1, b: 2}); // -> [{a: 1, b: 2}]
toArr('abc'); // -> ['abc']
toArr(1); // -> [1]
toArr(null); // -> []
```

## toInt 

Convert value to an integer.

|Name  |Type  |Desc             |
|------|------|-----------------|
|val   |*     |Value to convert |
|return|number|Converted integer|

```javascript
toInt(1.1); // -> 1
toInt(undefined); // -> 0
```

## toNum 

Convert value to a number.

|Name  |Type  |Desc            |
|------|------|----------------|
|val   |*     |Value to process|
|return|number|Resulted number |

```javascript
toNum('5'); // -> 5
```

## toSrc 

Convert function to its source code.

|Name  |Type    |Desc               |
|------|--------|-------------------|
|fn    |function|Function to convert|
|return|string  |Source code        |

```javascript
toSrc(Math.min); // -> 'function min() { [native code] }'
toSrc(function () {}) // -> 'function () { }'
```

## toStr 

Convert value to a string.

|Name  |Type  |Desc            |
|------|------|----------------|
|val   |*     |Value to convert|
|return|string|Resulted string |

```javascript
toStr(null); // -> ''
toStr(1); // -> '1'
toStr(false); // -> 'false'
toStr([1, 2, 3]); // -> '1,2,3'
```

## trim 

Remove chars or white-spaces from beginning end of string.

|Name  |Type        |Desc              |
|------|------------|------------------|
|str   |string      |String to trim    |
|chars |string array|Characters to trim|
|return|string      |Trimmed string    |

```javascript
trim(' abc  '); // -> 'abc'
trim('_abc_', '_'); // -> 'abc'
trim('_abc_', ['a', 'c', '_']); // -> 'b'
```

## tryIt 

Run function in a try catch.

|Name|Type    |Desc                 |
|----|--------|---------------------|
|fn  |function|Function to try catch|
|[cb]|function|Callback             |

```javascript
tryIt(function ()
{
    // Do something that might cause an error.
}, function (err, result)
{
    if (err) console.log(err);
});
```

## type 

Determine the internal JavaScript [[Class]] of an object.

|Name  |Type  |Desc                      |
|------|------|--------------------------|
|val   |*     |Value to get type         |
|return|string|Type of object, lowercased|

```javascript
type(5); // -> 'number'
type({}); // -> 'object'
type(function () {}); // -> 'function'
type([]); // -> 'array'
```

## ucs2 

UCS-2 encoding and decoding.

### encode

Create a string using an array of code point values.

|Name  |Type  |Desc                |
|------|------|--------------------|
|arr   |array |Array of code points|
|return|string|Encoded string      |

### decode

Create an array of code point values using a string.

|Name  |Type  |Desc                |
|------|------|--------------------|
|str   |string|Input string        |
|return|array |Array of code points|

```javascript
ucs2.encode([0x61, 0x62, 0x63]); // -> 'abc'
ucs2.decode('abc'); // -> [0x61, 0x62, 0x63]
'𝌆'.length; // -> 2
ucs2.decode('𝌆').length; // -> 1
```

## uniqId 

Generate a globally-unique id.

|Name  |Type  |Desc              |
|------|------|------------------|
|prefix|string|Id prefix         |
|return|string|Globally-unique id|

```javascript
uniqId('eusita_'); // -> 'eustia_xxx'
```

## unique 

Create duplicate-free version of an array.

|Name     |Type    |Desc                         |
|---------|--------|-----------------------------|
|arr      |array   |Array to inspect             |
|[compare]|function|Function for comparing values|
|return   |array   |New duplicate free array     |

```javascript
unique([1, 2, 3, 1]); // -> [1, 2, 3]
```

## upperFirst 

Convert the first character of string to upper case.

|Name  |Type  |Desc             |
|------|------|-----------------|
|str   |string|String to convert|
|return|string|Converted string |

```javascript
upperFirst('red'); // -> Red
```

## utf8 

UTF-8 encoding and decoding.

### encode

Turn any UTF-8 decoded string into UTF-8 encoded string.

|Name  |Type  |Desc            |
|------|------|----------------|
|str   |string|String to encode|
|return|string|Encoded string  |

### decode

|Name        |Type   |Desc                  |
|------------|-------|----------------------|
|str         |string |String to decode      |
|[safe=false]|boolean|Suppress error if true|
|return      |string |Decoded string        |

Turn any UTF-8 encoded string into UTF-8 decoded string.

```javascript
utf8.encode('\uD800\uDC00'); // ->  '\xF0\x90\x80\x80'
utf8.decode('\xF0\x90\x80\x80'); // -> '\uD800\uDC00'
```

## values 

Create an array of the own enumerable property values of object.

|Name  |Type  |Desc                    |
|------|------|------------------------|
|obj   |object|Object to query         |
|return|array |Array of property values|

```javascript
values({one: 1, two: 2}); // -> [1, 2]
```

## viewportScale 

Get viewport scale.

```javascript
viewportScale(); // -> 3
```

## wrap 

Wrap the function inside a wrapper function, passing it as the first argument.

|Name   |Type    |Desc            |
|-------|--------|----------------|
|fn     |*       |Function to wrap|
|wrapper|function|Wrapper function|
|return |function|New function    |

```javascript
var p = wrap(escape, function(fn, text)
{
    return '<p>' + fn(text) + '</p>';
});
p('You & Me'); // -> '<p>You &amp; Me</p>'
```
