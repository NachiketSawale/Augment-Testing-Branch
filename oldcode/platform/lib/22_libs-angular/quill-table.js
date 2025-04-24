(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require('Quill'));
	else if(typeof define === 'function' && define.amd)
		define(['Quill'], factory);
	else if(typeof exports === 'object')
		exports['quillTable'] = factory(require('Quill'));
	else
		root['quillTable'] = factory(root['Quill']);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_8__) {
	return /******/ (function(modules) { // webpackBootstrap
		/******/ 	// The module cache
		/******/ 	var installedModules = {};
		/******/
		/******/ 	// The require function
		/******/ 	function __webpack_require__(moduleId) {
			/******/
			/******/ 		// Check if module is in cache
			/******/ 		if(installedModules[moduleId]) {
				/******/ 			return installedModules[moduleId].exports;
				/******/ 		}
			/******/ 		// Create a new module (and put it into the cache)
			/******/ 		var module = installedModules[moduleId] = {
				/******/ 			i: moduleId,
				/******/ 			l: false,
				/******/ 			exports: {}
				/******/ 		};
			/******/
			/******/ 		// Execute the module function
			/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
			/******/
			/******/ 		// Flag the module as loaded
			/******/ 		module.l = true;
			/******/
			/******/ 		// Return the exports of the module
			/******/ 		return module.exports;
			/******/ 	}
		/******/
		/******/
		/******/ 	// expose the modules object (__webpack_modules__)
		/******/ 	__webpack_require__.m = modules;
		/******/
		/******/ 	// expose the module cache
		/******/ 	__webpack_require__.c = installedModules;
		/******/
		/******/ 	// define getter function for harmony exports
		/******/ 	__webpack_require__.d = function(exports, name, getter) {
			/******/ 		if(!__webpack_require__.o(exports, name)) {
				/******/ 			Object.defineProperty(exports, name, {
					/******/ 				configurable: false,
					/******/ 				enumerable: true,
					/******/ 				get: getter
					/******/ 			});
				/******/ 		}
			/******/ 	};
		/******/
		/******/ 	// getDefaultExport function for compatibility with non-harmony modules
		/******/ 	__webpack_require__.n = function(module) {
			/******/ 		var getter = module && module.__esModule ?
			/******/ 			function getDefault() { return module['default']; } :
			/******/ 			function getModuleExports() { return module; };
			/******/ 		__webpack_require__.d(getter, 'a', getter);
			/******/ 		return getter;
			/******/ 	};
		/******/
		/******/ 	// Object.prototype.hasOwnProperty.call
		/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
		/******/
		/******/ 	// __webpack_public_path__
		/******/ 	__webpack_require__.p = '';
		/******/
		/******/ 	// Load entry module and return exports
		/******/ 	return __webpack_require__(__webpack_require__.s = 69);
		/******/ })
	/************************************************************************/
	/******/ ([
		/* 0 */
		/***/ (function(module, exports) {

			var core = module.exports = { version: '2.6.12' };
			if (typeof __e === 'number') __e = core; // eslint-disable-line no-undef


			/***/ }),
		/* 1 */
		/***/ (function(module, exports) {

			// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
			var global = module.exports = typeof window !== 'undefined' && window.Math == Math
				? window : typeof self !== 'undefined' && self.Math == Math ? self
				// eslint-disable-next-line no-new-func
					: Function('return this')();
			if (typeof __g === 'number') __g = global; // eslint-disable-line no-undef


			/***/ }),
		/* 2 */
		/***/ (function(module, exports, __webpack_require__) {

			var global = __webpack_require__(1);
			var core = __webpack_require__(0);
			var ctx = __webpack_require__(55);
			var hide = __webpack_require__(9);
			var has = __webpack_require__(5);
			var PROTOTYPE = 'prototype';

			var $export = function (type, name, source) {
				var IS_FORCED = type & $export.F;
				var IS_GLOBAL = type & $export.G;
				var IS_STATIC = type & $export.S;
				var IS_PROTO = type & $export.P;
				var IS_BIND = type & $export.B;
				var IS_WRAP = type & $export.W;
				var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
				var expProto = exports[PROTOTYPE];
				var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
				var key, own, out;
				if (IS_GLOBAL) source = name;
				for (key in source) {
					// contains in native
					own = !IS_FORCED && target && target[key] !== undefined;
					if (own && has(exports, key)) continue;
					// export native or passed
					out = own ? target[key] : source[key];
					// prevent global pollution for namespaces
					exports[key] = IS_GLOBAL && typeof target[key] !== 'function' ? source[key]
					// bind timers to global for call from export context
						: IS_BIND && own ? ctx(out, global)
						// wrap global constructors for prevent change them in library
							: IS_WRAP && target[key] == out ? (function (C) {
								var F = function (a, b, c) {
									if (this instanceof C) {
										switch (arguments.length) {
											case 0: return new C();
											case 1: return new C(a);
											case 2: return new C(a, b);
										} return new C(a, b, c);
									} return C.apply(this, arguments);
								};
								F[PROTOTYPE] = C[PROTOTYPE];
								return F;
								// make static versions for prototype methods
							})(out) : IS_PROTO && typeof out === 'function' ? ctx(Function.call, out) : out;
					// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
					if (IS_PROTO) {
						(exports.virtual || (exports.virtual = {}))[key] = out;
						// export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
						if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
					}
				}
			};
			// type bitmap
			$export.F = 1;   // forced
			$export.G = 2;   // global
			$export.S = 4;   // static
			$export.P = 8;   // proto
			$export.B = 16;  // bind
			$export.W = 32;  // wrap
			$export.U = 64;  // safe
			$export.R = 128; // real proto method for `library`
			module.exports = $export;


			/***/ }),
		/* 3 */
		/***/ (function(module, exports, __webpack_require__) {

			var anObject = __webpack_require__(14);
			var IE8_DOM_DEFINE = __webpack_require__(56);
			var toPrimitive = __webpack_require__(27);
			var dP = Object.defineProperty;

			exports.f = __webpack_require__(4) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
				anObject(O);
				P = toPrimitive(P, true);
				anObject(Attributes);
				if (IE8_DOM_DEFINE) try {
					return dP(O, P, Attributes);
				} catch (e) { /* empty */ }
				if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
				if ('value' in Attributes) O[P] = Attributes.value;
				return O;
			};


			/***/ }),
		/* 4 */
		/***/ (function(module, exports, __webpack_require__) {

			// Thank's IE8 for his funny defineProperty
			module.exports = !__webpack_require__(11)(function () {
				return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
			});


			/***/ }),
		/* 5 */
		/***/ (function(module, exports) {

			var hasOwnProperty = {}.hasOwnProperty;
			module.exports = function (it, key) {
				return hasOwnProperty.call(it, key);
			};


			/***/ }),
		/* 6 */
		/***/ (function(module, exports, __webpack_require__) {

			// to indexed object, toObject with fallback for non-array-like ES3 strings
			var IObject = __webpack_require__(97);
			var defined = __webpack_require__(18);
			module.exports = function (it) {
				return IObject(defined(it));
			};


			/***/ }),
		/* 7 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			exports.__esModule = true;

			exports.default = function (instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function');
				}
			};

			/***/ }),
		/* 8 */
		/***/ (function(module, exports) {

			module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

			/***/ }),
		/* 9 */
		/***/ (function(module, exports, __webpack_require__) {

			var dP = __webpack_require__(3);
			var createDesc = __webpack_require__(17);
			module.exports = __webpack_require__(4) ? function (object, key, value) {
				return dP.f(object, key, createDesc(1, value));
			} : function (object, key, value) {
				object[key] = value;
				return object;
			};


			/***/ }),
		/* 10 */
		/***/ (function(module, exports) {

			module.exports = function (it) {
				return typeof it === 'object' ? it !== null : typeof it === 'function';
			};


			/***/ }),
		/* 11 */
		/***/ (function(module, exports) {

			module.exports = function (exec) {
				try {
					return !!exec();
				} catch (e) {
					return true;
				}
			};


			/***/ }),
		/* 12 */
		/***/ (function(module, exports, __webpack_require__) {

			var store = __webpack_require__(30)('wks');
			var uid = __webpack_require__(20);
			var Symbol = __webpack_require__(1).Symbol;
			var USE_SYMBOL = typeof Symbol === 'function';

			var $exports = module.exports = function (name) {
				return store[name] || (store[name] =
                    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
			};

			$exports.store = store;


			/***/ }),
		/* 13 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var keys = __webpack_require__(43);
			var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

			var toStr = Object.prototype.toString;
			var concat = Array.prototype.concat;
			var origDefineProperty = Object.defineProperty;

			var isFunction = function (fn) {
				return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
			};

			var arePropertyDescriptorsSupported = function () {
				var obj = {};
				try {
					origDefineProperty(obj, 'x', { enumerable: false, value: obj });
					// eslint-disable-next-line no-unused-vars, no-restricted-syntax
					for (var _ in obj) { // jscs:ignore disallowUnusedVariables
						return false;
					}
					return obj.x === obj;
				} catch (e) { /* this is IE 8. */
					return false;
				}
			};
			var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

			var defineProperty = function (object, name, value, predicate) {
				if (name in object && (!isFunction(predicate) || !predicate())) {
					return;
				}
				if (supportsDescriptors) {
					origDefineProperty(object, name, {
						configurable: true,
						enumerable: false,
						value: value,
						writable: true
					});
				} else {
					object[name] = value;
				}
			};

			var defineProperties = function (object, map) {
				var predicates = arguments.length > 2 ? arguments[2] : {};
				var props = keys(map);
				if (hasSymbols) {
					props = concat.call(props, Object.getOwnPropertySymbols(map));
				}
				for (var i = 0; i < props.length; i += 1) {
					defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
				}
			};

			defineProperties.supportsDescriptors = !!supportsDescriptors;

			module.exports = defineProperties;


			/***/ }),
		/* 14 */
		/***/ (function(module, exports, __webpack_require__) {

			var isObject = __webpack_require__(10);
			module.exports = function (it) {
				if (!isObject(it)) throw TypeError(it + ' is not an object!');
				return it;
			};


			/***/ }),
		/* 15 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = { 'default': __webpack_require__(89), __esModule: true };

			/***/ }),
		/* 16 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			exports.__esModule = true;

			var _defineProperty = __webpack_require__(54);

			var _defineProperty2 = _interopRequireDefault(_defineProperty);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			exports.default = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ('value' in descriptor) descriptor.writable = true;
						(0, _defineProperty2.default)(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			/***/ }),
		/* 17 */
		/***/ (function(module, exports) {

			module.exports = function (bitmap, value) {
				return {
					enumerable: !(bitmap & 1),
					configurable: !(bitmap & 2),
					writable: !(bitmap & 4),
					value: value
				};
			};


			/***/ }),
		/* 18 */
		/***/ (function(module, exports) {

			// 7.2.1 RequireObjectCoercible(argument)
			module.exports = function (it) {
				if (it == undefined) throw TypeError('Can\'t call method on  ' + it);
				return it;
			};


			/***/ }),
		/* 19 */
		/***/ (function(module, exports) {

			module.exports = true;


			/***/ }),
		/* 20 */
		/***/ (function(module, exports) {

			var id = 0;
			var px = Math.random();
			module.exports = function (key) {
				return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
			};


			/***/ }),
		/* 21 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			exports.__esModule = true;

			var _typeof2 = __webpack_require__(60);

			var _typeof3 = _interopRequireDefault(_typeof2);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			exports.default = function (self, call) {
				if (!self) {
					throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
				}

				return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === 'object' || typeof call === 'function') ? call : self;
			};

			/***/ }),
		/* 22 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			exports.__esModule = true;

			var _getPrototypeOf = __webpack_require__(15);

			var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

			var _getOwnPropertyDescriptor = __webpack_require__(116);

			var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			exports.default = function get(object, property, receiver) {
				if (object === null) object = Function.prototype;
				var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

				if (desc === undefined) {
					var parent = (0, _getPrototypeOf2.default)(object);

					if (parent === null) {
						return undefined;
					} else {
						return get(parent, property, receiver);
					}
				} else if ('value' in desc) {
					return desc.value;
				} else {
					var getter = desc.get;

					if (getter === undefined) {
						return undefined;
					}

					return getter.call(receiver);
				}
			};

			/***/ }),
		/* 23 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			exports.__esModule = true;

			var _setPrototypeOf = __webpack_require__(119);

			var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

			var _create = __webpack_require__(123);

			var _create2 = _interopRequireDefault(_create);

			var _typeof2 = __webpack_require__(60);

			var _typeof3 = _interopRequireDefault(_typeof2);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			exports.default = function (subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError('Super expression must either be null or a function, not ' + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
				}

				subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
					constructor: {
						value: subClass,
						enumerable: false,
						writable: true,
						configurable: true
					}
				});
				if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
			};

			/***/ }),
		/* 24 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			Object.defineProperty(exports, '__esModule', {
				value: true
			});

			var _getPrototypeOf = __webpack_require__(15);

			var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

			var _classCallCheck2 = __webpack_require__(7);

			var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

			var _createClass2 = __webpack_require__(16);

			var _createClass3 = _interopRequireDefault(_createClass2);

			var _possibleConstructorReturn2 = __webpack_require__(21);

			var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

			var _get2 = __webpack_require__(22);

			var _get3 = _interopRequireDefault(_get2);

			var _inherits2 = __webpack_require__(23);

			var _inherits3 = _interopRequireDefault(_inherits2);

			var _quill = __webpack_require__(8);

			var _quill2 = _interopRequireDefault(_quill);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			var Container = _quill2.default.import('blots/container');
			var Block = _quill2.default.import('blots/block');
			var BlockEmbed = _quill2.default.import('blots/block/embed');
			var Parchment = _quill2.default.import('parchment');

			var ContainBlot = (function (_Container) {
				(0, _inherits3.default)(ContainBlot, _Container);

				function ContainBlot() {
					(0, _classCallCheck3.default)(this, ContainBlot);
					return (0, _possibleConstructorReturn3.default)(this, (ContainBlot.__proto__ || (0, _getPrototypeOf2.default)(ContainBlot)).apply(this, arguments));
				}

				(0, _createClass3.default)(ContainBlot, [{
					key: 'formats',
					value: function formats(domNode) {
						if (domNode) {
							return domNode.tagName;
						}
						return this.domNode.tagName;
					}
				}], [{
					key: 'create',
					value: function create(value) {
						return (0, _get3.default)(ContainBlot.__proto__ || (0, _getPrototypeOf2.default)(ContainBlot), 'create', this).call(this, value);
					}
				}]);
				return ContainBlot;
			})(Container);

			ContainBlot.blotName = 'contain';
			ContainBlot.tagName = 'contain';
			ContainBlot.scope = Parchment.Scope.BLOCK_BLOT;
			ContainBlot.defaultChild = 'block';
			ContainBlot.allowedChildren = [Block, BlockEmbed, Container];

			exports.default = ContainBlot;

			/***/ }),
		/* 25 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var implementation = __webpack_require__(76);

			module.exports = Function.prototype.bind || implementation;


			/***/ }),
		/* 26 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var bind = __webpack_require__(25);
			var GetIntrinsic = __webpack_require__(46);

			var $apply = GetIntrinsic('%Function.prototype.apply%');
			var $call = GetIntrinsic('%Function.prototype.call%');
			var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

			var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
			var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
			var $max = GetIntrinsic('%Math.max%');

			if ($defineProperty) {
				try {
					$defineProperty({}, 'a', { value: 1 });
				} catch (e) {
					// IE 8 has a broken defineProperty
					$defineProperty = null;
				}
			}

			module.exports = function callBind(originalFunction) {
				var func = $reflectApply(bind, $call, arguments);
				if ($gOPD && $defineProperty) {
					var desc = $gOPD(func, 'length');
					if (desc.configurable) {
						// original length, plus the receiver, minus any additional arguments (after the receiver)
						$defineProperty(
							func,
							'length',
							{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
						);
					}
				}
				return func;
			};

			var applyBind = function applyBind() {
				return $reflectApply(bind, $apply, arguments);
			};

			if ($defineProperty) {
				$defineProperty(module.exports, 'apply', { value: applyBind });
			} else {
				module.exports.apply = applyBind;
			}


			/***/ }),
		/* 27 */
		/***/ (function(module, exports, __webpack_require__) {

			// 7.1.1 ToPrimitive(input [, PreferredType])
			var isObject = __webpack_require__(10);
			// instead of the ES6 spec version, we didn't implement @@toPrimitive case
			// and the second argument - flag - preferred type is a string
			module.exports = function (it, S) {
				if (!isObject(it)) return it;
				var fn, val;
				if (S && typeof (fn = it.toString) === 'function' && !isObject(val = fn.call(it))) return val;
				if (typeof (fn = it.valueOf) === 'function' && !isObject(val = fn.call(it))) return val;
				if (!S && typeof (fn = it.toString) === 'function' && !isObject(val = fn.call(it))) return val;
				throw TypeError('Can\'t convert object to primitive value');
			};


			/***/ }),
		/* 28 */
		/***/ (function(module, exports, __webpack_require__) {

			// 7.1.13 ToObject(argument)
			var defined = __webpack_require__(18);
			module.exports = function (it) {
				return Object(defined(it));
			};


			/***/ }),
		/* 29 */
		/***/ (function(module, exports, __webpack_require__) {

			var shared = __webpack_require__(30)('keys');
			var uid = __webpack_require__(20);
			module.exports = function (key) {
				return shared[key] || (shared[key] = uid(key));
			};


			/***/ }),
		/* 30 */
		/***/ (function(module, exports, __webpack_require__) {

			var core = __webpack_require__(0);
			var global = __webpack_require__(1);
			var SHARED = '__core-js_shared__';
			var store = global[SHARED] || (global[SHARED] = {});

			(module.exports = function (key, value) {
				return store[key] || (store[key] = value !== undefined ? value : {});
			})('versions', []).push({
				version: core.version,
				mode: __webpack_require__(19) ? 'pure' : 'global',
				copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
			});


			/***/ }),
		/* 31 */
		/***/ (function(module, exports) {

			// 7.1.4 ToInteger
			var ceil = Math.ceil;
			var floor = Math.floor;
			module.exports = function (it) {
				return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
			};


			/***/ }),
		/* 32 */
		/***/ (function(module, exports) {

			module.exports = {};


			/***/ }),
		/* 33 */
		/***/ (function(module, exports, __webpack_require__) {

			// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
			var anObject = __webpack_require__(14);
			var dPs = __webpack_require__(96);
			var enumBugKeys = __webpack_require__(35);
			var IE_PROTO = __webpack_require__(29)('IE_PROTO');
			var Empty = function () { /* empty */ };
			var PROTOTYPE = 'prototype';

			// Create object with fake `null` prototype: use iframe Object with cleared prototype
			var createDict = function () {
				// Thrash, waste and sodomy: IE GC bug
				var iframe = __webpack_require__(57)('iframe');
				var i = enumBugKeys.length;
				var lt = '<';
				var gt = '>';
				var iframeDocument;
				iframe.style.display = 'none';
				__webpack_require__(101).appendChild(iframe);
				iframe.src = 'javascript:'; // eslint-disable-line no-script-url
				// createDict = iframe.contentWindow.Object;
				// html.removeChild(iframe);
				iframeDocument = iframe.contentWindow.document;
				iframeDocument.open();
				iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
				iframeDocument.close();
				createDict = iframeDocument.F;
				while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
				return createDict();
			};

			module.exports = Object.create || function create(O, Properties) {
				var result;
				if (O !== null) {
					Empty[PROTOTYPE] = anObject(O);
					result = new Empty();
					Empty[PROTOTYPE] = null;
					// add "__proto__" for Object.getPrototypeOf polyfill
					result[IE_PROTO] = O;
				} else result = createDict();
				return Properties === undefined ? result : dPs(result, Properties);
			};


			/***/ }),
		/* 34 */
		/***/ (function(module, exports, __webpack_require__) {

			// 19.1.2.14 / 15.2.3.14 Object.keys(O)
			var $keys = __webpack_require__(63);
			var enumBugKeys = __webpack_require__(35);

			module.exports = Object.keys || function keys(O) {
				return $keys(O, enumBugKeys);
			};


			/***/ }),
		/* 35 */
		/***/ (function(module, exports) {

			// IE 8- don't enum bug keys
			module.exports = (
				'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
			).split(',');


			/***/ }),
		/* 36 */
		/***/ (function(module, exports, __webpack_require__) {

			var def = __webpack_require__(3).f;
			var has = __webpack_require__(5);
			var TAG = __webpack_require__(12)('toStringTag');

			module.exports = function (it, tag, stat) {
				if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
			};


			/***/ }),
		/* 37 */
		/***/ (function(module, exports, __webpack_require__) {

			exports.f = __webpack_require__(12);


			/***/ }),
		/* 38 */
		/***/ (function(module, exports, __webpack_require__) {

			var global = __webpack_require__(1);
			var core = __webpack_require__(0);
			var LIBRARY = __webpack_require__(19);
			var wksExt = __webpack_require__(37);
			var defineProperty = __webpack_require__(3).f;
			module.exports = function (name) {
				var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
				if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
			};


			/***/ }),
		/* 39 */
		/***/ (function(module, exports) {

			exports.f = {}.propertyIsEnumerable;


			/***/ }),
		/* 40 */
		/***/ (function(module, exports, __webpack_require__) {

			var pIE = __webpack_require__(39);
			var createDesc = __webpack_require__(17);
			var toIObject = __webpack_require__(6);
			var toPrimitive = __webpack_require__(27);
			var has = __webpack_require__(5);
			var IE8_DOM_DEFINE = __webpack_require__(56);
			var gOPD = Object.getOwnPropertyDescriptor;

			exports.f = __webpack_require__(4) ? gOPD : function getOwnPropertyDescriptor(O, P) {
				O = toIObject(O);
				P = toPrimitive(P, true);
				if (IE8_DOM_DEFINE) try {
					return gOPD(O, P);
				} catch (e) { /* empty */ }
				if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
			};


			/***/ }),
		/* 41 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			Object.defineProperty(exports, '__esModule', {
				value: true
			});

			var _parseInt = __webpack_require__(126);

			var _parseInt2 = _interopRequireDefault(_parseInt);

			var _classCallCheck2 = __webpack_require__(7);

			var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

			var _createClass2 = __webpack_require__(16);

			var _createClass3 = _interopRequireDefault(_createClass2);

			var _quill = __webpack_require__(8);

			var _quill2 = _interopRequireDefault(_quill);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			var Parchment = _quill2.default.import('parchment');
			var Container = _quill2.default.import('blots/container');
			var Scroll = _quill2.default.import('blots/scroll');

			var TableTrick = (function () {
				function TableTrick() {
					(0, _classCallCheck3.default)(this, TableTrick);
				}

				function parseColor(color) {
					let arr=[]; color.replace(/[\d+\.]+/g, function(v) { arr.push(parseFloat(v)); });
					return '#' + arr.slice(0, 3).map(toHex).join('');
				}

				function toHex(int) {
					let hex = int.toString(16);
					return hex.length == 1 ? '0' + hex : hex;
				}

				function setToolbarBtnVisibility(isVisible) {
					let tableEle = document.querySelector('.ql-table');
					if (tableEle) {
						let toolbar = tableEle.parentElement;
						if (toolbar) {
							toolbar.style.display = isVisible ? 'inline-block' : 'none';
						}
					}
				}

				(0, _createClass3.default)(TableTrick, null, [{
					key: 'random_id',
					value: function random_id() {
						return Math.random().toString(36).slice(2);
					}
				}, {
					key: 'find_td',
					value: function find_td(quill) {
						if(quill.getSelection())
						{
							let leaf = quill.getLeaf(quill.getSelection()['index']);
							let blot = leaf[0];
							for (; blot && blot.statics.blotName !== 'td';) {
								blot = blot.parent;
							}
							return blot; // return TD or NULL
						}

					}
				}, {
					key: 'find_tr',
					value: function find_tr(quill) {
						if(quill.getSelection())
						{
							let leaf = quill.getLeaf(quill.getSelection()['index']);
							let blot = leaf[0];
							for (; blot && blot.statics.blotName !== 'tr';) {
							blot = blot.parent;
							}
							return blot; // return TD or NULL
						}

					}
				}, {
					key: 'find_table',
					value: function find_table(quill) {
						if(quill.getSelection())
						{
							let leaf = quill.getLeaf(quill.getSelection()['index']);
							let blot = leaf[0];
							for (; blot && (blot.statics && blot.statics.blotName !== 'table');) {
								blot = blot.parent;
							}
							return blot; // return TD or NULL
						}
					}
				}, {
					key: 'is_toolbar_visible',
					value: function is_toolbar_visible(quill) {
						return quill.container.contains(this.overlay);
					}
				}, {
					key: 'table_handler',
					value: function table_handler(value, quill) {
						if (value.includes('newtable_')) {
							let node = null;
							let sizes = value.split('_');
							let row_count = (0, _parseInt2.default)(sizes[1]);
							let col_count = (0, _parseInt2.default)(sizes[2]);
							let table_id = TableTrick.random_id();
							let tableWidthValue;
							let data = quill.options.modules.table.scope.customSettings;
							let unit;
							if (data.user.useSettings) {
								unit = data.user.unitOfMeasurement;
								tableWidthValue = data.user.documentWidth;
							}
							else {
								unit = data.system.unitOfMeasurement;
								tableWidthValue = data.system.documentWidth;
							}
							let tableWidth = quill.options.modules.table.platformWysiwygEditorSettingsService.convertInRequiredUnit('px', unit, tableWidthValue);
							let table = Parchment.create('table', { id: table_id, width: tableWidth.toFixed(2) });
							let td_width = tableWidth / col_count;
							let firstNode;
							for (var ri = 0; ri < row_count; ri++) {
								let row_id = TableTrick.random_id();
								let tr = Parchment.create('tr', row_id);
								table.appendChild(tr);
								for (var ci = 0; ci < col_count; ci++) {
									let cell_id = TableTrick.random_id();
									value =
										{
											tableId: table_id,
											rowId: row_id,
											cellId: cell_id,
											width:td_width
										};
									let td = Parchment.create('td', value);
									tr.appendChild(td);
									let p = Parchment.create('block');
									td.appendChild(p);
									let br = Parchment.create('break');
									p.appendChild(br);
									node = p;
									if(ri===0 && ci===0)
									{
										firstNode=td.domNode;
									}
								}
							}
							let leaf = quill.getLeaf(quill.getSelection()['index']);
							let blot = leaf[0];
							let top_branch = null;

							for (; blot !== null && !(blot instanceof Container || blot instanceof Scroll);) {
								top_branch = blot;
								blot = blot.parent;
							}
							blot.insertBefore(table, top_branch);
							TableTrick.set_table_cursor_position(firstNode);
							TableTrick.commit_action(quill);
							return node;
						}  else {
							let _table_id3 = TableTrick.random_id();
							let _table3 = Parchment.create('table', { id: _table_id3 });

							let _leaf = quill.getLeaf(quill.getSelection()['index']);
							let _blot = _leaf[0];
							let _top_branch = null;
							for (; _blot !== null && !(_blot instanceof Container || _blot instanceof Scroll);) {
								_top_branch = _blot;
								_blot = _blot.parent;
							}
							_blot.insertBefore(_table3, _top_branch);
							TableTrick.set_table_cursor_position(firstNode);
							TableTrick.commit_action(quill);
							return _table3;
						}
					}
				},
				{
					key: 'get_cell_properties',
					value: function get_cell_properties(quill) {
						let table = TableTrick.find_table(quill);
						let data = quill.options.modules.table.scope.customSettings;
						let unit;
						if (data.user.useSettings) {
							unit = data.user.unitOfMeasurement;
						}
						else {
							unit = data.system.unitOfMeasurement;
						}
						let selectedNodes = [];
						let tableCells = Array.from(table.domNode.querySelectorAll('td, th'));
						let lastNodeRange = window.getSelection();
						let lastNode = lastNodeRange.focusNode.parentNode.closest('td');
						let lastNodeindex = tableCells.indexOf(lastNode);
						let startingNode = lastNodeRange.anchorNode.parentNode.closest('td');
						let startNodeindex = tableCells.indexOf(startingNode);
						if (startNodeindex === lastNodeindex) {
							if(startNodeindex!==-1)
							{
								selectedNodes.push(tableCells[startNodeindex]);
							}
							else
							{
								selectedNodes=[...tableCells];
							}
						} else if(startNodeindex>=0 && lastNodeindex === -1)
						{
							let startWithNode = Math.min(startNodeindex, tableCells.length);
							let endwithNode = Math.max(startNodeindex, tableCells.length);
							selectedNodes = tableCells.slice(startWithNode, endwithNode);
						}
						else {
							let startWithNode = Math.min(startNodeindex, lastNodeindex);
							let endwithNode = Math.max(startNodeindex, lastNodeindex);
							selectedNodes = tableCells.slice(startWithNode, endwithNode);
						}

						if (selectedNodes.length && selectedNodes[0]) {
							let td = selectedNodes[0];
							let tr = selectedNodes[0].parentNode;
							if (tr.children.length > 0) {
								let cellProperties = {
									verticalPadding: td.style.paddingTop !== '' ? td.style.paddingTop : '5mm',
									horizontalPadding: td.style.paddingLeft !== '' ? td.style.paddingLeft : '5mm',
									cellHeight: tr.style.height ? tr.style.height : Math.round(tr.clientHeight * 0.264583),
									borderStyle: td.style.borderStyle !== '' ? td.style.borderStyle : 'solid',
									vertical: 'top',
									selectedNodes: [],
								};

								let unequal_value = !selectedNodes.every((node) => node.style.width === selectedNodes[0].style.width);
								if (!unequal_value) {
									let width = td.style.width ? td.style.width : td.clientWidth;
									let oldValue = width.slice(-2);
									let oldUnit = quill.options.modules.table.platformWysiwygEditorSettingsService.getUnitValue(oldValue);
									let value = parseFloat(width);
									let cellWidth = quill.options.modules.table.platformWysiwygEditorSettingsService.convertInRequiredUnit(unit, oldUnit ? oldUnit : 'px', value);
									cellProperties.cellWidth = cellWidth;
								} else {
									cellProperties.cellWidth = null;
								}

								let unequal_borderWidth_value = !selectedNodes.every((node) => node.style.borderWidth === selectedNodes[0].style.borderWidth);
								if (!unequal_borderWidth_value) {
									cellProperties.borderWidth = td.style.borderWidth ? td.style.borderWidth : '1pt';
								} else {
									cellProperties.borderWidth = null;
								}

								let unequal_borderColor_value = !selectedNodes.every((node) => node.style.borderColor === selectedNodes[0].style.borderColor);
								if (!unequal_borderColor_value) {
									cellProperties.borderColor = td.style.borderColor !== '' ? parseInt(parseColor(td.style.borderColor).substring(1), 16) : '';
								} else {
									cellProperties.borderColor = null;
								}

								let unequal_textAlign_value = !selectedNodes.every((node) => node.style.textAlign === selectedNodes[0].style.textAlign);
								if (!unequal_textAlign_value) {
									cellProperties.horizontal = td.style.textAlign !== '' ? td.style.textAlign : tr.style.textAlign !== '' ? tr.style.textAlign : 'left';
								} else {
									cellProperties.horizontal = null;
								}

								if (selectedNodes.length !== 0) {
									Array.prototype.push.apply(cellProperties.selectedNodes, selectedNodes);
								}
								return cellProperties;
							}
						}
					},
				},
				{
					key: 'set_cell_properties',
					value: function set_cell_properties(quill, table, td, tr, cellProperties) {
						let data = quill.options.modules.table.scope.customSettings;
						let unit;
						if (data.user.useSettings) {
							unit = data.user.unitOfMeasurement;
						}
						else {
							unit = data.system.unitOfMeasurement;
						}
						let selectedCells = Object.assign(cellProperties.selectedNodes);
						if (selectedCells.length !== 0) {
							for (let i = 0; i < selectedCells.length; i++) {
								let tr = selectedCells[i].parentNode;
								let td = selectedCells[i];
								let count = 0;
								let cell_index = 0;
								for (let i = 0; i < tr.children.length; i++) {
									let child = tr.children[i];
									if (child.attributes['cell_id'].value === td.attributes['cell_id'].value) {
										cell_index = count;
									}
									count++;
								}

								// let color_the_cells=TableTrick.get_required_cells(neighbouring_cells,selectedCells);

								if (cellProperties.cellWidth) {

									for (let i = 0; i < tr.parentNode.children.length; i++) {
										let width = quill.options.modules.table.platformWysiwygEditorSettingsService.convertInRequiredUnit('px', unit, cellProperties.cellWidth);
										tr.parentNode.children[i].children[cell_index].style.width = width + 'px';
										tr.parentNode.children[i].children[cell_index].style.maxWidth = width + 'px';
										tr.parentNode.children[i].children[cell_index].style.minWidth = width + 'px';
									}
									// tr.parentNode.children.forEach(function (tr) {
									// 	tr.domNode.children[cell_index].style.width = cellProperties.cellWidth + 'mm';
									// 	tr.domNode.children[cell_index].style.maxWidth = cellProperties.cellWidth + 'mm';
									// 	tr.domNode.children[cell_index].style.minWidth = cellProperties.cellWidth + 'mm';
									// });
								}
								if (cellProperties.borderStyle) {
									td.style.borderStyle = cellProperties.borderStyle;
								}
								if (cellProperties.borderColor) {
									let neighbouring_cells = TableTrick.get_neighbouring_cells(selectedCells);
									TableTrick.updateCellBorders(table, neighbouring_cells.bottomCells, 'borderTopColor', cellProperties.borderColor, selectedCells);
									TableTrick.updateCellBorders(table, neighbouring_cells.topCells, 'borderBottomColor', cellProperties.borderColor, selectedCells);
									TableTrick.updateCellBorders(table, neighbouring_cells.leftCells, 'borderRightColor', cellProperties.borderColor, selectedCells);
									TableTrick.updateCellBorders(table, neighbouring_cells.rightCells, 'borderLeftColor', cellProperties.borderColor, selectedCells);
									td.style.borderColor = cellProperties.borderColor;
								}
								if (cellProperties.borderWidth) {
									td.style.borderWidth = cellProperties.borderWidth + 'pt';
								}
								if (cellProperties.horizontal) {
									$('[cell_id="' + td.getAttribute('cell_id') + '"]*').css('text-align', '');
									$('[cell_id="' + td.getAttribute('cell_id') + '"]*')
										.contents()
										.css('text-align', '');
									td.style.textAlign = cellProperties.horizontal;
								}
								if (cellProperties.vertical) {
									$('[cell_id="' + td.getAttribute('cell_id') + '"]*').css('vertical-align', '');
									$('[cell_id="' + td.getAttribute('cell_id') + '"]*')
										.contents()
										.css('vertical-align', '');
									td.style.verticalAlign = cellProperties.vertical;
								}
								let totalWidth = 0;
								for (let i = 0; i < tr.children.length; i++) {
									let child = tr.children[i];
									totalWidth += parseInt(child.style.width);
								}
								if (totalWidth > 0) {
									table.domNode.style.width = totalWidth + 'px';
								}
							}
						}
					}
				},
					{
						key: 'get_neighbouring_cells',
						value: function get_neighbouring_cells(selectedCells) {
							let rowIndices = [];
							let cellIndices = [];
							selectedCells.forEach(function (cell) {
								let rowIndex = cell.parentNode.rowIndex;
								let cellIndex = cell.cellIndex;

								rowIndices.push(rowIndex);
								cellIndices.push(cellIndex);
							});

							let table = document.querySelector('table');
							let topCells = [];
							let bottomCells = [];
							let leftCells = [];
							let rightCells = [];
							let selectedCells_length=selectedCells.length;

							selectedCells.forEach(function (cell, index) {
								let rowIndex = rowIndices[index];
								let cellIndex = cellIndices[index];

								if (rowIndex !== 0) {
									let topCell = table.children[rowIndex - 1].children[cellIndex];
									topCells.push(topCell);
								}

								if (rowIndex !== table.children.length && rowIndex+1!==table.children.length) {
									let bottomCell = table.children[rowIndex + 1].children[cellIndex];
									let check=selectedCells.includes(bottomCell);
									if(!check)
									{
										bottomCells.push(bottomCell);
									}
								}

								let leftCell = selectedCells[0].previousElementSibling;
								if (leftCell !== null) {
									leftCells.push(leftCell);
								}
								if( selectedCells_length-1 === index)
								{
									let rightCell = selectedCells[index].nextElementSibling;
									if (rightCell !== null) {
										rightCells.push(rightCell);
									}
								}

							});

							let neighbouring_cells = {
								topCells: topCells,
								bottomCells: bottomCells,
								leftCells: leftCells,
								rightCells: rightCells,
							};
							return neighbouring_cells;
						},
					},
					{
						key: 'updateCellBorders',
						value: function updateCellBorders(table, cells, styleProperty, borderColor, selectedCells) {
							let count = cells.length;
							if (cells && cells.length !== 0) {
								let tableChildNodes = table.domNode.childNodes;

								for (let j = 0; j < tableChildNodes.length; j++) {
									let rowChildNodes = tableChildNodes[j].childNodes;

									for (let r = 0; r < rowChildNodes.length; r++) {
										let cellNode = rowChildNodes[r];
										if (count === 0) {
											break;
										} else {
											for (let s = 0; s < cells.length; s++) {
												let neighbouringCell = cells[s];
												if (cellNode.attributes['cell_id'].value === neighbouringCell.attributes['cell_id'].value) {
													cellNode.style[styleProperty] = borderColor;
													count--;
												}
											}
										}
									}
								}
							}
						},
					},
				{
					key: 'show_vertical_border',
					value: function show_vertical_border(quill) {
						let table = TableTrick.find_table(quill);
						if (table) {
							for (let tr of table.domNode.children) {
								for(let col of tr.children) {
									col.style.borderStyle = 'solid';
									col.style.borderWidth = '0px 1px';
								}
							}
						}
					}
				},
				{
					key: 'show_horizontal_border',
					value: function show_horizontal_border(quill) {
						let table = TableTrick.find_table(quill);
						if (table) {
							for (let tr of table.domNode.children) {
								for(let col of tr.children) {
									col.style.borderStyle = 'solid';
									col.style.borderWidth = '1px 0px';
								}
							}
						}
					}
				},
				{
					key: 'show_all_border',
					value: function show_all_border(quill) {
						let table = TableTrick.find_table(quill);
						if (table) {
							for (let tr of table.domNode.children) {
								for(let col of tr.children) {
									col.style.borderStyle = 'solid';
									col.style.borderWidth = '1px';
								}
							}
						}
					}
				},
				{
					key: 'show_no_border',
					value: function show_vertical_border(quill) {
						let table = TableTrick.find_table(quill);
						if (table) {
							for (let tr of table.domNode.children) {
								for(let col of tr.children) {
									col.style.borderWidth = '0px';
								}
							}
						}
					}
				},
				{
					key: 'show_overlay',
					value: function show_overlay(container, position) {
						let table = TableTrick.find_table(container.__quill);
						if(table) {
							let width = Math.round(table.domNode.clientWidth * 0.264583);
							setToolbarBtnVisibility(false);
							container.appendChild(this.overlay);
							let toolbar = document.getElementsByClassName('ql-table-toolbar');
							if(toolbar && toolbar.length) {
								toolbar[0].style.top = (position.top + container.scrollTop - 35) + 'px';
								toolbar[0].style.left = position.left + 'px';
								toolbar[0].style.marginLeft = position.marginLeft + 'px';
								let scrollMargin = (container.__quill.root.scrollHeight > container.__quill.root.clientHeight) ? 18 : 0;
								toolbar[0].style.width=width + 'mm';
								// toolbar[0].style.marginRight = position.marginRight + scrollMargin + 'px';
							}
						}
					}
				},
				{
					key: 'hide_overlay',
					value: function hide_overlay(container) {
						setToolbarBtnVisibility(true);
						let dropdowns = document.querySelectorAll('[id*=dropdown-content-]');
						dropdowns.forEach(function(element) {
							element.classList.remove('show');
						});
						if(this.overlay && this.overlay.parentNode === container) {
							container.removeChild(this.overlay);
						}

					}
				},
				{
					key: 'hide_after_delete',
					value: function hide_after_delete(quill) {
						let table = TableTrick.find_table(quill);
						let td = TableTrick.find_td(quill);

						if (table === undefined) {
							TableTrick.hide_overlay(quill.container);
						}
						else {
							let tr=td.parent;
							if(tr.domNode.children.length===0)
							{
								TableTrick.hide_overlay(quill.container);
							}
						}
					}
				},
				{
					key: 'update_toolbar',
					value: function update_toolbar(width) {
						setToolbarBtnVisibility(false);
						let toolbar = document.getElementsByClassName('ql-table-toolbar');
						if(toolbar && toolbar.length) {
							toolbar[0].style.width=width + 'mm';
						}
					}
				},
				{
					key: 'delete_row',
					value: function delete_row(quill) {
						let tr = TableTrick.find_tr(quill);
						let table = TableTrick.find_table(quill);
						if (tr) {
							if(table.domNode.children.length===1)
							{
								TableTrick.delete_table(quill);
								TableTrick.hide_overlay(quill.container);
							}
							else{
								tr.domNode.remove();
							}
						}
					}
				},
				{
					key: 'hide_all_borders',
					value: function delete_row(quill) {
						let tr = TableTrick.find_tr(quill);
						if (tr) {
							tr.domNode.remove();
						}
					}
				},
				{
					key: 'delete_column',
					value: function delete_column(quill) {
						let _td = TableTrick.find_td(quill);
						if (_td && _td.domNode) {
							let _table = _td.parent.parent;
							let _tr = _td.parent;
							let count = 0;
							let cell_index = 0;
							for (let i = 0; i < _tr.domNode.children.length; i++) {
								let child = _tr.domNode.children[i];
								if (child.attributes['cell_id'].value === _td.domNode.attributes['cell_id'].value)
								{
									cell_index = count;
								}
								count++;
							}

							_table.children.forEach(function (tr) {
								if (tr.domNode.children.length > cell_index) {
									tr.domNode.children[cell_index].remove();
								}
							});
						}
					}
				},
				{
					key: 'delete_table',
					value: function delete_table(quill) {
						let tr = TableTrick.find_tr(quill);
						if (tr && tr.parent) {
							tr.parent.domNode.remove();
						}
					}
				},
				{
					key: 'set_table_cursor_position',
					value: function set_table_cursor_position(node) {
						if(node)
						{
							let range = document.createRange();
							let sel = window.getSelection();

							range.setStart(node, 0);
							range.collapse(true);

							sel.removeAllRanges();
							sel.addRange(range);
						}
					}
				},
				{
					key: 'get_table_properties',
					value: function get_table_properties(quill) {
						let table = TableTrick.find_table(quill);
						let tableProperties = {
							tableWidth: Math.round(table.domNode.clientWidth * 0.264583),
							tableHeight: Math.round(table.domNode.clientHeight * 0.264583),
							borderStyle: table.domNode.style.borderStyle !== '' ? table.domNode.style.borderStyle : 'none',
							borderWidth: table.domNode.style.borderWidth ? table.domNode.style.borderWidth : '1pt',
							borderColor: table.domNode.style.borderColor !== '' ? parseInt(parseColor(table.domNode.style.borderColor).substring(1), 16) : '',
							backgroundColor: table.domNode.style.backgroundColor !== '' ? parseInt(parseColor(table.domNode.style.backgroundColor).substring(1), 16) : '',
							horizontal: table.domNode.style.textAlign !== '' ? table.domNode.style.textAlign : 'left'
						};

						return tableProperties;
					}
				},
				{
					key: 'set_table_properties',
					value: function set_table_properties(table, tableProperties) {
						if (table) {

							if (tableProperties.tableHeight) {
								table.domNode.style.height = TableTrick.mmTopx(tableProperties.tableHeight) + 'px';
							}
							if (tableProperties.tableWidth) {
								/*let tableWidth = TableTrick.mmTopx(tableProperties.tableWidth);
								if (tableWidth < parseInt(table.domNode.style.width)) {
									let difference = parseInt(table.domNode.style.width) - tableWidth;
									table.children.forEach(function (tr) {
										let colCount = tr.domNode.children.length;
										let colDifference = Math.round(difference/colCount);
										tr.children.forEach(function (td) {
											if (td.domNode.style.minWidth) {
												td.domNode.style.minWidth = (parseInt(td.domNode.style.minWidth) - colDifference*0.264583) + 'mm';
											}
											if (td.domNode.style.maxWidth) {
												td.domNode.style.maxWidth = (parseInt(td.domNode.style.maxWidth) - colDifference*0.264583) + 'mm';
											}
										});
									});
								}
								else {
									let difference =  tableWidth - parseInt(table.domNode.style.width);
									table.children.forEach(function (tr) {
										let colCount = tr.domNode.children.length;
										let colDifference = Math.round(difference/colCount);
										tr.children.forEach(function (td) {
											if (td.domNode.style.minWidth) {
												td.domNode.style.minWidth = (parseInt(td.domNode.style.minWidth) + colDifference*0.264583) + 'mm';
											}
											if (td.domNode.style.maxWidth) {
												td.domNode.style.maxWidth = (parseInt(td.domNode.style.maxWidth) + colDifference*0.264583) + 'mm';
											}
										});
									});
								}*/

								table.domNode.style.width = TableTrick.mmTopx(tableProperties.tableWidth) + 'px';
							}
							if (tableProperties.borderStyle) {
								table.domNode.style.borderStyle = tableProperties.borderStyle;
							}
							if (tableProperties.borderColor) {
								table.domNode.style.borderColor = tableProperties.borderColor;
							}
							if (tableProperties.borderWidth) {
								table.domNode.style.borderWidth = tableProperties.borderWidth + 'pt';
							}
							if (tableProperties.backgroundColor) {
								table.domNode.style.backgroundColor = tableProperties.backgroundColor;
							}
							if (tableProperties.horizontal) {
								$('[table_id="' + table.domNode.getAttribute('table_id') + '"]*').css('text-align', '');
								$('[table_id="' + table.domNode.getAttribute('table_id') + '"]*').contents().css('text-align', '');
								table.domNode.style.textAlign = tableProperties.horizontal;
								table.children.forEach(function (tr) {
									tr.domNode.style.textAlign = tableProperties.horizontal;
								});
							}
						}
					}
				},
				{
					key: 'add_col_after',
					value: function add_col_after(quill) {
						let _td = TableTrick.find_td(quill);
						if (_td && _td.domNode) {
							let _tr = _td.parent;
							let count = 0;
							let cell_index = 0;
							for (let i = 0; i < _tr.domNode.children.length; i++) {
								let child = _tr.domNode.children[i];
								if (child.attributes['cell_id'].value === _td.domNode.attributes['cell_id'].value)
								{
									cell_index = count;
								}
								count++;
							}
							let _table = _td.parent.parent;
							let _table_id = _table.domNode.getAttribute('table_id');
							_table.children.forEach(function (tr) {
								let row_id = tr.domNode.getAttribute('row_id');
								let cell_id = TableTrick.random_id();
								let value =
									{
										tableId: _table_id,
										rowId: row_id,
										cellId: cell_id
									};
								let td = Parchment.create('td', value);
								if(tr.children.length === 1 ||  cell_index  === tr.domNode.children.length - 1) {
									tr.appendChild(td);
								}
								else {
									let col = tr.domNode.children[cell_index + 1];
									if(col) {
										tr.domNode.insertBefore(td.domNode, col);
									}
								}
							});
						}
					}
				},
				{
					key: 'add_col_before',
					value: function add_col_before(quill) {
						let _td = TableTrick.find_td(quill);
						if (_td && _td.domNode) {
							let _tr = _td.parent;
							let count = 0;
							let cell_index = 0;
							for (let i = 0; i < _tr.domNode.children.length; i++) {
								let child = _tr.domNode.children[i];
								if (child.attributes['cell_id'].value === _td.domNode.attributes['cell_id'].value)
								{
									cell_index = count;
								}
								count++;
							}
							let _table = _td.parent.parent;
							let _table_id = _table.domNode.getAttribute('table_id');
							_table.children.forEach(function (tr) {
								let row_id = tr.domNode.getAttribute('row_id');
								let cell_id = TableTrick.random_id();
								let value =
									{
										tableId: _table_id,
										rowId: row_id,
										cellId: cell_id
									};
								let td = Parchment.create('td', value);
								let col = tr.domNode.children[cell_index];
								if(col) {
									tr.domNode.insertBefore(td.domNode, col);
								}
							});
						}
					}
				},
				{
					key: 'add_row_before',
					value: function add_row_before(quill) {
						let tr = TableTrick.find_tr(quill);
						if (tr) {
							let _col_count = tr.children.length;
							let _table2 = tr.parent;
							let new_row = tr.clone();
							let _table_id2 = _table2.domNode.getAttribute('table_id');
							let _row_id = TableTrick.random_id();
							new_row.domNode.setAttribute('row_id', _row_id);
							for (var i = _col_count - 1; i >= 0; i--) {
								let _cell_id = TableTrick.random_id();
								let value =
									{
										tableId: _table_id2,
										rowId: _row_id,
										cellId: _cell_id
									};
								let _td3 = Parchment.create('td', value);
								new_row.appendChild(_td3);
								let _p = Parchment.create('block');
								_td3.appendChild(_p);
								let _br = Parchment.create('break');
								_p.appendChild(_br);
							}
							tr.parent.insertBefore(new_row, tr);
						}
					}
				},
				{
					key: 'add_row_after',
					value: function add_row_after(quill) {
						let tr = TableTrick.find_tr(quill);
						if (tr) {
							let _col_count = tr.children.length;
							let _table2 = tr.parent;
							let new_row = tr.clone();
							let _table_id2 = _table2.domNode.getAttribute('table_id');
							let _row_id = TableTrick.random_id();
							new_row.domNode.setAttribute('row_id', _row_id);
							for (var i = _col_count - 1; i >= 0; i--) {
								let _cell_id = TableTrick.random_id();
								let value =
									{
										tableId: _table_id2,
										rowId: _row_id,
										cellId: _cell_id
									};
								let _td3 = Parchment.create('td', value);
								new_row.appendChild(_td3);
								let _p = Parchment.create('block');
								_td3.appendChild(_p);
								let _br = Parchment.create('break');
								_p.appendChild(_br);
							}
							if (!tr.next) {
								_table2.appendChild(new_row);
							}
							else {
								tr.parent.insertBefore(new_row, tr.next);
							}
						}
					}
				},
				{
					key: 'mmTopx',
					value: function mmTopx(mm) {
						let div = document.createElement('div');
						div.style.display = 'block';
						div.style.height = '100mm';
						document.body.appendChild(div);
						let convert = div.offsetHeight * mm / 100;
						div.parentNode.removeChild(div);
						return convert;
					}
				},
				{
					key: 'commit_action',
					value: function commit_action(quill) {
						let range = quill.getSelection();
						let index = range ? range.index : 0;

						quill.insertText(0, ' ', 'user');
						quill.deleteText(0, 1);

						quill.setSelection(index);
						quill.focus();
					}
				}
				]);
				return TableTrick;
			})();

			exports.default = TableTrick;

			/***/ }),
		/* 42 */
		/***/ (function(module, exports, __webpack_require__) {

			var objectKeys = __webpack_require__(43);
			var isArguments = __webpack_require__(73);
			var is = __webpack_require__(78);
			var isRegex = __webpack_require__(80);
			var flags = __webpack_require__(81);
			var isDate = __webpack_require__(83);

			var getTime = Date.prototype.getTime;

			function deepEqual(actual, expected, options) {
				var opts = options || {};

				// 7.1. All identical values are equivalent, as determined by ===.
				if (opts.strict ? is(actual, expected) : actual === expected) {
					return true;
				}

				// 7.3. Other pairs that do not both pass typeof value == 'object', equivalence is determined by ==.
				if (!actual || !expected || (typeof actual !== 'object' && typeof expected !== 'object')) {
					return opts.strict ? is(actual, expected) : actual == expected;
				}

				/*
   * 7.4. For all other Object pairs, including Array objects, equivalence is
   * determined by having the same number of owned properties (as verified
   * with Object.prototype.hasOwnProperty.call), the same set of keys
   * (although not necessarily the same order), equivalent values for every
   * corresponding key, and an identical 'prototype' property. Note: this
   * accounts for both named and indexed properties on Arrays.
   */
				// eslint-disable-next-line no-use-before-define
				return objEquiv(actual, expected, opts);
			}

			function isUndefinedOrNull(value) {
				return value === null || value === undefined;
			}

			function isBuffer(x) {
				if (!x || typeof x !== 'object' || typeof x.length !== 'number') {
					return false;
				}
				if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
					return false;
				}
				if (x.length > 0 && typeof x[0] !== 'number') {
					return false;
				}
				return true;
			}

			function objEquiv(a, b, opts) {
				/* eslint max-statements: [2, 50] */
				var i, key;
				if (typeof a !== typeof b) { return false; }
				if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) { return false; }

				// an identical 'prototype' property.
				if (a.prototype !== b.prototype) { return false; }

				if (isArguments(a) !== isArguments(b)) { return false; }

				var aIsRegex = isRegex(a);
				var bIsRegex = isRegex(b);
				if (aIsRegex !== bIsRegex) { return false; }
				if (aIsRegex || bIsRegex) {
					return a.source === b.source && flags(a) === flags(b);
				}

				if (isDate(a) && isDate(b)) {
					return getTime.call(a) === getTime.call(b);
				}

				var aIsBuffer = isBuffer(a);
				var bIsBuffer = isBuffer(b);
				if (aIsBuffer !== bIsBuffer) { return false; }
				if (aIsBuffer || bIsBuffer) { // && would work too, because both are true or both false here
					if (a.length !== b.length) { return false; }
					for (i = 0; i < a.length; i++) {
						if (a[i] !== b[i]) { return false; }
					}
					return true;
				}

				if (typeof a !== typeof b) { return false; }

				try {
					var ka = objectKeys(a);
					var kb = objectKeys(b);
				} catch (e) { // happens when one is a string literal and the other isn't
					return false;
				}
				// having the same number of owned properties (keys incorporates hasOwnProperty)
				if (ka.length !== kb.length) { return false; }

				// the same set of keys (although not necessarily the same order),
				ka.sort();
				kb.sort();
				// ~~~cheap key test
				for (i = ka.length - 1; i >= 0; i--) {
					if (ka[i] != kb[i]) { return false; }
				}
				// equivalent values for every corresponding key, and ~~~possibly expensive deep test
				for (i = ka.length - 1; i >= 0; i--) {
					key = ka[i];
					if (!deepEqual(a[key], b[key], opts)) { return false; }
				}

				return true;
			}

			module.exports = deepEqual;


			/***/ }),
		/* 43 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var slice = Array.prototype.slice;
			var isArgs = __webpack_require__(44);

			var origKeys = Object.keys;
			var keysShim = origKeys ? function keys(o) { return origKeys(o); } : __webpack_require__(72);

			var originalKeys = Object.keys;

			keysShim.shim = function shimObjectKeys() {
				if (Object.keys) {
					var keysWorksWithArguments = (function () {
						// Safari 5.0 bug
						var args = Object.keys(arguments);
						return args && args.length === arguments.length;
					})(1, 2);
					if (!keysWorksWithArguments) {
						Object.keys = function keys(object) { // eslint-disable-line func-name-matching
							if (isArgs(object)) {
								return originalKeys(slice.call(object));
							}
							return originalKeys(object);
						};
					}
				} else {
					Object.keys = keysShim;
				}
				return Object.keys || keysShim;
			};

			module.exports = keysShim;


			/***/ }),
		/* 44 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var toStr = Object.prototype.toString;

			module.exports = function isArguments(value) {
				var str = toStr.call(value);
				var isArgs = str === '[object Arguments]';
				if (!isArgs) {
					isArgs = str !== '[object Array]' &&
                        value !== null &&
                        typeof value === 'object' &&
                        typeof value.length === 'number' &&
                        value.length >= 0 &&
                        toStr.call(value.callee) === '[object Function]';
				}
				return isArgs;
			};


			/***/ }),
		/* 45 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var GetIntrinsic = __webpack_require__(46);

			var callBind = __webpack_require__(26);

			var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

			module.exports = function callBoundIntrinsic(name, allowMissing) {
				var intrinsic = GetIntrinsic(name, !!allowMissing);
				if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
					return callBind(intrinsic);
				}
				return intrinsic;
			};


			/***/ }),
		/* 46 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var undefined;

			var $SyntaxError = SyntaxError;
			var $Function = Function;
			var $TypeError = TypeError;

			// eslint-disable-next-line consistent-return
			var getEvalledConstructor = function (expressionSyntax) {
				try {
					return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
				} catch (e) {}
			};

			var $gOPD = Object.getOwnPropertyDescriptor;
			if ($gOPD) {
				try {
					$gOPD({}, '');
				} catch (e) {
					$gOPD = null; // this is IE 8, which has a broken gOPD
				}
			}

			var throwTypeError = function () {
				throw new $TypeError();
			};
			var ThrowTypeError = $gOPD
				? (function () {
					try {
						// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
						arguments.callee; // IE 8 does not throw here
						return throwTypeError;
					} catch (calleeThrows) {
						try {
							// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
							return $gOPD(arguments, 'callee').get;
						} catch (gOPDthrows) {
							return throwTypeError;
						}
					}
				})()
				: throwTypeError;

			var hasSymbols = __webpack_require__(47)();

			var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

			var needsEval = {};

			var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

			var INTRINSICS = {
				'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
				'%Array%': Array,
				'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
				'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
				'%AsyncFromSyncIteratorPrototype%': undefined,
				'%AsyncFunction%': needsEval,
				'%AsyncGenerator%': needsEval,
				'%AsyncGeneratorFunction%': needsEval,
				'%AsyncIteratorPrototype%': needsEval,
				'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
				'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
				'%Boolean%': Boolean,
				'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
				'%Date%': Date,
				'%decodeURI%': decodeURI,
				'%decodeURIComponent%': decodeURIComponent,
				'%encodeURI%': encodeURI,
				'%encodeURIComponent%': encodeURIComponent,
				'%Error%': Error,
				'%eval%': eval, // eslint-disable-line no-eval
				'%EvalError%': EvalError,
				'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
				'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
				'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
				'%Function%': $Function,
				'%GeneratorFunction%': needsEval,
				'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
				'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
				'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
				'%isFinite%': isFinite,
				'%isNaN%': isNaN,
				'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
				'%JSON%': typeof JSON === 'object' ? JSON : undefined,
				'%Map%': typeof Map === 'undefined' ? undefined : Map,
				'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
				'%Math%': Math,
				'%Number%': Number,
				'%Object%': Object,
				'%parseFloat%': parseFloat,
				'%parseInt%': parseInt,
				'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
				'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
				'%RangeError%': RangeError,
				'%ReferenceError%': ReferenceError,
				'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
				'%RegExp%': RegExp,
				'%Set%': typeof Set === 'undefined' ? undefined : Set,
				'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
				'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
				'%String%': String,
				'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
				'%Symbol%': hasSymbols ? Symbol : undefined,
				'%SyntaxError%': $SyntaxError,
				'%ThrowTypeError%': ThrowTypeError,
				'%TypedArray%': TypedArray,
				'%TypeError%': $TypeError,
				'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
				'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
				'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
				'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
				'%URIError%': URIError,
				'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
				'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
				'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
			};

			var doEval = function doEval(name) {
				var value;
				if (name === '%AsyncFunction%') {
					value = getEvalledConstructor('async function () {}');
				} else if (name === '%GeneratorFunction%') {
					value = getEvalledConstructor('function* () {}');
				} else if (name === '%AsyncGeneratorFunction%') {
					value = getEvalledConstructor('async function* () {}');
				} else if (name === '%AsyncGenerator%') {
					var fn = doEval('%AsyncGeneratorFunction%');
					if (fn) {
						value = fn.prototype;
					}
				} else if (name === '%AsyncIteratorPrototype%') {
					var gen = doEval('%AsyncGenerator%');
					if (gen) {
						value = getProto(gen.prototype);
					}
				}

				INTRINSICS[name] = value;

				return value;
			};

			var LEGACY_ALIASES = {
				'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
				'%ArrayPrototype%': ['Array', 'prototype'],
				'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
				'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
				'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
				'%ArrayProto_values%': ['Array', 'prototype', 'values'],
				'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
				'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
				'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
				'%BooleanPrototype%': ['Boolean', 'prototype'],
				'%DataViewPrototype%': ['DataView', 'prototype'],
				'%DatePrototype%': ['Date', 'prototype'],
				'%ErrorPrototype%': ['Error', 'prototype'],
				'%EvalErrorPrototype%': ['EvalError', 'prototype'],
				'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
				'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
				'%FunctionPrototype%': ['Function', 'prototype'],
				'%Generator%': ['GeneratorFunction', 'prototype'],
				'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
				'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
				'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
				'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
				'%JSONParse%': ['JSON', 'parse'],
				'%JSONStringify%': ['JSON', 'stringify'],
				'%MapPrototype%': ['Map', 'prototype'],
				'%NumberPrototype%': ['Number', 'prototype'],
				'%ObjectPrototype%': ['Object', 'prototype'],
				'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
				'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
				'%PromisePrototype%': ['Promise', 'prototype'],
				'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
				'%Promise_all%': ['Promise', 'all'],
				'%Promise_reject%': ['Promise', 'reject'],
				'%Promise_resolve%': ['Promise', 'resolve'],
				'%RangeErrorPrototype%': ['RangeError', 'prototype'],
				'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
				'%RegExpPrototype%': ['RegExp', 'prototype'],
				'%SetPrototype%': ['Set', 'prototype'],
				'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
				'%StringPrototype%': ['String', 'prototype'],
				'%SymbolPrototype%': ['Symbol', 'prototype'],
				'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
				'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
				'%TypeErrorPrototype%': ['TypeError', 'prototype'],
				'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
				'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
				'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
				'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
				'%URIErrorPrototype%': ['URIError', 'prototype'],
				'%WeakMapPrototype%': ['WeakMap', 'prototype'],
				'%WeakSetPrototype%': ['WeakSet', 'prototype']
			};

			var bind = __webpack_require__(25);
			var hasOwn = __webpack_require__(77);
			var $concat = bind.call(Function.call, Array.prototype.concat);
			var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
			var $replace = bind.call(Function.call, String.prototype.replace);
			var $strSlice = bind.call(Function.call, String.prototype.slice);

			/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
			var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
			var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
			var stringToPath = function stringToPath(string) {
				var first = $strSlice(string, 0, 1);
				var last = $strSlice(string, -1);
				if (first === '%' && last !== '%') {
					throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
				} else if (last === '%' && first !== '%') {
					throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
				}
				var result = [];
				$replace(string, rePropName, function (match, number, quote, subString) {
					result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
				});
				return result;
			};
			/* end adaptation */

			var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
				var intrinsicName = name;
				var alias;
				if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
					alias = LEGACY_ALIASES[intrinsicName];
					intrinsicName = '%' + alias[0] + '%';
				}

				if (hasOwn(INTRINSICS, intrinsicName)) {
					var value = INTRINSICS[intrinsicName];
					if (value === needsEval) {
						value = doEval(intrinsicName);
					}
					if (typeof value === 'undefined' && !allowMissing) {
						throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
					}

					return {
						alias: alias,
						name: intrinsicName,
						value: value
					};
				}

				throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
			};

			module.exports = function GetIntrinsic(name, allowMissing) {
				if (typeof name !== 'string' || name.length === 0) {
					throw new $TypeError('intrinsic name must be a non-empty string');
				}
				if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
					throw new $TypeError('"allowMissing" argument must be a boolean');
				}

				var parts = stringToPath(name);
				var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

				var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
				var intrinsicRealName = intrinsic.name;
				var value = intrinsic.value;
				var skipFurtherCaching = false;

				var alias = intrinsic.alias;
				if (alias) {
					intrinsicBaseName = alias[0];
					$spliceApply(parts, $concat([0, 1], alias));
				}

				for (var i = 1, isOwn = true; i < parts.length; i += 1) {
					var part = parts[i];
					var first = $strSlice(part, 0, 1);
					var last = $strSlice(part, -1);
					if (
						(
							(first === '"' || first === '\'' || first === '`')
                            || (last === '"' || last === '\'' || last === '`')
						)
                        && first !== last
					) {
						throw new $SyntaxError('property names with quotes must have matching quotes');
					}
					if (part === 'constructor' || !isOwn) {
						skipFurtherCaching = true;
					}

					intrinsicBaseName += '.' + part;
					intrinsicRealName = '%' + intrinsicBaseName + '%';

					if (hasOwn(INTRINSICS, intrinsicRealName)) {
						value = INTRINSICS[intrinsicRealName];
					} else if (value != null) {
						if (!(part in value)) {
							if (!allowMissing) {
								throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
							}
							return void undefined;
						}
						if ($gOPD && (i + 1) >= parts.length) {
							var desc = $gOPD(value, part);
							isOwn = !!desc;

							// By convention, when a data property is converted to an accessor
							// property to emulate a data property that does not suffer from
							// the override mistake, that accessor's getter is marked with
							// an `originalValue` property. Here, when we detect this, we
							// uphold the illusion by pretending to see that original data
							// property, i.e., returning the value rather than the getter
							// itself.
							if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
								value = desc.get;
							} else {
								value = value[part];
							}
						} else {
							isOwn = hasOwn(value, part);
							value = value[part];
						}

						if (isOwn && !skipFurtherCaching) {
							INTRINSICS[intrinsicRealName] = value;
						}
					}
				}
				return value;
			};


			/***/ }),
		/* 47 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';
			/* WEBPACK VAR INJECTION */(function(global) {

				var origSymbol = global.Symbol;
				var hasSymbolSham = __webpack_require__(75);

				module.exports = function hasNativeSymbols() {
					if (typeof origSymbol !== 'function') { return false; }
					if (typeof Symbol !== 'function') { return false; }
					if (typeof origSymbol('foo') !== 'symbol') { return false; }
					if (typeof Symbol('bar') !== 'symbol') { return false; }

					return hasSymbolSham();
				};

				/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(74)));

			/***/ }),
		/* 48 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var numberIsNaN = function (value) {
				return value !== value;
			};

			module.exports = function is(a, b) {
				if (a === 0 && b === 0) {
					return 1 / a === 1 / b;
				}
				if (a === b) {
					return true;
				}
				if (numberIsNaN(a) && numberIsNaN(b)) {
					return true;
				}
				return false;
			};



			/***/ }),
		/* 49 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var implementation = __webpack_require__(48);

			module.exports = function getPolyfill() {
				return typeof Object.is === 'function' ? Object.is : implementation;
			};


			/***/ }),
		/* 50 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var $Object = Object;
			var $TypeError = TypeError;

			module.exports = function flags() {
				if (this != null && this !== $Object(this)) {
					throw new $TypeError('RegExp.prototype.flags getter called on non-object');
				}
				var result = '';
				if (this.global) {
					result += 'g';
				}
				if (this.ignoreCase) {
					result += 'i';
				}
				if (this.multiline) {
					result += 'm';
				}
				if (this.dotAll) {
					result += 's';
				}
				if (this.unicode) {
					result += 'u';
				}
				if (this.sticky) {
					result += 'y';
				}
				return result;
			};


			/***/ }),
		/* 51 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var implementation = __webpack_require__(50);

			var supportsDescriptors = __webpack_require__(13).supportsDescriptors;
			var $gOPD = Object.getOwnPropertyDescriptor;
			var $TypeError = TypeError;

			module.exports = function getPolyfill() {
				if (!supportsDescriptors) {
					throw new $TypeError('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
				}
				if ((/a/mig).flags === 'gim') {
					var descriptor = $gOPD(RegExp.prototype, 'flags');
					if (descriptor && typeof descriptor.get === 'function' && typeof (/a/).dotAll === 'boolean') {
						return descriptor.get;
					}
				}
				return implementation;
			};


			/***/ }),
		/* 52 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var hasOwn = Object.prototype.hasOwnProperty;
			var toStr = Object.prototype.toString;
			var defineProperty = Object.defineProperty;
			var gOPD = Object.getOwnPropertyDescriptor;

			var isArray = function isArray(arr) {
				if (typeof Array.isArray === 'function') {
					return Array.isArray(arr);
				}

				return toStr.call(arr) === '[object Array]';
			};

			var isPlainObject = function isPlainObject(obj) {
				if (!obj || toStr.call(obj) !== '[object Object]') {
					return false;
				}

				var hasOwnConstructor = hasOwn.call(obj, 'constructor');
				var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
				// Not own constructor property must be Object
				if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
					return false;
				}

				// Own properties are enumerated firstly, so to speed up,
				// if last one is own, then all properties are own.
				var key;
				for (key in obj) { /**/ }

				return typeof key === 'undefined' || hasOwn.call(obj, key);
			};

			// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
			var setProperty = function setProperty(target, options) {
				if (defineProperty && options.name === '__proto__') {
					defineProperty(target, options.name, {
						enumerable: true,
						configurable: true,
						value: options.newValue,
						writable: true
					});
				} else {
					target[options.name] = options.newValue;
				}
			};

			// Return undefined instead of __proto__ if '__proto__' is not an own property
			var getProperty = function getProperty(obj, name) {
				if (name === '__proto__') {
					if (!hasOwn.call(obj, name)) {
						return void 0;
					} else if (gOPD) {
						// In early versions of node, obj['__proto__'] is buggy when obj has
						// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
						return gOPD(obj, name).value;
					}
				}

				return obj[name];
			};

			module.exports = function extend() {
				var options, name, src, copy, copyIsArray, clone;
				var target = arguments[0];
				var i = 1;
				var length = arguments.length;
				var deep = false;

				// Handle a deep copy situation
				if (typeof target === 'boolean') {
					deep = target;
					target = arguments[1] || {};
					// skip the boolean and the target
					i = 2;
				}
				if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
					target = {};
				}

				for (; i < length; ++i) {
					options = arguments[i];
					// Only deal with non-null/undefined values
					if (options != null) {
						// Extend the base object
						for (name in options) {
							src = getProperty(target, name);
							copy = getProperty(options, name);

							// Prevent never-ending loop
							if (target !== copy) {
								// Recurse if we're merging plain objects or arrays
								if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
									if (copyIsArray) {
										copyIsArray = false;
										clone = src && isArray(src) ? src : [];
									} else {
										clone = src && isPlainObject(src) ? src : {};
									}

									// Never move original objects, clone them
									setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

									// Don't bring in undefined values
								} else if (typeof copy !== 'undefined') {
									setProperty(target, { name: name, newValue: copy });
								}
							}
						}
					}
				}

				// Return the modified object
				return target;
			};


			/***/ }),
		/* 53 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			Object.defineProperty(exports, '__esModule', {
				value: true
			});

			var _defineProperty2 = __webpack_require__(85);

			var _defineProperty3 = _interopRequireDefault(_defineProperty2);

			var _getPrototypeOf = __webpack_require__(15);

			var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

			var _classCallCheck2 = __webpack_require__(7);

			var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

			var _createClass2 = __webpack_require__(16);

			var _createClass3 = _interopRequireDefault(_createClass2);

			var _possibleConstructorReturn2 = __webpack_require__(21);

			var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

			var _get2 = __webpack_require__(22);

			var _get3 = _interopRequireDefault(_get2);

			var _inherits2 = __webpack_require__(23);

			var _inherits3 = _interopRequireDefault(_inherits2);

			var _quill = __webpack_require__(8);

			var _quill2 = _interopRequireDefault(_quill);

			var _ContainBlot2 = __webpack_require__(24);

			var _ContainBlot3 = _interopRequireDefault(_ContainBlot2);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			var Container = _quill2.default.import('blots/container');
			var Block = _quill2.default.import('blots/block');
			var BlockEmbed = _quill2.default.import('blots/block/embed');
			var Parchment = _quill2.default.import('parchment');

			var TableCell = (function (_ContainBlot) {
				(0, _inherits3.default)(TableCell, _ContainBlot);

				function TableCell() {
					(0, _classCallCheck3.default)(this, TableCell);
					return (0, _possibleConstructorReturn3.default)(this, (TableCell.__proto__ || (0, _getPrototypeOf2.default)(TableCell)).apply(this, arguments));
				}

				(0, _createClass3.default)(TableCell, [{
					key: 'format',
					value: function format() {
						this.domNode.getAttribute('cell_id');
					}
				}, {
					key: 'formats',
					value: function formats() {
						// We don't inherit from FormatBlot
						let value =
							{
								tableId: this.domNode.getAttribute('table_id'),
								rowId: this.domNode.getAttribute('row_id'),
								cellId: this.domNode.getAttribute('cell_id'),
								width: this.domNode.getAttribute('width')
							};
						return (0, _defineProperty3.default)({}, this.statics.blotName, value);
					}
				}, {
					key: 'optimize',
					value: function optimize(context) {
						(0, _get3.default)(TableCell.prototype.__proto__ || (0, _getPrototypeOf2.default)(TableCell.prototype), 'optimize', this).call(this, context);

						let parent = this.parent;
						if (parent !== null) {
							if (parent.statics.blotName === 'td') {
								this.moveChildren(parent, this);
								this.remove();
								return;
							} else if (parent.statics.blotName !== 'tr') {
								// we will mark td position, put in table and replace mark
								let mark = Parchment.create('block');
								this.parent.insertBefore(mark, this.next);
								let table = Parchment.create('table', {id: this.domNode.getAttribute('table_id'), style: this.domNode.tableStyle});
								let tr = Parchment.create('tr', this.domNode.getAttribute('row_id'));
								table.appendChild(tr);
								tr.appendChild(this);
								table.replace(mark);
							}
						}

						// merge same TD id
						let next = this.next;
						if (next && next.prev === this && next.statics.blotName === this.statics.blotName && next.domNode.tagName === this.domNode.tagName && next.domNode.getAttribute('cell_id') === this.domNode.getAttribute('cell_id')) {
							next.moveChildren(this);
							next.remove();
						}
					}
				}, {
					key: 'insertBefore',
					value: function insertBefore(childBlot, refBlot) {
						if (this.statics.allowedChildren && !this.statics.allowedChildren.some(function (child) {
							return childBlot instanceof child;
						})) {
							let newChild = Parchment.create(this.statics.defaultChild);
							newChild.appendChild(childBlot);
							childBlot = newChild;
						}
						(0, _get3.default)(TableCell.prototype.__proto__ || (0, _getPrototypeOf2.default)(TableCell.prototype), 'insertBefore', this).call(this, childBlot, refBlot);
					}
				}, {
					key: 'replace',
					value: function replace(target) {
						if (target.statics.blotName !== this.statics.blotName) {
							let item = Parchment.create(this.statics.defaultChild);
							target.moveChildren(item);
							this.appendChild(item);
						}
						if (!target.parent) return;
						(0, _get3.default)(TableCell.prototype.__proto__ || (0, _getPrototypeOf2.default)(TableCell.prototype), 'replace', this).call(this, target);
					}
				}, {
					key: 'moveChildren',
					value: function moveChildren(targetParent, refNode) {
						this.children.forEach(function (child) {
							targetParent.insertBefore(child, refNode);
						});
					}
				}], [{
					key: 'create',
					value: function create(value) {
						let tagName = 'td';
						let node = (0, _get3.default)(TableCell.__proto__ || (0, _getPrototypeOf2.default)(TableCell), 'create', this).call(this, tagName);
						// var ids = value.split('|');
						node.setAttribute('table_id', value.tableId);
						node.setAttribute('row_id', value.rowId);
						node.setAttribute('cell_id', value.cellId);
						node.tableStyle = value.parentStyle;
						let style = 'border-style: solid; vertical-align: top; ';
						if (value && value.style) {
							// style += value.style.paddingLeft ? 'padding-left:  ' + value.style.paddingLeft + ';padding-right:  ' + value.style.paddingLeft + ';' : '';
							// style += value.style.paddingTop ? 'padding-top:  ' + value.style.paddingTop + ';padding-bottom:  ' + value.style.paddingBottom + ';' : '';
							style += value.style.borderWidth ? 'border-width: ' + value.style.borderWidth + ';' : '';
							style += value.style.borderColor ? 'border-color: ' + value.style.borderColor + ';' : '';
							// style += value.style.backgroundColor ? 'background-color: ' + value.style.backgroundColor + ';' : '';
							style += value.style.borderStyle ? 'border-style: ' + value.style.borderStyle + ';' : 'solid;';
							/* let border = '';
							border += value.style.borderStyle ? value.style.borderStyle + ' ' : '';
							border += value.style.borderWidth ? value.style.borderWidth + ' ' : '';
							border += value.style.borderColor ? value.style.borderColor + ' ' : '';
							if(border) {
								style += 'border: ' + border + ';';
							}*/
							style += value.style.width ? 'width: ' + value.style.width + ';' : '';
							style += value.style.width ? 'max-width: ' + value.style.width + ';' : '';
							style += value.style.width ? 'min-width: ' + value.style.width + ';' : '';
							// style += value.style.height ? 'height: ' + value.style.height + ';' : '';
							style += value.style.textAlign ? 'text-align: ' + value.style.textAlign + ';' : '';
							// style += value.style.verticalAlign ? 'vertical-align: ' + value.style.verticalAlign + ';' : '';
						} else {
							style += 'border-width: 1pt; border-color:#333333; border-style:solid;';
							if(value && value.width)
							{
								style += value.width ? 'width: ' + value.width.toFixed(2) + 'px' + ';' : '';
								style += value.width  ? 'max-width: ' + value.width.toFixed(2)  + 'px' + ';': '';
								style += value.width ? 'min-width: ' + value.width.toFixed(2) + 'px' + ';' : '';
							}
						}
						node.setAttribute('style', style);
						return node;
					}
				}]);
				return TableCell;
			})(_ContainBlot3.default);

			TableCell.blotName = 'td';
			TableCell.tagName = 'td';
			TableCell.scope = Parchment.Scope.BLOCK_BLOT;
			TableCell.defaultChild = 'block';
			TableCell.allowedChildren = [Block, BlockEmbed, Container];

			exports.default = TableCell;

			/***/ }),
		/* 54 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = { 'default': __webpack_require__(86), __esModule: true };

			/***/ }),
		/* 55 */
		/***/ (function(module, exports, __webpack_require__) {

			// optional / simple context binding
			var aFunction = __webpack_require__(88);
			module.exports = function (fn, that, length) {
				aFunction(fn);
				if (that === undefined) return fn;
				switch (length) {
					case 1: return function (a) {
						return fn.call(that, a);
					};
					case 2: return function (a, b) {
						return fn.call(that, a, b);
					};
					case 3: return function (a, b, c) {
						return fn.call(that, a, b, c);
					};
				}
				return function (/* ...args */) {
					return fn.apply(that, arguments);
				};
			};


			/***/ }),
		/* 56 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = !__webpack_require__(4) && !__webpack_require__(11)(function () {
				return Object.defineProperty(__webpack_require__(57)('div'), 'a', { get: function () { return 7; } }).a != 7;
			});


			/***/ }),
		/* 57 */
		/***/ (function(module, exports, __webpack_require__) {

			var isObject = __webpack_require__(10);
			var document = __webpack_require__(1).document;
			// typeof document.createElement is 'object' in old IE
			var is = isObject(document) && isObject(document.createElement);
			module.exports = function (it) {
				return is ? document.createElement(it) : {};
			};


			/***/ }),
		/* 58 */
		/***/ (function(module, exports, __webpack_require__) {

			// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
			var has = __webpack_require__(5);
			var toObject = __webpack_require__(28);
			var IE_PROTO = __webpack_require__(29)('IE_PROTO');
			var ObjectProto = Object.prototype;

			module.exports = Object.getPrototypeOf || function (O) {
				O = toObject(O);
				if (has(O, IE_PROTO)) return O[IE_PROTO];
				if (typeof O.constructor === 'function' && O instanceof O.constructor) {
					return O.constructor.prototype;
				} return O instanceof Object ? ObjectProto : null;
			};


			/***/ }),
		/* 59 */
		/***/ (function(module, exports, __webpack_require__) {

			// most Object methods by ES6 should accept primitives
			var $export = __webpack_require__(2);
			var core = __webpack_require__(0);
			var fails = __webpack_require__(11);
			module.exports = function (KEY, exec) {
				var fn = (core.Object || {})[KEY] || Object[KEY];
				var exp = {};
				exp[KEY] = exec(fn);
				$export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
			};


			/***/ }),
		/* 60 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			exports.__esModule = true;

			var _iterator = __webpack_require__(91);

			var _iterator2 = _interopRequireDefault(_iterator);

			var _symbol = __webpack_require__(106);

			var _symbol2 = _interopRequireDefault(_symbol);

			var _typeof = typeof _symbol2.default === 'function' && typeof _iterator2.default === 'symbol' ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === 'function' && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? 'symbol' : typeof obj; };

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			exports.default = typeof _symbol2.default === 'function' && _typeof(_iterator2.default) === 'symbol' ? function (obj) {
				return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
			} : function (obj) {
				return obj && typeof _symbol2.default === 'function' && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? 'symbol' : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
			};

			/***/ }),
		/* 61 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';

			var LIBRARY = __webpack_require__(19);
			var $export = __webpack_require__(2);
			var redefine = __webpack_require__(62);
			var hide = __webpack_require__(9);
			var Iterators = __webpack_require__(32);
			var $iterCreate = __webpack_require__(95);
			var setToStringTag = __webpack_require__(36);
			var getPrototypeOf = __webpack_require__(58);
			var ITERATOR = __webpack_require__(12)('iterator');
			var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
			var FF_ITERATOR = '@@iterator';
			var KEYS = 'keys';
			var VALUES = 'values';

			var returnThis = function () { return this; };

			module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
				$iterCreate(Constructor, NAME, next);
				var getMethod = function (kind) {
					if (!BUGGY && kind in proto) return proto[kind];
					switch (kind) {
						case KEYS: return function keys() { return new Constructor(this, kind); };
						case VALUES: return function values() { return new Constructor(this, kind); };
					} return function entries() { return new Constructor(this, kind); };
				};
				var TAG = NAME + ' Iterator';
				var DEF_VALUES = DEFAULT == VALUES;
				var VALUES_BUG = false;
				var proto = Base.prototype;
				var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
				var $default = $native || getMethod(DEFAULT);
				var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
				var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
				var methods, key, IteratorPrototype;
				// Fix native
				if ($anyNative) {
					IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
					if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
						// Set @@toStringTag to native iterators
						setToStringTag(IteratorPrototype, TAG, true);
						// fix for some old engines
						if (!LIBRARY && typeof IteratorPrototype[ITERATOR] !== 'function') hide(IteratorPrototype, ITERATOR, returnThis);
					}
				}
				// fix Array#{values, @@iterator}.name in V8 / FF
				if (DEF_VALUES && $native && $native.name !== VALUES) {
					VALUES_BUG = true;
					$default = function values() { return $native.call(this); };
				}
				// Define iterator
				if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
					hide(proto, ITERATOR, $default);
				}
				// Plug for library
				Iterators[NAME] = $default;
				Iterators[TAG] = returnThis;
				if (DEFAULT) {
					methods = {
						values: DEF_VALUES ? $default : getMethod(VALUES),
						keys: IS_SET ? $default : getMethod(KEYS),
						entries: $entries
					};
					if (FORCED) for (key in methods) {
						if (!(key in proto)) redefine(proto, key, methods[key]);
					} else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
				}
				return methods;
			};


			/***/ }),
		/* 62 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = __webpack_require__(9);


			/***/ }),
		/* 63 */
		/***/ (function(module, exports, __webpack_require__) {

			var has = __webpack_require__(5);
			var toIObject = __webpack_require__(6);
			var arrayIndexOf = __webpack_require__(98)(false);
			var IE_PROTO = __webpack_require__(29)('IE_PROTO');

			module.exports = function (object, names) {
				var O = toIObject(object);
				var i = 0;
				var result = [];
				var key;
				for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
				// Don't enum bug & hidden keys
				while (names.length > i) if (has(O, key = names[i++])) {
					~arrayIndexOf(result, key) || result.push(key);
				}
				return result;
			};


			/***/ }),
		/* 64 */
		/***/ (function(module, exports) {

			var toString = {}.toString;

			module.exports = function (it) {
				return toString.call(it).slice(8, -1);
			};


			/***/ }),
		/* 65 */
		/***/ (function(module, exports) {

			exports.f = Object.getOwnPropertySymbols;


			/***/ }),
		/* 66 */
		/***/ (function(module, exports, __webpack_require__) {

			// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
			var $keys = __webpack_require__(63);
			var hiddenKeys = __webpack_require__(35).concat('length', 'prototype');

			exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
				return $keys(O, hiddenKeys);
			};


			/***/ }),
		/* 67 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			Object.defineProperty(exports, '__esModule', {
				value: true
			});

			var _getPrototypeOf = __webpack_require__(15);

			var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

			var _classCallCheck2 = __webpack_require__(7);

			var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

			var _createClass2 = __webpack_require__(16);

			var _createClass3 = _interopRequireDefault(_createClass2);

			var _possibleConstructorReturn2 = __webpack_require__(21);

			var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

			var _get2 = __webpack_require__(22);

			var _get3 = _interopRequireDefault(_get2);

			var _inherits2 = __webpack_require__(23);

			var _inherits3 = _interopRequireDefault(_inherits2);

			var _quill = __webpack_require__(8);

			var _quill2 = _interopRequireDefault(_quill);

			var _TableCellBlot = __webpack_require__(53);

			var _TableCellBlot2 = _interopRequireDefault(_TableCellBlot);

			var _ContainBlot2 = __webpack_require__(24);

			var _ContainBlot3 = _interopRequireDefault(_ContainBlot2);

			var _TableTrick = __webpack_require__(41);

			var _TableTrick2 = _interopRequireDefault(_TableTrick);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			var Container = _quill2.default.import('blots/container');
			var Parchment = _quill2.default.import('parchment');

			var TableRow = (function (_ContainBlot) {
				(0, _inherits3.default)(TableRow, _ContainBlot);

				function TableRow() {
					(0, _classCallCheck3.default)(this, TableRow);
					return (0, _possibleConstructorReturn3.default)(this, (TableRow.__proto__ || (0, _getPrototypeOf2.default)(TableRow)).apply(this, arguments));
				}

				(0, _createClass3.default)(TableRow, [{
					key: 'format',
					value: function format() {
						this.getAttribute('row_id');
					}
				}, {
					key: 'optimize',
					value: function optimize(context) {
						if (this.children.length === 0) {
							if (this.statics.defaultChild != null) {
								var child = this.createDefaultChild();
								this.appendChild(child);
								child.optimize(context);
							} else {
								this.remove();
							}
						}
						var next = this.next;
						if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && next.domNode.tagName === this.domNode.tagName && next.domNode.getAttribute('row_id') === this.domNode.getAttribute('row_id')) {
							next.moveChildren(this);
							next.remove();
						}
					}
				}, {
					key: 'insertBefore',
					value: function insertBefore(childBlot, refBlot) {
						if (this.statics.allowedChildren != null && !this.statics.allowedChildren.some(function (child) {
							return childBlot instanceof child;
						})) {
							var newChild = this.createDefaultChild(refBlot);
							newChild.appendChild(childBlot);
							childBlot = newChild;
						}
						(0, _get3.default)(TableRow.prototype.__proto__ || (0, _getPrototypeOf2.default)(TableRow.prototype), 'insertBefore', this).call(this, childBlot, refBlot);
					}
				}, {
					key: 'replace',
					value: function replace(target) {
						if (target.statics.blotName !== this.statics.blotName) {
							var item = this.createDefaultChild();
							target.moveChildren(item, this);
							this.appendChild(item);
						}
						(0, _get3.default)(TableRow.prototype.__proto__ || (0, _getPrototypeOf2.default)(TableRow.prototype), 'replace', this).call(this, target);
					}
				}, {
					key: 'createDefaultChild',
					value: function createDefaultChild(refBlot) {
						var table_id = null;
						if (refBlot) {
							table_id = refBlot.domNode.getAttribute('table_id');
						} else if (this.parent) {
							table_id = this.parent.domNode.getAttribute('table_id');
						} else {
							table_id = this.domNode.parent.getAttribute('table_id');
						}

						return Parchment.create(this.statics.defaultChild, [table_id, this.domNode.getAttribute('row_id'), _TableTrick2.default.random_id()].join('|'));
					}
				}], [{
					key: 'create',
					value: function create(value) {
						var tagName = 'tr';
						var node = (0, _get3.default)(TableRow.__proto__ || (0, _getPrototypeOf2.default)(TableRow), 'create', this).call(this, tagName);
						node.setAttribute('row_id', value ? value : _TableTrick2.default.random_id());
						return node;
					}
				}]);
				return TableRow;
			})(_ContainBlot3.default);

			TableRow.blotName = 'tr';
			TableRow.tagName = 'tr';
			TableRow.scope = Parchment.Scope.BLOCK_BLOT;
			TableRow.defaultChild = 'td';
			TableRow.allowedChildren = [_TableCellBlot2.default];

			exports.default = TableRow;

			/***/ }),
		/* 68 */
		/***/ (function(module, exports) {

			module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
                '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


			/***/ }),
		/* 69 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var _classCallCheck2 = __webpack_require__(7);

			var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

			var _quill = __webpack_require__(8);

			var _quill2 = _interopRequireDefault(_quill);

			var _quillDelta = __webpack_require__(70);

			var _quillDelta2 = _interopRequireDefault(_quillDelta);

			var _TableCellBlot = __webpack_require__(53);

			var _TableCellBlot2 = _interopRequireDefault(_TableCellBlot);

			var _TableRowBlot = __webpack_require__(67);

			var _TableRowBlot2 = _interopRequireDefault(_TableRowBlot);

			var _TableBlot = __webpack_require__(131);

			var _TableBlot2 = _interopRequireDefault(_TableBlot);

			var _ContainBlot = __webpack_require__(24);

			var _ContainBlot2 = _interopRequireDefault(_ContainBlot);

			__webpack_require__(132);

			var _TableTrick = __webpack_require__(41);

			var _TableTrick2 = _interopRequireDefault(_TableTrick);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			var Container = _quill2.default.import('blots/container');

			Container.order = ['list', 'contain', // Must be lower
				'td', 'tr', 'table' // Must be higher
			];

			var TableModule = function TableModule(quill, options) {
				(0, _classCallCheck3.default)(this, TableModule);

				var toolbar = quill.getModule('toolbar');
				var tableId;
				var rowId;
				var tableToolbarIdList = ['addRowAbove', 'addRowBelow', 'addColBefore', 'addColBefore'];

				quill.root.addEventListener('scroll', function () {
					if(_TableTrick2.default.is_toolbar_visible(quill)) {
						let table = _TableTrick2.default.find_table(quill);
						if (table) {
							let tableDimensions = $(table.domNode).position();
							let editorStyle = window.getComputedStyle(quill.root);
							let editorMarginLeft = editorStyle.marginLeft ? parseFloat(editorStyle.marginLeft) : 0;
							let editorMarginRight = editorStyle.marginRight ? parseFloat(editorStyle.marginRight) : 0;
							let position = { top: tableDimensions.top, left: tableDimensions.left, marginLeft: editorMarginLeft, marginRight: editorMarginRight };
							_TableTrick2.default.show_overlay(quill.container, position);
						}
					}
				});

				_TableTrick2.default.overlay = Object.assign(document.createElement('div'), {
					className: 'ql-table-toolbar toolbar',
					innerHTML:'<div class="dropdown">' +
						'<button type="button" id="add" class="dropdown-toggle tlb-icons ico-table-add"  title="'+ options.addTableOptions+'"></button>' +
						'<div class="dropdown-content" id="dropdown-content-add">' +
						'<div id="addRowAbove">' + options.addRowAbove + '</div>' +
						'<div id="addRowBelow">' + options.addRowBelow + '</div>' +
						'<div id="addColBefore">' + options.addColumnBefore + '</div>' +
						'<div id="addColAfter">' + options.addColumnAfter + '</div></div>' +
						'<button type="button" id="delete" class="dropdown-toggle tlb-icons ico-table-delete"  title="'+ options.deleteTableOptions+'"></button>' +
						'<div class="dropdown-content" id="dropdown-content-delete">' +
						'<div id="deleteRow">' + options.deleteRow + '</div>' +
						'<div id="deleteColumn">' + options.deleteColumn + '</div>' +
						'<div id="deleteTable">' + options.deleteTable + '</div></div>' +
						'<button type="button" id="border" class="dropdown-toggle tlb-icons ico-table-border"  title="'+ options.tableBorderSetting+'"></button>' +
						'<div class="dropdown-content" id="dropdown-content-border">' +
						'<div id="showVBorder">' + options.showVBorder + '</div>' +
						'<div id="showHBorder">' + options.showHBorder + '</div>' +
						'<div id="showAllBorders">' + options.showAllBorders + '</div>' +
						'<div id="noBorder">' + options.noBorder + '</div>' +
						'</div>'+
						// '<button type="button" id="tableEditor" class="tlb-icons ico-table-editor" title="'+ options.tableEditor+'"></button>'+
						'<button type="button" id="cellEditor" class="tlb-icons ico-cell-editor" title="'+ options.cellEditor+'"></button>'
				});

				/* function commitAction() {
					let range = quill.getSelection();
					let index = range ? range.index : 0;

					quill.insertText(0, ' ', 'user');
					quill.deleteText(0,1);

					quill.setSelection(index);
					quill.focus();
				} */

				function cancelAction() {
					quill.focus();
				}

				function closeAllDropdowns() {
					if (document.getElementById('dropdown-content-add')) {
						document.getElementById('dropdown-content-add').classList.remove('show');
					}
					if (document.getElementById('dropdown-content-delete')) {
						document.getElementById('dropdown-content-delete').classList.remove('show');
					}
					if (document.getElementById('dropdown-content-border')) {
						document.getElementById('dropdown-content-border').classList.remove('show');
					}
				}

				_TableTrick2.default.overlay.onclick = function (event) {
					if (event.target.id === 'add') {
						document.getElementById('dropdown-content-add').classList.toggle('show');
						document.getElementById('dropdown-content-delete').classList.remove('show');
						document.getElementById('dropdown-content-border').classList.remove('show');
					}
					else if (event.target.id === 'delete') {
						document.getElementById('dropdown-content-delete').classList.toggle('show');
						document.getElementById('dropdown-content-add').classList.remove('show');
						document.getElementById('dropdown-content-border').classList.remove('show');
					}
					else if (event.target.id === 'border') {
						document.getElementById('dropdown-content-border').classList.toggle('show');
						document.getElementById('dropdown-content-add').classList.remove('show');
						document.getElementById('dropdown-content-delete').classList.remove('show');
					}
					else if (event.target.id === 'showVBorder') {
						_TableTrick2.default.show_vertical_border(quill);
						document.getElementById('dropdown-content-border').classList.remove('show');
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'showHBorder') {
						_TableTrick2.default.show_horizontal_border(quill);
						document.getElementById('dropdown-content-border').classList.remove('show');
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'showAllBorders') {
						_TableTrick2.default.show_all_border(quill);
						document.getElementById('dropdown-content-border').classList.remove('show');
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'noBorder') {
						_TableTrick2.default.show_no_border(quill);
						document.getElementById('dropdown-content-border').classList.remove('show');
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'deleteTable') {
						_TableTrick2.default.delete_table(quill);
						document.getElementById('dropdown-content-delete').classList.remove('show');
						_TableTrick2.default.hide_after_delete(quill);
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'deleteRow') {
						_TableTrick2.default.delete_row(quill);
						if(document.getElementById('dropdown-content-delete'))
						{
							document.getElementById('dropdown-content-delete').classList.remove('show');
						}
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'deleteColumn') {
						_TableTrick2.default.delete_column(quill);
						document.getElementById('dropdown-content-delete').classList.remove('show');
						_TableTrick2.default.hide_after_delete(quill);
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'addRowAbove') {
						_TableTrick2.default.add_row_before(quill);
						document.getElementById('dropdown-content-add').classList.remove('show');
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'addRowBelow') {
						_TableTrick2.default.add_row_after(quill);
						document.getElementById('dropdown-content-add').classList.remove('show');
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'addColBefore') {
						_TableTrick2.default.add_col_before(quill);
						document.getElementById('dropdown-content-add').classList.remove('show');
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'addColAfter') {
						_TableTrick2.default.add_col_after(quill);
						document.getElementById('dropdown-content-add').classList.remove('show');
						_TableTrick2.default.commit_action(quill);
					}
					else if (event.target.id === 'tableEditor') {
						closeAllDropdowns();
						let tableProperties= _TableTrick2.default.get_table_properties(quill);
						let table = _TableTrick2.default.find_table(quill);
						options.showTablePropertiesDialog(tableProperties).then( function(result) {
							if (result.ok) {
								_TableTrick2.default.set_table_properties(table,
									{
										backgroundColor: result.value.backgroundColor !== '' ? _.padStart(result.value.backgroundColor.toString(16), 7, '#000000') : '',
										tableWidth: result.value.tableWidth,
										tableHeight: result.value.tableHeight,
										borderStyle: result.value.borderStyle,
										borderWidth: result.value.borderWidth,
										borderColor: result.value.borderColor !== '' ? _.padStart(result.value.borderColor.toString(16), 7, '#000000') : '',
										horizontal: result.value.horizontal
									});

									_TableTrick2.default.update_toolbar(result.value.tableWidth);

								commitAction();
							}
						}, function () {
							cancelAction();
						});
					}
					else if (event.target.id === 'cellEditor') {
						closeAllDropdowns();
						let cellProperties = _TableTrick2.default.get_cell_properties(quill);
						let td = _TableTrick2.default.find_td(quill);
						let tr = _TableTrick2.default.find_tr(quill);
						let table = _TableTrick2.default.find_table(quill);
						let selectedNodes = Object.assign(cellProperties.selectedNodes);
						options.showCellPropertiesDialog(cellProperties).then(function (result) {
							if (result.ok) {
								_TableTrick2.default.set_cell_properties(quill, table, td, tr, {
									verticalPadding: result.value.verticalPadding,
									horizontalPadding: result.value.horizontalPadding,
									//backgroundColor: result.value.backgroundColor !== '' ? _.padStart(result.value.backgroundColor.toString(16), 7, '#000000') : '',
									cellWidth: result.value.cellWidth,
									cellHeight: result.value.cellHeight,
									borderStyle: result.value.borderStyle,
									borderWidth: result.value.borderWidth,
									borderColor: result.value.borderColor  ? _.padStart(result.value.borderColor.toString(16), 7, '#000000') : '',
									horizontal: result.value.horizontal,
									vertical: result.value.vertical,
									selectedNodes: selectedNodes,
								});
								_TableTrick2.default.commit_action(quill);
							}
							// _TableTrick2.default.hide_overlay(quill.container);
						}, function () {
							cancelAction();
							// _TableTrick2.default.hide_overlay(quill.container);
						});
					}
					else {
						document.getElementById('dropdown-content-add').classList.remove('show');
					}
				};

				options.scope.modelChanged = function () {
					_TableTrick2.default.hide_overlay(quill.container);
				};

				options.scope.viewChanged = function () {
					if(_TableTrick2.default.is_toolbar_visible(quill)) {
						_TableTrick2.default.hide_overlay(quill.container);
						let table = _TableTrick2.default.find_table(quill);
						if (table) {
							_TableTrick2.default.hide_overlay();
							let tableDimensions = $(table.domNode).position();
							let editorStyle = window.getComputedStyle(quill.root);
							let editorMarginLeft = editorStyle.marginLeft ? parseFloat(editorStyle.marginLeft) : 0;
							let editorMarginRight = editorStyle.marginRight ? parseFloat(editorStyle.marginRight) : 0;
							let position = { top: tableDimensions.top, left: tableDimensions.left, marginLeft: editorMarginLeft, marginRight: editorMarginRight };
							_TableTrick2.default.show_overlay(quill.container, position);
						}
					}
				};

				quill.root.addEventListener('click', function(e) {
					closeAllDropdowns();
					if(quill.getSelection() && quill.getSelection().length === 0) {
						let element = document.elementFromPoint(e.clientX, e.clientY);
						if(!element.closest('table') && !element.classList.contains('ql-table-toolbar') && !tableToolbarIdList.includes(element.id)) {
							_TableTrick2.default.hide_overlay(quill.container);
						}
					}
				});

				if(toolbar) {
					toolbar.addHandler('table', function (value) {
						return _TableTrick2.default.table_handler(value, quill);
					});
				}

				var clipboard = quill.getModule('clipboard');
				clipboard.addMatcher('TABLE', function (node, delta) {
					tableId = null;
					return delta;
				});
				clipboard.addMatcher('TR', function (node, delta) {
					rowId = null;
					return delta;
				});
				clipboard.addMatcher('TD', function (node, delta) {
					if(!tableId) {
						tableId = node.getAttribute('table_id') ? node.getAttribute('table_id') : _TableTrick2.default.random_id();
					}
					if(!rowId) {
						rowId = node.getAttribute('row_id') ? node.getAttribute('row_id') : _TableTrick2.default.random_id();
					}
					let cellId = node.getAttribute('cell_id');
					if(!cellId) {
						cellId = _TableTrick2.default.random_id();
					}
					if(delta && delta.ops.length === 0) { // Handle empty cell
						delta.ops.push({insert: '\n'});
					}
					let table = $(node).closest('table');
					if(delta.ops.length >= 1 && !delta.ops[delta.ops.length - 1].insert.includes('\n')) {
						delta.ops[delta.ops.length - 1].insert = delta.ops[delta.ops.length - 1].insert.concat('\n');
					}
					return delta.compose(new _quillDelta2.default().retain(delta.length(), {
						// td: tableId + '|' + rowId + '|' + cellId + '|' + node.getAttribute('width') + '|' + node.style
						td:
							{
								tableId: tableId,
								rowId: rowId,
								cellId: cellId,
								width: node.getAttribute('width'),
								style: node.style,
								parentStyle: table && table.length > 0 ? table[0].style : null
							}
					}));
				});

			};

			module.exports = {
				Table: _TableBlot2.default,
				TableRow: _TableRowBlot2.default,
				TableCell: _TableCellBlot2.default,
				Contain: _ContainBlot2.default,
				TableModule: TableModule
			};

			/***/ }),
		/* 70 */
		/***/ (function(module, exports, __webpack_require__) {

			var diff = __webpack_require__(71);
			var equal = __webpack_require__(42);
			var extend = __webpack_require__(52);
			var op = __webpack_require__(84);


			var NULL_CHARACTER = String.fromCharCode(0);  // Placeholder char for embed in diff()


			var Delta = function (ops) {
				// Assume we are given a well formed ops
				if (Array.isArray(ops)) {
					this.ops = ops;
				} else if (ops != null && Array.isArray(ops.ops)) {
					this.ops = ops.ops;
				} else {
					this.ops = [];
				}
			};


			Delta.prototype.insert = function (text, attributes) {
				var newOp = {};
				if (text.length === 0) return this;
				newOp.insert = text;
				if (attributes != null && typeof attributes === 'object' && Object.keys(attributes).length > 0) {
					newOp.attributes = attributes;
				}
				return this.push(newOp);
			};

			Delta.prototype['delete'] = function (length) {
				if (length <= 0) return this;
				return this.push({ 'delete': length });
			};

			Delta.prototype.retain = function (length, attributes) {
				if (length <= 0) return this;
				var newOp = { retain: length };
				if (attributes != null && typeof attributes === 'object' && Object.keys(attributes).length > 0) {
					newOp.attributes = attributes;
				}
				return this.push(newOp);
			};

			Delta.prototype.push = function (newOp) {
				var index = this.ops.length;
				var lastOp = this.ops[index - 1];
				newOp = extend(true, {}, newOp);
				if (typeof lastOp === 'object') {
					if (typeof newOp['delete'] === 'number' && typeof lastOp['delete'] === 'number') {
						this.ops[index - 1] = { 'delete': lastOp['delete'] + newOp['delete'] };
						return this;
					}
					// Since it does not matter if we insert before or after deleting at the same index,
					// always prefer to insert first
					if (typeof lastOp['delete'] === 'number' && newOp.insert != null) {
						index -= 1;
						lastOp = this.ops[index - 1];
						if (typeof lastOp !== 'object') {
							this.ops.unshift(newOp);
							return this;
						}
					}
					if (equal(newOp.attributes, lastOp.attributes)) {
						if (typeof newOp.insert === 'string' && typeof lastOp.insert === 'string') {
							this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
							if (typeof newOp.attributes === 'object') this.ops[index - 1].attributes = newOp.attributes;
							return this;
						} else if (typeof newOp.retain === 'number' && typeof lastOp.retain === 'number') {
							this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
							if (typeof newOp.attributes === 'object') this.ops[index - 1].attributes = newOp.attributes;
							return this;
						}
					}
				}
				if (index === this.ops.length) {
					this.ops.push(newOp);
				} else {
					this.ops.splice(index, 0, newOp);
				}
				return this;
			};

			Delta.prototype.chop = function () {
				var lastOp = this.ops[this.ops.length - 1];
				if (lastOp && lastOp.retain && !lastOp.attributes) {
					this.ops.pop();
				}
				return this;
			};

			Delta.prototype.filter = function (predicate) {
				return this.ops.filter(predicate);
			};

			Delta.prototype.forEach = function (predicate) {
				this.ops.forEach(predicate);
			};

			Delta.prototype.map = function (predicate) {
				return this.ops.map(predicate);
			};

			Delta.prototype.partition = function (predicate) {
				var passed = [], failed = [];
				this.forEach(function(op) {
					var target = predicate(op) ? passed : failed;
					target.push(op);
				});
				return [passed, failed];
			};

			Delta.prototype.reduce = function (predicate, initial) {
				return this.ops.reduce(predicate, initial);
			};

			Delta.prototype.changeLength = function () {
				return this.reduce(function (length, elem) {
					if (elem.insert) {
						return length + op.length(elem);
					} else if (elem.delete) {
						return length - elem.delete;
					}
					return length;
				}, 0);
			};

			Delta.prototype.length = function () {
				return this.reduce(function (length, elem) {
					return length + op.length(elem);
				}, 0);
			};

			Delta.prototype.slice = function (start, end) {
				start = start || 0;
				if (typeof end !== 'number') end = Infinity;
				var ops = [];
				var iter = op.iterator(this.ops);
				var index = 0;
				while (index < end && iter.hasNext()) {
					var nextOp;
					if (index < start) {
						nextOp = iter.next(start - index);
					} else {
						nextOp = iter.next(end - index);
						ops.push(nextOp);
					}
					index += op.length(nextOp);
				}
				return new Delta(ops);
			};


			Delta.prototype.compose = function (other) {
				var thisIter = op.iterator(this.ops);
				var otherIter = op.iterator(other.ops);
				var ops = [];
				var firstOther = otherIter.peek();
				if (firstOther != null && typeof firstOther.retain === 'number' && firstOther.attributes == null) {
					var firstLeft = firstOther.retain;
					while (thisIter.peekType() === 'insert' && thisIter.peekLength() <= firstLeft) {
						firstLeft -= thisIter.peekLength();
						ops.push(thisIter.next());
					}
					if (firstOther.retain - firstLeft > 0) {
						otherIter.next(firstOther.retain - firstLeft);
					}
				}
				var delta = new Delta(ops);
				while (thisIter.hasNext() || otherIter.hasNext()) {
					if (otherIter.peekType() === 'insert') {
						delta.push(otherIter.next());
					} else if (thisIter.peekType() === 'delete') {
						delta.push(thisIter.next());
					} else {
						var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
						var thisOp = thisIter.next(length);
						var otherOp = otherIter.next(length);
						if (typeof otherOp.retain === 'number') {
							var newOp = {};
							if (typeof thisOp.retain === 'number') {
								newOp.retain = length;
							} else {
								newOp.insert = thisOp.insert;
							}
							// Preserve null when composing with a retain, otherwise remove it for inserts
							var attributes = op.attributes.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === 'number');
							if (attributes) newOp.attributes = attributes;
							delta.push(newOp);

							// Optimization if rest of other is just retain
							if (!otherIter.hasNext() && equal(delta.ops[delta.ops.length - 1], newOp)) {
								var rest = new Delta(thisIter.rest());
								return delta.concat(rest).chop();
							}

							// Other op should be delete, we could be an insert or retain
							// Insert + delete cancels out
						} else if (typeof otherOp['delete'] === 'number' && typeof thisOp.retain === 'number') {
							delta.push(otherOp);
						}
					}
				}
				return delta.chop();
			};

			Delta.prototype.concat = function (other) {
				var delta = new Delta(this.ops.slice());
				if (other.ops.length > 0) {
					delta.push(other.ops[0]);
					delta.ops = delta.ops.concat(other.ops.slice(1));
				}
				return delta;
			};

			Delta.prototype.diff = function (other, index) {
				if (this.ops === other.ops) {
					return new Delta();
				}
				var strings = [this, other].map(function (delta) {
					return delta.map(function (op) {
						if (op.insert != null) {
							return typeof op.insert === 'string' ? op.insert : NULL_CHARACTER;
						}
						var prep = (delta === other) ? 'on' : 'with';
						throw new Error('diff() called ' + prep + ' non-document');
					}).join('');
				});
				var delta = new Delta();
				var diffResult = diff(strings[0], strings[1], index);
				var thisIter = op.iterator(this.ops);
				var otherIter = op.iterator(other.ops);
				diffResult.forEach(function (component) {
					var length = component[1].length;
					while (length > 0) {
						var opLength = 0;
						switch (component[0]) {
							case diff.INSERT:
								opLength = Math.min(otherIter.peekLength(), length);
								delta.push(otherIter.next(opLength));
								break;
							case diff.DELETE:
								opLength = Math.min(length, thisIter.peekLength());
								thisIter.next(opLength);
								delta['delete'](opLength);
								break;
							case diff.EQUAL:
								opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
								var thisOp = thisIter.next(opLength);
								var otherOp = otherIter.next(opLength);
								if (equal(thisOp.insert, otherOp.insert)) {
									delta.retain(opLength, op.attributes.diff(thisOp.attributes, otherOp.attributes));
								} else {
									delta.push(otherOp)['delete'](opLength);
								}
								break;
						}
						length -= opLength;
					}
				});
				return delta.chop();
			};

			Delta.prototype.eachLine = function (predicate, newline) {
				newline = newline || '\n';
				var iter = op.iterator(this.ops);
				var line = new Delta();
				var i = 0;
				while (iter.hasNext()) {
					if (iter.peekType() !== 'insert') return;
					var thisOp = iter.peek();
					var start = op.length(thisOp) - iter.peekLength();
					var index = typeof thisOp.insert === 'string' ?
						thisOp.insert.indexOf(newline, start) - start : -1;
					if (index < 0) {
						line.push(iter.next());
					} else if (index > 0) {
						line.push(iter.next(index));
					} else {
						if (predicate(line, iter.next(1).attributes || {}, i) === false) {
							return;
						}
						i += 1;
						line = new Delta();
					}
				}
				if (line.length() > 0) {
					predicate(line, {}, i);
				}
			};

			Delta.prototype.transform = function (other, priority) {
				priority = !!priority;
				if (typeof other === 'number') {
					return this.transformPosition(other, priority);
				}
				var thisIter = op.iterator(this.ops);
				var otherIter = op.iterator(other.ops);
				var delta = new Delta();
				while (thisIter.hasNext() || otherIter.hasNext()) {
					if (thisIter.peekType() === 'insert' && (priority || otherIter.peekType() !== 'insert')) {
						delta.retain(op.length(thisIter.next()));
					} else if (otherIter.peekType() === 'insert') {
						delta.push(otherIter.next());
					} else {
						var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
						var thisOp = thisIter.next(length);
						var otherOp = otherIter.next(length);
						if (thisOp['delete']) {
							// Our delete either makes their delete redundant or removes their retain
							continue;
						} else if (otherOp['delete']) {
							delta.push(otherOp);
						} else {
							// We retain either their retain or insert
							delta.retain(length, op.attributes.transform(thisOp.attributes, otherOp.attributes, priority));
						}
					}
				}
				return delta.chop();
			};

			Delta.prototype.transformPosition = function (index, priority) {
				priority = !!priority;
				var thisIter = op.iterator(this.ops);
				var offset = 0;
				while (thisIter.hasNext() && offset <= index) {
					var length = thisIter.peekLength();
					var nextType = thisIter.peekType();
					thisIter.next();
					if (nextType === 'delete') {
						index -= Math.min(length, index - offset);
						continue;
					} else if (nextType === 'insert' && (offset < index || !priority)) {
						index += length;
					}
					offset += length;
				}
				return index;
			};


			module.exports = Delta;


			/***/ }),
		/* 71 */
		/***/ (function(module, exports) {

			/**
             * This library modifies the diff-patch-match library by Neil Fraser
             * by removing the patch and match functionality and certain advanced
             * options in the diff function. The original license is as follows:
             *
             * ===
             *
             * Diff Match and Patch
             *
             * Copyright 2006 Google Inc.
             * http://code.google.com/p/google-diff-match-patch/
             *
             * Licensed under the Apache License, Version 2.0 (the "License");
             * you may not use this file except in compliance with the License.
             * You may obtain a copy of the License at
             *
             *   http://www.apache.org/licenses/LICENSE-2.0
             *
             * Unless required by applicable law or agreed to in writing, software
             * distributed under the License is distributed on an "AS IS" BASIS,
             * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
             * See the License for the specific language governing permissions and
             * limitations under the License.
             */


			/**
             * The data structure representing a diff is an array of tuples:
             * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
             * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
             */
			var DIFF_DELETE = -1;
			var DIFF_INSERT = 1;
			var DIFF_EQUAL = 0;


			/**
             * Find the differences between two texts.  Simplifies the problem by stripping
             * any common prefix or suffix off the texts before diffing.
             * @param {string} text1 Old string to be diffed.
             * @param {string} text2 New string to be diffed.
             * @param {Int} cursor_pos Expected edit position in text1 (optional)
             * @return {Array} Array of diff tuples.
             */
			function diff_main(text1, text2, cursor_pos) {
				// Check for equality (speedup).
				if (text1 == text2) {
					if (text1) {
						return [[DIFF_EQUAL, text1]];
					}
					return [];
				}

				// Check cursor_pos within bounds
				if (cursor_pos < 0 || text1.length < cursor_pos) {
					cursor_pos = null;
				}

				// Trim off common prefix (speedup).
				var commonlength = diff_commonPrefix(text1, text2);
				var commonprefix = text1.substring(0, commonlength);
				text1 = text1.substring(commonlength);
				text2 = text2.substring(commonlength);

				// Trim off common suffix (speedup).
				commonlength = diff_commonSuffix(text1, text2);
				var commonsuffix = text1.substring(text1.length - commonlength);
				text1 = text1.substring(0, text1.length - commonlength);
				text2 = text2.substring(0, text2.length - commonlength);

				// Compute the diff on the middle block.
				var diffs = diff_compute_(text1, text2);

				// Restore the prefix and suffix.
				if (commonprefix) {
					diffs.unshift([DIFF_EQUAL, commonprefix]);
				}
				if (commonsuffix) {
					diffs.push([DIFF_EQUAL, commonsuffix]);
				}
				diff_cleanupMerge(diffs);
				if (cursor_pos != null) {
					diffs = fix_cursor(diffs, cursor_pos);
				}
				diffs = fix_emoji(diffs);
				return diffs;
			}


			/**
             * Find the differences between two texts.  Assumes that the texts do not
             * have any common prefix or suffix.
             * @param {string} text1 Old string to be diffed.
             * @param {string} text2 New string to be diffed.
             * @return {Array} Array of diff tuples.
             */
			function diff_compute_(text1, text2) {
				var diffs;

				if (!text1) {
					// Just add some text (speedup).
					return [[DIFF_INSERT, text2]];
				}

				if (!text2) {
					// Just delete some text (speedup).
					return [[DIFF_DELETE, text1]];
				}

				var longtext = text1.length > text2.length ? text1 : text2;
				var shorttext = text1.length > text2.length ? text2 : text1;
				var i = longtext.indexOf(shorttext);
				if (i != -1) {
					// Shorter text is inside the longer text (speedup).
					diffs = [[DIFF_INSERT, longtext.substring(0, i)],
						[DIFF_EQUAL, shorttext],
						[DIFF_INSERT, longtext.substring(i + shorttext.length)]];
					// Swap insertions for deletions if diff is reversed.
					if (text1.length > text2.length) {
						diffs[0][0] = diffs[2][0] = DIFF_DELETE;
					}
					return diffs;
				}

				if (shorttext.length == 1) {
					// Single character string.
					// After the previous speedup, the character can't be an equality.
					return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
				}

				// Check to see if the problem can be split in two.
				var hm = diff_halfMatch_(text1, text2);
				if (hm) {
					// A half-match was found, sort out the return data.
					var text1_a = hm[0];
					var text1_b = hm[1];
					var text2_a = hm[2];
					var text2_b = hm[3];
					var mid_common = hm[4];
					// Send both pairs off for separate processing.
					var diffs_a = diff_main(text1_a, text2_a);
					var diffs_b = diff_main(text1_b, text2_b);
					// Merge the results.
					return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
				}

				return diff_bisect_(text1, text2);
			}


			/**
             * Find the 'middle snake' of a diff, split the problem in two
             * and return the recursively constructed diff.
             * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
             * @param {string} text1 Old string to be diffed.
             * @param {string} text2 New string to be diffed.
             * @return {Array} Array of diff tuples.
             * @private
             */
			function diff_bisect_(text1, text2) {
				// Cache the text lengths to prevent multiple calls.
				var text1_length = text1.length;
				var text2_length = text2.length;
				var max_d = Math.ceil((text1_length + text2_length) / 2);
				var v_offset = max_d;
				var v_length = 2 * max_d;
				var v1 = new Array(v_length);
				var v2 = new Array(v_length);
				// Setting all elements to -1 is faster in Chrome & Firefox than mixing
				// integers and undefined.
				for (var x = 0; x < v_length; x++) {
					v1[x] = -1;
					v2[x] = -1;
				}
				v1[v_offset + 1] = 0;
				v2[v_offset + 1] = 0;
				var delta = text1_length - text2_length;
				// If the total number of characters is odd, then the front path will collide
				// with the reverse path.
				var front = (delta % 2 != 0);
				// Offsets for start and end of k loop.
				// Prevents mapping of space beyond the grid.
				var k1start = 0;
				var k1end = 0;
				var k2start = 0;
				var k2end = 0;
				for (var d = 0; d < max_d; d++) {
					// Walk the front path one step.
					for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
						var k1_offset = v_offset + k1;
						var x1;
						if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
							x1 = v1[k1_offset + 1];
						} else {
							x1 = v1[k1_offset - 1] + 1;
						}
						var y1 = x1 - k1;
						while (x1 < text1_length && y1 < text2_length &&
                        text1.charAt(x1) == text2.charAt(y1)) {
							x1++;
							y1++;
						}
						v1[k1_offset] = x1;
						if (x1 > text1_length) {
							// Ran off the right of the graph.
							k1end += 2;
						} else if (y1 > text2_length) {
							// Ran off the bottom of the graph.
							k1start += 2;
						} else if (front) {
							var k2_offset = v_offset + delta - k1;
							if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
								// Mirror x2 onto top-left coordinate system.
								var x2 = text1_length - v2[k2_offset];
								if (x1 >= x2) {
									// Overlap detected.
									return diff_bisectSplit_(text1, text2, x1, y1);
								}
							}
						}
					}

					// Walk the reverse path one step.
					for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
						var k2_offset = v_offset + k2;
						var x2;
						if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
							x2 = v2[k2_offset + 1];
						} else {
							x2 = v2[k2_offset - 1] + 1;
						}
						var y2 = x2 - k2;
						while (x2 < text1_length && y2 < text2_length &&
                        text1.charAt(text1_length - x2 - 1) ==
                        text2.charAt(text2_length - y2 - 1)) {
							x2++;
							y2++;
						}
						v2[k2_offset] = x2;
						if (x2 > text1_length) {
							// Ran off the left of the graph.
							k2end += 2;
						} else if (y2 > text2_length) {
							// Ran off the top of the graph.
							k2start += 2;
						} else if (!front) {
							var k1_offset = v_offset + delta - k2;
							if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
								var x1 = v1[k1_offset];
								var y1 = v_offset + x1 - k1_offset;
								// Mirror x2 onto top-left coordinate system.
								x2 = text1_length - x2;
								if (x1 >= x2) {
									// Overlap detected.
									return diff_bisectSplit_(text1, text2, x1, y1);
								}
							}
						}
					}
				}
				// Diff took too long and hit the deadline or
				// number of diffs equals number of characters, no commonality at all.
				return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
			}


			/**
             * Given the location of the 'middle snake', split the diff in two parts
             * and recurse.
             * @param {string} text1 Old string to be diffed.
             * @param {string} text2 New string to be diffed.
             * @param {number} x Index of split point in text1.
             * @param {number} y Index of split point in text2.
             * @return {Array} Array of diff tuples.
             */
			function diff_bisectSplit_(text1, text2, x, y) {
				var text1a = text1.substring(0, x);
				var text2a = text2.substring(0, y);
				var text1b = text1.substring(x);
				var text2b = text2.substring(y);

				// Compute both diffs serially.
				var diffs = diff_main(text1a, text2a);
				var diffsb = diff_main(text1b, text2b);

				return diffs.concat(diffsb);
			}


			/**
             * Determine the common prefix of two strings.
             * @param {string} text1 First string.
             * @param {string} text2 Second string.
             * @return {number} The number of characters common to the start of each
             *     string.
             */
			function diff_commonPrefix(text1, text2) {
				// Quick check for common null cases.
				if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
					return 0;
				}
				// Binary search.
				// Performance analysis: http://neil.fraser.name/news/2007/10/09/
				var pointermin = 0;
				var pointermax = Math.min(text1.length, text2.length);
				var pointermid = pointermax;
				var pointerstart = 0;
				while (pointermin < pointermid) {
					if (text1.substring(pointerstart, pointermid) ==
                        text2.substring(pointerstart, pointermid)) {
						pointermin = pointermid;
						pointerstart = pointermin;
					} else {
						pointermax = pointermid;
					}
					pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
				}
				return pointermid;
			}


			/**
             * Determine the common suffix of two strings.
             * @param {string} text1 First string.
             * @param {string} text2 Second string.
             * @return {number} The number of characters common to the end of each string.
             */
			function diff_commonSuffix(text1, text2) {
				// Quick check for common null cases.
				if (!text1 || !text2 ||
                    text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
					return 0;
				}
				// Binary search.
				// Performance analysis: http://neil.fraser.name/news/2007/10/09/
				var pointermin = 0;
				var pointermax = Math.min(text1.length, text2.length);
				var pointermid = pointermax;
				var pointerend = 0;
				while (pointermin < pointermid) {
					if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
                        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
						pointermin = pointermid;
						pointerend = pointermin;
					} else {
						pointermax = pointermid;
					}
					pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
				}
				return pointermid;
			}


			/**
             * Do the two texts share a substring which is at least half the length of the
             * longer text?
             * This speedup can produce non-minimal diffs.
             * @param {string} text1 First string.
             * @param {string} text2 Second string.
             * @return {Array.<string>} Five element Array, containing the prefix of
             *     text1, the suffix of text1, the prefix of text2, the suffix of
             *     text2 and the common middle.  Or null if there was no match.
             */
			function diff_halfMatch_(text1, text2) {
				var longtext = text1.length > text2.length ? text1 : text2;
				var shorttext = text1.length > text2.length ? text2 : text1;
				if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
					return null;  // Pointless.
				}

				/**
                 * Does a substring of shorttext exist within longtext such that the substring
                 * is at least half the length of longtext?
                 * Closure, but does not reference any external variables.
                 * @param {string} longtext Longer string.
                 * @param {string} shorttext Shorter string.
                 * @param {number} i Start index of quarter length substring within longtext.
                 * @return {Array.<string>} Five element Array, containing the prefix of
                 *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
                 *     of shorttext and the common middle.  Or null if there was no match.
                 * @private
                 */
				function diff_halfMatchI_(longtext, shorttext, i) {
					// Start with a 1/4 length substring at position i as a seed.
					var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
					var j = -1;
					var best_common = '';
					var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
					while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
						var prefixLength = diff_commonPrefix(longtext.substring(i),
							shorttext.substring(j));
						var suffixLength = diff_commonSuffix(longtext.substring(0, i),
							shorttext.substring(0, j));
						if (best_common.length < suffixLength + prefixLength) {
							best_common = shorttext.substring(j - suffixLength, j) +
                                shorttext.substring(j, j + prefixLength);
							best_longtext_a = longtext.substring(0, i - suffixLength);
							best_longtext_b = longtext.substring(i + prefixLength);
							best_shorttext_a = shorttext.substring(0, j - suffixLength);
							best_shorttext_b = shorttext.substring(j + prefixLength);
						}
					}
					if (best_common.length * 2 >= longtext.length) {
						return [best_longtext_a, best_longtext_b,
							best_shorttext_a, best_shorttext_b, best_common];
					} else {
						return null;
					}
				}

				// First check if the second quarter is the seed for a half-match.
				var hm1 = diff_halfMatchI_(longtext, shorttext,
					Math.ceil(longtext.length / 4));
				// Check again based on the third quarter.
				var hm2 = diff_halfMatchI_(longtext, shorttext,
					Math.ceil(longtext.length / 2));
				var hm;
				if (!hm1 && !hm2) {
					return null;
				} else if (!hm2) {
					hm = hm1;
				} else if (!hm1) {
					hm = hm2;
				} else {
					// Both matched.  Select the longest.
					hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
				}

				// A half-match was found, sort out the return data.
				var text1_a, text1_b, text2_a, text2_b;
				if (text1.length > text2.length) {
					text1_a = hm[0];
					text1_b = hm[1];
					text2_a = hm[2];
					text2_b = hm[3];
				} else {
					text2_a = hm[0];
					text2_b = hm[1];
					text1_a = hm[2];
					text1_b = hm[3];
				}
				var mid_common = hm[4];
				return [text1_a, text1_b, text2_a, text2_b, mid_common];
			}


			/**
             * Reorder and merge like edit sections.  Merge equalities.
             * Any edit section can move as long as it doesn't cross an equality.
             * @param {Array} diffs Array of diff tuples.
             */
			function diff_cleanupMerge(diffs) {
				diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
				var pointer = 0;
				var count_delete = 0;
				var count_insert = 0;
				var text_delete = '';
				var text_insert = '';
				var commonlength;
				while (pointer < diffs.length) {
					switch (diffs[pointer][0]) {
						case DIFF_INSERT:
							count_insert++;
							text_insert += diffs[pointer][1];
							pointer++;
							break;
						case DIFF_DELETE:
							count_delete++;
							text_delete += diffs[pointer][1];
							pointer++;
							break;
						case DIFF_EQUAL:
							// Upon reaching an equality, check for prior redundancies.
							if (count_delete + count_insert > 1) {
								if (count_delete !== 0 && count_insert !== 0) {
									// Factor out any common prefixies.
									commonlength = diff_commonPrefix(text_insert, text_delete);
									if (commonlength !== 0) {
										if ((pointer - count_delete - count_insert) > 0 &&
                                            diffs[pointer - count_delete - count_insert - 1][0] ==
                                            DIFF_EQUAL) {
											diffs[pointer - count_delete - count_insert - 1][1] +=
                                                text_insert.substring(0, commonlength);
										} else {
											diffs.splice(0, 0, [DIFF_EQUAL,
												text_insert.substring(0, commonlength)]);
											pointer++;
										}
										text_insert = text_insert.substring(commonlength);
										text_delete = text_delete.substring(commonlength);
									}
									// Factor out any common suffixies.
									commonlength = diff_commonSuffix(text_insert, text_delete);
									if (commonlength !== 0) {
										diffs[pointer][1] = text_insert.substring(text_insert.length -
                                            commonlength) + diffs[pointer][1];
										text_insert = text_insert.substring(0, text_insert.length -
                                            commonlength);
										text_delete = text_delete.substring(0, text_delete.length -
                                            commonlength);
									}
								}
								// Delete the offending records and add the merged ones.
								if (count_delete === 0) {
									diffs.splice(pointer - count_insert,
										count_delete + count_insert, [DIFF_INSERT, text_insert]);
								} else if (count_insert === 0) {
									diffs.splice(pointer - count_delete,
										count_delete + count_insert, [DIFF_DELETE, text_delete]);
								} else {
									diffs.splice(pointer - count_delete - count_insert,
										count_delete + count_insert, [DIFF_DELETE, text_delete],
										[DIFF_INSERT, text_insert]);
								}
								pointer = pointer - count_delete - count_insert +
                                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
							} else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
								// Merge this equality with the previous one.
								diffs[pointer - 1][1] += diffs[pointer][1];
								diffs.splice(pointer, 1);
							} else {
								pointer++;
							}
							count_insert = 0;
							count_delete = 0;
							text_delete = '';
							text_insert = '';
							break;
					}
				}
				if (diffs[diffs.length - 1][1] === '') {
					diffs.pop();  // Remove the dummy entry at the end.
				}

				// Second pass: look for single edits surrounded on both sides by equalities
				// which can be shifted sideways to eliminate an equality.
				// e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
				var changes = false;
				pointer = 1;
				// Intentionally ignore the first and last element (don't need checking).
				while (pointer < diffs.length - 1) {
					if (diffs[pointer - 1][0] == DIFF_EQUAL &&
                        diffs[pointer + 1][0] == DIFF_EQUAL) {
						// This is a single edit surrounded by equalities.
						if (diffs[pointer][1].substring(diffs[pointer][1].length -
                            diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
							// Shift the edit over the previous equality.
							diffs[pointer][1] = diffs[pointer - 1][1] +
                                diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                    diffs[pointer - 1][1].length);
							diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
							diffs.splice(pointer - 1, 1);
							changes = true;
						} else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
                            diffs[pointer + 1][1]) {
							// Shift the edit over the next equality.
							diffs[pointer - 1][1] += diffs[pointer + 1][1];
							diffs[pointer][1] =
                                diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
                                diffs[pointer + 1][1];
							diffs.splice(pointer + 1, 1);
							changes = true;
						}
					}
					pointer++;
				}
				// If shifts were made, the diff needs reordering and another shift sweep.
				if (changes) {
					diff_cleanupMerge(diffs);
				}
			}


			var diff = diff_main;
			diff.INSERT = DIFF_INSERT;
			diff.DELETE = DIFF_DELETE;
			diff.EQUAL = DIFF_EQUAL;

			module.exports = diff;

			/*
 * Modify a diff such that the cursor position points to the start of a change:
 * E.g.
 *   cursor_normalize_diff([[DIFF_EQUAL, 'abc']], 1)
 *     => [1, [[DIFF_EQUAL, 'a'], [DIFF_EQUAL, 'bc']]]
 *   cursor_normalize_diff([[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xyz']], 2)
 *     => [2, [[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xy'], [DIFF_DELETE, 'z']]]
 *
 * @param {Array} diffs Array of diff tuples
 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
 * @return {Array} A tuple [cursor location in the modified diff, modified diff]
 */
			function cursor_normalize_diff (diffs, cursor_pos) {
				if (cursor_pos === 0) {
					return [DIFF_EQUAL, diffs];
				}
				for (var current_pos = 0, i = 0; i < diffs.length; i++) {
					var d = diffs[i];
					if (d[0] === DIFF_DELETE || d[0] === DIFF_EQUAL) {
						var next_pos = current_pos + d[1].length;
						if (cursor_pos === next_pos) {
							return [i + 1, diffs];
						} else if (cursor_pos < next_pos) {
							// copy to prevent side effects
							diffs = diffs.slice();
							// split d into two diff changes
							var split_pos = cursor_pos - current_pos;
							var d_left = [d[0], d[1].slice(0, split_pos)];
							var d_right = [d[0], d[1].slice(split_pos)];
							diffs.splice(i, 1, d_left, d_right);
							return [i + 1, diffs];
						} else {
							current_pos = next_pos;
						}
					}
				}
				throw new Error('cursor_pos is out of bounds!');
			}

			/*
 * Modify a diff such that the edit position is "shifted" to the proposed edit location (cursor_position).
 *
 * Case 1)
 *   Check if a naive shift is possible:
 *     [0, X], [ 1, Y] -> [ 1, Y], [0, X]    (if X + Y === Y + X)
 *     [0, X], [-1, Y] -> [-1, Y], [0, X]    (if X + Y === Y + X) - holds same result
 * Case 2)
 *   Check if the following shifts are possible:
 *     [0, 'pre'], [ 1, 'prefix'] -> [ 1, 'pre'], [0, 'pre'], [ 1, 'fix']
 *     [0, 'pre'], [-1, 'prefix'] -> [-1, 'pre'], [0, 'pre'], [-1, 'fix']
 *         ^            ^
 *         d          d_next
 *
 * @param {Array} diffs Array of diff tuples
 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
 * @return {Array} Array of diff tuples
 */
			function fix_cursor (diffs, cursor_pos) {
				var norm = cursor_normalize_diff(diffs, cursor_pos);
				var ndiffs = norm[1];
				var cursor_pointer = norm[0];
				var d = ndiffs[cursor_pointer];
				var d_next = ndiffs[cursor_pointer + 1];

				if (d == null) {
					// Text was deleted from end of original string,
					// cursor is now out of bounds in new string
					return diffs;
				} else if (d[0] !== DIFF_EQUAL) {
					// A modification happened at the cursor location.
					// This is the expected outcome, so we can return the original diff.
					return diffs;
				} else {
					if (d_next != null && d[1] + d_next[1] === d_next[1] + d[1]) {
						// Case 1)
						// It is possible to perform a naive shift
						ndiffs.splice(cursor_pointer, 2, d_next, d);
						return merge_tuples(ndiffs, cursor_pointer, 2);
					} else if (d_next != null && d_next[1].indexOf(d[1]) === 0) {
						// Case 2)
						// d[1] is a prefix of d_next[1]
						// We can assume that d_next[0] !== 0, since d[0] === 0
						// Shift edit locations..
						ndiffs.splice(cursor_pointer, 2, [d_next[0], d[1]], [0, d[1]]);
						var suffix = d_next[1].slice(d[1].length);
						if (suffix.length > 0) {
							ndiffs.splice(cursor_pointer + 2, 0, [d_next[0], suffix]);
						}
						return merge_tuples(ndiffs, cursor_pointer, 3);
					} else {
						// Not possible to perform any modification
						return diffs;
					}
				}
			}

			/*
 * Check diff did not split surrogate pairs.
 * Ex. [0, '\uD83D'], [-1, '\uDC36'], [1, '\uDC2F'] -> [-1, '\uD83D\uDC36'], [1, '\uD83D\uDC2F']
 *     '\uD83D\uDC36' === '🐶', '\uD83D\uDC2F' === '🐯'
 *
 * @param {Array} diffs Array of diff tuples
 * @return {Array} Array of diff tuples
 */
			function fix_emoji (diffs) {
				var compact = false;
				var starts_with_pair_end = function(str) {
					return str.charCodeAt(0) >= 0xDC00 && str.charCodeAt(0) <= 0xDFFF;
				};
				var ends_with_pair_start = function(str) {
					return str.charCodeAt(str.length-1) >= 0xD800 && str.charCodeAt(str.length-1) <= 0xDBFF;
				};
				for (var i = 2; i < diffs.length; i += 1) {
					if (diffs[i-2][0] === DIFF_EQUAL && ends_with_pair_start(diffs[i-2][1]) &&
                        diffs[i-1][0] === DIFF_DELETE && starts_with_pair_end(diffs[i-1][1]) &&
                        diffs[i][0] === DIFF_INSERT && starts_with_pair_end(diffs[i][1])) {
						compact = true;

						diffs[i-1][1] = diffs[i-2][1].slice(-1) + diffs[i-1][1];
						diffs[i][1] = diffs[i-2][1].slice(-1) + diffs[i][1];

						diffs[i-2][1] = diffs[i-2][1].slice(0, -1);
					}
				}
				if (!compact) {
					return diffs;
				}
				var fixed_diffs = [];
				for (var i = 0; i < diffs.length; i += 1) {
					if (diffs[i][1].length > 0) {
						fixed_diffs.push(diffs[i]);
					}
				}
				return fixed_diffs;
			}

			/*
 * Try to merge tuples with their neigbors in a given range.
 * E.g. [0, 'a'], [0, 'b'] -> [0, 'ab']
 *
 * @param {Array} diffs Array of diff tuples.
 * @param {Int} start Position of the first element to merge (diffs[start] is also merged with diffs[start - 1]).
 * @param {Int} length Number of consecutive elements to check.
 * @return {Array} Array of merged diff tuples.
 */
			function merge_tuples (diffs, start, length) {
				// Check from (start-1) to (start+length).
				for (var i = start + length - 1; i >= 0 && i >= start - 1; i--) {
					if (i + 1 < diffs.length) {
						var left_d = diffs[i];
						var right_d = diffs[i+1];
						if (left_d[0] === right_d[1]) {
							diffs.splice(i, 2, [left_d[0], left_d[1] + right_d[1]]);
						}
					}
				}
				return diffs;
			}


			/***/ }),
		/* 72 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var keysShim;
			if (!Object.keys) {
				// modified from https://github.com/es-shims/es5-shim
				var has = Object.prototype.hasOwnProperty;
				var toStr = Object.prototype.toString;
				var isArgs = __webpack_require__(44); // eslint-disable-line global-require
				var isEnumerable = Object.prototype.propertyIsEnumerable;
				var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
				var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
				var dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				];
				var equalsConstructorPrototype = function (o) {
					var ctor = o.constructor;
					return ctor && ctor.prototype === o;
				};
				var excludedKeys = {
					$applicationCache: true,
					$console: true,
					$external: true,
					$frame: true,
					$frameElement: true,
					$frames: true,
					$innerHeight: true,
					$innerWidth: true,
					$onmozfullscreenchange: true,
					$onmozfullscreenerror: true,
					$outerHeight: true,
					$outerWidth: true,
					$pageXOffset: true,
					$pageYOffset: true,
					$parent: true,
					$scrollLeft: true,
					$scrollTop: true,
					$scrollX: true,
					$scrollY: true,
					$self: true,
					$webkitIndexedDB: true,
					$webkitStorageInfo: true,
					$window: true
				};
				var hasAutomationEqualityBug = (function () {
					/* global window */
					if (typeof window === 'undefined') { return false; }
					for (var k in window) {
						try {
							if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
								try {
									equalsConstructorPrototype(window[k]);
								} catch (e) {
									return true;
								}
							}
						} catch (e) {
							return true;
						}
					}
					return false;
				})();
				var equalsConstructorPrototypeIfNotBuggy = function (o) {
					/* global window */
					if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
						return equalsConstructorPrototype(o);
					}
					try {
						return equalsConstructorPrototype(o);
					} catch (e) {
						return false;
					}
				};

				keysShim = function keys(object) {
					var isObject = object !== null && typeof object === 'object';
					var isFunction = toStr.call(object) === '[object Function]';
					var isArguments = isArgs(object);
					var isString = isObject && toStr.call(object) === '[object String]';
					var theKeys = [];

					if (!isObject && !isFunction && !isArguments) {
						throw new TypeError('Object.keys called on a non-object');
					}

					var skipProto = hasProtoEnumBug && isFunction;
					if (isString && object.length > 0 && !has.call(object, 0)) {
						for (var i = 0; i < object.length; ++i) {
							theKeys.push(String(i));
						}
					}

					if (isArguments && object.length > 0) {
						for (var j = 0; j < object.length; ++j) {
							theKeys.push(String(j));
						}
					} else {
						for (var name in object) {
							if (!(skipProto && name === 'prototype') && has.call(object, name)) {
								theKeys.push(String(name));
							}
						}
					}

					if (hasDontEnumBug) {
						var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

						for (var k = 0; k < dontEnums.length; ++k) {
							if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
								theKeys.push(dontEnums[k]);
							}
						}
					}
					return theKeys;
				};
			}
			module.exports = keysShim;


			/***/ }),
		/* 73 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
			var callBound = __webpack_require__(45);

			var $toString = callBound('Object.prototype.toString');

			var isStandardArguments = function isArguments(value) {
				if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
					return false;
				}
				return $toString(value) === '[object Arguments]';
			};

			var isLegacyArguments = function isArguments(value) {
				if (isStandardArguments(value)) {
					return true;
				}
				return value !== null &&
                    typeof value === 'object' &&
                    typeof value.length === 'number' &&
                    value.length >= 0 &&
                    $toString(value) !== '[object Array]' &&
                    $toString(value.callee) === '[object Function]';
			};

			var supportsStandardArguments = (function () {
				return isStandardArguments(arguments);
			})();

			isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

			module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;


			/***/ }),
		/* 74 */
		/***/ (function(module, exports) {

			var g;

			// This works in non-strict mode
			g = (function() {
				return this;
			})();

			try {
				// This works if eval is allowed (see CSP)
				g = g || Function('return this')() || (1,eval)('this');
			} catch(e) {
				// This works if the window reference is available
				if(typeof window === 'object')
					g = window;
			}

			// g can still be undefined, but nothing to do about it...
			// We return undefined, instead of nothing here, so it's
			// easier to handle this case. if(!global) { ...}

			module.exports = g;


			/***/ }),
		/* 75 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			/* eslint complexity: [2, 18], max-statements: [2, 33] */
			module.exports = function hasSymbols() {
				if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
				if (typeof Symbol.iterator === 'symbol') { return true; }

				var obj = {};
				var sym = Symbol('test');
				var symObj = Object(sym);
				if (typeof sym === 'string') { return false; }

				if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
				if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

				// temp disabled per https://github.com/ljharb/object.assign/issues/17
				// if (sym instanceof Symbol) { return false; }
				// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
				// if (!(symObj instanceof Symbol)) { return false; }

				// if (typeof Symbol.prototype.toString !== 'function') { return false; }
				// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

				var symVal = 42;
				obj[sym] = symVal;
				for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax
				if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

				if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

				var syms = Object.getOwnPropertySymbols(obj);
				if (syms.length !== 1 || syms[0] !== sym) { return false; }

				if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

				if (typeof Object.getOwnPropertyDescriptor === 'function') {
					var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
					if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
				}

				return true;
			};


			/***/ }),
		/* 76 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			/* eslint no-invalid-this: 1 */

			var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
			var slice = Array.prototype.slice;
			var toStr = Object.prototype.toString;
			var funcType = '[object Function]';

			module.exports = function bind(that) {
				var target = this;
				if (typeof target !== 'function' || toStr.call(target) !== funcType) {
					throw new TypeError(ERROR_MESSAGE + target);
				}
				var args = slice.call(arguments, 1);

				var bound;
				var binder = function () {
					if (this instanceof bound) {
						var result = target.apply(
							this,
							args.concat(slice.call(arguments))
						);
						if (Object(result) === result) {
							return result;
						}
						return this;
					} else {
						return target.apply(
							that,
							args.concat(slice.call(arguments))
						);
					}
				};

				var boundLength = Math.max(0, target.length - args.length);
				var boundArgs = [];
				for (var i = 0; i < boundLength; i++) {
					boundArgs.push('$' + i);
				}

				bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

				if (target.prototype) {
					var Empty = function Empty() {};
					Empty.prototype = target.prototype;
					bound.prototype = new Empty();
					Empty.prototype = null;
				}

				return bound;
			};


			/***/ }),
		/* 77 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var bind = __webpack_require__(25);

			module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


			/***/ }),
		/* 78 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var define = __webpack_require__(13);
			var callBind = __webpack_require__(26);

			var implementation = __webpack_require__(48);
			var getPolyfill = __webpack_require__(49);
			var shim = __webpack_require__(79);

			var polyfill = callBind(getPolyfill(), Object);

			define(polyfill, {
				getPolyfill: getPolyfill,
				implementation: implementation,
				shim: shim
			});

			module.exports = polyfill;


			/***/ }),
		/* 79 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var getPolyfill = __webpack_require__(49);
			var define = __webpack_require__(13);

			module.exports = function shimObjectIs() {
				var polyfill = getPolyfill();
				define(Object, { is: polyfill }, {
					is: function testObjectIs() {
						return Object.is !== polyfill;
					}
				});
				return polyfill;
			};


			/***/ }),
		/* 80 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var callBound = __webpack_require__(45);
			var hasSymbols = __webpack_require__(47)();
			var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === 'symbol';
			var has;
			var $exec;
			var isRegexMarker;
			var badStringifier;

			if (hasToStringTag) {
				has = callBound('Object.prototype.hasOwnProperty');
				$exec = callBound('RegExp.prototype.exec');
				isRegexMarker = {};

				var throwRegexMarker = function () {
					throw isRegexMarker;
				};
				badStringifier = {
					toString: throwRegexMarker,
					valueOf: throwRegexMarker
				};

				if (typeof Symbol.toPrimitive === 'symbol') {
					badStringifier[Symbol.toPrimitive] = throwRegexMarker;
				}
			}

			var $toString = callBound('Object.prototype.toString');
			var gOPD = Object.getOwnPropertyDescriptor;
			var regexClass = '[object RegExp]';

			module.exports = hasToStringTag
			// eslint-disable-next-line consistent-return
				? function isRegex(value) {
					if (!value || typeof value !== 'object') {
						return false;
					}

					var descriptor = gOPD(value, 'lastIndex');
					var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
					if (!hasLastIndexDataProperty) {
						return false;
					}

					try {
						$exec(value, badStringifier);
					} catch (e) {
						return e === isRegexMarker;
					}
				}
				: function isRegex(value) {
					// In older browsers, typeof regex incorrectly returns 'function'
					if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
						return false;
					}

					return $toString(value) === regexClass;
				};


			/***/ }),
		/* 81 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var define = __webpack_require__(13);
			var callBind = __webpack_require__(26);

			var implementation = __webpack_require__(50);
			var getPolyfill = __webpack_require__(51);
			var shim = __webpack_require__(82);

			var flagsBound = callBind(implementation);

			define(flagsBound, {
				getPolyfill: getPolyfill,
				implementation: implementation,
				shim: shim
			});

			module.exports = flagsBound;


			/***/ }),
		/* 82 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var supportsDescriptors = __webpack_require__(13).supportsDescriptors;
			var getPolyfill = __webpack_require__(51);
			var gOPD = Object.getOwnPropertyDescriptor;
			var defineProperty = Object.defineProperty;
			var TypeErr = TypeError;
			var getProto = Object.getPrototypeOf;
			var regex = /a/;

			module.exports = function shimFlags() {
				if (!supportsDescriptors || !getProto) {
					throw new TypeErr('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
				}
				var polyfill = getPolyfill();
				var proto = getProto(regex);
				var descriptor = gOPD(proto, 'flags');
				if (!descriptor || descriptor.get !== polyfill) {
					defineProperty(proto, 'flags', {
						configurable: true,
						enumerable: false,
						get: polyfill
					});
				}
				return polyfill;
			};


			/***/ }),
		/* 83 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			var getDay = Date.prototype.getDay;
			var tryDateObject = function tryDateGetDayCall(value) {
				try {
					getDay.call(value);
					return true;
				} catch (e) {
					return false;
				}
			};

			var toStr = Object.prototype.toString;
			var dateClass = '[object Date]';
			var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

			module.exports = function isDateObject(value) {
				if (typeof value !== 'object' || value === null) {
					return false;
				}
				return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
			};


			/***/ }),
		/* 84 */
		/***/ (function(module, exports, __webpack_require__) {

			var equal = __webpack_require__(42);
			var extend = __webpack_require__(52);


			var lib = {
				attributes: {
					compose: function (a, b, keepNull) {
						if (typeof a !== 'object') a = {};
						if (typeof b !== 'object') b = {};
						var attributes = extend(true, {}, b);
						if (!keepNull) {
							attributes = Object.keys(attributes).reduce(function (copy, key) {
								if (attributes[key] != null) {
									copy[key] = attributes[key];
								}
								return copy;
							}, {});
						}
						for (var key in a) {
							if (a[key] !== undefined && b[key] === undefined) {
								attributes[key] = a[key];
							}
						}
						return Object.keys(attributes).length > 0 ? attributes : undefined;
					},

					diff: function(a, b) {
						if (typeof a !== 'object') a = {};
						if (typeof b !== 'object') b = {};
						var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function (attributes, key) {
							if (!equal(a[key], b[key])) {
								attributes[key] = b[key] === undefined ? null : b[key];
							}
							return attributes;
						}, {});
						return Object.keys(attributes).length > 0 ? attributes : undefined;
					},

					transform: function (a, b, priority) {
						if (typeof a !== 'object') return b;
						if (typeof b !== 'object') return undefined;
						if (!priority) return b;  // b simply overwrites us without priority
						var attributes = Object.keys(b).reduce(function (attributes, key) {
							if (a[key] === undefined) attributes[key] = b[key];  // null is a valid value
							return attributes;
						}, {});
						return Object.keys(attributes).length > 0 ? attributes : undefined;
					}
				},

				iterator: function (ops) {
					return new Iterator(ops);
				},

				length: function (op) {
					if (typeof op['delete'] === 'number') {
						return op['delete'];
					} else if (typeof op.retain === 'number') {
						return op.retain;
					} else {
						return typeof op.insert === 'string' ? op.insert.length : 1;
					}
				}
			};


			function Iterator(ops) {
				this.ops = ops;
				this.index = 0;
				this.offset = 0;
			}

			Iterator.prototype.hasNext = function () {
				return this.peekLength() < Infinity;
			};

			Iterator.prototype.next = function (length) {
				if (!length) length = Infinity;
				var nextOp = this.ops[this.index];
				if (nextOp) {
					var offset = this.offset;
					var opLength = lib.length(nextOp);
					if (length >= opLength - offset) {
						length = opLength - offset;
						this.index += 1;
						this.offset = 0;
					} else {
						this.offset += length;
					}
					if (typeof nextOp['delete'] === 'number') {
						return { 'delete': length };
					} else {
						var retOp = {};
						if (nextOp.attributes) {
							retOp.attributes = nextOp.attributes;
						}
						if (typeof nextOp.retain === 'number') {
							retOp.retain = length;
						} else if (typeof nextOp.insert === 'string') {
							retOp.insert = nextOp.insert.substr(offset, length);
						} else {
							// offset should === 0, length should === 1
							retOp.insert = nextOp.insert;
						}
						return retOp;
					}
				} else {
					return { retain: Infinity };
				}
			};

			Iterator.prototype.peek = function () {
				return this.ops[this.index];
			};

			Iterator.prototype.peekLength = function () {
				if (this.ops[this.index]) {
					// Should never return 0 if our index is being managed correctly
					return lib.length(this.ops[this.index]) - this.offset;
				} else {
					return Infinity;
				}
			};

			Iterator.prototype.peekType = function () {
				if (this.ops[this.index]) {
					if (typeof this.ops[this.index]['delete'] === 'number') {
						return 'delete';
					} else if (typeof this.ops[this.index].retain === 'number') {
						return 'retain';
					} else {
						return 'insert';
					}
				}
				return 'retain';
			};

			Iterator.prototype.rest = function () {
				if (!this.hasNext()) {
					return [];
				} else if (this.offset === 0) {
					return this.ops.slice(this.index);
				} else {
					var offset = this.offset;
					var index = this.index;
					var next = this.next();
					var rest = this.ops.slice(this.index);
					this.offset = offset;
					this.index = index;
					return [next].concat(rest);
				}
			};


			module.exports = lib;


			/***/ }),
		/* 85 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			exports.__esModule = true;

			var _defineProperty = __webpack_require__(54);

			var _defineProperty2 = _interopRequireDefault(_defineProperty);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			exports.default = function (obj, key, value) {
				if (key in obj) {
					(0, _defineProperty2.default)(obj, key, {
						value: value,
						enumerable: true,
						configurable: true,
						writable: true
					});
				} else {
					obj[key] = value;
				}

				return obj;
			};

			/***/ }),
		/* 86 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(87);
			var $Object = __webpack_require__(0).Object;
			module.exports = function defineProperty(it, key, desc) {
				return $Object.defineProperty(it, key, desc);
			};


			/***/ }),
		/* 87 */
		/***/ (function(module, exports, __webpack_require__) {

			var $export = __webpack_require__(2);
			// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
			$export($export.S + $export.F * !__webpack_require__(4), 'Object', { defineProperty: __webpack_require__(3).f });


			/***/ }),
		/* 88 */
		/***/ (function(module, exports) {

			module.exports = function (it) {
				if (typeof it !== 'function') throw TypeError(it + ' is not a function!');
				return it;
			};


			/***/ }),
		/* 89 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(90);
			module.exports = __webpack_require__(0).Object.getPrototypeOf;


			/***/ }),
		/* 90 */
		/***/ (function(module, exports, __webpack_require__) {

			// 19.1.2.9 Object.getPrototypeOf(O)
			var toObject = __webpack_require__(28);
			var $getPrototypeOf = __webpack_require__(58);

			__webpack_require__(59)('getPrototypeOf', function () {
				return function getPrototypeOf(it) {
					return $getPrototypeOf(toObject(it));
				};
			});


			/***/ }),
		/* 91 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = { 'default': __webpack_require__(92), __esModule: true };

			/***/ }),
		/* 92 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(93);
			__webpack_require__(102);
			module.exports = __webpack_require__(37).f('iterator');


			/***/ }),
		/* 93 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';

			var $at = __webpack_require__(94)(true);

			// 21.1.3.27 String.prototype[@@iterator]()
			__webpack_require__(61)(String, 'String', function (iterated) {
				this._t = String(iterated); // target
				this._i = 0;                // next index
				// 21.1.5.2.1 %StringIteratorPrototype%.next()
			}, function () {
				var O = this._t;
				var index = this._i;
				var point;
				if (index >= O.length) return { value: undefined, done: true };
				point = $at(O, index);
				this._i += point.length;
				return { value: point, done: false };
			});


			/***/ }),
		/* 94 */
		/***/ (function(module, exports, __webpack_require__) {

			var toInteger = __webpack_require__(31);
			var defined = __webpack_require__(18);
			// true  -> String#at
			// false -> String#codePointAt
			module.exports = function (TO_STRING) {
				return function (that, pos) {
					var s = String(defined(that));
					var i = toInteger(pos);
					var l = s.length;
					var a, b;
					if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
					a = s.charCodeAt(i);
					return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
						? TO_STRING ? s.charAt(i) : a
						: TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
				};
			};


			/***/ }),
		/* 95 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';

			var create = __webpack_require__(33);
			var descriptor = __webpack_require__(17);
			var setToStringTag = __webpack_require__(36);
			var IteratorPrototype = {};

			// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
			__webpack_require__(9)(IteratorPrototype, __webpack_require__(12)('iterator'), function () { return this; });

			module.exports = function (Constructor, NAME, next) {
				Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
				setToStringTag(Constructor, NAME + ' Iterator');
			};


			/***/ }),
		/* 96 */
		/***/ (function(module, exports, __webpack_require__) {

			var dP = __webpack_require__(3);
			var anObject = __webpack_require__(14);
			var getKeys = __webpack_require__(34);

			module.exports = __webpack_require__(4) ? Object.defineProperties : function defineProperties(O, Properties) {
				anObject(O);
				var keys = getKeys(Properties);
				var length = keys.length;
				var i = 0;
				var P;
				while (length > i) dP.f(O, P = keys[i++], Properties[P]);
				return O;
			};


			/***/ }),
		/* 97 */
		/***/ (function(module, exports, __webpack_require__) {

			// fallback for non-array-like ES3 and non-enumerable old V8 strings
			var cof = __webpack_require__(64);
			// eslint-disable-next-line no-prototype-builtins
			module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
				return cof(it) == 'String' ? it.split('') : Object(it);
			};


			/***/ }),
		/* 98 */
		/***/ (function(module, exports, __webpack_require__) {

			// false -> Array#indexOf
			// true  -> Array#includes
			var toIObject = __webpack_require__(6);
			var toLength = __webpack_require__(99);
			var toAbsoluteIndex = __webpack_require__(100);
			module.exports = function (IS_INCLUDES) {
				return function ($this, el, fromIndex) {
					var O = toIObject($this);
					var length = toLength(O.length);
					var index = toAbsoluteIndex(fromIndex, length);
					var value;
					// Array#includes uses SameValueZero equality algorithm
					// eslint-disable-next-line no-self-compare
					if (IS_INCLUDES && el != el) while (length > index) {
						value = O[index++];
						// eslint-disable-next-line no-self-compare
						if (value != value) return true;
						// Array#indexOf ignores holes, Array#includes - not
					} else for (;length > index; index++) if (IS_INCLUDES || index in O) {
						if (O[index] === el) return IS_INCLUDES || index || 0;
					} return !IS_INCLUDES && -1;
				};
			};


			/***/ }),
		/* 99 */
		/***/ (function(module, exports, __webpack_require__) {

			// 7.1.15 ToLength
			var toInteger = __webpack_require__(31);
			var min = Math.min;
			module.exports = function (it) {
				return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
			};


			/***/ }),
		/* 100 */
		/***/ (function(module, exports, __webpack_require__) {

			var toInteger = __webpack_require__(31);
			var max = Math.max;
			var min = Math.min;
			module.exports = function (index, length) {
				index = toInteger(index);
				return index < 0 ? max(index + length, 0) : min(index, length);
			};


			/***/ }),
		/* 101 */
		/***/ (function(module, exports, __webpack_require__) {

			var document = __webpack_require__(1).document;
			module.exports = document && document.documentElement;


			/***/ }),
		/* 102 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(103);
			var global = __webpack_require__(1);
			var hide = __webpack_require__(9);
			var Iterators = __webpack_require__(32);
			var TO_STRING_TAG = __webpack_require__(12)('toStringTag');

			var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
                'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
                'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
                'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
                'TextTrackList,TouchList').split(',');

			for (var i = 0; i < DOMIterables.length; i++) {
				var NAME = DOMIterables[i];
				var Collection = global[NAME];
				var proto = Collection && Collection.prototype;
				if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
				Iterators[NAME] = Iterators.Array;
			}


			/***/ }),
		/* 103 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';

			var addToUnscopables = __webpack_require__(104);
			var step = __webpack_require__(105);
			var Iterators = __webpack_require__(32);
			var toIObject = __webpack_require__(6);

			// 22.1.3.4 Array.prototype.entries()
			// 22.1.3.13 Array.prototype.keys()
			// 22.1.3.29 Array.prototype.values()
			// 22.1.3.30 Array.prototype[@@iterator]()
			module.exports = __webpack_require__(61)(Array, 'Array', function (iterated, kind) {
				this._t = toIObject(iterated); // target
				this._i = 0;                   // next index
				this._k = kind;                // kind
				// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
			}, function () {
				var O = this._t;
				var kind = this._k;
				var index = this._i++;
				if (!O || index >= O.length) {
					this._t = undefined;
					return step(1);
				}
				if (kind == 'keys') return step(0, index);
				if (kind == 'values') return step(0, O[index]);
				return step(0, [index, O[index]]);
			}, 'values');

			// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
			Iterators.Arguments = Iterators.Array;

			addToUnscopables('keys');
			addToUnscopables('values');
			addToUnscopables('entries');


			/***/ }),
		/* 104 */
		/***/ (function(module, exports) {

			module.exports = function () { /* empty */ };


			/***/ }),
		/* 105 */
		/***/ (function(module, exports) {

			module.exports = function (done, value) {
				return { value: value, done: !!done };
			};


			/***/ }),
		/* 106 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = { 'default': __webpack_require__(107), __esModule: true };

			/***/ }),
		/* 107 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(108);
			__webpack_require__(113);
			__webpack_require__(114);
			__webpack_require__(115);
			module.exports = __webpack_require__(0).Symbol;


			/***/ }),
		/* 108 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';

			// ECMAScript 6 symbols shim
			var global = __webpack_require__(1);
			var has = __webpack_require__(5);
			var DESCRIPTORS = __webpack_require__(4);
			var $export = __webpack_require__(2);
			var redefine = __webpack_require__(62);
			var META = __webpack_require__(109).KEY;
			var $fails = __webpack_require__(11);
			var shared = __webpack_require__(30);
			var setToStringTag = __webpack_require__(36);
			var uid = __webpack_require__(20);
			var wks = __webpack_require__(12);
			var wksExt = __webpack_require__(37);
			var wksDefine = __webpack_require__(38);
			var enumKeys = __webpack_require__(110);
			var isArray = __webpack_require__(111);
			var anObject = __webpack_require__(14);
			var isObject = __webpack_require__(10);
			var toObject = __webpack_require__(28);
			var toIObject = __webpack_require__(6);
			var toPrimitive = __webpack_require__(27);
			var createDesc = __webpack_require__(17);
			var _create = __webpack_require__(33);
			var gOPNExt = __webpack_require__(112);
			var $GOPD = __webpack_require__(40);
			var $GOPS = __webpack_require__(65);
			var $DP = __webpack_require__(3);
			var $keys = __webpack_require__(34);
			var gOPD = $GOPD.f;
			var dP = $DP.f;
			var gOPN = gOPNExt.f;
			var $Symbol = global.Symbol;
			var $JSON = global.JSON;
			var _stringify = $JSON && $JSON.stringify;
			var PROTOTYPE = 'prototype';
			var HIDDEN = wks('_hidden');
			var TO_PRIMITIVE = wks('toPrimitive');
			var isEnum = {}.propertyIsEnumerable;
			var SymbolRegistry = shared('symbol-registry');
			var AllSymbols = shared('symbols');
			var OPSymbols = shared('op-symbols');
			var ObjectProto = Object[PROTOTYPE];
			var USE_NATIVE = typeof $Symbol === 'function' && !!$GOPS.f;
			var QObject = global.QObject;
			// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
			var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

			// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
			var setSymbolDesc = DESCRIPTORS && $fails(function () {
				return _create(dP({}, 'a', {
					get: function () { return dP(this, 'a', { value: 7 }).a; }
				})).a != 7;
			}) ? function (it, key, D) {
					var protoDesc = gOPD(ObjectProto, key);
					if (protoDesc) delete ObjectProto[key];
					dP(it, key, D);
					if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
				} : dP;

			var wrap = function (tag) {
				var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
				sym._k = tag;
				return sym;
			};

			var isSymbol = USE_NATIVE && typeof $Symbol.iterator === 'symbol' ? function (it) {
				return typeof it === 'symbol';
			} : function (it) {
				return it instanceof $Symbol;
			};

			var $defineProperty = function defineProperty(it, key, D) {
				if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
				anObject(it);
				key = toPrimitive(key, true);
				anObject(D);
				if (has(AllSymbols, key)) {
					if (!D.enumerable) {
						if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
						it[HIDDEN][key] = true;
					} else {
						if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
						D = _create(D, { enumerable: createDesc(0, false) });
					} return setSymbolDesc(it, key, D);
				} return dP(it, key, D);
			};
			var $defineProperties = function defineProperties(it, P) {
				anObject(it);
				var keys = enumKeys(P = toIObject(P));
				var i = 0;
				var l = keys.length;
				var key;
				while (l > i) $defineProperty(it, key = keys[i++], P[key]);
				return it;
			};
			var $create = function create(it, P) {
				return P === undefined ? _create(it) : $defineProperties(_create(it), P);
			};
			var $propertyIsEnumerable = function propertyIsEnumerable(key) {
				var E = isEnum.call(this, key = toPrimitive(key, true));
				if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
				return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
			};
			var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
				it = toIObject(it);
				key = toPrimitive(key, true);
				if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
				var D = gOPD(it, key);
				if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
				return D;
			};
			var $getOwnPropertyNames = function getOwnPropertyNames(it) {
				var names = gOPN(toIObject(it));
				var result = [];
				var i = 0;
				var key;
				while (names.length > i) {
					if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
				} return result;
			};
			var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
				var IS_OP = it === ObjectProto;
				var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
				var result = [];
				var i = 0;
				var key;
				while (names.length > i) {
					if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
				} return result;
			};

			// 19.4.1.1 Symbol([description])
			if (!USE_NATIVE) {
				$Symbol = function Symbol() {
					if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
					var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
					var $set = function (value) {
						if (this === ObjectProto) $set.call(OPSymbols, value);
						if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
						setSymbolDesc(this, tag, createDesc(1, value));
					};
					if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
					return wrap(tag);
				};
				redefine($Symbol[PROTOTYPE], 'toString', function toString() {
					return this._k;
				});

				$GOPD.f = $getOwnPropertyDescriptor;
				$DP.f = $defineProperty;
				__webpack_require__(66).f = gOPNExt.f = $getOwnPropertyNames;
				__webpack_require__(39).f = $propertyIsEnumerable;
				$GOPS.f = $getOwnPropertySymbols;

				if (DESCRIPTORS && !__webpack_require__(19)) {
					redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
				}

				wksExt.f = function (name) {
					return wrap(wks(name));
				};
			}

			$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

			for (var es6Symbols = (
				// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
					'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
				).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

			for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

			$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
				// 19.4.2.1 Symbol.for(key)
				'for': function (key) {
					return has(SymbolRegistry, key += '')
						? SymbolRegistry[key]
						: SymbolRegistry[key] = $Symbol(key);
				},
				// 19.4.2.5 Symbol.keyFor(sym)
				keyFor: function keyFor(sym) {
					if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
					for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
				},
				useSetter: function () { setter = true; },
				useSimple: function () { setter = false; }
			});

			$export($export.S + $export.F * !USE_NATIVE, 'Object', {
				// 19.1.2.2 Object.create(O [, Properties])
				create: $create,
				// 19.1.2.4 Object.defineProperty(O, P, Attributes)
				defineProperty: $defineProperty,
				// 19.1.2.3 Object.defineProperties(O, Properties)
				defineProperties: $defineProperties,
				// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
				getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
				// 19.1.2.7 Object.getOwnPropertyNames(O)
				getOwnPropertyNames: $getOwnPropertyNames,
				// 19.1.2.8 Object.getOwnPropertySymbols(O)
				getOwnPropertySymbols: $getOwnPropertySymbols
			});

			// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
			// https://bugs.chromium.org/p/v8/issues/detail?id=3443
			var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

			$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
				getOwnPropertySymbols: function getOwnPropertySymbols(it) {
					return $GOPS.f(toObject(it));
				}
			});

			// 24.3.2 JSON.stringify(value [, replacer [, space]])
			$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
				var S = $Symbol();
				// MS Edge converts symbol values to JSON as {}
				// WebKit converts symbol values to JSON as null
				// V8 throws on boxed symbols
				return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
			})), 'JSON', {
				stringify: function stringify(it) {
					var args = [it];
					var i = 1;
					var replacer, $replacer;
					while (arguments.length > i) args.push(arguments[i++]);
					$replacer = replacer = args[1];
					if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
					if (!isArray(replacer)) replacer = function (key, value) {
						if (typeof $replacer === 'function') value = $replacer.call(this, key, value);
						if (!isSymbol(value)) return value;
					};
					args[1] = replacer;
					return _stringify.apply($JSON, args);
				}
			});

			// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
			$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(9)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
			// 19.4.3.5 Symbol.prototype[@@toStringTag]
			setToStringTag($Symbol, 'Symbol');
			// 20.2.1.9 Math[@@toStringTag]
			setToStringTag(Math, 'Math', true);
			// 24.3.3 JSON[@@toStringTag]
			setToStringTag(global.JSON, 'JSON', true);


			/***/ }),
		/* 109 */
		/***/ (function(module, exports, __webpack_require__) {

			var META = __webpack_require__(20)('meta');
			var isObject = __webpack_require__(10);
			var has = __webpack_require__(5);
			var setDesc = __webpack_require__(3).f;
			var id = 0;
			var isExtensible = Object.isExtensible || function () {
				return true;
			};
			var FREEZE = !__webpack_require__(11)(function () {
				return isExtensible(Object.preventExtensions({}));
			});
			var setMeta = function (it) {
				setDesc(it, META, { value: {
					i: 'O' + ++id, // object ID
					w: {}          // weak collections IDs
				} });
			};
			var fastKey = function (it, create) {
				// return primitive with prefix
				if (!isObject(it)) return typeof it === 'symbol' ? it : (typeof it === 'string' ? 'S' : 'P') + it;
				if (!has(it, META)) {
					// can't set metadata to uncaught frozen object
					if (!isExtensible(it)) return 'F';
					// not necessary to add metadata
					if (!create) return 'E';
					// add missing metadata
					setMeta(it);
					// return object ID
				} return it[META].i;
			};
			var getWeak = function (it, create) {
				if (!has(it, META)) {
					// can't set metadata to uncaught frozen object
					if (!isExtensible(it)) return true;
					// not necessary to add metadata
					if (!create) return false;
					// add missing metadata
					setMeta(it);
					// return hash weak collections IDs
				} return it[META].w;
			};
			// add metadata on freeze-family methods calling
			var onFreeze = function (it) {
				if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
				return it;
			};
			var meta = module.exports = {
				KEY: META,
				NEED: false,
				fastKey: fastKey,
				getWeak: getWeak,
				onFreeze: onFreeze
			};


			/***/ }),
		/* 110 */
		/***/ (function(module, exports, __webpack_require__) {

			// all enumerable object keys, includes symbols
			var getKeys = __webpack_require__(34);
			var gOPS = __webpack_require__(65);
			var pIE = __webpack_require__(39);
			module.exports = function (it) {
				var result = getKeys(it);
				var getSymbols = gOPS.f;
				if (getSymbols) {
					var symbols = getSymbols(it);
					var isEnum = pIE.f;
					var i = 0;
					var key;
					while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
				} return result;
			};


			/***/ }),
		/* 111 */
		/***/ (function(module, exports, __webpack_require__) {

			// 7.2.2 IsArray(argument)
			var cof = __webpack_require__(64);
			module.exports = Array.isArray || function isArray(arg) {
				return cof(arg) == 'Array';
			};


			/***/ }),
		/* 112 */
		/***/ (function(module, exports, __webpack_require__) {

			// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
			var toIObject = __webpack_require__(6);
			var gOPN = __webpack_require__(66).f;
			var toString = {}.toString;

			var windowNames = typeof window === 'object' && window && Object.getOwnPropertyNames
				? Object.getOwnPropertyNames(window) : [];

			var getWindowNames = function (it) {
				try {
					return gOPN(it);
				} catch (e) {
					return windowNames.slice();
				}
			};

			module.exports.f = function getOwnPropertyNames(it) {
				return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
			};


			/***/ }),
		/* 113 */
		/***/ (function(module, exports) {



			/***/ }),
		/* 114 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(38)('asyncIterator');


			/***/ }),
		/* 115 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(38)('observable');


			/***/ }),
		/* 116 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = { 'default': __webpack_require__(117), __esModule: true };

			/***/ }),
		/* 117 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(118);
			var $Object = __webpack_require__(0).Object;
			module.exports = function getOwnPropertyDescriptor(it, key) {
				return $Object.getOwnPropertyDescriptor(it, key);
			};


			/***/ }),
		/* 118 */
		/***/ (function(module, exports, __webpack_require__) {

			// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
			var toIObject = __webpack_require__(6);
			var $getOwnPropertyDescriptor = __webpack_require__(40).f;

			__webpack_require__(59)('getOwnPropertyDescriptor', function () {
				return function getOwnPropertyDescriptor(it, key) {
					return $getOwnPropertyDescriptor(toIObject(it), key);
				};
			});


			/***/ }),
		/* 119 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = { 'default': __webpack_require__(120), __esModule: true };

			/***/ }),
		/* 120 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(121);
			module.exports = __webpack_require__(0).Object.setPrototypeOf;


			/***/ }),
		/* 121 */
		/***/ (function(module, exports, __webpack_require__) {

			// 19.1.3.19 Object.setPrototypeOf(O, proto)
			var $export = __webpack_require__(2);
			$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(122).set });


			/***/ }),
		/* 122 */
		/***/ (function(module, exports, __webpack_require__) {

			// Works with __proto__ only. Old v8 can't work with null proto objects.
			/* eslint-disable no-proto */
			var isObject = __webpack_require__(10);
			var anObject = __webpack_require__(14);
			var check = function (O, proto) {
				anObject(O);
				if (!isObject(proto) && proto !== null) throw TypeError(proto + ': can\'t set as prototype!');
			};
			module.exports = {
                set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
					(function (test, buggy, set) {
						try {
							set = __webpack_require__(55)(Function.call, __webpack_require__(40).f(Object.prototype, '__proto__').set, 2);
							set(test, []);
							buggy = !(test instanceof Array);
						} catch (e) { buggy = true; }
						return function setPrototypeOf(O, proto) {
							check(O, proto);
							if (buggy) O.__proto__ = proto;
							else set(O, proto);
							return O;
						};
					})({}, false) : undefined),
				check: check
			};


			/***/ }),
		/* 123 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = { 'default': __webpack_require__(124), __esModule: true };

			/***/ }),
		/* 124 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(125);
			var $Object = __webpack_require__(0).Object;
			module.exports = function create(P, D) {
				return $Object.create(P, D);
			};


			/***/ }),
		/* 125 */
		/***/ (function(module, exports, __webpack_require__) {

			var $export = __webpack_require__(2);
			// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
			$export($export.S, 'Object', { create: __webpack_require__(33) });


			/***/ }),
		/* 126 */
		/***/ (function(module, exports, __webpack_require__) {

			module.exports = { 'default': __webpack_require__(127), __esModule: true };

			/***/ }),
		/* 127 */
		/***/ (function(module, exports, __webpack_require__) {

			__webpack_require__(128);
			module.exports = __webpack_require__(0).Number.parseInt;


			/***/ }),
		/* 128 */
		/***/ (function(module, exports, __webpack_require__) {

			var $export = __webpack_require__(2);
			var $parseInt = __webpack_require__(129);
			// 20.1.2.13 Number.parseInt(string, radix)
			$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


			/***/ }),
		/* 129 */
		/***/ (function(module, exports, __webpack_require__) {

			var $parseInt = __webpack_require__(1).parseInt;
			var $trim = __webpack_require__(130).trim;
			var ws = __webpack_require__(68);
			var hex = /^[-+]?0[xX]/;

			module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
				var string = $trim(String(str), 3);
				return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
			} : $parseInt;


			/***/ }),
		/* 130 */
		/***/ (function(module, exports, __webpack_require__) {

			var $export = __webpack_require__(2);
			var defined = __webpack_require__(18);
			var fails = __webpack_require__(11);
			var spaces = __webpack_require__(68);
			var space = '[' + spaces + ']';
			var non = '\u200b\u0085';
			var ltrim = RegExp('^' + space + space + '*');
			var rtrim = RegExp(space + space + '*$');

			var exporter = function (KEY, exec, ALIAS) {
				var exp = {};
				var FORCE = fails(function () {
					return !!spaces[KEY]() || non[KEY]() != non;
				});
				var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
				if (ALIAS) exp[ALIAS] = fn;
				$export($export.P + $export.F * FORCE, 'String', exp);
			};

			// 1 -> String#trimLeft
			// 2 -> String#trimRight
			// 3 -> String#trim
			var trim = exporter.trim = function (string, TYPE) {
				string = String(defined(string));
				if (TYPE & 1) string = string.replace(ltrim, '');
				if (TYPE & 2) string = string.replace(rtrim, '');
				return string;
			};

			module.exports = exporter;


			/***/ }),
		/* 131 */
		/***/ (function(module, exports, __webpack_require__) {

			'use strict';


			Object.defineProperty(exports, '__esModule', {
				value: true
			});

			var _getPrototypeOf = __webpack_require__(15);

			var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

			var _classCallCheck2 = __webpack_require__(7);

			var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

			var _createClass2 = __webpack_require__(16);

			var _createClass3 = _interopRequireDefault(_createClass2);

			var _possibleConstructorReturn2 = __webpack_require__(21);

			var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

			var _get2 = __webpack_require__(22);

			var _get3 = _interopRequireDefault(_get2);

			var _inherits2 = __webpack_require__(23);

			var _inherits3 = _interopRequireDefault(_inherits2);

			var _quill = __webpack_require__(8);

			var _quill2 = _interopRequireDefault(_quill);

			var _TableTrick = __webpack_require__(41);

			var _TableTrick2 = _interopRequireDefault(_TableTrick);

			var _TableRowBlot = __webpack_require__(67);

			var _TableRowBlot2 = _interopRequireDefault(_TableRowBlot);

			var _ContainBlot2 = __webpack_require__(24);

			var _ContainBlot3 = _interopRequireDefault(_ContainBlot2);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			var Container = _quill2.default.import('blots/container');
			var Parchment = _quill2.default.import('parchment');


			var Table = (function (_ContainBlot) {
				(0, _inherits3.default)(Table, _ContainBlot);

				function Table() {
					(0, _classCallCheck3.default)(this, Table);
					return (0, _possibleConstructorReturn3.default)(this, (Table.__proto__ || (0, _getPrototypeOf2.default)(Table)).apply(this, arguments));
				}

				(0, _createClass3.default)(Table, [{
					key: 'format',
					value: function format() {
						this.getAttribute('table_id');
					}
				}, {
					key: 'optimize',
					value: function optimize(context) {
						(0, _get3.default)(Table.prototype.__proto__ || (0, _getPrototypeOf2.default)(Table.prototype), 'optimize', this).call(this, context);
						let next = this.next;
						if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && next.domNode.tagName === this.domNode.tagName && next.domNode.getAttribute('table_id') === this.domNode.getAttribute('table_id')) {
							next.moveChildren(this);
							next.remove();
						}
					}
				}, {
					key: 'insertBefore',
					value: function insertBefore(childBlot, refBlot) {
						if (this.statics.allowedChildren != null && !this.statics.allowedChildren.some(function (child) {
							return childBlot instanceof child;
						})) {
							let newChild = Parchment.create(this.statics.defaultChild, _TableTrick2.default.random_id());
							newChild.appendChild(childBlot);
							childBlot = newChild;
						}
						(0, _get3.default)(Table.prototype.__proto__ || (0, _getPrototypeOf2.default)(Table.prototype), 'insertBefore', this).call(this, childBlot, refBlot);
					}
				}], [{
					key: 'create',
					value: function create(value) {
						let tagName = 'table';
						let node = (0, _get3.default)(Table.__proto__ || (0, _getPrototypeOf2.default)(Table), 'create', this).call(this, tagName);
						node.setAttribute('table_id', value.id);
						let style = '';
						if (value.style) {
							style += value.style.width ? 'width: ' + value.style.width + ';' : + value.width + ';';
							style += value.style.height ? 'height: ' + value.style.height + ';' : '';
							style += value.style.backgroundColor ? 'background-color: ' + value.style.backgroundColor + ';' : '';
							style += value.style.textAlign ? 'text-align: ' + value.style.textAlign + ';' : '';
						}
						else {
							style = 'border-collapse: collapse;';
							style += value.width ? 'width: ' + value.width + 'px' + ';' : '100%';
						}
						node.setAttribute('style', style);
						node.addEventListener('click', function(e) {
							let table = e.currentTarget;
							if (table) {
								let tableDimensions = $(table).position();
								let editorStyle = window.getComputedStyle(e.currentTarget.parentElement);
								let editorMarginLeft = editorStyle.marginLeft ? parseFloat(editorStyle.marginLeft) : 0;
								let editorMarginRight = editorStyle.marginRight ? parseFloat(editorStyle.marginRight) : 0;
								let position = { top: tableDimensions.top, left: tableDimensions.left, marginLeft: editorMarginLeft, marginRight: editorMarginRight };
								_TableTrick2.default.show_overlay(e.currentTarget.parentElement.parentNode, position);
							}
						});

						return node;
					}
				}]);
				return Table;
			})(_ContainBlot3.default);

			Table.blotName = 'table';
			Table.tagName = 'table';
			Table.scope = Parchment.Scope.BLOCK_BLOT;
			Table.defaultChild = 'tr';
			Table.allowedChildren = [_TableRowBlot2.default];

			exports.default = Table;

			/***/ }),
		/* 132 */
		/***/ (function(module, exports, __webpack_require__) {

			// style-loader: Adds some css to the DOM by adding a <style> tag

			// load the styles
			var content = __webpack_require__(133);
			if(typeof content === 'string') content = [[module.i, content, '']];
			// Prepare cssTransformation
			var transform;

			var options = {'hmr' : true, 'embed' : false};
			options.transform = transform;
			// add the styles to the DOM
			var update = __webpack_require__(135)(content, options);
			if(content.locals) module.exports = content.locals;
			// Hot Module Replacement
			if(false) {
				// When the styles change, update the <style> tags
				if(!content.locals) {
					module.hot.accept('!!../../node_modules/css-loader/index.js!./quill.table.css', function() {
						var newContent = require('!!../../node_modules/css-loader/index.js!./quill.table.css');
						if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
						update(newContent);
					});
				}
				// When the module is disposed, remove the <style> tags
				module.hot.dispose(function() { update(); });
			}

			/***/ }),
		/* 133 */
		/***/ (function(module, exports, __webpack_require__) {

			exports = module.exports = __webpack_require__(134)(false);
			// imports


			// module
			exports.push([module.i, '.ql-editor table {\n    width: 100%;\n    border-collapse: collapse;\n}\n\n.ql-editor table td {\n    border: 1px solid black;\n    padding: 5px;\n    height: 25px;\n}\n\n.ql-formats button.ql-table::after,\n.ql-formats .ql-picker.ql-table .ql-picker-label::before {\n    content: " ";\n    display: block;\n    width: 18px;\n    height: 18px;\n    background-repeat: no-repeat;\n    background-size: contain;\n}\n\n.ql-picker.ql-table .ql-picker-label::before {\n    background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABcSURBVEhL3YsxDgBACML8/6fvNhd0aGCyCUuBOsULR5hGToStSHl8oB4fqMcH6rtIRZhGToStSHl8oB4fqMcH6rtIRZhGToStSHl8oB4fqMcH6rtIRZhGTk5Q9QFCcv8BMZAsCwAAAABJRU5ErkJggg==\');\n}\n\nbutton.ql-table[value="append-row"]::after {\n    background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC5SURBVEhL7ZNBCsIwFERzKxceQHGjqLcSFMHzKOpN1BOIe53BDgxJCjbRlX3woJnf/F9KEnq6MIE3+KyUPcYw4QpzG0q8wAQVa2nt0w8QfzpgCU/w0XiEc5ij84ANVC2WtRjVEuKLtoP8cs+EZzO4jbLsReP1ZkEvDeHZ1lR4doADW7PHCH4E/zc3tcHa/f1Yxs8H8LSwiRSe7RmUsoDeTHg2ZVDDGnpDdwW/Ao8iT4suGp+Z9dQSwgttSY+8S9IcOwAAAABJRU5ErkJggg==\');\n}\n\nbutton.ql-table[value="append-col"] {\n    padding-top: 0;\n}\n\nbutton.ql-table[value="append-col"]::after {\n    background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADXSURBVEhL3ZVLCsJADIbnVi48gOJGUW8lqCuPo6g3UU8g7vX/GQMhnUdmUZR+8MGQyaOUlIbBMYMP+K7InCls5g5TDVPeYDNSXMOb1+FvBuzhKB7b8A5Ywwt8fT3DJaziGbCDkmflXRFJzMEn1w0FHVswkMMWWq5QNxN07MRADlto4fsu3fPuGY9pfj6A2yI5Ok/HjgzksIWWFdTNBB2bM5DDFqbYQt1Qu4FFJLEGV5HbIh8az8X1FLwDDnAcj214B3jzOvQ+oPcfDn+DLEw11DJnAgdPCB8kS4+90nxt3AAAAABJRU5ErkJggg==\');\n}\n\n.ql-table,\n.ql-contain {\n    width: auto !important;\n    margin-right: 0;\n}\n\n.ql-picker.ql-table {\n    font-size: 11px;\n    font-weight: normal;\n}\n\n.ql-picker.ql-table svg {\n    display: none;\n}\n\n.ql-picker.ql-table .ql-picker-label {\n    padding: 2px 3px;\n}\n\n.ql-picker.ql-table .ql-picker-options {\n    width: 178px;\n}\n\n.ql-picker.ql-table .ql-picker-item {\n    display: block;\n    float: left;\n    width: 30px;\n    height: 30px;\n    line-height: 30px;\n    text-align: center;\n    padding: 0px;\n    margin: 1px;\n}\n\n.ql-picker.ql-table .ql-picker-item {\n    border: 1px solid #444;\n    color: #444;\n}\n\n.ql-picker.ql-table .ql-picker-item:hover {\n    border-color: #06c;\n}\n\n.ql-picker-item:nth-child(5):before {\n    clear: both;\n    display: block;\n    content: "";\n    width: 100%;\n}\n\n.ql-picker-item[data-value=newtable_1_1]:before {\n    content: "1x1";\n}\n\n.ql-picker-item[data-value=newtable_1_2]:before {\n    content: "1x2";\n}\n\n.ql-picker-item[data-value=newtable_1_3]:before {\n    content: "1x3";\n}\n\n.ql-picker-item[data-value=newtable_1_4]:before {\n    content: "1x4";\n}\n\n.ql-picker-item[data-value=newtable_1_5]:before {\n    content: "1x5";\n}\n\n.ql-picker-item[data-value=newtable_2_1]:before {\n    content: "2x1";\n}\n\n.ql-picker-item[data-value=newtable_2_2]:before {\n    content: "2x2";\n}\n\n.ql-picker-item[data-value=newtable_2_3]:before {\n    content: "2x3";\n}\n\n.ql-picker-item[data-value=newtable_2_4]:before {\n    content: "2x4";\n}\n\n.ql-picker-item[data-value=newtable_2_5]:before {\n    content: "2x5";\n}\n\n.ql-picker-item[data-value=newtable_3_1]:before {\n    content: "3x1";\n}\n\n.ql-picker-item[data-value=newtable_3_2]:before {\n    content: "3x2";\n}\n\n.ql-picker-item[data-value=newtable_3_3]:before {\n    content: "3x3";\n}\n\n.ql-picker-item[data-value=newtable_3_4]:before {\n    content: "3x4";\n}\n\n.ql-picker-item[data-value=newtable_3_5]:before {\n    content: "3x5";\n}\n\n.ql-picker-item[data-value=newtable_4_1]:before {\n    content: "4x1";\n}\n\n.ql-picker-item[data-value=newtable_4_2]:before {\n    content: "4x2";\n}\n\n.ql-picker-item[data-value=newtable_4_3]:before {\n    content: "4x3";\n}\n\n.ql-picker-item[data-value=newtable_4_4]:before {\n    content: "4x4";\n}\n\n.ql-picker-item[data-value=newtable_4_5]:before {\n    content: "4x5";\n}\n\n.ql-picker-item[data-value=newtable_5_1]:before {\n    content: "5x1";\n}\n\n.ql-picker-item[data-value=newtable_5_2]:before {\n    content: "5x2";\n}\n\n.ql-picker-item[data-value=newtable_5_3]:before {\n    content: "5x3";\n}\n\n.ql-picker-item[data-value=newtable_5_4]:before {\n    content: "5x4";\n}\n\n.ql-picker-item[data-value=newtable_5_5]:before {\n    content: "5x5";\n}\n\n.ql-picker-item[data-value=newtable_6_1]:before {\n    content: "6x1";\n}\n\n.ql-picker-item[data-value=newtable_6_2]:before {\n    content: "6x2";\n}\n\n.ql-picker-item[data-value=newtable_6_3]:before {\n    content: "6x3";\n}\n\n.ql-picker-item[data-value=newtable_6_4]:before {\n    content: "6x4";\n}\n\n.ql-picker-item[data-value=newtable_6_5]:before {\n    content: "6x5";\n}\n\n.ql-picker-item[data-value=newtable_7_1]:before {\n    content: "7x1";\n}\n\n.ql-picker-item[data-value=newtable_7_2]:before {\n    content: "7x2";\n}\n\n.ql-picker-item[data-value=newtable_7_3]:before {\n    content: "7x3";\n}\n\n.ql-picker-item[data-value=newtable_7_4]:before {\n    content: "7x4";\n}\n\n.ql-picker-item[data-value=newtable_7_5]:before {\n    content: "7x5";\n}\n\n.ql-picker-item[data-value=newtable_8_1]:before {\n    content: "8x1";\n}\n\n.ql-picker-item[data-value=newtable_8_2]:before {\n    content: "8x2";\n}\n\n.ql-picker-item[data-value=newtable_8_3]:before {\n    content: "8x3";\n}\n\n.ql-picker-item[data-value=newtable_8_4]:before {\n    content: "8x4";\n}\n\n.ql-picker-item[data-value=newtable_8_5]:before {\n    content: "8x5";\n}\n\n.ql-picker-item[data-value=newtable_9_1]:before {\n    content: "9x1";\n}\n\n.ql-picker-item[data-value=newtable_9_2]:before {\n    content: "9x2";\n}\n\n.ql-picker-item[data-value=newtable_9_3]:before {\n    content: "9x3";\n}\n\n.ql-picker-item[data-value=newtable_9_4]:before {\n    content: "9x4";\n}\n\n.ql-picker-item[data-value=newtable_9_5]:before {\n    content: "9x5";\n}\n\n.ql-picker-item[data-value=newtable_10_1]:before {\n    content: "10x1";\n}\n\n.ql-picker-item[data-value=newtable_10_2]:before {\n    content: "10x2";\n}\n\n.ql-picker-item[data-value=newtable_10_3]:before {\n    content: "10x3";\n}\n\n.ql-picker-item[data-value=newtable_10_4]:before {\n    content: "10x4";\n}\n\n.ql-picker-item[data-value=newtable_10_5]:before {\n    content: "10x5";\n}\n', '']);

			// exports


			/***/ }),
		/* 134 */
		/***/ (function(module, exports) {

			/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
			// css base code, injected by the css-loader
			module.exports = function(useSourceMap) {
				var list = [];

				// return the list of modules as css string
				list.toString = function toString() {
					return this.map(function (item) {
						var content = cssWithMappingToString(item, useSourceMap);
						if(item[2]) {
							return '@media ' + item[2] + '{' + content + '}';
						} else {
							return content;
						}
					}).join('');
				};

				// import a list of modules into the list
				list.i = function(modules, mediaQuery) {
					if(typeof modules === 'string')
						modules = [[null, modules, '']];
					var alreadyImportedModules = {};
					for(var i = 0; i < this.length; i++) {
						var id = this[i][0];
						if(typeof id === 'number')
							alreadyImportedModules[id] = true;
					}
					for(i = 0; i < modules.length; i++) {
						var item = modules[i];
						// skip already imported module
						// this implementation is not 100% perfect for weird media query combinations
						//  when a module is imported multiple times with different media queries.
						//  I hope this will never occur (Hey this way we have smaller bundles)
						if(typeof item[0] !== 'number' || !alreadyImportedModules[item[0]]) {
							if(mediaQuery && !item[2]) {
								item[2] = mediaQuery;
							} else if(mediaQuery) {
								item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
							}
							list.push(item);
						}
					}
				};
				return list;
			};

			function cssWithMappingToString(item, useSourceMap) {
				var content = item[1] || '';
				var cssMapping = item[3];
				if (!cssMapping) {
					return content;
				}

				if (useSourceMap && typeof btoa === 'function') {
					var sourceMapping = toComment(cssMapping);
					var sourceURLs = cssMapping.sources.map(function (source) {
						return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
					});

					return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
				}

				return [content].join('\n');
			}

			// Adapted from convert-source-map (MIT)
			function toComment(sourceMap) {
				// eslint-disable-next-line no-undef
				var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
				var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

				return '/*# ' + data + ' */';
			}


			/***/ }),
		/* 135 */
		/***/ (function(module, exports, __webpack_require__) {

			/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

			var stylesInDom = {};

			var	memoize = function (fn) {
				var memo;

				return function () {
					if (typeof memo === 'undefined') memo = fn.apply(this, arguments);
					return memo;
				};
			};

			var isOldIE = memoize(function () {
				// Test for IE <= 9 as proposed by Browserhacks
				// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
				// Tests for existence of standard globals is to allow style-loader
				// to operate correctly into non-standard environments
				// @see https://github.com/webpack-contrib/style-loader/issues/177
				return window && document && document.all && !window.atob;
			});

			var getElement = (function (fn) {
				var memo = {};

				return function(selector) {
					if (typeof memo[selector] === 'undefined') {
						var styleTarget = fn.call(this, selector);
						// Special case to return head of iframe instead of iframe itself
						if (styleTarget instanceof window.HTMLIFrameElement) {
							try {
								// This will throw an exception if access to iframe is blocked
								// due to cross-origin restrictions
								styleTarget = styleTarget.contentDocument.head;
							} catch(e) {
								styleTarget = null;
							}
						}
						memo[selector] = styleTarget;
					}
					return memo[selector];
				};
			})(function (target) {
				return document.querySelector(target);
			});

			var singleton = null;
			var	singletonCounter = 0;
			var	stylesInsertedAtTop = [];

			var	fixUrls = __webpack_require__(136);

			module.exports = function (list, options) {
				if (typeof DEBUG !== 'undefined' && DEBUG) {
					if (typeof document !== 'object') throw new Error('The style-loader cannot be used in a non-browser environment');
				}

				options = options || {};

				if (options.embed) {

					options.attrs = typeof options.attrs === 'object' ? options.attrs : {};

					// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
					// tags it will allow on a page
					if (!options.singleton && typeof options.singleton !== 'boolean') options.singleton = isOldIE();

					// By default, add <style> tags to the <head> element
					if (!options.insertInto) options.insertInto = 'head';

					// By default, add <style> tags to the bottom of the target
					if (!options.insertAt) options.insertAt = 'bottom';

					var styles = listToStyles(list, options);

					addStylesToDom(styles, options);

					return function update(newList) {
						var mayRemove = [];

						for (var i = 0; i < styles.length; i++) {
							var item = styles[i];
							var domStyle = stylesInDom[item.id];

							domStyle.refs--;
							mayRemove.push(domStyle);
						}

						if (newList) {
							var newStyles = listToStyles(newList, options);
							addStylesToDom(newStyles, options);
						}

						for (var i = 0; i < mayRemove.length; i++) {
							var domStyle = mayRemove[i];

							if (domStyle.refs === 0) {
								for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

								delete stylesInDom[domStyle.id];
							}
						}
					};
				}
			};

			function addStylesToDom(styles, options) {
				for (var i = 0; i < styles.length; i++) {
					var item = styles[i];
					var domStyle = stylesInDom[item.id];

					if (domStyle) {
						domStyle.refs++;

						for (var j = 0; j < domStyle.parts.length; j++) {
							domStyle.parts[j](item.parts[j]);
						}

						for (; j < item.parts.length; j++) {
							domStyle.parts.push(addStyle(item.parts[j], options));
						}
					} else {
						var parts = [];

						for (var j = 0; j < item.parts.length; j++) {
							parts.push(addStyle(item.parts[j], options));
						}

						stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
					}
				}
			}

			function listToStyles (list, options) {
				var styles = [];
				var newStyles = {};

				for (var i = 0; i < list.length; i++) {
					var item = list[i];
					var id = options.base ? item[0] + options.base : item[0];
					var css = item[1];
					var media = item[2];
					var sourceMap = item[3];
					var part = {css: css, media: media, sourceMap: sourceMap};

					if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
					else newStyles[id].parts.push(part);
				}

				return styles;
			}

			function insertStyleElement (options, style) {
				var target = getElement(options.insertInto);

				if (!target) {
					throw new Error('Couldn\'t find a style target. This probably means that the value for the \'insertInto\' parameter is invalid.');
				}

				var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

				if (options.insertAt === 'top') {
					if (!lastStyleElementInsertedAtTop) {
						target.insertBefore(style, target.firstChild);
					} else if (lastStyleElementInsertedAtTop.nextSibling) {
						target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
					} else {
						target.appendChild(style);
					}
					stylesInsertedAtTop.push(style);
				} else if (options.insertAt === 'bottom') {
					target.appendChild(style);
				} else if (typeof options.insertAt === 'object' && options.insertAt.before) {
					var nextSibling = getElement(options.insertInto + ' ' + options.insertAt.before);
					target.insertBefore(style, nextSibling);
				} else {
					throw new Error('[Style Loader]\n\n Invalid value for parameter \'insertAt\' (\'options.insertAt\') found.\n Must be \'top\', \'bottom\', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n');
				}
			}

			function removeStyleElement (style) {
				if (style.parentNode === null) return false;
				style.parentNode.removeChild(style);

				var idx = stylesInsertedAtTop.indexOf(style);
				if(idx >= 0) {
					stylesInsertedAtTop.splice(idx, 1);
				}
			}

			function createStyleElement (options) {
				var style = document.createElement('style');

				options.attrs.type = 'text/css';

				addAttrs(style, options.attrs);
				insertStyleElement(options, style);

				return style;
			}

			function createLinkElement (options) {
				var link = document.createElement('link');

				options.attrs.type = 'text/css';
				options.attrs.rel = 'stylesheet';

				addAttrs(link, options.attrs);
				insertStyleElement(options, link);

				return link;
			}

			function addAttrs (el, attrs) {
				Object.keys(attrs).forEach(function (key) {
					el.setAttribute(key, attrs[key]);
				});
			}

			function addStyle (obj, options) {
				var style, update, remove, result;

				// If a transform function was defined, run it on the css
				if (options.transform && obj.css) {
					result = options.transform(obj.css);

					if (result) {
						// If transform returns a value, use that instead of the original css.
						// This allows running runtime transformations on the css.
						obj.css = result;
					} else {
						// If the transform function returns a falsy value, don't add this css.
						// This allows conditional loading of css
						return function() {
							// noop
						};
					}
				}

				if (options.singleton) {
					var styleIndex = singletonCounter++;

					style = singleton || (singleton = createStyleElement(options));

					update = applyToSingletonTag.bind(null, style, styleIndex, false);
					remove = applyToSingletonTag.bind(null, style, styleIndex, true);

				} else if (
					obj.sourceMap &&
                    typeof URL === 'function' &&
                    typeof URL.createObjectURL === 'function' &&
                    typeof URL.revokeObjectURL === 'function' &&
                    typeof Blob === 'function' &&
                    typeof btoa === 'function'
				) {
					style = createLinkElement(options);
					update = updateLink.bind(null, style, options);
					remove = function () {
						removeStyleElement(style);

						if(style.href) URL.revokeObjectURL(style.href);
					};
				} else {
					style = createStyleElement(options);
					update = applyToTag.bind(null, style);
					remove = function () {
						removeStyleElement(style);
					};
				}

				update(obj);

				return function updateStyle (newObj) {
					if (newObj) {
						if (
							newObj.css === obj.css &&
                            newObj.media === obj.media &&
                            newObj.sourceMap === obj.sourceMap
						) {
							return;
						}

						update(obj = newObj);
					} else {
						remove();
					}
				};
			}

			var replaceText = (function () {
				var textStore = [];

				return function (index, replacement) {
					textStore[index] = replacement;

					return textStore.filter(Boolean).join('\n');
				};
			})();

			function applyToSingletonTag (style, index, remove, obj) {
				var css = remove ? '' : obj.css;

				if (style.styleSheet) {
					style.styleSheet.cssText = replaceText(index, css);
				} else {
					var cssNode = document.createTextNode(css);
					var childNodes = style.childNodes;

					if (childNodes[index]) style.removeChild(childNodes[index]);

					if (childNodes.length) {
						style.insertBefore(cssNode, childNodes[index]);
					} else {
						style.appendChild(cssNode);
					}
				}
			}

			function applyToTag (style, obj) {
				var css = obj.css;
				var media = obj.media;

				if(media) {
					style.setAttribute('media', media);
				}

				if(style.styleSheet) {
					style.styleSheet.cssText = css;
				} else {
					while(style.firstChild) {
						style.removeChild(style.firstChild);
					}

					style.appendChild(document.createTextNode(css));
				}
			}

			function updateLink (link, options, obj) {
				var css = obj.css;
				var sourceMap = obj.sourceMap;

				/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
				var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

				if (options.convertToAbsoluteUrls || autoFixUrls) {
					css = fixUrls(css);
				}

				if (sourceMap) {
					// http://stackoverflow.com/a/26603875
					css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */';
				}

				var blob = new Blob([css], { type: 'text/css' });

				var oldSrc = link.href;

				link.href = URL.createObjectURL(blob);

				if(oldSrc) URL.revokeObjectURL(oldSrc);
			}


			/***/ }),
		/* 136 */
		/***/ (function(module, exports) {


			/**
             * When source maps are enabled, `style-loader` uses a link element with a data-uri to
             * embed the css on the page. This breaks all relative urls because now they are relative to a
             * bundle instead of the current page.
             *
             * One solution is to only use full urls, but that may be impossible.
             *
             * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
             *
             * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
             *
             */

			module.exports = function (css) {
				// get current location
				var location = typeof window !== 'undefined' && window.location;

				if (!location) {
					throw new Error('fixUrls requires window.location');
				}

				// blank or null?
				if (!css || typeof css !== 'string') {
					return css;
				}

				var baseUrl = location.protocol + '//' + location.host;
				var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, '/');

				// convert each url(...)
				/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
				var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
					// strip quotes (if they exist)
					var unquotedOrigUrl = origUrl
						.trim()
						.replace(/^"(.*)"$/, function(o, $1){ return $1; })
						.replace(/^'(.*)'$/, function(o, $1){ return $1; });

					// already a full url? no change
					if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
						return fullMatch;
					}

					// convert the url to a full url
					var newUrl;

					if (unquotedOrigUrl.indexOf('//') === 0) {
						// TODO: should we add protocol?
						newUrl = unquotedOrigUrl;
					} else if (unquotedOrigUrl.indexOf('/') === 0) {
						// path should be relative to the base url
						newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
					} else {
						// path should be relative to current directory
						newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ''); // Strip leading './'
					}

					// send back the fixed url(...)
					return 'url(' + JSON.stringify(newUrl) + ')';
				});

				// send back the fixed css
				return fixedCss;
			};


			/***/ })
		/******/ ]);
});
// # sourceMappingURL=quill-table.js.map