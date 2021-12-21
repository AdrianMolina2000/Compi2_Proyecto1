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

},{"ts-linked-list":67}],6:[function(require,module,exports){
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
                        // tree.excepciones.push(error);
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
                        var x = resultadoIzq / resultadoDerecho;
                        if (esEntero(x)) {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                            return parseInt(x.toString());
                        }
                        else {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                            return x;
                        }
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
                        return parseInt((resultadoIzq / resultadoDerecho).toString());
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
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar negativo al tipo ${this.operadorDer.tipo}`, this.line, this.column);
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
    get3D(table, tree) {
        let c3d = ``;
        let izq;
        let der;
        let op;
        let temp;
        let temp2;
        let temp3;
        op = this.operador;
        if (this.operadorDer instanceof Aritmetica && this.operadorIzq instanceof Aritmetica) {
            op = this.operador;
            c3d += this.operadorIzq.get3D(table, tree);
            temp = table.getTemporalActual();
            c3d += this.operadorDer.get3D(table, tree);
            temp2 = table.getTemporalActual();
            temp3 = table.getTemporal();
            table.AgregarTemporal(temp3);
            if (op == "%") {
                c3d += `    ${temp3} = fmod(${temp}, ${temp2});\n`;
            }
            else {
                c3d += `    ${temp3} = ${temp} ${op} ${temp2};\n`;
            }
        }
        else if (this.operadorIzq instanceof Aritmetica) {
            der = this.operadorDer.get3D(table, tree);
            c3d += this.operadorIzq.get3D(table, tree);
            temp = table.getTemporalActual();
            temp2 = table.getTemporal();
            table.AgregarTemporal(temp2);
            if (op == "%") {
                c3d += `    ${temp2} = fmod(${temp}, ${der});\n`;
            }
            else {
                c3d += `    ${temp2} = ${temp} ${op} ${der};\n`;
            }
        }
        else if (this.operadorDer instanceof Aritmetica) {
            izq = this.operadorIzq.get3D(table, tree);
            c3d += this.operadorDer.get3D(table, tree);
            temp = table.getTemporalActual();
            temp2 = table.getTemporal();
            table.AgregarTemporal(temp2);
            if (op == "%") {
                c3d += `    ${temp2} = fmod(${izq}, ${temp});\n`;
            }
            else {
                c3d += `    ${temp2} = ${izq} ${op} ${temp};\n`;
            }
        }
        else {
            izq = this.operadorIzq.get3D(table, tree);
            der = this.operadorDer.get3D(table, tree);
            temp = table.getTemporal();
            table.AgregarTemporal(temp);
            if (op == "%") {
                c3d += `    ${temp} = fmod(${izq}, ${der});\n`;
            }
            else {
                c3d += `    ${temp} = ${izq} ${op} ${der};\n`;
            }
        }
        return c3d;
    }
}
exports.Aritmetica = Aritmetica;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Break extends Nodo_1.Nodo {
    constructor(line, column) {
        super(null, line, column);
    }
    execute(table, tree) {
        return this;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("BREAK");
        return nodo;
    }
}
exports.Break = Break;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class CaracterOFposition extends Nodo_1.Nodo {
    constructor(expresion, posicion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.STRING), line, column);
        this.expresion = expresion;
        this.posicion = posicion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            const pos = this.posicion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                //const inicio_rec=this.inicio;
                return resultado.charAt(pos);
            }
        }
        catch (err) {
            console.log(err);
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error querer imprimir la posicion del string joven`, this.line, this.column);
            tree.excepciones.push(error);
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("CaracterOfPosition");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo("CaracterOfPosition");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.posicion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("CaracterOfPosition");
            return nodo;
        }
    }
}
exports.CaracterOFposition = CaracterOFposition;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Continue extends Nodo_1.Nodo {
    constructor(line, column) {
        super(null, line, column);
    }
    execute(table, tree) {
        return this;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("CONTINUE");
        return nodo;
    }
}
exports.Continue = Continue;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class ConverString extends Nodo_1.Nodo {
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
                return resultado.toString();
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al momento de querrer parsear el numero a string`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("string");
            nodo.agregarHijo("string");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("string");
            return nodo;
        }
    }
}
exports.ConverString = ConverString;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Cos extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.DECIMAL), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return Math.cos(resultado);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando coseno`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("Cos");
            nodo.agregarHijo("cos");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("cos");
            return nodo;
        }
    }
}
exports.Cos = Cos;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const NodoAST_1 = require("../Abstract/NodoAST");
class Identificador extends Nodo_1.Nodo {
    constructor(id, line, column) {
        super(null, line, column);
        this.id = id;
    }
    execute(table, tree) {
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            return error;
        }
        this.tipo = variable.tipo;
        if (variable.valor instanceof Identificador) {
            variable.valor = variable.valor.execute(table, tree);
        }
        this.valor = variable.valor;
        return this.valor;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("IDENTIFICADOR");
        var nodo2 = new NodoAST_1.NodoAST(this.id + "");
        nodo2.agregarHijo(this.valor + "");
        nodo.agregarHijo(nodo2);
        return nodo;
    }
}
exports.Identificador = Identificador;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class InDecrement extends Nodo_1.Nodo {
    constructor(id, operador, line, column) {
        super(null, line, column);
        this.id = id;
        this.operador = operador;
    }
    execute(table, tree) {
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        this.tipo = variable.tipo;
        if (variable.tipo.tipo === tipo_1.tipos.ENTERO) {
            if (this.operador === "++") {
                variable.valor = variable.valor + 1;
                return table.getVariable(this.id).valor;
            }
            else if (this.operador === "--") {
                variable.valor = variable.valor - 1;
                return table.getVariable(this.id).valor;
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `No se puede Incrementar o Decrementar el tipo ${variable.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        else if (variable.tipo.tipo === tipo_1.tipos.DECIMAL) {
            if (this.operador === "++") {
                variable.valor = variable.valor + 1;
                return table.getVariable(this.id).valor;
            }
            else if (this.operador === "--") {
                variable.valor = variable.valor - 1;
                return table.getVariable(this.id).valor;
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `No se puede Incrementar o Decrementar el tipo ${variable.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `No se puede Incrementar o Decrementar el tipo ${variable.tipo}`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("Incremento/Decremento");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo(this.operador);
        return nodo;
    }
}
exports.InDecrement = InDecrement;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Primitivo_1 = require("./Primitivo");
class Length extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.ENTERO), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        const resultado = this.expresion.execute(table, tree);
        try {
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            if (resultado instanceof Primitivo_1.Primitivo) {
                if (resultado.tipo.tipo == 6) {
                    return resultado.valor.length;
                }
            }
            if (this.expresion.tipo.tipo == 6) {
                return this.expresion.valor.length;
            }
            else {
                return resultado.length;
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error con la longitud buscada`, //
            this.line, this.column);
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

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66,"./Primitivo":19}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Log extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.DECIMAL), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return Math.log10(resultado);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando coseno`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("Log10");
            nodo.agregarHijo("Log10");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("Log10");
            return nodo;
        }
    }
}
exports.Log = Log;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Relacional_1 = require("./Relacional");
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
    get3D(table, tree) {
        let c3d = ``;
        let izq;
        let der;
        let op = this.operador;
        let temp;
        let temp2;
        let temp3;
        let etiq;
        let etiq2;
        let etiq3;
        table.bandera = 1;
        if (this.operadorDer instanceof Relacional_1.Relacional && this.operadorIzq instanceof Relacional_1.Relacional) {
            izq = this.operadorIzq.get3D(table, tree);
            der = this.operadorDer.get3D(table, tree);
            etiq = table.getEtiqueta();
            if (op == "||") {
                c3d += izq;
                c3d += `goto ${table.getTrue()};\n`;
                c3d += `    goto ${etiq};\n`;
                c3d += `    ${etiq}:\n`;
                c3d += der;
                c3d += `goto ${table.getTrue()};\n`;
                c3d += `    goto ${table.getFalse()};\n`;
            }
            else if (op == "&&") {
                c3d += izq;
                c3d += `goto ${etiq};\n`;
                c3d += `    goto ${table.getFalse()};\n`;
                c3d += `    ${etiq}:\n`;
                c3d += der;
                c3d += `goto ${table.getTrue()};\n`;
                c3d += `    goto ${table.getFalse()};\n`;
            }
        }
        else if (this.operadorIzq instanceof Relacional_1.Relacional) {
        }
        else if (this.operadorDer instanceof Relacional_1.Relacional) {
        }
        else {
        }
        return c3d;
    }
}
exports.Logico = Logico;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66,"./Relacional":20}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Nativas_Diferentes extends Nodo_1.Nodo {
    constructor(tipo2, expresion, line, column) {
        super(null, line, column);
        this.expresion = expresion;
        this.tipo2 = tipo2;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            if (typeof (resultado) == typeof ("")) {
                if (this.tipo2.tipo == tipo_1.tipos.DECIMAL) {
                    this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                    return parseFloat(resultado);
                }
                else if (this.tipo2.tipo == tipo_1.tipos.ENTERO) {
                    this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                    return parseInt(resultado);
                }
                else if (this.tipo2.tipo == tipo_1.tipos.BOOLEANO) {
                    this.tipo = new tipo_1.Tipo(tipo_1.tipos.BOOLEANO);
                    switch (resultado) {
                        case "true":
                        case "1":
                            return true;
                        case "false":
                        case "0":
                            return false;
                        default:
                            return false;
                    }
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `La entrada debe ser del tipo String para realizar esta operacion `, this.line, this.column);
                tree.excepciones.push(error);
                return error;
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al querrer convertir `, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("Nativas_Indiferentes");
            nodo.agregarHijo(this.tipo);
            nodo.agregarHijo("parse");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("Nativas_Indiferentes");
            return nodo;
        }
    }
}
exports.Nativas_Diferentes = Nativas_Diferentes;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Pow extends Nodo_1.Nodo {
    constructor(base, exponente, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.DECIMAL), line, column);
        this.base = base;
        this.exponente = exponente;
    }
    execute(table, tree) {
        try {
            const resultado = this.base.execute(table, tree);
            const resultado2 = this.exponente.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return Math.pow(resultado, resultado2);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando pow`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("POW");
            nodo.agregarHijo("POW");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.base.getNodo());
            nodo.agregarHijo(",");
            nodo.agregarHijo(this.exponente.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("ToLower");
            return nodo;
        }
    }
}
exports.Pow = Pow;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Primitivo extends Nodo_1.Nodo {
    constructor(tipo, valor, line, column) {
        super(tipo, line, column);
        this.valor = valor;
    }
    execute(table, tree) {
        try {
            if (Array.isArray(this.valor)) {
                var contenido = new Array();
                for (let key in this.valor) {
                    contenido.push(this.valor[key].execute(table, tree));
                }
                return contenido;
            }
        }
        catch (error) {
            console.log(error);
        }
        return this.valor;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("PRIMITIVO");
        nodo.agregarHijo(this.valor + '');
        return nodo;
    }
    get3D(table, tree) {
        let c3d = `${this.valor}`;
        return c3d;
    }
}
exports.Primitivo = Primitivo;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5}],20:[function(require,module,exports){
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
                    console.log(this.operadorIzq);
                    console.log(this.operadorDer);
                    const error = new Excepcion_1.Excepcion('Semantico', `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
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
    get3D(table, tree) {
        let c3d = ``;
        let izq;
        let der;
        let op = this.operador;
        let temp;
        let temp2;
        let temp3;
        let etiq;
        let etiq2;
        let etiq3;
        console.log("OP DER");
        console.log(this.operadorDer);
        console.log("OP DER");
        console.log("OP IZQ"); //vos xd
        console.log(this.operadorIzq);
        console.log("OP IZQ");
        if (this.operadorDer instanceof Relacional && this.operadorIzq instanceof Relacional) {
            table.bandera = 1;
            etiq = table.getEtiqueta();
            etiq2 = table.getEtiqueta();
            c3d += this.operadorIzq.get3D(table, tree);
            c3d += `goto ${etiq};\n`;
            c3d += `    goto ${etiq2};\n`;
            c3d += `    ${etiq}:\n`;
            temp = table.getTemporal();
            table.AgregarTemporal(temp);
            etiq = table.getEtiqueta();
            c3d += `    ${temp} = 1;\n`;
            c3d += `    goto ${etiq};\n`;
            c3d += `    ${etiq2}:\n`;
            c3d += `    ${temp} = 0;\n`;
            c3d += `    ${etiq}:\n`;
            etiq = table.getEtiqueta();
            etiq2 = table.getEtiqueta();
            c3d += this.operadorDer.get3D(table, tree);
            c3d += `goto ${etiq};\n`;
            c3d += `    goto ${etiq2};\n`;
            c3d += `    ${etiq}:\n`;
            temp2 = table.getTemporal();
            table.AgregarTemporal(temp2);
            etiq = table.getEtiqueta();
            c3d += `    ${temp2} = 1;\n`;
            c3d += `    goto ${etiq};\n`;
            c3d += `    ${etiq2}:\n`;
            c3d += `    ${temp2} = 0;\n`;
            c3d += `    ${etiq}:\n`;
            c3d += `    if(${temp} ${op} ${temp2}) goto ${table.getTrue()};\n`;
            c3d += `    goto ${table.getFalse()};\n`;
        }
        else if (this.operadorIzq instanceof Relacional) {
        }
        else if (this.operadorDer instanceof Relacional) {
        }
        else {
            izq = this.operadorIzq.get3D(table, tree);
            der = this.operadorDer.get3D(table, tree);
            if (table.bandera == 0) {
                c3d += `    if(${izq} ${op} ${der}) goto ${table.getTrue()};\n`;
                c3d += `    goto ${table.getFalse()};\n`;
            }
            else {
                c3d += `    if(${izq} ${op} ${der}) `;
            }
        }
        return c3d;
    }
}
exports.Relacional = Relacional;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Seno extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.DECIMAL), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return Math.sin(resultado);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando seno`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("Seno");
            nodo.agregarHijo("sin");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("Seno");
            return nodo;
        }
    }
}
exports.Seno = Seno;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Sqrt extends Nodo_1.Nodo {
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
                return Math.sqrt(resultado);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando sqrt`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("Sqrt");
            nodo.agregarHijo("Sqrt");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("Sqrt");
            return nodo;
        }
    }
}
exports.Sqrt = Sqrt;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Substring extends Nodo_1.Nodo {
    constructor(expresion, inicio, final, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.STRING), line, column);
        this.expresion = expresion;
        this.inicio = inicio;
        this.final = final;
    }
    execute(table, tree) {
        // try {
        const ini = this.inicio.execute(table, tree);
        const fin = this.final.execute(table, tree);
        const resultado = this.expresion.execute(table, tree);
        if (resultado instanceof Excepcion_1.Excepcion) {
            return resultado;
        }
        if (this.inicio.tipo.tipo == 0 && this.final.tipo.tipo == 0) {
            return resultado.substring(ini, fin + 1);
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `Ambas posiciones deben ser un numero entero `, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("Substring");
            nodo.agregarHijo("Substring");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("Substring");
            return nodo;
        }
    }
}
exports.Substring = Substring;
/*
String animal = "Tigre";
println(animal.subString(0,-1)); //gre

*/ 

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Tan extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.DECIMAL), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return Math.tan(resultado);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando tangente`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("Tan");
            nodo.agregarHijo("Tan");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("Tan");
            return nodo;
        }
    }
}
exports.Tan = Tan;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const NodoAST_1 = require("../Abstract/NodoAST");
class Ternario extends Nodo_1.Nodo {
    constructor(operadorTop, operadorMid, operadorBot, line, column) {
        super(null, line, column);
        this.operadorTop = operadorTop;
        this.operadorBot = operadorBot;
        this.operadorMid = operadorMid;
    }
    execute(table, tree) {
        const resultadoTop = this.operadorTop.execute(table, tree);
        if (resultadoTop instanceof Excepcion_1.Excepcion) {
            return resultadoTop;
        }
        const resultadoMid = this.operadorMid.execute(table, tree);
        if (resultadoMid instanceof Excepcion_1.Excepcion) {
            return resultadoMid;
        }
        const resultadoBot = this.operadorBot.execute(table, tree);
        if (resultadoBot instanceof Excepcion_1.Excepcion) {
            return resultadoBot;
        }
        if (resultadoTop) {
            this.tipo = this.operadorMid.tipo;
        }
        else {
            this.tipo = this.operadorBot.tipo;
        }
        return resultadoTop ? resultadoMid : resultadoBot;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("TERNARIO");
        nodo.agregarHijo(this.operadorBot.getNodo());
        nodo.agregarHijo("?");
        nodo.agregarHijo(this.operadorMid.getNodo());
        nodo.agregarHijo(":");
        nodo.agregarHijo(this.operadorTop.getNodo());
        return nodo;
    }
}
exports.Ternario = Ternario;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class ToDouble extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.DECIMAL), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return resultado.toFixed(2);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al momento de querrer parsear el numero a decimal`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("ToDouble");
            nodo.agregarHijo("ToDouble");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("ToDouble");
            return nodo;
        }
    }
}
exports.ToDouble = ToDouble;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class ToInt extends Nodo_1.Nodo {
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
                return parseInt(resultado);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al momento de querrer parsear el numero a entero`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("ToInt");
            nodo.agregarHijo("ToInt");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("ToInt");
            return nodo;
        }
    }
}
exports.ToInt = ToInt;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],28:[function(require,module,exports){
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

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],29:[function(require,module,exports){
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

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class TypeOf extends Nodo_1.Nodo {
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
                try {
                    let variable;
                    variable = table.getVariable(this.expresion.id);
                    if (variable.tipo2.tipo == tipo_1.tipos.VARIABLE) {
                        return this.expresion.tipo + "";
                    }
                    return variable.tipo2 + "";
                }
                catch (err) {
                    return this.expresion.tipo + "";
                }
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al devolver el tipo`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("TYPEOF");
            nodo.agregarHijo("TypeOf");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("TYPEOF");
            return nodo;
        }
    }
}
exports.TypeOf = TypeOf;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const NodoAST_1 = require("../Abstract/NodoAST");
const tipo_1 = require("../other/tipo");
const Obtener_struct_1 = require("../Instrucciones/Obtener_struct");
class Vector extends Nodo_1.Nodo {
    constructor(id, posicion, line, column) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.bandera1 = false;
    }
    execute(table, tree) {
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `El Vector {${this.id}} no ha sido encontrada`, this.line, this.column);
            return error;
        }
        this.tipo = variable.tipo;
        var arreglo;
        if (variable.valor instanceof Obtener_struct_1.Obtener_struct) {
            variable.valor.execute(table, tree);
            arreglo = variable.valor.valor.valor;
        }
        else {
            arreglo = variable.valor.valor;
        }
        this.pos = this.posicion.execute(table, tree);
        if (this.posicion.tipo.tipo == tipo_1.tipos.ENTERO) {
            if ((this.pos >= arreglo.length) || (this.pos < 0)) {
                const error = new Excepcion_1.Excepcion('Semantico', `efe en vector La Posicion especificada no es valida para el vector {${this.id}}`, this.line, this.column);
                return error;
            }
            else {
                try {
                    this.bandera1 = true;
                    this.valor = arreglo[this.pos].execute(table, tree);
                    return this.valor;
                }
                catch (err) {
                    const error = new Excepcion_1.Excepcion('Semantico', ` efe vector 2La Posicion especificada no es valida para el vector {${this.id}}`, this.line, this.column);
                    return error;
                }
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba un valor entero en la posicion`, this.line, this.column);
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("Vector Posicion");
        try {
            if (this.bandera1) {
                var nodo2 = new NodoAST_1.NodoAST(`${this.id}[${this.pos}]`);
                nodo2.agregarHijo(this.valor.getNodo());
                nodo.agregarHijo(nodo2);
            }
        }
        catch (err) {
        }
        return nodo;
    }
}
exports.Vector = Vector;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Instrucciones/Obtener_struct":50,"../other/Excepcion":65,"../other/tipo":66}],32:[function(require,module,exports){
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
        ; return o; }, $V0 = [1, 8], $V1 = [1, 15], $V2 = [1, 17], $V3 = [1, 18], $V4 = [1, 19], $V5 = [1, 9], $V6 = [1, 10], $V7 = [1, 11], $V8 = [1, 12], $V9 = [1, 13], $Va = [1, 14], $Vb = [2, 5, 8, 45, 47, 48, 115, 116, 117, 118, 119, 120], $Vc = [1, 25], $Vd = [8, 15, 23, 39], $Ve = [1, 28], $Vf = [1, 29], $Vg = [17, 21], $Vh = [2, 69], $Vi = [1, 35], $Vj = [1, 58], $Vk = [1, 59], $Vl = [1, 57], $Vm = [1, 43], $Vn = [1, 44], $Vo = [1, 45], $Vp = [1, 46], $Vq = [1, 47], $Vr = [1, 48], $Vs = [1, 49], $Vt = [1, 50], $Vu = [1, 51], $Vv = [1, 52], $Vw = [1, 53], $Vx = [1, 54], $Vy = [1, 55], $Vz = [1, 61], $VA = [1, 62], $VB = [1, 63], $VC = [1, 64], $VD = [1, 65], $VE = [2, 11], $VF = [11, 12, 17, 21, 24, 39, 60, 73, 74, 75, 76, 77, 83, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 106], $VG = [11, 21], $VH = [1, 98], $VI = [1, 83], $VJ = [1, 82], $VK = [1, 84], $VL = [1, 85], $VM = [1, 86], $VN = [1, 87], $VO = [1, 88], $VP = [1, 89], $VQ = [1, 90], $VR = [1, 91], $VS = [1, 92], $VT = [1, 93], $VU = [1, 94], $VV = [1, 95], $VW = [1, 96], $VX = [1, 97], $VY = [1, 99], $VZ = [1, 119], $V_ = [11, 21, 24], $V$ = [2, 161], $V01 = [1, 151], $V11 = [11, 12, 17, 21, 24, 39, 60, 73, 74, 83, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 106], $V21 = [11, 12, 17, 21, 24, 60, 83, 84, 90, 91, 92, 93, 94, 106], $V31 = [11, 12, 17, 21, 24, 60, 83, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 106], $V41 = [11, 12, 17, 21, 24, 60, 90, 91, 92, 93, 94, 106], $V51 = [1, 210], $V61 = [1, 205], $V71 = [1, 201], $V81 = [1, 208], $V91 = [1, 212], $Va1 = [1, 213], $Vb1 = [1, 214], $Vc1 = [1, 215], $Vd1 = [1, 216], $Ve1 = [1, 217], $Vf1 = [1, 218], $Vg1 = [2, 8, 14, 32, 43, 45, 47, 48, 54, 56, 59, 61, 62, 63, 64, 69, 70, 115, 116, 117, 118, 119, 120], $Vh1 = [1, 242], $Vi1 = [1, 241], $Vj1 = [1, 270], $Vk1 = [1, 269], $Vl1 = [8, 39, 49], $Vm1 = [1, 301], $Vn1 = [1, 323], $Vo1 = [1, 318], $Vp1 = [1, 314], $Vq1 = [1, 321], $Vr1 = [14, 21], $Vs1 = [2, 8, 14, 32, 43, 45, 47, 48, 54, 55, 56, 59, 61, 62, 63, 64, 69, 70, 115, 116, 117, 118, 119, 120], $Vt1 = [1, 356], $Vu1 = [14, 59, 61];
    var parser = { trace: function trace() { },
        yy: {},
        symbols_: { "error": 2, "INICIO": 3, "INSTRUCCIONES": 4, "EOF": 5, "INSTRUCCION": 6, "TIPO": 7, "identifier": 8, "(": 9, "Verificar_params": 10, ")": 11, "{": 12, "LISTA_INSTRUCCIONES": 13, "}": 14, "main": 15, "DECLARACION": 16, ";": 17, "llamada": 18, "PRINT": 19, "PARAMETROS": 20, ",": 21, "OPCION_PARAMETROS": 22, "[": 23, "]": 24, "ListaIns": 25, "llamar": 26, "parametros_llamada": 27, "EXPRESION": 28, "ASIGNACION": 29, "IF": 30, "SWITCH": 31, "break": 32, "WHILE": 33, "DO": 34, "FOR": 35, "decremento": 36, "incremento": 37, "RETURN": 38, ".": 39, "pop": 40, "push": 41, "STRUCT": 42, "continue": 43, "ListaIns2": 44, "print": 45, "LISTA_EXPRESION": 46, "println": 47, "printf": 48, "=": 49, "LISTA_ID": 50, "LISTA_EXPRESION_PTO": 51, "OPCION_PTO": 52, "PARAMETROS_LLAMADA": 53, "if": 54, "else": 55, "switch": 56, "CASE_LIST": 57, "DEFAULT_LIST": 58, "case": 59, ":": 60, "default": 61, "while": 62, "do": 63, "for": 64, "forIn": 65, "in": 66, "forVar": 67, "for_increment": 68, "return": 69, "struct": 70, "Lista_declaracion": 71, "OPCION_DECLARACIO_Struct": 72, "-": 73, "+": 74, "*": 75, "/": 76, "%": 77, "sin": 78, "cos": 79, "tan": 80, "pow": 81, "sqrt": 82, "==": 83, "!=": 84, ">=": 85, ">": 86, "<=": 87, "<": 88, "!": 89, "&&": 90, "||": 91, "&": 92, "^": 93, "?": 94, "null": 95, "numero": 96, "true": 97, "false": 98, "caracter": 99, "cadena": 100, "toLowercase": 101, "toUppercase": 102, "length": 103, "caracterOfPosition": 104, "subString": 105, "#": 106, "parse": 107, "toInt": 108, "toDouble": 109, "string": 110, "typeof": 111, "log10": 112, "LISTA_EXPRESION_PTO2": 113, "OPCION_PTO2": 114, "double": 115, "String": 116, "int": 117, "boolean": 118, "char": 119, "void": 120, "$accept": 0, "$end": 1 },
        terminals_: { 2: "error", 5: "EOF", 8: "identifier", 9: "(", 11: ")", 12: "{", 14: "}", 15: "main", 17: ";", 21: ",", 23: "[", 24: "]", 32: "break", 36: "decremento", 37: "incremento", 39: ".", 40: "pop", 41: "push", 43: "continue", 45: "print", 47: "println", 48: "printf", 49: "=", 54: "if", 55: "else", 56: "switch", 59: "case", 60: ":", 61: "default", 62: "while", 63: "do", 64: "for", 66: "in", 69: "return", 70: "struct", 73: "-", 74: "+", 75: "*", 76: "/", 77: "%", 78: "sin", 79: "cos", 80: "tan", 81: "pow", 82: "sqrt", 83: "==", 84: "!=", 85: ">=", 86: ">", 87: "<=", 88: "<", 89: "!", 90: "&&", 91: "||", 92: "&", 93: "^", 94: "?", 95: "null", 96: "numero", 97: "true", 98: "false", 99: "caracter", 100: "cadena", 101: "toLowercase", 102: "toUppercase", 103: "length", 104: "caracterOfPosition", 105: "subString", 106: "#", 107: "parse", 108: "toInt", 109: "toDouble", 110: "string", 111: "typeof", 112: "log10", 115: "double", 116: "String", 117: "int", 118: "boolean", 119: "char", 120: "void" },
        productions_: [0, [3, 2], [4, 2], [4, 1], [6, 8], [6, 8], [6, 2], [6, 1], [6, 2], [6, 1], [10, 1], [10, 0], [20, 3], [20, 1], [22, 2], [22, 4], [13, 2], [13, 1], [18, 2], [26, 4], [26, 3], [27, 3], [27, 1], [25, 2], [25, 2], [25, 2], [25, 1], [25, 1], [25, 2], [25, 1], [25, 2], [25, 1], [25, 3], [25, 3], [25, 2], [25, 6], [25, 7], [25, 2], [25, 2], [25, 1], [25, 1], [44, 2], [44, 2], [44, 2], [44, 1], [44, 2], [44, 1], [44, 2], [44, 1], [44, 3], [44, 3], [44, 2], [44, 6], [44, 7], [44, 2], [44, 2], [44, 1], [44, 1], [19, 4], [19, 4], [19, 4], [46, 3], [46, 1], [16, 4], [16, 2], [16, 6], [16, 4], [16, 4], [50, 3], [50, 1], [29, 3], [29, 5], [29, 6], [51, 2], [51, 1], [52, 2], [52, 1], [52, 4], [53, 3], [53, 1], [30, 7], [30, 5], [30, 11], [30, 9], [30, 9], [30, 7], [31, 8], [31, 7], [31, 7], [57, 5], [57, 4], [58, 3], [33, 7], [34, 8], [35, 7], [35, 11], [65, 1], [67, 4], [67, 3], [68, 2], [68, 2], [68, 3], [38, 2], [38, 1], [42, 5], [71, 3], [71, 1], [72, 2], [72, 2], [72, 4], [28, 2], [28, 3], [28, 3], [28, 3], [28, 3], [28, 3], [28, 4], [28, 4], [28, 4], [28, 6], [28, 4], [28, 3], [28, 3], [28, 3], [28, 3], [28, 3], [28, 3], [28, 2], [28, 3], [28, 3], [28, 3], [28, 3], [28, 5], [28, 1], [28, 1], [28, 1], [28, 1], [28, 1], [28, 1], [28, 5], [28, 5], [28, 5], [28, 6], [28, 8], [28, 1], [28, 3], [28, 2], [28, 4], [28, 6], [28, 2], [28, 3], [28, 6], [28, 4], [28, 4], [28, 4], [28, 4], [28, 4], [28, 1], [28, 2], [113, 3], [113, 2], [114, 0], [114, 1], [114, 4], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1]],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
            /* this == yyval */
            var $0 = $$.length - 1;
            switch (yystate) {
                case 1:
                    this.$ = new Tree($$[$0 - 1]);
                    return this.$;
                    new ReporteGramatica("INICIO -> INSTRUCCIONES  EOF", "Inicio.val = INSTRUCCIONES.val");
                    break;
                case 2:
                    this.$ = $$[$0 - 1];
                    $$[$0 - 1].push($$[$0]);
                    new ReporteGramatica("INSTRUCCIONES -> INSTRUCCIONES INSTRUCCION ", " INSTRUCCIONES = new Array (INSTRUCCION)              ----    INSTRUCCIONES.push(INSTRUCCION.val)");
                    break;
                case 3:
                    this.$ = [$$[$0]];
                    new ReporteGramatica("INSTRUCCIONES ->  INSTRUCCIONES ", "INSTRUCCIONES.val=[INSTRUCCION.val]");
                    break;
                case 4:
                    this.$ = new DeclaracionMetodo($$[$0 - 7], $$[$0 - 6], $$[$0 - 4], $$[$0 - 1], _$[$0 - 7].first_line, _$[$0 - 7].first_column);
                    new ReporteGramatica("INSTRUCCION -> TIPO identificador ( Verificar_params ) { LISTA_INSTRUCCIONES } ", " INSTRUCCION.val =new Declaracion_Metodo=(TIPO.val,identificador.lexval,Verificar_params.value,LISTA_INSTRUCCIONES.value)");
                    break;
                case 5:
                    this.$ = new Main($$[$0 - 7], $$[$0 - 1], _$[$0 - 7].first_line, _$[$0 - 7].first_column);
                    break;
                case 6:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("INSTRUCCION ->  DECLARACION ", " INSTRUCCION.val=DECLARACION.val");
                    break;
                case 7:
                    this.$ = $$[$0];
                    new ReporteGramatica("INSTRUCCION ->  llamada ", " INSTRUCCION.val=llamada.val");
                    break;
                case 9:
                    console.log("Error Sintactico " + yytext
                        + " linea: " + this._$.first_line
                        + " columna: " + this._$.first_column);
                    new Error("Error Sintactico", " no se esperaba el token  " + yytext, yylineno, 2);
                    break;
                case 10:
                    this.$ = $$[$0];
                    new ReporteGramatica("Verificar_params ->  PARAMETROS ", " Verificar_params.val=PARAMETROS.val");
                    break;
                case 11:
                    this.$ = [];
                    new ReporteGramatica("Verificar_params ->  epsilon ", " Verificar_params.val=[]");
                    break;
                case 12:
                    this.$ = $$[$0 - 2];
                    this.$.push($$[$0]);
                    new ReporteGramatica("PARAMETROS ->  PARAMETROS , TIPO identifier ", " PARAMETROS=new Array(Declaracion)   PARAMETROS.push (new Declaracion(PARAMETROS.val,TIPO.val,identifier.lexval))");
                    break;
                case 13:
                    this.$ = [];
                    this.$.push($$[$0]);
                    new ReporteGramatica("PARAMETROS ->  PARAMETROS , TIPO identifier ", " PARAMETROS= [new Declaracion(TIPO.val,identifier.lexval)]");
                    break;
                case 14:
                    this.$ = new Declaracion($$[$0 - 1], [$$[$0]], defal($$[$0 - 1]), _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    break;
                case 15:
                    this.$ = new DeclaracionArray($$[$0 - 3], $$[$0], new Primitivo(new Tipo(tipos.ARREGLO), [], _$[$0 - 3].first_line, _$[$0 - 3].first_column), _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    break;
                case 16:
                    this.$ = $$[$0 - 1];
                    $$[$0 - 1].push($$[$0]);
                    new ReporteGramatica("LISTA_INSTRUCCIONES -> LISTA_INSTRUCCIONES ListaIns ", " LISTA_INSTRUCCIONES = new Array (Lista_Ans)              ----    LISTA_INSTRUCCIONES.push(ListaIns.val)");
                    break;
                case 17:
                    this.$ = [$$[$0]];
                    new ReporteGramatica("LISTA_INSTRUCCIONES -> ListaIns ", "                ----    LISTA_INSTRUCCIONES.val=[ListaIns.val)]");
                    break;
                case 18:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("llamada ->  llamar ", " llamada.val=llamar.val");
                    break;
                case 19:
                    this.$ = new LlamadaMetodo($$[$0 - 3], $$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("llamar ->  indetifier (parametros_llamada) ", " llamar.val=new LlmadaMetodo(identifier.lexval,parametros_llamada.val)  ");
                    break;
                case 20:
                    this.$ = new LlamadaMetodo($$[$0 - 2], [], _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("llamar ->  indetifier (parametros_llamada) ", " llamar.val=new LlmadaMetodo(identifier.lexval,parametros_llamada.val)  ");
                    break;
                case 21:
                    this.$ = $$[$0 - 2];
                    this.$.push($$[$0]);
                    new ReporteGramatica(" parametros_llamada-> parametros_llamada , EXPRESION   ", "paremtros_llamda= new Array(EXPRESION) ----parametros_llama.push(EXPRESION)");
                    break;
                case 22:
                    this.$ = [];
                    this.$.push($$[$0]);
                    new ReporteGramatica(" parametros_llamada-> EXPRESION   ", "paremtros_llamda.val= parametros_llama=[EXPRESION]");
                    break;
                case 23:
                case 41:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("Lista_Ins-> PRINT   ", "Lista_Ins.val= PRINT.val");
                    break;
                case 24:
                case 42:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("Lista_Ins-> DECLARACION   ", "Lista_Ins.val= DECLARACION.val");
                    break;
                case 25:
                case 43:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("Lista_Ins-> ASIGNACION   ", "Lista_Ins.val= ASIGNACION.val");
                    break;
                case 26:
                    this.$ = $$[$0];
                    new ReporteGramatica("Lista_Ins-> IF   ", "Lista_Ins.val= IF.val");
                    break;
                case 27:
                case 44:
                    this.$ = $$[$0];
                    new ReporteGramatica("Lista_Ins-> SWITCH   ", "Lista_Ins.val= SWITCH.val");
                    break;
                case 28:
                case 45:
                    this.$ = new Break(_$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("Lista_Ins-> break;   ", "Lista_Ins.val= new Break(break.lexval");
                    break;
                case 29:
                case 46:
                    this.$ = $$[$0];
                    new ReporteGramatica("Lista_Ins-> WHILE   ", "Lista_Ins.val= WHILE.val");
                    break;
                case 30:
                case 47:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("Lista_Ins-> DO ", "Lista_Ins.val= DO.val");
                    break;
                case 31:
                case 48:
                    this.$ = $$[$0];
                    new ReporteGramatica("Lista_Ins->FOR   ", "Lista_Ins.val= FOR.val");
                    break;
                case 32:
                case 49:
                    this.$ = new InDecrement($$[$0 - 2], "--", _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("Lista_Ins->identifier decremento   ", "Lista_Ins.val= new Decremento(identifier.lexval )");
                    break;
                case 33:
                    this.$ = new InDecrement($$[$0 - 2], "++", _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("Lista_Ins->identifier incremento   ", "Lista_Ins.val= new Decremento(identifier.lexval )");
                    break;
                case 34:
                case 51:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("Lista_Ins->RETURN   ", "Lista_Ins.val= RETURN.val");
                    break;
                case 35:
                case 52:
                    this.$ = new Pop($$[$0 - 5], _$[$0 - 5].first_line, _$[$0 - 5].first_column);
                    new ReporteGramatica("Lista_Ins->identifier .pop   ", "Lista_Ins.val= new Pop(identifier.lexval )");
                    break;
                case 36:
                case 53:
                    this.$ = new AddLista($$[$0 - 6], $$[$0 - 2], _$[$0 - 6].first_line, _$[$0 - 6].first_column);
                    new ReporteGramatica("Lista_Ins->identifier .push   ", "Lista_Ins.val= new Push(identifier.lexval )");
                    break;
                case 37:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("Lista_Ins->STRUCT   ", "Lista_Ins.val= STRUCT.val");
                    break;
                case 38:
                    this.$ = new Continue(_$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("Lista_Ins->continue   ", "Lista_Ins.val= new continue( )");
                    break;
                case 39:
                    this.$ = $$[$0];
                    new ReporteGramatica("Lista_Ins->llamada  ", "Lista_Ins.val=llamada.val");
                    break;
                case 40:
                    console.log("Error Sintactico " + yytext
                        + " linea: " + this._$.first_line
                        + " columna: " + this._$.first_column);
                    new Error("Error Sintactico", " no se esperaba el token  " + yytext, yylineno, 2);
                    break;
                case 50:
                    this.$ = new InDecrement($$[$0 - 2], "++", _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("Lista_Ins->identifier incremento", "Lista_Ins.val= new Decremento(identifier.lexval )");
                    break;
                case 54:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("Lista_Ins->STRUCT   ", "Lista_Ins.val= STRUCT.val");
                    break;
                case 55:
                    this.$ = new Continue(_$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("Lista_Ins->continue   ", "Lista_Ins.val= new continue( )");
                    break;
                case 56:
                    this.$ = $$[$0];
                    new ReporteGramatica("Lista_Ins->llamada  ", "Lista_Ins.val=llamada.val");
                    break;
                case 57:
                    console.log("Error Sintactico " + yytext
                        + " linea: " + this._$.first_line
                        + " columna: " + this._$.first_column);
                    new Error("Error Sintactico", " no se esperaba el token  " + yytext, yylineno, 2);
                    break;
                case 58:
                    this.$ = new Print($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column, 1);
                    new ReporteGramatica("PRINT->print(LISTA_EXPRESION)  ", "PRINT.val=LISTA_EXPRESION.val");
                    break;
                case 59:
                    this.$ = new Print($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column, 2);
                    new ReporteGramatica("PRINT->println(LISTA_EXPRESION)  ", "PRINT.val=LISTA_EXPRESION.val");
                    break;
                case 61:
                    this.$ = $$[$0 - 2];
                    $$[$0 - 2].push($$[$0]);
                    new ReporteGramatica("LISTA_EXPRESION->LISTA_EXPRESION,EXPRESION ", "LISTA_EXPRESION = new Array(EXPRESION) ------- LISTA_EXPRESION.push(EXPRESION)");
                    break;
                case 62:
                    this.$ = [];
                    this.$.push($$[$0]);
                    new ReporteGramatica("LISTA_EXPRESION->EXPRESION ", "LISTA_EXPRESION = new Array(EXPRESION) ------- LISTA_EXPRESION.push(EXPRESION)");
                    break;
                case 63:
                    this.$ = new Declaracion($$[$0 - 3], [$$[$0 - 2]], $$[$0], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("DECLARACION-> TIPO identifier = EXPRESION ", "DECLARACION=new Declaracion(TIPO.val,identifier.lexval,EXPRESION.val)");
                    break;
                case 64:
                    this.$ = new Declaracion($$[$0 - 1], $$[$0], defal($$[$0 - 1]), _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("DECLARACION-> TIPO LISTA_ID ", "DECLARACION=new Declaracion(TIPO.val,LISTA_ID.val)");
                    break;
                case 65:
                    this.$ = new DeclaracionArray($$[$0 - 5], $$[$0 - 2], $$[$0], _$[$0 - 5].first_line, _$[$0 - 5].first_column);
                    new ReporteGramatica("DECLARACION-> TIPO [] identifier = EXPRESION ", "DECLARACION=new DeclaracionArray(TIPO.val,identifier.lexval,EXPRESION.val)");
                    break;
                case 66:
                    this.$ = new DeclaracionArray($$[$0 - 3], $$[$0], new Primitivo(new Tipo(tipos.ARREGLO), [], _$[$0 - 3].first_line, _$[$0 - 3].first_column), _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("DECLARACION-> TIPO []  identifier ", "DECLARACION=new DeclaracionArray(TIPO.val,LISTA_ID.val)");
                    break;
                case 67:
                    this.$ = new DeclaracionVarStruct(new Tipo(tipos.STRUCTS), $$[$0 - 3], [$$[$0 - 2]], $$[$0], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("DECLARACION-> identifier  identifier = llamar", "DECLARACION=new DeclaracionVarStruct(TIPO.val,identifier.lexval,identifier.lexval)");
                    break;
                case 68:
                    this.$ = $$[$0 - 2];
                    $$[$0 - 2].push($$[$0]);
                    new ReporteGramatica("LISTA_ID->LISTA_ID , identifier", "LISTA_ID=new Array(identifier) ----LISTA_ID.push(identifier.lexval)");
                    break;
                case 69:
                    this.$ = [];
                    this.$.push($$[$0]);
                    new ReporteGramatica("LISTA_ID->identifier", "LISTA_ID=[identifier.lexval]");
                    break;
                case 70:
                    this.$ = new Asignacion($$[$0 - 2], $$[$0], _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("ASIGNACION->identifier =EXPRESION", "ASIGNACION=new Asignacion(identifier.lexval,EXPRESION.val)");
                    break;
                case 71:
                    this.$ = new Asignacion_Struct($$[$0 - 4], $$[$0 - 2], $$[$0], _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    new ReporteGramatica("ASIGNACION->identifier . LISTA_EXPRESION_PTO=EXPRESION", "ASIGNACION=new Asignacion_Struct(identifier.lexval,LISTA_EXPRESION_PTO,EXPRESION.val)");
                    break;
                case 72:
                    this.$ = new AsignacionVector($$[$0 - 5], $$[$0 - 3], $$[$0], _$[$0 - 5].first_line, _$[$0 - 5].first_column);
                    new ReporteGramatica("ASIGNACION->identifier . [EXPRESION]=EXPRESION", "ASIGNACION=new AsignacionVector(identifier.lexval,EXPRESION.val,EXPRESION.val)");
                    break;
                case 73:
                    this.$ = $$[$0 - 1];
                    $$[$0 - 1].push($$[$0]);
                    new ReporteGramatica("LISTA_EXPRESION_PTO->LISTA_EXPRESION_PTO OPCION_PTO", "LISTA_EXPRESION_PTO=new Array(OPCION_PTO) ----LISTA_EXPRESION_PTO.push(OPCION_PTO.val)");
                    break;
                case 74:
                    this.$ = [];
                    this.$.push($$[$0]);
                    new ReporteGramatica("LISTA_EXPRESION_PTO-> OPCION_PTO", "LISTA_EXPRESION_PTO.val=[OPCION_PTO.val]");
                    break;
                case 75:
                    this.$ = $$[$0];
                    new ReporteGramatica("OPCION_PTO-> . identifier", "OPCION_PTO.val=identifier.lexval");
                    break;
                case 76:
                    this.$ = $$[$0];
                    new ReporteGramatica("OPCION_PTO->  identifier", "OPCION_PTO.val=identifier.lexval");
                    break;
                case 77:
                    this.$ = $$[$0 - 3];
                    new ReporteGramatica("OPCION_PTO->  identifier [EXPRESION]", "OPCION_PTO.val=identifier.lexval+EXPRESION.val");
                    break;
                case 78:
                    this.$ = $$[$0 - 2];
                    $$[$0 - 2].push($$[$0 - 1]);
                    new ReporteGramatica("PARAMETROS_LLAMADA->PARAMETROS_LLAMADA , EXPRESION", "PARAMETROS_LLAMADA=new Array(EXPRESION) ----PARAMETROS_LLAMADA.push(EXPRESION.val)");
                    break;
                case 79:
                    this.$ = [];
                    this.$.push($$[$0]);
                    new ReporteGramatica("PARAMETROS_LLAMADA-> EXPRESION", "PARAMETROS_LLAMADA=[EXPRESION.val]");
                    break;
                case 80:
                    this.$ = new If($$[$0 - 4], $$[$0 - 1], [], _$[$0 - 6].first_line, _$[$0 - 6].first_column);
                    new ReporteGramatica("IF->  (EXPRESION){LISTA_INSTRUCCIONES}", "IF.val=new IF(EXPRESION.val,LISTA_INSTRUCCIONES.val)");
                    break;
                case 81:
                    this.$ = new If_unico($$[$0 - 2], $$[$0], [], null, 1, _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    new ReporteGramatica("IF->  (EXPRESION) ListaIns", "IF.val=new IF(EXPRESION.val,ListaIns.val)");
                    break;
                case 82:
                    this.$ = new If($$[$0 - 8], $$[$0 - 5], $$[$0 - 1], _$[$0 - 10].first_line, _$[$0 - 10].first_column);
                    new ReporteGramatica("IF->  (EXPRESION){LISTA_INSTRUCCIONES} else {LISTA_INSTRUCCIONES}", "IF.val=new IF(EXPRESION.val,LISTA_INSTRUCCIONES.val)");
                    break;
                case 83:
                    this.$ = new If($$[$0 - 6], $$[$0 - 3], [$$[$0]], _$[$0 - 8].first_line, _$[$0 - 8].first_column);
                    new ReporteGramatica("IF->  (EXPRESION){LISTA_INSTRUCCIONES} else IF", "IF.val=new IF(EXPRESION.val,LISTA_INSTRUCCIONES.val,IF.val)");
                    break;
                case 84:
                    this.$ = new If_unico($$[$0 - 6], null, $$[$0 - 3], $$[$0], 2, _$[$0 - 8].first_line, _$[$0 - 8].first_column);
                    new ReporteGramatica("IF->  (EXPRESION){LISTA_INSTRUCCIONES} else ListaIns2", "IF.val=new IF(EXPRESION.val,LISTA_INSTRUCCIONES.val,ListaIns2.val)");
                    break;
                case 85:
                    this.$ = new If_unico($$[$0 - 4], $$[$0 - 2], [], $$[$0], 1, _$[$0 - 6].first_line, _$[$0 - 6].first_column);
                    new ReporteGramatica("IF->  (EXPRESION)ListaIns2 else ListaIns2", "IF.val=new IF(EXPRESION.val,ListaIns2.val,ListaIns2.val)");
                    break;
                case 86:
                    this.$ = new Switch($$[$0 - 5], $$[$0 - 2], $$[$0 - 1], _$[$0 - 7].first_line, _$[$0 - 7].first_column);
                    new ReporteGramatica("SWITCH-> switch (EXPRESION){  CASE_LIST DEFAULT_LIST}", "SWITCH.val=new SWITCH(EXPRESION.val,CASE_LIST.val,DEFAULT_LIST.val)");
                    break;
                case 87:
                    this.$ = new Switch($$[$0 - 4], $$[$0 - 1], null, _$[$0 - 6].first_line, _$[$0 - 6].first_column);
                    new ReporteGramatica("SWITCH-> switch (EXPRESION){  CASE_LIST }", "SWITCH.val=new SWITCH(EXPRESION.val,CASE_LIST.val)");
                    break;
                case 88:
                    this.$ = new Switch($$[$0 - 4], null, $$[$0 - 1], _$[$0 - 6].first_line, _$[$0 - 6].first_column);
                    new ReporteGramatica("SWITCH-> switch (EXPRESION){   DEFAULT_LIST}", "SWITCH.val=new SWITCH(EXPRESION.val,DEFAULT_LIST.val)");
                    break;
                case 89:
                    this.$ = $$[$0 - 4];
                    this.$.push(new Case($$[$0 - 2], $$[$0], _$[$0 - 4].first_line, _$[$0 - 4].first_column));
                    new ReporteGramatica("CASE_LIST-> CASE_LIST case  EXPRESION :  LISTA_INSTRUCCIONES", "CASE_LIST =new Array(case)---------------------- CASE_LIST.push (new case(EXPRESION.val,LISTA_INSTRUCCIONES.val))");
                    break;
                case 90:
                    this.$ = [];
                    this.$.push(new Case($$[$0 - 2], $$[$0], _$[$0 - 3].first_line, _$[$0 - 3].first_column));
                    new ReporteGramatica("CASE_LIST->  case  EXPRESION :  LISTA_INSTRUCCIONES", "---------------------- CASE_LIST= [new case (EXPRESION.val,LISTA_INSTRUCCIONES.val)]");
                    break;
                case 91:
                    this.$ = $$[$0];
                    new ReporteGramatica("DEFAULT_LIST-> default :  LISTA_INSTRUCCIONES", "DEFAULT_LIST.val=LISTA_INSTRUCCIONES.val");
                    break;
                case 92:
                    this.$ = new While($$[$0 - 4], $$[$0 - 1], _$[$0 - 6].first_line, _$[$0 - 6].first_column);
                    new ReporteGramatica("WHILE-> while ( EXPRESION )  {LISTA_INSTRUCCIONES}", "While.val=new While(EXPRESION.val,LISTA_INSTRUCCIONES.val)");
                    break;
                case 93:
                    this.$ = new DoWhile($$[$0 - 1], $$[$0 - 5], _$[$0 - 7].first_line, _$[$0 - 7].first_column);
                    new ReporteGramatica("DO->do {  LISTA_INSTRUCCIONES } while ( EXPRESION )  ", "DO.val=new DoWhile(LISTA_INSTRUCCIONES.val ,EXPRESION.val)");
                    break;
                case 94:
                    this.$ = new ForIn($$[$0 - 5], $$[$0 - 3], $$[$0 - 1], _$[$0 - 6].first_line, _$[$0 - 6].first_column);
                    new ReporteGramatica("FOR->for forIn in EXPRESIONES { LISTA_INSTRUCCIONES }  ", "FOR.val=new ForIn(forIn.val ,EXPRESION.val,LISTA_INSTRUCCIONES.val)");
                    break;
                case 95:
                    this.$ = new For($$[$0 - 8], $$[$0 - 6], $$[$0 - 4], $$[$0 - 1], _$[$0 - 10].first_line, _$[$0 - 10].first_column);
                    new ReporteGramatica("FOR->for (forVar ; EXPRESION;for_increment)  { LISTA_INSTRUCCIONES }  ", "FOR.val=new For(forVar.val,EXPRESION.val,for_increment.val,LISTA_INSTRUCCIONES.val ");
                    break;
                case 96:
                    this.$ = new Declaracion(new Tipo(tipos.STRING), [$$[$0]], defal(new Tipo(tipos.STRING)), _$[$0].first_line, _$[$0].first_column);
                    new ReporteGramatica("forIn->identifier ", "forIn.val=identifier.lexval ");
                    break;
                case 97:
                    this.$ = new Declaracion($$[$0 - 3], [$$[$0 - 2]], $$[$0], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("forVar->TIPO identifier = EXPRESION ", "forVar.val= new Declaracion(TIPO.val,identifier.lexval,EXPRESION.val ");
                    break;
                case 98:
                    this.$ = new Asignacion($$[$0 - 2], $$[$0], _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("forVar-> identifier = EXPRESION ", "forVar.val= new Asiganacion(identifier.lexval,EXPRESION.val ");
                    break;
                case 99:
                    this.$ = new InDecrement($$[$0 - 1], "++", _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("for_increment-> identifier incremento ", "forVar.val= new InDecrement(identifier.lexval,incremento.lexval) ");
                    break;
                case 100:
                    this.$ = new InDecrement($$[$0 - 1], "--", _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("for_increment-> identifier decremento ", "forVar.val= new InDecrement(identifier.lexval,decremento.lexval) ");
                    break;
                case 101:
                    this.$ = new Asignacion($$[$0 - 2], $$[$0], _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("for_increment-> identifier =EXPRESION ", "forVar.val= new Asignacion(identifier.lexval,EXPRESION.val) ");
                    break;
                case 102:
                    this.$ = new Retorno($$[$0], _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("RETURN-> return EXPRESION ", "RETURN.val= new Retorno(EXPRESION.val) ");
                    break;
                case 103:
                    this.$ = new Retorno(null, _$[$0].first_line, _$[$0].first_column);
                    new ReporteGramatica("RETURN-> return EXPRESION ", "RETURN.val= new Retorno(null) ");
                    break;
                case 104:
                    this.$ = new Struct($$[$0 - 3], $$[$0 - 1], _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    new ReporteGramatica("STRUCT-> struct identifier {Lista_declaracion} ", "STRUCT.val= new Struct(identifier.lexval, Lista_declaracion.val) ");
                    break;
                case 105:
                    this.$ = $$[$0 - 2];
                    $$[$0 - 2].push($$[$0]);
                    new ReporteGramatica("Lista_declaracion-> Lista_declaracion , OPCION_DECLARACIO_Struct ", "Lista_declaracion.val= new Array (OPCION_DECLARACIO_Struct)------Lista_declaracion.push(OPCION_DECLARACIO_Struct.val ) ");
                    break;
                case 106:
                    this.$ = [];
                    this.$.push($$[$0]);
                    new ReporteGramatica("Lista_declaracion->   OPCION_DECLARACIO_Struct ", "Lista_declaracion.val= [OPCION_DECLARACIO_Struct.val ] ");
                    break;
                case 107:
                    this.$ = new Declaracion($$[$0 - 1], [$$[$0]], defal($$[$0 - 1]), _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("OPCION_DECLARACIO_Struct->   TIPO identifier ", "OPCION_DECLARACIO_Struct.val= new Declaracion( TIPO.val,identifier.lexval  ) ");
                    break;
                case 108:
                    this.$ = new DeclaracionVarStruct(new Tipo(tipos.STRUCTS), $$[$0 - 1], $$[$0], null, _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("OPCION_DECLARACIO_Struct->   identifier identifier ", "OPCION_DECLARACIO_Struct.val= new  DeclaracionVarStruct( identifier.lexval ,identifier.lexval  ) ");
                    break;
                case 109:
                    this.$ = new DeclaracionArray($$[$0 - 3], $$[$0], new Primitivo(new Tipo(tipos.ARREGLO), [], _$[$0 - 3].first_line, _$[$0 - 3].first_column), _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("OPCION_DECLARACIO_Struct->   TIPO [] identifier ", "OPCION_DECLARACIO_Struct.val= new  DeclaracionArray( TIPO.val ,identifier.lexval  ) ");
                    break;
                case 110:
                    this.$ = new Aritmetica(null, $$[$0], '-', _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("EXPRESION->  - EXPRESION  ", "EXPRESION.val= new  Aritmetica( EXPRESION.val  ) ");
                    break;
                case 111:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '+', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION +EXPRESION  ", "EXPRESION.val= new  Aritmetica( EXPRESION.val ,+,  EXPRESION.val ) ");
                    break;
                case 112:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '-', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  - EXPRESION  ", "EXPRESION.val= new  Aritmetica( EXPRESION.val, -,  EXPRESION.val ) ");
                    break;
                case 113:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '*', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  * EXPRESION  ", "EXPRESION.val= new  Aritmetica( EXPRESION.val *  EXPRESION.val ) ");
                    break;
                case 114:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '/', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  ,/, EXPRESION  ", "EXPRESION.val= new  Aritmetica( EXPRESION.val ,/,  EXPRESION.val ) ");
                    break;
                case 115:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '%', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  % EXPRESION  ", "EXPRESION.val= new  Aritmetica( EXPRESION.val ,% , EXPRESION.val ) ");
                    break;
                case 116:
                    this.$ = new Seno($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION->   sin(EXPRESION)  ", "EXPRESION.val= new  Seno(EXPRESION.val) ");
                    break;
                case 117:
                    this.$ = new Cos($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION->   cos(EXPRESION)  ", "EXPRESION.val= new  Cos(EXPRESION.val) ");
                    break;
                case 118:
                    this.$ = new Tan($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION->   tan(EXPRESION)  ", "EXPRESION.val= new  Tan(EXPRESION.val) ");
                    break;
                case 119:
                    this.$ = new Pow($$[$0 - 3], $$[$0 - 1], _$[$0 - 5].first_line, _$[$0 - 5].first_column);
                    new ReporteGramatica("EXPRESION->   pow(EXPRESION)  ", "EXPRESION.val= new  Pow(EXPRESION.val) ");
                    break;
                case 120:
                    this.$ = new Sqrt($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION->   sqrt(EXPRESION)  ", "EXPRESION.val= new  Sqrt(EXPRESION.val) ");
                    break;
                case 121:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '==', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  == EXPRESION  ", "EXPRESION.val= new  Relacional( EXPRESION.val ,==, EXPRESION.val ) ");
                    break;
                case 122:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '!=', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  != EXPRESION  ", "EXPRESION.val= new  Relacional( EXPRESION.val ,!=, EXPRESION.val ) ");
                    break;
                case 123:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '>=', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  >= EXPRESION  ", "EXPRESION.val= new  Relacional( EXPRESION.val ,>=, EXPRESION.val ) ");
                    break;
                case 124:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '>', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  > EXPRESION  ", "EXPRESION.val= new  Relacional( EXPRESION.val ,>, EXPRESION.val ) ");
                    break;
                case 125:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '<=', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  <= EXPRESION  ", "EXPRESION.val= new  Relacional( EXPRESION.val, <= ,EXPRESION.val ) ");
                    break;
                case 126:
                    this.$ = new Relacional($$[$0 - 2], $$[$0], '<', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  < EXPRESION  ", "EXPRESION.val= new  Relacional( EXPRESION.val ,< ,EXPRESION.val ) ");
                    break;
                case 127:
                    this.$ = new Logico(null, $$[$0], '!', _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("EXPRESION->   !EXPRESION  ", "EXPRESION.val= new  Logico( ! ,EXPRESION.val ) ");
                    break;
                case 128:
                    this.$ = new Logico($$[$0 - 2], $$[$0], '&&', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  < EXPRESION  ", "EXPRESION.val= new  Logico( EXPRESION.val ,< ,EXPRESION.val ) ");
                    break;
                case 129:
                    this.$ = new Logico($$[$0 - 2], $$[$0], '||', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  < EXPRESION  ", "EXPRESION.val= new  Logico( EXPRESION.val ,< ,EXPRESION.val ) ");
                    break;
                case 130:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '&', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  & EXPRESION  ", "EXPRESION.val= new  Aritmetica( EXPRESION.val ,& , EXPRESION.val ) ");
                    break;
                case 131:
                    this.$ = new Aritmetica($$[$0 - 2], $$[$0], '^', _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  ^ EXPRESION  ", "EXPRESION.val= new  Aritmetica( EXPRESION.val ,^ , EXPRESION.val ) ");
                    break;
                case 132:
                    this.$ = new Ternario($$[$0 - 4], $$[$0 - 2], $$[$0], _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION  ? EXPRESION : EXPRESION  ", "EXPRESION.val= new  Ternario( EXPRESION.val ,EXPRESION.val, EXPRESION.val ) ");
                    break;
                case 134:
                    this.$ = new Primitivo(new Tipo(esEntero(Number($$[$0]))), Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
                    new ReporteGramatica("EXPRESION->   numero  ", "EXPRESION.val= new  Primitivo( numero.lexval ) ");
                    break;
                case 135:
                    this.$ = new Primitivo(new Tipo(tipos.BOOLEANO), true, _$[$0].first_line, _$[$0].first_column);
                    new ReporteGramatica("EXPRESION->   true  ", "EXPRESION.val= new  Primitivo( true.lexval ) ");
                    break;
                case 136:
                    this.$ = new Primitivo(new Tipo(tipos.BOOLEANO), false, _$[$0].first_line, _$[$0].first_column);
                    new ReporteGramatica("EXPRESION->   false  ", "EXPRESION.val= new  Primitivo( false.lexval ) ");
                    break;
                case 137:
                    this.$ = new Primitivo(new Tipo(tipos.CARACTER), $$[$0].replace(/\'/g, ""), _$[$0].first_line, _$[$0].first_column);
                    new ReporteGramatica("EXPRESION->   caracter  ", "EXPRESION.val= new  Primitivo( caracter.lexval ) ");
                    break;
                case 138:
                    this.$ = new Primitivo(new Tipo(tipos.STRING), $$[$0].replace(/\"/g, ""), _$[$0].first_line, _$[$0].first_column);
                    new ReporteGramatica("EXPRESION->   cadena  ", "EXPRESION.val= new  Primitivo( cadena.lexval ) ");
                    break;
                case 139:
                    this.$ = new ToLower($$[$0 - 4], _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION . toLowecase()  ", "EXPRESION.val= new  toLowecase( EXPRESION.val ) ");
                    break;
                case 140:
                    this.$ = new ToUpper($$[$0 - 4], _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION . toUppercase()  ", "EXPRESION.val= new  toUppercase( EXPRESION.val ) ");
                    break;
                case 141:
                    this.$ = new Length($$[$0 - 4], _$[$0 - 4].first_line, _$[$0 - 4].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION . length()  ", "EXPRESION.val= new  length( EXPRESION.val ) ");
                    break;
                case 142:
                    this.$ = new CaracterOFposition($$[$0 - 5], $$[$0 - 1], _$[$0 - 5].first_line, _$[$0 - 5].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION . CaracterOFposition()  ", "EXPRESION.val= new  CaracterOFposition( EXPRESION.val ) ");
                    break;
                case 143:
                    this.$ = new Substring($$[$0 - 7], $$[$0 - 3], $$[$0 - 1], _$[$0 - 7].first_line, _$[$0 - 7].first_column);
                    new ReporteGramatica("EXPRESION->   EXPRESION . Substring(EXPRESION,EXPRESION)  ", "EXPRESION.val= new  Substring( EXPRESION.val,EXPRESION.val ) ");
                    break;
                case 145:
                    this.$ = new Primitivo(new Tipo(tipos.ARREGLO), $$[$0 - 1], _$[$0 - 2].first_line, _$[$0 - 2].first_column);
                    new ReporteGramatica("EXPRESION->   [LISTA_EXPRESION]  ", "EXPRESION.val= new  Primitivo( LISTA_EXPRESION.val ) ");
                    break;
                case 146:
                    this.$ = new Primitivo(new Tipo(tipos.ARREGLO), [], _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("EXPRESION->   [LISTA_EXPRESION]  ", "EXPRESION.val= new  Primitivo( LISTA_EXPRESION.val ) ");
                    break;
                case 147:
                    this.$ = new Vector($$[$0 - 3], $$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION-> identifier  [EXPRESION]  ", "EXPRESION.val= new  Vector( identifier.lexval,EXPRESION.val ) ");
                    break;
                case 150:
                    this.$ = $$[$0 - 1];
                    new ReporteGramatica("EXPRESION->   (EXPRESION)  ", "EXPRESION.val= EXPRESION.val ");
                    break;
                case 151:
                    this.$ = new Nativas_Diferentes($$[$0 - 5], $$[$0 - 1], _$[$0 - 5].first_line, _$[$0 - 5].first_column);
                    new ReporteGramatica("EXPRESION-> TIPO . parse (EXPRESION)  ", "EXPRESION.val= new  Nativas_Diferentes( TIPO.val,EXPRESION.val ) ");
                    break;
                case 152:
                    this.$ = new ToInt($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION-> toInt (EXPRESION)  ", "EXPRESION.val= new  ToInt( EXPRESION.val ) ");
                    break;
                case 153:
                    this.$ = new ToDouble($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION-> ToDouble (EXPRESION)  ", "EXPRESION.val= new  ToDouble( EXPRESION.val ) ");
                    break;
                case 154:
                    this.$ = new ConverString($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION-> string (EXPRESION)  ", "EXPRESION.val= new  ConverString( EXPRESION.val ) ");
                    break;
                case 155:
                    this.$ = new TypeOf($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION-> TypeOf (EXPRESION)  ", "EXPRESION.val= new  TypeOf( EXPRESION.val ) ");
                    break;
                case 156:
                    this.$ = new Log($$[$0 - 1], _$[$0 - 3].first_line, _$[$0 - 3].first_column);
                    new ReporteGramatica("EXPRESION-> Log (EXPRESION)  ", "EXPRESION.val= new  Log( EXPRESION.val ) ");
                    break;
                case 157:
                    this.$ = new Identificador($$[$0], _$[$0].first_line, _$[$0].first_column);
                    new ReporteGramatica("EXPRESION-> Identifier ", "EXPRESION.val= new  Identificador( identifier.lexval ) ");
                    break;
                case 158:
                    this.$ = new Obtener_struct($$[$0 - 1], $$[$0], _$[$0 - 1].first_line, _$[$0 - 1].first_column);
                    new ReporteGramatica("EXPRESION-> EXPRESION  LISTA_EXPRESION_PTO2", "EXPRESION.val= new  Obtener_struct( EXPRESION.val,LISTA_EXPRESION_PTO2.val ) ");
                    break;
                case 159:
                    this.$ = $$[$0 - 2];
                    $$[$0 - 2].push($$[$0]);
                    new ReporteGramatica("LISTA_EXPRESION_PTO2->LISTA_EXPRESION_PTO2 OPCION_PTO2", "LISTA_EXPRESION_PTO2=new Array(OPCION_PTO2) ----LISTA_EXPRESION_PTO2.push(OPCION_PTO.val)");
                    break;
                case 160:
                    this.$ = [];
                    this.$.push($$[$0]);
                    new ReporteGramatica("LISTA_EXPRESION_PTO2-> . OPCION_PTO2", "LISTA_EXPRESION_PTO2.val=[OPCION_PTO2.val]");
                    break;
                case 162:
                    this.$ = $$[$0];
                    new ReporteGramatica("OPCION_PTO2->  identifier", "OPCION_PTO2.val=identifier.lexval");
                    break;
                case 163:
                    this.$ = $$[$0 - 3];
                    new ReporteGramatica("OPCION_PTO->  identifier [EXPRESION]", "OPCION_PTO.val=identifier.lexval+EXPRESION.val");
                    break;
                case 164:
                    this.$ = new Tipo(tipos.DECIMAL);
                    new ReporteGramatica("TIPO-> double ", "TIPO.val= new  Tipo( double.lexval ) ");
                    break;
                case 165:
                    this.$ = new Tipo(tipos.STRING);
                    new ReporteGramatica("TIPO-> double ", "TIPO.val= new  Tipo( double.lexval ) ");
                    break;
                case 166:
                    this.$ = new Tipo(tipos.ENTERO);
                    new ReporteGramatica("TIPO-> int ", "TIPO.val= new  Tipo( int.lexval ) ");
                    break;
                case 167:
                    this.$ = new Tipo(tipos.BOOLEANO);
                    new ReporteGramatica("TIPO-> boolean ", "TIPO.val= new  Tipo( boolean.lexval ) ");
                    break;
                case 168:
                    this.$ = new Tipo(tipos.CARACTER);
                    new ReporteGramatica("TIPO-> char ", "TIPO.val= new  Tipo( char.lexval ) ");
                    break;
                case 169:
                    this.$ = new Tipo(tipos.VOID);
                    new ReporteGramatica("TIPO-> void ", "TIPO.val= new  Tipo( void.lexval ) ");
                    break;
            }
        },
        table: [{ 2: $V0, 3: 1, 4: 2, 6: 3, 7: 4, 8: $V1, 16: 5, 18: 6, 19: 7, 26: 16, 45: $V2, 47: $V3, 48: $V4, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 1: [3] }, { 2: $V0, 5: [1, 20], 6: 21, 7: 4, 8: $V1, 16: 5, 18: 6, 19: 7, 26: 16, 45: $V2, 47: $V3, 48: $V4, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vb, [2, 3]), { 8: [1, 22], 15: [1, 23], 23: $Vc, 50: 24 }, { 17: [1, 26] }, o($Vb, [2, 7]), { 17: [1, 27] }, o($Vb, [2, 9]), o($Vd, [2, 164]), o($Vd, [2, 165]), o($Vd, [2, 166]), o($Vd, [2, 167]), o($Vd, [2, 168]), o($Vd, [2, 169]), { 8: $Ve, 9: $Vf }, { 17: [1, 30] }, { 9: [1, 31] }, { 9: [1, 32] }, { 9: [1, 33] }, { 1: [2, 1] }, o($Vb, [2, 2]), o($Vg, $Vh, { 9: [1, 34], 49: $Vi }), { 9: [1, 36] }, { 17: [2, 64], 21: [1, 37] }, { 24: [1, 38] }, o($Vb, [2, 6]), o($Vb, [2, 8]), { 49: [1, 39] }, { 7: 60, 8: $Vj, 9: $Vk, 11: [1, 41], 23: $Vl, 26: 56, 27: 40, 28: 42, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o([2, 5, 8, 14, 32, 43, 45, 47, 48, 54, 55, 56, 59, 61, 62, 63, 64, 69, 70, 115, 116, 117, 118, 119, 120], [2, 18]), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 67, 46: 66, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 67, 46: 68, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 67, 46: 69, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 73, 10: 70, 11: $VE, 20: 71, 22: 72, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 74, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 73, 10: 75, 11: $VE, 20: 71, 22: 72, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 8: [1, 76] }, { 8: [1, 77] }, { 8: [1, 79], 26: 78 }, { 11: [1, 80], 21: [1, 81] }, o($VF, [2, 20]), o($VG, [2, 22], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY }), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 101, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 9: [1, 102] }, { 9: [1, 103] }, { 9: [1, 104] }, { 9: [1, 105] }, { 9: [1, 106] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 107, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VF, [2, 133]), o($VF, [2, 134]), o($VF, [2, 135]), o($VF, [2, 136]), o($VF, [2, 137]), o($VF, [2, 138]), o($VF, [2, 144]), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 24: [1, 109], 26: 56, 28: 67, 46: 108, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VF, [2, 157], { 9: $Vf, 23: [1, 110] }), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 111, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 39: [1, 112] }, { 9: [1, 113] }, { 9: [1, 114] }, { 9: [1, 115] }, { 9: [1, 116] }, { 9: [1, 117] }, { 11: [1, 118], 21: $VZ }, o($V_, [2, 62], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY }), { 11: [1, 120], 21: $VZ }, { 11: [1, 121], 21: $VZ }, { 11: [1, 122] }, { 11: [2, 10], 21: [1, 123] }, o($VG, [2, 13]), { 8: [1, 124], 23: [1, 125] }, { 17: [2, 63], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 126] }, o($Vg, [2, 68]), { 17: [2, 66], 49: [1, 127] }, { 17: [2, 67] }, { 9: $Vf }, o($VF, [2, 19]), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 128, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 129, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 130, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 131, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 132, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 133, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 134, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 135, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 136, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 137, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 138, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 139, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 140, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 141, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 142, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 143, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 144, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VF, $V$, { 114: 150, 8: $V01, 101: [1, 145], 102: [1, 146], 103: [1, 147], 104: [1, 148], 105: [1, 149] }), o($VF, [2, 149]), o([11, 12, 17, 21, 24, 60, 73, 74, 75, 76, 77, 83, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 106], [2, 158], { 39: [1, 152] }), o($VF, [2, 110], { 113: 100 }), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 153, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 154, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 155, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 156, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 157, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VF, [2, 127], { 113: 100 }), { 21: $VZ, 24: [1, 158] }, o($VF, [2, 146]), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 159, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 11: [1, 160], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 107: [1, 161] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 162, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 163, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 164, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 165, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 166, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 17: [2, 58] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 167, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 17: [2, 59] }, { 17: [2, 60] }, { 12: [1, 168] }, { 7: 73, 22: 169, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VG, [2, 14]), { 24: [1, 170] }, { 12: [1, 171] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 172, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VG, [2, 21], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY }), o($V11, [2, 111], { 113: 100, 75: $VK, 76: $VL, 77: $VM }), o($V11, [2, 112], { 113: 100, 75: $VK, 76: $VL, 77: $VM }), o($VF, [2, 113], { 113: 100 }), o($VF, [2, 114], { 113: 100 }), o($VF, [2, 115], { 113: 100 }), o($V21, [2, 121], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 85: $VP, 86: $VQ, 87: $VR, 88: $VS }), o($V21, [2, 122], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 85: $VP, 86: $VQ, 87: $VR, 88: $VS }), o($V31, [2, 123], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM }), o($V31, [2, 124], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM }), o($V31, [2, 125], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM }), o($V31, [2, 126], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM }), o($V41, [2, 128], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS }), o([11, 12, 17, 21, 24, 60, 91], [2, 129], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 92: $VV, 93: $VW, 94: $VX, 106: $VY }), o($V41, [2, 130], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS }), o($V41, [2, 131], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS }), { 39: $VH, 60: [1, 173], 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 9: [1, 174] }, { 9: [1, 175] }, { 9: [1, 176] }, { 9: [1, 177] }, { 9: [1, 178] }, o($VF, [2, 160]), o($VF, [2, 162], { 23: [1, 179] }), o($VF, $V$, { 114: 180, 8: $V01 }), { 11: [1, 181], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 182], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 183], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 21: [1, 184], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 185], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, o($VF, [2, 145]), { 24: [1, 186], 39: $VH, 60: [1, 187], 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, o($VF, [2, 150]), { 9: [1, 188] }, { 11: [1, 189], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 190], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 191], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 192], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 193], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, o($V_, [2, 61], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY }), { 2: $V51, 7: 211, 8: $V61, 13: 194, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VG, [2, 12]), { 8: [1, 219] }, { 2: $V51, 7: 211, 8: $V61, 13: 220, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 17: [2, 65], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 221, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 11: [1, 222] }, { 11: [1, 223] }, { 11: [1, 224] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 225, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 226, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 227, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VF, [2, 159]), o($VF, [2, 116]), o($VF, [2, 117]), o($VF, [2, 118]), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 228, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VF, [2, 120]), o($VF, [2, 147]), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 229, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 230, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VF, [2, 152]), o($VF, [2, 153]), o($VF, [2, 154]), o($VF, [2, 155]), o($VF, [2, 156]), { 2: $V51, 7: 211, 8: $V61, 14: [1, 231], 16: 197, 18: 209, 19: 196, 25: 232, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vg1, [2, 17]), { 17: [1, 233] }, { 17: [1, 234] }, { 17: [1, 235] }, o($Vg1, [2, 26]), o($Vg1, [2, 27]), { 17: [1, 236] }, o($Vg1, [2, 29]), { 17: [1, 237] }, o($Vg1, [2, 31]), { 8: $Ve, 9: $Vf, 23: $Vh1, 36: [1, 238], 37: [1, 239], 39: [1, 240], 49: $Vi1 }, { 17: [1, 243] }, { 17: [1, 244] }, { 17: [1, 245] }, o($Vg1, [2, 39]), o($Vg1, [2, 40]), { 8: [1, 246], 23: $Vc, 50: 24 }, { 9: [1, 247] }, { 9: [1, 248] }, { 9: [1, 249] }, { 12: [1, 250] }, { 8: [1, 253], 9: [1, 252], 65: 251 }, { 7: 60, 8: $Vj, 9: $Vk, 17: [2, 103], 23: $Vl, 26: 56, 28: 254, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 8: [1, 255] }, o($VG, [2, 15]), { 2: $V51, 7: 211, 8: $V61, 14: [1, 256], 16: 197, 18: 209, 19: 196, 25: 232, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($V41, [2, 132], { 113: 100, 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS }), o($VF, [2, 139]), o($VF, [2, 140]), o($VF, [2, 141]), { 11: [1, 257], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 21: [1, 258], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 24: [1, 259], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 260], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 24: [1, 261], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 262], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, o($Vb, [2, 4]), o($Vg1, [2, 16]), o($Vg1, [2, 23]), o($Vg1, [2, 24]), o($Vg1, [2, 25]), o($Vg1, [2, 28]), o($Vg1, [2, 30]), { 17: [1, 263] }, { 17: [1, 264] }, { 8: $Vj1, 39: $Vk1, 40: [1, 265], 41: [1, 266], 51: 267, 52: 268 }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 271, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 272, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vg1, [2, 34]), o($Vg1, [2, 37]), o($Vg1, [2, 38]), o($Vg, $Vh, { 49: $Vi }), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 273, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 274, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 275, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 2: $V51, 7: 211, 8: $V61, 13: 276, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 66: [1, 277] }, { 7: 279, 8: [1, 280], 67: 278, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 66: [2, 96] }, { 17: [2, 102], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 12: [1, 281] }, o($Vb, [2, 5]), o($VF, [2, 142]), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 282, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($VF, [2, 163]), o($VF, [2, 119]), o($VF, [2, 148]), o($VF, [2, 151]), o($Vg1, [2, 32]), o($Vg1, [2, 33]), { 9: [1, 283] }, { 9: [1, 284] }, { 8: $Vj1, 39: $Vk1, 49: [1, 285], 52: 286 }, o($Vl1, [2, 74]), { 8: [1, 287] }, o($Vl1, [2, 76], { 23: [1, 288] }), { 17: [2, 70], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 24: [1, 289], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 290], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 291], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 292], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 2: $V51, 7: 211, 8: $V61, 14: [1, 293], 16: 197, 18: 209, 19: 196, 25: 232, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 294, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 17: [1, 295] }, { 8: [1, 296] }, { 49: [1, 297] }, { 7: 300, 8: $Vm1, 71: 298, 72: 299, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 11: [1, 302], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 11: [1, 303] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 304, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 305, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vl1, [2, 73]), o($Vl1, [2, 75]), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 306, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 49: [1, 307] }, { 2: $Vn1, 7: 211, 8: $Vo1, 12: [1, 308], 16: 311, 18: 322, 19: 310, 26: 16, 29: 312, 31: 313, 32: $Vp1, 33: 315, 34: 316, 35: 317, 38: 319, 42: 320, 43: $Vq1, 44: 309, 45: $V2, 47: $V3, 48: $V4, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 12: [1, 324] }, { 12: [1, 325] }, { 62: [1, 326] }, { 12: [1, 327], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 328, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 49: [1, 329] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 330, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 14: [1, 331], 21: [1, 332] }, o($Vr1, [2, 106]), { 8: [1, 333], 23: [1, 334] }, { 8: [1, 335] }, o($VF, [2, 143]), { 17: [1, 336] }, { 11: [1, 337], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 17: [2, 71], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 24: [1, 338], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 339, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 2: $V51, 7: 211, 8: $V61, 13: 340, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vg1, [2, 81], { 55: [1, 341] }), { 17: [1, 342] }, { 17: [1, 343] }, { 17: [1, 344] }, o($Vs1, [2, 44]), { 17: [1, 345] }, o($Vs1, [2, 46]), { 17: [1, 346] }, o($Vs1, [2, 48]), { 8: $Ve, 9: $Vf, 23: $Vh1, 36: [1, 347], 37: [1, 348], 39: [1, 349], 49: $Vi1 }, { 17: [1, 350] }, { 17: [1, 351] }, { 17: [1, 352] }, o($Vs1, [2, 56]), o($Vs1, [2, 57]), { 57: 353, 58: 354, 59: [1, 355], 61: $Vt1 }, { 2: $V51, 7: 211, 8: $V61, 13: 357, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 9: [1, 358] }, { 2: $V51, 7: 211, 8: $V61, 13: 359, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 17: [1, 360], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 361, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 17: [2, 98], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 17: [2, 104] }, { 7: 300, 8: $Vm1, 72: 362, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vr1, [2, 107]), { 24: [1, 363] }, o($Vr1, [2, 108]), o($Vg1, [2, 35]), { 17: [1, 364] }, o($Vl1, [2, 77]), { 17: [2, 72], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 2: $V51, 7: 211, 8: $V61, 14: [1, 365], 16: 197, 18: 209, 19: 196, 25: 232, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 2: $Vn1, 7: 211, 8: $Vo1, 16: 311, 18: 322, 19: 310, 26: 16, 29: 312, 31: 313, 32: $Vp1, 33: 315, 34: 316, 35: 317, 38: 319, 42: 320, 43: $Vq1, 44: 366, 45: $V2, 47: $V3, 48: $V4, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vs1, [2, 41]), o($Vs1, [2, 42]), o($Vs1, [2, 43]), o($Vs1, [2, 45]), o($Vs1, [2, 47]), { 17: [1, 367] }, { 17: [1, 368] }, { 8: $Vj1, 39: $Vk1, 40: [1, 369], 41: [1, 370], 51: 267, 52: 268 }, o($Vs1, [2, 51]), o($Vs1, [2, 54]), o($Vs1, [2, 55]), { 14: [1, 372], 58: 371, 59: [1, 373], 61: $Vt1 }, { 14: [1, 374] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 375, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 60: [1, 376] }, { 2: $V51, 7: 211, 8: $V61, 14: [1, 377], 16: 197, 18: 209, 19: 196, 25: 232, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 378, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 2: $V51, 7: 211, 8: $V61, 14: [1, 379], 16: 197, 18: 209, 19: 196, 25: 232, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 8: [1, 381], 68: 380 }, { 17: [2, 97], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, o($Vr1, [2, 105]), { 8: [1, 382] }, o($Vg1, [2, 36]), o($Vg1, [2, 80], { 55: [1, 383] }), o($Vg1, [2, 85]), o($Vs1, [2, 49]), o($Vs1, [2, 50]), { 9: [1, 384] }, { 9: [1, 385] }, { 14: [1, 386] }, o($Vs1, [2, 87]), { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 387, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vs1, [2, 88]), { 39: $VH, 60: [1, 388], 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 2: $V51, 7: 211, 8: $V61, 13: 389, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vs1, [2, 92]), { 11: [1, 390], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, o($Vs1, [2, 94]), { 11: [1, 391] }, { 36: [1, 393], 37: [1, 392], 49: [1, 394] }, o($Vr1, [2, 109]), { 2: $Vn1, 7: 211, 8: $Vo1, 12: [1, 395], 16: 311, 18: 322, 19: 310, 26: 16, 29: 312, 30: 396, 31: 313, 32: $Vp1, 33: 315, 34: 316, 35: 317, 38: 319, 42: 320, 43: $Vq1, 44: 397, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 11: [1, 398] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 399, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vs1, [2, 86]), { 39: $VH, 60: [1, 400], 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 2: $V51, 7: 211, 8: $V61, 13: 401, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 2: $V51, 7: 211, 8: $V61, 14: [2, 91], 16: 197, 18: 209, 19: 196, 25: 232, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 17: [2, 93] }, { 12: [1, 402] }, { 11: [2, 99] }, { 11: [2, 100] }, { 7: 60, 8: $Vj, 9: $Vk, 23: $Vl, 26: 56, 28: 403, 73: $Vm, 78: $Vn, 79: $Vo, 80: $Vp, 81: $Vq, 82: $Vr, 89: $Vs, 95: $Vt, 96: $Vu, 97: $Vv, 98: $Vw, 99: $Vx, 100: $Vy, 108: $Vz, 109: $VA, 110: $VB, 111: $VC, 112: $VD, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 2: $V51, 7: 211, 8: $V61, 13: 404, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vg1, [2, 83]), o($Vg1, [2, 84]), { 17: [1, 405] }, { 11: [1, 406], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 2: $V51, 7: 211, 8: $V61, 13: 407, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vu1, [2, 90], { 26: 16, 19: 196, 16: 197, 29: 198, 30: 199, 31: 200, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 18: 209, 7: 211, 25: 232, 2: $V51, 8: $V61, 32: $V71, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }), { 2: $V51, 7: 211, 8: $V61, 13: 408, 16: 197, 18: 209, 19: 196, 25: 195, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, { 11: [2, 101], 39: $VH, 73: $VI, 74: $VJ, 75: $VK, 76: $VL, 77: $VM, 83: $VN, 84: $VO, 85: $VP, 86: $VQ, 87: $VR, 88: $VS, 90: $VT, 91: $VU, 92: $VV, 93: $VW, 94: $VX, 106: $VY, 113: 100 }, { 2: $V51, 7: 211, 8: $V61, 14: [1, 409], 16: 197, 18: 209, 19: 196, 25: 232, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vs1, [2, 52]), { 17: [1, 410] }, o($Vu1, [2, 89], { 26: 16, 19: 196, 16: 197, 29: 198, 30: 199, 31: 200, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 18: 209, 7: 211, 25: 232, 2: $V51, 8: $V61, 32: $V71, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }), { 2: $V51, 7: 211, 8: $V61, 14: [1, 411], 16: 197, 18: 209, 19: 196, 25: 232, 26: 16, 29: 198, 30: 199, 31: 200, 32: $V71, 33: 202, 34: 203, 35: 204, 38: 206, 42: 207, 43: $V81, 45: $V2, 47: $V3, 48: $V4, 54: $V91, 56: $Va1, 62: $Vb1, 63: $Vc1, 64: $Vd1, 69: $Ve1, 70: $Vf1, 115: $V5, 116: $V6, 117: $V7, 118: $V8, 119: $V9, 120: $Va }, o($Vg1, [2, 82]), o($Vs1, [2, 53]), o($Vs1, [2, 95])],
        defaultActions: { 20: [2, 1], 78: [2, 67], 118: [2, 58], 120: [2, 59], 121: [2, 60], 253: [2, 96], 331: [2, 104], 390: [2, 93], 392: [2, 99], 393: [2, 100] },
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
            var self = this, stack = [0], tstack = [], // token stack
            vstack = [null], // semantic value stack
            lstack = [], // location stack
            table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
            var args = lstack.slice.call(arguments, 1);
            //this.reductionCount = this.shiftCount = 0;
            var lexer = Object.create(this.lexer);
            var sharedState = { yy: {} };
            // copy state
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
                // if token isn't its numeric value, convert
                if (typeof token !== 'number') {
                    token = self.symbols_[token] || token;
                }
                return token;
            };
            var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
            while (true) {
                // retreive state number from top of stack
                state = stack[stack.length - 1];
                // use default actions if available
                if (this.defaultActions[state]) {
                    action = this.defaultActions[state];
                }
                else {
                    if (symbol === null || typeof symbol == 'undefined') {
                        symbol = lex();
                    }
                    // read action for current state and first input
                    action = table[state] && table[state][symbol];
                }
                _handle_error: 
                // handle parse error
                if (typeof action === 'undefined' || !action.length || !action[0]) {
                    var error_rule_depth;
                    var errStr = '';
                    // Return the rule stack depth where the nearest error rule can be found.
                    // Return FALSE when no error recovery rule was found.
                    function locateNearestErrorRecoveryRule(state) {
                        var stack_probe = stack.length - 1;
                        var depth = 0;
                        // try to recover from error
                        for (;;) {
                            // check for error recovery rule in this state
                            if ((TERROR.toString()) in table[state]) {
                                return depth;
                            }
                            if (state === 0 || stack_probe < 2) {
                                return false; // No suitable error recovery rule available.
                            }
                            stack_probe -= 2; // popStack(1): [symbol, action]
                            state = stack[stack_probe];
                            ++depth;
                        }
                    }
                    if (!recovering) {
                        // first see if there's any chance at hitting an error recovery rule:
                        error_rule_depth = locateNearestErrorRecoveryRule(state);
                        // Report error
                        expected = [];
                        for (p in table[state]) {
                            if (this.terminals_[p] && p > TERROR) {
                                expected.push("'" + this.terminals_[p] + "'");
                            }
                        }
                        if (lexer.showPosition) {
                            errStr = 'Parse error on line ' + (yylineno + 1) + ":\n" + lexer.showPosition() + "\nExpecting " + expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                        }
                        else {
                            errStr = 'Parse error on line ' + (yylineno + 1) + ": Unexpected " +
                                (symbol == EOF ? "end of input" :
                                    ("'" + (this.terminals_[symbol] || symbol) + "'"));
                        }
                        this.parseError(errStr, {
                            text: lexer.match,
                            token: this.terminals_[symbol] || symbol,
                            line: lexer.yylineno,
                            loc: yyloc,
                            expected: expected,
                            recoverable: (error_rule_depth !== false)
                        });
                    }
                    else if (preErrorSymbol !== EOF) {
                        error_rule_depth = locateNearestErrorRecoveryRule(state);
                    }
                    // just recovered from another error
                    if (recovering == 3) {
                        if (symbol === EOF || preErrorSymbol === EOF) {
                            throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                        }
                        // discard current lookahead and grab another
                        yyleng = lexer.yyleng;
                        yytext = lexer.yytext;
                        yylineno = lexer.yylineno;
                        yyloc = lexer.yylloc;
                        symbol = lex();
                    }
                    // try to recover from error
                    if (error_rule_depth === false) {
                        throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
                    }
                    popStack(error_rule_depth);
                    preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
                    symbol = TERROR; // insert generic error symbol as new lookahead
                    state = stack[stack.length - 1];
                    action = table[state] && table[state][TERROR];
                    recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
                }
                // this shouldn't happen, unless resolve defaults are off
                if (action[0] instanceof Array && action.length > 1) {
                    throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
                }
                switch (action[0]) {
                    case 1: // shift
                        //this.shiftCount++;
                        stack.push(symbol);
                        vstack.push(lexer.yytext);
                        lstack.push(lexer.yylloc);
                        stack.push(action[1]); // push state
                        symbol = null;
                        if (!preErrorSymbol) { // normal execution/no error
                            yyleng = lexer.yyleng;
                            yytext = lexer.yytext;
                            yylineno = lexer.yylineno;
                            yyloc = lexer.yylloc;
                            if (recovering > 0) {
                                recovering--;
                            }
                        }
                        else {
                            // error just occurred, resume old lookahead f/ before error
                            symbol = preErrorSymbol;
                            preErrorSymbol = null;
                        }
                        break;
                    case 2:
                        // reduce
                        //this.reductionCount++;
                        len = this.productions_[action[1]][1];
                        // perform semantic action
                        yyval.$ = vstack[vstack.length - len]; // default to $$ = $1
                        // default location, uses first token for firsts, last for lasts
                        yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        };
                        if (ranges) {
                            yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
                        }
                        r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));
                        if (typeof r !== 'undefined') {
                            return r;
                        }
                        // pop off stack
                        if (len) {
                            stack = stack.slice(0, -1 * len * 2);
                            vstack = vstack.slice(0, -1 * len);
                            lstack = lstack.slice(0, -1 * len);
                        }
                        stack.push(this.productions_[action[1]][0]); // push nonterminal (reduce)
                        vstack.push(yyval.$);
                        lstack.push(yyval._$);
                        // goto new state = table[STATE][NONTERMINAL]
                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                        stack.push(newState);
                        break;
                    case 3:
                        // accept
                        return true;
                }
            }
            return true;
        } };
    const { Excepcion } = require('../other/Excepcion');
    const { Error } = require('../Simbols/Error');
    const { Tree } = require('../Simbols/Tree');
    const { ReporteGramatica } = require('../Simbols/ReporteGramatica');
    const { Tipo, tipos, esEntero } = require('../other/tipo');
    const { Primitivo } = require('../Expresiones/Primitivo');
    const { Identificador } = require('../Expresiones/Identificador');
    const { Vector } = require('../Expresiones/Vector');
    //Expresion
    const { Aritmetica } = require('../Expresiones/Aritmetica');
    const { Logico } = require('../Expresiones/Logico');
    const { Relacional } = require('../Expresiones/Relacional');
    const { ToLower } = require('../Expresiones/ToLower');
    const { ToUpper } = require('../Expresiones/ToUpper');
    const { Length } = require('../Expresiones/Length');
    const { Substring } = require('../Expresiones/Substring');
    const { CaracterOFposition } = require('../Expresiones/CaracterOFposition');
    const { ToInt } = require('../Expresiones/ToInt');
    const { ToDouble } = require('../Expresiones/ToDouble');
    const { ConverString } = require('../Expresiones/ConverString');
    const { TypeOf } = require('../Expresiones/TypeOf');
    const { Log } = require('../Expresiones/Log');
    const { Seno } = require('../Expresiones/Seno');
    const { Cos } = require('../Expresiones/Cos');
    const { Tan } = require('../Expresiones/Tan');
    const { Sqrt } = require('../Expresiones/Sqrt');
    const { Pow } = require('../Expresiones/Pow');
    const { Nativas_Diferentes } = require('../Expresiones/Nativas_Diferentes');
    const { Ternario } = require('../Expresiones/Ternario');
    //Instrucciones+
    const { Print } = require('../Instrucciones/Print');
    const { If } = require('../Instrucciones/If');
    const { If_unico } = require('../Instrucciones/If_unico');
    const { Switch } = require('../Instrucciones/Switch');
    const { Case } = require('../Instrucciones/Case');
    const { Retorno } = require('../Instrucciones/Retorno');
    const { Break } = require('../Expresiones/Break');
    const { While } = require('../Instrucciones/While');
    const { DoWhile } = require('../Instrucciones/DoWhile');
    const { Declaracion, defal } = require('../Instrucciones/Declaracion');
    const { Main } = require('../Instrucciones/Main');
    const { DeclaracionArray } = require('../Instrucciones/DeclaracionArray');
    const { Asignacion_Struct } = require('../Instrucciones/Asignacion_Struct');
    const { AsignacionVector } = require('../Instrucciones/AsignacionVector');
    const { Asignacion } = require('../Instrucciones/Asignacion');
    const { InDecrement } = require('../Expresiones/InDecrement');
    const { AddLista } = require('../Instrucciones/AddLista');
    const { Pop } = require('../Instrucciones/pop');
    const { For } = require('../Instrucciones/For');
    const { ForIn } = require('../Instrucciones/ForIn');
    const { Struct } = require('../Instrucciones/Struct');
    const { DeclaracionMetodo } = require('../Instrucciones/DeclaracionMetodo');
    const { DeclaracionVarStruct } = require('../Instrucciones/DeclaracionVarStruct');
    const { Obtener_struct } = require('../Instrucciones/Obtener_struct');
    const { LlamadaMetodo } = require('../Instrucciones/LlamadaMetodo');
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
                    case 4: /*Ignorar comentarios con multiples lineas*/
                        break;
                    case 5:
                        return 99;
                        break;
                    case 6:
                        return 100;
                        break;
                    case 7:
                        return 104;
                        break;
                    case 8:
                        return 117;
                        break;
                    case 9:
                        return 116;
                        break;
                    case 10:
                        return 115;
                        break;
                    case 11:
                        return 118;
                        break;
                    case 12:
                        return 119;
                        break;
                    case 13:
                        return 105;
                        break;
                    case 14:
                        return 103;
                        break;
                    case 15:
                        return 102;
                        break;
                    case 16:
                        return 101;
                        break;
                    case 17:
                        return 108;
                        break;
                    case 18:
                        return 109;
                        break;
                    case 19:
                        return 110;
                        break;
                    case 20:
                        return 111;
                        break;
                    case 21:
                        return 107;
                        break;
                    case 22:
                        return 75;
                        break;
                    case 23:
                        return 77;
                        break;
                    case 24:
                        return 39;
                        break;
                    case 25:
                        return 60;
                        break;
                    case 26:
                        return 17;
                        break;
                    case 27:
                        return 94;
                        break;
                    case 28:
                        return 93;
                        break;
                    case 29:
                        return 21;
                        break;
                    case 30:
                        return 37;
                        break;
                    case 31:
                        return 36;
                        break;
                    case 32:
                        return 73;
                        break;
                    case 33:
                        return 74;
                        break;
                    case 34:
                        return 76;
                        break;
                    case 35:
                        return 106;
                        break;
                    case 36:
                        return 87;
                        break;
                    case 37:
                        return 88;
                        break;
                    case 38:
                        return 85;
                        break;
                    case 39:
                        return 86;
                        break;
                    case 40:
                        return 83;
                        break;
                    case 41:
                        return 84;
                        break;
                    case 42:
                        return 49;
                        break;
                    case 43:
                        return 91;
                        break;
                    case 44:
                        return 90;
                        break;
                    case 45:
                        return 92;
                        break;
                    case 46:
                        return 89;
                        break;
                    case 47:
                        return 9;
                        break;
                    case 48:
                        return 11;
                        break;
                    case 49:
                        return 23;
                        break;
                    case 50:
                        return 24;
                        break;
                    case 51:
                        return 12;
                        break;
                    case 52:
                        return 14;
                        break;
                    case 53:
                        return 97;
                        break;
                    case 54:
                        return 'function';
                        break;
                    case 55:
                        return 81;
                        break;
                    case 56:
                        return 82;
                        break;
                    case 57:
                        return 78;
                        break;
                    case 58:
                        return 79;
                        break;
                    case 59:
                        return 80;
                        break;
                    case 60:
                        return 95;
                        break;
                    case 61:
                        return 'new';
                        break;
                    case 62:
                        return 120;
                        break;
                    case 63:
                        return 15;
                        break;
                    case 64:
                        return 98;
                        break;
                    case 65:
                        return 45;
                        break;
                    case 66:
                        return 47;
                        break;
                    case 67:
                        return 48;
                        break;
                    case 68:
                        return 54;
                        break;
                    case 69:
                        return 66;
                        break;
                    case 70:
                        return 64;
                        break;
                    case 71:
                        return 55;
                        break;
                    case 72:
                        return 15;
                        break;
                    case 73:
                        return 32;
                        break;
                    case 74:
                        return 62;
                        break;
                    case 75:
                        return 'bool';
                        break;
                    case 76:
                        return 56;
                        break;
                    case 77:
                        return 59;
                        break;
                    case 78:
                        return 61;
                        break;
                    case 79:
                        return 32;
                        break;
                    case 80:
                        return 63;
                        break;
                    case 81:
                        return 69;
                        break;
                    case 82:
                        return 40;
                        break;
                    case 83:
                        return 41;
                        break;
                    case 84:
                        return 112;
                        break;
                    case 85:
                        return 96;
                        break;
                    case 86:
                        return 70;
                        break;
                    case 87:
                        return 8;
                        break;
                    case 88:
                        return 5;
                        break;
                    case 89:
                        console.log("Error Lexico " + yy_.yytext
                            + "linea " + yy_.yylineno
                            + "columna " + (yy_.yylloc.last_column + 1));
                        new Error("Error LEXICO", "Token no reconocido por el lenguaje", yy_.yylineno, 2);
                        break;
                }
            },
            rules: [/^(?:\s+)/, /^(?:[ \t\r\n\f])/, /^(?:\n)/, /^(?:\/\/.*)/, /^(?:\/\*((\*+[^/*])|([^*]))*\**\*\/)/, /^(?:(('[^☼]')))/, /^(?:(("[^"]*")))/, /^(?:caracterOfPosition\b)/, /^(?:int\b)/, /^(?:String\b)/, /^(?:double\b)/, /^(?:boolean\b)/, /^(?:char\b)/, /^(?:subString\b)/, /^(?:length\b)/, /^(?:toUppercase\b)/, /^(?:toLowercase\b)/, /^(?:toInt\b)/, /^(?:toDouble\b)/, /^(?:string\b)/, /^(?:typeof\b)/, /^(?:parse\b)/, /^(?:\*)/, /^(?:%)/, /^(?:\.)/, /^(?::)/, /^(?:;)/, /^(?:\?)/, /^(?:\^)/, /^(?:,)/, /^(?:\+\+)/, /^(?:--)/, /^(?:-)/, /^(?:\+)/, /^(?:\/)/, /^(?:#)/, /^(?:<=)/, /^(?:<)/, /^(?:>=)/, /^(?:>)/, /^(?:==)/, /^(?:!=)/, /^(?:=)/, /^(?:\|\|)/, /^(?:&&)/, /^(?:&)/, /^(?:!)/, /^(?:\()/, /^(?:\))/, /^(?:\[)/, /^(?:\])/, /^(?:\{)/, /^(?:\})/, /^(?:true\b)/, /^(?:function\b)/, /^(?:pow\b)/, /^(?:sqrt\b)/, /^(?:sin\b)/, /^(?:cos\b)/, /^(?:tan\b)/, /^(?:null\b)/, /^(?:new\b)/, /^(?:void\b)/, /^(?:main\b)/, /^(?:false\b)/, /^(?:print\b)/, /^(?:println\b)/, /^(?:printf\b)/, /^(?:if\b)/, /^(?:in\b)/, /^(?:for\b)/, /^(?:else\b)/, /^(?:main\b)/, /^(?:break\b)/, /^(?:while\b)/, /^(?:bool\b)/, /^(?:switch\b)/, /^(?:case\b)/, /^(?:default\b)/, /^(?:break\b)/, /^(?:do\b)/, /^(?:return\b)/, /^(?:pop\b)/, /^(?:push\b)/, /^(?:log10\b)/, /^(?:[0-9]+(\.[0-9]+)?\b)/, /^(?:struct\b)/, /^(?:([a-zA-Z])[a-zA-Z0-9_]*)/, /^(?:$)/, /^(?:.)/],
            conditions: { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89], "inclusive": true } }
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
},{"../Expresiones/Aritmetica":6,"../Expresiones/Break":7,"../Expresiones/CaracterOFposition":8,"../Expresiones/ConverString":10,"../Expresiones/Cos":11,"../Expresiones/Identificador":12,"../Expresiones/InDecrement":13,"../Expresiones/Length":14,"../Expresiones/Log":15,"../Expresiones/Logico":16,"../Expresiones/Nativas_Diferentes":17,"../Expresiones/Pow":18,"../Expresiones/Primitivo":19,"../Expresiones/Relacional":20,"../Expresiones/Seno":21,"../Expresiones/Sqrt":22,"../Expresiones/Substring":23,"../Expresiones/Tan":24,"../Expresiones/Ternario":25,"../Expresiones/ToDouble":26,"../Expresiones/ToInt":27,"../Expresiones/ToLower":28,"../Expresiones/ToUpper":29,"../Expresiones/TypeOf":30,"../Expresiones/Vector":31,"../Instrucciones/AddLista":33,"../Instrucciones/Asignacion":34,"../Instrucciones/AsignacionVector":35,"../Instrucciones/Asignacion_Struct":36,"../Instrucciones/Case":37,"../Instrucciones/Declaracion":39,"../Instrucciones/DeclaracionArray":40,"../Instrucciones/DeclaracionMetodo":41,"../Instrucciones/DeclaracionVarStruct":42,"../Instrucciones/DoWhile":43,"../Instrucciones/For":44,"../Instrucciones/ForIn":45,"../Instrucciones/If":46,"../Instrucciones/If_unico":47,"../Instrucciones/LlamadaMetodo":48,"../Instrucciones/Main":49,"../Instrucciones/Obtener_struct":50,"../Instrucciones/Print":51,"../Instrucciones/Retorno":52,"../Instrucciones/Struct":53,"../Instrucciones/Switch":54,"../Instrucciones/While":55,"../Instrucciones/pop":56,"../Simbols/Error":59,"../Simbols/ReporteGramatica":61,"../Simbols/Tree":64,"../other/Excepcion":65,"../other/tipo":66,"_process":3,"fs":1,"path":2}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Primitivo_1 = require("../Expresiones/Primitivo");
class AddLista extends Nodo_1.Nodo {
    constructor(id, expresion, line, column) {
        super(null, line, column);
        this.id = id;
        this.expresion = expresion;
    }
    execute(table, tree) {
        const result = this.expresion.execute(table, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        this.dar = result;
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `El Arreglo {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        if (variable.tipo2.tipo == tipo_1.tipos.ARREGLO) {
            if (variable.tipo.tipo != this.expresion.tipo.tipo) {
                if ((variable.tipo.tipo == tipo_1.tipos.DECIMAL) && (this.expresion.tipo.tipo == tipo_1.tipos.ENTERO)) {
                    this.expresion.tipo.tipo = tipo_1.tipos.DECIMAL;
                    variable.valor.valor.push(new Primitivo_1.Primitivo(this.expresion.tipo, result, this.line, this.column));
                    return null;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede ingresar un valor de diferente tipo al de la lista {${this.id}}`, this.line, this.column);
                    tree.excepciones.push(error);
                    tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                variable.valor.valor.push(new Primitivo_1.Primitivo(this.expresion.tipo, result, this.line, this.column));
                return null;
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `No se puede agregar un valor a {${this.id}}`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ADD");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(".add");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion.getNodo());
        nodo.agregarHijo(")");
        return nodo;
    }
}
exports.AddLista = AddLista;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Primitivo":19,"../other/Excepcion":65,"../other/tipo":66}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Primitivo_1 = require("../Expresiones/Primitivo");
function revisar(tipo1, lista) {
    for (let key in lista.valor) {
        if (lista.valor[key].tipo.tipo == 6) {
            return revisar(tipo1, lista.valor[key]);
        }
        if (tipo1 != lista.valor[key].tipo.tipo) {
            return false;
        }
    }
    return true;
}
class Asignacion extends Nodo_1.Nodo {
    constructor(id, valor, line, column) {
        super(null, line, column);
        this.id = id;
        this.valor = valor;
    }
    execute(table, tree) {
        const result = this.valor.execute(table, tree);
        var bandera = true;
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        if (this.valor.tipo.tipo != variable.tipo.tipo) {
            if (variable.tipo2.tipo == 6 && this.valor.tipo.tipo == 6) {
                bandera = false;
            }
            else {
                if (variable.tipo.tipo == tipo_1.tipos.DECIMAL && (this.valor.tipo.tipo == tipo_1.tipos.DECIMAL || this.valor.tipo.tipo == tipo_1.tipos.ENTERO)) {
                    this.valor.tipo.tipo = tipo_1.tipos.DECIMAL;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `La variable no puede ser declarada debido a que son de diferentes tipos`, this.line, this.column);
                    tree.excepciones.push(error);
                    tree.consola.push(error.toString());
                    return error;
                }
            }
        }
        var val = result;
        try {
            let variable;
            variable = table.getVariable(this.valor.id);
            if (variable.tipo2.tipo == tipo_1.tipos.ARREGLO) {
                let nuevoArray = new Array();
                for (let x = 0; x < this.valor.valor.valor.length; x++) {
                    nuevoArray.push(Object.assign(Object.create(this.valor.valor.valor[x]), this.valor.valor.valor[x]));
                }
                let nuevoObjeto = new Primitivo_1.Primitivo(new tipo_1.Tipo(tipo_1.tipos.ARREGLO), nuevoArray, this.valor.line, this.valor.column);
                val = nuevoObjeto;
            }
        }
        catch (err) {
            if (bandera) {
                val = result;
            }
            else {
                if (revisar(variable.tipo.tipo, this.valor)) {
                    val = this.valor;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El Array no puede ser declarado debido a que son de diferentes tipos \n`, this.line, this.column);
                    return error;
                }
            }
        }
        variable.valor = val;
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ASIGNACION");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}
exports.Asignacion = Asignacion;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Primitivo":19,"../other/Excepcion":65,"../other/tipo":66}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const DeclaracionArray_1 = require("./DeclaracionArray");
class AsignacionVector extends Nodo_1.Nodo {
    constructor(id, posicion, valor, line, column) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.valor = valor;
    }
    execute(table, tree) {
        const result = this.valor.execute(table, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            return error;
        }
        var arreglo = variable.valor.valor;
        this.pos = this.posicion.execute(table, tree);
        if (this.posicion.tipo.tipo == tipo_1.tipos.ENTERO) {
            if ((this.pos >= arreglo.length) || (this.pos < 0)) {
                const error = new Excepcion_1.Excepcion('Semantico', `efe arriba   La Posicion especificada no es valida para el vector {${this.id}}`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
            else {
                if (variable.tipo.tipo != this.valor.tipo.tipo) {
                    this.valor.execute(table, tree);
                    if ((variable.tipo.tipo == tipo_1.tipos.DECIMAL) && (this.valor.tipo.tipo == tipo_1.tipos.ENTERO)) {
                        this.valor.tipo.tipo = tipo_1.tipos.DECIMAL;
                        arreglo[this.pos] = this.valor;
                        variable.valor.valor = arreglo;
                        return null;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `efeeee la posicion del vector no puede reasignarse debido a que son de diferentes tipos`, this.line, this.column);
                        tree.excepciones.push(error);
                        tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    let Alv = new Array();
                    let prim2 = Object.assign(Object.create(this.valor), this.valor);
                    arreglo[this.pos].valor = prim2.valor;
                    let prim = Object.assign(Object.create(arreglo), arreglo);
                    for (let index = 0; index < prim.length; index++) {
                        Alv.push(Object.assign(Object.create(prim[index]), prim[index]));
                    }
                    let new_dec = new DeclaracionArray_1.DeclaracionArray(variable.tipo, this.id, Alv, this.line, this.column);
                    variable.valor.valor = new_dec.listaValores;
                    return null;
                }
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba un valor entero en la posicion`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ASIGNACION VECTOR");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(`[${this.pos}]`);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}
exports.AsignacionVector = AsignacionVector;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66,"./DeclaracionArray":40}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
//
function alv(padre, id, lista_ids, valor, tree, table) {
    for (let index = 0; index < padre.valor.length; index++) {
        if (padre.valor[index].id == id) {
            if (padre.valor[index].tipo.tipo == 11) {
                if (lista_ids.length == 1) {
                    let variable = table.getVariable(name);
                    variable.valor = valor.execute(table, tree);
                    break;
                }
                else if (lista_ids.length > 1) {
                    lista_ids.shift();
                    let id_hijo;
                    id_hijo = table.getVariable(padre.valor[index].id[0]);
                    alv(id_hijo, lista_ids[0], lista_ids, valor, tree, id_hijo.ambito);
                }
            }
            else {
                padre.valor[index].valor = valor.execute(table, tree);
                break;
            }
        }
    }
}
class Asignacion_Struct extends Nodo_1.Nodo {
    constructor(id, posicion, valor, line, column) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.valor = valor;
    }
    execute(table, tree) {
        const result = this.valor.execute(table, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        let struct;
        struct = table.getVariable(this.id);
        console.log(struct);
        if (id_struct.tipo2.tipo == tipo_1.tipos.STRUCTS) {
            //id.id,id,id
            alv(id_struct, this.posicion[0], this.posicion, this.valor, tree, id_struct.ambito);
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `no se puede  modificar el valor del struct debido a que este id no es un struct \n`, this.line, this.column);
            return error;
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ASIGNACION_STRUCT");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(`[${this.pos}]`);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}
exports.Asignacion_Struct = Asignacion_Struct;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Case extends Nodo_1.Nodo {
    constructor(expresion, instrucciones, line, column) {
        super(null, line, column);
        this.expresion = expresion;
        this.instrucciones = instrucciones;
    }
    execute(table, tree) {
        return this;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("CASE " + this.expresion.getNodo());
        for (let i = 0; i < this.instrucciones.length; i++) {
            nodo.agregarHijo(this.instrucciones[i].getNodo());
        }
        return nodo;
    }
}
exports.Case = Case;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5}],38:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"dup":9}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const Primitivo_1 = require("../Expresiones/Primitivo");
const NodoAST_1 = require("../Abstract/NodoAST");
function defal(tipo, line, column) {
    if (tipo.tipo == tipo_1.tipos.ENTERO) {
        return new Primitivo_1.Primitivo(tipo, 0, line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.DECIMAL) {
        return new Primitivo_1.Primitivo(tipo, 0.0, line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.BOOLEANO) {
        return new Primitivo_1.Primitivo(tipo, true, line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.CARACTER) {
        return new Primitivo_1.Primitivo(tipo, '', line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.STRING) {
        return new Primitivo_1.Primitivo(tipo, "", line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.STRUCTS) {
        return new Primitivo_1.Primitivo(tipo, null, line, column);
    }
}
exports.defal = defal;
class Declaracion extends Nodo_1.Nodo {
    constructor(tipo, id, valor, line, column) {
        super(tipo, line, column);
        this.id = id;
        this.valor = valor;
    }
    execute(table, tree) {
        const result = this.valor.execute(table, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        if (this.valor.tipo.tipo != this.tipo.tipo) {
            if (this.tipo.tipo == tipo_1.tipos.DECIMAL && (this.valor.tipo.tipo == tipo_1.tipos.DECIMAL || this.valor.tipo.tipo == tipo_1.tipos.ENTERO)) {
                this.valor.tipo.tipo = tipo_1.tipos.DECIMAL;
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `La variable no puede ser declarada debido a que son de diferentes tipos`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        let simbolo;
        for (let key in this.id) {
            simbolo = new Simbolo_1.Simbolo(this.tipo, this.id[key], result, new tipo_1.Tipo(tipo_1.tipos.VARIABLE), this.line, this.column);
            const res = table.setVariable(simbolo);
            tree.Variables.push(simbolo);
        }
        // if (res != null) {
        // const error = new Excepcion('Semantico',
        // res,
        // this.line, this.column);
        // tree.excepciones.push(error);
        // tree.consola.push(error.toString());
        // }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("DECLARACION");
        nodo.agregarHijo(this.tipo + "");
        nodo.agregarHijo(this.id);
        if (this.valor != null) {
            nodo.agregarHijo("=");
            nodo.agregarHijo(this.valor.getNodo());
        }
        return nodo;
    }
}
exports.Declaracion = Declaracion;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Primitivo":19,"../Simbols/Simbolo":62,"../other/Excepcion":65,"../other/tipo":66}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const Primitivo_1 = require("../Expresiones/Primitivo");
const NodoAST_1 = require("../Abstract/NodoAST");
function defal(tipo, line, column) {
    if (tipo.tipo == tipo_1.tipos.ENTERO) {
        return new Primitivo_1.Primitivo(tipo, 0, line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.DECIMAL) {
        return new Primitivo_1.Primitivo(tipo, 0.0, line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.BOOLEANO) {
        return new Primitivo_1.Primitivo(tipo, true, line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.CARACTER) {
        return new Primitivo_1.Primitivo(tipo, '', line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.STRING) {
        return new Primitivo_1.Primitivo(tipo, "", line, column);
    }
}
exports.defal = defal;
function revisar(tipo1, lista, table, tree) {
    for (let key in lista.valor) {
        lista.valor[key].execute(table, tree);
        if (lista.valor[key].tipo.tipo == 6) {
            return revisar(tipo1, lista.valor[key]);
        }
        if (tipo1.tipo != lista.valor[key].tipo.tipo) {
            return false;
        }
    }
    return true;
}
class DeclaracionArray extends Nodo_1.Nodo {
    constructor(tipo, id, listaValores, line, column) {
        super(tipo, line, column);
        this.id = id;
        this.listaValores = listaValores;
    }
    //int[] a = [1];
    execute(table, tree) {
        if ((this.listaValores != null)) {
            //Declaracion Tipo 2  =[  ]
            if (revisar(this.tipo, this.listaValores, table, tree)) {
                let simbolo;
                simbolo = new Simbolo_1.Simbolo(this.tipo, this.id, this.listaValores, new tipo_1.Tipo(tipo_1.tipos.ARREGLO), this.line, this.column);
                if (table.getVariable(this.id) == null) {
                    table.setVariable(simbolo);
                    tree.Variables.push(simbolo);
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El array ${this.id} no puede ser declarado debido a que ya ha sido declarado anteriormente`, this.line, this.column);
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `El Array no puede ser declarado debido a que son de diferentes tipos \n`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("DECLARACION ARRAY");
        // if ((this.tipo2 != null) && (this.num != null) && (this.listaValores == null)) {
        //     nodo.agregarHijo(`${this.tipo}[]`);
        //     nodo.agregarHijo(this.id + "");
        //     nodo.agregarHijo("=");
        //     nodo.agregarHijo("new");
        //     var nodo2: NodoAST = new NodoAST("Tamaño del Array");
        //     nodo2.agregarHijo("int");
        //     nodo2.agregarHijo("[");
        //     nodo2.agregarHijo(this.num.getNodo());
        //     nodo2.agregarHijo("]");
        //     nodo.agregarHijo(nodo2);
        // } else if ((this.tipo2 == null) && (this.num == null) && (this.listaValores != null)) {
        //     nodo.agregarHijo(`${this.tipo}[]`);
        //     nodo.agregarHijo(this.id + "");
        //     nodo.agregarHijo("=");
        //     nodo.agregarHijo("{");
        //     var nodo2: NodoAST = new NodoAST("Lista Valores");
        //     for (let i = 0; i < this.listaValores.length; i++) {
        //         nodo2.agregarHijo(this.listaValores[i].getNodo());
        //     }
        //     nodo.agregarHijo(nodo2);
        //     nodo.agregarHijo("}");
        // }
        return nodo;
    }
}
exports.DeclaracionArray = DeclaracionArray;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Primitivo":19,"../Simbols/Simbolo":62,"../other/Excepcion":65,"../other/tipo":66}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const NodoAST_1 = require("../Abstract/NodoAST");
class DeclaracionMetodo extends Nodo_1.Nodo {
    constructor(tipo, id, listaParams, instrucciones, line, column) {
        super(tipo, line, column);
        this.id = id;
        this.listaParams = listaParams;
        this.instrucciones = instrucciones;
    }
    execute(table, tree) {
        // var nombre = this.id + "$";
        var nombre = this.id + "$";
        var index = 0;
        for (let param of this.listaParams) {
            // nombre += param.tipo;
            index += 1;
        }
        nombre += index + "";
        if (table.getVariable(nombre) == null) {
            var tipo2 = new tipo_1.Tipo(tipo_1.tipos.FUNCION);
            if (this.tipo.tipo == tipo_1.tipos.VOID) {
                tipo2 = new tipo_1.Tipo(tipo_1.tipos.METODO);
            }
            var metodo = new Simbolo_1.Simbolo(this.tipo, nombre, [this.listaParams, this.instrucciones], tipo2, this.line, this.column);
            table.setVariable(metodo);
            tree.Variables.push(metodo);
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `El metodo {${nombre.split("$", 1)[0]}} ya ha sido creado con anterioridad `, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("DECLARACION METODO");
        if (this.tipo.tipo == tipo_1.tipos.VOID) {
            nodo.agregarHijo("Void");
        }
        else {
            nodo.agregarHijo(this.tipo + "");
        }
        nodo.agregarHijo(this.id);
        nodo.agregarHijo("(");
        if (this.listaParams.length != 0) {
            var nodo2 = new NodoAST_1.NodoAST("Parametros");
            var index = 1;
            for (let i = 0; i < this.listaParams.length; i++) {
                var param = this.listaParams[i];
                var nodo3 = new NodoAST_1.NodoAST(param.tipo + "");
                nodo3.agregarHijo(param.id + "");
                nodo2.agregarHijo(nodo3);
            }
            nodo.agregarHijo(nodo2);
        }
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        var nodo3 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        for (let i = 0; i < this.instrucciones.length; i++) {
            nodo3.agregarHijo(this.instrucciones[i].getNodo());
        }
        nodo.agregarHijo(nodo3);
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.DeclaracionMetodo = DeclaracionMetodo;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Simbols/Simbolo":62,"../other/Excepcion":65,"../other/tipo":66}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Declaracion_1 = require("./Declaracion");
const DeclaracionArray_1 = require("./DeclaracionArray");
class DeclaracionVarStruct extends Nodo_1.Nodo {
    constructor(tipo, nombre_struct, id, expresion, line, column) {
        super(tipo, line, column);
        this.id = id;
        this.nombre_struct = nombre_struct;
        this.expresion = expresion;
    }
    execute(table, tree) {
        this.newTable = new Table_1.Table(table);
        let new_struct;
        let struct_padre;
        struct_padre = table.getVariable(this.nombre_struct);
        let nuevoArray = new Array();
        if (this.expresion != null) {
            if (struct_padre.valor.length == this.expresion.listaParams.length) {
                for (let index = 0; index < struct_padre.valor.length; index++) {
                    if (struct_padre.valor[index] instanceof Declaracion_1.Declaracion) {
                        let dec = struct_padre.valor[index];
                        let exp = this.expresion.listaParams[index];
                        let new_dec = new Declaracion_1.Declaracion(dec.tipo, dec.id, null, dec.line, dec.column);
                        new_dec.valor = Object.assign(Object.create(exp), exp);
                        nuevoArray.push(new_dec);
                    }
                    else if (struct_padre.valor[index] instanceof DeclaracionArray_1.DeclaracionArray) {
                        let dec = struct_padre.valor[index];
                        let exp = this.expresion.listaParams[index];
                        let nuevoArray2 = new Array();
                        for (let i = 0; i < exp.valor.length; i++) {
                            nuevoArray2.push(Object.assign(Object.create(exp.valor[i]), exp.valor[i]));
                        }
                        let prim = Object.assign(Object.create(exp), exp);
                        prim.valor = nuevoArray2;
                        let new_dec = new DeclaracionArray_1.DeclaracionArray(dec.tipo, dec.id, null, dec.line, dec.column);
                        new_dec.listaValores = prim;
                        nuevoArray.push(new_dec);
                    }
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `La lista de parametros no es la necesaria para la declaracion del struct\n`, this.line, this.column);
                return error;
            }
        }
        else {
            for (let index = 0; index < struct_padre.valor.length; index++) {
                if (struct_padre.valor[index] instanceof Declaracion_1.Declaracion) {
                    let dec = struct_padre.valor[index];
                    let new_dec = new Declaracion_1.Declaracion(dec.tipo, dec.id, null, dec.line, dec.column);
                    new_dec.valor = Object.assign(Object.create(dec.valor), dec.valor);
                    nuevoArray.push(new_dec);
                }
            }
        }
        new_struct = new Simbolo_1.Simbolo(struct_padre.tipo, this.id[0], nuevoArray, new tipo_1.Tipo(tipo_1.tipos.STRUCTS), this.line, this.column);
        new_struct.ambito = this.newTable;
        const res = table.setVariable(new_struct);
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("VAR_STRUCT");
        nodo.agregarHijo(this.nombre_struct);
        nodo.agregarHijo(".");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo(this.expresion.getNodo());
        if (this.valor != null) {
            nodo.agregarHijo("=");
            nodo.agregarHijo(this.valor.getNodo());
        }
        return nodo;
    }
}
exports.DeclaracionVarStruct = DeclaracionVarStruct;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Simbols/Simbolo":62,"../Simbols/Table":63,"../other/Excepcion":65,"../other/tipo":66,"./Declaracion":39,"./DeclaracionArray":40}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Continue_1 = require("../Expresiones/Continue");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Retorno_1 = require("./Retorno");
class DoWhile extends Nodo_1.Nodo {
    constructor(condicion, List, line, column) {
        super(null, line, column);
        this.condicion = condicion;
        this.List = List;
    }
    execute(table, tree) {
        const newtable = new Table_1.Table(table);
        let result;
        let bandera = true;
        do {
            result = this.condicion.execute(newtable, tree);
            if (result instanceof Excepcion_1.Excepcion) {
                return result;
            }
            if (this.condicion.tipo.tipo !== tipo_1.tipos.BOOLEANO) {
                const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba una expresion booleana para la condicion`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
            if (result || bandera) {
                for (let i = 0; i < this.List.length; i++) {
                    const res = this.List[i].execute(newtable, tree);
                    if (res instanceof Continue_1.Continue) {
                        break;
                    }
                    else if (res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                        return;
                    }
                }
            }
            bandera = false;
        } while (result);
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("DO WHILE");
        nodo.agregarHijo("do");
        nodo.agregarHijo("{");
        var nodo2 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        for (let i = 0; i < this.List.length; i++) {
            nodo2.agregarHijo(this.List[i].getNodo());
        }
        nodo.agregarHijo(nodo2);
        nodo.agregarHijo("}");
        nodo.agregarHijo("while");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.condicion.getNodo());
        nodo.agregarHijo(")");
        nodo.agregarHijo(";");
        return nodo;
    }
}
exports.DoWhile = DoWhile;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Break":7,"../Expresiones/Continue":9,"../Simbols/Table":63,"../other/Excepcion":65,"../other/tipo":66,"./Retorno":52}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Continue_1 = require("../Expresiones/Continue");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Retorno_1 = require("./Retorno");
class For extends Nodo_1.Nodo {
    constructor(inicio, fin, paso, expresion, line, column) {
        super(null, line, column);
        this.inicio = inicio;
        this.fin = fin;
        this.paso = paso;
        this.expresion = expresion;
    }
    execute(table, tree) {
        this.inicio.execute(table, tree);
        const newtable = new Table_1.Table(table);
        let result;
        do {
            result = this.fin.execute(newtable, tree);
            if (result instanceof Excepcion_1.Excepcion) {
                return result;
            }
            if (this.fin.tipo.tipo !== tipo_1.tipos.BOOLEANO) {
                const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba una expresion booleana para la condicion`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
            if (result) {
                for (let i = 0; i < this.expresion.length; i++) {
                    const res = this.expresion[i].execute(newtable, tree);
                    if (res instanceof Continue_1.Continue) {
                        break;
                    }
                    else if (res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                        return;
                    }
                }
                this.paso.execute(table, tree);
            }
        } while (result);
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("FOR");
        nodo.agregarHijo("for");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.inicio.getNodo());
        nodo.agregarHijo(";");
        nodo.agregarHijo(this.fin.getNodo());
        nodo.agregarHijo(";");
        nodo.agregarHijo(this.paso.getNodo());
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        var nodo2 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        for (let i = 0; i < this.expresion.length; i++) {
            nodo2.agregarHijo(this.expresion[i].getNodo());
        }
        nodo.agregarHijo(nodo2);
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.For = For;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Break":7,"../Expresiones/Continue":9,"../Simbols/Table":63,"../other/Excepcion":65,"../other/tipo":66,"./Retorno":52}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const Continue_1 = require("../Expresiones/Continue");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Retorno_1 = require("./Retorno");
class ForIn extends Nodo_1.Nodo {
    constructor(id, cadena, expresion, line, column) {
        super(null, line, column);
        this.id = id;
        this.cadena = cadena;
        this.expresion = expresion;
        this.cadenaSalida = new Array();
    }
    execute(table, tree) {
        const newtable = new Table_1.Table(table);
        let result;
        this.id.execute(newtable, tree);
        this.cadena.execute(table, tree);
        this.indice = this.cadena.valor.length;
        let variable;
        variable = newtable.getVariable(this.id.id[0]);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        var cadena = this.cadena.valor;
        var tipo2 = null;
        try {
            cadena.execute(table, tree);
            tipo2 = cadena.tipo.tipo;
            cadena = cadena.valor;
        }
        catch (err) { }
        if (this.cadena.tipo.tipo == 6 || tipo2 == 6) {
            for (const key in cadena) {
                this.cadenaSalida.push(cadena[key].execute(newtable, tree));
                variable.tipo = cadena[key].tipo;
            }
        }
        else if (this.cadena.tipo.tipo == 4) {
            for (const key in cadena) {
                this.cadenaSalida.push(cadena[key]);
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `No se puede utilizar un For in en este tipo de dato`, this.line, this.column);
            return error;
        }
        var paso = 0;
        while (paso < this.cadenaSalida.length) {
            variable.valor = this.cadenaSalida[paso];
            for (let i = 0; i < this.expresion.length; i++) {
                const res = this.expresion[i].execute(newtable, tree);
                if (res instanceof Continue_1.Continue) {
                    break;
                }
                else if (res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                    return;
                }
            }
            paso++;
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("FOR_IN");
        nodo.agregarHijo("forIn");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo(this.cadena.getNodo());
        nodo.agregarHijo("{");
        var nodo2 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        for (let i = 0; i < this.expresion.length; i++) {
            nodo2.agregarHijo(this.expresion[i].getNodo());
        }
        nodo.agregarHijo(nodo2);
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.ForIn = ForIn;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Break":7,"../Expresiones/Continue":9,"../Simbols/Table":63,"../other/Excepcion":65,"./Retorno":52}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Continue_1 = require("../Instrucciones/Continue");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Retorno_1 = require("./Retorno");
class If extends Nodo_1.Nodo {
    constructor(condicion, listaIf, listaElse, line, column) {
        super(null, line, column);
        this.condicion = condicion;
        this.listaIf = listaIf;
        this.listaElse = listaElse;
    }
    execute(table, tree) {
        let cont1 = 0;
        let cont2 = 0;
        for (cont1 < this.listaIf.length; cont1++;) {
            console.log(cont1);
        }
        for (cont2 < this.listaElse.length; cont2++;) {
            console.log(cont2);
        }
        const newtable = new Table_1.Table(table);
        let result;
        result = this.condicion.execute(newtable, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        if (this.condicion.tipo.tipo !== tipo_1.tipos.BOOLEANO) {
            const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba una expresion BOOLEANA para la condicion`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        if (result) {
            for (let i = 0; i < this.listaIf.length; i++) {
                const res = this.listaIf[i].execute(newtable, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                    return res;
                }
            }
        }
        else {
            for (let i = 0; i < this.listaElse.length; i++) {
                const res = this.listaElse[i].execute(newtable, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                    return res;
                }
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("IF");
        nodo.agregarHijo("if");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.condicion.getNodo());
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        var nodo2 = new NodoAST_1.NodoAST("INSTRUCCIONES IF");
        for (let i = 0; i < this.listaIf.length; i++) {
            nodo2.agregarHijo(this.listaIf[i].getNodo());
        }
        nodo.agregarHijo(nodo2);
        nodo.agregarHijo("}");
        if (this.listaElse != null) { // ELSE
            nodo.agregarHijo("else");
            nodo.agregarHijo("{");
            var nodo3 = new NodoAST_1.NodoAST("INSTRUCCIONES ELSE");
            for (let i = 0; i < this.listaElse.length; i++) {
                nodo3.agregarHijo(this.listaElse[i].getNodo());
            }
            nodo.agregarHijo(nodo3);
            nodo.agregarHijo("}");
        }
        return nodo;
    }
}
exports.If = If;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Break":7,"../Instrucciones/Continue":38,"../Simbols/Table":63,"../other/Excepcion":65,"../other/tipo":66,"./Retorno":52}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Continue_1 = require("../Instrucciones/Continue");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Retorno_1 = require("./Retorno");
class If_unico extends Nodo_1.Nodo {
    constructor(condicion, listaIf, listaIf2, listaElse, tipos, line, column) {
        super(null, line, column);
        this.condicion = condicion;
        this.listaIf = listaIf;
        this.listaElse = listaElse;
        this.tipos = tipos;
        this.listaIf2 = listaIf2;
    }
    execute(table, tree) {
        let cont1 = 0;
        let cont2 = 0;
        const newtable = new Table_1.Table(table);
        let result;
        result = this.condicion.execute(newtable, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        if (this.condicion.tipo.tipo !== tipo_1.tipos.BOOLEANO) {
            const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba una expresion BOOLEANA para la condicion`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        if (result) {
            if (this.tipos == 1) {
                const res = this.listaIf.execute(newtable, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                    return res;
                }
            }
            else {
                for (let i = 0; i < this.listaIf2.length; i++) {
                    const res = this.listaIf2[i].execute(newtable, tree);
                    if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                        return res;
                    }
                }
            }
        }
        else {
            if (this.listaElse != null) {
                const res = this.listaElse.execute(newtable, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                    return res;
                }
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("IF");
        nodo.agregarHijo("if");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.condicion.getNodo());
        nodo.agregarHijo(")");
        var nodo2 = new NodoAST_1.NodoAST("INSTRUCCIONES IF");
        nodo2.agregarHijo(this.listaIf.getNodo());
        nodo.agregarHijo(nodo2);
        if (this.listaElse != null) { // ELSE
            nodo.agregarHijo("else");
            var nodo3 = new NodoAST_1.NodoAST("INSTRUCCIONES ELSE");
            nodo3.agregarHijo(this.listaElse.getNodo());
            nodo.agregarHijo(nodo3);
        }
        return nodo;
    }
}
exports.If_unico = If_unico;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Break":7,"../Instrucciones/Continue":38,"../Simbols/Table":63,"../other/Excepcion":65,"../other/tipo":66,"./Retorno":52}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Continue_1 = require("../Expresiones/Continue");
const Break_1 = require("../Expresiones/Break");
const Retorno_1 = require("./Retorno");
const DeclaracionArray_1 = require("./DeclaracionArray");
//*
class LlamadaMetodo extends Nodo_1.Nodo {
    constructor(id, listaParams, line, column) {
        super(null, line, column);
        this.id = id;
        this.listaParams = listaParams;
    }
    execute(table, tree) {
        const newtable = new Table_1.Table(table);
        var nombre = this.id + "$";
        // var nombre = this.id;
        var index = 0;
        for (let param of this.listaParams) {
            var valor = param.execute(newtable, tree);
            // nombre += <any>param.tipo;
            index += 1;
        }
        nombre += index + "";
        let simboloMetodo;
        simboloMetodo = table.getVariable(nombre);
        if (simboloMetodo == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `El metodo {${this.id}} no ha sido encontrado con esa combinacion de parametros`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        var parametros = simboloMetodo.valor[0];
        for (let i = 0; i < parametros.length; i++) {
            if (parametros[i] instanceof DeclaracionArray_1.DeclaracionArray) {
                var para;
                var crear;
                para = parametros[i];
                let Alv = new Array();
                crear = para;
                for (let index = 0; index < this.listaParams.length; index++) {
                    Alv.push(Object.assign(Object.create(this.listaParams[index]), this.listaParams[index]));
                }
                crear.listaValores = Alv;
                crear.execute(newtable, tree);
            }
            else {
                var para;
                var crear;
                para = parametros[i];
                crear = para;
                crear.valor = this.listaParams[i];
                crear.execute(newtable, tree);
            }
        }
        var result = simboloMetodo.valor[1];
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const res = result[i].execute(newtable, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break) {
                    return res;
                }
                if (simboloMetodo.tipo.tipo == tipo_1.tipos.VOID) {
                    if (res instanceof Retorno_1.Retorno) {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se esperaba un retorno en este metodo`, res.line, res.column);
                        tree.excepciones.push(error);
                        tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    if (res instanceof Retorno_1.Retorno) {
                        if (res.expresion != null) {
                            this.tipo = res.expresion.tipo;
                            res.execute(newtable, tree);
                            var retorno = res.exp;
                            if (simboloMetodo.tipo.tipo == res.expresion.tipo.tipo) {
                                return retorno;
                            }
                            else {
                                if (simboloMetodo.tipo.tipo == tipo_1.tipos.DECIMAL && (res.expresion.tipo.tipo == tipo_1.tipos.ENTERO)) {
                                    return retorno;
                                }
                                const error = new Excepcion_1.Excepcion('Semantico', `No se puede retornar debido a que es de un tipo diferente al declarado`, res.line, res.column);
                                tree.excepciones.push(error);
                                tree.consola.push(error.toString());
                                return error;
                            }
                        }
                        else {
                            const error = new Excepcion_1.Excepcion('Semantico', `No se puede retornar debido a que es de un tipo diferente al declarado`, res.line, res.column);
                            tree.excepciones.push(error);
                            tree.consola.push(error.toString());
                            return error;
                        }
                    }
                }
            }
            if (simboloMetodo.tipo.tipo != tipo_1.tipos.VOID) {
                const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba un retorno en esta Funcion`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("LLAMADA METODO");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo("(");
        if (this.listaParams.length != 0) {
            var nodo2 = new NodoAST_1.NodoAST("Parametros");
            var index = 1;
            for (let i = 0; i < this.listaParams.length; i++) {
                var param = this.listaParams[i];
                var nodo3 = new NodoAST_1.NodoAST(param.tipo + "");
                nodo3.agregarHijo(param.id + "");
                nodo2.agregarHijo(nodo3);
            }
            nodo.agregarHijo(nodo2);
        }
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        var nodo3 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        nodo.agregarHijo(nodo3);
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.LlamadaMetodo = LlamadaMetodo;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Break":7,"../Expresiones/Continue":9,"../Simbols/Table":63,"../other/Excepcion":65,"../other/tipo":66,"./DeclaracionArray":40,"./Retorno":52}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Continue_1 = require("../Expresiones/Continue");
const Break_1 = require("../Expresiones/Break");
class Main extends Nodo_1.Nodo {
    constructor(tipo, instrucciones, line, column) {
        super(tipo, line, column);
        this.instrucciones = instrucciones;
    }
    execute(table, tree) {
        //com oasi ?
        // var nombre = this.id + "$";
        console.log("aqui");
        var result = this.instrucciones;
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const res = result[i].execute(table, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break) {
                    return res;
                }
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("MAIN");
        if (this.tipo.tipo == tipo_1.tipos.VOID) {
            nodo.agregarHijo("Void");
        }
        nodo.agregarHijo("main");
        nodo.agregarHijo("(");
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        var nodo3 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        for (let i = 0; i < this.instrucciones.length; i++) {
            nodo3.agregarHijo(this.instrucciones[i].getNodo());
        }
        nodo.agregarHijo(nodo3);
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.Main = Main;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Break":7,"../Expresiones/Continue":9,"../other/tipo":66}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
function alv(padre, id, lista_ids, tree, table) {
    for (let index = 0; index < padre.valor.length; index++) {
        if (padre.valor[index].id[0] == id) {
            if (padre.valor[index].tipo.tipo == 11) {
                // if (lista_ids.length == 1) {
                //     let variable = table.getVariable(id);
                //     return variable.valor;
                // }
                // else if (lista_ids.length > 1) {
                //     lista_ids.shift();
                //     let id_hijo: Simbolo
                //     id_hijo = table.getVariable(padre.valor[index].id[0])
                //     return alv(id_hijo, lista_ids[0], lista_ids, tree, id_hijo.ambito);
                // }
            }
            else {
                let variable = table.getVariable(id);
                return variable;
            }
        }
    }
    return null;
}
class Obtener_struct extends Nodo_1.Nodo {
    constructor(id, posicion, line, column) {
        super(null, line, column);
        this.id = id.id;
        this.posicion = posicion;
    }
    execute(table, tree) {
        let struct_var;
        struct_var = table.getVariable(this.id);
        for (let x = 0; x < struct_var.valor.length; x++) {
            struct_var.valor[x].execute(struct_var.ambito, tree);
        }
        if (struct_var.tipo2.tipo == tipo_1.tipos.STRUCTS) {
            let retorno = alv(struct_var, this.posicion[0], this.posicion, tree, struct_var.ambito);
            this.tipo = retorno.tipo;
            this.valor = retorno.valor;
            return retorno.valor;
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `no se puede  modificar el valor del struct debido a que este id no es un struct`, this.line, this.column);
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("OBTENER_STRUCT");
        nodo.agregarHijo(this.id + "");
        for (let index = 0; index < this.posicion.length; index++) {
            nodo.agregarHijo(".");
            nodo.agregarHijo(this.posicion[index]);
        }
        return nodo;
    }
}
exports.Obtener_struct = Obtener_struct;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Identificador_1 = require("../Expresiones/Identificador");
function imprimir(lista, table, tree) {
    var salida = "[";
    for (let key in lista.valor) {
        lista.valor[key].execute(table, tree);
        if (lista.valor[key].tipo.tipo == 6) {
            salida = salida + imprimir(lista.valor[key], table, tree);
        }
        else {
            if (lista.valor[key] instanceof Identificador_1.Identificador) {
                try {
                    if (lista.valor[key].valor.tipo.tipo == 6) {
                        salida = salida + imprimir(lista.valor[key].valor, table, tree);
                    }
                }
                catch (err) {
                    salida += lista.valor[key].execute(table, tree) + ", ";
                }
            }
            else {
                salida += lista.valor[key].execute(table, tree) + ", ";
            }
        }
    }
    salida = salida.substring(0, salida.length - 2) + "], ";
    return salida;
}
class Print extends Nodo_1.Nodo {
    constructor(expresion, line, column, tipo_print) {
        super(null, line, column);
        this.expresion = expresion;
        this.tipo_print = tipo_print;
    }
    execute(table, tree) {
        console.log("PRINT");
        console.log(this.expresion);
        console.log("PRINT");
        for (let key in this.expresion) {
            var valor = this.expresion[key].execute(table, tree);
            if (this.expresion[key].tipo.tipo == 6) {
                let texto = imprimir(this.expresion[key], table, tree);
                tree.consola.push(texto.substring(0, texto.length - 2) + " ");
            }
            else {
                if (valor.tipo) {
                    if (valor.tipo.tipo == 6) {
                        let texto = imprimir(valor, table, tree);
                        tree.consola.push(texto.substring(0, texto.length - 2) + " ");
                    }
                }
                else {
                    this.valor2 = valor;
                    tree.consola.push(valor + " ");
                    this.tipo = this.expresion[key].tipo;
                }
            }
        }
        /*agregando el tipo para el pritnln lo  maneje asi  fuera del for para evitar clavos papa ctm*/
        if (this.tipo_print == 1) {
        }
        else if (this.tipo_print == 2) {
            tree.consola.push("\n");
        }
        console.log("TIPO");
        console.log(this.tipo);
        console.log("TIPO");
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
    get3D(table, tree) {
        let temporal;
        let codigo = '';
        if (this.tipo.tipo == 0 || this.tipo.tipo == 1) {
            codigo += this.expresion[0].get3D(table, tree);
            codigo += `    printf("%f", (double)${table.getTemporalActual()});\n`;
            codigo += `    printf("%c", (char)10);\n`;
        }
        else if (this.tipo.tipo == 4) {
            temporal = table.getTemporal();
            table.AgregarTemporal(temporal);
            codigo += `    ${temporal} = H;\n`;
            for (let i in this.valor2) {
                codigo += `    heap[(int)H] = ${this.valor2[i].charCodeAt(0)};\n`;
                codigo += `    H = H + 1;\n`;
            }
            codigo += `    heap[(int)H] = -1;\n`;
            codigo += `    H = H + 1;\n`;
            let tempActual1 = table.getTemporalActual();
            temporal = table.getTemporal();
            table.AgregarTemporal(temporal);
            codigo += `    ${temporal} = P + 1;\n`;
            let tempActual2 = table.getTemporalActual();
            codigo += `    stack[(int)${tempActual2}] = ${tempActual1};\n`;
            codigo += `    print();\n`;
            temporal = table.getTemporal();
            table.AgregarTemporal(temporal);
            codigo += `    ${temporal} = stack[(int)P];\n`;
            codigo += `    printf("%c", (char)10);\n\n`;
        }
        else if (this.tipo.tipo == 5) {
            let Etiq = table.getEtiqueta();
            table.setTrue(table.etiqueta);
            Etiq = table.getEtiqueta();
            table.setFalse(table.etiqueta);
            codigo += this.expresion[0].get3D(table, tree);
            codigo += `    ${table.getTrue()}:\n`;
            codigo += `    printf("%c", (char)116);\n`;
            codigo += `    printf("%c", (char)114);\n`;
            codigo += `    printf("%c", (char)117);\n`;
            codigo += `    printf("%c", (char)101);\n`;
            Etiq = table.getEtiqueta();
            codigo += `    goto ${table.getEtiquetaActual()};\n`;
            codigo += `    ${table.getFalse()}:\n`;
            codigo += `    printf("%c", (char)102);\n`;
            codigo += `    printf("%c", (char)97);\n`;
            codigo += `    printf("%c", (char)108);\n`;
            codigo += `    printf("%c", (char)115);\n`;
            codigo += `    printf("%c", (char)101);\n`;
            codigo += `    ${table.getEtiquetaActual()}:\n`;
            codigo += `    printf("%c", (char)10);\n`;
        }
        return codigo;
    }
}
exports.Print = Print;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Identificador":12}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Retorno extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(null, line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        if (this.expresion != null) {
            this.exp = this.expresion.execute(table, tree);
        }
        return this;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("RETURN");
        if (this.expresion != null) {
            nodo.agregarHijo(this.expresion.getNodo());
        }
        return nodo;
    }
}
exports.Retorno = Retorno;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Struct extends Nodo_1.Nodo {
    constructor(id, lista_declaracion, line, column) {
        super(null, line, column);
        this.id = id;
        this.lista_declaracion = lista_declaracion;
    }
    execute(table, tree) {
        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRUCTS);
        this.newTable = new Table_1.Table(table);
        if ((this.lista_declaracion != null)) {
            let simbolo;
            for (let index = 0; index < this.lista_declaracion.length; index++) {
                this.lista_declaracion[index].execute(this.newTable, tree);
            }
            simbolo = new Simbolo_1.Simbolo(this.tipo, this.id, this.lista_declaracion, new tipo_1.Tipo(tipo_1.tipos.STRUCTS), this.line, this.column);
            simbolo.ambito = this.newTable;
            if (table.getVariable(this.id) == null) {
                table.setVariable(simbolo);
                tree.Variables.push(simbolo);
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `El array ${this.id} no puede ser declarado debido a que ya ha sido declarado anteriormente`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("DECLARACION STRUCT");
        nodo.agregarHijo("struct");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo("{");
        for (let index = 0; index < this.lista_declaracion.length; index++) {
            nodo.agregarHijo(this.lista_declaracion[index].getNodo());
        }
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.Struct = Struct;
/*


struct alv {
int var1 , int var2,


int efe3

};

struct alv2 {
alv efe , int efe2 ,int [] efe

};





print(alv);

*/ 

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Simbols/Simbolo":62,"../Simbols/Table":63,"../other/Excepcion":65,"../other/tipo":66}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Relacional_1 = require("../Expresiones/Relacional");
class Switch extends Nodo_1.Nodo {
    constructor(expresion, listaCasos, defal, line, column) {
        super(null, line, column);
        this.expresion = expresion;
        this.listaCasos = listaCasos;
        this.defal = defal;
    }
    execute(table, tree) {
        const newtable = new Table_1.Table(table);
        var ejecutado = false;
        var ejecutado2 = false;
        if (this.listaCasos != null) {
            for (let caso of this.listaCasos) {
                const caso2 = caso.execute(newtable, tree);
                var condicion = new Relacional_1.Relacional(this.expresion, caso2.expresion, '==', this.line, this.column);
                if (condicion.execute(newtable, tree) || ejecutado) {
                    ejecutado2 = true;
                    for (let i = 0; i < caso2.instrucciones.length; i++) {
                        const res = caso2.instrucciones[i].execute(newtable, tree);
                        if (res instanceof Break_1.Break) {
                            ejecutado = false;
                            break;
                        }
                        ejecutado = true;
                    }
                }
            }
        }
        if ((this.defal && !ejecutado2) || this.listaCasos == null || ejecutado) {
            for (let def of this.defal) {
                const res = def.execute(newtable, tree);
            }
        }
        /*
            int a=1;
switch(a){
  case 1 : print("efe");
  case 2: print("efe2"); break;
  default: print("d");
};


}*/
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("SWITCH");
        nodo.agregarHijo("switch");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion.getNodo());
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        if (this.listaCasos != null) {
            var nodo2 = new NodoAST_1.NodoAST("Casos");
            for (let i = 0; i < this.listaCasos.length; i++) {
                nodo2.agregarHijo(this.listaCasos[i].getNodo());
            }
            nodo.agregarHijo(nodo2);
        }
        if (this.defal != null) {
            var nodo3 = new NodoAST_1.NodoAST("Default");
            for (let i = 0; i < this.defal.length; i++) {
                nodo3.agregarHijo(this.defal[i].getNodo());
            }
            nodo.agregarHijo(nodo3);
        }
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.Switch = Switch;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Break":7,"../Expresiones/Relacional":20,"../Simbols/Table":63}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Continue_1 = require("../Expresiones/Continue");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Retorno_1 = require("./Retorno");
class While extends Nodo_1.Nodo {
    constructor(condicion, List, line, column) {
        super(null, line, column);
        this.condicion = condicion;
        this.List = List;
    }
    execute(table, tree) {
        const newtable = new Table_1.Table(table);
        let result;
        do {
            result = this.condicion.execute(newtable, tree);
            if (result instanceof Excepcion_1.Excepcion) {
                return result;
            }
            if (this.condicion.tipo.tipo !== tipo_1.tipos.BOOLEANO) {
                const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba una expresion booleana para la condicion`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
            if (result) {
                for (let i = 0; i < this.List.length; i++) {
                    const res = this.List[i].execute(newtable, tree);
                    if (res instanceof Continue_1.Continue) {
                        break;
                    }
                    else if (res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                        return;
                    }
                }
            }
        } while (result);
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("WHILE");
        nodo.agregarHijo("while");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.condicion.getNodo());
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        var nodo2 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        for (let i = 0; i < this.List.length; i++) {
            nodo2.agregarHijo(this.List[i].getNodo());
        }
        nodo.agregarHijo(nodo2);
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.While = While;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../Expresiones/Break":7,"../Expresiones/Continue":9,"../Simbols/Table":63,"../other/Excepcion":65,"../other/tipo":66,"./Retorno":52}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Pop extends Nodo_1.Nodo {
    constructor(id, line, column) {
        super(null, line, column);
        this.id = id;
    }
    execute(table, tree) {
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `El arreglo {${this.id}} no ha sido encontrado`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        var arreglo = variable.valor.valor;
        if (variable.tipo2.tipo == tipo_1.tipos.ARREGLO) {
            // variable.valor = arreglo;
            return arreglo.pop();
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `No se puede eliminar un valor a {${this.id}}`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("POP");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(".pop");
        nodo.agregarHijo("(");
        nodo.agregarHijo(")");
        return nodo;
    }
}
exports.Pop = Pop;

},{"../Abstract/Nodo":4,"../Abstract/NodoAST":5,"../other/Excepcion":65,"../other/tipo":66}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function graphAST(raiz) {
    var r = "AST";
    var ext = "pdf";
    var fs = require('fs');
    var stream = fs.createWriteStream(`./src/Reportes/${r}.dot`);
    stream.once('open', function () {
        stream.write(getDot(raiz));
        stream.end();
    });
    const exec = require('child_process').exec;
    exec(`dot -T pdf -o ./src/Reportes/${r}.${ext} ./src/Reportes/${r}.dot`, (err, stdout) => {
        if (err) {
            throw err;
        }
        console.log(stdout);
    });
}
exports.graphAST = graphAST;
var c;
var grafo;
function getDot(raiz) {
    grafo = "";
    grafo += "digraph {\n"; //                         "     \"
    grafo += "n0[label=\"" + raiz.getValor() + "\"];\n";
    c = 1;
    recorrerAST("n0", raiz);
    grafo += "}";
    return grafo;
}
exports.getDot = getDot;
function recorrerAST(padre, nPadre) {
    nPadre.getHijos().forEach(hijo => {
        var nombreHijo = "n" + c;
        grafo += nombreHijo + "[label=\"" + hijo.getValor() + "\"];\n";
        grafo += padre + "->" + nombreHijo + ";\n";
        c++;
        recorrerAST(nombreHijo, hijo);
    });
}
function graphTabla(tabla) {
    var fs = require('fs');
    var stream = fs.createWriteStream(`./src/Reportes/TablaSimbolos.html`);
    let documento = "";
    stream.once('open', function () {
        stream.write(escribirHtml(tabla, documento));
        stream.end();
    });
}
exports.graphTabla = graphTabla;
function escribirHtml(tabla, documento) {
    documento += "<!DOCTYPE html>\n<html>\n<head>\n";
    documento += "   <meta charset='UTF-8'>\n";
    documento += "   <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'>\n";
    documento += "</head>\n";
    documento += "<body class='container grey lighten-1'>\n";
    documento += "<h2>Tabla de Simbolos</h2>\n";
    documento += "   <table class='highlight'>\n";
    documento += "       <thead>\n";
    documento += "           <tr>\n";
    documento += "               <th>Identificador</th>\n";
    documento += "               <th>Tipo</th>\n";
    documento += "               <th>Tipo</th>\n";
    documento += "               <th>linea</th>\n";
    documento += "               <th>Columna</th>\n";
    documento += "           </tr>\n";
    documento += "       </thead>\n";
    documento += "       <tbody>\n";
    var num = 1;
    for (let i = 0; i < tabla.length; i++) {
        var variable = tabla[i];
        documento += "           <tr>\n";
        documento += `                <th><strong>${variable.id.split("$", 1)[0]}</strong></th>\n`;
        documento += `                <th><strong>${variable.tipo}</strong></th>\n`;
        documento += `                <th><strong>${variable.tipo2}</strong></th>\n`;
        documento += `                <th><strong>${variable.line}</strong></th>\n`;
        documento += `                <th><strong>${variable.column}</strong></th>\n`;
        documento += "           </tr>\n";
        num += 1;
    }
    documento += "       </tbody>\n";
    documento += "   </table>\n";
    documento += "</body>\n</html>\n";
    return documento;
}

},{"child_process":1,"fs":1}],58:[function(require,module,exports){
(function (global){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../Simbols/Table");
const ReporteGramatica_1 = require("../Simbols/ReporteGramatica");
const Grafica_1 = require("./Grafica");
const NodoAST_1 = require("../Abstract/NodoAST");
const Error_1 = require("../Simbols/Error");
const DeclaracionMetodo_1 = require("../Instrucciones/DeclaracionMetodo");
const Declaracion_1 = require("../Instrucciones/Declaracion");
const DeclaracionArray_1 = require("../Instrucciones/DeclaracionArray");
const Main_1 = require("../Instrucciones/Main");
const parser = require('../Gramatica/grammar.js');
let simbolos = "";
let graficas = "";
let err = "";
var editor = CodeMirror.fromTextArea(document.getElementById('editor1'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
    indentUnit: 4,
});
editor.setSize(500, 500);
editor.save();
var editor2 = CodeMirror.fromTextArea(document.getElementById('editor2'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
    indentUnit: 4,
});
editor2.setSize(500, 500);
editor2.save();
global.grafo = function grafo() {
    let prueba = "digraph G { a->b; }";
    d3.select("#AST").graphviz().renderDot(graficas);
};
global.reporte = function reporte() {
    document.getElementById("gramatical").innerHTML = simbolos;
};
global.efe = function efe() {
    document.getElementById("gramatical").innerHTML = err;
};
global.Gramatical = function Gramatical() {
    let reporte_gramatical = `  <h1 style="color:beige;">Reporte Gramatical</h1>   
    
       <table style=" color:beige; float=left;"    \">
       <thead>
         <tr>
            <th>#</th>
         
             <th>Produccion</th>
             <th>Regla Semantica</th>
           
             
             
         </tr>
       </thead>
       
       
       `;
    for (let index = 0; index < ReporteGramatica_1.ReporteGramatica.Lista.length; index++) {
        var alv = ReporteGramatica_1.ReporteGramatica.Lista.length[index];
        reporte_gramatical += "<tr>";
        reporte_gramatical += `   <th><strong>   ${index} </strong></th>`;
        reporte_gramatical += `   <th><strong>   ${ReporteGramatica_1.ReporteGramatica.Lista[index].produccion} </strong></th>`;
        reporte_gramatical += `   <th><strong>   ${ReporteGramatica_1.ReporteGramatica.Lista[index].regla_semantica} </strong></th>  `;
        reporte_gramatical += "</tr>";
    }
    reporte_gramatical += "</table>";
    document.getElementById("gramatical").innerHTML = reporte_gramatical;
};
function graph_Simbols(tabla) {
    simbolos = "";
    simbolos += `  <h1 style="color: beige;">Tabla de SIMBOLOS</h1>   
    
    <table style=" color: beige;float=right;"    \">
    <thead>
      <tr>
      <th>#</th>
       
          <th>ID</th>
          <th>Tipo</th>
          <th>tipo</th>
          <th>linea</th>
          <th>columna</th> 
          <th>Valor</th> 
          
          
      </tr>
    </thead>
    
    
    `;
    for (let index = 0; index < tabla.length; index++) {
        var alv = tabla[index];
        simbolos += "<tr>";
        simbolos += `   <th><strong>   ${index} </strong></th>`;
        simbolos += `   <th><strong>   ${alv.id} </strong></th>`;
        simbolos += `   <th><strong>   ${alv.tipo} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.tipo2} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.line} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.column} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.valor} </strong></th>  `;
        simbolos += "</tr>";
    }
    simbolos += "</table>";
}
function graph_err(tabla) {
    err = "";
    err += `  <h1 style="color: beige;">Tabla de errores</h1>   
    
    <table style=" color: beige;float=right;"    \">
    <thead>
      <tr>
      <th>#</th>
       
  
          <th>Tipo</th>
          <th>Descripcion</th>
          <th>linea</th>
          <th>columna</th> 
      
          
          
      </tr>
    </thead>
    
    
    `;
    for (let index = 0; index < Error_1.Error.Errores.length; index++) {
        var alv = Error_1.Error.Errores[index];
        err += "<tr>";
        err += `   <th><strong>   ${index} </strong></th>`;
        err += `   <th><strong>   ${alv.tipo} </strong></th>`;
        err += `   <th><strong>   ${alv.descripcion} </strong></th>  `;
        err += `   <th><strong>   ${alv.line} </strong></th>  `;
        err += `   <th><strong>   ${alv.column} </strong></th>  `;
        err += "</tr>";
    }
    for (let index = 0; index < tabla.length; index++) {
        var alv = tabla[index];
        err += "<tr>";
        err += `   <th><strong>   ${index} </strong></th>`;
        err += `   <th><strong>   ${alv.tipo} </strong></th>`;
        err += `   <th><strong>   ${alv.descripcion} </strong></th>  `;
        err += `   <th><strong>   ${alv.line} </strong></th>  `;
        err += `   <th><strong>   ${alv.column} </strong></th>  `;
        err += "</tr>";
    }
    err += "</table>";
}
global.Enviar = function entrada() {
    //  ReporteGramatica.Lista= null
    const entrada = editor.getValue();
    const tree = parser.parse(entrada);
    const tabla = new Table_1.Table(null);
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof DeclaracionMetodo_1.DeclaracionMetodo) {
                m.execute(tabla, tree);
            }
        }
        catch (error) {
            console.log(error);
        }
        // console.log(tree.consola);
    });
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof DeclaracionArray_1.DeclaracionArray) {
                m.execute(tabla, tree);
            }
        }
        catch (error) {
            console.log(error);
        }
        // console.log(tree.consola);
    });
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof Declaracion_1.Declaracion) {
                m.execute(tabla, tree);
            }
        }
        catch (error) {
            console.log(error);
        }
        // console.log(tree.consola);
    });
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof Main_1.Main) {
                const res = m.execute(tabla, tree);
            }
            //  console.log(tree);
            var texto = "";
            for (const key in tree.consola) {
                texto += tree.consola[key];
            }
            editor2.setValue(texto);
        }
        catch (error) {
            console.log(error);
        }
    });
    /**
    *
    *
    *
    */
    /**
     * Generacion del reporte de la tabla de simbolos
     *
     *
    */
    graph_Simbols(tree.Variables);
    graph_err(tree.excepciones);
    var init = new NodoAST_1.NodoAST("RAIZ");
    var instr = new NodoAST_1.NodoAST("INSTRUCCIONES");
    tree.instrucciones.map((m) => {
        instr.agregarHijo(m.getNodo());
    });
    init.agregarHijo(instr);
    graficas = Grafica_1.getDot(init);
    /**
     * Generacion del reporte de la tabla de simbolos
     *
     * */
    // console.log(ReporteGramatica.Lista)
};
global.Traducir = function entrada() {
    const entrada = editor.getValue();
    const tree = parser.parse(entrada);
    const tabla = new Table_1.Table(null);
    tree.instrucciones.map((m) => {
        try {
            const res = m.execute(tabla, tree);
        }
        catch (error) {
            console.log(error);
        }
    });
    var C3D = `/*------ENCABEZADO------*/
#include <stdio.h>
#include <math.h>

float heap[16384];
float stack[16394];
float P;
float H;\n`;
    var C3D2 = ``;
    tabla.tempStorage.push(tabla.getTemporal());
    tabla.tempStorage.push(tabla.getTemporal());
    tabla.tempStorage.push(tabla.getTemporal());
    tree.instrucciones.map((m) => {
        try {
            C3D2 += m.get3D(tabla, tree);
        }
        catch (error) {
            console.log(error);
        }
    });
    C3D += `float `;
    for (let i = 0; i < tabla.tempStorage.length; i++) {
        C3D += `${tabla.tempStorage[i]}, `;
    }
    C3D = C3D.substring(0, C3D.length - 2);
    C3D += `;\n\n`;
    C3D += `/*------Funcion Imprimir------*/
void print() {
    t1 = P+1;
    t2 = stack[(int)t1];
    L1:
        t3 = heap[(int)t2];
        if(t3 == -1) goto L0;
        printf("%c", (char)t3);
        t2 = t2+1;
        goto L1;
    L0:
        return;
}\n\n`;
    C3D += `/*------Funcion Main------*/
 void main() {
    P = 0; H = 0;\n\n`;
    C3D += C3D2;
    C3D += `\nreturn;\n}`;
    editor2.setValue(C3D);
    //console.log("12"=="12");
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Abstract/NodoAST":5,"../Gramatica/grammar.js":32,"../Instrucciones/Declaracion":39,"../Instrucciones/DeclaracionArray":40,"../Instrucciones/DeclaracionMetodo":41,"../Instrucciones/Main":49,"../Simbols/Error":59,"../Simbols/ReporteGramatica":61,"../Simbols/Table":63,"./Grafica":57}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Excepcion_1 = require("../other/Excepcion");
class Error {
    constructor(tipo, descripcion, line, column) {
        Error.Errores.push(new Excepcion_1.Excepcion(tipo, descripcion, line, column));
    }
}
exports.Error = Error;
Error.Errores = [];

},{"../other/Excepcion":65}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodoReporteGramatica {
    constructor(produccion, regla_semantica) {
        this.produccion = produccion;
        this.regla_semantica = regla_semantica;
    }
}
exports.NodoReporteGramatica = NodoReporteGramatica;

},{}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodoReporteGramatica_1 = require("./NodoReporteGramatica");
class ReporteGramatica {
    constructor(produccion, regla_semantica) {
        ReporteGramatica.Lista.push(new NodoReporteGramatica_1.NodoReporteGramatica(produccion, regla_semantica));
    }
}
exports.ReporteGramatica = ReporteGramatica;
ReporteGramatica.Lista = [];

},{"./NodoReporteGramatica":60}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Simbolo {
    constructor(tipo, id, valor, tipo2, line, column) {
        this.tipo = tipo;
        this.id = id;
        this.valor = valor;
        this.line = line;
        this.column = column;
        this.tipo2 = tipo2;
    }
}
exports.Simbolo = Simbolo;

},{}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Table {
    constructor(Anterior) {
        this.Anterior = Anterior;
        this.Variables = new Map();
        this.temporal = 0;
        this.etiqueta = 0;
        this.heap = 0;
        this.stack = 0;
        this.tempStorage = [];
        this.ambito = false; // false = global, true = local
        this.listaReturn = [];
        this.sizeActual = [];
        this.bandera = 0;
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
    getTemporal() {
        return "t" + ++this.temporal;
    }
    getTemporalActual() {
        return "t" + this.temporal;
    }
    getHeap() {
        return this.heap++;
    }
    getStack() {
        return this.stack++;
    }
    setStack(value) {
        this.stack = value;
    }
    getEtiqueta() {
        return "L" + ++this.etiqueta;
    }
    getEtiquetaActual() {
        return "L" + this.etiqueta;
    }
    setTrue(etiqueta) {
        this.trueL = etiqueta;
    }
    getTrue() {
        return "L" + this.trueL;
    }
    setFalse(etiqueta) {
        this.falseL = etiqueta;
    }
    getFalse() {
        return "L" + this.falseL;
    }
    AgregarTemporal(temp) {
        this.tempStorage.push(temp);
    }
    QuitarTemporal(temp) {
        let index = this.tempStorage.indexOf(temp);
        this.tempStorage.splice(index, 1);
    }
}
exports.Table = Table;

},{}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
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

},{"./LinkedListNode":68}],68:[function(require,module,exports){
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

},{"./LinkedList":67}]},{},[58]);
