/**
 * Created by wui on 7/26/2016.
 */

/* global CodeMirror */
(function (angular, CodeMirror) {
	'use strict';

	var moduleName = 'basics.common';

	/* jshint -W074 */
	/* jshint -W040 */
	angular.module(moduleName).directive('basicsCommonScriptEditor', [
		'basicsCommonScriptEditorService', '$timeout', '$q', '$http', 'globals', '$',
		function (service, $timeout, $q, $http, globals, $) {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {
					entity: '=',
					readonly: '=',
					onInit: '&'
				},
				controllerAs: 'ctrl',
				controller: ['$scope', controller],
				link: link
			};

			function controller($scope) {
				var self = this;
				var viewModel, _changeTimeout;
				var cls = 'CodeMirror-Tern-';
				var httpCache = {};

				function handleChange(cm, data) {
					// action complete, delete, enter
					var origins = ['complete', '+delete', 'setValue', 'cut', 'paste'];
					if (origins.indexOf(data.origin) !== -1 || data.text.length > 1) {
						return;
					}

					// get input text
					var input = data.text[0];

					// input space, ';', '(',')','{','}', '=', '[', ']'
					if (/[\s\u00a0;(){}=[\]><]/.test(input) || !input.length) {
						return;
					}

					var cursor = cm.getCursor();
					var token = cm.getTokenAt(cursor);

					if (input === '.' || token.type === 'property' || token.type === 'variable') {
						self.ts.complete(cm);
					} else {
						self.ts.updateArgHints(cm);
						if (token.type === 'string' && self.ts.cachedArgHints) {
							var cachedArgHints = self.ts.cachedArgHints;
							var func = self.argService[cachedArgHints.name + 'ArgsAsync'];
							var args = getArgInfo(cm, token, {
								ch: cursor.ch,
								line: cursor.line
							});

							if (angular.isFunction(func)) {
								self.cm.showHint({hint: getArgHints(cursor, token, func, cachedArgHints.type, args)});
							} else if (self.argService && args.index === 0) {
								var context = {};
								var pattern = /set([a-zA-Z_0-9]+)ByCode/i;

								if (angular.isFunction(self.argService.getContext)) {
									context = self.argService.getContext();
								}

								if (pattern.test(cachedArgHints.name)) {
									var matches = pattern.exec(cachedArgHints.name);
									var propertyName = matches[1];

									func = function () {
										var byCodeHintsUrl = globals.webApiBaseUrl + 'basics/common/script/bycodehints?property=' + propertyName;

										if (httpCache[byCodeHintsUrl]) {
											return httpCache[byCodeHintsUrl];
										}

										return $http.post(byCodeHintsUrl, context).then(function (res) {
											httpCache[byCodeHintsUrl] = [];

											if (res.data && res.data.length) {
												httpCache[byCodeHintsUrl] = res.data.map(function (entity) {
													return {
														text: entity.Code,
														displayText: entity.Code,
														className: 'CodeMirror-Tern-completion CodeMirror-Tern-completion-string',
														tooltip: entity.CodeTr
													};
												});
											}

											return httpCache[byCodeHintsUrl];
										});
									};
									self.cm.showHint({hint: getArgHints(cursor, token, func, cachedArgHints.type, args)});
								}
							}
						}
					}
				}

				function onChange(cm, data) {
					if (_changeTimeout) {
						$timeout.cancel(_changeTimeout);
					}

					_changeTimeout = $timeout(function () {
						_changeTimeout = null;
						handleChange(cm, data);
					}, 300);
				}

				function onKeyDown(e) {
					e.stopPropagation();
				}

				function createTernServer(defs) {
					var tern = new CodeMirror.TernServer({defs: defs});
					// completions settings
					// disable guess feature, char case insensitive, keyword completion
					tern.options.queryOptions = {
						completions: {
							guess: false,
							caseInsensitive: true,
							includeKeywords: true
						}
					};
					return tern;
				}

				function closeArgHints(ts) {
					if (ts.activeArgHints) {
						removeArgHints(ts.activeArgHints);
						ts.activeArgHints = null;
					}
				}

				function removeArgHints(node) {
					var p = node && node.parentNode;
					if (p) {
						p.removeChild(node);
					}
				}

				function getArgHints(cursor, token, func, type, args) {
					var hint = function (cm, showHints) {
						$q.when(func(type, args.index, args)).then(function (args) {
							if (!args || !args.length) {
								return;
							}

							var text = token.string.replace(/'|"/g, '');

							var list = args.filter(function (arg) {
								return arg.displayText.match(new RegExp(text, 'i'));
							});

							var result = {
								list: list,
								from: CodeMirror.Pos(cursor.line, token.start + 1),
								to: CodeMirror.Pos(cursor.line, token.end - 1)
							};

							closeArgHints(self.ts);
							makeArgTooltip(result);
							showHints(result);
						});
					};

					hint.async = true;

					return hint;
				}

				function getArgInfo(cm, token, cursor) {
					var prev = token;
					var commas = [];
					var count = 1000;
					var skipBracket = 0;
					var items = [];

					while (count > 0 && prev && (!(prev.type === null && prev.string === '(') || skipBracket)) {
						if (prev.type === null && prev.string === '(') {
							skipBracket--;
						}

						prev = prevToken(cm, prev, cursor);

						if (prev) {
							if (prev.type === null && prev.string === ')') {
								skipBracket++;
							}

							if (!skipBracket) {
								if (prev.type === null && prev.string === ',') {
									commas.push(prev);
								} else if (prev.type) {
									items.push(prev);
								}
							}
						}

						count--;
					}

					return {
						index: commas.length,
						items: items.reverse()
					};
				}

				function prevToken(cm, token, cursor) {
					cursor.ch = token.start;

					if (cursor.ch === 0) {
						cursor.line--;
						cursor.ch = cm.getLine(cursor.line).length;
					}

					if (cursor.line < 0) {
						return null;
					}

					return cm.getTokenAt(cursor);
				}

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
					var node = elt('div', cls + 'tooltip', content);
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

				function makeArgTooltip(obj) {
					var tooltip = null;

					CodeMirror.on(obj, 'close', function () {
						remove(tooltip);
					});
					CodeMirror.on(obj, 'update', function () {
						remove(tooltip);
					});
					CodeMirror.on(obj, 'select', function (cur, node) {
						remove(tooltip);

						if (!cur.tooltip) {
							return;
						}

						tooltip = makeTooltip(node.parentNode.getBoundingClientRect().right + window.pageXOffset,
							node.getBoundingClientRect().top + window.pageYOffset, cur.tooltip);
						tooltip.className += ' ' + cls + 'hint-doc';
					});
				}

				this.cm = null;
				this.vm = this;
				this.ts = null;
				this.argService = {};

				this.init = function (element, settings) {
					if (!settings.scriptId) {
						return;
					}

					viewModel = service.get(settings.scriptId);
					viewModel.loadApiDef(settings).then(function (defs) {
						self.ts = createTernServer(defs);

						self.cm.on('focus', function () {
							// update tern server in case parameter def changed.
							defs = viewModel.getScriptDefs();
							if (settings.appendDef) {
								settings.appendDef(defs);
							}
							self.ts.destroy();
							self.ts = createTernServer(defs);
						});

						self.cm.on('blur', function () {
							self.ts.destroy();
						});

						self.cm.on('cursorActivity', function () {
							// self.ts.updateArgHints(cm);
							closeArgHints(self.ts);
						});

						// disable select name because it affects copy and edit logic.
						// self.cm.on('dblclick', function (cm) {
						// self.ts.selectName(cm);
						// });
					});

					self.argService = settings.argService || {};
					self.cm = new CodeMirror(element[0], settings);
					self.cm.options.readOnly = $scope.readonly;
					$scope.focused = self.cm.state.focused;
					self.cm.on('change', onChange);

					self.cm.on('blur', function () {
						if ($scope.$parent.service && $scope.$parent.service.onFocused) {
							$scope.$parent.service.onFocused.fire(self.cm.state);
						}
					});
					self.cm.on('focus', function () {
						if ($scope.$parent.service && $scope.$parent.service.onFocused) {
							$scope.$parent.service.onFocused.fire(self.cm.state);
						}
					});

					if (settings.preventKeyDown) {
						element.bind('keydown', onKeyDown);
					}

					// clear doc history along with data item changed.
					$scope.$watch('entity', function () {
						self.cm.clearHistory();
					});

					// make the codemirror readonly or not with readonly status changed.
					$scope.$watch('readonly', function () {
						self.cm.options.readOnly = $scope.readonly;
					});
				};

				this.destroy = function (element) {
					if (self.ts) {
						self.ts.destroy();
					}
					if (self.cm) {
						self.cm.off('change', onChange);
					}
					element.unbind('keydown', onKeyDown);
					if (_changeTimeout) {
						$timeout.cancel(_changeTimeout);
						_changeTimeout = null;
					}
				};

				this.indent = function (cm) {
					var range = {from: cm.getCursor(true), to: cm.getCursor(false)};
					cm.autoIndentRange(range.from, range.to);
				};

				this.format = function (cm) {
					var range = {from: cm.getCursor(true), to: cm.getCursor(false)};
					cm.autoFormatRange(range.from, range.to);
				};

				this.getApiDoc = function () {
					if (!viewModel) {
						return {};
					}

					var copy = angular.copy(viewModel.apiDef);
					return JSON.stringify(viewModel.getApiDoc(copy), null, 4);
				};
			}

			function link(scope, element, attrs, ngModelCtrl) {
				var defaults = {
					lineNumbers: true,
					autoCloseBrackets: true,
					matchBrackets: true,
					theme: 'default script',
					tabSize: 8,
					indentUnit: 8,
					indentWithTabs: true,
					mode: {
						name: 'javascript'
					},
					hintOptions: {
						completeSingle: false
					},
					extraKeys: {
						'Ctrl-;': function (cm) {
							cm.foldCode(cm.getCursor());
						},
						'Ctrl-/': function (cm) {
							cm.toggleComment();
						},
						'Ctrl-I': scope.ctrl.indent,
						'Alt-T': function (cm) {
							scope.ctrl.ts.showType(cm);
						},
						'Ctrl-D': function (cm) {
							scope.ctrl.ts.showDocs(cm);
						},
						'Ctrl-.': function (cm) {
							scope.ctrl.ts.jumpToDef(cm);
						},
						'Ctrl-,': function (cm) {
							scope.ctrl.ts.jumpBack(cm);
						},
						'Alt-N': function (cm) {
							scope.ctrl.ts.rename(cm);
						},
						'Alt-.': function (cm) {
							scope.ctrl.ts.selectName(cm);
						},
						'F11': function (cm) {
							cm.setOption('fullScreen', !cm.getOption('fullScreen'));
						},
						'Esc': function (cm) {
							if (cm.getOption('fullScreen')) {
								cm.setOption('fullScreen', false);
							}
						},
						'Ctrl-Space': function (cm) {
							scope.ctrl.ts.complete(cm);
						}
					},
					foldGutter: true,
					gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
					lint: true,
					trSource: ''
				};
				var options = scope.$parent.$eval(attrs.options);
				var settings = $.extend(defaults, options || {});

				// initialize code mirror.
				scope.ctrl.init(element, settings);

				// model -> view
				ngModelCtrl.$render = function () {
					if (angular.isString(ngModelCtrl.$viewValue)) {
						scope.ctrl.cm.setValue(ngModelCtrl.$viewValue);
					} else {
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
					service.unregisterCm(settings.scriptId, scope.ctrl.cm);
				});

				// execute external init callback
				if (scope.onInit) {
					scope.onInit(scope.ctrl, scope.ctrl.vm);
				}

				if (_.isFunction(scope.$parent.onContentResized)) {
					scope.$parent.onContentResized(refreshCm);
				}

				function onChange() {
					var newValue = scope.ctrl.cm.getValue();
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

})(angular, CodeMirror);