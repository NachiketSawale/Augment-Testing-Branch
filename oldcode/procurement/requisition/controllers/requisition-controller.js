(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	let moduleName = 'procurement.requisition';

	angular.module(moduleName).controller('procurementRequisitionController',
		[
			'$scope',
			'$translate',
			'$injector',
			'platformMainControllerService',
			'procurementRequisitionTranslationService',
			'procurementContextService',
			'platformNavBarService',
			'procurementRequisitionHeaderDataService',
			'procurementCommonPrcItemDataService',
			'cloudDesktopSidebarService',
			'procurementCommonTotalDataService',
			'procurementCommonHeaderTextNewDataService',
			'procurementCommonItemTextNewDataService',
			'procurementCommonTabConfigService',
			'procurementCommonPrcBoqService',
			'prcBoqMainService',
			'documentsProjectDocumentDataService',
			'procurementRequisitionWizardService',
			'procurementCommonSidebarSearchOptionService',
			'platformModalService',
			'basicsCharacteristicDataServiceFactory',
			'modelViewerStandardFilterService',
			'prcItemScopeServiceBootstrap',
			'procurementRequisitionNumberGenerationSettingsService',
			'documentsProjectDocumentModuleContext',
			'procurementCommonPriceConditionService',
			'documentsProjectDocumentFileUploadDataService',
			'$rootScope',
			'platformDataServiceModificationTrackingExtension',
			'platformGridAPI',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope,
				$translate,
				$injector,
				platformMainControllerService,
				translateService,
				moduleContext,
				platformNavBarService,
				leadingService,
				procurementCommonPrcItemDataService,
				cloudDesktopSidebarService,
				procurementCommonTotalDataService,
				procurementCommonHeaderTextDataService,
				procurementCommonItemTextNewDataService,
				procurementCommonTabConfigService,
				procurementCommonPrcBoqService,
				prcBoqMainService,
				documentsProjectDocumentDataService,
				procurementRequisitionWizardService,
				procurementCommonSidebarSearchOptionService,
				platformModalService,
				basicsCharacteristicDataServiceFactory,
				modelViewerStandardFilterService,
				prcItemScopeServiceBootstrap,
				procurementRequisitionNumberGenerationSettingsService,
				documentsProjectDocumentModuleContext,
				procurementCommonPriceConditionService,
				fileUploadDataService,
				$rootScope,
				platformDataServiceModificationTrackingExtension,
				platformGridAPI) {

				let opt = {search: true, reports: false, wizards: true, auditTrail: '97c809692df54f42945dc6f936c16156'};
				let result = platformMainControllerService.registerCompletely($scope, leadingService, {}, translateService, moduleName, opt);
				basicsCharacteristicDataServiceFactory.getService(leadingService, leadingService.targetSectionId);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('procurementRequisitionModelFilterService');

				procurementRequisitionNumberGenerationSettingsService.assertLoaded();
				// add export capability

				let exportOptions = {
					ModuleName: moduleName,
					MainContainer: {
						Id: 'procurement.common.prcItemsHeaderGrid',
						Label: 'procurement.requisition.headerGrid.reqheaderGridTitle'
					},
					SubContainers: [
						{
							Id: 'procurement.common.prcItemsGrid',      // must match an entry in the module-containers.json!
							Qualifier: 'prcitem',                       // unique identifier for subcontainers (used on server side!)
							Label: 'procurement.common.item.prcItemContainerGridTitle', // listbox item text
							Selected: false                              // pre-select container in the listbox
						}
					]
				};

				platformMainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				procurementRequisitionWizardService.active();

				// ---

				leadingService.registerFilters();

				// set context values
				moduleContext.setLeadingService(leadingService);
				moduleContext.setMainService(leadingService);
				moduleContext.setItemDataService(procurementCommonPrcItemDataService.getService(leadingService));
				procurementCommonTotalDataService.getService(leadingService); // start total service when module loaded
				procurementCommonHeaderTextDataService.getService(leadingService); // start header text service when module loaded
				procurementCommonItemTextNewDataService.getService(moduleContext.getItemDataService()); // start item text service when module loaded
				prcItemScopeServiceBootstrap.execute();

				let boqMainService = prcBoqMainService.getService(leadingService);
				let prcBoqService = procurementCommonPrcBoqService.getService(leadingService, boqMainService);

				let saveBtn = platformNavBarService.getActionByKey('save');
				let originalFn = saveBtn.fn;
				let originalIconCss = saveBtn.iconCSS;
				saveBtn.iconCSS = function () {
					let cssClass = originalIconCss();
					if (cssClass.indexOf('save2') < 0) {
						if (platformDataServiceModificationTrackingExtension.hasModifications(prcBoqService)) {
							cssClass =  saveBtn.group === 'navBar' ? 'tlb-wh-icons ico-save2' : 'tlb-icons ico-save2';
							saveBtn.description = $translate.instant('platform.unsavedData');
						}
					}
					return cssClass;
				};
				platformNavBarService.getActionByKey('save').fn = function () {
					if (originalFn) {
						let updateData = platformDataServiceModificationTrackingExtension.getModifications(leadingService);
						originalFn().then(function () {
							prcBoqService.update();
							let commonPrcItemService = procurementCommonPrcItemDataService.getService(leadingService);
							let selectEntity = commonPrcItemService.getSelected();
							let priceConditionService = null;
							if (selectEntity) {
								priceConditionService = procurementCommonPriceConditionService.getService();
								priceConditionService.clearCache();
								priceConditionService.loadSubItemList();
							}
							else if (!selectEntity && updateData &&
								(updateData.HeaderPparamToSave?.length || updateData.HeaderPparamToDelete?.length)
							) {
								priceConditionService = procurementCommonPriceConditionService.getService();
								priceConditionService.clearCache();
							}
						});
					}
				};

				// register my search sidebar
				let prcSearch = procurementCommonSidebarSearchOptionService.getProcurementSidebarSearchOptions();
				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(prcSearch, true);

				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer({
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'procurement.requisition/templates/sidebar-info.html'
				}, true);

				procurementCommonTabConfigService.registerTabConfig(moduleName, leadingService);

				let itemStatus = leadingService.getModuleState();
				if (itemStatus) {
					moduleContext.setModuleStatus({IsReadonly: itemStatus.IsReadonly});
				} else {
					moduleContext.setModuleStatus({IsReadonly: false});
				}

				let originDiscard = platformNavBarService.getActionByKey('discard').fn;
				platformNavBarService.getActionByKey('discard').fn = function () {
					originDiscard();
					let config = documentsProjectDocumentModuleContext.getConfig();
					let documentService = documentsProjectDocumentDataService.getService(config);
					documentService.clear();
				};

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('procurement.requisition.headerGrid.reqheaderGridTitle'),
					parentService: leadingService,
					columnConfig: [
						{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
						{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
						{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false},
						{documentField: 'BpdSubsidiaryFk', dataField: 'SubsidiaryFk', readOnly: false}

					]
				});

				function onRequisitionStatusChanged(requisitionStatus) {
					if (requisitionStatus) {
						boqMainService.setReadOnly(requisitionStatus.IsReadonly);
					}
				}

				leadingService.selectedRequisitionStatusChanged.register(onRequisitionStatusChanged);

				let boqMainLookupFilterService = $injector.get('boqMainLookupFilterService');
				boqMainLookupFilterService.setTargetBoqMainService(boqMainService);
				boqMainLookupFilterService.boqTypeUpdated.register(leadingService.updateBoqFilter);
				boqMainLookupFilterService.filterValueChanged.register(leadingService.updateBoqFilter);
				leadingService.updateBoqFilter();

				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});

				function onSelectedRowsChanged(){
					leadingService.resetBudgetEditable();
				}

				platformGridAPI.events.register('509f8b1f81ea475fbebf168935641489', 'onSelectedRowsChanged', onSelectedRowsChanged);

				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					leadingService.unRegisterFilters();

					// register the sidebar to the default.
					// the 'registerSidebarContainer' method will do unregisterSidebarContainer and then do registerSidebarContainer.
					let defaultSearch = procurementCommonSidebarSearchOptionService.getDefaultSidebarSearchOptions();
					// noinspection JSCheckFunctionSignatures
					// DEV-34862 cloudDesktopSidebarService.registerSidebarContainer should before platformMainControllerService.unregisterCompletely
					cloudDesktopSidebarService.registerSidebarContainer(defaultSearch, true);
					platformMainControllerService.unregisterCompletely(leadingService, result, translateService, opt);

					// noinspection JSCheckFunctionSignatures
					cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().info, true);
					leadingService.selectedRequisitionStatusChanged.unregister(onRequisitionStatusChanged);
					// remove context values
					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
					moduleContext.removeModuleValue(moduleContext.itemDataServiceKey);
					moduleContext.removeModuleValue(moduleContext.moduleStatusKey);
					procurementCommonTabConfigService.unregisterTabConfig();
					procurementRequisitionWizardService.deactive();

					boqMainLookupFilterService.boqTypeUpdated.unregister(leadingService.updateBoqFilter);
					boqMainLookupFilterService.filterValueChanged.unregister(leadingService.updateBoqFilter);
					boqMainLookupFilterService.setTargetBoqMainService(null);
					boqMainLookupFilterService.setSelectedWicGroupIds([]);
					boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(null);

					platformGridAPI.events.unregister('509f8b1f81ea475fbebf168935641489', 'onSelectedRowsChanged', onSelectedRowsChanged);
				});

			}
		]);
})(angular);
