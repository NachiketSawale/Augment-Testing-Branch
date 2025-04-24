/* globals angular */

(function (angular) {
	'use strict';

	function setDefault(options, prop, value) {
		if (!options.hasOwnProperty(prop)) {
			options[prop] = value;
		}
	}

	function scriptEditor($window) {
		return {
			restrict: 'AE',
			require: 'ngModel',
			scope: {
				options: '=',
				change: '='
			},
			compile: function compile() {
				if (angular.isUndefined($window.CodeMirror)) {
					throw new Error('CodeMirror is needed.');
				}
				return function postLink(scope, iElement, attr, ngModelCtrl) {
					var text = angular.isString(ngModelCtrl.$modelValue) ? ngModelCtrl.$modelValue : '';

					if (!scope.options) {
						scope.options = {};
					}
					setDefault(scope.options, 'singleLine', false);
					setDefault(scope.options, 'singleBlock', false);
					setDefault(scope.options, 'lineWrapping', true);
					setDefault(scope.options, 'lineNumbers', true);
					setDefault(scope.options, 'extraKeys', {'Ctrl-Space': 'autocomplete'});
					setDefault(scope.options, 'mode', {name: 'javascript', globalVars: true});
					setDefault(scope.options, 'autoCloseBrackets', true);
					setDefault(scope.options, 'matchBrackets', true);
					setDefault(scope.options, 'lint', true);
					setDefault(scope.options, 'value', text);
					setDefault(scope.options, 'scrollbarStyle', 'native');
					setDefault(scope.options, 'viewportMargin', Infinity);
					setDefault(scope.options, 'showHint', true);
					setDefault(scope.options, 'fixedGutter', true);
					setDefault(scope.options, 'readOnly', false);

					// force some options, when single lined
					if (scope.options.singleLine) {
						scope.options.scrollbarStyle = 'null';
						scope.options.lineNumbers = false;
						scope.options.lineWrapping = false;
						scope.options.fixedGutter = false;
						scope.options.extraKeys.Tab = false;
					} else if (scope.options.singleBlock) {
						scope.options.scrollbarStyle = 'null';
						scope.options.lineNumbers = false;
						scope.options.fixedGutter = false;
						scope.options.extraKeys.Tab = false;
					} else {
						setDefault(scope.options, 'gutters', ['CodeMirror-lint-markers']);
					}

					// create codemirror instance
					var instance = $window.CodeMirror(iElement[0], scope.options);

					if (scope.options.singleLine) {
						iElement[0].classList.add('code-field');
					}
					iElement[0].classList.add(attr.cssclass ? attr.cssclass : 'form-control');

					scope.$watch(function () {
						return scope.options;
					}, function (newVal, oldVal) {
						if (newVal && newVal !== oldVal) {
							for (var key in newVal) {
								if (newVal.hasOwnProperty(key)) {
									if (newVal[key] !== oldVal[key]) {
										instance.setOption(key, newVal[key]);
									}
								}
							}
						}
					}, true);

					instance.on('beforeChange', function (instance, change) {
						if (scope.options.singleLine || scope.options.singleBlock) {
							// remove ALL \n
							var newText = change.text.join('').replace(/\n/g, '');
							change.update(change.from, change.to, [newText]);
							return true;
						}
					});

					instance.on('change', function (cm) {
						ngModelCtrl.$setViewValue(cm.getValue());
						if (angular.isFunction(scope.change)) {
							scope.change(cm.getValue());
						}
					});

					ngModelCtrl.$render = function () {
						var value = ngModelCtrl.$modelValue;
						if (!angular.isString(value)) {
							value = isNaN(value) ? '' : value;
							value = angular.isNumber(value) ? value.toString() : value;
							value = value ? value : '';
						}
						instance.setValue(value);
						instance.clearHistory();
					};

					var splitter = $(iElement).closest('.k-splitter').data('kendoSplitter');
					if (splitter) {
						splitter.bind('resize', function () {
							instance.refresh();
						});
					}

					instance.refresh();
				};
			}
		};
	}

	scriptEditor.$inject = ['$window'];

	/**
	 * @ngdoc directive
	 * @name scriptEditorDirective
	 * @function
	 * @description
	 * Directive to add javascript editor.
	 */
	angular.module('platform').directive('scriptEditorDirective', scriptEditor);

})(angular);
