(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.formulaconfiguration';
	angular.module(moduleName).directive('ppsFormulaScriptEditorDirective', ppsFormulaScriptEditorDirective);

	ppsFormulaScriptEditorDirective.$inject = ['ppsFormulaScriptDataService', 'ppsFormulaVersionStatus'];

	function ppsFormulaScriptEditorDirective(ppsFormulaVersionDataService, ppsFormulaVersionStatus) {
		return {
			restrict: 'A',
			require: 'ngModel',
			template: `<div ng-if="codeMirrorReady" data-script-editor-directive
							data-change="changeScript" data-ng-model="formula.script"
							data-options="codeMirrorOptions" class="filler"></div>`,
			compile: function compile() {
				return getPostLink(ppsFormulaVersionDataService, ppsFormulaVersionStatus);
			}
		};
	}

	function getPostLink(ppsFormulaScriptDataService, ppsFormulaVersionStatus) {
		return function postLink(scope, iElement, attr, ngModelCtrl) {
			scope.codeMirrorReady = false;

			scope.changeScript = function (newScript) {
				ppsFormulaScriptDataService.markScriptAsModified(newScript);
			};

			scope.$watch(function () {
				return ppsFormulaScriptDataService.hasLinkedVersion() ? ppsFormulaScriptDataService.getLinkedVersion().Id : null;
			}, function updateOptionsAndScript(newSelectedId) {
				scope.codeMirrorReady = false;

				if (newSelectedId) {
					scope.formula.script = ppsFormulaScriptDataService.getScript();
				} else {
					scope.formula.script = '';
				}
				ngModelCtrl.$setViewValue(scope.formula.script);
				ppsFormulaScriptDataService.setCodeMirrorOptions(scope);
			});

			scope.$watch(function () {
				return ppsFormulaScriptDataService.hasLinkedVersion() ? ppsFormulaScriptDataService.getLinkedVersion().Status : null;
			}, function updateOptions(newStatus) {
				scope.codeMirrorReady = false;
				if (newStatus) {
					scope.codeMirrorOptions.readOnly = newStatus === ppsFormulaVersionStatus.new.id ? false : 'nocursor';
				}
				scope.codeMirrorReady = true;
			});

			scope.$watch(function () {
				return scope.codeMirrorOptions;
			}, function updateTools() {
				scope.tools.update();
			});
		};
	}

})(angular);
