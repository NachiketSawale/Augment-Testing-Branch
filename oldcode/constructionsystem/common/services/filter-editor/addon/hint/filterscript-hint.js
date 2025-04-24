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

	var pos = CodeMirror.Pos;


	function arrayContains(arr, item) {
		if (!Array.prototype.indexOf) {
			var i = arr.length;
			while (i--) {
				if (arr[i] === item) {
					return true;
				}
			}
			return false;
		}
		return arr.indexOf(item) !== -1;
	}


	function scriptHint(editor, getToken, options) {
		var d = new Date();
		// Find the token at the cursor
		var cur = editor.getCursor(), token = getToken(editor, cur), lastToken;
		var lastPos = {ch: cur.ch, line: cur.line};
		var end = cur.ch, start = end;

		if (token.string && token.string !== '' && token.string !== ' ' && token.string !== '(' && token.string.length && token.string.length > 0) {
			start = token.start;
			end = start + token.string.length;
		}

		if (lastPos.ch > 0) {
			lastPos.ch -= 1;
			lastToken = getToken(editor, lastPos);

			while (lastToken.string === ' ' || (token.string !== '' && lastToken.string === token.string)) {
				lastPos.ch -= 1;
				lastToken = getToken(editor, lastPos);
			}
		}
		if (lastPos.line > 0 && (!lastToken || lastToken.string === '')) {
			var lastLineTokens = null;
			while (lastPos.line >= 0) {
				lastLineTokens = editor.getLineTokens(--lastPos.line);
				if (lastLineTokens && lastLineTokens.length) {
					var tempToken = lastLineTokens[lastLineTokens.length - 1];
					if (tempToken.string === ' ' || (tempToken.string !== '' && tempToken.string === token.string)) {
						continue;
					} else {
						lastToken = tempToken;
						break;
					}
				}
			}

		}
		if (!lastToken) {
			lastToken = token;
		}

		token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

		if (token.end > cur.ch) {
			token.end = cur.ch;
			token.string = token.string.slice(0, cur.ch - token.start);
			end = token.end;
			if (token.type === 'string') {
				var vIndex = token.string.lastIndexOf('@');
				if (vIndex !== -1) {
					start = token.start + vIndex;
				}
			}
		}

		token.lastToken = lastToken;
		var context = null;// to be used for context

		var result = {
			list: getCompletions(token, context, options),
			from: pos(cur.line, start),
			to: pos(cur.line, end)
		};

		editor.options.hintService.addDescription(result);
		console.log('show hint costs', new Date() - d, 'ms.');
		return result;
	}


	var methods = {};
	var javascriptKeywords = [];
	var operators = [];
	var ov = [];
	var propertys = [];
	var variables = [];

	function filterscriptHint(editor, options) {

		if (editor.options.defs && editor.options.defs instanceof Array && editor.options.defs.length > 2) {
			var filterDef = editor.options.defs[0];
			methods = filterDef.methods;
			javascriptKeywords = filterDef.keywords;
			operators = filterDef.operators;
			ov = filterDef.ov;

			propertys = editor.options.defs[1];

			if (editor.options.selectionParameters && editor.options.selectionParameters instanceof Array) {
				variables = editor.options.selectionParameters;
			}
		}

		return scriptHint(editor,
			function (e, cur) {
				return e.getTokenAt(cur);
			},
			options);
	}

	CodeMirror.registerHelper('hint', 'filterscript', filterscriptHint);

	function getCompletions(token/* , context, keywords, options */) {
		var found = [], start = token.string;
		var limitCountOfProps = 1000;

		function forEach(arr, f, className, limitCount) {
			if (arr) {
				if (arr instanceof Array) {
					for (var i = 0, e = arr.length; i < e; ++i) {
						f(arr[i], className);
						if(limitCount && limitCount > 0){
							if(found.length > limitCount){
								break;
							}
						}
					}
				} else if (typeof arr === 'object') {
					for (var p in arr) {
						if (Object.prototype.hasOwnProperty.call(arr,p)) {
							f(arr[p], className);
						}
					}
				}
			}
		}

		function maybeAdd(obj, className) {
			var tempStart = start.toUpperCase().replace(/[[\]]/ig, '');
			var tempStr = '';
			var text = '';
			var desc = '';
			className = className || '';
			if (typeof obj === 'string') {
				tempStr = obj.toUpperCase().replace(/[[\]]/ig, '');
				text = obj;
			} else {
				tempStr = obj.text.toUpperCase().replace(/[[\]]/ig, '');
				text = obj.text;
				desc = obj.description || '';
			}

			if (tempStr.lastIndexOf(tempStart, 0) === 0 && !arrayContains(found, obj)) {
				found.push({text: text, description: desc, className: className});
			}

		}

		function maybeAddVariable(obj, className) {
			var tempStart = start;
			var tempStr = '';
			var text = '';
			var desc = '';
			className = className || '';
			if (typeof obj === 'string') {
				tempStr = obj.toUpperCase().replace(/[@[\]]/ig, '');
				text = obj;
			} else {
				tempStr = obj.text.toUpperCase().replace(/[@[\]]/ig, '');
				text = obj.text;
				desc = obj.description || '';
			}

			if (tempStr.lastIndexOf(tempStart, 0) === 0 && !arrayContains(found, obj)) {
				found.push({text: text, description: desc, className: className});
			}
		}

		function gatherCompletions(type) {
			if (!type) {
				forEach([], maybeAdd);
				return;
			}
			if (type === 'all' || type === 'keyword') {
				forEach(javascriptKeywords, maybeAdd, getClassNameByType('keyword'));
			}
			if (type === 'all' || type === 'method') {
				forEach(methods, maybeAdd, getClassNameByType('method'));
			}
			if (type === 'all' || type === 'property') {
				forEach(propertys, maybeAdd, getClassNameByType('property'), limitCountOfProps);
			}
			if (type === 'operator') {
				forEach(operators, maybeAdd, getClassNameByType('operator'));
			}
			if (type === 'ov') {
				forEach(ov, maybeAdd, getClassNameByType('ov'));
			}
			if (type === '(') {
				forEach(['('], maybeAdd);
			}
			if (type === 'variable') {
				start = start.toUpperCase().replace(/[@[\]]/ig, '');
				forEach(variables, maybeAddVariable, getClassNameByType('variable'));
			}
			if (type === 'string.variable') {
				var tempStart = '';
				var variableRegex = /@[[]{0,1}([a-zA-Z_]{1}[a-zA-Z0-9_]*)[\]]{0,1}/ig;
				var execResult = variableRegex.exec(start);
				if (execResult && execResult[1]) {
					tempStart = execResult[1];
				}
				start = tempStart.toUpperCase();
				forEach(variables, maybeAddVariable, getClassNameByType('variable'));
			}
		}

		function getClassNameByType(type) {
			var tempType = 'unknown';
			if (type === 'method') {
				tempType = 'fn';
			}
			else if (type === 'property') {
				tempType = 'object';
			}
			else {
				tempType = 'unknown';
			}
			return 'CodeMirror-Tern-completion CodeMirror-Tern-completion-' + tempType;
		}

		function checkLastToken(token) {
			if (token.lastToken.type === 'keyword') {
				gatherCompletions('method');
				gatherCompletions('property');
			} else if (token.lastToken.type === 'ov' || token.lastToken.type === 'string' || token.lastToken.type === 'number' || token.lastToken.type === 'atom') {
				gatherCompletions('keyword');
			} else if (token.lastToken.type === 'property') {
				gatherCompletions('operator');
				gatherCompletions('ov');
			} else if (token.lastToken.type === 'operator') {
				gatherCompletions(null);
			} else if (token.lastToken.string === '') {
				gatherCompletions('method');
				gatherCompletions('property');
			} else if (token.lastToken.string === '(') {
				gatherCompletions('property');
			} else if (token.lastToken.string === ' ' || token.lastToken.string === ')') {
				gatherCompletions('keyword');
			} else if (token.lastToken.string === ',') {
				gatherCompletions(null);
			} else {
				gatherCompletions('all');
			}
		}

		if (token.string === '') {
			start = '';
			if (token.lastToken.type === 'method') {
				gatherCompletions('(');
			} else {
				checkLastToken(token);
			}
		} else if (token.string === '(') {
			start = '';
			if (token.lastToken.type === 'keyword') {
				gatherCompletions('method');
				gatherCompletions('property');
			} else if (token.lastToken.type === 'method') {
				gatherCompletions('property');
			} else if (token.lastToken.type === 'property') {
				gatherCompletions(null);
			} else {
				checkLastToken(token);
			}
		} else if (token.string === ' ') {
			start = '';
			if (token.lastToken.type === 'method') {
				gatherCompletions('(');
			} else {
				checkLastToken(token);
			}
		} else if (token.string === ',') {
			gatherCompletions(null);
		} else if (token.string.indexOf('@') !== -1) {
			if (token.type === 'variable') {
				gatherCompletions('variable');
			} else if (token.type === 'string') {
				gatherCompletions('string.variable');
			}
		} else {
			checkLastToken(token);
		}
		return found;
	}

});
