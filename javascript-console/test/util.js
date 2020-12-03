// Built by eustia.
(function(root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define([], factory);
    } else if (typeof module === 'object' && module.exports)
    {
        module.exports = factory();
    } else { root.util = factory(); }
}(this, function ()
{
    "use strict";

    var _ = {};

    if (typeof window === 'object' && window.util) _ = window.util;

    /* ------------------------------ noop ------------------------------ */

    var noop = _.noop = (function () {
        /* A no-operation function.
         *
         * ```javascript
         * noop(); // Does nothing
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        function exports() {}

        return exports;
    })();

    /* ------------------------------ isObj ------------------------------ */

    var isObj = _.isObj = (function () {
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

    /* ------------------------------ allKeys ------------------------------ */

    var allKeys = _.allKeys = (function () {
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

    /* ------------------------------ isUndef ------------------------------ */

    var isUndef = _.isUndef = (function () {
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

    /* ------------------------------ ucs2 ------------------------------ */

    var ucs2 = _.ucs2 = (function (exports) {
        /* UCS-2 encoding and decoding.
         *
         * ### encode
         * 
         * Create a string using an array of code point values.
         * 
         * |Name  |Type  |Desc                |
         * |------|------|--------------------|
         * |arr   |array |Array of code points|
         * |return|string|Encoded string      |
         * 
         * ### decode
         * 
         * Create an array of code point values using a string.
         * 
         * |Name  |Type  |Desc                |
         * |------|------|--------------------|
         * |str   |string|Input string        |
         * |return|array |Array of code points|
         * 
         * ```javascript
         * ucs2.encode([0x61, 0x62, 0x63]); // -> 'abc'
         * ucs2.decode('abc'); // -> [0x61, 0x62, 0x63]
         * '𝌆'.length; // -> 2
         * ucs2.decode('𝌆').length; // -> 1
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        // https://mathiasbynens.be/notes/javascript-encoding
        exports = {
            encode: function(arr) {
                return String.fromCodePoint.apply(String, arr);
            },
            decode: function(str) {
                var ret = [];

                var i = 0,
                    len = str.length;

                while (i < len) {
                    var c = str.charCodeAt(i++);

                    // A high surrogate
                    if (c >= 0xd800 && c <= 0xdbff && i < len) {
                        var tail = str.charCodeAt(i++);
                        // nextC >= 0xDC00 && nextC <= 0xDFFF
                        if ((tail & 0xfc00) === 0xdc00) {
                            // C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000
                            ret.push(((c & 0x3ff) << 10) + (tail & 0x3ff) + 0x10000);
                        } else {
                            ret.push(c);
                            i--;
                        }
                    } else {
                        ret.push(c);
                    }
                }

                return ret;
            }
        };

        return exports;
    })({});

    /* ------------------------------ utf8 ------------------------------ */

    var utf8 = _.utf8 = (function (exports) {
        /* UTF-8 encoding and decoding.
         *
         * ### encode
         * 
         * Turn any UTF-8 decoded string into UTF-8 encoded string.
         * 
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |str   |string|String to encode|
         * |return|string|Encoded string  |
         * 
         * ### decode
         * 
         * |Name        |Type   |Desc                  |
         * |------------|-------|----------------------|
         * |str         |string |String to decode      |
         * |[safe=false]|boolean|Suppress error if true|
         * |return      |string |Decoded string        |
         * 
         * Turn any UTF-8 encoded string into UTF-8 decoded string.
         * 
         * ```javascript
         * utf8.encode('\uD800\uDC00'); // ->  '\xF0\x90\x80\x80'
         * utf8.decode('\xF0\x90\x80\x80'); // -> '\uD800\uDC00'
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        /* dependencies
         * ucs2 
         */

        // https://encoding.spec.whatwg.org/#utf-8
        exports = {
            encode: function(str) {
                var codePoints = ucs2.decode(str);

                var byteArr = '';

                for (var i = 0, len = codePoints.length; i < len; i++) {
                    byteArr += encodeCodePoint(codePoints[i]);
                }

                return byteArr;
            },
            decode: function decode(str, safe) {
                byteArr = ucs2.decode(str);
                byteIdx = 0;
                byteCount = byteArr.length;
                codePoint = 0;
                bytesSeen = 0;
                bytesNeeded = 0;
                lowerBoundary = 0x80;
                upperBoundary = 0xbf;

                var codePoints = [];

                var tmp;

                while ((tmp = decodeCodePoint(safe)) !== false) {
                    codePoints.push(tmp);
                }

                return ucs2.encode(codePoints);
            }
        };

        var fromCharCode = String.fromCharCode;

        function encodeCodePoint(codePoint) {
            // U+0000 to U+0080, ASCII code point
            if ((codePoint & 0xffffff80) === 0) {
                return fromCharCode(codePoint);
            }

            var ret = '',
                count,
                offset;

            // U+0080 to U+07FF, inclusive
            if ((codePoint & 0xfffff800) === 0) {
                count = 1;
                offset = 0xc0;
            } else if ((codePoint & 0xffff0000) === 0) {
                // U+0800 to U+FFFF, inclusive
                count = 2;
                offset = 0xe0;
            } else if ((codePoint & 0xffe00000) == 0) {
                // U+10000 to U+10FFFF, inclusive
                count = 3;
                offset = 0xf0;
            }

            ret += fromCharCode((codePoint >> (6 * count)) + offset);

            while (count > 0) {
                var tmp = codePoint >> (6 * (count - 1));
                ret += fromCharCode(0x80 | (tmp & 0x3f));
                count--;
            }

            return ret;
        }

        var byteArr,
            byteIdx,
            byteCount,
            codePoint,
            bytesSeen,
            bytesNeeded,
            lowerBoundary,
            upperBoundary;

        function decodeCodePoint(safe) {
            /* eslint-disable no-constant-condition */
            while (true) {
                if (byteIdx >= byteCount && bytesNeeded) {
                    if (safe) return goBack();
                    throw new Error('Invalid byte index');
                }

                if (byteIdx === byteCount) return false;

                var byte = byteArr[byteIdx];
                byteIdx++;

                if (!bytesNeeded) {
                    // 0x00 to 0x7F
                    if ((byte & 0x80) === 0) {
                        return byte;
                    }
                    // 0xC2 to 0xDF
                    if ((byte & 0xe0) === 0xc0) {
                        bytesNeeded = 1;
                        codePoint = byte & 0x1f;
                    } else if ((byte & 0xf0) === 0xe0) {
                        // 0xE0 to 0xEF
                        if (byte === 0xe0) lowerBoundary = 0xa0;
                        if (byte === 0xed) upperBoundary = 0x9f;
                        bytesNeeded = 2;
                        codePoint = byte & 0xf;
                    } else if ((byte & 0xf8) === 0xf0) {
                        // 0xF0 to 0xF4
                        if (byte === 0xf0) lowerBoundary = 0x90;
                        if (byte === 0xf4) upperBoundary = 0x8f;
                        bytesNeeded = 3;
                        codePoint = byte & 0x7;
                    } else {
                        if (safe) return goBack();
                        throw new Error('Invalid UTF-8 detected');
                    }

                    continue;
                }

                if (byte < lowerBoundary || byte > upperBoundary) {
                    if (safe) {
                        byteIdx--;
                        return goBack();
                    }
                    throw new Error('Invalid continuation byte');
                }

                lowerBoundary = 0x80;
                upperBoundary = 0xbf;

                codePoint = (codePoint << 6) | (byte & 0x3f);

                bytesSeen++;

                if (bytesSeen !== bytesNeeded) continue;

                var tmp = codePoint;

                codePoint = 0;
                bytesNeeded = 0;
                bytesSeen = 0;

                return tmp;
            }
        }

        function goBack() {
            var start = byteIdx - bytesSeen - 1;
            byteIdx = start + 1;
            codePoint = 0;
            bytesNeeded = 0;
            bytesSeen = 0;
            lowerBoundary = 0x80;
            upperBoundary = 0xbf;

            return byteArr[start];
        }

        return exports;
    })({});

    /* ------------------------------ optimizeCb ------------------------------ */

    var optimizeCb = _.optimizeCb = (function () {
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

    /* ------------------------------ toStr ------------------------------ */

    var toStr = _.toStr = (function () {
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

    /* ------------------------------ has ------------------------------ */

    var has = _.has = (function () {
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

    var identity = _.identity = (function () {
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

    var objToStr = _.objToStr = (function () {
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

    var isArgs = _.isArgs = (function () {
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

    /* ------------------------------ isFn ------------------------------ */

    var isFn = _.isFn = (function () {
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

    /* ------------------------------ isNum ------------------------------ */

    var isNum = _.isNum = (function () {
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

    /* ------------------------------ isArrLike ------------------------------ */

    var isArrLike = _.isArrLike = (function () {
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

    /* ------------------------------ isArr ------------------------------ */

    var isArr = _.isArr = (function (exports) {
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

    /* ------------------------------ isBrowser ------------------------------ */

    var isBrowser = _.isBrowser = (function (exports) {
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

    var root = _.root = (function (exports) {
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

    var detectMocha = _.detectMocha = (function () {
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

    var keys = _.keys = (function (exports) {
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

    var each = _.each = (function () {
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

    var createAssigner = _.createAssigner = (function () {
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

    /* ------------------------------ defaults ------------------------------ */

    var defaults = _.defaults = (function (exports) {
        /* Fill in undefined properties in object with the first value present in the following list of defaults objects.
         *
         * |Name  |Type  |Desc              |
         * |------|------|------------------|
         * |obj   |object|Destination object|
         * |*src  |object|Sources objects   |
         * |return|object|Destination object|
         *
         * ```javascript
         * defaults({name: 'RedHood'}, {name: 'Unknown', age: 24}); // -> {name: 'RedHood', age: 24}
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        /* dependencies
         * createAssigner allKeys 
         */

        exports = createAssigner(allKeys, true);

        return exports;
    })({});

    /* ------------------------------ extendOwn ------------------------------ */

    var extendOwn = _.extendOwn = (function (exports) {
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

    var isStr = _.isStr = (function () {
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

    var isEmpty = _.isEmpty = (function () {
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

    var isMatch = _.isMatch = (function () {
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

    /* ------------------------------ ltrim ------------------------------ */

    var ltrim = _.ltrim = (function () {
        /* Remove chars or white-spaces from beginning of string.
         *
         * |Name  |Type        |Desc              |
         * |------|------------|------------------|
         * |str   |string      |String to trim    |
         * |chars |string array|Characters to trim|
         * |return|string      |Trimmed string    |
         *
         * ```javascript
         * ltrim(' abc  '); // -> 'abc  '
         * ltrim('_abc_', '_'); // -> 'abc_'
         * ltrim('_abc_', ['a', '_']); // -> 'bc_'
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        var regSpace = /^\s+/;

        function exports(str, chars) {
            if (chars == null) return str.replace(regSpace, '');

            var start = 0,
                len = str.length,
                charLen = chars.length,
                found = true,
                i,
                c;

            while (found && start < len) {
                found = false;
                i = -1;
                c = str.charAt(start);

                while (++i < charLen) {
                    if (c === chars[i]) {
                        found = true;
                        start++;
                        break;
                    }
                }
            }

            return start >= len ? '' : str.substr(start, len);
        }

        return exports;
    })();

    /* ------------------------------ matcher ------------------------------ */

    var matcher = _.matcher = (function () {
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

    var safeCb = _.safeCb = (function (exports) {
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

    var filter = _.filter = (function () {
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

    /* ------------------------------ evalCss ------------------------------ */
    _.evalCss = (function () {
        /* Eval css.
         */

        /* dependencies
         * toStr each filter 
         */

        var styleList = [],
            scale = 1;

        function exports(css, container) {
            css = toStr(css);

            for (var i = 0, len = styleList.length; i < len; i++) {
                if (styleList[i].css === css) return;
            }

            container = container || exports.container || document.head;
            const el = document.createElement('style');

            el.type = 'text/css';
            container.appendChild(el);

            let style = { css, el, container };
            resetStyle(style);
            styleList.push(style);

            return style;
        }

        exports.setScale = function(s) {
            scale = s;
            each(styleList, style => resetStyle(style));
        };

        exports.clear = function() {
            each(styleList, ({ container, el }) => container.removeChild(el));
            styleList = [];
        };

        exports.remove = function(style) {
            styleList = filter(styleList, s => s !== style);

            style.container.removeChild(style.el);
        };

        function resetStyle({ css, el }) {
            el.innerText = css.replace(/(\d+)px/g, ($0, $1) => +$1 * scale + 'px');
        }

        return exports;
    })();

    /* ------------------------------ map ------------------------------ */

    var map = _.map = (function () {
        /* Create an array of values by running each element in collection through iteratee.
         *
         * |Name    |Type        |Desc                          |
         * |--------|------------|------------------------------|
         * |obj     |array object|Collection to iterate over    |
         * |iteratee|function    |Function invoked per iteration|
         * |[ctx]   |*           |Function context              |
         * |return  |array       |New mapped array              |
         *
         * ```javascript
         * map([4, 8], function (n) { return n * n; }); // -> [16, 64]
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        /* dependencies
         * safeCb keys isArrLike 
         */

        function exports(obj, iteratee, ctx) {
            iteratee = safeCb(iteratee, ctx);

            var _keys = !isArrLike(obj) && keys(obj),
                len = (_keys || obj).length,
                results = Array(len);

            for (var i = 0; i < len; i++) {
                var curKey = _keys ? _keys[i] : i;
                results[i] = iteratee(obj[curKey], curKey, obj);
            }

            return results;
        }

        return exports;
    })();

    /* ------------------------------ decodeUriComponent ------------------------------ */

    var decodeUriComponent = _.decodeUriComponent = (function () {
        /* Better decodeURIComponent that does not throw if input is invalid.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |str   |string|String to decode|
         * |return|string|Decoded string  |
         * 
         * ```javascript
         * decodeUriComponent('%%25%'); // -> '%%%'
         * decodeUriComponent('%E0%A4%A'); // -> '\xE0\xA4%A'
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        /* dependencies
         * each ucs2 map utf8 
         */

        function exports(str) {
            try {
                return decodeURIComponent(str);
            } catch (e) {
                var replaceMap = {};

                var matches = str.match(regMatcher);

                each(matches, function(match) {
                    str = str.replace(match, decode(match));
                });

                return str;
            }
        }

        function decode(str) {
            str = str.split('%').slice(1);

            var bytes = map(str, hexToInt);

            str = ucs2.encode(bytes);
            str = utf8.decode(str, true);

            return str;
        }

        function hexToInt(numStr) {
            return +('0x' + numStr);
        }

        var regMatcher = /(%[a-f0-9]{2})+/gi;

        return exports;
    })();

    /* ------------------------------ cookie ------------------------------ */
    _.cookie = (function (exports) {
        /* Simple api for handling browser cookies.
         *
         * ### get
         *
         * Get cookie value.
         *
         * |Name  |Type  |Desc                      |
         * |------|------|--------------------------|
         * |key   |string|Cookie key                |
         * |return|string|Corresponding cookie value|
         *
         * ### set
         *
         * Set cookie value.
         *
         * |Name     |Type   |Desc          |
         * |---------|-------|--------------|
         * |key      |string |Cookie key    |
         * |val      |string |Cookie value  |
         * |[options]|object |Cookie options|
         * |return   |exports|Module cookie |
         *
         * ### remove
         *
         * Remove cookie value.
         *
         * |Name     |Type   |Desc          |
         * |---------|-------|--------------|
         * |key      |string |Cookie key    |
         * |[options]|object |Cookie options|
         * |return   |exports|Module cookie |
         *
         * ```javascript
         * cookie.set('a', '1', {path: '/'});
         * cookie.get('a'); // -> '1'
         * cookie.remove('a');
         * ```
         */

        /* module
         * env: browser
         * test: browser
         */

        /* dependencies
         * defaults isNum isUndef decodeUriComponent 
         */

        var defOpts = { path: '/' };

        function setCookie(key, val, options) {
            if (!isUndef(val)) {
                options = options || {};
                options = defaults(options, defOpts);

                if (isNum(options.expires)) {
                    var expires = new Date();
                    expires.setMilliseconds(
                        expires.getMilliseconds() + options.expires * 864e5
                    );
                    options.expires = expires;
                }

                val = encodeURIComponent(val);
                key = encodeURIComponent(key);

                document.cookie = [
                    key,
                    '=',
                    val,
                    options.expires && '; expires=' + options.expires.toUTCString(),
                    options.path && '; path=' + options.path,
                    options.domain && '; domain=' + options.domain,
                    options.secure ? '; secure' : ''
                ].join('');

                return exports;
            }

            var cookies = document.cookie ? document.cookie.split('; ') : [],
                result = key ? undefined : {};

            for (var i = 0, len = cookies.length; i < len; i++) {
                var c = cookies[i],
                    parts = c.split('='),
                    name = decodeUriComponent(parts.shift());

                c = parts.join('=');
                c = decodeUriComponent(c);

                if (key === name) {
                    result = c;
                    break;
                }

                if (!key) result[name] = c;
            }

            return result;
        }

        exports = {
            get: setCookie,
            set: setCookie,
            remove: function(key, options) {
                options = options || {};
                options.expires = -1;

                return setCookie(key, '', options);
            }
        };

        return exports;
    })({});

    /* ------------------------------ rtrim ------------------------------ */

    var rtrim = _.rtrim = (function () {
        /* Remove chars or white-spaces from end of string.
         *
         * |Name  |Type        |Desc              |
         * |------|------------|------------------|
         * |str   |string      |String to trim    |
         * |chars |string array|Characters to trim|
         * |return|string      |Trimmed string    |
         *
         * ```javascript
         * rtrim(' abc  '); // -> ' abc'
         * rtrim('_abc_', '_'); // -> '_abc'
         * rtrim('_abc_', ['c', '_']); // -> '_ab'
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        var regSpace = /\s+$/;

        function exports(str, chars) {
            if (chars == null) return str.replace(regSpace, '');

            var end = str.length - 1,
                charLen = chars.length,
                found = true,
                i,
                c;

            while (found && end >= 0) {
                found = false;
                i = -1;
                c = str.charAt(end);

                while (++i < charLen) {
                    if (c === chars[i]) {
                        found = true;
                        end--;
                        break;
                    }
                }
            }

            return end >= 0 ? str.substring(0, end + 1) : '';
        }

        return exports;
    })();

    /* ------------------------------ trim ------------------------------ */

    var trim = _.trim = (function () {
        /* Remove chars or white-spaces from beginning end of string.
         *
         * |Name  |Type        |Desc              |
         * |------|------------|------------------|
         * |str   |string      |String to trim    |
         * |chars |string array|Characters to trim|
         * |return|string      |Trimmed string    |
         *
         * ```javascript
         * trim(' abc  '); // -> 'abc'
         * trim('_abc_', '_'); // -> 'abc'
         * trim('_abc_', ['a', 'c', '_']); // -> 'b'
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        /* dependencies
         * ltrim rtrim 
         */

        var regSpace = /^\s+|\s+$/g;

        function exports(str, chars) {
            if (chars == null) return str.replace(regSpace, '');

            return ltrim(rtrim(str, chars), chars);
        }

        return exports;
    })();

    /* ------------------------------ query ------------------------------ */

    var query = _.query = (function (exports) {
        /* Parse and stringify url query strings.
         *
         * ### parse
         *
         * Parse a query string into an object.
         *
         * |Name  |Type  |Desc        |
         * |------|------|------------|
         * |str   |string|Query string|
         * |return|object|Query object|
         *
         * ### stringify
         *
         * Stringify an object into a query string.
         *
         * |Name  |Type  |Desc        |
         * |------|------|------------|
         * |obj   |object|Query object|
         * |return|string|Query string|
         *
         * ```javascript
         * query.parse('foo=bar&eruda=true'); // -> {foo: 'bar', eruda: 'true'}
         * query.stringify({foo: 'bar', eruda: 'true'}); // -> 'foo=bar&eruda=true'
         * query.parse('name=eruda&name=eustia'); // -> {name: ['eruda', 'eustia']}
         * ```
         */

        /* module
         * env: all
         * test: all
         */

        /* dependencies
         * trim each isUndef isArr map isEmpty filter isObj 
         */

        exports = {
            parse: function(str) {
                var ret = {};

                str = trim(str).replace(regIllegalChars, '');

                each(str.split('&'), function(param) {
                    var parts = param.split('=');

                    var key = parts.shift(),
                        val = parts.length > 0 ? parts.join('=') : null;

                    key = decodeURIComponent(key);
                    val = decodeURIComponent(val);

                    if (isUndef(ret[key])) {
                        ret[key] = val;
                    } else if (isArr(ret[key])) {
                        ret[key].push(val);
                    } else {
                        ret[key] = [ret[key], val];
                    }
                });

                return ret;
            },
            stringify: function(obj, arrKey) {
                return filter(
                    map(obj, function(val, key) {
                        if (isObj(val) && isEmpty(val)) return '';
                        if (isArr(val)) return exports.stringify(val, key);

                        return (
                            (arrKey
                                ? encodeURIComponent(arrKey)
                                : encodeURIComponent(key)) +
                            '=' +
                            encodeURIComponent(val)
                        );
                    }),
                    function(str) {
                        return str.length > 0;
                    }
                ).join('&');
            }
        };

        var regIllegalChars = /^(\?|#|&)/g;

        return exports;
    })({});

    /* ------------------------------ ajax ------------------------------ */
    _.ajax = (function () {
        /* Perform an asynchronous HTTP request.
         *
         * |Name   |Type  |Desc        |
         * |-------|------|------------|
         * |options|object|Ajax options|
         *
         * Available options:
         *
         * |Name                                         |Type         |Desc                      |
         * |---------------------------------------------|-------------|---------------------------|
         * |url                                          |string       |Request url                |
         * |data                                         |string object|Request data               |
         * |dataType=json                                |string       |Response type(json, xml)   |
         * |contentType=application/x-www-form-urlencoded|string       |Request header Content-Type|
         * |success                                      |function     |Success callback           |
         * |error                                        |function     |Error callback             |
         * |complete                                     |function     |Callback after request     |
         * |timeout                                      |number       |Request timeout            |
         *
         * ### get
         *
         * Shortcut for type = GET;
         *
         * ### post
         *
         * Shortcut for type = POST;
         *
         * |Name    |Type         |Desc            |
         * |--------|-------------|----------------|
         * |url     |string       |Request url     |
         * |[data]  |string object|Request data    |
         * |success |function     |Success callback|
         * |dataType|function     |Response type   |
         *
         * ```javascript
         * ajax({
         *     url: 'http://example.com',
         *     data: {test: 'true'},
         *     error: function () {},
         *     success: function (data)
         *     {
         *         // ...
         *     },
         *     dataType: 'json'
         * });
         *
         * ajax.get('http://example.com', {}, function (data)
         * {
         *     // ...
         * });
         * ```
         */

        /* module
         * env: browser
         * test: manual
         */

        /* dependencies
         * isFn noop defaults isObj query 
         */

        function exports(options) {
            defaults(options, exports.setting);

            var type = options.type,
                url = options.url,
                data = options.data,
                dataType = options.dataType,
                success = options.success,
                error = options.error,
                timeout = options.timeout,
                complete = options.complete,
                xhr = options.xhr(),
                abortTimeout;

            xhr.onreadystatechange = function() {
                if (xhr.readyState !== 4) return;

                clearTimeout(abortTimeout);

                var result;

                var status = xhr.status;
                if ((status >= 200 && status < 300) || status === 304) {
                    result = xhr.responseText;
                    if (dataType === 'xml') result = xhr.responseXML;
                    try {
                        if (dataType === 'json') result = JSON.parse(result);
                        /* eslint-disable no-empty */
                    } catch (e) {}
                    success(result, xhr);
                } else {
                    error(xhr);
                }

                complete(xhr);
            };

            if (type === 'GET') {
                data = query.stringify(data);
                url += url.indexOf('?') > -1 ? '&' + data : '?' + data;
            } else if (options.contentType === 'application/x-www-form-urlencoded') {
                if (isObj(data)) data = query.stringify(data);
            } else if (options.contentType === 'application/json') {
                if (isObj(data)) data = JSON.stringify(data);
            }

            xhr.open(type, url, true);
            xhr.setRequestHeader('Content-Type', options.contentType);

            if (timeout > 0) {
                abortTimeout = setTimeout(function() {
                    xhr.onreadystatechange = noop;
                    xhr.abort();
                    error(xhr, 'timeout');
                    complete(xhr);
                }, timeout);
            }
            xhr.send(type === 'GET' ? null : data);

            return xhr;
        }

        exports.setting = {
            type: 'GET',
            success: noop,
            error: noop,
            complete: noop,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
            data: {},
            xhr: function() {
                return new XMLHttpRequest();
            },
            timeout: 0
        };

        exports.get = function() {
            return exports(parseArgs.apply(null, arguments));
        };

        exports.post = function() {
            var options = parseArgs.apply(null, arguments);
            options.type = 'POST';

            return exports(options);
        };

        function parseArgs(url, data, success, dataType) {
            if (isFn(data)) {
                dataType = success;
                success = data;
                data = {};
            }

            return {
                url: url,
                data: data,
                success: success,
                dataType: dataType
            };
        }

        return exports;
    })();

    return _;
}));