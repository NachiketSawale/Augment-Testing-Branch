/**
 * Created by lst on 2/24/2017.
 */

/* global CodeMirror,$ */
(function (angular, CodeMirror) {
	'use strict';

	var moduleName = 'constructionsystem.common';

	/* jshint -W074 */
	/* jshint -W040 */
	angular.module(moduleName).directive('constructionSystemCommonFilterEditor', [
		'constructionSystemCommonFilterEditorService', '$timeout', '$translate',
		function (service, $timeout, $translate) {
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

			function controller($scope) {
				var self = this;
				var viewModel, _changeTimeout;

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
					}, 200);
				}

				function onKeyDown(e) {
					e.stopPropagation();
				}

				this.cm = null;

				this.init = function (element, settings) {

					var hintService = new CodeMirror.HintService();
					settings.hintService = hintService;
					settings.placeholder = $translate.instant('constructionsystem.master.placeholder');

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

					$scope.$watch(function () {
						return $scope.$parent.searchOptions.getSelectionParameterVersion();
					}, function () {
						self.cm.setOption('selectionParameters', $scope.$parent.searchOptions.getSelectionParameters());
					});

					// make the codemirror readonly or not with readonly status changed.
					$scope.$watch('readonly', function () {
						self.cm.options.readOnly = $scope.readonly;
					});

					viewModel = service.get('filter');
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
					var range = {from: cm.getCursor(true), to: cm.getCursor(false)};
					cm.autoIndentRange(range.from, range.to);
				};

				this.format = function (cm) {
					var range = {from: cm.getCursor(true), to: cm.getCursor(false)};
					cm.autoFormatRange(range.from, range.to);
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
					mode: 'filterscript',
					extraKeys: {
						'Ctrl-Space': 'autocomplete'
					},
					gutters: ['CodeMirror-linenumbers', 'CodeMirror-lint-markers'],
					lint: true,
					highlightSelectionMatches: {showToken: /[\w$\xa1-\uffff]/, annotateScrollbar: true}
				};
				var options = scope.$parent.$eval(attrs.options);
				var settings = $.extend(defaults, options || {});
				var splitter;

				// layout change, wait splitter initialized.
				var defer = $timeout(function () {
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

				// eslint-disable-next-line no-unused-vars
				var deferChange = $timeout(function () {
					deferChange = null;
					refreshCm();
				}, 500);
			}
		}
	]);

})(angular, CodeMirror);
