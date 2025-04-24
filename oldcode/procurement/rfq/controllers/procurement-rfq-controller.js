(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc controller
	 * @name procurement.rfq.controller:procurementRfqController
	 * @requires $scope
	 * @description
	 *
	 * Controller for module procurement.rfq
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementRfqController',
		['$scope', 'platformMainControllerService', 'procurementRfqMainService',
			'procurementRfqTranslationService', 'procurementCommonTabConfigService',
			'cloudDesktopSidebarService', 'documentsProjectDocumentDataService', 'procurementRfqWizardService',
			'procurementCommonSidebarSearchOptionService', 'procurementContextService', 'procurementRfqRequisitionService',
			'procurementCommonDataNewDataService', 'basicsCharacteristicDataServiceFactory', '$translate',
			'modelViewerStandardFilterService', 'procurementRfqNumberGenerationSettingsService', 'platformNavBarService',
			'documentsProjectDocumentModuleContext','documentsProjectDocumentFileUploadDataService','$rootScope',
			function ($scope, mainControllerService, mainService,
				translateService, procurementCommonTabConfigService,
				cloudDesktopSidebarService, documentsProjectDocumentDataService, procurementRfqWizardService,
				procurementCommonSidebarSearchOptionService, moduleContext, requisitionService,
				procurementCommonOverviewDataService, basicsCharacteristicDataServiceFactory, $translate,
				modelViewerStandardFilterService, procurementRfqNumberGenerationSettingsService, platformNavBarService,
				documentsProjectDocumentModuleContext,fileUploadDataService,$rootScope) {

				basicsCharacteristicDataServiceFactory.getService(mainService, mainService.targetSectionId);
				var opt = {search: true, reports: false, wizards: true,auditTrail:'87a0f8626ecd4c1782823fdc59158041'};
				var result = mainControllerService.registerCompletely($scope, mainService, {}, translateService, moduleName, opt);

				// mainService.registerSidebarFilter(); // rei@17.6.15 already done in platformMainControllerService.registerCompletely

				procurementCommonTabConfigService.registerTabConfig(moduleName, mainService);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('procurementRfqModelFilterService');
				procurementRfqNumberGenerationSettingsService.assertLoaded();

				// add export capability
				var exportOptions = {
					ModuleName: moduleName,
					// permission: '40af135e208349168b8ac5f330a09500#e',
					MainContainer: {
						Id: 'procurement-rfq-header-grid',
						Label: 'procurement.rfq.headerGridTitle'
					},
					SubContainers: [
						{
							Id: 'procurement-rfq-businesspartner-grid',
							Qualifier: 'bidders',
							Label: 'procurement.rfq.businessPartnerGridTitle',
							Selected: false
						}
					]
				};
				mainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				var prcSearch = procurementCommonSidebarSearchOptionService.getProcurementSidebarSearchOptions();
				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(prcSearch, true);

				var sidebarInfo = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'procurement.rfq/templates/sidebar-info.html'
				};
				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(sidebarInfo, true);

				var originDiscard = platformNavBarService.getActionByKey('discard').fn;
				platformNavBarService.getActionByKey('discard').fn = function () {
					originDiscard();
					var config = documentsProjectDocumentModuleContext.getConfig();
					var documentService = documentsProjectDocumentDataService.getService(config);
					documentService.clear();
				};

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('procurement.rfq.headerGridTitle'),
					parentService: mainService,
					columnConfig: [
						{documentField: 'RfqHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
					]
				});

				procurementRfqWizardService.active();

				moduleContext.setLeadingService(mainService);
				moduleContext.setMainService(requisitionService);


				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});

				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					var defaultSearch = procurementCommonSidebarSearchOptionService.getDefaultSidebarSearchOptions();
					// noinspection JSCheckFunctionSignatures
					cloudDesktopSidebarService.registerSidebarContainer(defaultSearch, true);

					// noinspection JSCheckFunctionSignatures
					cloudDesktopSidebarService.unRegisterSidebarContainer(sidebarInfo.name, true);
					mainControllerService.unregisterCompletely(mainService, result, translateService, opt);
					procurementCommonTabConfigService.unregisterTabConfig();

					procurementRfqWizardService.deactive();
					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
				});
			}]);
})(angular);