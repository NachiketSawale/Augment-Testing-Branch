/* jshint -W089 */
/* jshint -W004 */
/* jshint -W071 */
/* jshint -W073 */
/* globals define,CodeMirror */
(function (mod) {
	'use strict';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global require */

	if (typeof exports === 'object' && typeof module === 'object') { // CommonJS
		mod(require('../../lib/codemirror'));
	}
	else if (typeof define === 'function' && define.amd) {// AMD
		define(['../../lib/codemirror'], mod);
	}
	else {// Plain browser env
		mod(CodeMirror);
	}
})(function (CodeMirror) {
	'use strict';

	var cls = 'CodeMirror-Tern-';

	CodeMirror.defineExtension('showDescription', function showDescription(cm) {

		var getStyle=cm.options.getStyle;
		var tokenType=cm.options.tokenType;
		var getCurrentFunctionName=cm.options.getCurrentFunctionName;
		var getCurrentParameterName=cm.options.getCurrentParameterName;
		var getFunctionDescription=cm.options.getFunctionDescription;
		var getParameterDescription=cm.options.getParameterDescription;
		var getParameterValueDescription=cm.options.getParameterValueDescription;
		var functionsArray=cm.options.functionsArray;

		var description = null;
		var functionName = null;
		var parameterName = null;
		var cur = cm.getCursor(), currentToken = cm.getTokenAt(cur);
		currentToken.lineNo = cur.line;
		if (currentToken.type === getStyle(tokenType.functionName)) {
			functionName = currentToken.string;
			description = getFunctionDescription(functionsArray, functionName);
		} else if (currentToken.type === getStyle(tokenType.parameterName)) {
			functionName = getCurrentFunctionName(cm, currentToken);
			parameterName = currentToken.string;
			description = getParameterDescription(functionsArray, functionName, parameterName);
		} else if (currentToken.type === getStyle(tokenType.parameterValue)) {
			functionName = getCurrentFunctionName(cm, currentToken);
			parameterName = getCurrentParameterName(cm, currentToken);
			var parameterValue = currentToken.string;
			description = getParameterValueDescription(functionsArray, functionName, parameterName, parameterValue);
		}
		var tipManager=new CodeMirror.TipManager();
		var place = cm.cursorCoords(null,'page');
		tipManager.updateTooltip(cm,description,(place.right + 1)+'px', (place.bottom)+'px');
	});

	CodeMirror.TipManager = function() {
		var self=this;
		this.updateTooltip=function(cm,tipMsg,tipLeft,tipTop){
			self.closeTooltip(cm);
			if((!!tipMsg)&&(tipMsg!=='')){
				showTooltip(cm,tipMsg,tipLeft,tipTop);
			}
		};

		this.closeTooltip=function(cm) {
			if (cm.options.activeToolTip) {
				removeTooltip(cm.options.activeToolTip); cm.options.activeToolTip = null;
			}
		};

		function showTooltip(cm,tipMsg,tipLeft,tipTop) {
			self.closeTooltip(cm);
			var span = createElement('span', cls+'fhint-guess',tipMsg);
			cm.options.activeToolTip = makeTooltip(tipLeft,tipTop, span);
		}



		function removeTooltip(toolTipNode) {
			if((!!toolTipNode) && (!!toolTipNode.parentNode)){
				var parentNode=toolTipNode.parentNode;
				parentNode.removeChild(toolTipNode);
			}
		}

		function makeTooltip(x, y, content) {
			var node = createElement('div', cls + 'tooltip'+' CodeMirror-tip-container-QuantityQuery-outMost', content);
			node.style.left = x;
			node.style.top = y;

			document.body.appendChild(node);
			return node;
		}

		function createElement(tagname, cls /* , ... elts */) {
			var element = document.createElement(tagname);
			if (cls) {
				element.className = cls;
			}
			for (var i = 2; i < arguments.length; ++i) {
				var childElement = arguments[i];
				if (typeof childElement === 'string') {
					childElement = document.createTextNode(childElement);
				}
				element.appendChild(childElement);
			}
			return element;
		}
	};
});
