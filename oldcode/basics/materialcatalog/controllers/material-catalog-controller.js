(function (angular) {
	'use strict';

	var moduleName = 'basics.materialcatalog';

	/* jshint -W072*/ //many parameters because of dependency injection

	angular.module(moduleName).controller('basicsMaterialcatalogController',
		[
			'$scope',
			'platformMainControllerService',
			'basicsMaterialCatalogService',
			'basicsMaterialcatalogTranslationService',
			'materialcatalogSidebarWizardService',
			'documentsProjectDocumentDataService',
			'$translate',
			function ($scope, mainControllerService, mainDataService,
			          translateService, materialcatalogSidebarWizardService, documentsProjectDocumentDataService,$translate) {
				var opt = {search: true, reports: false, auditTrail: 'dd37fb8cc7c246c5bdd81f3dd40a0537'};
				var result = mainControllerService.registerCompletely($scope, mainDataService, {},
					translateService, moduleName, opt);
				materialcatalogSidebarWizardService.activate();

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title:$translate.instant('basics.materialcatalog.HeadTitle.grid'),
					parentService: mainDataService,
					columnConfig: [
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'MdcMaterialCatalogFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
					]
				});

				$scope.$on('$destroy', function () {
					mainControllerService.unregisterCompletely(mainDataService, result, translateService, opt);
					materialcatalogSidebarWizardService.deactivate();
				});

			}]);
})(angular);
