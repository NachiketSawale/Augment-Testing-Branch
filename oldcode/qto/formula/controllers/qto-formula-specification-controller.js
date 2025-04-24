/**
 * Created by lvi on 12/12/2014.
 */
(function (angular) {
	'use strict';
	angular.module('qto.formula').value('richTextControlBarDefinition', [
		['imageFile', 'fontName', 'fontSize', 'quote', 'bold', 'italics', 'underline',
			'redo', 'undo', 'clear', 'justifyLeft',
			'justifyCenter', 'justifyRight',
			'insertImage', 'insertLink']
	]);


	angular.module('qto.formula').controller('qtoFormulaSpecificationController',
		['$scope', 'qtoFormulaDataService', 'richTextControlBarDefinition',
			function ($scope, qtoFormulaDataService, richTextControlBarDefinition) {

				$scope.richTextControlBar = richTextControlBarDefinition;
				$scope.getCurrentFormula = function getCurrentFormula() {
					return qtoFormulaDataService.getSelected();
				};

				$scope.onPropertyChanged = function () {
					qtoFormulaDataService.markCurrentItemAsModified();
				};
			}]);
})(angular);