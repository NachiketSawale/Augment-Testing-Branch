/**
 * Created by bh on 16.12.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name prcBoqMainService
	 * @function
	 *
	 * @description
	 * prcBoqMainMainService is the data service for all main related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('prcBoqMainService', ['boqMainServiceFactory', 'boqMainCrbService', 'procurementContextService', 'platformDataServiceSelectionExtension',
		'platformDataServiceDataProcessorExtension', 'platformDataServiceActionExtension', 'procurementCommonDataServiceFactory',
		'cloudCommonGridService', 'platformModuleStateService', 'platformDataServiceModificationTrackingExtension', '_', 'prcCommonBoqMainReadonlyProcessor',
		'$injector', 'boqMainCommonService', 'prcCommonCalculationHelper', 'platformRuntimeDataService', 'platformDataValidationService', '$translate',
		'PlatformMessenger', '$http', '$q',
		function (boqMainServiceFactory, boqMainCrbService, moduleContext, platformDataServiceSelectionExtension,
			platformDataServiceDataProcessorExtension, platformDataServiceActionExtension, procurementCommonDataServiceFactory,
			cloudCommonGridService, platformModuleStateService, platformDataServiceModificationTrackingExtension, _, prcCommonBoqMainReadonlyProcessor, $injector,
			boqMainCommonService, prcCommonCalculationHelper, platformRuntimeDataService, platformDataValidationService, $translate, PlatformMessenger, $http, $q) {

			// The instance of the main service - to be filled with functionality below

			function constructorFn(parentService, enhanceFun) {
				var service = {};
				var mainService = moduleContext.getMainService();
				var moduleName = mainService.name;
				var leadingService = moduleContext.getLeadingService();
				var leadingServiceModuleName = leadingService.getModule().name;
				var systemOptionDeleteCorrespondingPackageBoqItem = -1;
				var serviceContainer;

				var option = {
					maintainHeaderInfo: false,
					parent: parentService,
					incorporateDataRead: function incorporateDataRead(readItems, data) {
						boqMainCrbService.isUsingFullLicence(service, readItems.IsUsingCrbFullLicence);

						if(service.isOenBoq()) {
							var boqMainOenLvHeaderLookupService = $injector.get('boqMainOenLvHeaderLookupService');
							boqMainOenLvHeaderLookupService.setFilter(service.getSelectedHeaderFk());
							boqMainOenLvHeaderLookupService.loadLookupData(data);
						}

						service.loadBoqDynamicColumns(readItems);

						// Select the projectId first before processing the below data.
						var currentMainItem = moduleContext.getLeadingService().getSelected();
						service.setSelectedProjectId(currentMainItem ? currentMainItem.ProjectFk : null);

						// don't update when loading data
						serviceContainer.data.supportUpdateOnSelectionChanging = false;
						var items = serviceContainer.data.handleReadSucceeded(readItems.dtos, data, true);
						serviceContainer.data.supportUpdateOnSelectionChanging = true;
						var list = service.getList(); // Delivers a flat list if there is a underlying hierachical tree
						loadPrcBoqMainSystemOptions();

						if (moduleName === 'procurement.contract') {
							readOnlyCallOffItem(parentService);
						}
						if (_.isArray(list) && list.length > 0) {

							angular.forEach(list, function (boqItem) {
								if (moduleName === 'procurement.pes.boq') {
									service.initInstalledValues(boqItem);
									service.calcPreviousPrice(boqItem);
								}

								if (moduleName === 'procurement.quote.requisition' || moduleName === 'procurement.quote' || moduleName === 'procurement.pricecomparison.quote.requisition' || moduleName === 'procurement.pricecomparison.quote' || moduleName === 'procurement.pes.boq') {
									// if (boqItem.BoqLineTypeFk == 0) {
									prcCommonBoqMainReadonlyProcessor.processItem(boqItem, data);
									// }
								}
							});

							if (list.length === 1) {
								if (service.selectItemAfterReadData) {
									service.setSelected(list[0]);
								}
							}
						}

						if (service.selectItemAfterReadData) {
							// don't update when loading data
							serviceContainer.data.supportUpdateOnSelectionChanging = false;
							service.goToFirst();
							serviceContainer.data.supportUpdateOnSelectionChanging = true;
						}

						if (moduleName === 'procurement.quote.requisition') {
							service.setReqBoqItemsReferenceNos(readItems.ReqBoqItemsReferenceNos);
						}

						if (leadingServiceModuleName === 'procurement.package' ||
							leadingServiceModuleName === 'procurement.requisition' ||
							leadingServiceModuleName === 'procurement.quote' ||
							leadingServiceModuleName === 'procurement.pes') {
							let boqHeaderId = null;
							_.forEach(items, function (item) {
								item.IsContracted = false;
								if (!boqHeaderId) {
									boqHeaderId = item.BoqHeaderFk;
								}
							});

							// Set value to field Contracted in other PKG
							if (boqHeaderId) {
								let promises = [$q.when(null), $q.when(null)];
								if (leadingServiceModuleName === 'procurement.package' ||
									leadingServiceModuleName === 'procurement.requisition' ||
									leadingServiceModuleName === 'procurement.quote') {
									promises[0] = $http.post(globals.webApiBaseUrl + 'procurement/common/boq/getboqitemidsiscontracted', {
										BoqHeaderId: boqHeaderId,
										ModuleName: leadingServiceModuleName
									});
								}

								if (leadingServiceModuleName === 'procurement.pes' && parentService.getSelected()) {
									let parentSelect = parentService.getSelected();
									let conHeaderFk = parentSelect.ConHeaderFk;
									let pesBoqHeaderFk = parentSelect.BoqHeaderFk;
									promises[1] = $http.get(globals.webApiBaseUrl + 'procurement/pes/boq/getboqitemidspricechanged?contractId=' + conHeaderFk + '&pesBoqHeaderId=' + pesBoqHeaderFk);
								}

								$q.all(promises).then(function (responses) {
									let isContractedResponse = responses[0];
									let isPriceChangedResponse = responses[1];
									let isNeedToRefresh = false;
									let flatList = [];
									cloudCommonGridService.flatten(items, flatList, 'BoqItems');
									if (isContractedResponse && angular.isArray(isContractedResponse.data) && isContractedResponse.data.length !== 0) {
										let contractedItemIds = isContractedResponse.data;
										_.forEach(flatList, function (item) {
											let found = _.find(contractedItemIds, {Id: item.Id, PKey1: item.BoqHeaderFk});
											if (found) {
												item.IsContracted = true;
												isNeedToRefresh = true;
											}
										});
									}

									if (isPriceChangedResponse && isPriceChangedResponse.data) {
										let priceChangedInfo = isPriceChangedResponse.data;
										_.forEach(flatList, function (item) {
											let curChangedInfo = priceChangedInfo[item.Id];
											if (!curChangedInfo) {
												return;
											}
											item.IsPriceChanged = curChangedInfo.IsPriceChanged;
											item.IsPriceOcChanged = curChangedInfo.IsPriceOcChanged;
											isNeedToRefresh = true;
										});
									}

									if (isNeedToRefresh) {
										service.gridRefresh();
									}
								});
							}
						}
						return items;
					},

					handleCreateSucceeded: function (boqItem) {
						if (moduleName === 'procurement.pes.boq') {
							service.initInstalledValues(boqItem);
							service.calcPreviousPrice(boqItem);
						}
						if (moduleName === 'procurement.quote.requisition') {
							// eslint-disable-next-line no-unused-vars
							var validateResult = validateReferenceOnCreate(boqItem);
						}

						let _dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
						if (_dynamicUserDefinedColumnsService && angular.isFunction(_dynamicUserDefinedColumnsService.attachEmptyDataToColumn)) {
							_dynamicUserDefinedColumnsService.attachEmptyDataToColumn(boqItem);
						}
					},

					serviceName: (function () {
						var name;

						switch (moduleContext.getModuleName()) {
							case 'procurement.contract':
								name = 'procurementContractBoqItemService';
								break;
							case 'procurement.invoice':
								name = 'procurementInvoiceBoqItemService';
								break;
							case 'procurement.package':
								name = 'procurementPackageBoqItemService';
								break;
							case 'procurement.pes':
								name = 'procurementPesBoqItemService';
								break;
							case 'procurement.quote':
								name = 'procurementQuoteBoqItemService';
								break;
							case 'procurement.requisition':
								name = 'procurementRequisitionBoqItemService';
								break;
						}

						return name;
					})(),

					filterByViewer: {
						additionalData: {
							modelBoqFilterMode: 'prc'
						}
					},

					moduleContext: {
						moduleName: moduleContext.getModuleName()
					},

					syncBaseBoqOptions: {
						syncQuantity: (moduleContext.getModuleName() !== 'procurement.pes') && (moduleContext.getModuleName() !== 'procurement.quote')
					},

					isReferenceValidForThisItem: function (referenceNo, internalErrorMessage) {
						var result = true;
						if (moduleName === 'procurement.quote.requisition') {
							result = valiateReqReferenceNo(referenceNo);
							if (!result) {
								internalErrorMessage.errorMessage = $translate.instant('procurement.common.referenceNotMatch');
							}
						}
						return result;
					},

					creationDataProcessor: function (boqItem) {
						if (moduleName === 'procurement.quote.requisition') {
							var result = valiateReqReferenceNo(boqItem.refCode);
							if (!result) {
								boqItem.DoSave = false;
							}
						}
					}
				};
				// noinspection JSCheckFunctionSignatures
				serviceContainer = boqMainServiceFactory.createNewBoqMainService(option);
				service = serviceContainer.service;
				serviceContainer.data.doNotLoadOnSelectionChange = true;
				serviceContainer.data.forceChildServiceUnload = true;
				serviceContainer.data.usesCache = true;
				service.selectItemAfterReadData = false;

				function readOnlyCallOffItem(parentService) {
					var mainService = moduleContext.getMainService();
					var moduleName = mainService.name;
					if (moduleName !== 'procurement.contract') {
						return;
					}
					var procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
					procurementCommonPrcBoqService = procurementCommonPrcBoqService.getService(moduleContext.getMainService(), service);
					var currentMainItem = procurementCommonPrcBoqService.getSelected();
					if (!currentMainItem || (currentMainItem && !currentMainItem.BoqRootItem)) {
						return;
					}
					var boqItems = service.getList();
					var parentSelect = parentService.getSelected();
					if(parentSelect) {
						var conHeaderFk = parentSelect.ConHeaderFk;
						if (conHeaderFk) {
							angular.forEach(boqItems, function (item) {
								platformRuntimeDataService.readonly(item, {field: 'DeliveryDate', readonly: false});
							});
							var $http = $injector.get('$http');
							$http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboqitemsbyconheaderid?conHeaderId=' + conHeaderFk).then(function (response) {
								if (response && response.data) {
									angular.forEach(boqItems, function (item) {
										var boqMainItem = _.find(response.data, function (o) {
											return o.Reference === item.Reference;
										});
										if (boqMainItem) {
											platformRuntimeDataService.readonly(item, {field: 'Price', readonly: true});
											platformRuntimeDataService.readonly(item, {field: 'PriceOc', readonly: true});
											platformRuntimeDataService.readonly(item, {field: 'Correction', readonly: true});
											platformRuntimeDataService.readonly(item, {field: 'CorrectionOc', readonly: true});
										}
									});
								}
							});
						}
					}
				}

				/**
				 * @ngdoc function
				 * @name setActivateEstIndicator
				 * @function
				 * @methodOf calItemBudgetDiff
				 * @description set activate estimate indicator from system option
				 */
				function loadPrcBoqMainSystemOptions() {

					if (_.isBoolean(systemOptionDeleteCorrespondingPackageBoqItem)) {
						return; // Option has already been loaded
					}

					var basicCustomizeSystemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
					if (basicCustomizeSystemoptionLookupDataService) {
						var systemOptions = basicCustomizeSystemoptionLookupDataService.getList();
						if (systemOptions && systemOptions.length > 0) {
							var items = _.filter(systemOptions, function (systemOption) {
								// Return fitting system option for deletion flag of package boq items
								if (systemOption.Id === 824) {
									return systemOption;
								}
							});

							if (items && items.length > 0) {
								systemOptionDeleteCorrespondingPackageBoqItem = !!(items[0].ParameterValue && (items[0].ParameterValue.toLowerCase() === 'true' || items[0].ParameterValue === '1'));
							}
						}
					}
				}

				// Make container boq structure container UUID accessible to the prc boq main serivce (cuzrrently helpful to handle readonly status of boq related containers via restriction of permissions)
				// Todo BH: It would be great to somehow be able to have direct access to the definition of the container UUID instead of using it here directly.
				switch (moduleContext.getModuleName()) {
					case 'procurement.contract':
						service.setContainerUUID('DC5C6ADCDC2346E09ADADBF5508842DE');
						break;
					case 'procurement.invoice':
						service.setContainerUUID('DC5C6ADCDC2346E09ADADBF5508842DE');
						break;
					case 'procurement.package':
						service.setContainerUUID('29633DBCE00E41C4B494F867D7699EA5');
						service.handleDeleteMultiSelection = handleDeleteMultiSelectionInPackage;
						break;
					case 'procurement.pes':
						service.setContainerUUID('F52BE674B318460DA047748DF4F07BEC');
						break;
					case 'procurement.quote':
						service.setContainerUUID('58D71F3079C9450D9723FC7194E433C2');
						break;
					case 'procurement.requisition':
						service.setContainerUUID('58F71F3079C9450D9723FC7194E433C2');
						service.handleDeleteMultiSelection = handleDeleteMultiSelection;
						break;
				}

				function handleDeleteMultiSelectionInPackage(preparedBoqItems, preparedBoqItemsWithChildren) {
					var firstItemWithBaseBoqReference = null;
					var baseBoqHeaderId = 0;
					var baseBoqItemIds = [];
					var platformModalService = $injector.get('platformModalService');
					var $q = $injector.get('$q');
					var $http = $injector.get('$http');
					var versionBoqReferencesPromise = $q.when({});
					var askUserDeferred = $q.defer();
					var multipleVersionBoqItems = false;

					if (_.isArray(preparedBoqItemsWithChildren) && preparedBoqItemsWithChildren.length > 0) {
						// Extract the base boq item ids into an array
						firstItemWithBaseBoqReference = _.find(preparedBoqItemsWithChildren, function (item) {
							return _.isNumber(item.BoqHeaderFk) && item.BoqHeaderFk > 0;
						});
						baseBoqHeaderId = _.isObject(firstItemWithBaseBoqReference) ? firstItemWithBaseBoqReference.BoqHeaderFk : 0;
						baseBoqItemIds = _.map(preparedBoqItemsWithChildren, 'Id').filter(function (baseBoqItemId) {
							return _.isNumber(baseBoqItemId) && baseBoqItemId > 0;
						});

						if (baseBoqHeaderId > 0 && baseBoqItemIds.length > 0) {
							versionBoqReferencesPromise = $http.post(globals.webApiBaseUrl + 'boq/main/getversionboqreferencesofgivenbaseboqitems?baseboqheaderid=' + baseBoqHeaderId + '&determineVersionBoqTypes=true', baseBoqItemIds).then(function (response) {
								return _.isObject(response) ? response.data : null;
							});
						}

						versionBoqReferencesPromise.then(function (versionBoqReferences) {

							if (_.isObject(versionBoqReferences) && !_.isEmpty(versionBoqReferences)) {
								// If there is only one version boq item per related base boq item ask the user if he also wants the related base boq item to be deleted.
								multipleVersionBoqItems = _.find(preparedBoqItemsWithChildren, function (boqItem) {
									var myVersionBoqReferences = versionBoqReferences[boqItem.Id.toString()];
									var onlyRequisitionBoqs = false;
									var boqMainBoqTypes = $injector.get('boqMainBoqTypes');
									if (_.isArray(myVersionBoqReferences) && myVersionBoqReferences.length > 0) {
										onlyRequisitionBoqs = !_.isObject(_.find(myVersionBoqReferences, function (item) {
											/* jshint -W106 */ // many parameters because of dependency injection
											return item.Item3 !== boqMainBoqTypes.requisition || (_.isBoolean(item.Item4) && item.Item4);
										}));

										return !onlyRequisitionBoqs || myVersionBoqReferences.length > 1;
									} else {
										return false;
									}
								});

								if (!multipleVersionBoqItems) {
									platformModalService.showYesNoDialog('procurement.common.askForDeletionOfRequisitionBoqItem', 'procurement.common.deleteRequisitionBoqItem', 'yes').then(function (modalResult) {
										if (modalResult.yes) {
											// Configure item to also have the corresponding base boq item deleted too
											angular.forEach(preparedBoqItems, function (boqItem) {
												var myVersionBoqReferences = versionBoqReferences[boqItem.Id.toString()];

												if (_.isArray(myVersionBoqReferences) && myVersionBoqReferences.length === 1) {
													boqItem.VersionBoqItemToBeDeleted = myVersionBoqReferences[0];
												}
											});

											askUserDeferred.resolve(true);
										} else {
											askUserDeferred.resolve(false);
										}
									});
								} else {
									platformModalService.showMsgBox('procurement.common.cannotDeletePackageBoqItemsDueToVersionBoqItems', 'procurement.common.deletePackageBoqItemAndVersionBoqItems', 'ico-info').then(function () {
										askUserDeferred.resolve(false);
									});
								}
							} else {
								askUserDeferred.resolve(true);
							}
						});
					}

					return askUserDeferred.promise;
				}

				function handleDeleteMultiSelection(preparedBoqItems, preparedBoqItemsWithChildren) {
					var firstItemWithBaseBoqReference = null;
					var baseBoqHeaderId = 0;
					var baseBoqItemIds = [];
					var platformModalService = $injector.get('platformModalService');
					var $q = $injector.get('$q');
					var $http = $injector.get('$http');
					var versionBoqReferencesPromise = $q.when({});
					var askUserDeferred = $q.defer();
					var multipleVersionBoqItems = false;

					if (!systemOptionDeleteCorrespondingPackageBoqItem) {
						return $q.when(true);
					}

					if (_.isArray(preparedBoqItemsWithChildren) && preparedBoqItemsWithChildren.length > 0) {
						// Extract the base boq item ids into an array
						firstItemWithBaseBoqReference = _.find(preparedBoqItemsWithChildren, function (item) {
							return _.isNumber(item.BoqItemPrjBoqFk) && item.BoqItemPrjBoqFk > 0;
						});
						baseBoqHeaderId = _.isObject(firstItemWithBaseBoqReference) ? firstItemWithBaseBoqReference.BoqItemPrjBoqFk : 0;
						baseBoqItemIds = _.map(preparedBoqItemsWithChildren, 'BoqItemPrjItemFk').filter(function (baseBoqItemId) {
							return _.isNumber(baseBoqItemId) && baseBoqItemId > 0;
						});

						if (baseBoqHeaderId > 0 && baseBoqItemIds.length > 0) {
							versionBoqReferencesPromise = $http.post(globals.webApiBaseUrl + 'boq/main/getversionboqreferencesofgivenbaseboqitems?baseboqheaderid=' + baseBoqHeaderId + '&determineVersionBoqTypes=false', baseBoqItemIds).then(function (response) {
								return _.isObject(response) ? response.data : null;
							});
						}

						versionBoqReferencesPromise.then(function (versionBoqReferences) {

							if (_.isObject(versionBoqReferences) && !_.isEmpty(versionBoqReferences)) {
								// If there is only one version boq item per related base boq item ask the user if he also wants the related base boq item to be deleted.
								multipleVersionBoqItems = _.find(preparedBoqItemsWithChildren, function (boqItem) {
									var myVersionBoqReferences = versionBoqReferences[boqItem.BoqItemPrjItemFk.toString()];
									return _.isArray(myVersionBoqReferences) ? myVersionBoqReferences.length > 1 : false;
								});

								if (!multipleVersionBoqItems) {
									platformModalService.showYesNoDialog('procurement.common.askForDeletionOfPackageBoqItem', 'procurement.common.deletePackageBoqItem', 'yes').then(function (modalResult) {
										if (modalResult.yes) {
											// Configure item to also have the corresponding base boq item deleted too
											angular.forEach(preparedBoqItems, function (boqItem) {
												var myVersionBoqReferences = versionBoqReferences[boqItem.BoqItemPrjItemFk.toString()];

												if (_.isArray(myVersionBoqReferences) && myVersionBoqReferences.length === 1) {
													boqItem.DeleteCorrespondingBaseBoqItem = true;
												}
											});
										}

										askUserDeferred.resolve();
									});
								} else {
									platformModalService.showMsgBox('procurement.common.cannotDeletePackageBoqItem', 'procurement.common.deletePackageBoqItem', 'ico-info').then(function () {
										askUserDeferred.resolve();
									});
								}
							} else {
								askUserDeferred.resolve();
							}
						});
					}

					return askUserDeferred.promise;
				}

				// remove create and delete method when module is readonly
				if (moduleContext.getModuleReadOnly()) {
					service.createItem = null;
					service.deleteItem = null;
					service.setReadOnly(true); // Currently only avoids changes by Copy and Paste or Drag&Drop
				}

				var headerSelectionChanged = function headerSelectionChanged() {
					service.clear();
				};
				parentService.registerSelectionChanged(headerSelectionChanged);

				service.assertTypeEntries = function doAssertPrcBoqMainTypeEntries(modStorage) {
					modStorage.PrcBoqCompleteToSave = _.isObject(modStorage.PrcBoqCompleteToSave) ? modStorage.PrcBoqCompleteToSave : {};
					if (!modStorage.PrcBoqCompleteToSave.BoqItemCompleteToSave) {
						modStorage.PrcBoqCompleteToSave.BoqItemCompleteToSave = [];
					}
					if (!modStorage.PrcBoqCompleteToSave.BoqItemCompleteToDelete) {
						modStorage.PrcBoqCompleteToSave.BoqItemCompleteToDelete = [];
					}

					return modStorage.PrcBoqCompleteToSave.BoqItemCompleteToSave;
				};

				service.assertSelectedEntityEntry = function doAssertSelectedPrcBoqMainEntityEntry(modStorage) {
					var toInsert = null;
					var data = serviceContainer.data;
					var container = service.assertTypeEntries(modStorage);
					if (data.selectedItem && data.selectedItem.Id) {
						service.assertTypeEntries(modStorage);
						toInsert = {Id: data.selectedItem.Id};
						var entry = _.find(container, toInsert);
						if (!entry) {
							toInsert.MainItemId = data.selectedItem.Id;
							container.push(toInsert);
						} else {
							toInsert = entry;
							toInsert.MainItemId = data.selectedItem.Id;
						}
					}

					return toInsert;
				};

				service.addEntityToModified = function doAddPrcBoqMainEntityToModified(elemState, entity, modState) {

					// Check if there is already an entry for this  entity
					var updateData = _.find(elemState.PrcBoqCompleteToSave.BoqItemCompleteToSave, {Id: entity.Id}); // If it is not in already we got null. Not null is true then we add

					var add = false;
					if (angular.isUndefined(updateData) || updateData === null) {
						// No entry for this entity -> create a new one.
						updateData = {Id: entity.Id, BoqItem: entity, EntitiesCount: 1};
						add = true;
					} else {
						// A sub entity may already have created an entry for the boq item but the BoqItem is missing
						if (angular.isUndefined(updateData.BoqItem) || (updateData.BoqItem === null)) {
							updateData.BoqItem = entity;
						}
					}

					// Provide further data to be updated
					serviceContainer.data.provideUpdateData(updateData);

					// Add new entry if it was missing.
					if (add) {
						elemState.PrcBoqCompleteToSave.BoqItemCompleteToSave.push(updateData);
						modState.EntitiesCount += updateData.EntitiesCount;
					}
				};

				service.addEntityToDeleted = function doAddPrcBoqMainEntityToDeleted(elemState, entity, data, modState) {

					// Check if there is already an entry for this entity
					var updateData = _.find(elemState.PrcBoqCompleteToSave.BoqItemCompleteToDelete, {Id: entity.Id}); // If it is not in already we got null. Not null is true then we add

					var add = false;
					if (angular.isUndefined(updateData) || updateData === null) {
						// No entry for this entity -> create a new one.
						updateData = {Id: entity.Id, BoqItem: entity, EntitiesCount: 1};
						add = true;
					} else {
						// A sub entity may already have created an entry for the boq item but the BoqItem is missing
						if (angular.isUndefined(updateData.BoqItem) || (updateData.BoqItem === null)) {
							updateData.BoqItem = entity;
						}
					}

					serviceContainer.data.provideUpdateData(updateData);

					if (add) {
						elemState.PrcBoqCompleteToSave.BoqItemCompleteToDelete.push(updateData);
						modState.EntitiesCount += updateData.EntitiesCount;
					}
				};

				service.addEntitiesToDeleted = function doAddPrcBoqMainEntitiesToDeleted(elemState, entities, data, modState) {

					// Check if there is already an entry for this entity
					var updateData = null;
					var add = false;

					_.forEach(entities, function (entity) {
						updateData = _.find(elemState.PrcBoqCompleteToSave.BoqItemCompleteToDelete, {Id: entity.Id}); // If it is not in already we got null. Not null is true then we add
						add = false;
						if (angular.isUndefined(updateData) || updateData === null) {
							// No entry for this entity -> create a new one.
							updateData = {Id: entity.Id, BoqItem: entity, EntitiesCount: 1};
							add = true;
						} else {
							// A sub entity may already have created an entry for the boq item but the BoqItem is missing
							if (angular.isUndefined(updateData.BoqItem) || (updateData.BoqItem === null)) {
								updateData.BoqItem = entity;
							}
						}

						serviceContainer.data.provideUpdateData(updateData);

						if (add) {
							elemState.PrcBoqCompleteToSave.BoqItemCompleteToDelete.push(updateData);
							modState.EntitiesCount += updateData.EntitiesCount;
						}
					});
				};

				serviceContainer.data.canCreateBoqItemSpecific = function prcBpqMainCanCreateBoqItemSpecific(/* selectedBoqItem, boqLineType, level */) {
					// Check if the leading service handles the IsFreeItemsAllowed flag and the IsProtected flag and return accordingly.
					var leadingService = moduleContext.getLeadingService();
					var canCreateSpecific = true;  // As default we have no specific check so we allow creation.
					var isProtected = false;
					var isFreeItemsAllowed = true;

					if (leadingService) {

						if (_.isFunction(leadingService.getIsFreeItemsAllowed)) {
							isFreeItemsAllowed = leadingService.getIsFreeItemsAllowed();
						}

						if (_.isFunction(leadingService.getIsProtected)) {
							isProtected = leadingService.getIsProtected();
						}
						canCreateSpecific = !isProtected || isFreeItemsAllowed;
					}

					return canCreateSpecific;
				};

				function modificationsAsArray(input) {
					var entities;
					if (_.isArray(input)) {
						entities = input;
					} else {
						entities = [input];
					}

					return entities;
				}

				// noinspection JSUnusedLocalSymbols
				serviceContainer.data.doClearModifications = function doClearModificationsInNode(entity) { // jshint ignore: line

					var entities = modificationsAsArray(entity);
					entity = null;

					var modState = platformModuleStateService.state(service.getModule());
					var parentState = platformDataServiceModificationTrackingExtension.tryGetPath(modState.modifications, moduleContext.getMainService());

					_.forEach(entities, function (entity) {
						if (parentState && entity && parentState.PrcBoqCompleteToSave && parentState.PrcBoqCompleteToSave.BoqItemCompleteToSave) {
							if (_.find(parentState.PrcBoqCompleteToSave.BoqItemCompleteToSave, {Id: entity.Id})) {
								parentState.PrcBoqCompleteToSave.BoqItemCompleteToSave = _.filter(parentState.PrcBoqCompleteToSave.BoqItemCompleteToSave, function (item) {
									return item.Id !== entity.Id;
								});
								modState.modifications.EntitiesCount -= 1;
							}
						}
					});
				};

				service.triggerUpdate = function triggerUpdate() {
					var prcRootService = parentService.parentService ? parentService.parentService() : parentService;
					prcRootService.update();
				};

				/**
				 * @function calcPreviousPrice
				 * Calculates the previous price of a PES BOQ item
				 * @param boqItem
				 */
				service.calcPreviousPrice = function calcPreviousPrice(boqItem) {
					if (Object.prototype.hasOwnProperty.call(boqItem,'PrevQuantity')) {
						boqItem.PreviousPrice = (boqItem.PrevQuantity * boqItem.Price) * (1 - boqItem.DiscountPercent / 100);
					}
				};

				service.registerEntityCreated(function (e, args) {

					var selectedMainItem = mainService.getSelected();
					var mainItemTaxCode = null;
					var taxCodeChanged = false;

					if (moduleName === 'procurement.quote.requisition' || moduleName === 'procurement.quote' || moduleName === 'procurement.pricecomparison.quote.requisition' || moduleName === 'procurement.pricecomparison.quote' || moduleName === 'procurement.pes.boq') {
						if (args.BoqLineTypeFk === 0 && !service.hasItemBeenSavedYet(args)) {
							args.IsFreeQuantity = true;
						}
						prcCommonBoqMainReadonlyProcessor.processItem(args, service);
					}

					if (moduleName === 'procurement.package' || moduleName === 'procurement.requisition' || moduleName === 'procurement.contract') {
						if (_.isObject(selectedMainItem) && _.isNumber(selectedMainItem.TaxCodeFk) && _.isObject(args) && _.isNumber(args.BoqHeaderFk) && args.BoqHeaderFk > 0) {
							mainItemTaxCode = selectedMainItem.TaxCodeFk;
						}
					} else if (moduleName === 'procurement.quote.requisition') {
						if (_.isObject(selectedMainItem) && _.isObject(selectedMainItem.ReqHeaderEntity) && _.isNumber(selectedMainItem.ReqHeaderEntity.TaxCodeFk) && _.isObject(args) && _.isNumber(args.BoqHeaderFk) && args.BoqHeaderFk > 0) {
							mainItemTaxCode = selectedMainItem.ReqHeaderEntity.TaxCodeFk;
						}
					}

					if (!_.isNumber(args.MdcTaxCodeFk)) {
						taxCodeChanged = args.MdcTaxCodeFk !== mainItemTaxCode;
						args.MdcTaxCodeFk = mainItemTaxCode;

						if (taxCodeChanged) {
							service.calcItemsPriceHoursNew(args, true);
						}
					}

				});

				// parentService.registerUpdateDone(onUpdateDone);//Frank, 2015-06-12: This will not work any longer. How to fix will be discussed next Monday
				// //////////////////////end do update interceptor//////////////////

				// eslint-disable-next-line no-unused-vars
				var onUpdateDone = function onUpdateDone(response) {
					readOnlyCallOffItem(parentService);
				};

				if (leadingServiceModuleName === 'procurement.pes') {
					leadingService.onUpdateSucceeded.register(onPesUpdateDone);
				}
				else {
					parentService.registerUpdateDone(onUpdateDone);
				}

				/** @namespace parentService.enhanceBoqFun */
				enhanceFun = enhanceFun || parentService.enhanceBoqFun;
				if (angular.isFunction(enhanceFun)) {
					enhanceFun(parentService, serviceContainer.service, serviceContainer.data);
				} else {
					var mergeInUpdateDataBack = serviceContainer.service.mergeInUpdateData;
					serviceContainer.service.mergeInUpdateData = function mergeInUpdateData(updateData) {
						if (updateData.PrcBoqCompleteToSave && updateData.PrcBoqCompleteToSave.BoqItemCompleteToSave) {
							if (!updateData[serviceContainer.data.itemName + 'ToSave']) {
								updateData[serviceContainer.data.itemName + 'ToSave'] = updateData.PrcBoqCompleteToSave.BoqItemCompleteToSave;
							}
							if (!updateData[serviceContainer.data.itemName + 'ToDelete']) {
								updateData[serviceContainer.data.itemName + 'ToDelete'] = updateData.PrcBoqCompleteToSave.BoqItemCompleteToDelete;
							}
						}

						mergeInUpdateDataBack(updateData);
						_.forEach(updateData[serviceContainer.data.itemName + 'ToSave'], function (boqItem) {
							service.syncItemsAfterUpdate(boqItem);
						});
						_.forEach(updateData[serviceContainer.data.itemName + 'ToDelete'], function (boqItem) {
							service.syncItemsAfterUpdate(boqItem);
						});
						serviceContainer.service.gridRefresh();
					};
				}

				service.onPostClopBoardSuccess = function onPostClopBoardSuccess() {
					var leadingService = moduleContext.getLeadingService();
					leadingService.markCurrentItemAsModified();
				};

				service.recalculateTotalsForHeader = function recalculateTotalsForHeader() {
					var moduleName = moduleContext.getModuleName();
					var leadingService = moduleContext.getLeadingService();
					var header = leadingService.getSelected();
					if (header) {
						var headerId = header.Id;
						var $http = $injector.get('$http');
						var url = globals.webApiBaseUrl + 'procurement/common/headertotals/recalculate';
						url += '?headerId=' + headerId;
						url += '&moduleName=' + moduleName;
						return $http.get(url).then(function (response) {
							var result = _.isObject(response) ? response.data : false;
							if (result) {
								var procurementCommonTotalDataService = $injector.get('procurementCommonTotalDataService');
								var totalDataService = null;
								if (moduleName === 'procurement.quote') {
									// Quote has its own data service for the totals so call this explicitly
									totalDataService = $injector.get('procurementQuoteTotalDataService');
								} else {
									// In all other cases uses the generic service from procurement common.
									totalDataService = procurementCommonTotalDataService.getService(moduleContext.getMainService());
								}

								totalDataService.load();

								return service.load();
							}
							return result;
						});
					} else {
						var $q = $injector.get('$q');
						return $q.when(true);
					}

				};

				service.onImportSucceeded.register(service.recalculateTotalsForHeader);
				service.boqItemPriceChanged.register(boqItemPriceChanged);

				var entitiesForUpadteUc = [];

				function onControllingUnitChanged() {
					entitiesForUpadteUc = service.getList();
					if (entitiesForUpadteUc && entitiesForUpadteUc.length) {
						if(parentService.getModule().name === 'procurement.requisition' || parentService.getModule().name === 'procurement.contract'){
							parentService.hasItemsOrBoqs({boqitems: true});
						}else{
							parentService.parentService().hasItemsOrBoqs({boqitems: true});
						}
					}
				}

				function updateCuFromParent() {
					if (entitiesForUpadteUc && entitiesForUpadteUc.length) {
						var parenteSelected;
						if(parentService.getModule().name === 'procurement.requisition' || parentService.getModule().name === 'procurement.contract'){
							parenteSelected = parentService.getSelected();
						}else{
							parenteSelected = parentService.parentService().getSelected();
						}
						if (parenteSelected) {
							entitiesForUpadteUc.forEach(function (e) {
								e.MdcControllingUnitFk = parenteSelected.MdcControllingUnitFk ? parenteSelected.MdcControllingUnitFk : parenteSelected.ControllingUnitFk;
								service.markItemAsModified(e);
							});
						}
					}
					entitiesForUpadteUc = [];
				}

				function updateTXFromParent() {
					entitiesForUpadteUc = service.getList();
					var parenteSelected;
					if(parentService.getModule().name === 'procurement.contract'){
						parenteSelected = parentService.getSelected();
					}
					if (parenteSelected) {
						entitiesForUpadteUc.forEach(function (e) {
							e.MdcTaxCodeFk = parenteSelected.TaxCodeFk;
							service.markItemAsModified(e);
						});
					}
					entitiesForUpadteUc = [];
				}

				if (parentService.getModule().name === 'procurement.package' &&
					parentService.parentService().controllingUnitChanged &&
					parentService.parentService().controllingUnitToItemBoq
				) {
					if (parentService.parentService().controllingUnitChanged) {
						parentService.parentService().controllingUnitChanged.register(onControllingUnitChanged);
					}
					if (parentService.parentService().controllingUnitToItemBoq) {
						parentService.parentService().controllingUnitToItemBoq.register(updateCuFromParent);
					}
				}
				if ((parentService.getModule().name === 'procurement.requisition' || parentService.getModule().name === 'procurement.contract') &&
					parentService.controllingUnitChanged &&
					parentService.controllingUnitToItemBoq
				) {
					if (parentService.controllingUnitChanged) {
						parentService.controllingUnitChanged.register(onControllingUnitChanged);
					}
					if (parentService.controllingUnitToItemBoq) {
						parentService.controllingUnitToItemBoq.register(updateCuFromParent);
					}
				}

				if (parentService.getModule().name === 'procurement.contract' &&
					parentService.changeStructureSetTaxCodeToItemBoq
				) {
					parentService.changeStructureSetTaxCodeToItemBoq.register(updateTXFromParent);

				}

				if (parentService.getModule().name === 'procurement.quote') {
					var referenceNos = [];
					service.setReqBoqItemsReferenceNos = function (referNos) {
						referenceNos = referNos;
					};
					service.getReqBoqItemsReferenceNos = function () {
						return referenceNos;
					};
				}

				function validateReferenceOnCreate(entity) {
					// when the quote's rfq's configuration has the 'isFreeItemsAllowed' value is false.
					var validateResult = valiateReqReferenceNo(entity.Reference);
					if (!validateResult) {
						var validResult = {
							valid: false,
							apply: true,
							error: $translate.instant('procurement.common.referenceNotMatch'),
							error$tr$: $translate.instant('procurement.common.referenceNotMatch'),
							error$tr$param: {}
						};  // The entered reference number is not match the Requisition BoqItem's Reference number.
						platformRuntimeDataService.applyValidationResult(validResult, entity, 'Reference');
						platformDataValidationService.finishValidation(validResult, entity, entity.Reference, 'Reference', {}, service);
					}
					return validateResult;
				}

				function valiateReqReferenceNo(referenceNo) {
					var result = true;
					var isProtected = getIsProtectedQtn();
					var isFreeItemsAllowed = getIsFreeItemsAllowed();
					if (!isProtected) {
						return result;
					}
					if (!isFreeItemsAllowed) {
						var ReqReferenceNos = service.getReqBoqItemsReferenceNos();
						if (_.indexOf(ReqReferenceNos, referenceNo) === -1) {
							result = false;
						}
					}
					return result;
				}

				function getIsFreeItemsAllowed() {
					var isFreeItemAllowd = true;
					if (parentService.getModule().name === 'procurement.quote') {
						var leadingService = moduleContext.getLeadingService();
						isFreeItemAllowd = leadingService.getIsFreeItemsAllowed();
					}
					return isFreeItemAllowd;
				}

				function getIsProtectedQtn() {
					var isProtect = false;
					if (parentService.getModule().name === 'procurement.quote') {
						var leadingService = moduleContext.getLeadingService();
						isProtect = leadingService.getIsProtected();
					}
					return isProtect;
				}

				function boqItemPriceChanged(calcItem){
					if (parentService.getModule().name === 'procurement.pricecomparison'){
						if (calcItem.Price === 0){
							calcItem.NotSubmitted = true;
							platformRuntimeDataService.readonly(calcItem, [{field: 'NotSubmitted', readonly: true}]);
						}
						else {
							calcItem.NotSubmitted = false;
							platformRuntimeDataService.readonly(calcItem, [{field: 'NotSubmitted', readonly: false}]);
						}
					}
				}

				service.toolItems = null;
				service.setToolItems = function (toolItems) {
					service.toolItems = toolItems;
				};
				service.updateToolsEvent = new PlatformMessenger();
				service.onProcurementStructureChanged = new PlatformMessenger();

				service.disabledToolItemByConfig = function disabledToolItemByConfig() {
					var canItem = moduleContext.canAddDeleteItemByConfiguration(service);
					var canTools = ['boqNewByContext', 'boqInsert', 'boqNewDivision', 'boqNewSubdivision', 'delete', 'boqCut', 'boqCopy', 'boqPaste'];
					if (canItem === false && service.toolItems) {
						_.map(service.toolItems, function (item) {
							if (canTools.indexOf(item.id) > -1) {
								item.disabled = true;
							}
						});
						if (service.updateToolsEvent) {
							service.updateToolsEvent.fire();
						}
						return false;
					}
					return true;
				};
				var canCreateBoqItemRecord = service.canCreateBoqItem;
				service.canCreateBoqItem = function (selectedBoqItem, boqLineType, level, restrainErrorHandling, isCreatingSubDevision) {
					var canItem = service.disabledToolItemByConfig();
					if (canItem === false) {
						return false;
					}
					basicsLookupdataLookupFilterService.registerFilter(prcBoqFilters);
					return canCreateBoqItemRecord(selectedBoqItem, boqLineType, level, restrainErrorHandling, isCreatingSubDevision);
				};
				var canDeleteBoqItem = service.canDeleteBoqItem;
				service.canDeleteBoqItem = function (boqMainService, currentBoqItem) {
					var canItem = service.disabledToolItemByConfig();
					if (canItem === false) {
						return false;
					}
					return canDeleteBoqItem(boqMainService, currentBoqItem);
				};
				var canCreateDivisionBoqItemRecord = service.canCreateDivisionBoqItem;
				service.canCreateDivisionBoqItem = function (selectedBoqItem, isCreatingSubDevision, restrainErrorHandling) {
					var canItem = service.disabledToolItemByConfig();
					if (canItem === false) {
						return false;
					}
					return canCreateDivisionBoqItemRecord(selectedBoqItem, isCreatingSubDevision, restrainErrorHandling);
				};

				service.calcRemQuantity = function calcRemQuantity(boqItem) {
					if (_.isObject(boqItem) && _.has(boqItem, 'TotalQuantity') && boqMainCommonService.isItem(boqItem)) {
						boqItem.RemQuantity = boqItem.OrdQuantity - boqItem.TotalQuantity;
					}
				};

				var basicsLookupdataLookupFilterService = $injector.get('basicsLookupdataLookupFilterService');
				var prcBoqFilters = [{
					key: 'prc-boq-controlling-unit-filter',
					serverSide: true,
					serverKey: 'prc.boq.controllingunit.by.prj.filterkey',
					fn: function (dataItem) {
						return {
							ByStructure: true,
							ExtraFilter: true,
							PrjProjectFk: service.getSelectedProjectId(),
							CompanyFk: null
						};
					}
				}];
				return service;

				function onPesUpdateDone(result) {
					if (result && result.response && result.response.PesBoqToSave && result.response.PesBoqToSave.length > 0) {
						_.forEach(result.response.PesBoqToSave, function (complete) {
							if (!complete.BoqItemToSave || complete.BoqItemToSave.length === 0) {
								return;
							}
							let boqItemCompletes = _.filter(complete.BoqItemToSave, function (itemComplete) {
								return itemComplete.BoqItem !== null;
							});
							if (boqItemCompletes.length === 0) {
								return;
							}
							let boqItems = _.map(boqItemCompletes, function (itemComplete) {
								return itemComplete.BoqItem;
							});
							_.forEach(boqItems, function (item) {
								if (!complete.PriceChangedInfoMap) {
									item.IsPriceChanged = false;
									item.IsPriceOcChanged = false;
									return;
								}
								let priceChangedInfo = complete.PriceChangedInfoMap[item.Id];
								if (!priceChangedInfo) {
									item.IsPriceChanged = false;
									item.IsPriceOcChanged = false;
									return;
								}
								item.IsPriceChanged = priceChangedInfo.IsPriceChanged;
								item.IsPriceOcChanged = priceChangedInfo.IsPriceOcChanged;
							});
						});
					}
				}
			}

			return procurementCommonDataServiceFactory.createService(constructorFn, 'prcBoqMainService');
		}]);
})(angular);
