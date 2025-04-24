(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name pps-accounting-result-script-editor-container
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 */
	const moduleName = 'productionplanning.accounting';
	angular.module(moduleName).directive('ppsAccountingResultScriptEditorDirective', ppsAccountingScriptEditorDirective);

	ppsAccountingScriptEditorDirective.$inject = ['ppsAccountingResultScriptDataService'];

	function ppsAccountingScriptEditorDirective(ppsAccountingResultScriptDataService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			template: `<div ng-if="codeMirrorReady" data-script-editor-directive
							data-change="changeScript" data-ng-model="formula.script"
							data-options="codeMirrorOptions" class="filler"></div>`,
			compile: function compile() {
				return getPostLink(ppsAccountingResultScriptDataService);
			}
		};
	}

	function getPostLink(ppsAccountingResultScriptDataService) {
		return function postLink(scope, iElement, attr, ngModelCtrl) {
			scope.codeMirrorReady = false;

			scope.changeScript = function (newScript) {
				ppsAccountingResultScriptDataService.markScriptAsModified(newScript);
			};

			scope.$watch(function () {
				return ppsAccountingResultScriptDataService.hasSelectedParentItem() ? ppsAccountingResultScriptDataService.getSelectedParentItem().Id : null;
			}, function updateOptionsAndScript(newSelectedId) {
				scope.codeMirrorReady = false;

				if (newSelectedId) {
					scope.formula.script = ppsAccountingResultScriptDataService.getScript();
				} else {
					scope.formula.script = '';
				}
				ngModelCtrl.$setViewValue(scope.formula.script);
				ppsAccountingResultScriptDataService.setCodeMirrorOptions(scope);
			});

			scope.$watch(function () {
				return scope.codeMirrorOptions;
			}, function updateTools() {
				scope.tools.update();
			});
		};
	}
})(angular);
