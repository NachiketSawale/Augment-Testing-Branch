(function () {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteController',
		['$scope', '$translate', 'procurementQuoteHeaderDataService', 'procurementCommonPrcItemDataService', 'procurementQuoteRequisitionDataService',
			'procurementQuoteTranslationService', 'procurementContextService', 'platformMainControllerService',
			'procurementCommonDataNewDataService', 'platformModuleDataExtensionService',
			'procurementCommonTabConfigService', 'cloudDesktopSidebarService', 'documentsProjectDocumentDataService', 'platformNavBarService',
			'prcBoqMainService', 'procurementCommonPrcBoqService', 'procurementQuoteWizardsService', 'basicsImportService', 'platformModalService',
			'procurementCommonSidebarSearchOptionService', 'procurementQuoteTotalDataService', 'procurementCommonPriceConditionService',
			'platformRuntimeDataService', 'platformGridAPI', 'basicsCharacteristicDataServiceFactory',
			'modelViewerStandardFilterService', 'prcItemScopeServiceBootstrap',
			'documentsProjectDocumentModuleContext', '$rootScope', 'procurementQuoteCertificateActualDataService','documentsProjectDocumentFileUploadDataService',
			function ($scope, $translate, mainService, itemService, requisitionService,
				translateService, moduleContext, mainControllerService,
				procurementCommonOverviewDataService, platformModuleDataExtensionService,
				procurementCommonTabConfigService, cloudDesktopSidebarService, documentsProjectDocumentDataService, platformNavBarService,
				prcBoqMainService, procurementCommonPrcBoqService, procurementQuoteWizardsService, basicsImportService, platformModalService,
				procurementCommonSidebarSearchOptionService, procurementQuoteTotalDataService, procurementCommonPriceConditionService, platformRuntimeDataService, platformGridAPI,
				basicsCharacteristicDataServiceFactory,
				modelViewerStandardFilterService, prcItemScopeServiceBootstrap,
				documentsProjectDocumentModuleContext, $rootScope, procurementQuoteCertificateActualDataService,fileUploadDataService) {

				var opt = {search: true, reports: false, wizards: true, auditTrail: 'ec10c67bcc3e4967b22574f23df067af'};
				var result = mainControllerService.registerCompletely($scope, mainService, {}, translateService, moduleName, opt);
				basicsCharacteristicDataServiceFactory.getService(mainService, mainService.targetSectionId);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('procurementQuoteModelFilterService');

				// set module context variables
				moduleContext.setLeadingService(mainService);
				moduleContext.setMainService(requisitionService);
				moduleContext.setItemDataService(itemService.getService(requisitionService, true));
				prcItemScopeServiceBootstrap.execute();

				moduleContext.setModuleReadOnly(false);
				moduleContext.setModuleStatus({});

				procurementCommonOverviewDataService.getService(requisitionService);

				// enable filters in contract header filter service
				mainService.registerFilters();
				// mainService.registerSidebarFilter(); // rei@17.6.15 already done in platformMainControllerService.registerCompletely

				procurementCommonTabConfigService.registerTabConfig(moduleName, requisitionService);

				var boqMainService = prcBoqMainService.getService(requisitionService);
				var prcBoqService = procurementCommonPrcBoqService.getService(requisitionService, boqMainService);

				var originalFn = platformNavBarService.getActionByKey('save').fn;
				platformNavBarService.getActionByKey('save').fn = function () {
					if (originalFn) {
						originalFn();
					}
					prcBoqService.update();
				};

				var originDiscard = platformNavBarService.getActionByKey('discard').fn;
				platformNavBarService.getActionByKey('discard').fn = function () {
					originDiscard();
					var config = documentsProjectDocumentModuleContext.getConfig();
					var documentService = documentsProjectDocumentDataService.getService(config);
					documentService.clear();
				};

				var prcSearch = procurementCommonSidebarSearchOptionService.getProcurementSidebarSearchOptions();
				cloudDesktopSidebarService.registerSidebarContainer(prcSearch, true);

				var sidebarInfo = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'procurement.quote/templates/sidebar-info.html'
				};
				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(sidebarInfo, true);

				function onQuoteStatusChanged(quoteStatus) {
					if (quoteStatus) {
						prcBoqMainService.getService(requisitionService).setReadOnly(quoteStatus.IsReadonly);
						prcBoqMainService.getService(requisitionService).setDragAndDropAllowed(!quoteStatus.IsProtected && !quoteStatus.IsReadonly);
						$rootScope.$emit('permission-service:changed');
					}
				}

				mainService.selectedQuoteStatusChanged.register(onQuoteStatusChanged);
				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('procurement.quote.quoteContainerGridTitle'),
					parentService: mainService,
					columnConfig: [
						{documentField: 'QtnHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'RfqHeaderFk', dataField: 'RfqHeaderFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false},
						{documentField: 'BpdSubsidiaryFk', dataField: 'SubsidiaryFk', readOnly: false}
					],
					subModules: [
						{
							service: procurementQuoteCertificateActualDataService,
							title: $translate.instant('cloud.common.actualCertificateListContainerTitle'),
							columnConfig: [
								{documentField: 'BpdCertificateFk', dataField: 'Id', readOnly: false},
								{documentField: 'QtnHeaderFk', dataField: 'QtnHeaderFk', readOnly: false},
								{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
								{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
								{documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk', readOnly: false}
							],
							otherFilter: [{documentField: 'QtnHeaderFk', dataField: 'QtnHeaderFk'}]
						}
					]
				});

				procurementQuoteWizardsService.activate();

				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});

				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					/** @namespace requisitionService.onUpdateRequested */
					if (requisitionService.onUpdateRequested) {
						platformModuleDataExtensionService.unregisterUpdateDataExtensionEvent(requisitionService.onUpdateRequested);
					}
					mainService.unRegisterFilters();

					// DEV-34862 cloudDesktopSidebarService.registerSidebarContainer should before platformMainControllerService.unregisterCompletely
					var defaultSearch = procurementCommonSidebarSearchOptionService.getDefaultSidebarSearchOptions();
					cloudDesktopSidebarService.registerSidebarContainer(defaultSearch, true);

					mainControllerService.unregisterCompletely(mainService, result, translateService, opt);
					mainService.selectedQuoteStatusChanged.unregister(onQuoteStatusChanged);

					// noinspection JSCheckFunctionSignatures
					cloudDesktopSidebarService.unRegisterSidebarContainer(sidebarInfo.name, true);
					// remove context values
					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
					moduleContext.removeModuleValue(moduleContext.itemDataServiceKey);
					moduleContext.removeModuleValue(moduleContext.moduleReadOnlyKey);
					/** @namespace moduleContext.moduleNameKey */
					moduleContext.removeModuleValue(moduleContext.moduleNameKey);

					procurementCommonTabConfigService.unregisterTabConfig();

					procurementQuoteWizardsService.deactivate();
				});

			}]);

	/** fixed warning */
	/** @namespace item.RfqHeaderFk */
	/** @namespace responseData.Main */
	/** @namespace k.IsPriceComponent */
	/** @namespace k.TotalOc */
})();

