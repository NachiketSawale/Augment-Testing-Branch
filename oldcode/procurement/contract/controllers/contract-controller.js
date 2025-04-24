(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.contract';

	/**
	 *
	 */
	angular.module(moduleName).controller('procurementContractController',
		[
			'$scope',
			'$translate',
			'platformMainControllerService',
			'procurementContractTranslationService',
			'platformTranslateService',
			'procurementContextService',
			'platformNavBarService',
			'procurementContractHeaderDataService',
			'procurementCommonPrcItemDataService',
			'procurementCommonTotalDataService',
			'procurementCommonPaymentScheduleDataService',
			'procurementCommonHeaderTextNewDataService',
			'procurementCommonItemTextNewDataService',
			'procurementCommonTabConfigService',
			'procurementCommonPrcBoqService',
			'prcBoqMainService',
			'cloudDesktopSidebarService',
			'documentsProjectDocumentDataService',
			'procurementContractWizardService',
			'platformModalService',
			'basicsCharacteristicDataServiceFactory',
			'modelViewerStandardFilterService',
			'prcItemScopeServiceBootstrap',
			'procurementContractNumberGenerationSettingsService',
			'documentsProjectDocumentModuleContext',
			'$injector',
			'procurementCommonSidebarSearchOptionService',
			'procurementCommonPriceConditionService',
			'procurementContractMasterRestrictionDataService',
			'procurementContractCertificateActualDataService',
			'documentsProjectDocumentFileUploadDataService',
			'$rootScope',
			'platformCreateUuid',
			'platformDataServiceModificationTrackingExtension',
			'_',
			// jshint -W072
			function ($scope, $translate, platformMainControllerService, translateService,
				platformTranslateService, moduleContext, platformNavBarService,
				leadingService, procurementCommonPrcItemDataService,
				procurementCommonTotalDataService,
				procurementCommonPaymentScheduleDataService,
				procurementCommonHeaderTextDataService,
				procurementCommonItemTextNewDataService,
				procurementCommonTabConfigService,
				procurementCommonPrcBoqService,
				prcBoqMainService,
				cloudDesktopSidebarService,
				documentsProjectDocumentDataService,
				procurementContractWizardService,
				platformModalService,
				basicsCharacteristicDataServiceFactory,
				modelViewerStandardFilterService,
				prcItemScopeServiceBootstrap,
				procurementContractNumberGenerationSettingsService,
				documentsProjectDocumentModuleContext,
				$injector,
				procurementCommonSidebarSearchOptionService,
				procurementCommonPriceConditionService,
				procurementContractMasterRestrictionDataService,
				procurementContractCertificateActualDataService,
				fileUploadDataService,
				$rootScope,
				platformCreateUuid,
				platformDataServiceModificationTrackingExtension,
				_) {

				var opt = {search: true, reports: true, wizards: true,auditTrail:'9ef37fbe6f204a41a235291b9421152f'};
				var result = platformMainControllerService.registerCompletely($scope, leadingService, {},
					translateService, moduleName, opt);

				// enable filters in contract header filter service
				leadingService.registerFilters();
				// leadingService.registerSidebarFilter(); // rei@17.6.15 already done in platformMainControllerService.registerCompletely

				// set context values
				moduleContext.setLeadingService(leadingService);
				moduleContext.setMainService(leadingService);
				var commonPrcItemDataService = procurementCommonPrcItemDataService.getService(leadingService);
				moduleContext.setItemDataService(commonPrcItemDataService);
				procurementCommonTotalDataService.getService(leadingService); // start total service when module loaded
				procurementCommonPaymentScheduleDataService.getService(leadingService); // start payment schedule service when module loaded
				procurementCommonHeaderTextDataService.getService(leadingService); // start header text service when module loaded
				procurementCommonItemTextNewDataService.getService(moduleContext.getItemDataService()); // start item text service when module loaded
				prcItemScopeServiceBootstrap.execute();
				procurementContractNumberGenerationSettingsService.assertLoaded();
				var contractValidationService = $injector.get('contractHeaderElementValidationService');

				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(leadingService,leadingService.targetSectionId);
				characteristicDataService.canCreate = function() {
					var parentItem = leadingService.getSelected();
					if (parentItem) {
						return !parentItem.ConStatus.IsReadonly;
					}
					return false;
				};
				characteristicDataService.canDelete = function() {
					if (characteristicDataService.getSelected() === null) {
						return false;
					}
					var parentItem = leadingService.getSelected();
					if (parentItem) {
						return !parentItem.ConStatus.IsReadonly;
					}
					return false;
				};

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('procurementContractModelFilterService');

				var exportOptions = {
					ModuleName: moduleName,
					// permission: '588c3f33c4914b3684e114cd9107b1c2#e',
					MainContainer: {
						Id: 'prc.con.header.grid',
						Label: 'procurement.contract.contractGridTitle'
					},
					SubContainers: [
					]
				};
				platformMainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				procurementCommonTabConfigService.registerTabConfig(moduleName, leadingService);

				var boqMainService = prcBoqMainService.getService(leadingService);
				var prcBoqService = procurementCommonPrcBoqService.getService(leadingService, boqMainService);

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
				let allowPrcItemStructureNullDialogId = platformCreateUuid();
				function newSaveFn(updateData) {
					originalFn().then(function () {
						var commonPrcItemService = procurementCommonPrcItemDataService.getService(leadingService);
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
				platformNavBarService.getActionByKey('save').fn = function () {
					if (originalFn) {
						var updateData = platformDataServiceModificationTrackingExtension.getModifications(leadingService);
						var thereIsNoStructureItems = false;
						if (updateData && updateData.PrcItemToSave && updateData.PrcItemToSave.length) {
							for (let i = 0; i < updateData.PrcItemToSave.length; i++) {
								if (updateData.PrcItemToSave[i].PrcItem !== undefined && !updateData.PrcItemToSave[i].PrcItem.PrcStructureFk && updateData.PrcItemToSave[i].PrcItem.ModifiedStructureNull) {
									thereIsNoStructureItems = true;
									break;
								}
							}
						}
						if (thereIsNoStructureItems) {
							var options = {
								headerText: $translate.instant('cloud.common.infoBoxHeader'),
								bodyText: $translate.instant('procurement.common.itemsNoStructureDoYouContinueSave'),
								showYesButton: true,
								showNoButton: true,
								iconClass: 'ico-question',
								id: allowPrcItemStructureNullDialogId,
								dontShowAgain: true
							};
							moduleContext.showDialogAndAgain(options).then(function (response) {
								if (response.yes === true) {
									newSaveFn(updateData);
								}
							});
						}
						else {
							let boqUpdatedata = platformDataServiceModificationTrackingExtension.getModifications(prcBoqService);
							if (boqUpdatedata && boqUpdatedata.PrcBoqExtended) {
								var boqExtendedItem = prcBoqService.getList();
								_.forEach(boqExtendedItem,(item)=>{
									if(item.BoqRootItem){
										setFormatValue(item.BoqRootItem);
										formatDateValueObjectToString(item.BoqRootItem);
									}
									prcBoqService.update();
								});
							}else {
								newSaveFn(updateData);
							}
						}
					}

				};
				function formatDateValueObjectToString(item) {
					if(item.BoqItems !== null){
						_.forEach(item.BoqItems,(itemObject)=>{
							setFormatValue(itemObject);
							formatDateValueObjectToString(itemObject);
						});
					}
				}

				function setFormatValue(entity) {
					let insertVal = entity.InsertedAt;
					if(typeof(insertVal)==='object'){
						entity.InsertedAt = insertVal._i;
					}
					let updateVal = entity.UpdatedAt;
					if(typeof(updateVal)==='object' && !_.isNil(updateVal)){
						entity.UpdatedAt = updateVal._i;
					}
				}

				procurementContractWizardService.active();

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
				// register my search sidebar
				var prcSearch = procurementCommonSidebarSearchOptionService.getProcurementSidebarSearchOptions();
				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(prcSearch, true);
				var sidebarInfo = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'procurement.contract/templates/sidebar-info.html'
				};
				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(sidebarInfo, true);

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title:$translate.instant('procurement.contract.contractGridTitle'),
					parentService: leadingService,
					columnConfig: [
						{documentField: 'ConHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
						{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
						{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'PrcStructureFk', readOnly: false, dataField: 'PrcHeaderEntity.StructureFk'},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false},
						{documentField: 'BpdSubsidiaryFk', dataField: 'SubsidiaryFk', readOnly: false},
						{documentField: 'BpdContactFk', dataField: 'ContactFk', readOnly: false}
					],
					subModules: [
						{
							service: procurementContractCertificateActualDataService,
							title: $translate.instant('cloud.common.actualCertificateListContainerTitle'),
							columnConfig: [
								{documentField: 'BpdCertificateFk', dataField: 'Id', readOnly: false},
								{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
								{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
								{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
								{documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk', readOnly: false}
							],
							otherFilter: [{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk'}]
						}
					]
				});

				function onContractStatusChanged(contractStatus) {
					if(contractStatus) {
						boqMainService.setReadOnly(contractStatus.IsReadonly);
					}
				}

				leadingService.selectedContractStatusChanged.register(onContractStatusChanged);

				function handleProcurementStructureChanged(args) {
					var newValue = args.newValue;
					const selectedContract = leadingService.getSelected();
					if (selectedContract && selectedContract.PrcHeaderEntity && !selectedContract.PrcHeaderEntity.StructureFk && newValue !== null && newValue !== undefined) {
						contractValidationService.validatePrcHeaderEntity$StructureFk(selectedContract, newValue);
					}
				}

				//from boq structure changed
				boqMainService.onProcurementStructureChanged.register(handleProcurementStructureChanged);
				//assign structure after creating procurement boq item
				leadingService.boqProcurementStructureChanged.register(handleProcurementStructureChanged);

				//prc item structure changed
				commonPrcItemDataService.onItemStructureChanged.register(function (args) {
					contractValidationService.validatePrcHeaderEntity$StructureFk(args.entity, args.newValue);
				});

				var boqMainLookupFilterService = $injector.get('boqMainLookupFilterService');
				function onCopySourceBoqContainerCreated() {
					leadingService.maintainBoqMainLookupFilter(leadingService.getSelected());
				}

				boqMainLookupFilterService.copySourceBoqContainerCreated.register(onCopySourceBoqContainerCreated);
				boqMainLookupFilterService.setTargetBoqMainService(boqMainService);

				boqMainLookupFilterService.boqTypeUpdated.register(procurementContractMasterRestrictionDataService.updateBoqFilter);
				boqMainLookupFilterService.filterValueChanged.register(procurementContractMasterRestrictionDataService.updateBoqFilter);
				procurementContractMasterRestrictionDataService.updateBoqFilter();

				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
					 reportValue.processed = true;
					 fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});

				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					leadingService.unRegisterFilters();

					// register the sidebar to the default.
					// the 'registerSidebarContainer' method will do unregisterSidebarContainer and then do registerSidebarContainer.
					var defaultSearch = procurementCommonSidebarSearchOptionService.getDefaultSidebarSearchOptions();
					// noinspection JSCheckFunctionSignatures
					// DEV-34862 cloudDesktopSidebarService.registerSidebarContainer should before platformMainControllerService.unregisterCompletely
					cloudDesktopSidebarService.registerSidebarContainer(defaultSearch, true);
					platformMainControllerService.unregisterCompletely(leadingService, result, translateService, opt);

					// noinspection JSCheckFunctionSignatures
					cloudDesktopSidebarService.unRegisterSidebarContainer(sidebarInfo.name, true);
					leadingService.selectedContractStatusChanged.unregister(onContractStatusChanged);
					// remove context values
					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
					moduleContext.removeModuleValue(moduleContext.itemDataServiceKey);
					moduleContext.removeModuleValue(moduleContext.moduleStatusKey);

					procurementCommonTabConfigService.unregisterTabConfig();

					procurementContractWizardService.deactive();
					boqMainLookupFilterService.copySourceBoqContainerCreated.unregister(onCopySourceBoqContainerCreated);
					boqMainLookupFilterService.setTargetBoqMainService(null);

					boqMainLookupFilterService.boqTypeUpdated.unregister(procurementContractMasterRestrictionDataService.updateBoqFilter);
					boqMainLookupFilterService.filterValueChanged.unregister(procurementContractMasterRestrictionDataService.updateBoqFilter);
					boqMainLookupFilterService.setSelectedWicGroupIds([]);
					boqMainLookupFilterService.setSelectedPackageIds([]);
					boqMainLookupFilterService.setSelectedProjectIds([]);
					boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(null);
					boqMainLookupFilterService.setMainItemService(null);
					boqMainLookupFilterService.setSelectedContractIds([]);
					boqMainLookupFilterService.setSelectedPackageIds([]);
					boqMainLookupFilterService.setSelectedMaterialCatalogIds([]);
				});

			}]);
})(angular);
