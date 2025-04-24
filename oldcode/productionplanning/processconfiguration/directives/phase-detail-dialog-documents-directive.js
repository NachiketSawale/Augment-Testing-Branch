(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.processconfiguration';
	angular.module(moduleName).directive('phaseDetailDialogDocumentsDirective', [
		function () {
			return {
				scope: false,
				restrict: 'A',
				controller: 'productionplanningProcessConfigurationPhaseDetailDialogController',
				templateUrl: globals.appBaseUrl + 'productionplanning.processconfiguration/templates/phase-detail-dialog-documents-template.html'
			};


		}]);
})(angular);