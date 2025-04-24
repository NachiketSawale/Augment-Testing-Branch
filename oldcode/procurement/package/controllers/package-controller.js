(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.package';

	angular.module(moduleName).controller('procurementPackageController',
		['$scope', '$translate', 'platformMainControllerService', 'platformNavBarService', 'procurementPackageDataService', 'procurementPackageTranslationService',
			'procurementContextService', 'procurementCommonPrcItemDataService', 'cloudDesktopSidebarService', 'procurementPackagePackage2HeaderService',
			'procurementCommonHeaderTextNewDataService','procurementCommonItemTextNewDataService', 'procurementPackageWizardService',
			'prcBoqMainService', 'procurementCommonPrcBoqService', 'procurementCommonTabConfigService',
			'procurementCommonTotalDataService', 'documentsProjectDocumentDataService', 'platformModalService', 'procurementCommonPaymentScheduleDataService', 'basicsCharacteristicDataServiceFactory', 'procurementPackageItemAssignmentDataService',
			'procurementCommonGeneralsDataService', 'procurementCommonCertificateNewDataService', 'procurementPackageClerkService',
			'modelViewerStandardFilterService', 'prcItemScopeServiceBootstrap', 'procurementPackageNumberGenerationSettingsService',
			'procurementPackageWizardChangeBusinessPartnerService', 'documentsProjectDocumentModuleContext', 'procurementCommonPriceConditionService',
			'boqMainLookupFilterService', 'prcPackageMasterRestrictionDataService','documentsProjectDocumentFileUploadDataService',	'$rootScope', 'platformDataServiceModificationTrackingExtension', 'platformGridAPI',


			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $translate, platformMainControllerService, platformNavBarService, leadingService, TranslationService,
				moduleContext, procurementCommonPrcItemDataService, cloudDesktopSidebarService, procurementPackagePackage2HeaderService,
				procurementCommonHeaderTextNewDataService,procurementCommonItemTextNewDataService, procurementPackageWizardService,
				prcBoqMainService, procurementCommonPrcBoqService, procurementCommonTabConfigService,
				procurementCommonTotalDataService, documentsProjectDocumentDataService, platformModalService, procurementCommonPaymentScheduleDataService, basicsCharacteristicDataServiceFactory, procurementPackageItemAssignmentDataService,
				procurementCommonGeneralsDataService, procurementCommonCertificateNewDataService, procurementPackageClerkService,
				modelViewerStandardFilterService, prcItemScopeServiceBootstrap, procurementPackageNumberGenerationSettingsService,
				procurementPackageWizardChangeBusinessPartnerService, documentsProjectDocumentModuleContext, procurementCommonPriceConditionService,
				boqMainLookupFilterService, prcPackageMasterRestrictionDataService,fileUploadDataService,$rootScope,
				platformDataServiceModificationTrackingExtension, platformGridAPI) {
				$scope.path = globals.appBaseUrl;

				var opt = {search: true, reports: false, auditTrail: '871f9af9570647d0a1d9d5a2cd2d17ff'};
				var mc = {};

				var sidebarReports = platformMainControllerService.registerCompletely($scope, leadingService, mc, TranslationService, moduleName, opt);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('procurementPackageModelFilterService');
				procurementPackageNumberGenerationSettingsService.assertLoaded();

				// add export capability

				var exportOptions = {
					ModuleName: moduleName,
					permission: '40af135e208349168b8ac5f330a09500#e',
					MainContainer: {
						Id: 'procurement.package.headerGrid',
						Label: 'procurement.package.pacHeaderGridTitle'
					},
					SubContainers: [
						{
							Id: 'procurement.package.pacakge2header.Grid',
							Qualifier: 'subpackage',
							Label: 'procurement.package.pacakge2headerGridTitle',
							Selected: false
						}
					]
				};

				platformMainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				leadingService.registerFilters();
				moduleContext.setLeadingService(leadingService);
				moduleContext.setMainService(procurementPackagePackage2HeaderService);
				moduleContext.setItemDataService(procurementCommonPrcItemDataService.getService(procurementPackagePackage2HeaderService));
				procurementCommonHeaderTextNewDataService.getService(procurementPackagePackage2HeaderService);
				procurementCommonItemTextNewDataService.getService(moduleContext.getItemDataService());
				procurementCommonTotalDataService.getService(moduleContext.getMainService());
				basicsCharacteristicDataServiceFactory.getService(leadingService, leadingService.targetSectionId);
				procurementCommonGeneralsDataService.getService(moduleContext.getMainService());
				procurementCommonCertificateNewDataService.getService(moduleContext.getMainService());
				procurementPackageWizardService.active();
				prcItemScopeServiceBootstrap.execute();

				procurementCommonTabConfigService.registerTabConfig(moduleName, leadingService);

				var boqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
				var prcBoqService = procurementCommonPrcBoqService.getService(procurementPackagePackage2HeaderService, boqMainService);

				boqMainLookupFilterService.setMainItemService(leadingService);
				boqMainLookupFilterService.setTargetBoqMainService(boqMainService);

				let saveBtn = platformNavBarService.getActionByKey('save');
				var originalFn = saveBtn.fn;
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
							procurementPackageItemAssignmentDataService.loadSubItemsList();
							var commonPrcItemService = procurementCommonPrcItemDataService.getService(procurementPackagePackage2HeaderService);
							var selectEntity = commonPrcItemService.getSelected();
							let priceConditionService = null;
							if (selectEntity) {
								priceConditionService = procurementCommonPriceConditionService.getService();
								priceConditionService.clearCache();
								priceConditionService.loadSubItemList();
							}
							else if (!selectEntity && updateData &&
								((updateData.HeaderPparamToSave && updateData.HeaderPparamToSave.length) || (updateData.HeaderPparamToDelete && updateData.HeaderPparamToDelete.length))
							) {
								priceConditionService = procurementCommonPriceConditionService.getService();
								priceConditionService.clearCache();
							}
						});
					}
				};
				// var itemStatus = leadingService.checkIfCurrentLoginCompany();

				var itemStatus = leadingService.getModuleState();
				if (itemStatus) {
					moduleContext.setModuleStatus({IsReadonly: itemStatus.IsReadonly});
				} else {
					moduleContext.setModuleStatus({IsReadonly: false});
				}

				var originDiscard = platformNavBarService.getActionByKey('discard').fn;
				platformNavBarService.getActionByKey('discard').fn = function () {
					originDiscard();
					var config = documentsProjectDocumentModuleContext.getConfig();
					var documentService = documentsProjectDocumentDataService.getService(config);
					documentService.clear();
				};

				var sidebarInfo = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'procurement.package/templates/sidebar-info.html'
				};

				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(sidebarInfo, true);

				function onPackageStatusChanged(packageStatus) {
					if (packageStatus) {
						boqMainService.setReadOnly(packageStatus.IsReadonly);
					}
				}

				leadingService.selectedPackageStatusChanged.register(onPackageStatusChanged);

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('procurement.package.pacHeaderGridTitle'),
					parentService: leadingService,
					columnConfig: [
						{documentField: 'PrcPackageFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'PrcStructureFk', dataField: 'StructureFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'BpdSubsidiaryFk', dataField: 'SubsidiaryFk', readOnly: false}
					]

				});

				boqMainLookupFilterService.boqTypeUpdated.register(prcPackageMasterRestrictionDataService.updateBoqFilter);
				boqMainLookupFilterService.filterValueChanged.register(prcPackageMasterRestrictionDataService.updateBoqFilter);
				prcPackageMasterRestrictionDataService.updateBoqFilter();
				boqMainLookupFilterService.copySourceBoqContainerCreated.register(onCopySourceBoqContainerCreated);

				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});

				function onSelectedRowsChanged(){
					leadingService.resetBudgetEditable();
				}

				platformGridAPI.events.register('1d58a4da633a485981776456695e3241', 'onSelectedRowsChanged', onSelectedRowsChanged);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					leadingService.unregisterFilters();
					platformMainControllerService.unregisterCompletely(leadingService, sidebarReports, TranslationService, opt);

					procurementPackageWizardService.deactive();
					// noinspection JSCheckFunctionSignatures
					cloudDesktopSidebarService.unRegisterSidebarContainer(sidebarInfo.name, true);
					// remove context values
					leadingService.selectedPackageStatusChanged.unregister(onPackageStatusChanged);

					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
					moduleContext.removeModuleValue(moduleContext.itemDataServiceKey);
					moduleContext.removeModuleValue(moduleContext.moduleStatusKey);

					procurementCommonTabConfigService.unregisterTabConfig();
					boqMainLookupFilterService.boqTypeUpdated.unregister(prcPackageMasterRestrictionDataService.updateBoqFilter);
					boqMainLookupFilterService.filterValueChanged.unregister(prcPackageMasterRestrictionDataService.updateBoqFilter);
					boqMainLookupFilterService.setSelectedWicGroupIds([]);
					boqMainLookupFilterService.setSelectedProjectIds([]);
					boqMainLookupFilterService.setSelectedPackageIds([]);
					boqMainLookupFilterService.setSelectedMaterialCatalogIds([]);
					boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(null);
					boqMainLookupFilterService.setMainItemService(null);
					boqMainLookupFilterService.setTargetBoqMainService(null);
					boqMainLookupFilterService.setSelectedContractIds([]);
					boqMainLookupFilterService.copySourceBoqContainerCreated.unregister(onCopySourceBoqContainerCreated);

					platformGridAPI.events.unregister('1d58a4da633a485981776456695e3241', 'onSelectedRowsChanged', onSelectedRowsChanged);
				});

				// ////////////////////////////////

				function onCopySourceBoqContainerCreated() {
					prcPackageMasterRestrictionDataService.updateBoqFilter();
				}
			}]);
})(angular);
