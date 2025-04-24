(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,Platform */

	var moduleName = 'procurement.pes';
	var procurementPesModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name procurementPesHeaderService
	 * @function
	 * @description
	 * procurementPesHeaderService is the data service for Pes Header.
	 */
	/* jshint -W072 */
	procurementPesModule.factory('procurementPesHeaderService',
		['$injector', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
			'cloudDesktopSidebarService', 'platformContextService', 'platformRuntimeDataService',
			'platformSchemaService', '$http', 'procurementContextService', '$translate', 'ServiceDataProcessDatesExtension', 'platformModuleNavigationService',
			'procurementPesHeaderValidationService', 'platformDataServiceSelectionExtension', 'platformDataValidationService', 'platformModuleStateService',
			'PlatformMessenger', 'basicsCommonMandatoryProcessor', 'cloudDesktopPinningContextService', 'platformModalService', '$q', 'globals', 'platformDataServiceModificationTrackingExtension', 'procurementCommonCharacteristicDataService',
			'procurementPesNumberGenerationSettingsService', 'procurementCommonCodeHelperService', 'prcCommonGetVatPercent','basicsBillingSchemaChangeNotifyService','platformGridAPI','basicsCommonCharacteristicService','moment',
			'platformModuleEntityCreationConfigurationService','platformDataServiceActionExtension','platformDataServiceConfiguredCreateExtension','prcCommonProcessChangeVatGroupDialog',
			'procurementCommonOverrideHeaderInfoService',
			function ($injector, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService,
				cloudDesktopSidebarService, platformContextService, platformRuntimeDataService,
				platformSchemaService, $http, moduleContext, $translate, ServiceDataProcessDatesExtension, naviService,
				procurementPesHeaderValidationService, platformDataServiceSelectionExtension, platformDataValidationService, platformModuleStateService,
				PlatformMessenger, basicsCommonMandatoryProcessor, cloudDesktopPinningContextService, platformModalService, $q, globals, platformDataServiceModificationTrackingExtension, procurementCommonCharacteristicDataService,
				procurementPesNumberGenerationSettingsService, codeHelperService, prcCommonGetVatPercent,basicsBillingSchemaChangeNotifyService,platformGridAPI,basicsCommonCharacteristicService,moment,
				platformModuleEntityCreationConfigurationService,platformDataServiceActionExtension,platformDataServiceConfiguredCreateExtension, prcCommonProcessChangeVatGroupDialog,
				procurementCommonOverrideHeaderInfoService) {


				var characteristicColumn = '';
				var gridContainerGuid = 'ebe726dbf2c5448f90b417bf2a30b4eb';
				// eslint-disable-next-line no-unused-vars
				var baseNchangeOrderPrcHeaderIds = [];

				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: null,
					showOptions: true,
					showProjectContext: false, // TODO: rei remove it
					pinningOptions: {
						isActive: true, showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
					},
					withExecutionHints: false,
					enhancedSearchVersion: '2.0',
					includeDateSearch:true
				};

				var procurementPesHeaderServiceOption = {
					flatRootItem: {
						module: procurementPesModule,
						serviceName: 'procurementPesHeaderService',
						entityNameTranslationID: 'procurement.pes.headerContainerTitle',
						entityInformation: {module: 'Procurement.Pes', entity: 'PesHeader', specialTreatmentService: $injector.get('pesCreationInitialDialogService')},
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/pes/header/',
							endCreate: 'createpes'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'procurement/pes/header/',
							endDelete: 'deletepes'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'procurement/pes/header/',
							endUpdate: 'updatepes'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/pes/header/',
							endRead: 'listpes',
							usePostForRead: true
						},
						entityRole: {
							root: {
								itemName: 'Header',
								moduleName: 'cloud.desktop.moduleDisplayNamePerformanceEntrySheet',
								codeField: 'Code',
								descField: 'Description',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								handleUpdateDone: handleUpdateDone,
								showProjectHeader: {
									getProject: function (entity) {
										if (!entity || !entity.ProjectFk) {
											return null;
										}
										return basicsLookupdataLookupDescriptorService.getLookupItem('Project', entity.ProjectFk);
									}
								}
							}
						},
						translation: {
							uid: 'procurementPesHeaderService',
							title: 'cloud.desktop.moduleDisplayNamePerformanceEntrySheet',
							dtoScheme: {
								typeName: 'PesHeaderDto',
								moduleSubModule: 'Procurement.Pes'
							}
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead,
								initCreationData: initCreationData,
								handleCreateSucceeded: function (item) {
									// pes characteristic1 SectionId = 20;
									// pes characteristic2 SectionId = 49;
									// configuration characteristic1 SectionId = 32;
									// configuration characteristic2 SectionId = 55;
									// structure characteristic1 SectionId = 9;
									// structure characteristic2 SectionId = 54;
									basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, item, 20, 49,32, 55, 9, 54);
									var exist = platformGridAPI.grids.exist(gridContainerGuid);
									if (exist) {
										var containerInfoService = $injector.get('procurementPesContainerInformationService');
										var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(serviceContainer.service, 49, gridContainerGuid.toUpperCase(),containerInfoService);
										characterColumnService.appendDefaultCharacteristicCols(item);
									}
								},
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
						dataProcessor: [{processItem: processItem}, new ServiceDataProcessDatesExtension(['DocumentDate', 'DateDeliveredFrom', 'DateDelivered', 'DateEffective'])],
						entitySelection: {},
						filterByViewer: true,
						actions: {
							delete: {}, create: 'flat',
							canDeleteCallBackFunc: function (item) {
								if (item && !_.isEmpty(item)) {
									if (item.Version === 0) {
										return true;
									}
									else {
										const pesStatus = getModuleStatusOfItem(item);
										return !(pesStatus && pesStatus.IsReadOnly);
									}
								}
								return true;
							}
						}
					}
				};
				var naviHeaderFk = 0;
				var serviceContainer = platformDataServiceFactory.createNewComplete(procurementPesHeaderServiceOption);

				var IsPortalUser = false;
				codeHelperService.IsPortalUser().then(function (val) {
					IsPortalUser = val;
				});
				// do not override onDeleteDone if have some special logic , use service.registerEntityDeleted(onEntityDeleted);
				// do by stone.
				// serviceContainer.data.onDeleteDone = onDeleteDoneInList;

				// noinspection JSUnresolvedVariable
				angular.extend(serviceContainer.service,
					{
						executeSearchFilterBase: serviceContainer.service.executeSearchFilter,
						executeSearchFilter: executeSearchFilter,
						reload: reload,
						cellChange:cellChange,
						validateItemIsReadOnly: validateItemIsReadOnly,
						setReadOnlyRow: setReadOnlyRow,
						registerLookupFilter: registerLookupFilter,
						unRegisterLookupFilter: unRegisterLookupFilter,
						clearUpValidationIssues: clearUpValidationIssues,
						statusChangeMessenger: new Platform.Messenger(),
						selectedPesStatusChanged: new Platform.Messenger(),
						registerValidationIssuesClearUp: registerValidationIssuesClearUp,
						unregisterValidationIssuesClearUp: unregisterValidationIssuesClearUp,
						registerValidationIssuesRemove: registerValidationIssuesRemove,
						unregisterValidationIssuesRemove: unregisterValidationIssuesRemove,
						registerExchangeRateChanged: registerExchangeRateChanged,
						unregisterExchangeRateChanged: unregisterExchangeRateChanged,
						fireExchangeRateChanged: fireExchangeRateChanged,
						registerIsFreeItemsAllowedChanged: registerIsFreeItemsAllowedChanged,
						unregisterIsFreeItemsAllowedChanged: unregisterIsFreeItemsAllowedChanged,
						doPrepareUpdateCall : doPrepareUpdateCall,
						onRecalculationItemsAndBoQ: new PlatformMessenger(),
						onUpdateNavigationItemNeeded: new PlatformMessenger(),
						onPrepareUpdate: new PlatformMessenger()
						// setBaseNChangeOrderPrcHeaderIdsByConHeaderId: setBaseNChangeOrderPrcHeaderIdsByConHeaderId//,
						// getBaseNChangeOrderPrcHeaderIds: getBaseNChangeOrderPrcHeaderIds
					}
				);

				var validation = procurementPesHeaderValidationService(serviceContainer.service);

				function doPrepareUpdateCall(updateData) {
					serviceContainer.service.onPrepareUpdate.fire(updateData);

					// the cost group to save
					if (updateData.PesBoqToSave && updateData.PesBoqToSave.length > 0) {
						_.each(updateData.PesBoqToSave, function (pesBoq) {
							if(pesBoq.BoqItemToSave && pesBoq.BoqItemToSave.length > 0) {
								var qtoDetailsToSave = _.map(pesBoq.BoqItemToSave, 'QtoDetailToSave');
								_.each(qtoDetailsToSave, function (qtoDetailToSave) {
									_.each(qtoDetailToSave, function (item) {
										if (item.QtoDetail) {
											if (item.QtoDetail.CostGroupsToCopy && item.QtoDetail.IsCopy) {
												item.CostGroupToSave = item.QtoDetail.CostGroupsToCopy;
											}
										}
									});
								});
							}
						});
					}
				}

				// (e=>null, deletedItems=>all deleted items)
				// replace the logic of onDeleteDone, done by stone.
				var onEntityDeleted = function onEntityDeleted(e, deletedItems) {
					var deleteEntities = [];
					if (deletedItems) {
						if (deletedItems instanceof Array) {
							deleteEntities = deletedItems;
						} else {
							deleteEntities = [deletedItems];
						}
						angular.forEach(deleteEntities, function (entity) {
							doClearValidationIssues(entity);
						});
					}
				};
				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				basicsCommonCharacteristicService.unregisterCreateAll(serviceContainer.service, 20, 49);

				var validationIssuesClearUp = new PlatformMessenger();
				var validationIssuesRemove = new PlatformMessenger();


				let changeVatGroupRecalBoqAndItemDialogId = $injector.get('platformCreateUuid')();
				function cellChange (entity,field){
					if (field === 'BpdVatGroupFk') {
						prcCommonProcessChangeVatGroupDialog.showAskDialog(moduleName, serviceContainer.service, serviceContainer.data, entity, changeVatGroupRecalBoqAndItemDialogId, function recalculateAfterChangeVatGroupInPes() {
							var taxCodeFk = (_.has(entity, 'TaxCodeFk') && entity.TaxCodeFk !== undefined && entity.TaxCodeFk !== null) ? entity.TaxCodeFk : 0;
							$http.get(globals.webApiBaseUrl + 'procurement/common/boq/RecalculationBoQ?headerId=' + entity.Id + '&vatGroupFk=' + entity.BpdVatGroupFk+'&sourceType=pes'+'&taxCodeFk='+taxCodeFk).then(function(){
								serviceContainer.service.refreshSelectedEntities().then(function () {
									serviceContainer.service.onRecalculationItemsAndBoQ.fire();
								});
							});
						});
					}
				}

				function doClearValidationIssues(entity) {
					if (platformDataValidationService.hasErrors(serviceContainer.service)) {
						var modState = platformModuleStateService.state(serviceContainer.service.getModule());
						modState.validation.issues = _.filter(modState.validation.issues, function (err) {
							return err.entity.Id !== entity.Id;
						});
					}
					validationIssuesRemove.fire(null, entity.Id);
				}

				function clearUpValidationIssues() {
					if (platformDataValidationService.hasErrors(serviceContainer.service)) {
						var modState = platformModuleStateService.state(serviceContainer.service.getModule());
						modState.validation.issues = [];
					}
					validationIssuesClearUp.fire();
				}


				serviceContainer.service.validationIssuesClearUp = validationIssuesClearUp;

				function registerValidationIssuesClearUp(handler) {
					if (angular.isFunction(handler)) {
						validationIssuesClearUp.register(handler);
					}
				}

				function unregisterValidationIssuesClearUp(handler) {
					if (angular.isFunction(handler)) {
						validationIssuesClearUp.unregister(handler);
					}
				}


				serviceContainer.service.validationIssuesRemove = validationIssuesRemove;

				function registerValidationIssuesRemove(handler) {
					if (angular.isFunction(handler)) {
						validationIssuesRemove.register(handler);
					}
				}

				function unregisterValidationIssuesRemove(handler) {
					if (angular.isFunction(handler)) {
						validationIssuesRemove.unregister(handler);
					}
				}

				var exchangeRateChanged = new PlatformMessenger();

				function registerExchangeRateChanged(handler) {
					if (angular.isFunction(handler)) {
						exchangeRateChanged.register(handler);
					}
				}

				function unregisterExchangeRateChanged(handler) {
					if (angular.isFunction(handler)) {
						exchangeRateChanged.unregister(handler);
					}
				}

				function fireExchangeRateChanged(events, args) {
					exchangeRateChanged.fire(events, args);
				}

				var isFreeItemsAllowedChanged = new PlatformMessenger();

				function registerIsFreeItemsAllowedChanged(handler) {
					if (angular.isFunction(handler)) {
						isFreeItemsAllowedChanged.register(handler);
					}
				}

				function unregisterIsFreeItemsAllowedChanged(handler) {
					if (angular.isFunction(handler)) {
						isFreeItemsAllowedChanged.unregister(handler);
					}
				}

				function handleUpdateDone(updateData, response, data) {
					if (response.PrcStockTranType2RubCat && response.PrcStockTranType2RubCat.length) {
						basicsLookupdataLookupDescriptorService.removeData('PrcStockTranType2RubCat');
						basicsLookupdataLookupDescriptorService.attachData({PrcStockTranType2RubCat: response.PrcStockTranType2RubCat});
					}

					// set the cost group
					if (response.PesBoqToSave && response.PesBoqToSave.length > 0) {
						_.each(response.PesBoqToSave, function (pesBoq) {
							if (pesBoq.BoqItemToSave && pesBoq.BoqItemToSave.length > 0) {
								var qtoDetailsToSave = _.map(pesBoq.BoqItemToSave, 'QtoDetailToSave');
								var isQtoDetailChange = false;
								_.each(qtoDetailsToSave, function (qtoDetailToSave) {
									_.each(qtoDetailToSave, function (item) {
										if (item.QtoDetail) {
											isQtoDetailChange = true;
											if (item.CostGroupToSave && item.CostGroupToSave.length > 0) {
												$injector.get('basicsCostGroupAssignmentService').attachCostGroupValueToEntity([item.QtoDetail], item.CostGroupToSave, function identityGetter(entity) {
													return {
														Id: entity.MainItemId
													};
												},
												'QtoDetail2CostGroups'
												);
											}
										}
									});
								});

								// set the boq split quantity
								let boqService = $injector.get('prcBoqMainService').getService(moduleContext.getMainService());
								if (isQtoDetailChange) {
									_.each(pesBoq.BoqItemToSave, function (boqItemToSave) {
										if (boqItemToSave.BoqSplitQuantityToSave && boqItemToSave.BoqSplitQuantityToSave.length > 0) {
											var items = _.map(boqItemToSave.BoqSplitQuantityToSave, 'BoqSplitQuantity');
											$injector.get('boqMainSplitQuantityServiceFactory').getService(boqService, 'procurement.pes').synBoqSplitQuantity(items);
										}
									});
								}

								// recalculate boqItem
								_.each(pesBoq.BoqItemToSave, function (boqItemToSave) {
									if (boqItemToSave.BoqItem) {
										boqService.initInstalledValues(boqItemToSave.BoqItem);
									}
								});
							}
						});
					}

					/** @namespace response.StocktransactionSaveError */
					if (response.StocktransactionSaveError) {
						platformModalService.showMsgBox($translate.instant('procurement.common.stocktransactionSaveErrorMessage'), $translate.instant('procurement.pes.tabPes'), 'ico-error');
					} else {
						if (response && Array.isArray(response.ModelValidateError)) {
							response.ModelValidateError.forEach(function (item) {
								var result = null;
								switch (item) {
									case 'Description':
										result = {
											apply: true,
											valid: false,
											error:  $translate.instant('procurement.pes.uniqueErrorDescritionMessage', {description: updateData.Header.Description})
										};

										break;
									case 'Code':
										result = {
											apply: true,
											valid: false,
											error: $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'Code'})
										};
										break;
								}
								if (result !== null) {
									var list = serviceContainer.service.getList();
									if (list && updateData.Header) {
										var header = _.find(list, {Id: updateData.Header.Id});
										if (header) {
											platformRuntimeDataService.applyValidationResult(result, header, item);
											platformDataValidationService.finishValidation(angular.copy(result), header, header[item], item,  validation, serviceContainer.service);
										}
									}
								}
							});
						}
						/** @namespace response.NotEqualWarn */
						if (response && response.NotEqualWarn) {
							platformModalService.showMsgBox($translate.instant('procurement.common.notEqualWarnMessage'), $translate.instant('procurement.pes.tabPes'), 'warning');
						}
						data.handleOnUpdateSucceeded(updateData, response, data, true);
					}


					serviceContainer.service.onUpdateSucceeded.fire({updateData: updateData, response: response});
					serviceContainer.service.showModuleHeaderInformation();
				}
				// eslint-disable-next-line no-unused-vars
				var searchFilter = null;

				function incorporateDataRead(readItems, data) {
					// eslint-disable-next-line no-prototype-builtins
					if (readItems.hasOwnProperty('dtos')) {
						for (var i = 0; i < readItems.dtos.length; ++i) {
							serviceContainer.service.setReadOnlyRow(readItems.dtos[i]);
						}
					}
					// eslint-disable-next-line no-prototype-builtins
					if (readItems.hasOwnProperty('ConHeaderView')) {
						_.forEach(readItems.ConHeaderView,function(item){
							item.DateOrdered=moment.utc(item.DateOrdered);
						});
					}
					basicsLookupdataLookupDescriptorService.attachData(readItems || {});
					var dataRead = data.handleReadSucceeded(readItems, data, true);
					// var headerSelectedItem = null;
					if (naviHeaderFk > 0) {
						var select = _.find(serviceContainer.service.getList(), function (k) {
							return naviHeaderFk === k.Id;
						});
						// headerSelectedItem = select;
						serviceContainer.service.setSelected(select);
					}
					else {
						if (readItems.dtos && readItems.dtos.length === 0) {
							serviceContainer.data.selectionChanged.fire();
						}
						else {
							serviceContainer.service.goToFirst(data);
						}

						// headerSelectedItem = serviceContainer.service.getSelected();
					}
					// handel characterist
					var exist = platformGridAPI.grids.exist(gridContainerGuid);
					if (exist) {
						var containerInfoService = $injector.get('procurementPesContainerInformationService');
						var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(serviceContainer.service, 49, gridContainerGuid.toUpperCase(),containerInfoService);
						characterColumnService.appendCharacteristicCols(readItems.dtos);
					}

					return dataRead;
				}

				function initCreationData(creationData, data, creationOptions) {
					if (creationOptions && !creationOptions.CreateFromContract) {
						const lastHeader = serviceContainer.service.getSelected();
						creationData.LastHeaderId = lastHeader ? lastHeader.Id : -1;
					}
					if (creationOptions) {
						angular.extend(creationData, creationOptions);
					}
				}

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'PesHeaderDto',
					moduleSubModule: 'Procurement.Pes',
					validationService: validation,
					mustValidateFields: ['BusinessPartnerFk']
				});


				function processItem(newItem) {
					onSetReadonly(null, newItem);
					addAdditionalProperties(newItem);
				}

				// TODO: it is just a work around to clear modifications when do call search
				function executeSearchFilter(e, filter) {
					searchFilter = filter;
					serviceContainer.data.doClearModifications(null, serviceContainer.data);
					serviceContainer.data.refreshRequested.fire();
					serviceContainer.service.executeSearchFilterBase(e, filter);
				}

				function reload() {
					var filter = {
						ExecutionHints: cloudDesktopSidebarService.filterRequest.withExecutionHints,
						IncludeNonActiveItems: cloudDesktopSidebarService.filterRequest.includeNonActiveItems,
						PageNumber: cloudDesktopSidebarService.filterRequest.pageNumber,
						PageSize: cloudDesktopSidebarService.filterRequest.pageSize,
						Pattern: cloudDesktopSidebarService.filterRequest.pattern,
						ProjectContextId: cloudDesktopSidebarService.filterRequest.projectContextId,
						UseCurrentClient: cloudDesktopSidebarService.filterRequest.useCurrentClient,
						filter: cloudDesktopSidebarService.filterRequest.filter,
						showProjectContext: true  // TODO: check how used >>> pinning context
					};

					serviceContainer.service.executeSearchFilter(null, filter);
				}

				function getModuleStatusOfItem(item) {
					var pesStatuses = basicsLookupdataLookupDescriptorService.getData('PesStatus');

					return (pesStatuses &&
						item &&
						item.PesStatusFk &&
						pesStatuses[item.PesStatusFk]);
				}

				function validateItemIsReadOnly(item) {
					if (item && item.PesHeaderFk) {
						return true;
					}

					var pesStatus = getModuleStatusOfItem(item);
					return (pesStatus && (pesStatus.IsReadOnly || pesStatus.IsInvoiced));
				}

				var fields = null;

				/* jshint -W074 */
				function setReadOnlyRow(item) {
					if (!item) {
						return;
					}
					if (fields === null) {
						fields = [];
						var headerAttributeDomains = platformSchemaService.getSchemaFromCache({
							typeName: 'PesHeaderDto',
							moduleSubModule: 'Procurement.Pes'
						}).properties;
						for (var prop in headerAttributeDomains) {
							// eslint-disable-next-line no-prototype-builtins
							if (headerAttributeDomains.hasOwnProperty(prop)) {
								fields.push({field: prop, readonly: true});
							}
						}
						fields.push({field: 'Remark', readonly: true});
					}

					if (serviceContainer.service.validateItemIsReadOnly(item)) {
						platformRuntimeDataService.readonly(item, fields);
					}
					else {
						if (item.__rt$data && item.__rt$data.readonly) {
							item.__rt$data.readonly = [];
						}
					}

					if (item.BusinessPartnerFk === null || item.BusinessPartnerFk === -1) {
						platformRuntimeDataService.readonly(item, [{field: 'SubsidiaryFk', readonly: true}]);
					}

					if (item.ConHeaderFk !== null) {
						platformRuntimeDataService.readonly(item, [{field: 'CurrencyFk', readonly: true}]);
						platformRuntimeDataService.readonly(item, [{field: 'SalesTaxMethodFk', readonly: true}]);
					}

					if (item.CurrencyFk === moduleContext.companyCurrencyId) {
						platformRuntimeDataService.readonly(item, [{field: 'ExchangeRate', readonly: true}]);
					}

					if(item.Version>0){
						platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
					}

					if (IsPortalUser) {
						platformRuntimeDataService.readonly(item, [{field: 'ControllingUnitFk', readonly: true}]);

						platformRuntimeDataService.readonly(item, [{field: 'SubsidiaryFk', readonly: true}]);
						platformRuntimeDataService.readonly(item, [{field: 'SupplierFk', readonly: true}]);
					}

					platformRuntimeDataService.readonly(item, [{
						field: 'PrcConfigurationFk',
						readonly: !!item.Version
					}]);
				}

				// noinspection JSUnusedLocalSymbols
				function onSetReadonly(e, item, notifyPesStatusChange) {
					var moduleStatus = getModuleStatusOfItem(item);
					setReadOnlyRow(item);
					if (_.isBoolean(notifyPesStatusChange) && notifyPesStatusChange) {
						serviceContainer.service.selectedPesStatusChanged.fire(moduleStatus);
					}
				}


				serviceContainer.service.registerSelectionChanged(onSelectionChanged);
				serviceContainer.service.statusChangeMessenger.register(statusChangeHandler);

				function statusChangeHandler() {
					var header = serviceContainer.service.getSelected();
					serviceContainer.service.setReadOnlyRow(header);
					serviceContainer.service.gridRefresh();
				}

				var lookupFilters = [
					{
						key: 'project-main-project-for-pes-filter',
						serverSide: true,
						serverKey: 'project-main-project-for-pes-filter',
						fn: function (currentItem) {
							if (currentItem && currentItem.ControllingUnitFk) {
								var controllingUnits = basicsLookupdataLookupDescriptorService.getData('controllingunit');
								if (controllingUnits) {
									var controllingUnit = controllingUnits[currentItem.ControllingUnitFk];
									if (controllingUnit) {
										return {
											Id: controllingUnit.PrjProjectFk
										};
									}
								}
							}
							return {};
						}
					},
					{
						key: 'businesspartner-main-businesspartner-for-pes-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-businesspartner-for-pes-filter',
						fn: function (currentItem) {
							var ids = [];
							if (currentItem && currentItem.ConHeaderFk) {
								var conHeaderView = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: currentItem.ConHeaderFk});
								var businessPartnerFk = conHeaderView.BusinessPartnerFk;
								var businessPartner2Fk = conHeaderView.BusinessPartner2Fk;

								if (businessPartnerFk) {
									ids.push(businessPartnerFk);
								}

								if (businessPartner2Fk) {
									ids.push(businessPartner2Fk);
								}
							}
							return {
								Ids: ids
							};
						}
					},
					{
						key: 'businesspartner-main-subsidiary-for-pes-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function () {
							var currentItem = serviceContainer.service.getSelected();
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SupplierFk: currentItem !== null ? currentItem.SupplierFk : null
							};
						}
					},
					{
						key: 'businesspartner-main-supplier-for-pes-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-supplier-common-filter',
						/* jshint undef:false, unused:false */
						fn: function () {
							var currentItem = serviceContainer.service.getSelected();
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
							};
						}
					},
					{
						key: 'prc-con-header-for-pes-filter',
						serverKey: 'prc-con-header-for-pes-filter',
						serverSide: true,
						fn: function () {
							/* var filter = 'StatusIsInvoiced = false and StatusIsCanceled = false and StatusIsVirtual = false and StatusIsOrdered = true and StatusIsDelivered = false';
							 var currentItem = serviceContainer.service.getSelected();
							 if (!currentItem) {
							 return '';
							 }
							 if (currentItem.BusinessPartnerFk !== null && currentItem.BusinessPartnerFk !== -1 && currentItem.BusinessPartnerFk !== 0) {
							 filter += ' And BusinessPartnerFk=' + currentItem.BusinessPartnerFk;
							 filter += ' OR BusinessPartner2Fk = ' + currentItem.BusinessPartnerFk;
							 }

							 if (currentItem.PackageFk) {
							 filter += ' AND PrcPackageFk = ' + currentItem.PackageFk;
							 }

							 if (currentItem.PrcStructureFk) {
							 filter += ' AND PrcStructureFk = ' + currentItem.PrcStructureFk;
							 }

							 var filterObj = {
							 customerFilter: filter,
							 controllingUnit: currentItem.ControllingUnitFk
							 };

							 if (currentItem.ProjectFk) {
							 filterObj.ProjectFk = currentItem.ProjectFk;
							 }
							 return filterObj; */
							var currentItem = serviceContainer.service.getSelected();
							if (!currentItem) {
								return {};
							}
							var filterObj = {
								StatusIsInvoiced: false,
								StatusIsCanceled: false,
								StatusIsVirtual: false,
								StatusIsOrdered: true,
								// StatusIsDelivered: false,
								ControllingUnit: currentItem.ControllingUnitFk,
								PrcConfigurationId: currentItem.PrcConfigurationFk,
								IsFramework: false
							};
							if (currentItem.BusinessPartnerFk !== null && currentItem.BusinessPartnerFk !== -1 && currentItem.BusinessPartnerFk !== 0) {
								filterObj.BusinessPartnerFk = currentItem.BusinessPartnerFk;
							}
							if (currentItem.PackageFk) {
								filterObj.PrcPackageFk = currentItem.PackageFk;
							}
							if (currentItem.PrcStructureFk) {
								filterObj.PrcStructureFk = currentItem.PrcStructureFk;
							}
							if (currentItem.ProjectFk) {
								filterObj.ProjectFk = currentItem.ProjectFk;
							}
							return filterObj;
						}
					},
					{
						key: 'prc-boq-package-for-pes-filter',
						serverKey: 'prc-boq-package-for-pes-filter',
						serverSide: true,
						fn: function () {
							var currentItem = serviceContainer.service.getSelected();
							if (currentItem) {
								var projectId = currentItem.ProjectFk || platformContextService.getApplicationValue(cloudDesktopSidebarService.appContextProjectContextKey);
								if (projectId === null) {
									return {};
								}
								else {
									return {ProjectFk: projectId};
								}
							}
							return {};
						}
					},
					{
						key: 'prc-pes-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk=' + moduleContext.pesRubricFk;
						}
					},
					{
						key: 'controlling-unit-for-pes-filter',
						serverSide: true,
						serverKey: 'basics.masterdata.controllingunit.filterkey',
						fn: function () {
							var currentItem = serviceContainer.service.getSelected();
							if (currentItem) {
								return {ProjectFk: currentItem.ProjectFk, ExtraFilter: true};
							}
						}
					},
					{
						key: 'prc-pes-billing-schema-filter',
						serverSide: true,
						fn: function (currentItem) {
							if (!currentItem || !currentItem.Id) {
								return '';
							}
							var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.PrcConfigurationFk});

							return 'PrcConfigHeaderFk=' + (config ? config.PrcConfigHeaderFk : -1);
						}
					},
					{
						key: 'est-controlling-unit-filter',// for boq structure controllingUintFk
						serverSide: true,
						serverKey: 'basics.masterdata.controllingunit.filterkey',
						fn: function () {
							var currentItem = serviceContainer.service.getSelected();
							if (currentItem) {
								return {
									ProjectFk: currentItem.ProjectFk
								};
							}
						}
					},
					{
						key: 'prc-con-controlling-by-prj-filter',
						serverKey: 'prc.con.controllingunit.by.prj.filterkey',
						serverSide: true,
						fn: function (entity) {
							return {
								ByStructure: true,
								ExtraFilter: true,
								PrjProjectFk: (entity === undefined || entity === null) ? null : entity.ProjectFk,
								CompanyFk: platformContextService.getContext().clientId
							};
						}
					},
					{
						key: 'bas-currency-conversion-filter',
						serverSide: true,
						serverKey: 'bas-currency-conversion-filter',
						fn: function (currentItem) {
							return {companyFk: currentItem.CompanyFk};
						}
					}
				];

				function registerLookupFilter() {
					basicsLookupdataLookupFilterService.registerFilter(lookupFilters);
				}

				function unRegisterLookupFilter() {
					basicsLookupdataLookupFilterService.unregisterFilter(lookupFilters);
				}


				basicsLookupdataLookupDescriptorService.loadData(['PesStatus', 'Currency', 'PrcConfigHeader', 'PrcConfiguration']);

				function doNavigate(item, triggerField) {
					// this is for pakcage's 'go to feature' in  "First Delivery" and "Last Delivery"
					/** @namespace item.Pes2PackageData */
					if (item && angular.isDefined(item.Pes2PackageData) && item.Pes2PackageData && angular.isDefined(item.Pes2PackageData.PrcPackageFk)) {
						$http.post(serviceContainer.data.httpReadRoute + 'navigation', item.Pes2PackageData).then(function (response) {
							cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
						});
					} else if (item && item.PesHeaderFk) {
						cloudDesktopSidebarService.filterSearchFromPKeys([item.PesHeaderFk]);
					}
					else if (item && triggerField === 'Id') {
						var keys = [];
						if (angular.isObject(item)) {
							keys.push(item[triggerField]);
						}
						if (angular.isString(item)) {
							keys.push(parseInt(item));
						}
						cloudDesktopSidebarService.filterSearchFromPKeys(keys);
					}
					else if (triggerField === 'ContractNavBtn') {
						// from contract navigate button, item is contract entity.
						$http.post(serviceContainer.data.httpReadRoute + 'navigation',
							{From: 'ContractNavBtn', ConId: item.Id}).then(function (response) {
							cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
						});
					}
					else if (triggerField === 'InvNavBtn') {
						if (item.PesHeaderFk && item.PesHeaderFk > 0) {
							cloudDesktopSidebarService.filterSearchFromPKeys(item.PesHeaderFk);
						}
					}
					else if (triggerField==='Ids' && item.FromGoToBtn) {
						var ids = item.Ids.split(',');
						cloudDesktopSidebarService.filterSearchFromPKeys(ids);
					}
					else if (triggerField==='Code') {
						var keys1 = [];
						if (angular.isObject(item)) {
							keys1.push(item.Id);
						}
						cloudDesktopSidebarService.filterSearchFromPKeys(keys1);
					}
					else {// this is default return
						naviHeaderFk = item.PesHeaderFk;
						serviceContainer.service.load();
					}
				}


				serviceContainer.service.doNavigate = doNavigate;

				// The system must check, if PES_ITEM.PRC_STRUCTURE_FK is always the same, then use this PRC_STRUCTURE_FK.
				// If multiple PRC_STRUCTURE_FK are found, set NULL
				serviceContainer.service.updateHeaderPrcStructure = function updateHeaderPrcStructure() {
					var childServices = serviceContainer.service.getChildServices();
					if (childServices && childServices.length > 0) {
						var pesItemService = _.find(childServices, {name: 'procurement.pes.item'}),
							currentItem = serviceContainer.service.getSelected(),
							items = pesItemService.getList(),
							isCurrentItemChanged = false;
						if (items !== null && items.length > 0) {
							var item = items[0];
							var result = _.countBy(items, function (im) {
								return item.PrcStructureFk !== im.PrcStructureFk && item.Id !== im.Id;
							});
							if (result.true) {
								if (currentItem.PrcStructureFk !== null) {
									currentItem.PrcStructureFk = null;
									isCurrentItemChanged = true;
								}
							} else {
								if (currentItem.PrcStructureFk !== item.PrcStructureFk) {
									currentItem.PrcStructureFk = item.PrcStructureFk;
									isCurrentItemChanged = true;
								}
							}
						} else {
							if (currentItem.PrcStructureFk !== null) {
								currentItem.PrcStructureFk = null;
								isCurrentItemChanged = true;
							}
						}
						if (isCurrentItemChanged) {
							serviceContainer.service.markCurrentItemAsModified();
							serviceContainer.service.gridRefresh();
						}
					}
				};

				serviceContainer.service.updateHeaderConHeader = function updateHeaderConHeader(conHeaderId) {
					var currentItem = serviceContainer.service.getSelected();
					if (currentItem.ConHeaderFk === null && conHeaderId !== null && conHeaderId !== undefined) {
						currentItem.ConHeaderFk = conHeaderId;
						validation.validateConHeader(currentItem, conHeaderId);
						serviceContainer.service.markCurrentItemAsModified();
					}
				};

				// when the PES_BOQ contract change
				serviceContainer.service.changeBoqConHeader = function changeHeaderConHeader(conHeaderId) {
					var currentItem = serviceContainer.service.getSelected();
					if (currentItem.ConHeaderFk !== conHeaderId && conHeaderId !== null && conHeaderId !== undefined) {
						currentItem.ConHeaderFk = conHeaderId;
						validation.validateConHeaderFk(currentItem, conHeaderId);
						serviceContainer.service.markCurrentItemAsModified();
					}
				};
				// when the PES_ITEM contract change
				serviceContainer.service.changeItemConHeader = function changeItemConHeader(conHeaderId, itemEntity) {
					let currentItem = serviceContainer.service.getSelected();
					if (!currentItem) {
						return;
					}
					if (conHeaderId) {
						let conHeaders = basicsLookupdataLookupDescriptorService.getData('conheaderview');
						let conHeader = (conHeaders && conHeaders[conHeaderId]) || null;
						let currentConHeader = (conHeaders && conHeaders[currentItem.ConHeaderFk]) || null;
						let needToUpdateHeader = !(currentItem.ConHeaderFk === conHeaderId || (conHeader && currentItem.ConHeaderFk === conHeader.ConHeaderFk) ||
							(currentConHeader && currentConHeader.ConHeaderFk === conHeaderId));
						if (needToUpdateHeader) {
							currentItem.ConHeaderFk = conHeaderId;
							serviceContainer.service.removeChildItems(itemEntity);
							validation.validateConHeader(currentItem, conHeaderId);
							serviceContainer.service.markCurrentItemAsModified();
						}
					}
				};

				// characteristic item readonly
				serviceContainer.service.setDataReadOnly=function(items){
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, true);
					});
				};

				// If the con header changed and there are no items under this pes header
				// Set the prc structure fk of pes header as the corresponding prc structure of the prc header.
				serviceContainer.service.conHeaderChanged = function conHeaderChanged(entity, value) {
					var defer = $q.defer();
					var childServices = serviceContainer.service.getChildServices();
					var pesItemService;
					if (childServices && childServices.length > 0) {
						pesItemService = _.find(childServices, {name: 'procurement.pes.item'});
					}
					if (pesItemService) {
						var items = pesItemService.getList();
						if (items && items.length === 0 && value) {
							// noinspection JSCheckFunctionSignatures
							$http.post(globals.webApiBaseUrl + 'procurement/pes/header/getstructureId?conHeaderId=' + parseInt(value)).then(function (response) {
								// noinspection JSValidateTypes
								if (response.data !== -1) {
									entity.PrcStructureFk = response.data;
									serviceContainer.service.gridRefresh();
									defer.resolve(true);
								}
								else {
									defer.resolve(true);
								}
							});
						}
						else {
							defer.resolve(true);
						}
					}
					else {
						defer.resolve(true);
					}

					return defer.promise;
					// setBaseNChangeOrderPrcHeaderIdsByConHeaderId(value, true);
				};

				var originalDeleteItem = serviceContainer.data.deleteItem;
				serviceContainer.data.deleteItem = function deleteChildItem(item, data) {
					if (item && item.Version > 0) {
						var cloneItem = _.clone(item);
						var responseData = [];
						return $http.post(globals.webApiBaseUrl + 'procurement/pes/header/candelete?pesId=' + parseInt(cloneItem.Id)).then(function (response) {
							responseData = response.data;
							var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
							var commonModalOptions = confirmDeleteDialogHelper.generateConfirmDeleteModelOption();

							if (responseData === 2) {
								let procurementCommonDialogService = $injector.get('procurementCommonDialogService');
								return procurementCommonDialogService.showErrorDialog({
									ErrorMessage: $translate.instant('procurement.pes.allPESAssignedMessage')
								});

							} else if (responseData === 1) {
								// There are references with QTO lines, continue
								commonModalOptions.bodyTextKey = $translate.instant('procurement.pes.allPESAssignedMessage2');
								return platformModalService.showDialog(commonModalOptions);
								// return platformModalService.showYesNoDialog($translate.instant('procurement.pes.allPESAssignedMessage2'), $translate.instant('procurement.pes.WarningOfDeletePes'), 'no');

							} else {
								commonModalOptions.bodyTextKey = $translate.instant('procurement.common.confirmDeleteHeader');
								return platformModalService.showDialog(commonModalOptions);
								// return platformModalService.showYesNoDialog($translate.instant('procurement.common.confirmDeleteHeader'), $translate.instant('procurement.pes.WarningOfDeletePes'), 'no');
							}
						}).then(function (result) {
							if (result && result.yes) {
								// var filteredEntities = _.filter(_.indexOf(responseData, item.Id) == -1);
								originalDeleteItem(item, data);
							}
						});
					}
					else if (item && item.Version === 0) {
						originalDeleteItem(item, data);
					}
				};

				serviceContainer.service.removeChildItems = function removeChildItems(currencyItem) {
					var childServices = serviceContainer.service.getChildServices();
					var items = null;
					var pesItemService = null;
					var pesBoqService = null;
					var pesShipmentInfoService = null;
					if (childServices && childServices.length > 0) {
						pesItemService = _.find(childServices, {name: 'procurement.pes.item'});
						pesBoqService = _.find(childServices, {name: 'procurement.pes.boq'});
						pesShipmentInfoService = _.find(childServices, {name: 'procurement.pes.shipmentInfo'});
					}
					if (pesItemService) {
						items = pesItemService.getList();
						if (currencyItem) {
							items = _.filter(items, function (item) {
								return item.Id !== currencyItem.Id;
							});
						}
						if (items) {
							_.forEach(items, function (item) {
								pesItemService.deleteItem(item);
							});
						}
					}

					if (pesBoqService) {
						items = pesBoqService.getList();
						if (items) {
							_.forEach(items, function (item) {
								pesBoqService.deleteEntities([item]);
							});
						}
					}
				};


				serviceContainer.service.createBlankItem = function createBlankItem() {
					if (serviceContainer.data.doUpdate) {
						return serviceContainer.data.doUpdate(serviceContainer.data).then(function (canCreate) {
							if (canCreate) {
								if (platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)) {
									return platformDataServiceConfiguredCreateExtension.createByConfiguredDialog(platformDataServiceActionExtension, serviceContainer.data);
								} else {
									return doCallCustomHTTPCreate(serviceContainer.data, serviceContainer.data.onCreateSucceeded);
								}
							} else {
								return $q.when(canCreate);
							}
						});
					}
					else {
						return doCallCustomHTTPCreate(serviceContainer.data, serviceContainer.data.onCreateSucceeded);
					}
				};

				function getControllingUnits(projectId) {
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'controlling/structure/tree?mainItemId=' + projectId).then(function (response) {
						defer.resolve(response.data);
					});
					return defer.promise;
				}

				function getAllLevelUnits(Units, resultUnits) {
					_.forEach(Units, function (unit) {
						resultUnits.push(unit);
						if (unit.ControllingUnits !== null) {
							getAllLevelUnits(unit.ControllingUnits, resultUnits);
						}
					});
				}

				function doCallCustomHTTPCreate(data, onCreateSucceeded) {
					return $http.post(data.httpCreateRoute + 'createblank', {}).then(function (response) {
						if (response !== null && response.data !== null) {
							var projectVal = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
							response.data.ProjectFk = projectVal ? projectVal.id : null;
						}
						if (onCreateSucceeded) {
							if (response.data.ProjectFk && !response.data.ControllingUnitFk) {
								getControllingUnits(response.data.ProjectFk).then(function (controllingUnits) {
									if (controllingUnits) {
										var ctrlUnits = [];
										getAllLevelUnits(controllingUnits, ctrlUnits);
										$http.get(globals.webApiBaseUrl + 'controlling/structure/lookup/controllingunitstatus')
											.then(function (unitStatuses) {
												var controllingUnitStatuses = unitStatuses.data;
												if (controllingUnitStatuses) {
													var filterByProjectId = _.filter(ctrlUnits, function (item) {
														var found = _.find(controllingUnitStatuses, {
															Id: item.ControllingunitstatusFk,
															IsOpen: true
														});
														return item.IsDefault && item.IsAccountingElement && found;
													});
													var sortedData = _.sortBy(filterByProjectId, function (n) {
														return n.Id;
													});
													var firstItem = sortedData[0];
													if (firstItem) {
														response.data.ControllingUnitFk = firstItem.Id;
													}
												}
												return onCreateSucceeded(response.data, data, {});
											});

									} else {
										return onCreateSucceeded(response.data, data, {});
									}

								});
							} else {
								return onCreateSucceeded(response.data, data, {});
							}

						}
						return response.data;
					});
				}

				serviceContainer.service.getConfigurationFk = function getConfigurationFk() {
					if (serviceContainer.service.getSelected()) {
						return serviceContainer.service.getSelected().PrcConfigurationFk;
					}
				};

				serviceContainer.service.calculateTotalGrossAndOc = calculateTotalGrossAndOc;
				serviceContainer.service.isProcurementModule = true;
				serviceContainer.service.targetSectionId = 20;
				serviceContainer.service.isSavedImmediately = false;
				serviceContainer.service.AsyncBillingSchemaChanged = basicsBillingSchemaChangeNotifyService.createMessager();
				serviceContainer.service.onUpdateSucceeded = new PlatformMessenger();
				serviceContainer.service.vatGroupChanged = new PlatformMessenger();

				// eslint-disable-next-line no-unused-vars
				function update() {
					platformDataServiceModificationTrackingExtension.getModifications(serviceContainer.service);
					serviceContainer.service.update();
				}

				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
					return onCreateSucceeded.call(serviceContainer.data, newData, data, creationData).then(function () {
						var sourceHeaderId = serviceContainer.service.getConfigurationFk(newData);

						// var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: sourceHeaderId});
						let basicsLookupdataLookupDataService = $injector.get('basicsLookupdataLookupDataService');
						basicsLookupdataLookupDataService.getSearchList('prcconfiguration',' RubricFk=' + 27).then(function (data) {
							var config = _.find(data, {Id: sourceHeaderId});
							procurementPesNumberGenerationSettingsService.assertLoaded().then(function () {
								platformRuntimeDataService.readonly(newData, [{
									field: 'Code',
									readonly: procurementPesNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
								}]);
								newData.Code = procurementPesNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, newData.Code);
								var currentItem = serviceContainer.service.getSelected();
								if (newData.Code === '') {
									validation.validateCodeByChangeConfiguration(currentItem, newData.Code, 'Code');
								} else {
									validation.asyncValidateCode(currentItem, newData.Code, 'Code');
								}
								serviceContainer.service.markCurrentItemAsModified();
							});
						});
						// var  onEntityParentCreatedForPrcModule = procurementCommonCharacteristicDataService.createMethod(serviceContainer.service.targetSectionId,sourceHeaderId,serviceContainer.service.isSavedImmediately,update);
						// onEntityParentCreatedForPrcModule(null,newData);
						if (platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)) {
							if (!_.isNil(newData.ConHeaderFk)) {
								serviceContainer.service.update().then(function () {
										var pesBoqService = $injector.get('procurementPesBoqService');
										pesBoqService.createOtherItems({ConHeaderFk: newData.ConHeaderFk}, true);
								});
							}
						}
						serviceContainer.service.markCurrentItemAsModified();
					});
				};

				serviceContainer.service.handlePesCreatedSucceeded = function(newData){
					onCreateSucceeded(newData, serviceContainer.data);
				};

				serviceContainer.service.getDefaultListForCreated = function getDefaultListForCreated(targetSectionId,configrationSectionId,structureSectionId,newData) {
					var deferred = $q.defer();
					var sourceHeaderId = newData.Version === 0 ? newData.PrcConfigurationFk : serviceContainer.service.getConfigurationFk();
					if (!sourceHeaderId) {
						sourceHeaderId = newData.PrcConfigurationFk;
					}
					procurementCommonCharacteristicDataService.getDefaultListForCreated(targetSectionId, sourceHeaderId,configrationSectionId,structureSectionId, newData).then(function (defaultItem) {
						if (defaultItem) {
							deferred.resolve(defaultItem);
						}
					});
					return deferred.promise;
				};

				serviceContainer.service.getModuleState = function getModuleState(item) {
					var state, status, parentItem = item || serviceContainer.service.getSelected();
					status = basicsLookupdataLookupDescriptorService.getData('PesStatus');
					if (parentItem && parentItem.Id) {
						state = _.find(status, {Id: parentItem.PesStatusFk});
						if(state){
							state = {IsReadonly: state.IsReadOnly};
						}

					} else {
						state = {IsReadonly: true};
					}
					return state;
				};

				serviceContainer.service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk) {
					var item = serviceContainer.service.getSelected();
					vatGroupFk = (vatGroupFk === undefined && item) ? item.BpdVatGroupFk : vatGroupFk;
					return prcCommonGetVatPercent.getVatPercent(taxCodeFk, vatGroupFk);
				};

				serviceContainer.service.getIsFreeItemsAllowed = function getIsFreeItemsAllowed() {
					var item = serviceContainer.service.getSelected();
					var isFreeItemsAllowed = true; // Default is set to true
					if(_.has(item, 'ConHeaderFk') && item.ConHeaderFk !== null && item.ConHeaderFk !== undefined) {
						var conHeaders = basicsLookupdataLookupDescriptorService.getData('ConHeaderView');
						if (conHeaders) {
							var conHeader = _.find(conHeaders, {Id: item.ConHeaderFk});
							if (conHeader !== undefined) {
								isFreeItemsAllowed = conHeader.IsFreeItemsAllowed;
							}
						}
					}

					return isFreeItemsAllowed;
				};

				serviceContainer.service.wizardIsActivate=function(){
					var status = basicsLookupdataLookupDescriptorService.getData('PesStatus');
					var parentItem =serviceContainer.service.getSelected();
					var IsActivate=true;
					if (parentItem) {
						var oneStatus= _.find(status, { Id: parentItem.PesStatusFk });
						var IsReadonly = oneStatus.IsReadOnly;
						IsActivate=!IsReadonly;
					}
					if(!IsActivate){
						var headerTextKey = $translate.instant('procurement.pes.wizard.isActivateCaption');
						var bodyText=$translate.instant('procurement.pes.wizard.isActiveMessage');
						var modalOptions = {
							headerTextKey: headerTextKey,
							bodyTextKey: bodyText,
							showOkButton: true,
							showCancelButton: false,
							defaultButton: 'ok',
							iconClass: 'ico-question'
						};
						platformModalService.showDialog(modalOptions);
					}
					return IsActivate;
				};


				serviceContainer.service.getIsProtected = function getIsProtected() {
					var isProtected = false;
					var item = serviceContainer.service.getSelected();
					var pesStatuses = basicsLookupdataLookupDescriptorService.getData('PesStatus');
					var pesStatus = null;

					if(pesStatuses && item) {
						pesStatus = pesStatuses[item.PesStatusFk];
						isProtected = pesStatus ?  pesStatus.IsProtected : false;
					}

					return isProtected;
				};
				serviceContainer.service.updateTaxCodeOfContractItem = updateTaxCodeOfContractItem;
				serviceContainer.service.checkItemsBeforeUpdateTaxCode = checkItemsBeforeUpdateTaxCode;

				serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
					characteristicColumn = colName;
				};
				serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
					return characteristicColumn;
				};

				function onSelectionChanged(e, item) {
					onSetReadonly(e, item, true);

					var procurementContractHeaderDataService = $injector.get('procurementContractHeaderDataService');
					var basicsLookupdataLookupDataService = $injector.get('basicsLookupdataLookupDataService');
					// eslint-disable-next-line no-unused-vars
					var correspondingContractHeader = null;
					if (_.isObject(item)) {
						// Determine corresponding contract header
						basicsLookupdataLookupDataService.getItemByKey('conheader', item.ConHeaderFk).then(function (correspondingContractHeader) {
							procurementContractHeaderDataService.maintainBoqMainLookupFilter(correspondingContractHeader);
						});
					}

					isFreeItemsAllowedChanged.fire(serviceContainer.service.getIsFreeItemsAllowed());

					// setBaseNChangeOrderPrcHeaderIdsByConHeaderId(item ? item.ConHeaderFk : 0, true);
					procurementCommonOverrideHeaderInfoService.updateModuleHeaderInfo(serviceContainer.service,'cloud.desktop.moduleDisplayNamePerformanceEntrySheet');
				};

				serviceContainer.service.changeBackToModuleHeaderInformation = changeBackToModuleHeaderInformation;

				return serviceContainer.service;
				// function setBaseNChangeOrderPrcHeaderIdsByConHeaderId(conHeaderId, isUpdate) {
				//
				//     if (!(conHeaderId > 0)) {
				//         baseNchangeOrderPrcHeaderIds = [];
				//         return $q.when(baseNchangeOrderPrcHeaderIds);
				//     }
				//
				//     if ((baseNchangeOrderPrcHeaderIds.length > 0 && !isUpdate)) {
				//         return $q.when(baseNchangeOrderPrcHeaderIds);
				//     }
				//
				//     if (isUpdate){
				//         baseNchangeOrderPrcHeaderIds = [];
				//     }
				//
				//     return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/getbasenchangeorderprcheaderidsbyid?id=' + conHeaderId).then(function (response) {
				//         baseNchangeOrderPrcHeaderIds = response.data;
				//     });
				// }


				// function getBaseNChangeOrderPrcHeaderIds() {
				//     return angular.copy(baseNchangeOrderPrcHeaderIds);
				// }

				function addAdditionalProperties(item) {
					calculateTotalGrossAndOcWithoutRefresh(item);
					setCallOffMainContractCodeAndDes(item);
				}

				function calculateTotalGrossAndOcWithoutRefresh(pesItem) {
					if (pesItem === null) {
						return;
					}
					pesItem.TotalGross = pesItem.PesValue + pesItem.PesVat;
					pesItem.TotalGrossOc = pesItem.PesValueOc + pesItem.PesVatOc;
				}

				function calculateTotalGrossAndOc(pesItem) {
					if (pesItem === null) {
						return;
					}
					pesItem.TotalGross = pesItem.PesValue + pesItem.PesVat;
					pesItem.TotalGrossOc = pesItem.PesValueOc + pesItem.PesVatOc;
					serviceContainer.service.gridRefresh();
				}
				//
				function checkItemsBeforeUpdateTaxCode(pesHeader){
					var mainId = pesHeader.Id;
					var url = globals.webApiBaseUrl + 'procurement/pes/header/checkitemsbeforeupdatetaxcode?mainId=' + mainId;

					return $http.get(url);
				}
				//
				function updateTaxCodeOfContractItem(pesHeader){
					var mainId = pesHeader.Id;
					var url = globals.webApiBaseUrl + 'procurement/pes/header/updatetaxcodeofcontractitem?mainId=' + mainId;

					return $http.get(url);
				}

				function setCallOffMainContractCodeAndDes(item) {
					if (item.ConHeaderFk) {
						var conHeader = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: item.ConHeaderFk});
						if (conHeader) {
							if (conHeader.ConHeaderFk !== null && conHeader.ProjectChangeFk === null) {
								var mainContract = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: conHeader.ConHeaderFk});
								if (mainContract) {
									item.CallOffMainContractFk = mainContract.Id;
									item.CallOffMainContract = mainContract.Code;
									item.CallOffMainContractDes = mainContract.Description;
								}
							}
						}
					}
				}

				function changeBackToModuleHeaderInformation(currentModuleInfo) {
					let moduleNameTr = $translate.instant(serviceContainer.data.rootOptions.moduleName);
					if (!currentModuleInfo || (currentModuleInfo && (currentModuleInfo.search(moduleNameTr + ':') === 0 || currentModuleInfo.search(moduleNameTr + ' ') === 0) || currentModuleInfo === moduleNameTr)) {
						return;
					}
					if (angular.isFunction(serviceContainer.service.showModuleHeaderInformation)) {
						serviceContainer.service.showModuleHeaderInformation();
					}
				}
			}
		]);
})(angular);