/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractController
	 * @function
	 *
	 * @description
	 * Main controller for the sales.contract module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesContractController',
		['$scope','$rootScope', '$translate', 'platformMainControllerService', 'salesContractService', 'salesContractBoqStructureService', 'salesContractTranslationService', 'salesContractNumberGenerationSettingsService', 'salesCommonLoadLookupDataService', 'estimateProjectRateBookConfigDataService', 'basicsCharacteristicDataServiceFactory', 'modelViewerStandardFilterService', 'procurementContextService', 'documentsProjectDocumentDataService', 'boqMainLookupFilterService', 'procurementCommonTabConfigService',
			'businesspartnerCertificateCertificateContainerServiceFactory', 'salesCommonModuleHeaderInfoService', 'documentsProjectDocumentFileUploadDataService', 'salesContractCertificateActualDataService',
			function ($scope, $rootScope, $translate, platformMainControllerService, salesContractService, salesContractBoqStructureService, translationService, salesContractNumberGenerationSettingsService, salesCommonLoadLookupDataService, estimateProjectRateBookConfigDataService, basicsCharacteristicDataServiceFactory, modelViewerStandardFilterService, procurementContextService, documentsProjectDocumentDataService, boqMainLookupFilterService, procurementCommonTabConfigService,
				bpCertificateContainerServiceFactory, salesCommonModuleHeaderInfoService, fileUploadDataService, salesContractCertificateActualDataService) {
				var certificateDataService = bpCertificateContainerServiceFactory.getDataService('sales.contract', salesContractService);
				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('sales.contract.containerTitleContracts'),
					parentService: salesContractService,
					columnConfig: [
						{documentField: 'OrdHeaderFk', dataField: 'Id', readOnly: false},
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
							],
							otherFilter: [{documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk'}]
						},
						{
							service: salesContractCertificateActualDataService,
							title: $translate.instant('cloud.common.actualCertificateListContainerTitle'),
							columnConfig: [
								{ documentField: 'BpdCertificateFk', dataField: 'Id', readOnly: false },
								{ documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false },
								{ documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false },
								{ documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk', readOnly: false }
							],
							otherFilter: [{ documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk' }]
						}
					]
				});

				// Header info
				salesCommonModuleHeaderInfoService.register(salesContractService, $translate.instant('cloud.desktop.moduleDisplayNameContract'));

				var opt = {search: true, auditTrail: 'd6505fc0a01d4aaea7132a2223a56ce6'};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, salesContractService, mc, translationService, moduleName, opt);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('salesContractModelFilterService');

				procurementCommonTabConfigService.registerTabConfig(moduleName, salesContractService);

				salesContractNumberGenerationSettingsService.assertLoaded();
				salesCommonLoadLookupDataService.loadLookupData(salesContractService);

				// needed to install listener for parent-service create event (even when characteristic container ist not activated)
				/* var characteristicDataService = */basicsCharacteristicDataServiceFactory.getService(salesContractService, 24);

				procurementContextService.setLeadingService(salesContractService);
				procurementContextService.setMainService(salesContractService);
				boqMainLookupFilterService.setTargetBoqMainService(salesContractBoqStructureService);

				function onCopySourceBoqContainerCreated() {
					salesContractService.maintainBoqMainLookupFilter(salesContractService.getSelected());
				}
				boqMainLookupFilterService.copySourceBoqContainerCreated.register(onCopySourceBoqContainerCreated);
				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function (dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});
				// un-register on destroy
				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					procurementCommonTabConfigService.unregisterTabConfig();
					platformMainControllerService.unregisterCompletely(salesContractService, sidebarReports, translationService, opt);
					estimateProjectRateBookConfigDataService.clearData();
					boqMainLookupFilterService.setTargetBoqMainService(null);
					procurementContextService.removeModuleValue(procurementContextService.leadingServiceKey);
					procurementContextService.removeModuleValue(procurementContextService.prcCommonMainService);
					boqMainLookupFilterService.copySourceBoqContainerCreated.unregister(onCopySourceBoqContainerCreated);
					salesCommonModuleHeaderInfoService.unregister(salesContractService);
				});
			}]);

})();
