/* globals angular*/

(function (angular) {
	'use strict';

	function setDefault(options, prop, value) {
		if (!options.hasOwnProperty(prop)) {
			options[prop] = value;
		}
	}

	function basicsWorkflowGridScriptEditorDirective($window, basicsWorkflowActionEditorService) {
		return {
			restrict: 'AE',
			require: 'ngModel',
			scope: {
				options: '='
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
					setDefault(scope.options, 'lineWrapping', false);
					setDefault(scope.options, 'lineNumbers', false);
					setDefault(scope.options, 'singleLine', true);
					setDefault(scope.options, 'extraKeys', {'Ctrl-Space': 'autocomplete'});
					setDefault(scope.options, 'mode', 'javascript');
					setDefault(scope.options, 'autoCloseBrackets', true);
					setDefault(scope.options, 'matchBrackets', true);
					setDefault(scope.options, 'lint', false);
					setDefault(scope.options, 'value', text);
					setDefault(scope.options, 'scrollbarStyle', 'native');
					setDefault(scope.options, 'viewportMargin', Infinity);
					setDefault(scope.options, 'showHint', false);
					setDefault(scope.options, 'fixedGutter', false);
					setDefault(scope.options, 'gutters', []);
					setDefault(scope.options, 'readOnly', basicsWorkflowActionEditorService.setCodeMirrorOptions().readOnly);

					var instance = $window.CodeMirror(iElement[0], scope.options);

					scope.$watch(function () {
							return scope.options;
						},
						function (newVal, oldVal) {
							if (newVal && newVal !== oldVal) {
								for (var key in newVal) {
									if (newVal.hasOwnProperty(key) && newVal[key] !== oldVal[key]) {
										instance.setOption(key, newVal[key]);
									}
								}
							}
						});

					iElement[0].classList.add(attr.cssclass ? attr.cssclass : 'form-control');
					iElement[0].classList.add('code-field');

					instance.on('change', function (cm) {
						ngModelCtrl.$setViewValue(cm.getValue());
					});

					ngModelCtrl.$render = function () {
						instance.setValue(angular.isString(ngModelCtrl.$modelValue) ? ngModelCtrl.$modelValue : '');
					};

					instance.on('beforeChange', function (instance, change) {
						var newText = change.text.join('').replace(/\n/g, ''); // remove ALL \n !
						change.update(change.from, change.to, [newText]);
						return true;
					});

					instance.on('keydown', function (cm, key) {
						var keyCodes = [9];
						// prevent tab, enter, arrow keys press
						if (keyCodes.indexOf(key.keyCode) >= 0) {
							key.preventDefault();
							// key.stopPropagation();
						}
					});

					instance.refresh();
				};
			}
		};
	}

	basicsWorkflowGridScriptEditorDirective.$inject = ['$window', 'basicsWorkflowActionEditorService'];

	/**
	 * @ngdoc directive
	 * @name scriptEditorDirective
	 * @function
	 * @description
	 * Directive to add javascript editor.
	 */
	angular.module('basics.workflow')
		.directive('basicsWorkflowGridScriptEditorDirective', basicsWorkflowGridScriptEditorDirective);

})(angular);
