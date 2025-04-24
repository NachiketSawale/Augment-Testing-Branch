/**
 * Created by lst on 5/4/2017.
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


	CodeMirror.HintService = function () {
		var self = this;
		if (!(self instanceof CodeMirror.HintService)) {
			self = new CodeMirror.HintService();
		}
		self.tooltip = null;
		self.tokenString = null;
	};

	CodeMirror.HintService.prototype = {
		addDescription: function (ulObj) {
			descriptionHint(ulObj, this);
		},
		cursorActivityHint: function (cm) {
			cursorActivityHint(cm, this);
		}

	};

	function elt(tagname, cls /* , ... elts */) {
		var e = document.createElement(tagname);
		if (cls) {
			e.className = cls;
		}
		for (var i = 2; i < arguments.length; ++i) {
			var elt = arguments[i];
			if (typeof elt === 'string') {
				elt = document.createTextNode(elt);
			}
			e.appendChild(elt);
		}
		return e;
	}

	function makeTooltip(x, y, content) {
		var node = elt('div', 'CodeMirror-Tern-tooltip', content);
		node.style.left = x + 'px';
		node.style.top = y + 'px';
		document.body.appendChild(node);
		return node;
	}

	function remove(node) {
		var p = node && node.parentNode;
		if (p) {
			p.removeChild(node);
		}
	}

	function cursorActivityHint(cm, hs) {
		remove(hs.tooltip);

		// data is not loaded. do not process
		if(!(cm.options.defs&&cm.options.defs.length>1)){
			return;
		}

		function getToken(e, cur) {
			return e.getTokenAt(cur);
		}

		var cur = cm.getCursor(), token = getToken(cm, cur), content;

		var lastPos = {ch: cur.ch, line: cur.line};
		var lastToken = token;
		var found = false, needBreak = false;

		function isFundLastToken() {
			if (lastToken.string !== '' && (lastToken.type === 'method' || lastToken.type === 'property')) {
				return true;
			}
			if (lastToken && lastToken.type === 'keyword') {
				needBreak = true;
			}
		}

		found = isFundLastToken();

		while (!found && !needBreak && lastPos.ch > 0) {
			lastPos.ch = lastToken.start;
			lastToken = getToken(cm, lastPos);
			found = isFundLastToken();
		}

		var lineIdx = lastPos.line;
		while (!found && !needBreak && lineIdx > 0) {
			var lastLineTokens = cm.getLineTokens(--lineIdx);
			var tksIdx = lastLineTokens.length;
			while (!found && !needBreak && tksIdx > 0) {
				lastToken = lastLineTokens[--tksIdx];
				found = isFundLastToken();
			}
		}

		if (!found || needBreak) {
			return;
		} else {
			token = lastToken;
		}

		if (token.type === 'method') {
			var method = cm.options.defs[0].methods[token.string];
			var cls = 'CodeMirror-Tern-';
			content = elt('span', null, elt('span', cls + 'fname', method.name), '(');
			for (var i = 0; i < method.params.length; ++i) {
				if (i) {
					content.appendChild(document.createTextNode(', '));
				}
				var arg = method.params[i];
				content.appendChild(elt('span', cls + 'farg', arg.name));
				content.appendChild(document.createTextNode(':\u00a0'));
				content.appendChild(elt('span', cls + 'type', arg.type));
			}
			content.appendChild(document.createTextNode(')'));


			// if(method.description){
			// var br = elt('br');
			// content = elt('span', '', content, br, method.description);
			// }

		} else if (token.type === 'property') {
			var props = cm.options.defs[1];
			var propName = '', tips = '';
			for (var p in  props) {
				if (props[p].text === token.string) {
					propName = props[p].name;
					if (tips) {
						tips += ' or ';
					}
					tips += props[p].description;
				}
			}

			if (propName) {
				content = elt('span', '', elt('strong', null, propName), ' (' + tips + ')');
			}
		}

		if (!content) {
			return;
		}

		var place = cm.cursorCoords(null, 'page');
		hs.tooltip = makeTooltip(place.right + 1, place.bottom, content);
		hs.tooltip.className += ' ' + 'CodeMirror-Tern-hint-doc';

		cm.on('blur', function () {
			setTimeout(remove(hs.tooltip), 200);
		});
	}

	function descriptionHint(obj, hs) {

		CodeMirror.on(obj, 'close', function () {
			remove(hs.tooltip);
		});
		CodeMirror.on(obj, 'update', function () {
			remove(hs.tooltip);
		});
		CodeMirror.on(obj, 'select', function (cur, node) {
			remove(hs.tooltip);

			if (!cur.description) {
				return;
			}

			hs.tooltip = makeTooltip(node.parentNode.getBoundingClientRect().right + window.pageXOffset,
				node.getBoundingClientRect().top + window.pageYOffset, cur.description);
			hs.tooltip.className += ' ' + 'CodeMirror-Tern-hint-doc';
		});
	}
});