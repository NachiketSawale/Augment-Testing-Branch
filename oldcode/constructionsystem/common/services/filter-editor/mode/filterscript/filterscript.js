/**
 * Created by lst on 2/27/2017.
 */

/* global CodeMirror,require,define,exports */
/* jshint -W038 */
/* jshint -W089 */
(function (mod) {
	'use strict';
	if (typeof exports === 'object' && typeof module === 'object') {
		mod(require('../../lib/codemirror'));
	} // CommonJS
	else if (typeof define === 'function' && define.amd) {
		define(['../../lib/codemirror'], mod);
	} // AMD
	else {
		mod(CodeMirror);
	} // Plain browser env

})(function (CodeMirror) {
	'use strict';

	CodeMirror.defineMode('filterscript', function (/* options */) {

		var wordRE = /[\w$\xa1-\uffff]/;


		function kw(type) {
			return {type: type, style: type};
		}

		var keywords = {};

		var objectPorperties = [];

		var parameterVariables = [];

		CodeMirror.optionHandlers.defs = function (cm, defs) {
			if (defs && defs instanceof Array && defs.length > 1) {
				keywords = {};// clear
				objectPorperties = [];

				var A = kw('keyword'), B = kw('method');
				var operator = kw('operator'), ov = kw('ov'), atom = kw('atom');

				var filterDef = defs[0];

				for (var method in  filterDef.methods) {
					keywords[method] = B;
				}

				for (var k in filterDef.keywords) {
					keywords[filterDef.keywords[k]] = A;
				}

				for (var o in filterDef.operators) {
					keywords[filterDef.operators[o]] = operator;
				}

				for (var operatorValue in filterDef.ov) {
					keywords[filterDef.ov[operatorValue]] = ov;
				}

				for (var atomValue in filterDef.atom) {
					keywords[filterDef.atom[atomValue]] = atom;
				}

				var properties = defs[1];
				for (var prop in properties) {
					objectPorperties.push(prop.text);
				}
			}
		};

		CodeMirror.optionHandlers.selectionParameters = function (cm, selectionParameters) {
			if (selectionParameters && selectionParameters instanceof Array) {
				parameterVariables = [];
				for (var v in selectionParameters) {
					parameterVariables.push(v.text);
				}
			}
		};

		var operatorCharRegex = /[+\-*&%=<>!?|~^]/;

		function readRegexp(stream) {
			var escaped = false, next, inSet = false;
			while ((next = stream.next())) {
				if (!escaped) {
					if (next === '/' && !inSet) {
						return;
					}
					if (next === '[') {
						inSet = true;
					}
					else if (inSet && next === ']') {
						inSet = false;
					}
				}
				escaped = !escaped && next === '\\';
			}
		}

		// eslint-disable-next-line no-unused-vars
		var type, content;

		function ret(tp, style, cont) {
			type = tp;
			content = cont;
			return style;
		}


		function tokenBase(stream, state) {
			var ch = stream.next();
			if (ch === '"' || ch === '\'') {
				state.tokenize = tokenString(ch);
				return state.tokenize(stream, state);
			} else if (ch === '.' && stream.match(/^\d+(?:[eE][+-]?\d+)?/)) {
				return ret('number', 'number');
			} else if (/[(),;:.]/.test(ch)) {
				return ret(ch);
			} else if (ch === '0' && stream.eat(/x/i)) {
				stream.eatWhile(/[\da-f]/i);
				return ret('number', 'number');
			} else if (ch === '0' && stream.eat(/o/i)) {
				stream.eatWhile(/[0-7]/i);
				return ret('number', 'number');
			} else if (ch === '0' && stream.eat(/b/i)) {
				stream.eatWhile(/[01]/i);
				return ret('number', 'number');
			} else if (/\d/.test(ch)) {
				stream.match(/^\d*(?:\.\d*)?(?:[eE][+-]?\d+)?/);
				return ret('number', 'number');
			} else if (ch === '/') {
				if (stream.eat('*')) {
					state.tokenize = tokenComment;
					return tokenComment(stream, state);
				} else if (stream.eat('/')) {
					stream.skipToEnd();
					return ret('comment', 'comment');
				} else if (/\/[\W\w]+\//.test(stream.string)) {
					readRegexp(stream);
					stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
					return ret('regexp', 'string-2');
				} else {
					stream.eatWhile(operatorCharRegex);
					return ret('operator', 'operator', stream.current());
				}
			} else if (operatorCharRegex.test(ch)) {
				stream.eatWhile(operatorCharRegex);
				var w = stream.current();
				// eslint-disable-next-line no-prototype-builtins
				var k = keywords.propertyIsEnumerable(w) && keywords[w];
				if (k) {
					return ret(k.type, k.style, w);
				}
				return ret(w);
			} else if (ch === '[') {
				state.tokenize = tokenLongProperty();
				return state.tokenize(stream, state);
			} else if (ch === '@') {
				state.tokenize = tokenVaribale();
				return state.tokenize(stream, state);
			} else if (wordRE.test(ch)) {
				if (ch === 'i') {
					stream.eatWhile(wordRE);
					var res = checkIsNullExpression(stream);
					if (res) {
						return res;
					} else {
						return checkKeyWords(stream);
					}
				} else {
					return checkKeyWords(stream);
				}
			}
		}

		function checkIsNullExpression(stream) {
			var word = stream.current(), known, newWord;
			if (/is/ig.test(word) && stream.eatSpace()) {
				stream.eatWhile(wordRE);
				newWord = stream.current();
				if (/is null/ig.test(newWord)) {
					newWord = newWord.toLowerCase();
					// eslint-disable-next-line no-prototype-builtins
					known = keywords.propertyIsEnumerable(newWord) && keywords[newWord];
					if (known) {
						return ret(known.type, known.style, newWord);
					}
				} else {
					if (/is not/ig.test(newWord) && stream.eatSpace()) {
						stream.eatWhile(wordRE);
						var res = checkIsNotNullExpression(stream);
						if (res) {
							return res;
						}
					}
				}
			}
			backUpTo(stream, 'is');
		}

		function checkIsNotNullExpression(stream) {
			var word = stream.current(), known;
			if (/is not null/ig.test(word)) {
				word = word.toLowerCase();
				// eslint-disable-next-line no-prototype-builtins
				known =  keywords.propertyIsEnumerable(word) && keywords[word];
				if (known) {
					return ret(known.type, known.style, word);
				}
			}
			backUpTo(stream, 'is');
		}

		function backUpTo(stream, backToWord) {
			var word = stream.current();
			var backLen = word.length - backToWord.length;
			stream.backUp(backLen);
		}

		function checkKeyWords(stream) {
			stream.eatWhile(wordRE);
			// take long property like object.description
			while (stream.eat('.')) {
				stream.eatWhile(wordRE);
			}
			var word = stream.current(), known;
			if (word === 'not') {
				var isSpace = stream.eatSpace();
				if (isSpace) {
					stream.eatWhile(wordRE);
					var newWord = stream.current();
					if (/not like|not exists/ig.test(newWord)) {
						newWord = newWord.toLowerCase();
						// eslint-disable-next-line no-prototype-builtins
						known = keywords.propertyIsEnumerable(newWord) && keywords[newWord];
						if (known) {
							return ret(known.type, known.style, newWord);
						}
					}
				}
				backUpTo(stream, 'not');
			}

			// eslint-disable-next-line no-prototype-builtins
			known = keywords.propertyIsEnumerable(word) && keywords[word];
			if (known) {
				return ret(known.type, known.style, word);
			}

			return ret('property', 'property');
		}

		function tokenString(quote) {
			return function (stream, state) {
				var escaped = false, next;
				while ((next = stream.next())) {
					if (next === quote && !escaped) {
						break;
					}
					escaped = !escaped && next === '\\';
				}
				if (!escaped) {
					state.tokenize = tokenBase;
				}
				return ret('string', 'string');
			};
		}

		function tokenLongProperty() {
			return function (stream, state) {
				var next;
				while ((next = stream.next())) {
					if (next === ']' || next === '[') {
						break;
					}
				}
				state.tokenize = tokenBase;
				return ret('property', 'property');
			};
		}

		function tokenVaribale() {
			return function (stream, state) {
				var next = stream.next();
				if (next === '[') {
					while ((next = stream.next())) {
						if (next === ']' || next === '[') {
							break;
						}
						if (next === ' ') {
							stream.backUp(1);
							break;
						}
					}
					state.tokenize = tokenBase;
					return ret('variable', 'variable');
				} else {
					if (next === ' ' || next === ']') {
						if (next === ' ') {
							stream.backUp(1);
						}
					} else {
						while ((next = stream.next())) {
							if (next === ']' || next === '[') {
								break;
							}
							if (next === ' ') {
								stream.backUp(1);
								break;
							}
						}
					}
					state.tokenize = tokenBase;
					return ret('variable', 'variable');
				}
			};
		}

		function tokenComment(stream, state) {
			var maybeEnd = false, ch;
			while ((ch = stream.next())) {
				if (ch === '/' && maybeEnd) {
					state.tokenize = tokenBase;
					break;
				}
				maybeEnd = (ch === '*');
			}
			return ret('comment', 'comment');
		}


		// Interface
		return {
			startState: function (basecolumn) {
				return {
					tokenize: tokenBase,
					scope: {offset: basecolumn || 0, type: 'filter', prev: null, align: false},
					indented: basecolumn || 0
				};
			},

			token: function (stream, state) {
				return state.tokenize(stream, state);
			},

			indent: function () {

			}
		};
	});

});

