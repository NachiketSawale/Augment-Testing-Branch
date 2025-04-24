/**
 * Created by reimer on 24.09.2014.
 */
(function () {
	'use strict';
	/* global globals,_ */
	var moduleName = 'procurement.common';

	/**
	 * @ngdoc service
	 * @name procurementCommonMainService
	 * @function
	 *
	 * @description
	 * procurementCommonMainService is the data service for all common related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementCommonPrcBoqService',
		['$http', '$q', 'platformDataServiceFactory', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService',
			'procurementCommonOverviewDataService', 'platformContextService', 'procurementContextService',
			'cloudDesktopSidebarService', 'platformModalService', 'procurementCommonDataServiceFactory', 'PlatformMessenger',
			'prcCommonBoqReadonlyProcessor','basicsCommonReadDataInterceptor', 'boqMainDocPropertiesService','procurementPackageItemAssignmentDataService',
			'$injector', 'prcBaseBoqLookupService','procurementCommonCreatePackageService', 'platformDataServiceModificationTrackingExtension',
			function ($http, $q, platformDataServiceFactory, basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService,
				procurementCommonOverviewDataService, platformContextService, moduleContext,
				cloudDesktopSidebarService, platformModalService, procurementCommonDataServiceFactory, PlatformMessenger,
				prcCommonBoqReadonlyProcessor,basicsCommonReadDataInterceptor, boqMainDocPropertiesService,procurementPackageItemAssignmentDataService, $injector,
				prcBaseBoqLookupService,procurementCommonCreatePackageService, platformDataServiceModificationTrackingExtension) {


				function constructorFn(parentService, prcBoqMainService) {
					//  region local members
					var service;
					var createParam;
					var filterBackups = false;

					var selectedPrcHeaderFk = 0;
					var isPackage = moduleContext.getMainService().name === 'procurement.package';
					var isQuote = moduleContext.getMainService().name === 'procurement.quote';
					var isContract = moduleContext.getMainService().name === 'procurement.contract';
					var isReq = moduleContext.getMainService().name === 'procurement.requisition';
					var isQuoteReq = moduleContext.getMainService().name === 'procurement.quote.requisition';
					var isAutoCreate = isAutoCreatePackageByModule();
					var needUpdateUcFromPackage = false;
					var currentModuleName = parentService.getModule().name;

					// noinspection JSCheckFunctionSignatures
					var getNextReference = function getNextReference() {
						// The same applies to the incrementing the reference number of the boq root item
						var testReference = function (item) {
							return /^\d+$/.test(item.Reference);
						};
						var listItems = service.getList();
						var references = _.map(_.map(listItems, 'BoqRootItem').filter(testReference), function (item) {
							return parseInt(item.Reference);
						});
						var maxReference = references.length ? _.max(references) : null;
						if (maxReference) {
							maxReference = (parseInt(maxReference, 10) + 1).toString();
						}
						return maxReference || '1';
					};

					var factoryOptions = {
						flatRootItem: {
							module: angular.module(moduleName),
							serviceName: 'procurementCommonPrcBoqService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'procurement/common/boq/',
								initReadData: function (readData) {
									var prcHeader = parentService.getSelected() || {};
									selectedPrcHeaderFk = prcHeader.PrcHeaderFk || 0;
									var exchangeRate = (_.has(prcHeader, 'ExchangeRate') && prcHeader.ExchangeRate !== undefined) ? prcHeader.ExchangeRate : 1;
									readData.filter = '?prcHeaderFk='+selectedPrcHeaderFk + '&exchangeRate='+exchangeRate + '&filterBackups='+filterBackups;
								}
							},
							actions: {
								delete: true, create: 'flat',
								canCreateCallBackFunc: function () {
									// return !!parentService.getSelected() && !moduleContext.isReadOnly && !parentService.noCreateOrDeleteAboutBoq;
									return service.canCreate();
								},
								canDeleteCallBackFunc: function () {
									return !moduleContext.isReadOnly && !parentService.noCreateOrDeleteAboutBoq;
								}
							},
							dataProcessor: [prcCommonBoqReadonlyProcessor],
							presenter: {
								list: {
									initCreationData: function initCreationData(creationData) {
										var selectedHeader = parentService.getSelected();
										if (selectedPrcHeaderFk !== null && parentService.isSelection(selectedHeader) && selectedHeader !== null) {
											creationData.PrcHeaderFk = selectedHeader.PrcHeaderFk;
											creationData.PackageFk = isPackage ? selectedHeader.PrcPackageFk : (createParam.PackageFk || selectedHeader.PackageFk);
											creationData.Reference = createParam.Reference || getNextReference();
											creationData.BriefInfo = createParam.BriefInfo;
											creationData.BasCurrencyFk = isPackage ? selectedHeader.CurrencyFk : selectedHeader.BasCurrencyFk;
											creationData.BoqItemPrjBoqFk = createParam.BoqItemPrjBoqFk;
											creationData.BoqItemPrjItemFk = createParam.BoqItemPrjItemFk;
											creationData.PrcHeaderFkOriginal = isPackage ? selectedHeader.PrcHeaderFk : createParam.PrcHeaderFkOriginal;
											creationData.CreateVersionBoq = !isPackage;
											creationData.takeOverOption = createParam.takeOverOption;
											creationData.BoqHeaderId = createParam.BoqHeaderId;
											creationData.WicGroupId = createParam.WicGroupId;
											creationData.BoqSource = createParam.BoqSource;
											creationData.WicBoqId = createParam.WicBoqId;
											creationData.SubPackageId = createParam.SubPackageId;
											creationData.TargetModuleName = moduleContext.getMainService().name;
											// creationData.ExchangeRate = createParam.ExchangeRate;
											createParam = {};
										}
									},
									isInitialSorted: true, sortOptions: {initialSortColumn: {field: 'BoqRootItem.Reference', id: 'boqRootItem.reference'}, isAsc: true, doNumericComparison: true},
									incorporateDataRead: incorporateDataRead
								}
							},
							entityRole: {
								root: {
									itemName: 'PrcBoqExtended',
									moduleName: 'procurement.common',
									lastObjectModuleName: moduleName,
									handleUpdateDone: function (updateData, response, data) {
										data.handleOnUpdateSucceeded(updateData, response, data, true);
										if (response.PrcBoqExtended) {
											calculateVatAndVatOc(response.PrcBoqExtended);
										}
										// change boq need to recalculate totals
										parentService.markCurrentItemAsModified();
									}
								}
							}
						}
					};
					/* function mergeUpdatedIntoBoqMain(response){
						var BoqRootItem = response.PrcBoqExtended.BoqRootItem;
						// Sync the currently selected boq main root item of the list with the changed prcBoqRootItem
						if(prcBoqMainService){
							var selectedBoq = prcBoqMainService.getRootBoqItem();
							if (selectedBoq) {
								if (angular.isDefined(selectedBoq) && (selectedBoq !== null) && (selectedBoq.Id === BoqRootItem.Id)) {
									angular.extend(selectedBoq, BoqRootItem);
								}
							}
						}

					} */

					var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
					// noinspection JSCheckFunctionSignatures
					service = serviceContainer.service;
					var overviewService = procurementCommonOverviewDataService.getService(moduleContext.getMainService(), moduleContext.getLeadingService());
					basicsCommonReadDataInterceptor.init(serviceContainer.service, serviceContainer.data);

					var entityCreating = new PlatformMessenger();
					var isCreating = false;
					serviceContainer.service.entityCreating = entityCreating;
					serviceContainer.service.getEntityCreatingStatus = getEntityCreatingStatus;

					const doPrepareDeleteOrigin = serviceContainer.data.doPrepareDelete;
					serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams, data) {
						doPrepareDeleteOrigin(deleteParams, data);
						deleteParams.entity.BoqRootItem = null; // It is unused in service 'procurement/common/boq/delete'

						const boqHeaderIds = [deleteParams.entity.BoqHeader.Id];
						$http.get(globals.webApiBaseUrl + 'boq/main/header/anybackupsource?boqHeaderIds=' + JSON.stringify(boqHeaderIds)).then(function(response) {
							if (response.data) {
								$injector.get('platformDialogService').showInfoBox('boq.main.Backup.DeletionFailed');
							}
						});
					};

					// (e=>null, deletedItems=>all deleted items)
					// replace the logic of onDeleteDone, done by stone.
					var onEntityDeleted = function onEntityDeleted(/* e, deletedItems */) {
						parentService.markCurrentItemAsModified();
						if(prcBoqMainService) {
							// noinspection JSCheckFunctionSignatures

							// For a complete boq has been deleted we have to make sure that corresponging modifications done
							// in the boq structure service (-> prcBoqMainService) are also cleared.
							var flatBoqList = prcBoqMainService.getList();
							prcBoqMainService.clearModifications(flatBoqList, true);  // Flag set to true forces delete items list also to be cleared
						}
					};
					serviceContainer.service.registerEntityDeleted(onEntityDeleted);

					// console.log(serviceContainer.data)
					// onDeleteDone
					var onDeleteDone = serviceContainer.data.onDeleteDone;
					serviceContainer.data.onDeleteDone = function onDeleteDoneSucceeded(/* data */) {
						onDeleteDone.apply(serviceContainer.data, arguments);
						// change boq need to recalculate totals
						procurementPackageItemAssignmentDataService.loadSubItemsList();
					};

					overviewService.registerDataService(moduleContext.overview.keys.boq, service);

					service.reloadItem = function reloadItem(entity) {
						$http.get(factoryOptions.flatRootItem.httpCRUD.route + 'getprcboqextendeditem?prcBoqId=' + entity.PrcBoq.Id).then(function (res) {
							var data = {PrcBoqExtended: {}};
							angular.extend(data.PrcBoqExtended, res.data);
							serviceContainer.data.handleOnUpdateSucceeded(null, data, serviceContainer.data, true);
							service.fireItemModified(entity);
						});
					};

					service.parentDataService = parentService;
					service.selectedPrcHeaderChanged = new PlatformMessenger();

					// service needs these properties ?
					service.codeField = '';
					service.descField = '';

					// remove create and delete method when module is readonly
					if (moduleContext.getModuleReadOnly()) {
						service.createItem = null;
						service.deleteItem = null;
					}

					// disable hint text updating
					serviceContainer.data.showHeaderAfterSelectionChanged = null;

					var prcBoqFilters = [{
						key: 'prc-controlling-unit-filter',
						serverSide: true,
						serverKey: 'prc.con.controllingunit.by.prj.filterkey',
						fn: function () {
							var currentItem = parentService.getSelected();
							if (currentItem) {
								var projectContext = platformContextService.getApplicationValue(cloudDesktopSidebarService.appContextProjectContextKey) || {};
								/** @namespace projectContext.pId */
								var projectId = currentItem.ProjectFk || projectContext.pId || null;
								if (projectContext) {
									return {
										ByStructure: true,
										ExtraFilter: true,
										PrjProjectFk: projectId,
										CompanyFk: null
									};
								}
							}
						}
					}, {
						key: 'prc-boq-package-filter',
						serverSide: true,
						fn: function () {
							var currentItem = parentService.getSelected();

							if (currentItem) {
								// var projectId = currentItem.ProjectFk || platformContextService.getApplicationValue('projectId');
								var projectContext = platformContextService.getApplicationValue(cloudDesktopSidebarService.appContextProjectContextKey) || {};
								var ProjectId = currentItem.ProjectFk || projectContext.pId || 714;
								if (projectContext) {
									// return 'ProjectFk=' + ProjectId;
									// todo-wui: using new lookup search approach.
									return {
										ProjectFk: ProjectId
									};
								}
							}

							return '';
						}
					}, {
						key: 'prc-boq-package2header-filter',
						serverKey: 'prc-boq-package2header-filter',
						serverSide: true,
						fn: function (item) {
							/* if (item && item.PrcBoq) {
								var packageFk = item.PrcBoq.PackageFk || 0;
								return 'PrcPackageFk=' + packageFk;
							}
							return ''; */
							if (item && item.PrcBoq) {
								var packageFk = item.PrcBoq.PackageFk || 0;
								return {PrcPackageFk : packageFk};
							}

						}
					},{
						key: 'est-controlling-unit-filter',  // for boq structure controllingUintFk
						serverSide: true,
						serverKey: 'basics.masterdata.controllingunit.filterkey',
						fn: function () {
							var parentItem = parentService.getSelected();
							if(parentItem){
								return {
									ProjectFk: parentItem.ProjectFk
								};
							}
						}
					}, {
						key: 'procurement-package-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + moduleContext.packageRubricFk;
						}
					}];

					var onParentItemCreated = function onParentItemCreated(e, args) {
						if(args.PrcBoqExtended){
							service.setCreatedItems(args.PrcBoqExtended);
						}
					};

					if (parentService.completeItemCreated) {
						parentService.completeItemCreated.register(onParentItemCreated);
					}

					// register all filter in certificates
					service.registerFilters = function registerFilters() {
						if (!service.filterRegistered) {
							service.filterRegistered = true;
							basicsLookupdataLookupFilterService.registerFilter(prcBoqFilters);
						}
					};
					// unregister all filter in certificates
					service.unregisterFilters = function unregisterFilters() {
						if (service.filterRegistered) {
							basicsLookupdataLookupFilterService.unregisterFilter(prcBoqFilters);
							service.filterRegistered = false;
						}
					};

					parentService.registerFilterLoad(service.registerFilters);
					parentService.registerFilterUnLoad(service.unregisterFilters);
					service.registerFilters();

					service.getSelectedPrcBoq = function () {
						var item = service.getSelected();
						if (item && Object.prototype.hasOwnProperty.call(item,'PrcBoq')) {
							return item;
						}
						else {
							return null;
						}
					};

					service.getPrcHeaderFk = function () {
						selectedPrcHeaderFk = parentService.getSelected().PrcHeaderFk;
						return selectedPrcHeaderFk;
					};

					service.setPrcHeaderFk = function (newValue) {
						selectedPrcHeaderFk = newValue;
						service.itemFilter = 'prcHeaderFk=' + selectedPrcHeaderFk;
						service.createParameter = 'prcHeaderFk=' + selectedPrcHeaderFk;
						service.refresh();
						service.selectedPrcHeaderChanged.fire();

					};

					service.setSelectedPrcBoq = function setSelectedPrcBoq(value) {
						service.selectedPrcBoq = value;
					};

					service.clear = function () {
						service.setPrcHeaderFk(0);
					};

					var onHeaderSelectionChanged = function onHeaderSelectionChanged() {
						var selected = parentService.getSelected();
						if (!selected || !selected.Id) {
							if (serviceContainer.data.clearContent) {
								serviceContainer.data.clearContent(serviceContainer.data);
							}
							return;
						}

						service.setPrcHeaderFk(selected.PrcHeaderFk);
						// service.selectedPrcHeaderChanged.fire();
					};

					var onBoqMainItemChanged = function onBoqMainItemChanged(e, args) {

						// React on an item being changed in the boq main structure
						// e is supposed to be null. args is supposed to be the changed item.

						// Check if the changed item is the root item.
						var changedBoqMainItem = args;
						if (prcBoqMainService && prcBoqMainService.getRootBoqItem() === changedBoqMainItem) {
							// Sync the currently selected boq root item of the list with the changed boqMainRootItem
							var selected = service.getSelected();
							if (selected) {
								var selectedBoq = selected.BoqRootItem;
								if (angular.isDefined(selectedBoq) &&
									(selectedBoq !== null) &&
									(selectedBoq.Id === changedBoqMainItem.Id)) {

									if(selectedBoq.Finalprice !== changedBoqMainItem.Finalprice || selectedBoq.FinalpriceOc !== changedBoqMainItem.FinalpriceOc)
									{
										// told to enable 'recalculate' button on total container.
										if(service.parentDataService)
										{
											service.parentDataService.isTotalDirty = true;
										}
									}
									// Merge complete changed boq root item to make sure not loosing any changes when doing an update
									// on this changed item.
									calculateVatAndVatOc({BoqRootItem: changedBoqMainItem});
									angular.merge(selectedBoq, changedBoqMainItem);
									service.gridRefresh();
								}
							}
						}
					};

					var onPrcBoqRootItemChanged = function onPrcBoqRootItemChanged(e, args) {

						// React on an item being changed in the prc boq root item list
						// e is supposed to be null. args is supposed to be the changed item.

						// Check if the changed item is the root item.
						var changedPrcBoqRootItem = args ? args.BoqRootItem : null;
						if (service.getSelected() && service.getSelected().BoqRootItem === changedPrcBoqRootItem) {
							// Sync the currently selected boq main root item of the list with the changed prcBoqRootItem
							if(prcBoqMainService){
								var selectedBoq = prcBoqMainService.getRootBoqItem();
								if (angular.isDefined(selectedBoq) &&
									(selectedBoq !== null) &&
									(selectedBoq.Id === changedPrcBoqRootItem.Id) &&
									((selectedBoq.Reference !== changedPrcBoqRootItem.Reference) || (selectedBoq.ExternalCode !== changedPrcBoqRootItem.ExternalCode) || !angular.equals(selectedBoq.BriefInfo, changedPrcBoqRootItem.BriefInfo) || selectedBoq.Version !== changedPrcBoqRootItem.Version || (selectedBoq.Discount !== changedPrcBoqRootItem.Discount) || (selectedBoq.DiscountOc !== changedPrcBoqRootItem.DiscountOc))) {
									// Only update those properties that currently can be changed in the corresponding container.
									selectedBoq.Reference = changedPrcBoqRootItem.Reference;
									selectedBoq.ExternalCode = changedPrcBoqRootItem.ExternalCode;
									selectedBoq.Discount = changedPrcBoqRootItem.Discount;
									selectedBoq.DiscountOc = changedPrcBoqRootItem.DiscountOc;
									selectedBoq.Finalprice = changedPrcBoqRootItem.Finalprice;
									selectedBoq.FinalpriceOc = changedPrcBoqRootItem.FinalpriceOc;
									angular.extend(selectedBoq.BriefInfo, changedPrcBoqRootItem.BriefInfo);
									selectedBoq.Version = changedPrcBoqRootItem.Version;
									prcBoqMainService.gridRefresh();
								}
							}
						}
					};

					var onPrcBoqHeaderChanged = function onPrcBoqHeaderChanged(e, args) {

						// React on a boq header being changed when saving the boq document properties.
						// e is supposed to be null. args is supposed to be the changed item.

						// Check if the changed item is the related to the currently selected boq header.
						var changedPrcBoqHeader = args ? args.UpdatedBoqHeader : null;
						var selectedBoqHeader = service.getSelected() && service.getSelected().BoqHeader ? service.getSelected().BoqHeader : null;
						if (selectedBoqHeader !== null && changedPrcBoqHeader !== null && selectedBoqHeader.Id === changedPrcBoqHeader.Id) {
							// Sync the currently selected boq header of the list with the changed prcBoqHeader

							// Merge complete changed boq header to make sure not loosing any changes when doing an update
							// on this changed item.
							angular.merge(selectedBoqHeader, changedPrcBoqHeader);
							service.gridRefresh();
						}
					};

					var determineProcurementCallingContext = function determineProcurementCallingContext() {
						var mainService = moduleContext.getMainService();
						var procurementCallingContext = null;
						var mainServiceModuleName = null;
						if(_.isObject(mainService)) {
							mainServiceModuleName = moduleContext.getModuleName();

							switch(mainServiceModuleName) {
								case 'procurement.package':
									procurementCallingContext = {PrcPackageHeader: mainService.getSelected()};
									break;
								case 'procurement.requisition':
									procurementCallingContext = {PrcRequisitionHeader: mainService.getSelected()};
									break;
								case 'procurement.quote':
									procurementCallingContext = {PrcQuoteHeader: mainService.getSelected()};
									break;
								case 'procurement.contract':
									procurementCallingContext = {PrcContractHeader: mainService.getSelected()};
									break;
								case 'procurement.pes':
									procurementCallingContext = {PrcPesHeader: mainService.getSelected()};
									break;
							}
						}

						return procurementCallingContext;
					};

					var onItemSelectionChanged = function onItemSelectionChanged() {
						var selected = service.getSelected();
						var boqRootItem = selected ? selected.BoqRootItem : null;
						var BoqHeaderFk = boqRootItem ? boqRootItem.BoqHeaderFk : 0;
						var currentMainItem = parentService.getSelected();
						var isReadOnly = (moduleContext.getModuleStatus() && moduleContext.getModuleStatus().IsReadonly) ||
							(selected && selected.BoqHeader && selected.BoqHeader.IsReadOnly);
						var procurementCallingContext = determineProcurementCallingContext();

						if(prcBoqMainService) {
							// noinspection JSCheckFunctionSignatures
							prcBoqMainService.setSelectedHeaderFk(BoqHeaderFk);
							prcBoqMainService.setCallingContext(procurementCallingContext);
							prcBoqMainService.setSelectedProjectId(currentMainItem ? currentMainItem.ProjectFk : null);
							prcBoqMainService.setCurrentExchangeRate(currentMainItem ? currentMainItem.ExchangeRate : 1.0);
							prcBoqMainService.setReadOnly(isReadOnly);
						}
					};

					var onExchangeRateChanged = function onExchangeRateChanged(e, args) {

						var listItems = service.getList();
						var boqHeaderIds = _.map(_.map(listItems, 'BoqRootItem'), function (item) {
							return item.BoqHeaderFk;
						});

						if(_.isEmpty(boqHeaderIds)) {
							return;
						}

						var currentMainItem = getHeaderSelected();

						if (currentMainItem) {
							var exchangeRate = args.ExchangeRate;
							var newCurrencyFk = null;
							var vatGroupFk = currentMainItem.BpdVatGroupFk;
							if (Object.prototype.hasOwnProperty.call(currentMainItem,'CurrencyFk')) {
								newCurrencyFk = currentMainItem.CurrencyFk;
							}
							else if (Object.prototype.hasOwnProperty.call(currentMainItem,'BasCurrencyFk')) {
								newCurrencyFk = currentMainItem.BasCurrencyFk;
							}

							prcBoqMainService.setCurrentExchangeRate(args.ExchangeRate);


							// Before recalculating and refreshing the corresponding boqs we save all other changes
							var updateFunction = parentService.updateAndExecute;
							if (!angular.isFunction(updateFunction)) {
								var mainService = moduleContext.getLeadingService();
								if (mainService) {
									updateFunction = mainService.updateAndExecute;
								}
							}
							if (angular.isFunction(updateFunction)) {
								updateFunction(function () {
									$http.post(globals.webApiBaseUrl + 'boq/main/recalculateboqs' + '?exchangeRate=' + exchangeRate + '&currencyFk=' + newCurrencyFk + '&doSave=true' + '&vatGroupFk=' + vatGroupFk, boqHeaderIds).then(function (/* result */) {
										service.loadBoqsList().then(function () {
											var selected = service.getSelected();
											var boqRootItem = selected ? selected.BoqRootItem : null;
											var boqHeaderFk = boqRootItem ? boqRootItem.BoqHeaderFk : 0;
											prcBoqMainService.setSelectedHeaderFk(boqHeaderFk, true);
											if(isPackage){
												parentService.parentService().refreshSelectedEntities();
											}else{
												prcBoqMainService.gridRefresh();
											}
										});

										if (isPackage || isQuote) {
											var subpackages = parentService.getList();
											var param = {
												prcHeaderIds: []
											};
											if (subpackages.length) {
												_.forEach(subpackages, function(s) {
													param.prcHeaderIds.push(s.PrcHeaderFk);
												});
											}
											$http.post(globals.webApiBaseUrl + 'procurement/common/boq/getboqrootitmes', param).then(function (result) {
												if (isPackage) {
													basicsLookupdataLookupDescriptorService.updateData('BoqRootsOfPackage', result.data);
												}
												else if (isQuote) {
													basicsLookupdataLookupDescriptorService.updateData('BoqRootsOfQtn', result.data);
												}
											});
										}
									});
								});
							}
						}
					};

					var onItemCreated = function onItemCreated(e, newItem) {
						if(prcBoqMainService) {
							// noinspection JSCheckFunctionSignatures
							prcBoqMainService.reloadBasedOnNewRoot(newItem.BoqRootItem);
						}
						// service.markItemAsModified(newItem);
					};

					/**
					 * @ngdoc function
					 * @name getCellEditable
					 * @function
					 * @methodOf procurement.common.procurementCommonPrcBoqService
					 * @description get editable of model
					 * @returns bool
					 */
					/* jshint -W074 */ // The complexly warning is not need, logic in method is simple and readable
					service.getCellEditable = function (/* item, model */) {
						var editable = true;

						// Readonly state is derived from related state of boq header coming from currently set boq status
						var prcBoqExtended = service.getSelected();
						if ((moduleContext.getModuleStatus() && moduleContext.getModuleStatus().IsReadonly) ||
							(prcBoqExtended && prcBoqExtended.BoqHeader && prcBoqExtended.BoqHeader.IsReadOnly)) {
							return false;
						}

						return editable;
					};


					var init = function () {
						var basicCustomizeSystemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
						if (basicCustomizeSystemoptionLookupDataService) {
							basicCustomizeSystemoptionLookupDataService.loadLookupData();
						}
						onHeaderSelectionChanged();
					};

					init();

					parentService.registerSelectionChanged(onHeaderSelectionChanged);
					parentService.exchangeRateChanged.register(onExchangeRateChanged);
					service.registerSelectionChanged(onItemSelectionChanged);
					service.registerEntityCreated(onItemCreated);

					if(prcBoqMainService){
						prcBoqMainService.registerItemModified(onBoqMainItemChanged);
					}
					service.registerItemModified(onPrcBoqRootItemChanged);
					boqMainDocPropertiesService.boqPropertiesSaved.register(onPrcBoqHeaderChanged);

					// disable create , delete when module is readonly
					if (moduleContext.getModuleReadOnly()) {
						delete service.createItem;
						delete service.deleteItem;
					}
					var getPrcBoqDefaultValue;
					// TODO It's just a workaround for create prcBoq suceesfully
					var showEditDialog = function showEditDialog() {
						var defaultValue = null;
						var selectedHeader = parentService.getSelected();
						if (!selectedHeader) {
							return $q.when(null);
						}

						var defer = $q.defer();
						var copyMode = selectedHeader.PrcCopyModeFk;
						var conOrReqHasWicBoq = hasWicBoqInConOrReq(selectedHeader);
						var options = {
							inReq: isReq,
							prcBoqDefaultValue: null,
							enableUseBaseBoq: false,
							enableUseWicBoq: false,
							enableNewBoq: false,
							boqSource: conOrReqHasWicBoq ? 2 : 1 // 1: package; 2: wic; 3: new
						};

						if (copyMode) {
							var baseBoqs = [];
							var wicBoqs = [];
							var baseBoqPromise = null;
							var wicBoqPromise = null;
							var getDefaultBoqPromise = null;

							switch (copyMode) {
								case 1:
								case 4: {
									baseBoqPromise = getBaseBoqs(selectedHeader.PackageFk);
									wicBoqPromise = getWicBoqs(selectedHeader.Id);
									getDefaultBoqPromise = getPrcBoqDefaultValue(selectedHeader.PackageFk);
								}
									break;
								case 2: {
									baseBoqPromise = getBaseBoqs(selectedHeader.PackageFk);
									wicBoqPromise = $q.when(wicBoqs);
									getDefaultBoqPromise = $q.when(null);
								}
									break;
								case 3: {
									baseBoqPromise = getBaseBoqs(selectedHeader.PackageFk);
									wicBoqPromise = getWicBoqs(selectedHeader.Id);
									getDefaultBoqPromise = $q.when(null);
								}
									break;
								default:
									break;
							}

							$q.all([baseBoqPromise, wicBoqPromise, getDefaultBoqPromise])
								.then(function (res) {
									if (!res) {
										platformModalService.showMsgBox('procurement.common.createPrcBoqNoCopy', 'procurement.common.boq.createDialogTitle'); // TODO chi: should change later
										defer.resolve(false);
										return;
									}

									baseBoqs = res[0];
									wicBoqs = res[1];
									defaultValue = res[2];
									if (((copyMode === 1 || copyMode === 4) && baseBoqs.length === 0 && wicBoqs.length === 0 && !defaultValue) || (copyMode === 2 && baseBoqs.length === 0) || (copyMode === 3 && baseBoqs.length === 0 && wicBoqs.length === 0)) {
										platformModalService.showMsgBox('procurement.common.createPrcBoqNoCopy', 'procurement.common.boq.createDialogTitle'); // TODO chi: should change later
										defer.resolve(false);
										return;
									}

									if (baseBoqs.length > 0 && !conOrReqHasWicBoq) {
										options.enableUseBaseBoq = true;
									}

									if (wicBoqs.length > 0 || conOrReqHasWicBoq) {
										options.enableUseWicBoq = true;
									}

									if ((copyMode === 1 || copyMode === 4) && defaultValue && !conOrReqHasWicBoq) {
										options.enableNewBoq = true;
									}

									if (options.enableUseBaseBoq) {
										options.boqSource = 1;
									} else if (options.enableUseWicBoq) {
										options.boqSource = 2;
									} else if (options.enableNewBoq) {
										options.boqSource = 3;
									}

									options.prcBoqDefaultValue = defaultValue;

									showDialog(selectedHeader, options, defer);
								});
						}
						else {
							getPrcBoqDefaultValue(selectedHeader.PackageFk).then(function(data){
								options.prcBoqDefaultValue = data;
								options.enableUseBaseBoq = true;
								options.enableNewBoq = !!data;
								options.enableUseWicBoq = (isReq && conOrReqHasWicBoq) ? true : options.enableUseWicBoq;
								showDialog(selectedHeader, options, defer);
							});
						}
						return defer.promise;
					};
					// noinspection jshint w003
					createParam = {};
					var baseCreateItem = service.createItem;
					service.createItem = function createItem() {
						var defer = $q.defer();
						var selectedHeader = parentService.getSelected();
						var isNoHavePackageFk = parentService.isSelection(selectedHeader) && !selectedHeader.PackageFk;

						function doCreateBoq() {
							var defer = $q.defer();
							parentService.updateAndExecute(function () {
								showEditDialog().then(function (params) {
									if (!params) {
										defer.resolve(null);
										return;
									}
									isCreating = true;
									entityCreating.fire(null, isCreating);
									createParam = params;
									return baseCreateItem().then(function(result){
										defer.resolve(result);
										if(service.parentDataService.boqProcurementStructureChanged && result && result.BoqRootItem && result.BoqRootItem.PrcStructureFk !== null){
											service.parentDataService.boqProcurementStructureChanged.fire({newValue: result.BoqRootItem.PrcStructureFk});
										}
										service.update();
									})
										.finally(function () {
											isCreating = false;
											entityCreating.fire(null, isCreating);
										});
								},function(error){
									defer.reject(error);
								});
							});
							return defer.promise;
						}

						if (isNoHavePackageFk && isPackage) {
							platformModalService.showMsgBox('procurement.common.createprcBoqsFromPackageFailedBody', 'procurement.common.createprcBoqsFailedTitle', 'warning').then(function (item) {
								defer.reject('Error occured');
								service.markItemAsModified(item);
							});
						}
						else if (isNoHavePackageFk && isAutoCreate) {
							var options = {
								defaults: {
									ProjectFk: selectedHeader.ProjectFk,
									StructureFk: selectedHeader.PrcHeaderEntity.StructureFk,
									BasCurrencyFk: selectedHeader.BasCurrencyFk,
									ConfigurationFk: selectedHeader.PrcHeaderEntity.ConfigurationFk
								},
								IsAutoSave:true
							};
							procurementCommonCreatePackageService.createItem(options).then(function (result) {
								let packageItem = result.package;
								let package2HeaderItem = result.package2Header;
								selectedHeader.PackageFk = packageItem.Id;
								if (Object.prototype.hasOwnProperty.call(selectedHeader, 'Package2HeaderFk') && package2HeaderItem) {
									selectedHeader.Package2HeaderFk = package2HeaderItem.Id;
								}
								if(!selectedHeader.ProjectFk){
									selectedHeader.ProjectFk = packageItem.ProjectFk;
								}
								parentService.markCurrentItemAsModified();
								prcBaseBoqLookupService.setCurrentPrcHeaderToNull();
								doCreateBoq().then(function (res) {
									defer.resolve(res);
								});
							});
						}
						else {
							doCreateBoq().then(function (res) {
								defer.resolve(res);
							});
						}
						return defer.promise;
					};

					service.loadBoqsList = function () {
						return service.refresh();
						// service.gridRefresh();
					};

					// Overwrite the setSelected function to be able to trigger an update to avoid loosing modified data of child items, i.e. boqItems.
					// Todo: This is just a workaround to avoid loosing changed data, until the correct parent-child aggregation of services is done.
					var originalSetSelected = service.setSelected;
					service.setSelected = function setSelectedBidBoq(item, entities) {
						if (service.getSelected() && item && item.Id === service.getSelected().Id && _.isEqual( service.getSelectedEntities(), entities)) {
							return $q.when(item);
						}

						// Get parent data service and trigger an update....
						if (parentService.getSelected() && parentService.update && !service.isModelChanged()) {   // Only do the update if the procurement boq list isn't modified, because otherwise updating the parent service
							return parentService.update().then(function () {                                       // will be done in the handleUpdateDone hook of this service. This check is done to avoid unnecessary updates
								// ...and after the successful update trigger the selection
								return originalSetSelected(item, entities);
							},
							function() {
								return service.getSelected();
							});
						}
						else {
							return originalSetSelected(item, entities);
						}
					};

					getPrcBoqDefaultValue = function getPrcBoqDefaultValue(packageFk) {
						var defer = $q.defer();
						var url = globals.webApiBaseUrl + 'procurement/package/package/getprcboqdefault?packageFk=' + packageFk;
						var defaultValue = null;
						$http.get(url)
							.then(function (res) {
								defaultValue = res.data;
							})
							.finally(function () {
								defer.resolve(defaultValue);
							});
						return defer.promise;
					};

					service.canCreate = function canCreate() {
						if (moduleContext.canAddDeleteItemByConfiguration(parentService) === false) {
							return false;
						}
						return !!parentService.getSelected() && !moduleContext.isReadOnly && !parentService.noCreateOrDeleteAboutBoq;
					};

					service.canDelete = function canDelete() {
						if (moduleContext.canAddDeleteItemByConfiguration(parentService) === false) {
							return false;
						}
						let deleteSwitch=false;
						if	(service.hasSelection()&&!moduleContext.isReadOnly){
							deleteSwitch=true;
						}
						return deleteSwitch;
					};

					var entitiesForUpadteUc = [];
					function onControllingUnitChanged() {
						entitiesForUpadteUc = service.getList();
						if (entitiesForUpadteUc && entitiesForUpadteUc.length) {
							if(isReq || isContract){
								parentService.hasItemsOrBoqs({prcboqs: true});
							}else {
								parentService.parentService().hasItemsOrBoqs({prcboqs: true});
							}
						}
						needUpdateUcFromPackage = false;
					}
					function updateCuFromParent() {
						if (entitiesForUpadteUc && entitiesForUpadteUc.length) {
							var parenteSelected;
							if(isReq || isContract){
								parenteSelected = parentService.getSelected();
							}else {
								parenteSelected = parentService.parentService().getSelected();
							}
							if (parenteSelected) {
								entitiesForUpadteUc.forEach(function (e) {
									e.PrcBoq.MdcControllingunitFk = parenteSelected.MdcControllingUnitFk ? parenteSelected.MdcControllingUnitFk : parenteSelected.ControllingUnitFk;
									service.markItemAsModified(e);
								});
								needUpdateUcFromPackage = true;
							}
						}
						entitiesForUpadteUc = [];
					}
					if (isPackage &&
						parentService.parentService().controllingUnitChanged &&
						parentService.parentService().controllingUnitToItemBoq
					) {
						service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData){
							if (needUpdateUcFromPackage) {
								// need to update controllingUnit from package
								var parenteSelected = parentService.parentService().getSelected();
								updateData.PackageId = parenteSelected.Id;
								updateData.NeedUpdateUcFromPackage = true;
								needUpdateUcFromPackage = false;
								if (updateData && updateData.PrcBoqExtended) {
									let item = updateData.PrcBoqExtended;
									if(item.BoqRootItem){
										setFormatValue(item.BoqRootItem);
										formatDateValueObjectToString(item.BoqRootItem);
									}
								}
							}
						};
						if (parentService.parentService().controllingUnitChanged) {
							parentService.parentService().controllingUnitChanged.register(onControllingUnitChanged);
						}
						if (parentService.parentService().controllingUnitToItemBoq) {
							parentService.parentService().controllingUnitToItemBoq.register(updateCuFromParent);
						}
					}

					if ((isReq || isContract) &&
						parentService.controllingUnitChanged &&
						parentService.controllingUnitToItemBoq
					) {
						service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData){
							if (needUpdateUcFromPackage) {
								// need to update controllingUnit from package
								var parenteSelected = parentService.getSelected();
								updateData.PackageId = parenteSelected.Id;
								updateData.NeedUpdateUcFromPackage = true;
								needUpdateUcFromPackage = false;
								if (updateData && updateData.PrcBoqExtended) {
									let item = updateData.PrcBoqExtended;
									if(item.BoqRootItem){
										setFormatValue(item.BoqRootItem);
										formatDateValueObjectToString(item.BoqRootItem);
									}
								}
							}
						};
						if (parentService.controllingUnitChanged) {
							parentService.controllingUnitChanged.register(onControllingUnitChanged);
						}
						if (parentService.controllingUnitToItemBoq) {
							parentService.controllingUnitToItemBoq.register(updateCuFromParent);
						}
					}

					if ((isPackage || isQuoteReq) && parentService.parentService().onRecalculationItemsAndBoQ) {
						parentService.parentService().onRecalculationItemsAndBoQ.register(loadList);
					} else {
						if (parentService.onRecalculationItemsAndBoQ) {
							parentService.onRecalculationItemsAndBoQ.register(loadList);
						}
					}

					service.getNetTotalNoDiscountSplit = function getNetTotalNoDiscountSplit(list) {
						var result = {
							netTotal: 0,
							netTotalOc: 0,
							gross: 0,
							grossOc: 0
						};
						var boqItems = list || service.getList();
						if (boqItems && boqItems.length) {
							_.forEach(boqItems, function(i) {
								if (i.BoqRootItem
								) {
									var isOverGross = getIsCalculateOverGross();
									if (isOverGross) {
										result.gross += i.BoqRootItem.Finalgross + i.BoqRootItem.Discount;
										result.grossOc += i.BoqRootItem.FinalgrossOc + i.BoqRootItem.DiscountOc;
									}
									else {
										result.netTotal += i.BoqRootItem.Finalprice + i.BoqRootItem.Discount;
										result.netTotalOc += i.BoqRootItem.FinalpriceOc + i.BoqRootItem.DiscountOc;
									}
								}
							});
						}
						return result;
					};

					if(currentModuleName === 'procurement.package')
					{
						service.createDeepCopy = function() {
							var prcBoq = service.getSelected().PrcBoq;
							$http.post(globals.webApiBaseUrl + 'procurement/common/boq/createdeepcopy' + '?prcHeaderId='+prcBoq.PrcHeaderFk + '&packageId='+prcBoq.PackageFk + '&boqHeaderId='+prcBoq.BoqHeaderFk
								+ '&targetModuleName=' + moduleContext.getMainService().name).then(function() {
								service.load();
							});
						};
					}

					service.setBackupFilter = function(value) {
						filterBackups = value;
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

					function getHeaderSelected() {
						var headerSelected;
						if (currentModuleName === 'procurement.package' || currentModuleName === 'procurement.quote') {
							headerSelected = parentService.parentService().getSelected();
						} else {
							headerSelected = parentService.getSelected();
						}
						return headerSelected;
					}
					let leadingService=moduleContext.getLeadingService();
					if (leadingService?.onLeadingServiceUpdateDone ) {
						serviceContainer.data.updateOnSelectionChanging = null;
						leadingService.onLeadingServiceUpdateDone.register(updateBoq);
						if ( _.isFunction(leadingService.saveRecentChanges) && _.isFunction(service.saveRecentChanges)){
							service.saveRecentChanges = function () {
								leadingService.saveRecentChanges();
							}
						}
					}
					return service;

					// ////////////////////////
					function incorporateDataRead(responseData, data) {
						serviceContainer.data.sortByColumn(responseData);
						if (currentModuleName === 'procurement.quote' && responseData && responseData.length) {
							_.forEach(responseData, function(i) {
								basicsLookupdataLookupDescriptorService.updateData('BoqRootsOfQtn', i.BoqRootItem);
							});
						}
						if (currentModuleName === 'procurement.package' && responseData && responseData.length) {
							_.forEach(responseData, function(i) {
								basicsLookupdataLookupDescriptorService.updateData('BoqRootsOfPackage', i.BoqRootItem);
							});
						}
						if (data.selectedItem) {
							data.selectedItem = null;
							data.selectionChanged.fire(null, null);
						}

						calculateVatAndVatOc(responseData);

						var result = data.handleReadSucceeded(responseData, data, true);

						serviceContainer.service.goToFirst();
						if (angular.isFunction(parentService.getParentBoqItems)) {
							parentService.getParentBoqItems();
						}
						return result;
					}

					function calculateVatAndVatOc(responseData) {
						var datas = responseData;
						if (!_.isArray(datas)) {
							datas = [responseData];
						}

						_.forEach(datas, function(data) {
							var boqRootItem = data.BoqRootItem;
							if (boqRootItem) {
								boqRootItem.Vat = boqRootItem.Finalgross - boqRootItem.Finalprice;
								boqRootItem.VatOc = boqRootItem.FinalgrossOc - boqRootItem.FinalpriceOc;
							}
						});
					}

					function getBaseBoqs(packageId) {
						var baseBoqs = [];
						if (!packageId) {
							return $q.when(baseBoqs);
						}
						var defer = $q.defer();
						var filter = basicsLookupdataLookupFilterService.getFilterByKey('prc-base-boq-filter');
						prcBaseBoqLookupService.clearBaseBoqList();
						prcBaseBoqLookupService.setCurrentPrcPackage(packageId);
						prcBaseBoqLookupService.setCurrentlyLoadedItemsCallback(service.getList);
						var promise = prcBaseBoqLookupService.getPrcBaseBoqList();
						promise.then(function (data) {
							if (angular.isArray(data)) {
								_.forEach(data, function (item) {
									if (filter.fn(item)) {
										baseBoqs.push(item);
									}
								});
							}
						})
							.finally(function () {
								defer.resolve(baseBoqs);
							});
						return defer.promise;
					}

					function getWicBoqs(contractId) {
						var wicBoqs = [];
						if (!contractId) {
							return $q.when(wicBoqs);
						}
						var defer = $q.defer();
						$http.get(globals.webApiBaseUrl + 'boq/wic/boq/getwicboqsbycontractid?contractId=' + contractId)
							.then(function (response) {
								if (response && angular.isArray(response.data)) {
									wicBoqs = response.data;
								}
							})
							.finally(function () {
								defer.resolve(wicBoqs);
							});
						return defer.promise;
					}

					function showDialog(selectedHeader, options, defer) {
						var templateUrl='procurement.common/partials/boq/create-procurement-boq-view.html', controllerName = 'procurementContractSetPrcBoqCodeDialogController',mainService = moduleContext.getMainService();
						if(mainService.name === 'procurement.package') {
							templateUrl = 'procurement.common/partials/set-prc-boq-code.html';
							controllerName = 'procurementPackageSetPrcBoqCodeDialogController';
						}
						var conReqHasWicBoq = hasWicBoqInConOrReq(selectedHeader);
						var wicBoqs = basicsLookupdataLookupDescriptorService.getData('PrcWicCatBoqs');
						var boqWicCatBoqFk = null;
						let wicBoqReference = null;
						if (conReqHasWicBoq && selectedHeader.BoqWicCatBoqFk) {
							if (wicBoqs && wicBoqs[selectedHeader.BoqWicCatBoqFk] && _.has(wicBoqs[selectedHeader.BoqWicCatBoqFk], 'BoqRootItem.Id')) {
								boqWicCatBoqFk = wicBoqs[selectedHeader.BoqWicCatBoqFk].BoqRootItem.Id;
								wicBoqReference = wicBoqs[selectedHeader.BoqWicCatBoqFk].BoqRootItem.Reference;
							}
						}
						var defaultOptions = {
							PrcHeaderFk: selectedHeader.PrcHeaderFk,
							PackageFk: selectedHeader.PackageFk,
							BasCurrencyFk: options && options.prcBoqDefaultValue ? options.prcBoqDefaultValue.BasCurrencyFk : null,
							Reference: options && options.prcBoqDefaultValue ? options.prcBoqDefaultValue.ReferenceNo : getNextReference(),
							OutlineDescription: options && options.prcBoqDefaultValue ? options.prcBoqDefaultValue.OutlineDescription : null,
							CurrentlyLoadedItemsCallbackFn: service.getList,
							PrcCopyModeFk: selectedHeader.PrcCopyModeFk,
							headerId: selectedHeader.Id,
							ConReqHasWicBoq: conReqHasWicBoq,
							BoqWicCatFk: conReqHasWicBoq ? selectedHeader.BoqWicCatFk : null,
							BoqWicCatBoqFk: boqWicCatBoqFk,
							WicBoqReference: wicBoqReference
						};

						if (options) {
							angular.extend(defaultOptions, options);
						}

						platformModalService.showDialog({
							width:'750px',
							resolve: {
								controllerOptions: function () {
									return {
										defaults: defaultOptions
									};
								}
							},
							controller: controllerName,
							templateUrl: globals.appBaseUrl + templateUrl,
							backdrop: false
						}).then(function (result) {
							if (result) {
								var params = {};
								params.Reference = result.BoqRootItem.Reference;
								params.BriefInfo = result.BoqRootItem.BriefInfo;
								params.PackageFk = result.PrcBoq.PackageFk;
								params.BasCurrencyFk = result.PrcBoq.BasCurrencyFk;
								params.BoqItemPrjBoqFk = result.BoqRootItem.BoqItemPrjBoqFk;
								params.BoqItemPrjItemFk = result.BoqRootItem.BoqItemPrjItemFk;
								params.PrcHeaderFkOriginal = result.PrcHeaderFkOriginal;
								params.takeOverOption = result.takeOverOption;
								params.BoqHeaderId = result.BoqRootItem.BoqHeaderFk;
								params.WicGroupId = result.wicGroupFk;
								params.BoqSource = result.boqSource;
								params.WicBoqId = result.wicBoqFk;
								params.SubPackageId = result.Package2HeaderFk;
								defer.resolve(params);
							}else{
								defer.reject('User canceled');
							}
						});
					}

					function getEntityCreatingStatus() {
						return isCreating;
					}


					function getIsCalculateOverGross() {
						var isOverGross = false;
						var loginCompanyFk = platformContextService.clientId;

						if (loginCompanyFk) {
							var companies = basicsLookupdataLookupDescriptorService.getData('Company');
							var company = _.find(companies, {Id: loginCompanyFk});
							if (company) {
								isOverGross = company.IsCalculateOverGross;
							}
						}
						return isOverGross;
					}

					function isAutoCreatePackageByModule() {
						var moduleName = moduleContext.getMainService().name;
						var isAuto = false;
						switch (moduleName) {
							case 'procurement.requisition':
							case 'procurement.contract':
								isAuto = true;
								break;
						}
						return isAuto;
					}

					function hasWicBoqInConOrReq(selectedHeader) {
						if (isContract) {
							return parentService.hasWicBoqInConHeader(selectedHeader);
						}
						else if (isReq) {
							return parentService.hasWicBoqInReqHeader(selectedHeader);
						}
						return false;
					}

					function loadList() {
						var list = service.getList();
						if (list && list.length) {
							service.load();
						}
					}
					function updateBoq(idInfo) {
						if (!idInfo) {
							return;
						}
						const updateData = platformDataServiceModificationTrackingExtension.getModifications(service);
						const prcHeaderId = updateData.PrcBoqExtended?.PrcBoq?.PrcHeaderFk ?? null;
						// to keep the boq to save consists of the root item
						if (prcHeaderId && idInfo.mainItemPrcHeaderIds?.some(e => e === prcHeaderId)) {
							service.update();
						}
					}
				}

				return procurementCommonDataServiceFactory.createService(constructorFn, 'procurementCommonPrcBoqService');
			}
		]);
})();
