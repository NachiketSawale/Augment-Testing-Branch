/**
 * Created by wui on 12/15/2015.
 */

/* global CodeMirror, $ */
(function (angular, CodeMirror) {
	'use strict';

	/* jshint -W074 */
	/* jshint -W040 */
	angular.module('estimate.rule').directive('estimateRuleScriptEditor', ['estimateRuleScriptEditorService',
		function (service) {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {},
				controllerAs: 'ctrl',
				controller: [controller],
				link: link
			};

			function controller() {
				let self = this;
				let viewModel;

				getHints.async = true;

				function formatHintText(list) {
					return list.map(function (text) {
						return {text: text, displayText: text};
					});
				}

				function getCompletion(list, text) {
					if (!text) {
						return list;
					}

					let exp = new RegExp(text, 'i');
					return list.filter(function (item) {
						return exp.test(item.text);
					});
				}

				function getVariableHints(cm) {
					return searchVariable(cm).map(function (item) {
						return {
							text: item,
							displayText: item + ' variable'
						};
					}).concat(viewModel.getVariableHints());
				}

				function searchVariable(cm) {
					let parser = new Parser(cm);
					return parser.parse().getAllVariableNames(parser.cursorScope);
				}

				function getVariableType(cm, name) {
					let context = [{id: name}];
					let parser = new Parser(cm);
					let obj = parser.parse().getAllVariables(parser.cursorScope);

					while (obj[name] && obj[name].exp && obj[name].exp.itemList) {
						context.shift();
						context = obj[name].exp.itemList.concat(context);
						name = context[0].id;
					}

					context[0].id = viewModel.getGlobalType(context[0].id);

					return viewModel.getExpType(context);
				}

				function getExpContext(cm) {
					let parser = new Parser(cm).parse();

					if (parser.cursorExp && parser.cursorExp.itemList.length) {
						parser.cursorExp.itemList[0].id = getVariableType(cm, parser.cursorExp.itemList[0].id);
					}

					return parser.cursorExp ? parser.cursorExp.itemList : [];
				}

				function getPropertyHints() {
					return viewModel.getPropertyHints();
				}

				function getHints(cm, showHints, options) {
					let result = CodeMirror.hint.javascript(cm, options) || options.result;

					// code mirror hints.
					if (result.list.length) {
						result.list = formatHintText(result.list);
					}

					// ignore code mirror hints.
					if (options.variableCompletion) {
						result.list = options.variableCompletion;
					}

					// if none exact hints, then add possible hints.
					if (!result.list.length) {
						result.list = options.propertyCompletion;
					}

					showHints(result);
				}

				function onChange(cm, data) {
					// action complete, delete, enter
					let origins = ['complete', '+delete', 'setValue', 'cut', 'paste'];
					if (origins.indexOf(data.origin) !== -1 || data.text.length > 1) {
						return;
					}

					// get input text
					let input = data.text[0];

					// input space, ';', '(',')','{','}', '=', '[', ']'
					// eslint-disable-next-line no-useless-escape
					if (/[\s\u00a0;\(\)\{\}=\[\]\><]/.test(input)) {
						return;
					}

					let cursor = cm.getCursor();
					let token = cm.getTokenAt(cursor);
					let propertyCompletion = [];
					let variableCompletion = [];

					if (input === '.' || token.type === 'property') {
						variableCompletion = viewModel.getContextHints(getExpContext(cm));
					}
					else if (token.type === 'variable') {
						variableCompletion = getVariableHints(cm);
					}
					else if (token.type === 'string') {
						let match = /'(\w+)'/.exec(token.string);
						token.string = match ? match[1] : '';
						propertyCompletion = getPropertyHints();
					}

					self.cm.showHint({
						hint: getHints,
						propertyCompletion: getCompletion(propertyCompletion, token.string),
						variableCompletion: getCompletion(variableCompletion, token.string),
						result: {
							list: [],
							from: CodeMirror.Pos(cursor.line, token.start + 1),
							to: CodeMirror.Pos(cursor.line, token.end - 1)
						}
					});
				}

				function onKeyDown(e) {
					e.stopPropagation();
				}

				this.cm = null;

				this.init = function (element, settings) {
					if (settings.scriptId) {
						viewModel = service.get(settings.scriptId);
						viewModel.loadHintData(settings.apiId);
						/* jshint -W064 */
						self.cm = CodeMirror(element[0], settings);
						self.cm.on('change', onChange);
						if (settings.preventKeyDown) {
							element.bind('keydown', onKeyDown);
						}
					}
				};

				this.destroy = function (element) {
					self.cm.off('change', onChange);
					element.unbind('keydown', onKeyDown);
				};
			}

			function link(scope, element, attrs, ngModelCtrl) {
				let defaults = {
					mode: {
						name: 'javascript'
					},
					lineNumbers: true,
					hintOptions: {
						completeSingle: false
					},
					autoCloseBrackets: true,
					matchBrackets: true,
					theme: 'default script'
				};
				let options = scope.$parent.$eval(attrs.options);
				let settings = $.extend(defaults, options || {});
				let splitter = element.closest('.k-splitter').data('kendoSplitter');

				// initialize code mirror.
				scope.ctrl.init(element, settings);

				// model -> view
				ngModelCtrl.$render = function () {
					if (angular.isString(ngModelCtrl.$viewValue)) {
						scope.ctrl.cm.setValue(ngModelCtrl.$viewValue);
					}
					else {
						scope.ctrl.cm.setValue('');
					}
				};

				// view -> model
				scope.ctrl.cm.on('change', onChange);

				// register code mirror instance
				service.registerCm(settings.scriptId, scope.ctrl.cm);

				// ui destroy.
				scope.$on('$destroy', function () {
					ngModelCtrl.$render = angular.noop;
					scope.ctrl.destroy(element);
					scope.ctrl.cm.off('change', onChange);
					splitter.unbind('layoutChange', refreshCm);
					service.unregisterCm(settings.scriptId, scope.ctrl.cm);
				});

				// layout change
				splitter.bind('layoutChange', refreshCm);

				function onChange() {
					let newValue = scope.ctrl.cm.getValue();
					if (ngModelCtrl.$viewValue !== newValue) {
						ngModelCtrl.$setViewValue(newValue);
						ngModelCtrl.$commitViewValue();
					}
				}

				// refresh code mirror to update scroll bar state
				function refreshCm() {
					if (scope.ctrl.cm) {
						scope.ctrl.cm.refresh();
					}
				}
			}
		}
	]);

	function ExpItem(id) {
		this.id = id;
		this.isVariable = false;
		this.isProperty = false;
		this.isElement = false;
		this.isFunc = false;
		this.exp = null;
	}

	function Expression() {
		// return type
		this.returnType = '';
		this.itemList = [];
		this.content = '';
	}

	function TokenStream(cm) {
		let cursor = cm.getCursor();
		let ct = cm.getTokenAt(cursor);
		let pos = CodeMirror.Pos(0, 1);
		let currentPos = null;

		this.position = function () {
			return currentPos;
		};

		this.read = function () {
			this.enter();
			if (this.end()) {
				return null;
			}
			currentPos = {
				line: pos.line,
				ch: pos.ch
			};
			let token = cm.getTokenAt(pos);
			pos.ch = token.end + 1;
			// skip space and empty line.
			return (token && token.type === null && (token.string === ' ' || token.string === '')) ? this.read() : token;
		};

		this.peek = function (number) {
			let temp = {
				line: pos.line,
				ch: pos.ch
			};
			let token;
			number = number || 1;
			do {
				token = this.read();
				number--;
			}
			while (number > 0);
			pos = CodeMirror.Pos(temp.line, temp.ch);
			return token;
		};

		this.end = function () {
			return pos.line > cursor.line || (pos.line === cursor.line && pos.ch > ct.start);
		};

		this.enter = function () {
			let line = cm.getLine(pos.line);
			// skip empty line
			if (!line || pos.ch > line.length) {
				pos.line++;
				pos.ch = 0;
			}
		};
	}

	function Parser(cm) {
		let self = this;
		let stream = new TokenStream(cm);
		let token;

		this.globalScope = null;
		this.cursorExp = null;
		this.cursorScope = null;
		this.parse = parse;
		this.getVariable = getVariable;
		this.getAllVariableNames = getAllVariableNames;
		this.getAllVariables = getAllVariables;

		function parse() {
			this.globalScope = parseBlock();
			return this;
		}

		function parseBlock(parentScope) {
			let scope = {
				__parent: parentScope,
				__children: []
			};
			let id;

			/* jshint -W084 */
			// eslint-disable-next-line no-cond-assign
			while (token = stream.peek()) {
				if (token.type === 'def') { // declare statement
					token = stream.read();
					id = token.string;
					scope[id] = {};
					token = stream.read();
					if (token && token.type === 'operator' && token.string === '=') {
						scope[id].exp = pareExp(scope);
					}
				}
				else if (token.type === 'variable' || token.type === 'variable-2') {// assign statement
					token = stream.peek(2);
					if (token && token.type === 'operator' && token.string === '=') {
						token = stream.read();
						id = token.string;
						stream.read();
						setVariable(scope, id, pareExp(scope));
					}
					else {
						pareExp(scope);
					}
				}
				else if (token.type === null && token.string === '{') {
					token = stream.read();
					scope.__children.push(parseBlock(scope));
				}
				else if (token.type === null && token.string === '}') {
					token = stream.read();
					break;
				}
				else {
					token = stream.read();
				}
			}

			if (!self.cursorScope && !token) {
				self.cursorScope = scope;
			}

			return scope;
		}

		function pareExp(scope) {
			let exp = new Expression();
			let item = null;
			let state = 0;

			/* jshint -W084 */
			/* jshint -W073 */
			// eslint-disable-next-line no-cond-assign
			while (token = stream.read()) {
				if (token.type === null) {
					if (token.string === '[') {
						if (item) {
							token = stream.peek();
							if (token && (token.type === 'number' || token.type === 'variable' || token.type === 'variable-2')) {
								item.isElement = true;
							}
							item.exp = pareExp(scope);
							if (token && token.type === null) {
								if (token.string === ',') {
									if (item) {
										item.exp = pareExp(scope);
									}
								}
								if (token && token.type === null && token.string === ']') {
									continue;
								}
							}
						}
					}
					else if (token.string === '(') {
						if (item) {
							item.isFunc = true;
							item.exp = pareExp(scope);
							if (token && token.type === null) {
								if (token.string === ',') {
									if (item) {
										item.exp = pareExp(scope);
									}
								}
								if (token && token.type === null && token.string === ')') {
									continue;
								}
							}
						}
					}
				}

				// child expression parser has ran out of token.
				if (!token) {
					break;
				}

				state = transform(state, token);

				if (state === -1) {
					break;
				}
				else {
					if (token.type === 'variable' || token.type === 'variable-2') {
						item = new ExpItem(token.string);
						item.isVariable = true;
						exp.itemList.push(item);
					}
					else if (token.type === 'property') {
						item = new ExpItem(token.string);
						item.isProperty = true;
						exp.itemList.push(item);
					}
					else if (token.type === null && token.string === '.') {
						// get expression near cursor
						if (!self.cursorExp && !stream.peek()) {
							self.cursorExp = exp;
						}
					}
				}
			}

			// get expression near cursor
			if (!self.cursorExp && !token) {
				self.cursorExp = exp;
			}

			return exp;
		}

		function transform(state, token) {
			if (state === 0) { // initial state
				if (token.type === 'variable' || token.type === 'variable-2') {
					state = 1;
				}
				else if (token.type === 'number' || token.type === 'string') {
					state = 2;
				}
				else {
					state = -1;
				}
			}
			else if (state === 1) { // variable
				if (token.type === null && token.string === '.') {
					state = 3;
				}
				else {
					state = -1;
				}
			}
			else if (state === 2) { // constant
				if (token.type === null && token.string === '.') {
					state = 3;
				}
				else {
					state = -1;
				}
			}
			else if (state === 3) { // '.'
				if (token.type === 'property') {
					state = 4;
				}
				else {
					state = -1;
				}
			}
			else if (state === 4) { // property
				if (token.type === null && token.string === '.') {
					state = 3;
				}
				else {
					state = -1;
				}
			}
			else {
				state = -1;
			}
			return state;
		}

		function setVariable(scope, id, value) {
			while (scope && !scope[id]) {
				scope = scope.__parent;
			}

			if (scope) {
				scope[id].exp = value;
			}
		}

		function getVariable(scope, id) {
			while (scope && !scope[id]) {
				scope = scope.__parent;
			}

			return scope ? scope[id] : null;
		}

		function getAllVariables(scope) {
			let dict = [];

			while (scope) {
				for (let p in scope) {
					// eslint-disable-next-line no-prototype-builtins
					if (scope.hasOwnProperty(p) && p !== '__parent' && p !== '__children') {
						dict[p] = scope[p];
					}
				}
				scope = scope.__parent;
			}

			return dict;
		}

		function getAllVariableNames(scope) {
			let list = [];

			while (scope) {
				for (let p in scope) {
					// eslint-disable-next-line no-prototype-builtins
					if (scope.hasOwnProperty(p) && p !== '__parent' && p !== '__children') {
						list.push(p);
					}
				}
				scope = scope.__parent;
			}

			return list;
		}
	}

})(angular, CodeMirror);
