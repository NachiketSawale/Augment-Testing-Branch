(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName).controller('basicsProcurementstructureController',
		[
			'$scope',
			'platformMainControllerService',
			'basicsProcurementstructureTranslationService',
			'basicsProcurementStructureService',
			'procurementStructureSidebarWizardService',
			'documentsProjectDocumentDataService',
			'$translate',
			'$injector',
			function ($scope,
			          platformMainControllerService,
			          translateService,
			          mainDataService,
			          procurementStructureSidebarWizardService,
			          documentsProjectDocumentDataService,
					  $translate,
					  $injector) {

				var opt = {search: true, reports: false, auditTrail: 'c833e6c2f56c4033a196496285850384'};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, mainDataService, {}, translateService, moduleName, opt);

				procurementStructureSidebarWizardService.activate();

				documentsProjectDocumentDataService.register({
					moduleName: 'basics.procurementstructure',
					title:$translate.instant('basics.procurementstructure.gridContainerTitle'),
					parentService: mainDataService,
					columnConfig: [
						{documentField: 'PrcStructureFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
					]
				});

				var moduleContext = $injector.get('procurementContextService');
				// set module context variables
				moduleContext.setLeadingService(mainDataService);
				moduleContext.setMainService(mainDataService);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(mainDataService, sidebarReports, translateService, opt);
					procurementStructureSidebarWizardService.deactivate();
				});
			}
		]);
})(angular);
