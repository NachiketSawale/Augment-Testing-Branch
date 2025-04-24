(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.cadimport';

	angular.module(moduleName).controller('productionplanningCadimportController', MainController);

	MainController.$inject = ['$scope', 'platformMainControllerService',
		'productionplanningDrawingTranslationService', 'ppsCadimportDrawingDataService', 'ppsDocumentReportService'];

	function MainController($scope, platformMainControllerService,
							translationService, dataService, ppsDocumentReportService) {
		var options = {search: true, reports: false};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, dataService,
			{}, translationService, moduleName, options);

		//wizardService.activate();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			//wizardService.deactivate();
			platformMainControllerService.unregisterCompletely(dataService, sidebarReports,
				translationService, options);
		});
	}
})();
