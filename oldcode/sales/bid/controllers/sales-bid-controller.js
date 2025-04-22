/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidController
	 * @function
	 *
	 * @description
	 * Main controller for the sales.bid module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesBidController',
		['$scope', '$rootScope', '$translate', 'salesCommonModuleHeaderInfoService', 'platformMainControllerService', 'salesBidService', 'salesBidBoqStructureService', 'salesBidTranslationService', 'salesBidNumberGenerationSettingsService', 'salesCommonLoadLookupDataService', 'estimateProjectRateBookConfigDataService', 'modelViewerStandardFilterService', 'documentsProjectDocumentDataService', 'boqMainLookupFilterService', 'procurementCommonTabConfigService',
			'businesspartnerCertificateCertificateContainerServiceFactory', 'documentsProjectDocumentFileUploadDataService',
			function ($scope, $rootScope, $translate, salesCommonModuleHeaderInfoService, platformMainControllerService, salesBidService, salesBidBoqStructureService, translationService, salesBidNumberGenerationSettingsService, salesCommonLoadLookupDataService, estimateProjectRateBookConfigDataService, modelViewerStandardFilterService, documentsProjectDocumentDataService, boqMainLookupFilterService, procurementCommonTabConfigService,
				bpCertificateContainerServiceFactory, fileUploadDataService) {

				var certificateDataService = bpCertificateContainerServiceFactory.getDataService('sales.bid', salesBidService);
				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('sales.bid.containerTitleBids'),
					parentService: salesBidService,
					columnConfig: [
						{documentField: 'BidHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false}
					],
					subModules: [
						{
							service: certificateDataService,
							title: $translate.instant('cloud.common.actualCertificateListContainerTitle'),
							columnConfig: [
								{documentField: 'BpdCertificateFk', dataField: 'Id', readOnly: false},
								{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
								{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
								{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
								{documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk', readOnly: false}
							]
						}
					]
				});

				boqMainLookupFilterService.setMainItemService(salesBidService);
				boqMainLookupFilterService.setForceLoadOfSingleProjectBoq(true);
				boqMainLookupFilterService.setTargetBoqMainService(salesBidBoqStructureService);

				// Header info
				salesCommonModuleHeaderInfoService.register(salesBidService, $translate.instant('cloud.desktop.moduleDisplayNameBid'));

				var opt = {search: true, auditTrail: 'ad7863f10eb34b4c9434d483743885f0'}; // TODO: check where previous ARD 0b0c50541b5245a0a483ee0ca3a29bca is from
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, salesBidService, mc, translationService, moduleName, opt);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('salesBidModelFilterService');

				procurementCommonTabConfigService.registerTabConfig(moduleName, salesBidService);

				salesBidNumberGenerationSettingsService.assertLoaded();
				salesCommonLoadLookupDataService.loadLookupData(salesBidService);

				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function (dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});
				// un-register on destroy
				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					procurementCommonTabConfigService.unregisterTabConfig();
					platformMainControllerService.unregisterCompletely(salesBidService, sidebarReports, translationService, opt);
					estimateProjectRateBookConfigDataService.clearData();
					boqMainLookupFilterService.setMainItemService(null);
					boqMainLookupFilterService.setForceLoadOfSingleProjectBoq(false);
					boqMainLookupFilterService.setTargetBoqMainService(null);
					salesCommonModuleHeaderInfoService.unregister(salesBidService);
				});
			}]);

})();
