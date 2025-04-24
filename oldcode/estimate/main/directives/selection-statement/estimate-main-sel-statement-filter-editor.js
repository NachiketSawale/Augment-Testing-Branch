/**
 * Created by mov on 4/9/2018.
 */

/* global CodeMirror, $ */
(function (angular, CodeMirror) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainSelStatementFilterEditor', [
		'_', 'estimateMainSelStatementFilterEditorService', '$timeout', '$translate',
		function (_, service, $timeout, $translate) {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {
					entity: '=',
					readonly: '=',
					onInit: '&',
					onBlur: '&',
					onFocus: '&'
				},
				controllerAs: 'ctrl',
				controller: ['$scope', controller],
				link: link
			};

			function syncSelectStatement(cm, data, scope){
				if (data.origin !== 'setValue' || data.origin === '+input'){
					// Sync input
					let inputContent = cm.doc.getLine(0);
					let statementEntity = scope.$parent.parentService.getSelected();
					if (!_.isEmpty(statementEntity) && cm) {
						statementEntity.SelectStatement = JSON.stringify(inputContent);
						scope.$parent.parentService.markItemAsModified(statementEntity);
						scope.$parent.parentService.gridRefresh();
					}
				}
			}

			function controller($scope) {
				let self = this;
				let viewModel, _changeTimeout;

				function handleChange(cm, data) {
					// action complete, delete, enter
					let origins = ['complete', '+delete', 'setValue', 'cut', 'paste'];
					if (origins.indexOf(data.origin) !== -1 || data.text.length > 1) {
						syncSelectStatement(cm, data, $scope);
						return;
					}
					syncSelectStatement(cm, data, $scope);

					// get input text
					let input = data.text[0];

					// input space, ';', '(',')','{','}', '=', '[', ']'
					// eslint-disable-next-line no-useless-escape
					if (/[\s\u00a0;\(\)\{\}=\[\]\><]/.test(input) || !input.length) {
						return;
					}

					let cursor = cm.getCursor();
					let token = cm.getTokenAt(cursor);

					if (input === ' ' || input === '@' ||
						token.type === 'property' ||
						token.type === 'variable' ||
						(token.type === 'string' && token.string.indexOf('@') !== -1)) {
						if (!cm.state.completionActive) {
							cm.showHint({completeSingle: false});
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
					}, 100);
				}

				function onKeyDown(e) {
					e.stopPropagation();
				}

				this.cm = null;

				this.init = function (element, settings) {

					let hintService = new CodeMirror.HintService();
					settings.hintService = hintService;
					settings.placeholder = $translate.instant('estimate.main.lineItemSelStatement.inputFilter');

					self.cm = new CodeMirror(element[0], settings);
					self.cm.options.readOnly = $scope.readonly;
					$scope.focused = self.cm.state.focused;

					self.cm.on('cursorActivity', function (cm) {
						hintService.cursorActivityHint(cm);
					});

					self.cm.on('change', onChange);

					self.cm.on('blur', function () {
						if ($scope.onBlur) {
							$scope.onBlur();
						}
					});
					self.cm.on('focus', function () {
						if ($scope.onFocus) {
							$scope.onFocus();
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

					viewModel = service.get(settings.scriptId);
					viewModel.loadKeyWordsDef(settings).then(function (defs) {
						settings.defs = defs;

						self.cm.setOption('defs', defs);

					});
				};

				this.destroy = function (element) {
					self.cm.off('change', onChange);
					element.unbind('keydown', onKeyDown);
					if (_changeTimeout) {
						$timeout.cancel(_changeTimeout);
						_changeTimeout = null;
					}
				};

				this.indent = function (cm) {
					let range = {from: cm.getCursor(true), to: cm.getCursor(false)};
					cm.autoIndentRange(range.from, range.to);
				};

				this.format = function (cm) {
					let range = {from: cm.getCursor(true), to: cm.getCursor(false)};
					cm.autoFormatRange(range.from, range.to);
				};
			}

			function link(scope, element, attrs, ngModelCtrl) {
				let defaults = {
					lineNumbers: true,
					autoCloseBrackets: true,
					matchBrackets: true,
					theme: 'default script',
					tabSize: 8,
					indentUnit: 8,
					indentWithTabs: true,
					mode: 'filterscript',
					extraKeys: {
						'Ctrl-Space': 'autocomplete'
					},
					gutters: ['CodeMirror-linenumbers', 'CodeMirror-lint-markers'],
					lint: true,
					highlightSelectionMatches: {showToken: /[\w$\xa1-\uffff]/, annotateScrollbar: true}
				};
				let options = scope.$parent.$eval(attrs.options);
				let settings = $.extend(defaults, options || {});
				let splitter;

				// layout change, wait splitter initialized.
				let defer = $timeout(function () {
					defer = null;
					splitter = element.closest('.k-splitter').data('kendoSplitter');
					if (splitter) {
						splitter.bind('layoutChange', refreshCm);
					}
				}, 1000);

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
					service.unregisterCm(settings.scriptId, scope.ctrl.cm);
					if (defer) {
						$timeout.cancel(defer);
					}
					if (splitter) {
						splitter.unbind('layoutChange', refreshCm);
					}
				});

				// execute external init callback
				if (scope.onInit) {
					scope.onInit({
						vm: scope.ctrl,
						cm: scope.ctrl.cm
					});
				}

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

				$timeout(function () {
					refreshCm();
				}, 500);
			}
		}
	]);

})(angular, CodeMirror);
