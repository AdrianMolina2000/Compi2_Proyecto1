(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Nodo {
    constructor(tipo, line, column) {
        this.tipo = tipo;
        this.line = line;
        this.column = column;
    }
}
exports.Nodo = Nodo;

},{}],5:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_linked_list_1 = __importDefault(require("ts-linked-list"));
class NodoAST {
    constructor(valor) {
        this.hijos = new ts_linked_list_1.default();
        this.valor = valor;
    }
    setHijos(hijos) {
        this.hijos = hijos;
    }
    agregarHijo(hijo) {
        if (hijo instanceof NodoAST) {
            this.hijos.append(hijo);
        }
        else {
            this.hijos.append(new NodoAST(hijo));
        }
    }
    agregarHijos(hijos) {
        hijos.forEach(hijo => this.hijos.append(hijo));
    }
    agregarPrimerHijo(hijo) {
        if (hijo instanceof String) {
            this.hijos.push(new NodoAST(hijo));
        }
        else if (hijo instanceof NodoAST) {
            this.hijos.push(hijo);
        }
    }
    getValor() {
        return this.valor;
    }
    setValor(cad) {
        this.valor = cad;
    }
    getHijos() {
        return this.hijos;
    }
}
exports.NodoAST = NodoAST;

},{"ts-linked-list":20}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
function esEntero(numero) {
    if (numero % 1 == 0) {
        return true;
    }
    else {
        return false;
    }
}
class Aritmetica extends Nodo_1.Nodo {
    constructor(operadorIzq, operadorDer, operador, line, column) {
        super(null, line, column);
        this.operadorIzq = operadorIzq;
        this.operadorDer = operadorDer;
        this.operador = operador;
    }
    execute(table, tree) {
        if (this.operadorIzq !== null) {
            const resultadoIzq = this.operadorIzq.execute(table, tree);
            if (resultadoIzq instanceof Excepcion_1.Excepcion) {
                return resultadoIzq;
            }
            const resultadoDerecho = this.operadorDer.execute(table, tree);
            if (resultadoDerecho instanceof Excepcion_1.Excepcion) {
                return resultadoDerecho;
            }
            if (this.operador === '+') {
                //ENTERO + 
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    //ENTERO + ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq + resultadoDerecho;
                        //ENTERO + DECIMAL = DECIMAL
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho;
                        //ENTERO + CHAR = ENTERO
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq + resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE + 
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    //DOUBLE + ENTERO = DOUBLE
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho;
                        //DOUBLE + DOUBLE = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho;
                        //DOUBLE + CARACTER = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //BOOLEAN +
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    //CHAR + ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) + resultadoDerecho;
                        //CHAR + DOUBLE = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) + resultadoDerecho;
                        //CHAR + CHAR = STRING
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        return resultadoIzq + resultadoDerecho;
                        //CHAR + STRING = STRING
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //STRING
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '&') {
                //ENTERO &
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO ||
                    this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL ||
                    this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO ||
                    this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING ||
                    this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.STRING ||
                        this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO ||
                        this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL ||
                        this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO ||
                        this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        return resultadoIzq + "" + resultadoDerecho;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden concatenar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Concatenar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '-') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq - resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq - resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE -
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //BOOLEAN -
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    //BOOL - ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        if (resultadoIzq === true) {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                            return 1 - resultadoDerecho;
                        }
                        else {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                            return 0 - resultadoDerecho;
                        }
                        //BOOL - DOUBLE = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        if (resultadoIzq === true) {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                            return 1 - resultadoDerecho;
                        }
                        else {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                            return 0 - resultadoDerecho;
                        }
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //CHAR -
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    //CHAR - ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) - resultadoDerecho;
                        //CHAR - DOUBLE = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) - resultadoDerecho;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '*') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq * resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE *
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //CHAR *
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) * resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '/') {
                if (resultadoDerecho === 0) {
                    const error = new Excepcion_1.Excepcion('Semantico', `Error aritmetico, La division con cero no esta permitida`, this.line, this.column);
                    tree.excepciones.push(error);
                    return error;
                }
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE /
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //CHAR /
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) / resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '^') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '%') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar modulo con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE ^
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar modulo los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) % resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar modulo los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar modulo los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `Error, Operador desconocido`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        else {
            const resultadoDerecho = this.operadorDer.execute(table, tree);
            if (resultadoDerecho instanceof Excepcion_1.Excepcion) {
                return resultadoDerecho;
            }
            if (this.operador === '-') {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                    return -1 * resultadoDerecho;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                    return -1 * resultadoDerecho;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `Error, Operador desconocido`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ARITMETICA");
        if (this.operadorIzq != null) {
            nodo.agregarHijo(this.operadorIzq.getNodo());
            nodo.agregarHijo(this.operador + "");
            nodo.agregarHijo(this.operadorDer.getNodo());
        }
        else {
            nodo.agregarHijo(this.operador + "");
            nodo.agregarHijo(this.operadorDer.getNodo());
        }
        return nodo;
    }
}
exports.Aritmetica = Aritmetica;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":18,"../other/tipo":19}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Length extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.ENTERO), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return resultado.length;
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error con la longitud buscada`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("LENGTH");
            nodo.agregarHijo("Length");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("LENGTH");
            return nodo;
        }
    }
}
exports.Length = Length;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":18,"../other/tipo":19}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Logico extends Nodo_1.Nodo {
    constructor(operadorIzq, operadorDer, operador, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.BOOLEANO), line, column);
        this.operadorIzq = operadorIzq;
        this.operadorDer = operadorDer;
        this.operador = operador;
    }
    execute(table, tree) {
        if (this.operadorIzq !== null) {
            const resultadoIzq = this.operadorIzq.execute(table, tree);
            if (resultadoIzq instanceof Excepcion_1.Excepcion) {
                return resultadoIzq;
            }
            const resultadoDer = this.operadorDer.execute(table, tree);
            if (resultadoDer instanceof Excepcion_1.Excepcion) {
                return resultadoDer;
            }
            if (this.operador === '||') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO && this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq || resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede operar OR con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '&&') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO && this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq && resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede operar AND con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `Error, Operador desconocido`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        else {
            const resultadoDer = this.operadorDer.execute(table, tree);
            if (resultadoDer instanceof Excepcion_1.Excepcion) {
                return resultadoDer;
            }
            if (this.operador === '!') {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return !resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede operar Not con el tipo ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `Error, Operador desconocido`, this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("LOGICO");
        if (this.operadorIzq != null) {
            nodo.agregarHijo(this.operadorIzq.getNodo());
            nodo.agregarHijo(this.operador + "");
            nodo.agregarHijo(this.operadorDer.getNodo());
        }
        else {
            nodo.agregarHijo(this.operador + "");
            nodo.agregarHijo(this.operadorDer.getNodo());
        }
        return nodo;
    }
}
exports.Logico = Logico;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":18,"../other/tipo":19}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
// Esta clase crea un nodo del tipo primitivo, ya sea int, double, string, char, boolean
class Primitivo extends Nodo_1.Nodo {
    constructor(tipo, valor, line, column) {
        super(tipo, line, column);
        this.valor = valor;
    }
    execute(table, tree) {
        return this.valor;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("PRIMITIVO");
        nodo.agregarHijo(this.valor + '');
        return nodo;
    }
}
exports.Primitivo = Primitivo;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Relacional extends Nodo_1.Nodo {
    constructor(operadorIzq, operadorDer, operador, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.BOOLEANO), line, column);
        this.operadorIzq = operadorIzq;
        this.operadorDer = operadorDer;
        this.operador = operador;
    }
    execute(table, tree) {
        const resultadoIzq = this.operadorIzq.execute(table, tree);
        if (resultadoIzq instanceof Excepcion_1.Excepcion) {
            return resultadoIzq;
        }
        const resultadoDer = this.operadorDer.execute(table, tree);
        if (resultadoDer instanceof Excepcion_1.Excepcion) {
            return resultadoDer;
        }
        if (this.operador === '<') {
            if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq < resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq < resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq < resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq < resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq < resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq < resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) < resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) < resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) < resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq < resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR QUE se esta tratando de operar con los tipos${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.STRING) {
                    return resultadoIzq < resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        }
        else if (this.operador === '<=') {
            if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq <= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq <= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq <= resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq <= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq <= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq <= resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) <= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) <= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) <= resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq <= resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.STRING) {
                    return resultadoIzq <= resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        }
        else if (this.operador === '>') {
            if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq > resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq > resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq > resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq > resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq > resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq > resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) > resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) > resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) > resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq > resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.STRING) {
                    return resultadoIzq > resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        }
        else if (this.operador === '>=') {
            if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq >= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq >= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq >= resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq >= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq >= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq >= resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) >= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) >= resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) >= resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq >= resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.STRING) {
                    return resultadoIzq >= resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        }
        else if (this.operador === '!=') {
            if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq != resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq != resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq != resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq != resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq != resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq != resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) != resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) != resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) != resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq != resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.STRING) {
                    return resultadoIzq != resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        }
        else if (this.operador === '==') {
            if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq == resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq == resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq == resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq == resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq == resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq == resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) == resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) == resultadoDer;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) == resultadoDer.charCodeAt(0);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq == resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.STRING) {
                    return resultadoIzq == resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `Operador desconocido`, this.line, this.column);
            tree.excepciones.push(error);
            // tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("RELACIONAL");
        nodo.agregarHijo(this.operadorIzq.getNodo());
        nodo.agregarHijo(this.operador + "");
        nodo.agregarHijo(this.operadorDer.getNodo());
        return nodo;
    }
}
exports.Relacional = Relacional;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":18,"../other/tipo":19}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class ToLower extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.STRING), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return resultado.toLowerCase();
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al convertir en minusculas`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("TOLOWER");
            nodo.agregarHijo("ToLower");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("ToLower");
            return nodo;
        }
    }
}
exports.ToLower = ToLower;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":18,"../other/tipo":19}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class ToUpper extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.STRING), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return resultado.toUpperCase();
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al convertir en mayusculas`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("TOUPPER");
            nodo.agregarHijo("ToUpper");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("ToUpper");
            return nodo;
        }
    }
}
exports.ToUpper = ToUpper;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":18,"../other/tipo":19}],13:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var grammar = (function () {
    var o = function (k, v, o, l) { for (o = o || {}, l = k.length; l--; o[k[l]] = v)
        ; return o; }, $V0 = [1, 14], $V1 = [1, 10], $V2 = [1, 17], $V3 = [1, 18], $V4 = [1, 19], $V5 = [1, 21], $V6 = [1, 22], $V7 = [1, 23], $V8 = [1, 24], $V9 = [1, 25], $Va = [1, 26], $Vb = [1, 27], $Vc = [1, 28], $Vd = [1, 29], $Ve = [1, 30], $Vf = [1, 31], $Vg = [1, 32], $Vh = [5, 10, 19, 34, 36, 37, 43, 45, 47, 50, 52, 53, 54, 55, 59, 60, 103, 104, 105, 106, 107], $Vi = [1, 44], $Vj = [1, 47], $Vk = [1, 45], $Vl = [1, 46], $Vm = [1, 70], $Vn = [1, 79], $Vo = [1, 78], $Vp = [1, 63], $Vq = [1, 64], $Vr = [1, 65], $Vs = [1, 66], $Vt = [1, 67], $Vu = [1, 68], $Vv = [1, 69], $Vw = [1, 71], $Vx = [1, 72], $Vy = [1, 73], $Vz = [1, 74], $VA = [1, 75], $VB = [1, 76], $VC = [1, 81], $VD = [1, 82], $VE = [1, 83], $VF = [1, 84], $VG = [1, 85], $VH = [10, 26, 40], $VI = [1, 91], $VJ = [8, 13], $VK = [1, 113], $VL = [1, 112], $VM = [1, 114], $VN = [1, 115], $VO = [1, 116], $VP = [1, 117], $VQ = [1, 118], $VR = [1, 119], $VS = [1, 120], $VT = [1, 121], $VU = [1, 122], $VV = [1, 123], $VW = [1, 124], $VX = [1, 125], $VY = [1, 126], $VZ = [1, 127], $V_ = [1, 128], $V$ = [8, 13, 29, 41, 44, 51, 63, 64, 65, 66, 67, 73, 74, 75, 76, 77, 78, 80, 81, 82, 83, 89, 96], $V01 = [1, 154], $V11 = [8, 29, 41], $V21 = [1, 209], $V31 = [1, 228], $V41 = [1, 224], $V51 = [8, 13, 29, 41, 44, 51, 63, 64, 73, 74, 75, 76, 77, 78, 80, 81, 82, 83, 89, 96], $V61 = [8, 13, 29, 41, 44, 51, 73, 74, 80, 81, 82, 83, 89, 96], $V71 = [8, 13, 29, 41, 44, 51, 73, 74, 75, 76, 77, 78, 80, 81, 82, 83, 89, 96], $V81 = [8, 13, 29, 41, 44, 51, 80, 81, 82, 83, 89, 96], $V91 = [5, 10, 19, 34, 36, 37, 43, 45, 46, 47, 50, 52, 53, 54, 55, 59, 60, 103, 104, 105, 106, 107], $Va1 = [1, 283], $Vb1 = [8, 45], $Vc1 = [45, 50, 52];
    var parser = { trace: function trace() { },
        yy: {},
        symbols_: { "error": 2, "INICIO": 3, "LISTA_INSTRUCCIONES": 4, "EOF": 5, "Verificar_params": 6, "PARAMETROS": 7, ",": 8, "TIPO": 9, "identifier": 10, "ListaIns": 11, "PRINT": 12, ";": 13, "DECLARACION": 14, "ASIGNACION": 15, "LLAMAR": 16, "IF": 17, "SWITCH": 18, "break": 19, "WHILE": 20, "DO": 21, "FOR": 22, "decremento": 23, "incremento": 24, "RETURN": 25, ".": 26, "pop": 27, "(": 28, ")": 29, "push": 30, "EXPRESION": 31, "STRUCT": 32, "ListaIns2": 33, "print": 34, "LISTA_EXPRESION": 35, "println": 36, "printf": 37, "=": 38, "LISTA_ID": 39, "[": 40, "]": 41, "PARAMETROS_LLAMADA": 42, "if": 43, "{": 44, "}": 45, "else": 46, "switch": 47, "CASE_LIST": 48, "DEFAULT_LIST": 49, "case": 50, ":": 51, "default": 52, "while": 53, "do": 54, "for": 55, "in": 56, "forVar": 57, "for_increment": 58, "return": 59, "struct": 60, "Lista_declaracion": 61, "OPCION_DECLARACIO_Struct": 62, "-": 63, "+": 64, "*": 65, "/": 66, "%": 67, "sin": 68, "cos": 69, "tan": 70, "pow": 71, "sqrt": 72, "==": 73, "!=": 74, ">=": 75, ">": 76, "<=": 77, "<": 78, "!": 79, "&&": 80, "||": 81, "&": 82, "^": 83, "caracterOfPosition": 84, "subString": 85, "lenght": 86, "toUppercase": 87, "toLowercase": 88, "?": 89, "null": 90, "numero": 91, "true": 92, "false": 93, "caracter": 94, "cadena": 95, "#": 96, "parse": 97, "toInt": 98, "toDouble": 99, "string": 100, "typeof": 101, "log": 102, "double": 103, "String": 104, "int": 105, "boolean": 106, "char": 107, "$accept": 0, "$end": 1 },
        terminals_: { 2: "error", 5: "EOF", 8: ",", 10: "identifier", 13: ";", 19: "break", 23: "decremento", 24: "incremento", 26: ".", 27: "pop", 28: "(", 29: ")", 30: "push", 34: "print", 36: "println", 37: "printf", 38: "=", 40: "[", 41: "]", 43: "if", 44: "{", 45: "}", 46: "else", 47: "switch", 50: "case", 51: ":", 52: "default", 53: "while", 54: "do", 55: "for", 56: "in", 59: "return", 60: "struct", 63: "-", 64: "+", 65: "*", 66: "/", 67: "%", 68: "sin", 69: "cos", 70: "tan", 71: "pow", 72: "sqrt", 73: "==", 74: "!=", 75: ">=", 76: ">", 77: "<=", 78: "<", 79: "!", 80: "&&", 81: "||", 82: "&", 83: "^", 84: "caracterOfPosition", 85: "subString", 86: "lenght", 87: "toUppercase", 88: "toLowercase", 89: "?", 90: "null", 91: "numero", 92: "true", 93: "false", 94: "caracter", 95: "cadena", 96: "#", 97: "parse", 98: "toInt", 99: "toDouble", 100: "string", 101: "typeof", 102: "log", 103: "double", 104: "String", 105: "int", 106: "boolean", 107: "char" },
        productions_: [0, [3, 2], [6, 1], [6, 0], [7, 4], [7, 2], [4, 2], [4, 1], [11, 2], [11, 2], [11, 2], [11, 2], [11, 1], [11, 1], [11, 2], [11, 1], [11, 2], [11, 1], [11, 3], [11, 3], [11, 2], [11, 5], [11, 6], [11, 2], [33, 2], [33, 2], [33, 2], [33, 2], [33, 1], [33, 2], [33, 1], [33, 2], [33, 1], [33, 3], [33, 3], [33, 2], [33, 5], [33, 6], [33, 2], [12, 4], [12, 4], [12, 4], [35, 3], [35, 1], [14, 4], [14, 2], [14, 6], [14, 4], [39, 3], [39, 1], [15, 3], [15, 5], [15, 7], [15, 9], [15, 11], [15, 6], [16, 4], [16, 3], [42, 3], [42, 1], [17, 7], [17, 5], [17, 11], [17, 9], [17, 9], [17, 7], [18, 8], [18, 7], [18, 7], [48, 5], [48, 4], [49, 3], [20, 7], [21, 9], [22, 7], [22, 11], [57, 4], [57, 3], [58, 2], [58, 2], [58, 3], [25, 2], [25, 1], [32, 5], [61, 4], [61, 2], [62, 1], [62, 1], [62, 3], [31, 2], [31, 3], [31, 3], [31, 3], [31, 3], [31, 3], [31, 4], [31, 4], [31, 4], [31, 6], [31, 4], [31, 3], [31, 3], [31, 3], [31, 3], [31, 3], [31, 3], [31, 2], [31, 3], [31, 3], [31, 3], [31, 3], [31, 6], [31, 8], [31, 5], [31, 5], [31, 5], [31, 5], [31, 1], [31, 1], [31, 1], [31, 1], [31, 1], [31, 1], [31, 1], [31, 1], [31, 3], [31, 4], [31, 6], [31, 2], [31, 3], [31, 3], [31, 6], [31, 4], [31, 4], [31, 4], [31, 4], [31, 4], [31, 5], [9, 1], [9, 1], [9, 1], [9, 1], [9, 1]],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
            /* this == yyval */
            var $0 = $$.length - 1;
            switch (yystate) {
                case 1:
                    this.$ = new Tree($$[$0 - 1]);
                    return this.$;
                    break;
                case 6:
                    this.$ = $$[$0 - 1];
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 7:
                    this.$ = [$$[$0]];
                    break;
                case 8:
                case 24:
                    this.$ = $$[$0 - 1];
                    break;
                case 39:
                    this.$ = new Print($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column, 1);
                    break;
                case 40:
                    this.$ = new Print($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column, 2);
                    console.log("normaaaaaaaal");
                    break;
                case 42:
                case 48:
                    this.$ = $$[$0 - 2];
                    $$[$0 - 2].push($$[$0]);
                    break;
                case 43:
                case 49:
                    this.$ = [];
                    this.$.push($$[$0]);
                    break;
                case 89:
                    this.$ = new Aritmetica(null, $$[$0], '-', _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    break;
                case 90:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '+', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 91:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '-', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 92:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '*', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 93:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '/', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 94:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '%', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 100:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '==', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 101:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '!=', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 102:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '>=', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 103:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '>', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 104:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '<=', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 105:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '<', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 107:
                    this.$ = new Logico($$[$0 - 2], $$[$0], '&&', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 108:
                    this.$ = new Logico($$[$0 - 2], $$[$0], '||', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 109:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '&', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 110:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '^', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    break;
                case 113:
                    this.$ = new Length($$[$0 - 4], _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    break;
                case 114:
                    this.$ = new ToUpper($$[$0 - 4], _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    break;
                case 115:
                    this.$ = new ToLower($$[$0 - 4], _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    break;
                case 118:
                    this.$ = new Primitivo(new Tipo(esEntero(Number($$[$0]))), Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
                    break;
                case 119:
                    this.$ = new Primitivo(new Tipo(tipos.BOOLEANO), true, _$[$0].first_line, _$[$0].first_column);
                    break;
                case 120:
                    this.$ = new Primitivo(new Tipo(tipos.BOOLEANO), false, _$[$0].first_line, _$[$0].first_column);
                    break;
                case 121:
                    this.$ = new Primitivo(new Tipo(tipos.CARACTER), $$[$0].replace(/\'/g, ""), _$[$0].first_line, _$[$0].first_column);
                    break;
                case 122:
                    this.$ = new Primitivo(new Tipo(tipos.STRING), $$[$0].replace(/\"/g, ""), _$[$0].first_line, _$[$0].first_column);
                    break;
                case 129:
                    this.$ = $$[$0 - 1];
                    break;
                case 138:
                    this.$ = new Tipo(tipos.DECIMAL);
                    break;
                case 139:
                    this.$ = new Tipo(tipos.STRING);
                    break;
                case 140:
                    this.$ = new Tipo(tipos.ENTERO);
                    break;
                case 141:
                    this.$ = new Tipo(tipos.BOOLEANO);
                    break;
                case 142:
                    this.$ = new Tipo(tipos.CARACTER);
                    break;
            }
        },
        table: [{ 3: 1, 4: 2, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 1: [3] }, { 5: [1, 33], 9: 20, 10: $V0, 11: 34, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($Vh, [2, 7]), { 13: [1, 35] }, { 13: [1, 36] }, { 13: [1, 37] }, { 13: [1, 38] }, o($Vh, [2, 12]), o($Vh, [2, 13]), { 13: [1, 39] }, o($Vh, [2, 15]), { 13: [1, 40] }, o($Vh, [2, 17]), { 10: $Vi, 23: [1, 41], 24: [1, 42], 26: [1, 43], 28: $Vj, 38: $Vk, 40: $Vl }, { 13: [1, 48] }, { 13: [1, 49] }, { 28: [1, 50] }, { 28: [1, 51] }, { 28: [1, 52] }, { 10: [1, 53], 39: 54, 40: [1, 55] }, { 28: [1, 56] }, { 28: [1, 57] }, { 28: [1, 58] }, { 44: [1, 59] }, { 10: [1, 60], 28: [1, 61] }, { 9: 80, 10: $Vm, 13: [2, 82], 16: 77, 28: $Vn, 31: 62, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 10: [1, 86] }, o($VH, [2, 138]), o($VH, [2, 139]), o($VH, [2, 140]), o($VH, [2, 141]), o($VH, [2, 142]), { 1: [2, 1] }, o($Vh, [2, 6]), o($Vh, [2, 8]), o($Vh, [2, 9]), o($Vh, [2, 10]), o($Vh, [2, 11]), o($Vh, [2, 14]), o($Vh, [2, 16]), { 13: [1, 87] }, { 13: [1, 88] }, { 10: $VI, 27: [1, 89], 30: [1, 90] }, { 38: [1, 92] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 93, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 94, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 29: [1, 96], 31: 97, 35: 95, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($Vh, [2, 20]), o($Vh, [2, 23]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 97, 35: 98, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 97, 35: 99, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 97, 35: 100, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($VJ, [2, 49], { 38: [1, 101] }), { 8: [1, 102], 13: [2, 45] }, { 41: [1, 103] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 104, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 105, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 106, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 4: 107, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 56: [1, 108] }, { 9: 110, 10: [1, 111], 57: 109, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 13: [2, 81], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 129, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 28: [1, 130] }, { 28: [1, 131] }, { 28: [1, 132] }, { 28: [1, 133] }, { 28: [1, 134] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 135, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V$, [2, 124], { 26: [1, 136], 28: $Vj, 40: [1, 137] }), o($V$, [2, 117]), o($V$, [2, 118]), o($V$, [2, 119]), o($V$, [2, 120]), o($V$, [2, 121]), o($V$, [2, 122]), o($V$, [2, 123]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 97, 35: 138, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 139, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 26: [1, 140] }, { 28: [1, 141] }, { 28: [1, 142] }, { 28: [1, 143] }, { 28: [1, 144] }, { 91: [1, 145] }, { 44: [1, 146] }, o($Vh, [2, 18]), o($Vh, [2, 19]), { 28: [1, 147] }, { 28: [1, 148] }, { 26: [1, 150], 38: [1, 149] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 151, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 13: [2, 50], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 41: [1, 152], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 8: $V01, 29: [1, 153] }, o($V$, [2, 57]), o($V11, [2, 43], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }), { 8: $V01, 29: [1, 155] }, { 8: $V01, 29: [1, 156] }, { 8: $V01, 29: [1, 157] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 158, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 10: [1, 159] }, { 10: [1, 160] }, { 29: [1, 161], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 162], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 163], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 9: 20, 10: $V0, 11: 34, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 45: [1, 164], 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 165, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 13: [1, 166] }, { 10: [1, 167] }, { 38: [1, 168] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 169, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 170, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 171, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 172, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 173, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 174, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 175, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 176, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 177, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 178, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 179, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 180, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 181, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 182, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 183, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 184, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V$, [2, 128]), o($V$, [2, 89]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 185, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 186, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 187, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 188, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 189, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V$, [2, 106]), { 10: [1, 195], 27: [1, 196], 84: [1, 190], 85: [1, 191], 86: [1, 192], 87: [1, 193], 88: [1, 194] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 197, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 8: $V01, 41: [1, 198] }, { 29: [1, 199], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 97: [1, 200] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 201, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 202, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 203, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 204, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 28: [1, 205] }, { 9: 208, 10: $V21, 61: 206, 62: 207, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 29: [1, 210] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 211, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 212, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 10: [1, 213] }, { 13: [2, 47], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 38: [1, 214] }, o($V$, [2, 56]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 215, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 13: [2, 39] }, { 13: [2, 40] }, { 13: [2, 41] }, { 13: [2, 44], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, o($VJ, [2, 48]), { 38: [1, 216] }, { 9: 20, 10: $V31, 12: 219, 14: 220, 15: 221, 16: 222, 18: 223, 19: $V41, 20: 225, 21: 226, 22: 227, 25: 229, 32: 230, 33: 218, 34: $V2, 36: $V3, 37: $V4, 44: [1, 217], 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 44: [1, 231] }, { 44: [1, 232] }, { 53: [1, 233] }, { 44: [1, 234], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 235, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 38: [1, 236] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 237, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V51, [2, 90], { 65: $VM, 66: $VN, 67: $VO }), o($V51, [2, 91], { 65: $VM, 66: $VN, 67: $VO }), o($V$, [2, 92]), o($V$, [2, 93]), o($V$, [2, 94]), o($V61, [2, 100], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 75: $VR, 76: $VS, 77: $VT, 78: $VU }), o($V61, [2, 101], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 75: $VR, 76: $VS, 77: $VT, 78: $VU }), o($V71, [2, 102], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO }), o($V71, [2, 103], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO }), o($V71, [2, 104], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO }), o($V71, [2, 105], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO }), o($V81, [2, 107], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU }), o([8, 13, 29, 41, 44, 51, 81], [2, 108], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }), o($V81, [2, 109], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU }), o($V81, [2, 110], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU }), { 51: [1, 238], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 239], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 240], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 241], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 8: [1, 242], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 243], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 28: [1, 244] }, { 28: [1, 245] }, { 28: [1, 246] }, { 28: [1, 247] }, { 28: [1, 248] }, o($V$, [2, 130]), { 28: [1, 249] }, { 41: [1, 250], 51: [1, 251], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, o($V$, [2, 125]), o($V$, [2, 129]), { 28: [1, 252] }, { 29: [1, 253], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 254], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 255], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 256], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 257] }, { 8: [1, 259], 45: [1, 258] }, { 10: [1, 260] }, { 10: [2, 86], 40: [1, 261] }, { 10: [2, 87] }, o($Vh, [2, 21]), { 29: [1, 262], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 13: [2, 51], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 26: [1, 264], 38: [1, 263] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 265, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V11, [2, 42], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 266, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 4: 267, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($Vh, [2, 61], { 46: [1, 268] }), { 13: [1, 269] }, { 13: [1, 270] }, { 13: [1, 271] }, { 13: [1, 272] }, o($V91, [2, 28]), { 13: [1, 273] }, o($V91, [2, 30]), { 13: [1, 274] }, o($V91, [2, 32]), { 10: $Vi, 23: [1, 276], 24: [1, 275], 26: [1, 277], 28: $Vj, 38: $Vk, 40: $Vl }, { 13: [1, 278] }, { 13: [1, 279] }, { 48: 280, 49: 281, 50: [1, 282], 52: $Va1 }, { 4: 284, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 28: [1, 285] }, { 4: 286, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 13: [1, 287], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 288, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 13: [2, 77], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 289, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V$, [2, 95]), o($V$, [2, 96]), o($V$, [2, 97]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 290, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V$, [2, 99]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 291, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 292, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 29: [1, 293] }, { 29: [1, 294] }, { 29: [1, 295] }, { 29: [1, 296] }, o($V$, [2, 126]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 297, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 298, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V$, [2, 132]), o($V$, [2, 133]), o($V$, [2, 134]), o($V$, [2, 135]), o($V$, [2, 136]), { 13: [2, 83] }, { 9: 208, 10: $V21, 62: 299, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($Vb1, [2, 85]), { 41: [1, 300] }, o($Vh, [2, 22]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 301, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 10: [1, 302] }, { 13: [2, 55], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 13: [2, 46], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 9: 20, 10: $V0, 11: 34, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 45: [1, 303], 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 20, 10: $V31, 12: 219, 14: 220, 15: 221, 16: 222, 18: 223, 19: $V41, 20: 225, 21: 226, 22: 227, 25: 229, 32: 230, 33: 304, 34: $V2, 36: $V3, 37: $V4, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V91, [2, 24]), o($V91, [2, 25]), o($V91, [2, 26]), o($V91, [2, 27]), o($V91, [2, 29]), o($V91, [2, 31]), { 13: [1, 305] }, { 13: [1, 306] }, { 10: $VI, 27: [1, 307], 30: [1, 308] }, o($V91, [2, 35]), o($V91, [2, 38]), { 45: [1, 310], 49: 309, 50: [1, 311], 52: $Va1 }, { 45: [1, 312] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 313, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 51: [1, 314] }, { 9: 20, 10: $V0, 11: 34, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 45: [1, 315], 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 316, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 20, 10: $V0, 11: 34, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 45: [1, 317], 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 10: [1, 319], 58: 318 }, { 13: [2, 76], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, o($V81, [2, 116], { 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU }), { 29: [1, 320], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 321], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 8: [1, 322], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, o($V$, [2, 113]), o($V$, [2, 114]), o($V$, [2, 115]), o($V$, [2, 137]), { 41: [1, 323], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 29: [1, 324], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 10: [1, 325] }, { 10: [2, 88] }, { 13: [2, 52], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 26: [1, 327], 38: [1, 326] }, o($Vh, [2, 60], { 46: [1, 328] }), o($Vh, [2, 65]), o($V91, [2, 33]), o($V91, [2, 34]), { 28: [1, 329] }, { 28: [1, 330] }, { 45: [1, 331] }, o($V91, [2, 67]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 332, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V91, [2, 68]), { 51: [1, 333], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 4: 334, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V91, [2, 72]), { 29: [1, 335], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, o($V91, [2, 74]), { 29: [1, 336] }, { 23: [1, 338], 24: [1, 337], 51: [1, 339] }, o($V$, [2, 98]), o($V$, [2, 111]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 340, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V$, [2, 127]), o($V$, [2, 131]), o($Vb1, [2, 84]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 341, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 10: [1, 342] }, { 9: 20, 10: $V31, 12: 219, 14: 220, 15: 221, 16: 222, 17: 344, 18: 223, 19: $V41, 20: 225, 21: 226, 22: 227, 25: 229, 32: 230, 33: 345, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 44: [1, 343], 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 29: [1, 346] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 347, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V91, [2, 66]), { 51: [1, 348], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 4: 349, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 20, 10: $V0, 11: 34, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 45: [2, 71], 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 13: [1, 350] }, { 44: [1, 351] }, { 29: [2, 78] }, { 29: [2, 79] }, { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 352, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 29: [1, 353], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 13: [2, 53], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 38: [1, 354] }, { 4: 355, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($Vh, [2, 63]), o($Vh, [2, 64]), o($V91, [2, 36]), { 29: [1, 356], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, { 4: 357, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($Vc1, [2, 70], { 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 9: 20, 11: 34, 10: $V0, 19: $V1, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }), { 13: [2, 73] }, { 4: 358, 9: 20, 10: $V0, 11: 3, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 29: [2, 80], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, o($V$, [2, 112]), { 9: 80, 10: $Vm, 16: 77, 28: $Vn, 31: 359, 40: $Vo, 63: $Vp, 68: $Vq, 69: $Vr, 70: $Vs, 71: $Vt, 72: $Vu, 79: $Vv, 90: $Vw, 91: $Vx, 92: $Vy, 93: $Vz, 94: $VA, 95: $VB, 98: $VC, 99: $VD, 100: $VE, 101: $VF, 102: $VG, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 9: 20, 10: $V0, 11: 34, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 45: [1, 360], 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, o($V91, [2, 37]), o($Vc1, [2, 69], { 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 9: 20, 11: 34, 10: $V0, 19: $V1, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }), { 9: 20, 10: $V0, 11: 34, 12: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9, 19: $V1, 20: 11, 21: 12, 22: 13, 25: 15, 32: 16, 34: $V2, 36: $V3, 37: $V4, 43: $V5, 45: [1, 361], 47: $V6, 53: $V7, 54: $V8, 55: $V9, 59: $Va, 60: $Vb, 103: $Vc, 104: $Vd, 105: $Ve, 106: $Vf, 107: $Vg }, { 13: [2, 54], 63: $VK, 64: $VL, 65: $VM, 66: $VN, 67: $VO, 73: $VP, 74: $VQ, 75: $VR, 76: $VS, 77: $VT, 78: $VU, 80: $VV, 81: $VW, 82: $VX, 83: $VY, 89: $VZ, 96: $V_ }, o($Vh, [2, 62]), o($V91, [2, 75])],
        defaultActions: { 33: [2, 1], 155: [2, 39], 156: [2, 40], 157: [2, 41], 209: [2, 87], 258: [2, 83], 300: [2, 88], 337: [2, 78], 338: [2, 79], 350: [2, 73] },
        parseError: function parseError(str, hash) {
            if (hash.recoverable) {
                this.trace(str);
            }
            else {
                var error = new Error(str);
                error.hash = hash;
                throw error;
            }
        },
        parse: function parse(input) {
            var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
            var args = lstack.slice.call(arguments, 1);
            var lexer = Object.create(this.lexer);
            var sharedState = { yy: {} };
            for (var k in this.yy) {
                if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
                    sharedState.yy[k] = this.yy[k];
                }
            }
            lexer.setInput(input, sharedState.yy);
            sharedState.yy.lexer = lexer;
            sharedState.yy.parser = this;
            if (typeof lexer.yylloc == 'undefined') {
                lexer.yylloc = {};
            }
            var yyloc = lexer.yylloc;
            lstack.push(yyloc);
            var ranges = lexer.options && lexer.options.ranges;
            if (typeof sharedState.yy.parseError === 'function') {
                this.parseError = sharedState.yy.parseError;
            }
            else {
                this.parseError = Object.getPrototypeOf(this).parseError;
            }
            function popStack(n) {
                stack.length = stack.length - 2 * n;
                vstack.length = vstack.length - n;
                lstack.length = lstack.length - n;
            }
            _token_stack: var lex = function () {
                var token;
                token = lexer.lex() || EOF;
                if (typeof token !== 'number') {
                    token = self.symbols_[token] || token;
                }
                return token;
            };
            var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
            while (true) {
                state = stack[stack.length - 1];
                if (this.defaultActions[state]) {
                    action = this.defaultActions[state];
                }
                else {
                    if (symbol === null || typeof symbol == 'undefined') {
                        symbol = lex();
                    }
                    action = table[state] && table[state][symbol];
                }
                if (typeof action === 'undefined' || !action.length || !action[0]) {
                    var errStr = '';
                    expected = [];
                    for (p in table[state]) {
                        if (this.terminals_[p] && p > TERROR) {
                            expected.push('\'' + this.terminals_[p] + '\'');
                        }
                    }
                    if (lexer.showPosition) {
                        errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                    }
                    else {
                        errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                    }
                    this.parseError(errStr, {
                        text: lexer.match,
                        token: this.terminals_[symbol] || symbol,
                        line: lexer.yylineno,
                        loc: yyloc,
                        expected: expected
                    });
                }
                if (action[0] instanceof Array && action.length > 1) {
                    throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
                }
                switch (action[0]) {
                    case 1:
                        stack.push(symbol);
                        vstack.push(lexer.yytext);
                        lstack.push(lexer.yylloc);
                        stack.push(action[1]);
                        symbol = null;
                        if (!preErrorSymbol) {
                            yyleng = lexer.yyleng;
                            yytext = lexer.yytext;
                            yylineno = lexer.yylineno;
                            yyloc = lexer.yylloc;
                            if (recovering > 0) {
                                recovering--;
                            }
                        }
                        else {
                            symbol = preErrorSymbol;
                            preErrorSymbol = null;
                        }
                        break;
                    case 2:
                        len = this.productions_[action[1]][1];
                        yyval.$ = vstack[vstack.length - len];
                        yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        };
                        if (ranges) {
                            yyval._$.range = [
                                lstack[lstack.length - (len || 1)].range[0],
                                lstack[lstack.length - 1].range[1]
                            ];
                        }
                        r = this.performAction.apply(yyval, [
                            yytext,
                            yyleng,
                            yylineno,
                            sharedState.yy,
                            action[1],
                            vstack,
                            lstack
                        ].concat(args));
                        if (typeof r !== 'undefined') {
                            return r;
                        }
                        if (len) {
                            stack = stack.slice(0, -1 * len * 2);
                            vstack = vstack.slice(0, -1 * len);
                            lstack = lstack.slice(0, -1 * len);
                        }
                        stack.push(this.productions_[action[1]][0]);
                        vstack.push(yyval.$);
                        lstack.push(yyval._$);
                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                        stack.push(newState);
                        break;
                    case 3:
                        return true;
                }
            }
            return true;
        } };
    const { Tree } = require('../Simbols/Tree');
    const { Tipo, tipos, esEntero } = require('../other/tipo');
    const { Primitivo } = require('../Expresiones/Primitivo');
    //Expresion
    const { Aritmetica } = require('../Expresiones/Aritmetica');
    const { Logico } = require('../Expresiones/Logico');
    const { Relacional } = require('../Expresiones/Relacional');
    const { ToLower } = require('../Expresiones/ToLower');
    const { ToUpper } = require('../Expresiones/ToUpper');
    // const {Length} = require('../Expresiones/Length'); 
    const { Length } = require('../Expresiones/Length');
    //Instrucciones
    const { Print } = require('../Instrucciones/Print');
    /* generated by jison-lex 0.3.4 */
    var lexer = (function () {
        var lexer = ({
            EOF: 1,
            parseError: function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                }
                else {
                    throw new Error(str);
                }
            },
            // resets the lexer, sets new input
            setInput: function (input, yy) {
                this.yy = yy || this.yy || {};
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = '';
                this.conditionStack = ['INITIAL'];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) {
                    this.yylloc.range = [0, 0];
                }
                this.offset = 0;
                return this;
            },
            // consumes and returns one char from the input
            input: function () {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++;
                }
                else {
                    this.yylloc.last_column++;
                }
                if (this.options.ranges) {
                    this.yylloc.range[1]++;
                }
                this._input = this._input.slice(1);
                return ch;
            },
            // unshifts one char (or a string) into the input
            unput: function (ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);
                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len);
                //this.yyleng -= len;
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);
                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1;
                }
                var r = this.yylloc.range;
                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ?
                        (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                            + oldLines[oldLines.length - lines.length].length - lines[0].length :
                        this.yylloc.first_column - len
                };
                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                this.yyleng = this.yytext.length;
                return this;
            },
            // When called from action, caches matched text and appends it on next action
            more: function () {
                this._more = true;
                return this;
            },
            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject: function () {
                if (this.options.backtrack_lexer) {
                    this._backtrack = true;
                }
                else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
                return this;
            },
            // retain first n characters of the match
            less: function (n) {
                this.unput(this.match.slice(n));
            },
            // displays already matched input, i.e. for error messages
            pastInput: function () {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
            },
            // displays upcoming input, i.e. for error messages
            upcomingInput: function () {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
            },
            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition: function () {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            },
            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match: function (match, indexed_rule) {
                var token, lines, backup;
                if (this.options.backtrack_lexer) {
                    // save context
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done
                    };
                    if (this.options.ranges) {
                        backup.yylloc.range = this.yylloc.range.slice(0);
                    }
                }
                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno += lines.length;
                }
                this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: lines ?
                        lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                        this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [this.offset, this.offset += this.yyleng];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                    this.done = false;
                }
                if (token) {
                    return token;
                }
                else if (this._backtrack) {
                    // recover context
                    for (var k in backup) {
                        this[k] = backup[k];
                    }
                    return false; // rule action called reject() implying the next rule should be tested instead.
                }
                return false;
            },
            // return next match in input
            next: function () {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) {
                    this.done = true;
                }
                var token, match, tempMatch, index;
                if (!this._more) {
                    this.yytext = '';
                    this.match = '';
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (this.options.backtrack_lexer) {
                            token = this.test_match(tempMatch, rules[i]);
                            if (token !== false) {
                                return token;
                            }
                            else if (this._backtrack) {
                                match = false;
                                continue; // rule action called reject() implying a rule MISmatch.
                            }
                            else {
                                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                                return false;
                            }
                        }
                        else if (!this.options.flex) {
                            break;
                        }
                    }
                }
                if (match) {
                    token = this.test_match(match, rules[index]);
                    if (token !== false) {
                        return token;
                    }
                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                    return false;
                }
                if (this._input === "") {
                    return this.EOF;
                }
                else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
            },
            // return next match that has a token
            lex: function lex() {
                var r = this.next();
                if (r) {
                    return r;
                }
                else {
                    return this.lex();
                }
            },
            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin: function begin(condition) {
                this.conditionStack.push(condition);
            },
            // pop the previously active lexer condition state off the condition stack
            popState: function popState() {
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop();
                }
                else {
                    return this.conditionStack[0];
                }
            },
            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules: function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                }
                else {
                    return this.conditions["INITIAL"].rules;
                }
            },
            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState: function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n];
                }
                else {
                    return "INITIAL";
                }
            },
            // alias for begin(condition)
            pushState: function pushState(condition) {
                this.begin(condition);
            },
            // return the number of states currently on the stack
            stateStackSize: function stateStackSize() {
                return this.conditionStack.length;
            },
            options: { "case-sensitive": true },
            performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    case 5:
                        return 94;
                        break;
                    case 6:
                        return 95;
                        break;
                    case 7:
                        return 84;
                        break;
                    case 8:
                        return 105;
                        break;
                    case 9:
                        return 104;
                        break;
                    case 10:
                        return 103;
                        break;
                    case 11:
                        return 106;
                        break;
                    case 12:
                        return 107;
                        break;
                    case 13:
                        return 85;
                        break;
                    case 14:
                        return 86;
                        break;
                    case 15:
                        return 87;
                        break;
                    case 16:
                        return 88;
                        break;
                    case 17:
                        return 98;
                        break;
                    case 18:
                        return 99;
                        break;
                    case 19:
                        return 104;
                        break;
                    case 20:
                        return 101;
                        break;
                    case 21:
                        return 97;
                        break;
                    case 22:
                        return 65;
                        break;
                    case 23:
                        return 67;
                        break;
                    case 24:
                        return 26;
                        break;
                    case 25:
                        return 51;
                        break;
                    case 26:
                        return 13;
                        break;
                    case 27:
                        return 89;
                        break;
                    case 28:
                        return 83;
                        break;
                    case 29:
                        return 8;
                        break;
                    case 30:
                        return 24;
                        break;
                    case 31:
                        return 23;
                        break;
                    case 32:
                        return 63;
                        break;
                    case 33:
                        return 64;
                        break;
                    case 34:
                        return 66;
                        break;
                    case 35:
                        return 96;
                        break;
                    case 36:
                        return 77;
                        break;
                    case 37:
                        return 78;
                        break;
                    case 38:
                        return 75;
                        break;
                    case 39:
                        return 76;
                        break;
                    case 40:
                        return 73;
                        break;
                    case 41:
                        return 74;
                        break;
                    case 42:
                        return 38;
                        break;
                    case 43:
                        return 81;
                        break;
                    case 44:
                        return 80;
                        break;
                    case 45:
                        return 82;
                        break;
                    case 46:
                        return 79;
                        break;
                    case 47:
                        return 28;
                        break;
                    case 48:
                        return 29;
                        break;
                    case 49:
                        return 40;
                        break;
                    case 50:
                        return 41;
                        break;
                    case 51:
                        return 44;
                        break;
                    case 52:
                        return 45;
                        break;
                    case 53:
                        return 92;
                        break;
                    case 54:
                        return 'function';
                        break;
                    case 55:
                        return 71;
                        break;
                    case 56:
                        return 72;
                        break;
                    case 57:
                        return 68;
                        break;
                    case 58:
                        return 69;
                        break;
                    case 59:
                        return 70;
                        break;
                    case 60:
                        return 90;
                        break;
                    case 61:
                        return 'new';
                        break;
                    case 62:
                        return 'void';
                        break;
                    case 63:
                        return 'main';
                        break;
                    case 64:
                        return 93;
                        break;
                    case 65:
                        return 34;
                        break;
                    case 66:
                        return 36;
                        break;
                    case 67:
                        return 37;
                        break;
                    case 68:
                        return 43;
                        break;
                    case 69:
                        return 56;
                        break;
                    case 70:
                        return 55;
                        break;
                    case 71:
                        return 46;
                        break;
                    case 72:
                        return 'main';
                        break;
                    case 73:
                        return 19;
                        break;
                    case 74:
                        return 53;
                        break;
                    case 75:
                        return 'bool';
                        break;
                    case 76:
                        return 47;
                        break;
                    case 77:
                        return 50;
                        break;
                    case 78:
                        return 52;
                        break;
                    case 79:
                        return 19;
                        break;
                    case 80:
                        return 54;
                        break;
                    case 81:
                        return 59;
                        break;
                    case 82:
                        return 27;
                        break;
                    case 83:
                        return 30;
                        break;
                    case 84:
                        return 102;
                        break;
                    case 85:
                        return 91;
                        break;
                    case 86:
                        return 60;
                        break;
                    case 87:
                        return 10;
                        break;
                    case 88:
                        return 5;
                        break;
                }
            },
            rules: [/^(?:\s+)/, /^(?:[ \t\r\n\f])/, /^(?:\n)/, /^(?:\/\/.*)/, /^(?:[/][*][^*/]*[*][/])/, /^(?:(('[^☼]')))/, /^(?:(("[^"]*")))/, /^(?:caracterOfPosition\b)/, /^(?:int\b)/, /^(?:String\b)/, /^(?:double\b)/, /^(?:boolean\b)/, /^(?:char\b)/, /^(?:subString\b)/, /^(?:lenght\b)/, /^(?:toUppercase\b)/, /^(?:toLowercase\b)/, /^(?:toInt\b)/, /^(?:toDouble\b)/, /^(?:String\b)/, /^(?:typeof\b)/, /^(?:parse\b)/, /^(?:\*)/, /^(?:%)/, /^(?:\.)/, /^(?::)/, /^(?:;)/, /^(?:\?)/, /^(?:\^)/, /^(?:,)/, /^(?:\+\+)/, /^(?:--)/, /^(?:-)/, /^(?:\+)/, /^(?:\/)/, /^(?:#)/, /^(?:<=)/, /^(?:<)/, /^(?:>=)/, /^(?:>)/, /^(?:==)/, /^(?:!=)/, /^(?:=)/, /^(?:\|\|)/, /^(?:&&)/, /^(?:&)/, /^(?:!)/, /^(?:\()/, /^(?:\))/, /^(?:\[)/, /^(?:\])/, /^(?:\{)/, /^(?:\})/, /^(?:true\b)/, /^(?:function\b)/, /^(?:pow\b)/, /^(?:sqrt\b)/, /^(?:sin\b)/, /^(?:cos\b)/, /^(?:tan\b)/, /^(?:null\b)/, /^(?:new\b)/, /^(?:void\b)/, /^(?:main\b)/, /^(?:false\b)/, /^(?:print\b)/, /^(?:println\b)/, /^(?:printf\b)/, /^(?:if\b)/, /^(?:in\b)/, /^(?:for\b)/, /^(?:else\b)/, /^(?:main\b)/, /^(?:break\b)/, /^(?:while\b)/, /^(?:bool\b)/, /^(?:switch\b)/, /^(?:case\b)/, /^(?:default\b)/, /^(?:break\b)/, /^(?:do\b)/, /^(?:return\b)/, /^(?:pop\b)/, /^(?:push\b)/, /^(?:log\b)/, /^(?:[0-9]+(\.[0-9]+)?\b)/, /^(?:struct\b)/, /^(?:(([a-zA-Z_])[a-zA-Z0-9_]*))/, /^(?:$)/],
            conditions: { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88], "inclusive": true } }
        });
        return lexer;
    })();
    parser.lexer = lexer;
    function Parser() {
        this.yy = {};
    }
    Parser.prototype = parser;
    parser.Parser = Parser;
    return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.parser = grammar;
    exports.Parser = grammar.Parser;
    exports.parse = function () { return grammar.parse.apply(grammar, arguments); };
    exports.main = function commonjsMain(args) {
        if (!args[1]) {
            console.log('Usage: ' + args[0] + ' FILE');
            process.exit(1);
        }
        var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
        return exports.parser.parse(source);
    };
    if (typeof module !== 'undefined' && require.main === module) {
        exports.main(process.argv.slice(1));
    }
}

}).call(this)}).call(this,require('_process'))
},{"../Expresiones/Aritmetica":6,"../Expresiones/Length":7,"../Expresiones/Logico":8,"../Expresiones/Primitivo":9,"../Expresiones/Relacional":10,"../Expresiones/ToLower":11,"../Expresiones/ToUpper":12,"../Instrucciones/Print":14,"../Simbols/Tree":17,"../other/tipo":19,"_process":3,"fs":1,"path":2}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const tipo_1 = require("../other/tipo");
const tipo_2 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Print extends Nodo_1.Nodo {
    constructor(expresion, line, column, tipo_print) {
        super(new tipo_1.Tipo(tipo_2.tipos.VOID), line, column);
        this.expresion = expresion;
        this.tipo_print = tipo_print;
    }
    execute(table, tree) {
        for (let key in this.expresion) {
            const valor = this.expresion[key].execute(table, tree);
            tree.consola.push(valor);
        }
        /*agregando el tipo para el pritnln lo  maneje asi  fuera del for para evitar clavos papa ctm*/
        if (this.tipo_print == 1) {
        }
        else if (this.tipo_print == 2) {
            tree.consola.push("\n");
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("PRINT");
        nodo.agregarHijo("print");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion[0].getNodo());
        nodo.agregarHijo(")");
        return nodo;
    }
}
exports.Print = Print;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/tipo":19}],15:[function(require,module,exports){
(function (global){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../Simbols/Table");
const parser = require('../Gramatica/grammar.js');
var editor = CodeMirror.fromTextArea(document.getElementById('editor1'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
});
editor.save();
var editor2 = CodeMirror.fromTextArea(document.getElementById('editor2'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
    readOnly: "nocursor"
});
editor2.save();
global.Enviar = function entrada() {
    const entrada = editor.getValue();
    const tree = parser.parse(entrada);
    const tabla = new Table_1.Table(null);
    tree.instrucciones.map((m) => {
        try {
            const res = m.execute(tabla, tree);
        }
        catch (error) {
            console.log('error');
        }
        // console.log(tree.consola);
        var texto = "";
        for (const key in tree.consola) {
            texto += tree.consola[key];
        
        }
        editor2.setValue(texto);
    });
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Gramatica/grammar.js":13,"../Simbols/Table":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Table {
    constructor(Anterior) {
        this.Anterior = Anterior;
        this.Variables = new Map();
    }
    setVariable(simbol) {
        let ambito;
        for (ambito = this; ambito != null; ambito = ambito.Anterior) {
            for (let key of Array.from(ambito.Variables.keys())) {
                if (key.toLowerCase() === simbol.id.toLowerCase()) {
                    // return `La variable ${key} ya ha sido declarada.`;
                    return this.Variables.set(simbol.id.toLowerCase(), simbol);
                }
            }
        }
        this.Variables.set(simbol.id.toLowerCase(), simbol);
        return null;
    }
    getVariable(id) {
        let ambito;
        for (ambito = this; ambito != null; ambito = ambito.Anterior) {
            for (let key of Array.from(ambito.Variables.keys())) {
                if (key.toLowerCase() === id.toLowerCase()) {
                    return ambito.Variables.get(key.toLocaleLowerCase());
                }
            }
        }
        return null;
    }
}
exports.Table = Table;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tree {
    constructor(instrucciones) {
        this.instrucciones = instrucciones;
        this.excepciones = new Array();
        this.consola = new Array();
        this.Variables = new Array();
    }
}
exports.Tree = Tree;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Excepcion {
    constructor(tipo, descripcion, line, column) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.line = line;
        this.column = column;
    }
    toString() {
        return `Error ${this.tipo} en la linea ${this.line} y columna ${this.column}, ${this.descripcion}`;
    }
}
exports.Excepcion = Excepcion;

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tipos;
(function (tipos) {
    tipos[tipos["ENTERO"] = 0] = "ENTERO";
    tipos[tipos["DECIMAL"] = 1] = "DECIMAL";
    tipos[tipos["NUMERO"] = 2] = "NUMERO";
    tipos[tipos["CARACTER"] = 3] = "CARACTER";
    tipos[tipos["STRING"] = 4] = "STRING";
    tipos[tipos["BOOLEANO"] = 5] = "BOOLEANO";
    tipos[tipos["ARREGLO"] = 6] = "ARREGLO";
    tipos[tipos["VOID"] = 7] = "VOID";
    tipos[tipos["METODO"] = 8] = "METODO";
    tipos[tipos["FUNCION"] = 9] = "FUNCION";
    tipos[tipos["VARIABLE"] = 10] = "VARIABLE";
    tipos[tipos["STRUCTS"] = 11] = "STRUCTS";
})(tipos = exports.tipos || (exports.tipos = {}));
function esEntero(numero) {
    if (numero % 1 == 0) {
        return tipos.ENTERO;
    }
    else {
        return tipos.DECIMAL;
    }
}
exports.esEntero = esEntero;
class Tipo {
    constructor(tipo) {
        this.tipo = tipo;
    }
    toString() {
        if (this.tipo === tipos.BOOLEANO) {
            return 'boolean';
        }
        else if (this.tipo === tipos.ENTERO) {
            return 'entero';
        }
        else if (this.tipo === tipos.DECIMAL) {
            return 'decimal';
        }
        else if (this.tipo === tipos.STRING) {
            return 'string';
        }
        else if (this.tipo === tipos.CARACTER) {
            return 'caracter';
        }
        else if (this.tipo === tipos.VARIABLE) {
            return 'Variable';
        }
        else if (this.tipo === tipos.METODO) {
            return 'Metodo';
        }
        else if (this.tipo === tipos.FUNCION) {
            return 'Funcion';
        }
        else if (this.tipo === tipos.VOID) {
            return 'Void';
        }
        else if (this.tipo === tipos.ARREGLO) {
            return 'Arreglo';
        }
        else if (this.tipo === tipos.STRUCTS) {
            return 'Lista';
        }
    }
}
exports.Tipo = Tipo;

},{}],20:[function(require,module,exports){
"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedListNode_1 = __importDefault(require("./LinkedListNode"));
/**
 * A doubly linked list
 * ```ts
 * const list = new LinkedList(1, 2, 3);
 * const listFromArray = LinkedList.from([1, 2, 3]);
 * ```
 */
var LinkedList = /** @class */ (function () {
    function LinkedList() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.head = null;
        this.tail = null;
        this.size = 0;
        for (var i = 0; i < arguments.length; i++) {
            this.append(arguments[i]);
        }
    }
    Object.defineProperty(LinkedList.prototype, "length", {
        /**
         * The length of the list
         */
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Convert any iterable to a new linked list
     * ```javascript
     * const array = [1, 2, 3];
     * const list = LinkedList.from(array);
     * ```
     * @param iterable Any iterable datatype like Array or Map
     */
    LinkedList.from = function (iterable) {
        return new (LinkedList.bind.apply(LinkedList, __spread([void 0], iterable)))();
    };
    /**
     * Get the node data at a specified index, zero based
     * ```ts
     * new LinkedList(1, 2, 3).get(0); // 1
     * ```
     * @param index to retrieve data at
     */
    LinkedList.prototype.get = function (index) {
        var node = this.getNode(index);
        return node !== undefined ? node.data : undefined;
    };
    /**
     * Get the node at index, zero based
     * ```ts
     * new LinkedList(1, 2, 3).getNode(0);
     * // { prev: null, data: 1, next: LinkedListNode }
     * ```
     */
    LinkedList.prototype.getNode = function (index) {
        if (this.head === null || index < 0 || index >= this.length) {
            return undefined;
        }
        var asc = index < this.length / 2;
        var stopAt = asc ? index : this.length - index - 1;
        var nextNode = asc ? 'next' : 'prev';
        var currentNode = asc ? this.head : this.tail;
        for (var currentIndex = 0; currentIndex < stopAt; currentIndex++) {
            currentNode = currentNode[nextNode];
        }
        return currentNode;
    };
    /**
     * Return the first node and its index in the list that
     * satisfies the testing function
     * ```ts
     * new LinkedList(1, 2, 3).findNodeIndex(data => data === 1);
     * // { node: LinkedListNode, index: 0 }
     * ```
     * @param f A function to be applied to the data of each node
     */
    LinkedList.prototype.findNodeIndex = function (f) {
        var currentIndex = 0;
        var currentNode = this.head;
        while (currentNode) {
            if (f(currentNode.data, currentIndex, this)) {
                return {
                    index: currentIndex,
                    node: currentNode,
                };
            }
            currentNode = currentNode.next;
            currentIndex += 1;
        }
        return undefined;
    };
    /**
     * Returns the first node in the list that
     * satisfies the provided testing function. Otherwise undefined is returned.
     * ```ts
     * new LinkedList(1, 2, 3).findNode(data => data === 1);
     * // { prev: null, data: 1, next: LinkedListNode }
     * ```
     * @param f Function to test data against
     */
    LinkedList.prototype.findNode = function (f) {
        var nodeIndex = this.findNodeIndex(f);
        return nodeIndex !== undefined ? nodeIndex.node : undefined;
    };
    /**
     * Returns the value of the first element in the list that
     * satisfies the provided testing function. Otherwise undefined is returned.
     * ```ts
     * new LinkedList(1, 2, 3).find(data => data === 1); // 1
     * ```
     * @param f Function to test data against
     */
    LinkedList.prototype.find = function (f) {
        var nodeIndex = this.findNodeIndex(f);
        return nodeIndex !== undefined ? nodeIndex.node.data : undefined;
    };
    /**
     * Returns the index of the first node in the list that
     * satisfies the provided testing function. Ohterwise -1 is returned.
     * ```ts
     * new LinkedList(1, 2, 3).findIndex(data => data === 3); // 2
     * ```
     * @param f Function to test data against
     */
    LinkedList.prototype.findIndex = function (f) {
        var nodeIndex = this.findNodeIndex(f);
        return nodeIndex !== undefined ? nodeIndex.index : -1;
    };
    /**
     * Append one or any number of nodes to the end of the list.
     * This modifies the list in place and returns the list itself
     * to make this method chainable.
     * ```ts
     * new LinkedList(1).append(2).append(3, 4); // 1 <=> 2 <=> 3 <=> 4
     * ```
     * @param data Data to be stored in the node, takes any number of arguments
     */
    LinkedList.prototype.append = function () {
        var e_1, _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                var data = args_1_1.value;
                var node = new LinkedListNode_1.default(data, this.tail, null, this);
                if (this.head === null) {
                    this.head = node;
                }
                if (this.tail !== null) {
                    this.tail.next = node;
                }
                this.tail = node;
                this.size += 1;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    /**
     * Synonym for append
     * ```ts
     * new LinkedList(1).push(2).push(3, 4); // 1 <=> 2 <=> 3 <=> 4
     * ```
     * @param data Data to be stored, takes any number of arguments
     */
    LinkedList.prototype.push = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.append.apply(this, __spread(args));
        return this.length;
    };
    /**
     * Prepend any number of data arguments to the list. The
     * argument list is prepended as a block to reduce confusion:
     * ```javascript
     * new LinkedList(3, 4).prepend(0, 1, 2); // [0, 1, 2, 3, 4]
     * ```
     * @param data Data to be stored in the node, accepts any number of arguments
     */
    LinkedList.prototype.prepend = function () {
        var e_2, _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var reverseArgs = Array.from(args).reverse();
        try {
            for (var reverseArgs_1 = __values(reverseArgs), reverseArgs_1_1 = reverseArgs_1.next(); !reverseArgs_1_1.done; reverseArgs_1_1 = reverseArgs_1.next()) {
                var data = reverseArgs_1_1.value;
                var node = new LinkedListNode_1.default(data, null, this.head, this);
                if (this.tail === null) {
                    this.tail = node;
                }
                if (this.head !== null) {
                    this.head.prev = node;
                }
                this.head = node;
                this.size += 1;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (reverseArgs_1_1 && !reverseArgs_1_1.done && (_a = reverseArgs_1.return)) _a.call(reverseArgs_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this;
    };
    /**
     * Insert a new node at a given index position. If index is
     * out of bounds, the node is appended, if index is negative
     * or 0, it will be prepended.
     * ```ts
     * new LinkedList(1, 3).insertAt(1, 2); // 1 <=> 2 <=> 3
     * ```
     * @param index The index to insert the new node at
     * @param data Data to be stored on the new node
     */
    LinkedList.prototype.insertAt = function (index, data) {
        if (this.head === null) {
            return this.append(data);
        }
        if (index <= 0) {
            return this.prepend(data);
        }
        var currentNode = this.head;
        var currentIndex = 0;
        while (currentIndex < index - 1 && currentNode.next !== null) {
            currentIndex += 1;
            currentNode = currentNode.next;
        }
        currentNode.insertAfter(data);
        return this;
    };
    /**
     * Remove the specified node from the list and return the removed
     * node afterwards.
     * ```ts
     * const list = new LinkedList(1, 2, 3);
     * list.removeNode(list.tail); // { prev: null, data: 3, next: null, list: null }
     * ```
     * @param node The node to be removed
     */
    LinkedList.prototype.removeNode = function (node) {
        if (node.list !== this) {
            throw new ReferenceError('Node does not belong to this list');
        }
        if (node.prev !== null) {
            node.prev.next = node.next;
        }
        if (node.next !== null) {
            node.next.prev = node.prev;
        }
        if (this.head === node) {
            this.head = node.next;
        }
        if (this.tail === node) {
            this.tail = node.prev;
        }
        this.size -= 1;
        node.next = null;
        node.prev = null;
        node.list = null;
        return node;
    };
    /**
     * Remove the node at the specified index
     * ```ts
     * new LinkedList(1, 2, 3).removeAt(2); // { prev: null, data: 3, next: null, list: null }
     * ```
     * @param index Index at which to remove
     */
    LinkedList.prototype.removeAt = function (index) {
        var node = this.getNode(index);
        return node !== undefined ? this.removeNode(node) : undefined;
    };
    /**
     * Insert a new node before the reference node
     * ```ts
     * const list = new LinkedList(1, 3);
     * list.insertBefore(list.tail, 2); // 1 <=> 2 <=> 3
     * ```
     * @param referenceNode The node reference
     * @param data Data to save in the node
     */
    LinkedList.prototype.insertBefore = function (referenceNode, data) {
        var node = new LinkedListNode_1.default(data, referenceNode.prev, referenceNode, this);
        if (referenceNode.prev === null) {
            this.head = node;
        }
        if (referenceNode.prev !== null) {
            referenceNode.prev.next = node;
        }
        referenceNode.prev = node;
        this.size += 1;
        return this;
    };
    /**
     * Sorts the linked list using the provided compare function
     * @param compare A function used to compare the data of two nodes. It should return
     *                a boolean. True will insert a before b, false will insert b before a.
     *                (a, b) => a < b or (1, 2) => 1 < 2 === true, 2 will be inserted after 1,
     *                the sort order will be ascending.
     */
    LinkedList.prototype.sort = function (compare) {
        if (this.head === null || this.tail === null) {
            return this;
        }
        if (this.length < 2) {
            return this;
        }
        var quicksort = function (start, end) {
            if (start === end) {
                return;
            }
            var pivotData = end.data;
            var current = start;
            var split = start;
            while (current && current !== end) {
                var sort = compare(current.data, pivotData);
                if (sort) {
                    if (current !== split) {
                        var temp = split.data;
                        split.data = current.data;
                        current.data = temp;
                    }
                    split = split.next;
                }
                current = current.next;
            }
            end.data = split.data;
            split.data = pivotData;
            if (start.next === end.prev) {
                return;
            }
            if (split.prev && split !== start) {
                quicksort(start, split.prev);
            }
            if (split.next && split !== end) {
                quicksort(split.next, end);
            }
        };
        quicksort(this.head, this.tail);
        return this;
    };
    /**
     * Insert a new node after this one
     * ```ts
     * const list = new LinkedList(2, 3);
     * list.insertAfter(list.head, 1); // 1 <=> 2 <=> 3
     * ```
     * @param referenceNode The reference node
     * @param data Data to be saved in the node
     */
    LinkedList.prototype.insertAfter = function (referenceNode, data) {
        var node = new LinkedListNode_1.default(data, referenceNode, referenceNode.next, this);
        if (referenceNode.next === null) {
            this.tail = node;
        }
        if (referenceNode.next !== null) {
            referenceNode.next.prev = node;
        }
        referenceNode.next = node;
        this.size += 1;
        return this;
    };
    /**
     * Remove the first node from the list and return the data of the removed node
     * or undefined
     * ```ts
     * new LinkedList(1, 2, 3).shift(); // 1
     * ```
     */
    LinkedList.prototype.shift = function () {
        return this.removeFromAnyEnd(this.head);
    };
    /**
     * Remove the last node from the list and return the data of the removed node
     * or undefined if the list was empty
     * ```ts
     * new LinkedList(1, 2, 3).pop(); // 3
     * ```
     */
    LinkedList.prototype.pop = function () {
        return this.removeFromAnyEnd(this.tail);
    };
    /**
     * Merge the current list with another. Both lists will be
     * equal after merging.
     * ```ts
     * const list = new LinkedList(1, 2);
     * const otherList = new LinkedList(3);
     * list.merge(otherList);
     * (list === otherList); // true
     * ```
     * @param list The list to be merged
     */
    LinkedList.prototype.merge = function (list) {
        if (this.tail !== null) {
            this.tail.next = list.head;
        }
        if (list.head !== null) {
            list.head.prev = this.tail;
        }
        this.head = this.head || list.head;
        this.tail = list.tail || this.tail;
        this.size += list.size;
        list.size = this.size;
        list.head = this.head;
        list.tail = this.tail;
    };
    /**
     * Removes all nodes from a list
     *
     * ```ts
     * list.clear();
     * ```
     */
    LinkedList.prototype.clear = function () {
        this.head = null;
        this.tail = null;
        this.size = 0;
        return this;
    };
    /**
     * The slice() method returns a shallow copy of a
     * portion of a list into a new list object selected
     * from start to end (end not included).
     * The original list will not be modified.
     * ```ts
     * const list = new LinkedList(1, 2, 3, 4, 5);
     * const newList = list.slice(0, 3); // 1 <=> 2 <=> 3
     * ```
     * @param start Start index
     * @param end End index, optional
     */
    LinkedList.prototype.slice = function (start, end) {
        var list = new LinkedList();
        var finish = end;
        if (this.head === null || this.tail === null) {
            return list;
        }
        if (finish === undefined || finish < start) {
            finish = this.length;
        }
        var head = this.getNode(start);
        for (var i = 0; i < finish - start && head !== null && head !== undefined; i++) {
            list.append(head.data);
            head = head.next;
        }
        return list;
    };
    /**
     * The reverse() function reverses the list in place and returns the list
     * itself.
     * ```ts
     * new LinkedList(1, 2, 3).reverse(); // 3 <=> 2 <=> 1
     * ```
     */
    LinkedList.prototype.reverse = function () {
        var currentNode = this.head;
        while (currentNode) {
            var next = currentNode.next;
            currentNode.next = currentNode.prev;
            currentNode.prev = next;
            currentNode = currentNode.prev;
        }
        var tail = this.tail;
        this.tail = this.head;
        this.head = tail;
        return this;
    };
    /**
     * The forEach() method executes a provided function once for each list node.
     * ```ts
     * new LinkedList(1, 2, 3).forEach(data => log(data)); // 1 2 3
     * ```
     * @param f Function to execute for each element, taking up to three arguments.
     * @param reverse Indicates if the list should be walked in reverse order, default is false
     */
    LinkedList.prototype.forEach = function (f, reverse) {
        if (reverse === void 0) { reverse = false; }
        var currentIndex = reverse ? this.length - 1 : 0;
        var currentNode = reverse ? this.tail : this.head;
        var modifier = reverse ? -1 : 1;
        var nextNode = reverse ? 'prev' : 'next';
        while (currentNode) {
            f(currentNode.data, currentIndex, this);
            currentNode = currentNode[nextNode];
            currentIndex += modifier;
        }
    };
    /**
     * The map() method creates a new list with the results of
     * calling a provided function on every node in the calling list.
     * ```ts
     * new LinkedList(1, 2, 3).map(data => data + 10); // 11 <=> 12 <=> 13
     * ```
     * @param f Function that produces an node of the new list, taking up to three arguments
     * @param reverse Indicates if the list should be mapped in reverse order, default is false
     */
    LinkedList.prototype.map = function (f, reverse) {
        var _this = this;
        if (reverse === void 0) { reverse = false; }
        var list = new LinkedList();
        this.forEach(function (data, index) { return list.append(f(data, index, _this)); }, reverse);
        return list;
    };
    /**
     * The filter() method creates a new list with all nodes
     * that pass the test implemented by the provided function.
     * ```ts
     * new LinkedList(1, 2, 3, 4, 5).filter(data => data < 4); // 1 <=> 2 <=> 3
     * ```
     * @param f Function to test each node data in the list. Return true to keep the node
     * @param reverse Indicates if the list should be filtered in reverse order, default is false
     */
    LinkedList.prototype.filter = function (f, reverse) {
        var _this = this;
        if (reverse === void 0) { reverse = false; }
        var list = new LinkedList();
        this.forEach(function (data, index) {
            if (f(data, index, _this)) {
                list.append(data);
            }
        }, reverse);
        return list;
    };
    /**
     * Reduce over each node in the list
     * ```ts
     * new LinkedList(1, 2, 3).reduce(n => n += 1, 0); // 3
     * ```
     * @param f A reducer function
     * @param start An initial value
     * @returns The final state of the accumulator
     */
    LinkedList.prototype.reduce = function (f, start, reverse) {
        if (reverse === void 0) { reverse = false; }
        var currentIndex = reverse ? this.length - 1 : 0;
        var modifier = reverse ? -1 : 1;
        var nextNode = reverse ? 'prev' : 'next';
        var currentElement = reverse ? this.tail : this.head;
        var result;
        if (start !== undefined) {
            result = start;
        }
        else if (currentElement) {
            result = currentElement.data;
            currentElement = currentElement[nextNode];
        }
        else {
            throw new TypeError('Reduce of empty LinkedList with no initial value');
        }
        while (currentElement) {
            result = f(result, currentElement.data, currentIndex, this);
            currentIndex += modifier;
            currentElement = currentElement[nextNode];
        }
        return result;
    };
    /**
     * Convert the linked list to an array
     * ```ts
     * new LinkedList(1, 2, 3).toArray(); // [1, 2, 3]
     * ```
     */
    LinkedList.prototype.toArray = function () {
        return __spread(this);
    };
    /**
     * Convert a linked list to string
     * ```ts
     * new LinkedList('one', 'two', 'three').toString(' <=> ') === 'one <=> two <=> three';
     * ```
     * @param separator Optional string to be placed in between data nodes, default is one space
     */
    LinkedList.prototype.toString = function (separator) {
        if (separator === void 0) { separator = ' '; }
        return this.reduce(function (s, data) { return "" + s + separator + data; });
    };
    /**
     * The iterator implementation
     * ```ts
     * const list = new LinkedList(1, 2, 3);
     * for (const data of list) { log(data); } // 1 2 3
     * ```
     */
    LinkedList.prototype[Symbol.iterator] = function () {
        var element;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    element = this.head;
                    _a.label = 1;
                case 1:
                    if (!(element !== null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, element.data];
                case 2:
                    _a.sent();
                    element = element.next;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    /** Private helper function to reduce duplication of pop() and shift() methods */
    LinkedList.prototype.removeFromAnyEnd = function (node) {
        return node !== null ? this.removeNode(node).data : undefined;
    };
    return LinkedList;
}());
exports.default = LinkedList;

},{"./LinkedListNode":21}],21:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_1 = __importDefault(require("./LinkedList"));
/**
 * The class which represents one link or node in a linked list
 * ```ts
 * const node = new LinkedListNode(1, null, null, null);
 * ```
 */
var LinkedListNode = /** @class */ (function () {
    function LinkedListNode(
    /** Data stored on the node */
    data, 
    /** The previous node in the list */
    prev, 
    /** The next link in the list */
    next, 
    /** The list this node belongs to */
    list) {
        this.data = data;
        this.prev = prev;
        this.next = next;
        this.list = list;
    }
    Object.defineProperty(LinkedListNode.prototype, "value", {
        /**
         * Alias to .data
         * ```ts
         * new LinkedList(1, 2, 3).head.value; // 1
         * ```
         */
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedListNode.prototype, "index", {
        /**
         * Get the index of this node
         * ```ts
         * new LinkedList(1, 2, 3).head.index; // 0
         * ```
         */
        get: function () {
            var _this = this;
            if (!this.list) {
                return undefined;
            }
            return this.list.findIndex(function (value) { return value === _this.value; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Insert a new node before this one
     * ```ts
     * new LinkedList(2, 3).head.insertBefore(1); // 1 <=> 2 <=> 3
     * ```
     * @param data Data to save in the node
     */
    LinkedListNode.prototype.insertBefore = function (data) {
        return this.list !== null
            ? this.list.insertBefore(this, data)
            : new LinkedList_1.default(data, this.data);
    };
    /**
     * Insert new data after this node
     * ```ts
     * new LinkedList(1, 2).tail.insertAfter(3); // 1 <=> 2 <=> 3
     * ```
     * @param data Data to be saved in the node
     */
    LinkedListNode.prototype.insertAfter = function (data) {
        return this.list !== null
            ? this.list.insertAfter(this, data)
            : new LinkedList_1.default(this.data, data);
    };
    /**
     * Remove this node
     * ```ts
     * new LinkedList(1, 2, 3, 4).tail.remove(); // 1 <=> 2 <=> 3
     * ```
     */
    LinkedListNode.prototype.remove = function () {
        if (this.list === null) {
            throw new ReferenceError('Node does not belong to any list');
        }
        return this.list.removeNode(this);
    };
    return LinkedListNode;
}());
exports.default = LinkedListNode;

},{"./LinkedList":20}]},{},[15]);
