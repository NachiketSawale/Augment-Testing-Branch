(function () {
	'use strict';

	var moduleName = 'productionplanning.header';

	angular.module(moduleName).controller('productionplanningHeaderController', Controller);

	Controller.$inject = ['$scope',
		'platformMainControllerService',
		'productionplanningHeaderDataService',
		'productionplanningHeaderTranslationService',
		'modelViewerStandardFilterService',
		'productionplanningHeaderWizardService',
		'ppsDocumentReportService'];

	function Controller(
		$scope,
		platformMainControllerService,
		dataServ,
		translationServ,
		modelViewerStandardFilterService,
		headerWizardService,
		ppsDocumentReportService) {
		var options = {search: true, reports: false};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, dataServ, {}, translationServ, moduleName, options);

		modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('ppsHeaderModelFilterService');
		headerWizardService.activate();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			platformMainControllerService.unregisterCompletely(dataServ, sidebarReports, translationServ, options);
			headerWizardService.deactivate();
		});
	}
})();
