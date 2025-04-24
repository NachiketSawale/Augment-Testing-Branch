/* global CodeMirror */
(function (angular, CodeMirror) {
	'use strict';

	angular.module('qto.formula').directive('qtoFormulaScriptEditor', [function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				ngModel: '=',
				options: '=',
				id: '='
			},
			link: function (scope, elem, attrs, modelCtrl) {
				var scriptContext = {};
				var isEditing = false;
				scope.$watch('options.keyWords', function () {
					scriptContext = {};
					angular.forEach(scope.options.keyWords, function (keyword) {
						scriptContext[keyword] = null;
					});
				});

				var editor = new CodeMirror(elem[0], {
					lineNumbers: true,
					extraKeys: {'Tab': 'autocomplete'},
					mode: {name: 'javascript'},
					autoCloseBrackets: true,
					matchBrackets: true,
					value: scope.ngModel || ''
				});

				scope.$watch('ngModel', function () {
					if(isEditing === false)
					{
						modelCtrl.$setViewValue(scope.ngModel);
						editor.setValue(scope.ngModel || '');
					}
				});

				function onChange() {
					isEditing = true;
					var value = editor.getValue();
					modelCtrl.$setViewValue(value);
					isEditing = false;
				}

				CodeMirror.commands.autocomplete = function (cm) {
					cm.showHint(
						{
							globalScope: scriptContext
						}
					);
				};

				editor.on('change', onChange);

				if (angular.isArray(scope.options.events)) {
					scope.options.events.forEach(function (event) {
						editor.on(event.name, event.func);
					});
				}



				scope.$on('$destroy', function () {

					editor.off('change', onChange);
					if (angular.isArray(scope.options.events)) {
						scope.options.events.forEach(function (event) {
							editor.off(event.name, event.func);
						});
					}
				});
			}
		};
	}]);

})(angular, CodeMirror);