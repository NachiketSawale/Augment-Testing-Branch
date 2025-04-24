/* jshint -W089 */
/* jshint -W098 */
/* jshint -W121 */
// eslint-disable-next-line no-unused-vars
var FilterScriptHINT = (function () {
	'use strict';

	// token type
	var wt = {
		keyword: 'keyword',
		method: 'method',
		property: 'property',
		operator: 'operator',
		ov: 'ov',
		string: 'string',
		number: 'number',
		atom: 'atom',
		variable: 'variable'
	};

	if (typeof String.prototype.supplant !== 'function') {
		String.prototype.supplant = function (o) {
			return this.replace(/\{([^{}]*)\}/g, function (a, b) {
				var r = o[b];
				return typeof r === 'string' || typeof r === 'number' ? r : a;
			});
		};
	}


	var self = {};

	self.errors = [];
	self.warningCount = 0;
	self.errorCount = 0;
	self.msgTemplate = {};

	function clearWarningAndErrors() {
		self.errors = [];
		self.warningCount = 0;
		self.errorCount = 0;
	}

	self.checkFilterScript = function checkFilterScript(script, cm) {
		var dataIsLoaded = false;
		var objectPorperties = [];// properties
		var variables = [];// variables
		var methods = {};
		if (cm.options.defs && cm.options.defs instanceof Array) {
			var filterDef = cm.options.defs[0];
			methods = filterDef.methods;
			if (cm.options.defs.length > 1) {
				objectPorperties = [];
				var props = cm.options.defs[1];
				for (var i = 0, len = props.length; i < len; i++) {
					objectPorperties.push(props[i].text);
				}

				if (cm.options.defs.length > 2) {
					self.msgTemplate = cm.options.defs[2];
				}

				if (cm.options.selectionParameters && cm.options.selectionParameters instanceof Array) {
					variables = [];
					var variablesDef = cm.options.selectionParameters;
					for (var vi = 0, vlen = variablesDef.length; vi < vlen; vi++) {
						variables.push(variablesDef[vi].text);
					}
				}

				dataIsLoaded = true;
			}
		}

		clearWarningAndErrors();

		if (dataIsLoaded === false) {
			return;
		}


		// --------------------------------- check logic --------------------------

		var ct, character, line = 0, s, tokenIndex, tokenCount, curTemp, curIndex, tempIndex = 0, statement, cmethod, allTokens = [];

		removeEmptyToken();
		checkSingleToken();
		checkFactorToken();
		checkRemainToken();


		// ------------------------- below is check method -----------------------------------

		function removeEmptyToken() {
			var lineTokens, lineCount = cm.lineCount();
			while (line < lineCount) {
				lineTokens = cm.getLineTokens(line);

				tokenIndex = 0;
				if (lineTokens && lineTokens.length) {
					tokenCount = lineTokens.length;
				} else {
					tokenCount = 0;
				}
				while (tokenIndex < tokenCount) {
					ct = lineTokens[tokenIndex];
					if (!(/^\s*$/.test(ct.string))) {
						ct.line = line;
						allTokens.push(ct);
					}
					tokenIndex++;
				}
				line++;
			}
			tokenCount = allTokens.length;
		}

		function checkSingleToken() {
			for (tokenIndex = 0; tokenIndex < tokenCount; tokenIndex++) {
				ct = allTokens[tokenIndex];
				if (ct.type === wt.property) {
					parsePropertyWarning();
					parsePropertyNameError();
				}
				if (ct.type === wt.variable) {
					parseVariableWarning();
					parseVariableError();
				}
				if (ct.type === wt.string) {
					parseStringWarning();
					parseStringError();
				}
			}
		}

		function checkFactorToken() {
			for (tokenIndex = 0; tokenIndex < tokenCount; tokenIndex++) {
				ct = allTokens[tokenIndex];
				if (!ct.isChecked && expectCurType(wt.method)) {
					var mr = parseMethod();
					if (mr !== false) {
						continue;
					}
				}

				if (!ct.isChecked && expectCurType(wt.property)) {
					var p = parsePropertyError();
					if (p !== false) {
						continue;
					}
				}
			}
		}

		function checkRemainToken() {
			for (tokenIndex = 0; tokenIndex < tokenCount; tokenIndex++) {
				ct = allTokens[tokenIndex];
				// if current token is not checked, check it
				if (!ct.isChecked && expectCurType(wt.keyword)) {
					var lk = parseKeyWordError();
					if (lk !== false) {
						continue;
					}
				}

				if (!ct.isChecked && (expectCurType(wt.string) || expectCurType(wt.number) ||
					expectCurType(wt.atom) || expectCurType(wt.variable))) {
					var lv = parseValueLastError();
					if (lv !== false) {
						continue;
					}
				}

				if (!ct.isChecked && expectCurType(wt.ov)) {
					var lov = parseOperatorValueLastError();
					if (lov !== false) {
						continue;
					}
				}

				if (!ct.isChecked && expectCurType(wt.operator)) {
					var lo = parseOperatorError();
					if (lo !== false) {
						continue;
					}
				}
			}
		}


		// -------------------------  below is tools method -----------------------------------

		function parsePropertyNameError() {
			line = ct.line;
			character = ct.start;
			s = cm.getLine(ct.line);
			var strLen = ct.string.length;
			if (strLen > 0) {
				if (ct.string[0] !== '[') {
					errorAt(self.msgTemplate.propertyNameError.description, line + 1, character, '[', ct.string);
				}
				if (ct.string[strLen - 1] !== ']') {
					errorAt(self.msgTemplate.propertyNameError.description, line + 1, ct.end, ']', ct.string);
				}
			}
		}

		function parsePropertyWarning() {
			if (/[_%]/.test(ct.string) === false && objectPorperties.indexOf(ct.string) === -1) {
				line = ct.line;
				character = ct.start;
				s = cm.getLine(ct.line);
				warningAt(self.msgTemplate.propertyNameUndefined.description, line + 1, character + 1, ct.string, character + 1);
			}
		}

		function parseVariableError() {
			line = ct.line;
			character = ct.start;
			s = cm.getLine(ct.line);
			var strLen = ct.string.length;
			if (strLen > 1) {
				if (ct.string[1] !== '[') {
					errorAt(self.msgTemplate.variableNameError.description, line + 1, character + 1, '[', ct.string);
				}
				if (ct.string[strLen - 1] !== ']') {
					errorAt(self.msgTemplate.variableNameError.description, line + 1, ct.end, ']', ct.string);
				}
			}
		}

		function parseVariableWarning() {
			if (variables.indexOf(ct.string) === -1) {
				line = ct.line;
				character = ct.start;
				s = cm.getLine(ct.line);
				warningAt(self.msgTemplate.variableNameUndefined.description, line + 1, character + 1, ct.string, character + 1);
			}
		}

		function parseStringError() {
			line = ct.line;
			character = ct.start;
			s = cm.getLine(ct.line);
			var strLen = ct.string.length;
			if (strLen > 0) {
				if (ct.string[0] === '"') {
					errorAt(self.msgTemplate.notSupport.description, line + 1, character + 1, '"', '\'');
				}
				if (ct.string[strLen - 1] === '"') {
					errorAt(self.msgTemplate.notSupport.description, line + 1, ct.end, '"', '\'');
				}
			}

			if (strLen < 2) {
				errorAt(self.msgTemplate.syntaxError.description, line + 1, character + 1, ct.string, character + 1);
			} else {
				if (ct.string[0] !== '\'' || ct.string[strLen - 1] !== '\'') {
					errorAt(self.msgTemplate.syntaxError.description, line + 1, character + 1, ct.string, character + 1);
				}
			}
		}

		function parseStringWarning() {
			var result = /@\[([\w_][\w\d_]*)\]/.exec(ct.string);
			if (result && variables.indexOf(result[0]) === -1) {
				line = ct.line;
				character = ct.start + (ct.string.indexOf(result[0]));
				s = cm.getLine(ct.line);
				warningAt(self.msgTemplate.variableNameUndefined.description, line + 1, character + 1, result[0], character + 1);
			}
		}

		function parseOperatorError() {
			function addError(token) {
				line = token.line;
				character = token.end;
				s = cm.getLine(token.line);
				errorAt(self.msgTemplate.syntaxError.description, line + 1, character, token.string, character + 1);
			}

			tempIndex = 0;
			if (!expectLastType(wt.property)) {
				addError(curTemp);
				return false;
			}

			if (!(expectNextType(wt.string) || expectNextType(wt.number) ||
				expectNextType(wt.variable) || expectNextType(wt.atom))) {
				addError(curTemp);
				return false;
			}

			tokenIndex++;

			return true;
		}

		function parseOperatorValueLastError() {
			function addError(token) {
				line = token.line;
				character = token.end;
				s = cm.getLine(token.line);
				errorAt(self.msgTemplate.syntaxError.description, line + 1, character, token.string, character + 1);
			}

			tempIndex = 0;
			if (!expectLastType(wt.property)) {
				addError(curTemp);
				return false;
			}

			tokenIndex++;

			return true;
		}

		function parseValueLastError() {
			function addError(token) {
				line = token.line;
				character = token.end;
				s = cm.getLine(token.line);
				errorAt(self.msgTemplate.syntaxError.description, line + 1, character, token.string, character + 1);
			}

			tempIndex = 0;
			if (!expectLastType(wt.operator)) {
				addError(curTemp);
				return false;
			}

			tokenIndex++;

			return true;
		}

		function parseKeyWordError() {
			function addError(token) {
				line = token.line;
				character = token.end;
				s = cm.getLine(token.line);
				errorAt(self.msgTemplate.syntaxError.description, line + 1, character, token.string, character + 1);
			}

			tempIndex = 0;
			if (!expectLastChar(')') && !expectLastType(wt.ov) && !expectLastType(wt.string) && !expectLastType(wt.number) && !expectLastType(wt.atom) && !expectLastType(wt.variable)) {
				addError(curTemp);
				return false;
			}

			if (!expectNextType(wt.property) && !expectNextType(wt.method) && !expectNextChar('(')) {
				addError(curTemp);
				return false;
			}

			tokenIndex++;

			return true;
		}

		function parsePropertyError() {
			function addError(token) {
				line = token.line;
				character = token.end;
				s = cm.getLine(token.line);
				errorAt(self.msgTemplate.missingError.description, line + 1, character, statement, token.string);
			}

			tempIndex = 0;
			if (expectNextType(wt.operator)) {
				tempIndex++;
				if (!(expectNextType(wt.string) || expectNextType(wt.number) ||
					expectNextType(wt.variable) || expectNextType(wt.atom))) {
					addError(curTemp);
					return false;
				}
			} else if (!expectNextType(wt.ov)) {
				addError(ct);
				return false;
			}
			tempIndex++;

			tokenIndex += tempIndex + 1;

			return true;
		}

		function parseMethod() {

			function addError(token) {
				line = token.line;
				character = token.end;
				s = cm.getLine(token.line);
				errorAt(self.msgTemplate.missingError.description, line + 1, character, statement, token.string);
			}

			tempIndex = 0;
			cmethod = methods[ct.string];
			var lastCheckResult = true;

			lastCheckResult = lastCheckResult && expectNextChar('(');
			if (!lastCheckResult) {
				addError(ct);
				return false;
			}
			tempIndex++;

			for (var j = 0, plen = cmethod.params.length; j < plen; j++) {
				lastCheckResult = lastCheckResult && (expectNextType(wt.property) || expectNextType(wt.string) ||
					expectNextType(wt.number) || expectNextType(wt.variable) || expectNextType(wt.atom));
				if (!lastCheckResult) {
					addError(curTemp);
					return false;
				}
				tempIndex++;

				if (j < plen - 1) {
					lastCheckResult = expectNextChar(',');
					if (!lastCheckResult) {
						addError(curTemp);
						return false;
					}
					tempIndex++;
				}
			}

			lastCheckResult = lastCheckResult && expectNextChar(')');
			if (!lastCheckResult) {
				addError(curTemp);
				return false;
			}
			tempIndex++;

			tokenIndex += tempIndex + 1;

			return true;
		}

		// eslint-disable-next-line no-unused-vars
		function expectCurChar(ch) {
			var res = ct.string === ch;
			if (res) {
				ct.isChecked = res;
			}
			return res;
		}

		function expectCurType(type) {
			var res = ct.type === type;
			if (res) {
				ct.isChecked = res;
			}
			return res;
		}

		// eslint-disable-next-line no-unused-vars
		function isFirstToken() {
			if (tokenIndex === 0) {
				return true;
			}
			return false;
		}

		function expectLastType(type) {
			setStatement(type);
			curIndex = tokenIndex - (tempIndex + 1);
			if (curIndex >= 0) {
				curTemp = allTokens[curIndex];
				if (curTemp.type === type) {
					return true;
				}
			} else {
				curTemp = allTokens[curIndex + 1];
			}
			return false;
		}

		function expectLastChar(char) {
			setStatement(char);
			curIndex = tokenIndex - (tempIndex + 1);
			if (curIndex >= 0) {
				curTemp = allTokens[curIndex];
				if (curTemp.string === char) {
					return true;
				}
			} else {
				curTemp = allTokens[curIndex + 1];
			}
			return false;
		}

		// eslint-disable-next-line no-unused-vars
		function isLastToken() {
			if (tokenIndex < tokenCount) {
				return false;
			}
			return true;
		}

		function expectNextChar(ch) {

			statement = ch;
			curIndex = tokenIndex + (tempIndex + 1);
			if (curIndex < tokenCount) {
				curTemp = allTokens[curIndex];
				if (curTemp.string === ch) {
					curTemp.isChecked = true;
					return true;
				}
			} else {
				curTemp = allTokens[curIndex - 1];
			}
			return false;
		}

		function expectNextType(type) {
			setStatement(type);
			curIndex = tokenIndex + (tempIndex + 1);
			if (curIndex < tokenCount) {
				curTemp = allTokens[curIndex];
				if (curTemp.type === type) {
					curTemp.isChecked = true;
					return true;
				}
			} else {
				curTemp = allTokens[curIndex - 1];
			}
			return false;
		}

		function setStatement(expect) {
			statement = (expect === wt.string || expect === wt.number || expect === wt.variable || expect === wt.atom) ?
				self.msgTemplate.value.description : (expect === wt.ov) ? self.msgTemplate.operator.description : expect;

		}

		function warning(m, t, a, b, c, d) {
			var ch, l, w;
			l = t.line || 0;
			ch = t.from || 0;
			w = {
				id: '(error)',
				raw: m,
				evidence: s || '',
				line: l,
				character: ch,
				a: a,
				b: b,
				c: c,
				d: d
			};
			w.severity = 'warning';
			w.reason = m.supplant(w);
			self.errors.push(w);
			return w;
		}

		function warningAt(m, l, ch, a, b, c, d) {
			self.warningCount++;
			return warning(m, {
				line: l,
				from: ch
			}, a, b, c, d);
		}

		function error(m, t, a, b, c, d) {
			var ch, l, w;
			l = t.line || 0;
			ch = t.from || 0;
			w = {
				id: '(error)',
				raw: m,
				evidence: s || '',
				line: l,
				character: ch,
				a: a,
				b: b,
				c: c,
				d: d
			};
			w.severity = 'error';
			w.reason = m.supplant(w);
			self.errors.push(w);
			return w;
		}

		function errorAt(m, l, ch, a, b, c, d) {
			self.errorCount++;
			return error(m, {
				line: l,
				from: ch
			}, a, b, c, d);
		}
	};

	return self;

})();
