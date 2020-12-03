// Built by eustia.
"use strict";

var _ = {};

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

/* ------------------------------ mkdir ------------------------------ */
_.mkdir = (function () {
    /* Recursively create directories.
     *
     * |Name       |Type    |Desc               |
     * |-----------|--------|-------------------|
     * |dir        |string  |Directory to create|
     * |[mode=0777]|number  |Directory mode     |
     * |callback   |function|Callback           |
     *
     * ```javascript
     * mkdir('/tmp/foo/bar/baz', function (err)
     * {
     *     if (err) console.log(err);
     *     else console.log('Done');
     * });
     * ```
     */

    /* module
     * env: node
     * test: node
     */

    /* dependencies
     * isFn noop 
     */

    var fs = require('fs'),
        path = require('path');

    var _0777 = parseInt('0777', 8);

    function exports(p, mode, cb) {
        if (isFn(mode)) {
            cb = mode;
            mode = _0777;
        }
        cb = cb || noop;
        p = path.resolve(p);

        fs.mkdir(p, mode, function(err) {
            if (!err) return cb();

            switch (err.code) {
                case 'ENOENT':
                    exports(path.dirname(p), mode, function(err) {
                        if (err) return cb(err);

                        exports(p, mode, cb);
                    });
                    break;
                default:
                    fs.stat(p, function(errStat, stat) {
                        if (errStat || !stat.isDirectory()) return cb(errStat);

                        cb();
                    });
            }
        });
    }

    return exports;
})();

/* ------------------------------ nextTick ------------------------------ */

var nextTick = _.nextTick = (function (exports) {
    /* Next tick for both node and browser.
     *
     * |Name|Type    |Desc            |
     * |----|--------|----------------|
     * |cb  |function|Function to call|
     *
     * Use process.nextTick if available.
     *
     * Otherwise setImmediate or setTimeout is used as fallback.
     *
     * ```javascript
     * nextTick(function ()
     * {
     *     // Do something...
     * });
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    if (typeof process === 'object' && process.nextTick) {
        exports = process.nextTick;
    } else if (typeof setImmediate === 'function') {
        exports = function(cb) {
            setImmediate(ensureCallable(cb));
        };
    } else {
        exports = function(cb) {
            setTimeout(ensureCallable(cb), 0);
        };
    }

    function ensureCallable(fn) {
        if (typeof fn !== 'function')
            throw new TypeError(fn + ' is not a function');

        return fn;
    }

    return exports;
})({});

/* ------------------------------ parallel ------------------------------ */
_.parallel = (function () {
    /* Run an array of functions in parallel.
     *
     * |Name |Type    |Desc                   |
     * |-----|--------|-----------------------|
     * |tasks|array   |Array of functions     |
     * |[cb] |function|Callback once completed|
     *
     * ```javascript
     * parallel([
     *     function(cb)
     *     {
     *         setTimeout(function () { cb(null, 'one') }, 200);
     *     },
     *     function(cb)
     *     {
     *         setTimeout(function () { cb(null, 'two') }, 100);
     *     }
     * ], function (err, results)
     * {
     *     // results -> ['one', 'two']
     * });
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * noop each nextTick 
     */

    function exports(tasks, cb) {
        cb = cb || noop;

        var results = [],
            pending = tasks.length;

        if (!pending) return done(null);

        each(tasks, function(task, i) {
            task(function(err, result) {
                taskCb(i, err, result);
            });
        });

        function taskCb(i, err, result) {
            results[i] = result;
            if (--pending === 0 || err) done(err);
        }

        function done(err) {
            nextTick(function() {
                cb(err, results);
                cb = noop;
            });
        }
    }

    return exports;
})();

/* ------------------------------ reduce ------------------------------ */
_.reduce = (function (exports) {
    /* Turn a list of values into a single value.
     *
     * |Name               |Type        |Desc                          |
     * |-------------------|------------|------------------------------|
     * |obj                |object array|Collection to iterate over    |
     * |[iteratee=identity]|function    |Function invoked per iteration|
     * |[initial]          |*           |Initial value                 |
     * |[ctx]              |*           |Function context              |
     * |return             |*           |Accumulated value             |
     *
     * ```javascript
     * reduce([1, 2, 3], function (sum, n) { return sum + n }, 0); // -> 6
     * ```
     */

    /* module
     * env: all
     * test: all
     */

    /* dependencies
     * optimizeCb isArrLike isUndef keys 
     */

    exports = createReduce(1);
    exports.create = createReduce;

    function createReduce(dir) {
        return function(obj, iteratee, initial, ctx) {
            iteratee = optimizeCb(iteratee, ctx);

            var i, len, key;

            if (isArrLike(obj)) {
                len = obj.length;
                i = dir > 0 ? 0 : len - 1;
                if (isUndef(initial)) {
                    initial = obj[i];
                    i += dir;
                }
                for (; i < len && i >= 0; i += dir) {
                    initial = iteratee(initial, obj[i], i, obj);
                }
            } else {
                var _keys = keys(obj);
                len = _keys.length;
                i = dir > 0 ? 0 : len - 1;
                if (isUndef(initial)) {
                    initial = obj[_keys[i]];
                    i += dir;
                }
                for (; i < len && i >= 0; i += dir) {
                    key = _keys[i];
                    initial = iteratee(initial, obj[key], key, obj);
                }
            }

            return initial;
        };
    }

    return exports;
})({});

module.exports = _;