/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipController
	 * @function
	 *
	 * @description
	 * Main controller for the sales.wip module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesWipController',
		['$scope','$rootScope', '$translate', 'cloudDesktopInfoService', 'platformMainControllerService', 'salesWipService', 'salesWipBoqStructureService', 'salesWipTranslationService', 'salesWipNumberGenerationSettingsService', 'salesCommonLoadLookupDataService', 'estimateProjectRateBookConfigDataService', 'documentsProjectDocumentDataService', 'modelViewerStandardFilterService', 'boqMainLookupFilterService', 'procurementCommonTabConfigService','documentsProjectDocumentFileUploadDataService',
			function ($scope, $rootScope, $translate, cloudDesktopInfoService, platformMainControllerService, salesWipService, salesWipBoqStructureService, translationService, salesWipNumberGenerationSettingsService, salesCommonLoadLookupDataService, estimateProjectRateBookConfigDataService, documentsProjectDocumentDataService, modelViewerStandardFilterService, boqMainLookupFilterService, procurementCommonTabConfigService, fileUploadDataService) {

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('sales.wip.containerTitleWips'),
					parentService: salesWipService,
					columnConfig: [
						{documentField: 'WipHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false}
					]
				});

				// Header info
				cloudDesktopInfoService.updateModuleInfo($translate.instant('cloud.desktop.moduleDisplayNameWip'));

				var opt = {search: true, auditTrail: '2cb6ba0f497b4e809fcec6411a03f4f1'};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, salesWipService, mc, translationService, moduleName, opt);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('salesWipModelFilterService');

				procurementCommonTabConfigService.registerTabConfig(moduleName, salesWipService);

				salesWipNumberGenerationSettingsService.assertLoaded();
				salesCommonLoadLookupDataService.loadLookupData(salesWipService);
				boqMainLookupFilterService.setTargetBoqMainService(salesWipBoqStructureService);

				$scope.gridId = '689e0886de554af89aadd7e7c3b46f25';
				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function (dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});
				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					procurementCommonTabConfigService.unregisterTabConfig();
					platformMainControllerService.unregisterCompletely(salesWipService, sidebarReports, translationService, opt);
					estimateProjectRateBookConfigDataService.clearData();
					boqMainLookupFilterService.setTargetBoqMainService(null);
				});
			}]);

})();
