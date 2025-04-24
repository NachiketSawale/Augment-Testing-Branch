/**
 * Created by anl on 1/24/2017.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.report';

	angular.module(moduleName).controller('productionplanningReportController', ReportMainController);

	ReportMainController.$inject = ['$scope', 'platformMainControllerService', 'productionplanningReportReportDataService',
		'productionplanningMountingTranslationService', 'productionplanningMountingWizardService',
		'modelViewerStandardFilterService', 'ppsDocumentReportService'];

	function ReportMainController($scope, platformMainControllerService, ppsReportDataService,
								  translationService, wizardService,
								  modelViewerStandardFilterService, ppsDocumentReportService) {
		var options = {search: true, reports: false, auditTrail: 'db5624d5f5fa415793988468b048f845'};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, ppsReportDataService,
			{}, translationService, moduleName, options);

		wizardService.activate();

		modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('ppsReportModelFilterService');

		// un-register on destroy
		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			wizardService.deactivate();
			platformMainControllerService.unregisterCompletely(ppsReportDataService, sidebarReports,
				translationService, options);
		});
	}
})();