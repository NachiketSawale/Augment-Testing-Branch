(function () {
	/* global globals */
	'use strict';
	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).controller('controllingGeneralcontractorController',
		['$scope', '$translate', '$injector', 'platformMainControllerService', 'controllingGeneralcontractorCostControlDataService',
			'controllingGeneralContractorTranslationService', 'cloudDesktopInfoService','documentsProjectDocumentDataService','controllingGeneralcontractorDocumentProjectProcessor',
			function ($scope, $translate, $injector, platformMainControllerService, dataservice, controllingGeneralContractorTranslationService, cloudDesktopInfoService, documentsProjectDocumentDataService,controllingGeneralcontractorDocumentProjectProcessor) {

				cloudDesktopInfoService.updateModuleInfo($translate.instant('controlling.generalcontractor.GeneralContractorControlling'));

				$scope.path = globals.appBaseUrl;
				let opt = {search: false, auditTrail: '144502ADFC9F46479D0399D1ADAA8F47'};
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, dataservice, mc, controllingGeneralContractorTranslationService, moduleName, opt);

				let module = angular.module(moduleName);
				platformMainControllerService.registerWizards(module);

				platformMainControllerService.registerReports(module);
				platformMainControllerService.registerTranslation($scope, mc, controllingGeneralContractorTranslationService);

				function loadTranslations() {
					$scope.translate = controllingGeneralContractorTranslationService.getTranslate();
				}

				// register translation changed event
				controllingGeneralContractorTranslationService.registerUpdates(loadTranslations);

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('procurement.invoice.title.header'),
					parentService: $injector.get('controllingGeneralcontractorCostControlDataService'),
					columnConfig: [
						{documentField: 'InvHeaderFk', dataField: 'Id', readOnly: true},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: true},
						{documentField: 'MdcControllingUnitFk', dataField: 'MdcControllingUnitFk', readOnly: true},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BpdBusinesspartnerFk', readOnly: true},
						{documentField: 'PrcPackageFk', dataField: 'PrcPackageFk', readOnly: true},
						{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: true},
						{documentField: 'PesHeaderFk', dataField: 'PesHeaderFk', readOnly: true},
					],
					processors: [controllingGeneralcontractorDocumentProjectProcessor]
				});

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(dataservice, sidebarReports, controllingGeneralContractorTranslationService, opt);
				});
			}]);
})();
