// Built by eustia.
"use strict";

var _ = {};

/* ------------------------------ allKeys ------------------------------ */

export var allKeys = _.allKeys = (function () {
    /* Retrieve all the names of object's own and inherited properties.
     *
     * |Name  |Type  |Desc                       |
     * |------|------|---------------------------|
     * |obj   |object|Object to query            |
     * |return|array |Array of all property names|
     *
     * > Members of Object's prototype won't be retrieved.
     *
     * ```javascript
     * var obj = Object.create({zero: 0});
     * obj.one = 1;
     * allKeys(obj) // -> ['zero', 'one']
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    function exports(obj) {
        var ret = [],
            key;

        for (key in obj) ret.push(key);

        return ret;
    }

    return exports;
})();

/* ------------------------------ idxOf ------------------------------ */

export var idxOf = _.idxOf = (function () {
    /* Get the index at which the first occurrence of value.
     *
     * |Name     |Type  |Desc                |
     * |---------|------|--------------------|
     * |arr      |array |Array to search     |
     * |val      |*     |Value to search for |
     * |fromIdx=0|number|Index to search from|
     *
     * ```javascript
     * idxOf([1, 2, 1, 2], 2, 2); // -> 3
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    function exports(arr, val, fromIdx) {
        return Array.prototype.indexOf.call(arr, val, fromIdx);
    }

    return exports;
})();

/* ------------------------------ isUndef ------------------------------ */

export var isUndef = _.isUndef = (function () {
    /* Check if value is undefined.
     *
     * |Name  |Type   |Desc                      |
     * |------|-------|--------------------------|
     * |val   |*      |Value to check            |
     * |return|boolean|True if value is undefined|
     *
     * ```javascript
     * isUndef(void 0); // -> true
     * isUndef(null); // -> false
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    function exports(val) {
        return val === void 0;
    }

    return exports;
})();

/* ------------------------------ optimizeCb ------------------------------ */

export var optimizeCb = _.optimizeCb = (function () {
    /* Used for function context binding.
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * isUndef 
     */

    function exports(fn, ctx, argCount) {
        if (isUndef(ctx)) return fn;

        switch (argCount == null ? 3 : argCount) {
            case 1:
                return function(val) {
                    return fn.call(ctx, val);
                };
            case 3:
                return function(val, idx, collection) {
                    return fn.call(ctx, val, idx, collection);
                };
            case 4:
                return function(accumulator, val, idx, collection) {
                    return fn.call(ctx, accumulator, val, idx, collection);
                };
        }

        return function() {
            return fn.apply(ctx, arguments);
        };
    }

    return exports;
})();

/* ------------------------------ endWith ------------------------------ */

export var endWith = _.endWith = (function () {
    /* Check if string ends with the given target string.
     *
     * |Name  |Type   |Desc                           |
     * |------|-------|-------------------------------|
     * |str   |string |The string to search           |
     * |suffix|string |String suffix                  |
     * |return|boolean|True if string ends with target|
     *
     * ```javascript
     * endWith('ab', 'b'); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    function exports(str, suffix) {
        var idx = str.length - suffix.length;

        return idx >= 0 && str.indexOf(suffix, idx) === idx;
    }

    return exports;
})();

/* ------------------------------ toStr ------------------------------ */

export var toStr = _.toStr = (function () {
    /* Convert value to a string.
     *
     * |Name  |Type  |Desc            |
     * |------|------|----------------|
     * |val   |*     |Value to convert|
     * |return|string|Resulted string |
     *
     * ```javascript
     * toStr(null); // -> ''
     * toStr(1); // -> '1'
     * toStr(false); // -> 'false'
     * toStr([1, 2, 3]); // -> '1,2,3'
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    function exports(val) {
        return val == null ? '' : val.toString();
    }

    return exports;
})();

/* ------------------------------ escapeJsStr ------------------------------ */

export var escapeJsStr = _.escapeJsStr = (function () {
    /* Escape string to be a valid JavaScript string literal between quotes.
     *
     * http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
     *
     * |Name  |Type  |Desc            |
     * |------|------|----------------|
     * |str   |string|String to escape|
     * |return|string|Escaped string  |
     * 
     * ```javascript
     * escapeJsStr('\"\n'); // -> '\\"\\\\n'
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * toStr 
     */

    function exports(str) {
        return toStr(str).replace(regEscapeChars, function(char) {
            switch (char) {
                case '"':
                case "'":
                case '\\':
                    return '\\' + char;
                case '\n':
                    return '\\n';
                case '\r':
                    return '\\r';
                // Line separator
                case '\u2028':
                    return '\\u2028';
                // Paragraph separator
                case '\u2029':
                    return '\\u2029';
            }
        });
    }

    var regEscapeChars = /["'\\\n\r\u2028\u2029]/g;

    return exports;
})();

/* ------------------------------ escapeJsonStr ------------------------------ */

export var escapeJsonStr = _.escapeJsonStr = (function () {
    /* Escape json string.
     */

    /* dependencies
     * escapeJsStr 
     */

    function exports(str) {
      return escapeJsStr(str)
        .replace(/\\'/g, "'")
        .replace(/\t/g, '\\t')
    }

    return exports;
})();

/* ------------------------------ has ------------------------------ */

export var has = _.has = (function () {
    /* Checks if key is a direct property.
     *
     * |Name  |Type   |Desc                            |
     * |------|-------|--------------------------------|
     * |obj   |object |Object to query                 |
     * |key   |string |Path to check                   |
     * |return|boolean|True if key is a direct property|
     *
     * ```javascript
     * has({one: 1}, 'one'); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    var hasOwnProp = Object.prototype.hasOwnProperty;

    function exports(obj, key) {
        return hasOwnProp.call(obj, key);
    }

    return exports;
})();

/* ------------------------------ identity ------------------------------ */

export var identity = _.identity = (function () {
    /* Return the first argument given.
     *
     * |Name  |Type|Desc       |
     * |------|----|-----------|
     * |val   |*   |Any value  |
     * |return|*   |Given value|
     *
     * ```javascript
     * identity('a'); // -> 'a'
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    function exports(val) {
        return val;
    }

    return exports;
})();

/* ------------------------------ objToStr ------------------------------ */

export var objToStr = _.objToStr = (function () {
    /* Alias of Object.prototype.toString.
     *
     * |Name  |Type  |Desc                                |
     * |------|------|------------------------------------|
     * |value |*     |Source value                        |
     * |return|string|String representation of given value|
     * 
     * ```javascript
     * objToStr(5); // -> '[object Number]'
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    var ObjToStr = Object.prototype.toString;

    function exports(val) {
        return ObjToStr.call(val);
    }

    return exports;
})();

/* ------------------------------ isArgs ------------------------------ */

export var isArgs = _.isArgs = (function () {
    /* Check if value is classified as an arguments object.
     *
     * |Name  |Type   |Desc                                |
     * |------|-------|------------------------------------|
     * |val   |*      |Value to check                      |
     * |return|boolean|True if value is an arguments object|
     *
     * ```javascript
     * (function () {
     *     isArgs(arguments); // -> true
     * })();
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * objToStr 
     */

    function exports(val) {
        return objToStr(val) === '[object Arguments]';
    }

    return exports;
})();

/* ------------------------------ isArr ------------------------------ */

export var isArr = _.isArr = (function (exports) {
    /* Check if value is an `Array` object.
     *
     * |Name  |Type   |Desc                              |
     * |------|-------|----------------------------------|
     * |val   |*      |Value to check                    |
     * |return|boolean|True if value is an `Array` object|
     *
     * ```javascript
     * isArr([]); // -> true
     * isArr({}); // -> false
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * objToStr 
     */

    exports =
        Array.isArray ||
        function(val) {
            return objToStr(val) === '[object Array]';
        };

    return exports;
})({});

/* ------------------------------ isNum ------------------------------ */

export var isNum = _.isNum = (function () {
    /* Check if value is classified as a Number primitive or object.
     *
     * |Name  |Type   |Desc                                 |
     * |------|-------|-------------------------------------|
     * |val   |*      |Value to check                       |
     * |return|boolean|True if value is correctly classified|
     * 
     * ```javascript
     * isNum(5); // -> true
     * isNum(5.1); // -> true
     * isNum({}); // -> false
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * objToStr 
     */

    function exports(val) {
        return objToStr(val) === '[object Number]';
    }

    return exports;
})();

/* ------------------------------ isFn ------------------------------ */

export var isFn = _.isFn = (function () {
    /* Check if value is a function.
     *
     * |Name  |Type   |Desc                       |
     * |------|-------|---------------------------|
     * |val   |*      |Value to check             |
     * |return|boolean|True if value is a function|
     *
     * Generator function is also classified as true.
     *
     * ```javascript
     * isFn(function() {}); // -> true
     * isFn(function*() {}); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * objToStr 
     */

    function exports(val) {
        var objStr = objToStr(val);

        return (
            objStr === '[object Function]' ||
            objStr === '[object GeneratorFunction]'
        );
    }

    return exports;
})();

/* ------------------------------ isArrLike ------------------------------ */

export var isArrLike = _.isArrLike = (function () {
    /* Check if value is array-like.
     *
     * |Name  |Type   |Desc                       |
     * |------|-------|---------------------------|
     * |val   |*      |Value to check             |
     * |return|boolean|True if value is array like|
     *
     * > Function returns false.
     *
     * ```javascript
     * isArrLike('test'); // -> true
     * isArrLike(document.body.children); // -> true;
     * isArrLike([1, 2, 3]); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * isNum isFn 
     */

    var MAX_ARR_IDX = Math.pow(2, 53) - 1;

    function exports(val) {
        if (!val) return false;

        var len = val.length;

        return isNum(len) && len >= 0 && len <= MAX_ARR_IDX && !isFn(val);
    }

    return exports;
})();

/* ------------------------------ isBrowser ------------------------------ */

export var isBrowser = _.isBrowser = (function (exports) {
    /* Check if running in a browser.
     *
     * ```javascript
     * console.log(isBrowser); // -> true if running in a browser
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    exports =
        typeof window === 'object' &&
        typeof document === 'object' &&
        document.nodeType === 9;

    return exports;
})({});

/* ------------------------------ root ------------------------------ */

export var root = _.root = (function (exports) {
    /* Root object reference, `global` in nodeJs, `window` in browser. */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * isBrowser 
     */

    exports = isBrowser ? window : global;

    return exports;
})({});

/* ------------------------------ detectMocha ------------------------------ */

export var detectMocha = _.detectMocha = (function () {
    /* Detect if mocha is running.
     *
     * ```javascript
     * detectMocha(); // -> True if mocha is running.
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * root 
     */

    function exports() {
        for (var i = 0, len = methods.length; i < len; i++) {
            var method = methods[i];

            if (typeof root[method] !== 'function') return false;
        }

        return true;
    }

    var methods = ['afterEach', 'after', 'beforeEach', 'before', 'describe', 'it'];

    return exports;
})();

/* ------------------------------ keys ------------------------------ */

export var keys = _.keys = (function (exports) {
    /* Create an array of the own enumerable property names of object.
     *
     * |Name  |Type  |Desc                   |
     * |------|------|-----------------------|
     * |obj   |object|Object to query        |
     * |return|array |Array of property names|
     * 
     * ```javascript
     * keys({a: 1}); // -> ['a']
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * has detectMocha 
     */

    if (Object.keys && !detectMocha()) {
        exports = Object.keys;
    } else {
        exports = function(obj) {
            var ret = [],
                key;

            for (key in obj) {
                if (has(obj, key)) ret.push(key);
            }

            return ret;
        };
    }

    return exports;
})({});

/* ------------------------------ each ------------------------------ */

export var each = _.each = (function () {
    /* Iterate over elements of collection and invokes iteratee for each element.
     *
     * |Name    |Type        |Desc                          |
     * |--------|------------|------------------------------|
     * |obj     |object array|Collection to iterate over    |
     * |iteratee|function    |Function invoked per iteration|
     * |[ctx]   |*           |Function context              |
     *
     * ```javascript
     * each({'a': 1, 'b': 2}, function (val, key) {});
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * isArrLike keys optimizeCb 
     */

    function exports(obj, iteratee, ctx) {
        iteratee = optimizeCb(iteratee, ctx);

        var i, len;

        if (isArrLike(obj)) {
            for (i = 0, len = obj.length; i < len; i++) iteratee(obj[i], i, obj);
        } else {
            var _keys = keys(obj);
            for (i = 0, len = _keys.length; i < len; i++) {
                iteratee(obj[_keys[i]], _keys[i], obj);
            }
        }

        return obj;
    }

    return exports;
})();

/* ------------------------------ createAssigner ------------------------------ */

export var createAssigner = _.createAssigner = (function () {
    /* Used to create extend, extendOwn and defaults.
     *
     * |Name    |Type    |Desc                          |
     * |--------|--------|------------------------------|
     * |keysFn  |function|Function to get object keys   |
     * |defaults|boolean |No override when set to true  |
     * |return  |function|Result function, extend...    |
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * isUndef each 
     */

    function exports(keysFn, defaults) {
        return function(obj) {
            each(arguments, function(src, idx) {
                if (idx === 0) return;

                var keys = keysFn(src);

                each(keys, function(key) {
                    if (!defaults || isUndef(obj[key])) obj[key] = src[key];
                });
            });

            return obj;
        };
    }

    return exports;
})();

/* ------------------------------ extend ------------------------------ */

export var extend = _.extend = (function (exports) {
    /* Copy all of the properties in the source objects over to the destination object.
     *
     * |Name  |Type  |Desc              |
     * |------|------|------------------|
     * |obj   |object|Destination object|
     * |...src|object|Sources objects   |
     * |return|object|Destination object|
     *
     * ```javascript
     * extend({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * createAssigner allKeys 
     */

    exports = createAssigner(allKeys);

    return exports;
})({});

/* ------------------------------ values ------------------------------ */

export var values = _.values = (function () {
    /* Create an array of the own enumerable property values of object.
     *
     * |Name  |Type  |Desc                    |
     * |------|------|------------------------|
     * |obj   |object|Object to query         |
     * |return|array |Array of property values|
     *
     * ```javascript
     * values({one: 1, two: 2}); // -> [1, 2]
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * each 
     */

    function exports(obj) {
        var ret = [];

        each(obj, function(val) {
            ret.push(val);
        });

        return ret;
    }

    return exports;
})();

/* ------------------------------ contain ------------------------------ */

export var contain = _.contain = (function () {
    /* Check if the value is present in the list.
     *
     * |Name  |Type        |Desc                                |
     * |------|------------|------------------------------------|
     * |array |array object|Target list                         |
     * |value |*           |Value to check                      |
     * |return|boolean     |True if value is present in the list|
     *
     * ```javascript
     * contain([1, 2, 3], 1); // -> true
     * contain({a: 1, b: 2}, 1); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * idxOf isArrLike values 
     */

    function exports(arr, val) {
        if (!isArrLike(arr)) arr = values(arr);

        return idxOf(arr, val) >= 0;
    }

    return exports;
})();

/* ------------------------------ extendOwn ------------------------------ */

export var extendOwn = _.extendOwn = (function (exports) {
    /* Like extend, but only copies own properties over to the destination object.
     *
     * |Name  |Type  |Desc              |
     * |------|------|------------------|
     * |obj   |object|Destination object|
     * |*src  |object|Sources objects   |
     * |return|object|Destination object|
     *
     * ```javascript
     * extendOwn({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * keys createAssigner 
     */

    exports = createAssigner(keys);

    return exports;
})({});

/* ------------------------------ isStr ------------------------------ */

export var isStr = _.isStr = (function () {
    /* Check if value is a string primitive.
     *
     * |Name  |Type   |Desc                               |
     * |------|-------|-----------------------------------|
     * |val   |*      |Value to check                     |
     * |return|boolean|True if value is a string primitive|
     *
     * ```javascript
     * isStr('licia'); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * objToStr 
     */

    function exports(val) {
        return objToStr(val) === '[object String]';
    }

    return exports;
})();

/* ------------------------------ isEmpty ------------------------------ */

export var isEmpty = _.isEmpty = (function () {
    /* Check if value is an empty object or array.
     *
     * |Name  |Type   |Desc                  |
     * |------|-------|----------------------|
     * |val   |*      |Value to check        |
     * |return|boolean|True if value is empty|
     *
     * ```javascript
     * isEmpty([]); // -> true
     * isEmpty({}); // -> true
     * isEmpty(''); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * isArrLike isArr isStr isArgs keys 
     */

    function exports(val) {
        if (val == null) return true;

        if (isArrLike(val) && (isArr(val) || isStr(val) || isArgs(val))) {
            return val.length === 0;
        }

        return keys(val).length === 0;
    }

    return exports;
})();

/* ------------------------------ isMatch ------------------------------ */

export var isMatch = _.isMatch = (function () {
    /* Check if keys and values in src are contained in obj.
     *
     * |Name  |Type   |Desc                              |
     * |------|-------|----------------------------------|
     * |obj   |object |Object to inspect                 |
     * |src   |object |Object of property values to match|
     * |return|boolean|True if object is match           |
     *
     * ```javascript
     * isMatch({a: 1, b: 2}, {a: 1}); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * keys 
     */

    function exports(obj, src) {
        var _keys = keys(src),
            len = _keys.length;

        if (obj == null) return !len;

        obj = Object(obj);

        for (var i = 0; i < len; i++) {
            var key = _keys[i];
            if (src[key] !== obj[key] || !(key in obj)) return false;
        }

        return true;
    }

    return exports;
})();

/* ------------------------------ isObj ------------------------------ */

export var isObj = _.isObj = (function () {
    /* Check if value is the language type of Object.
     *
     * |Name  |Type   |Desc                      |
     * |------|-------|--------------------------|
     * |val   |*      |Value to check            |
     * |return|boolean|True if value is an object|
     *
     * [Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
     *
     * ```javascript
     * isObj({}); // -> true
     * isObj([]); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    function exports(val) {
        var type = typeof val;

        return !!val && (type === 'function' || type === 'object');
    }

    return exports;
})();

/* ------------------------------ isRegExp ------------------------------ */

export var isRegExp = _.isRegExp = (function () {
    /* Check if value is a regular expression.
     *
     * |Name  |Type   |Desc                                 |
     * |------|-------|-------------------------------------|
     * |val   |*      |Value to check                       |
     * |return|boolean|True if value is a regular expression|
     *
     * ```javascript
     * isRegExp(/a/); // -> true
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * objToStr 
     */

    function exports(val) {
        return objToStr(val) === '[object RegExp]';
    }

    return exports;
})();

/* ------------------------------ last ------------------------------ */

export var last = _.last = (function () {
    /* Get the last element of array.
     *
     * |Name  |Type |Desc                     |
     * |------|-----|-------------------------|
     * |arr   |array|The array to query       |
     * |return|*    |The last element of array|
     *
     * ```javascript
     * last([1, 2]); // -> 2
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    function exports(arr) {
        var len = arr ? arr.length : 0;

        if (len) return arr[len - 1];
    }

    return exports;
})();

/* ------------------------------ matcher ------------------------------ */

export var matcher = _.matcher = (function () {
    /* Return a predicate function that checks if attrs are contained in an object.
     *
     * |Name  |Type    |Desc                              |
     * |------|--------|----------------------------------|
     * |attrs |object  |Object of property values to match|
     * |return|function|New predicate function            |
     *
     * ```javascript
     * var objects = [
     *     {a: 1, b: 2, c: 3 },
     *     {a: 4, b: 5, c: 6 }
     * ];
     * filter(objects, matcher({a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6 }]
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * extendOwn isMatch 
     */

    function exports(attrs) {
        attrs = extendOwn({}, attrs);

        return function(obj) {
            return isMatch(obj, attrs);
        };
    }

    return exports;
})();

/* ------------------------------ safeCb ------------------------------ */

export var safeCb = _.safeCb = (function (exports) {
    /* Create callback based on input value.
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * isFn isObj optimizeCb matcher identity 
     */

    exports = function(val, ctx, argCount) {
        if (val == null) return identity;

        if (isFn(val)) return optimizeCb(val, ctx, argCount);

        if (isObj(val)) return matcher(val);

        return function(key) {
            return function(obj) {
                return obj == null ? undefined : obj[key];
            };
        };
    };

    return exports;
})({});

/* ------------------------------ filter ------------------------------ */

export var filter = _.filter = (function () {
    /* Iterates over elements of collection, returning an array of all the values that pass a truth test.
     *
     * |Name     |Type    |Desc                                   |
     * |---------|--------|---------------------------------------|
     * |obj      |array   |Collection to iterate over             |
     * |predicate|function|Function invoked per iteration         |
     * |[ctx]    |*       |Predicate context                      |
     * |return   |array   |Array of all values that pass predicate|
     *
     * ```javascript
     * filter([1, 2, 3, 4, 5], function (val)
     * {
     *     return val % 2 === 0;
     * }); // -> [2, 4]
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * safeCb each 
     */

    function exports(obj, predicate, ctx) {
        var ret = [];

        predicate = safeCb(predicate, ctx);

        each(obj, function(val, idx, list) {
            if (predicate(val, idx, list)) ret.push(val);
        });

        return ret;
    }

    return exports;
})();

/* ------------------------------ uniqId ------------------------------ */

export var uniqId = _.uniqId = (function () {
    /* Generate a globally-unique id.
     *
     * |Name  |Type  |Desc              |
     * |------|------|------------------|
     * |prefix|string|Id prefix         |
     * |return|string|Globally-unique id|
     *
     * ```javascript
     * uniqId('eusita_'); // -> 'eustia_xxx'
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    var idCounter = 0;

    function exports(prefix) {
        var id = ++idCounter + '';

        return prefix ? prefix + id : id;
    }

    return exports;
})();

export default _;