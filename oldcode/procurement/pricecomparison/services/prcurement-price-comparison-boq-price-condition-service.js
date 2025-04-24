/**
 * Created by boom on 9/12/2024.
 */

(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	// please see procurementCommonPriceConditionService
	angular.module(moduleName).factory('procurementPriceComparisonBoqPriceConditionService', [
		'_',
		'globals',
		'$q',
		'$http',
		'$translate',
		'$timeout',
		'platformDataServiceFactory',
		'platformModalService',
		'PlatformMessenger',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'platformDataValidationService',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonBoqHelperService',
		'procurementPriceComparisonCommonService',
		'platformModuleStateService',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonConfigurationService',
		'procurementPriceComparisonBoqCompareRows',
		function (
			_,
			globals,
			$q,
			$http,
			$translate,
			$timeout,
			platformDataServiceFactory,
			platformModalService,
			PlatformMessenger,
			platformRuntimeDataService,
			basicsLookupdataLookupDescriptorService,
			platformDataValidationService,
			mainDataService,
			parentService,
			boqHelperService,
			commonService,
			platformModuleStateService,
			compareLineTypes,
			procurementPriceComparisonConfigurationService,
			boqCompareRows
		) {

			let service;
			let ReadOnlyDataProcessor = function ReadOnlyDataProcessor() {
				this.processItem = function (item) {
					service.updateReadOnly(item);
				};
			};

			let serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonBoqPriceConditionService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'boq/main/pricecondition/'
					},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData, data) {
								let items = data.usesCache && angular.isArray(readData) ? readData : (readData.Main || []);
								basicsLookupdataLookupDescriptorService.attachData(readData || {});
								let result = data.handleReadSucceeded(items, data, true);
								storeCacheForCurrent();
								return result;
							},
							initCreationData: initCreationData,
							initReadData: initReadData
						}
					},
					modification: {multi: {}},
					dataProcessor: [new ReadOnlyDataProcessor()],
					entityRole: {
						leaf: {
							itemName: 'PriceCondition',
							parentService: parentService
						}
					},
					actions: {
						create: 'flat',
						canCreateCallBackFunc: function canCreateCallBackFunc() {
							return !!(parentService.selectedQuoteBoq && parentService.selectedQuoteBoq.BoqItemId && !parentService.selectedQuoteBoq.IsIdealBidder) && !readonly();
						},
						delete: {},
						canDeleteCallBackFunc: function canDeleteCallBackFunc() {
							return !!(parentService.selectedQuoteBoq && parentService.selectedQuoteBoq.BoqItemId && !parentService.selectedQuoteBoq.IsIdealBidder) && !readonly();
						}
					}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			service = container.service;
			service.containerData = container.data;

			// avoid to load data when parent item selection changed
			service.unloadSubEntities = function () {
			};
			service.loadSubItemList = function () {
			};
			container.data.loadSubItemList = function () {
			};
			container.data.doReadData = function doReadData(data) {
				data.listLoadStarted.fire();

				if (data.usesCache) {
					let mainId = null;
					if (parentService.selectedQuoteBoq && parentService.selectedQuoteBoq.BoqItemId) {
						mainId = parentService.selectedQuoteBoq.BoqItemId;
					}

					if (mainId) {
						let cache = data.provideCacheFor(mainId, data);
						if (cache) {
							recalculateTotalByOc(cache.loadedItems);
							data.onReadSucceeded(cache.loadedItems, data);
							return $q.when(cache.loadedItems);
						}
					}
				}

				let readData = {};
				readData.filter = '';

				if (data.initReadData) {
					data.initReadData(readData, data);
				} else if (data.filter) {
					readData.filter = '?' + data.filter;
				}

				return container.data.doCallHTTPRead(readData, data, data.onReadSucceeded);
			};

			// handle cache
			container.data.addEntityToCache = function addEntityToCache(entity, data) {
				let boqItemId = entity.BoqItemFk;
				let caches = container.data.cache;
				let cache = data.provideCacheFor(boqItemId, data);
				if (!cache) {
					cache = {
						loadedItems: [],
						selectedItems: [],
						modifiedItems: [],
						deletedItems: []
					};
					caches[boqItemId] = cache;
				}

				cache.loadedItems.push(entity);
			};

			let baseDoClearModification = container.data.doClearModifications;
			container.data.doClearModifications = doClearModifications;

			service.recalculate = function recalculate(selectedQuoteBoq, calParams) {
				if (!selectedQuoteBoq || !selectedQuoteBoq.QtnHeaderId) {
					selectedQuoteBoq = parentService.selectedQuoteBoq;
				}
				if (!selectedQuoteBoq) {
					return $q.when();
				}
				let priceConditions = getCurrentOperatingPriceConditions(selectedQuoteBoq);
				calParams = getCalParams(calParams);
				let exchangeRate = calParams.exchangeRate;
				let quoteItems = calParams.quoteItems;
				let parentItem = _.find(quoteItems, function (item) {
					return item.QtnHeaderId === selectedQuoteBoq.QtnHeaderId && item.BoqItemId === selectedQuoteBoq.BoqItemId;
				});
				if (!parentItem) {
					return $q.when();
				}

				let oldPriceExtra = parentItem.PriceExtra;
				let oldPriceExtraOc = parentItem.PriceExtraOc;
				if (angular.isUndefined(parentItem.Id)) {
					parentItem.Id = parentItem.BoqItemId;
				}
				return $http.post(globals.webApiBaseUrl + 'boq/main/pricecondition/recalculate', {
					AutoSave: false,
					ExchangeRate: exchangeRate,
					HeaderId: selectedQuoteBoq.QtnHeaderId,
					HeaderName: 'procurement.quote',
					MainItem: parentItem,
					PriceConditions: priceConditions,
					ProjectFk: parentService.selectedQuote && parentService.selectedQuote.ProjectId ? parentService.selectedQuote.ProjectId : null,
					Reload: false
				}).then(function (result) {
					handleRecalculateDone(parentItem, result.data, calParams);
					mergeChanges(priceConditions, result.data.PriceConditions);
					_.forEach(priceConditions, function (item) {
						service.markItemAsModified(item);
					});
				}).finally(function () {
					if (oldPriceExtra !== parentItem.PriceExtra) {
						parentService.collectFieldValueByPriceConditions(parentItem, parentItem.PriceExtra, 'PriceExtra');
					}
					if (oldPriceExtraOc !== parentItem.PriceExtraOc) {
						parentService.collectFieldValueByPriceConditions(parentItem, parentItem.PriceExtraOc, 'PriceExtraOc');
					}
					storeCacheForCurrent();
				});
			};

			let readonlyItems = ['Value'];
			let idealBidderReadonlyFields = ['PrcPriceConditionTypeFk', 'Description', 'Value', 'IsPriceComponent', 'IsActivated'];
			service.updateReadOnly = function (item, model) {
				let index;
				if (item && parentService.selectedQuoteBoq && parentService.selectedQuoteBoq.IsIdealBidder) {
					for (index = 0; index < idealBidderReadonlyFields.length; index++) {
						updateFieldReadonly(item, idealBidderReadonlyFields[index]);
					}
					return;
				}
				if (!model) {
					for (index = 0; index < readonlyItems.length; index++) {
						updateFieldReadonly(item, readonlyItems[index]);
					}
				} else {
					updateFieldReadonly(item, model);
				}
			};

			service.mergeInUpdateData = function mergeInUpdateData(updateData) {
				if (updateData.BoqItemToSave) {
					let parentData = updateData.BoqItemToSave[0];
					if (parentData && parentData[container.data.itemName + 'ToSave']) {
						let list = service.getList();
						let caches = container.data.cache;
						_.forEach(parentData[container.data.itemName + 'ToSave'], function (updateItem) {
							let oldItem = _.find(list, {Id: updateItem.Id});
							if (oldItem) {
								let priceConditionType = angular.copy(oldItem.PriceConditionType);
								angular.extend(oldItem, updateItem);
								oldItem.PriceConditionType = priceConditionType;
								return;
							}
							_.find(caches, function (item) {
								oldItem = _.find(item.loadedItems, {Id: updateItem.Id});
								if (oldItem) {
									let priceConditionType = angular.copy(oldItem.PriceConditionType);
									angular.extend(oldItem, updateItem);
									oldItem.PriceConditionType = priceConditionType;
									return true;
								}
							});
						});
						service.gridRefresh();
					}
				}
			};

			function recalculateProxy(selectedQuoteBoq, calParams) {
				$timeout.cancel(service.__recalculateTimerId);
				service.__recalculateTimerId = $timeout(function () {
					service.recalculate(selectedQuoteBoq, calParams);
				}, 50);
			}

			service.registerEntityCreated(recalculateProxy);
			service.registerEntityDeleted(recalculateProxy);
			service.registerListLoaded(function () {
				resetTotal(service.getList());
			});

			service.reload = function reload(parentItem, priceConditionId, calParams) {
				service.isLoading = true;
				parentItem = parentItem || parentService.selectedQuoteBoq;
				if (!parentItem) {
					service.isLoading = false;
					return $q.when(true);
				}
				if (angular.isUndefined(parentItem.Id)) {
					parentItem.Id = parentItem.BoqItemId;
				}
				if (!priceConditionId) {
					let result = {
						ErrorMessages: [],
						ExchangeRate: 0,
						IsSuccess: true,
						Lookups: {
							Prcpriceconditiontype: []
						},
						MainItem: parentItem,
						PriceConditions: []
					};
					basicsLookupdataLookupDescriptorService.attachData(result.Lookups);
					service.handleReloadSucceeded(parentItem, result.PriceConditions);
					recalculateProxy(parentItem, calParams);
					service.isLoading = false;
					parentService.collectFieldValueByPriceConditions(parentItem, parentItem.PrcPriceConditionFk, 'PrcPriceConditionFk');
					return $q.when(true);
				} else {
					let sourceConditions = null;
					if (parentItem.IsIdealBidder && calParams.sourceItem4Copy) {
						let caches = container.data.cache;
						sourceConditions = caches[calParams.sourceItem4Copy.BoqItemId];
					}

					if (!sourceConditions || !angular.isArray(sourceConditions.loadedItems) || sourceConditions.loadedItems.length === 0) {
						let url = globals.webApiBaseUrl + 'boq/main/pricecondition/reload';
						return $http.post(url, {
							PrcPriceConditionId: priceConditionId,
							MainItem: parentItem,
							ExchangeRate: calParams && calParams.exchangeRate ? calParams.exchangeRate : getExchangeRate(),
							IsFromMaterial: false
						}).then(function (result) {
							let resData = result.data;
							basicsLookupdataLookupDescriptorService.attachData(resData.Lookups);
							service.handleReloadSucceeded(parentItem, resData.PriceConditions);
							recalculateProxy(parentItem, calParams);
							return true;
						}).finally(function () {
							service.isLoading = false;
							parentService.collectFieldValueByPriceConditions(parentItem, parentItem.PrcPriceConditionFk, 'PrcPriceConditionFk');
						});
					} else {
						service.handleReloadSucceeded(parentItem, sourceConditions.loadedItems);
						recalculateProxy(parentItem, calParams);
						parentService.collectFieldValueByPriceConditions(parentItem, parentItem.PrcPriceConditionFk, 'PrcPriceConditionFk');
						service.isLoading = false;
						return $q.when(true);
					}
				}
			};

			function getExchangeRate() {
				if (!parentService.selectedQuote) {
					return 1;
				}
				return commonService.getExchangeRate(parentService.selectedQuote.RfqHeaderId, parentService.selectedQuote.Id);
			}

			service.clearItems = function clearItems() {
				let items = [].concat(service.getList());
				service.unloadOwnEntities();
				angular.forEach(items, function (item) {
					clearFromToSave(item);
					service.deleteItem(item);
				});
			};

			service.readonly = readonly;

			function readonly() {
				let selected = parentService.selectedQuoteBoq;
				let readonly = !(selected && angular.isDefined(selected.Id)) || selected.IsIdealBidder || selected.ItemTypeFk === 7;
				if (readonly) {
					return readonly;
				}
				let quoteKey = selected.QuoteKey;
				let selectedParent = parentService.getSelected();
				let rfqHeaderId = selectedParent ? selectedParent.RfqHeaderId : null;
				if (!rfqHeaderId || !quoteKey) {
					return true;
				}
				let qtnStatus = commonService.getQtnStatusById(procurementPriceComparisonConfigurationService.itemQtnMatchCache || {}, quoteKey, rfqHeaderId);
				if (!qtnStatus) {
					return true;
				}
				return qtnStatus.IsReadonly;
			}

			// attach lookup data after re-load
			service.handleReloadSucceeded = function handleReloadSucceeded(parentItem, loadedData) {
				let selectedQuoteBoq = parentService.selectedQuoteBoq;
				if (selectedQuoteBoq && parentItem && selectedQuoteBoq.BoqItemId === parentItem.BoqItemId) {
					service.clearItems();
					angular.forEach(loadedData, function (item) {
						item.BoqHeaderFk = selectedQuoteBoq.BoqHeaderFk;
						container.data.handleCreateSucceededWithoutSelect(item, container.data, service);
					});
				} else if (parentItem) {
					let caches = container.data.cache;
					let cache = caches[parentItem.BoqItemId];
					if (!cache) {
						cache = {
							loadedItems: angular.isArray(loadedData) ? loadedData : [],
							selectedItems: [],
							modifiedItems: [],
							deletedItems: []
						};
					} else {
						cache.loadedItems = loadedData;
					}
					caches[parentItem.BoqItemId] = cache;
				}
			};

			parentService.onQuoteBoqSelected.register(OnQuoteItemSelectionChanged);
			mainDataService.registerRefreshRequested(clearData);
			mainDataService.registerSelectionChanged(clearData);
			parentService.dataChangeMessenger.register(clearData);

			function OnQuoteItemSelectionChanged() {
				container.data.selectionChanged.fire();
				if (parentService.lastSelectedQuoteBoq) {
					unloadOwnEntities(container.data); // cache data
				}

				if (parentService.selectedQuoteBoq && parentService.selectedQuoteBoq.BoqItemId && (!parentService.lastSelectedQuote || parentService.selectedQuote.QuoteKey !== parentService.lastSelectedQuote.QuoteKey)) {
					container.data.filter = 'boqHeaderFk=' + parentService.selectedQuoteBoq.BoqHeaderId + '&boqItemFk=' + parentService.selectedQuoteBoq.BoqItemId;
					service.load();
				}
			}

			function unloadOwnEntities(data) {
				if (data.usesCache && parentService.lastSelectedQuoteBoq && parentService.lastSelectedQuoteBoq.BoqItemId) {
					let itemList = service.getList();
					if (_.isEmpty(itemList) || _.find(itemList, {MainItemId: parentService.lastSelectedQuoteBoq.BoqItemId})) {
						data.storeCacheFor(parentService.lastSelectedQuoteBoq, data);
					}
				}
				clearContent();

				if (data.selectedItem && !data.doNotDeselctOnClearContent && data.itemList && data.itemList.length === 0) {
					data.selectedItem = null;
				}
			}

			function storeCacheForCurrent() {
				if (container.data.usesCache && parentService.selectedQuoteBoq && parentService.selectedQuoteBoq.BoqItemId) {
					let itemList = service.getList();
					if (_.isEmpty(itemList) || _.find(itemList, { MainItemId: parentService.selectedQuoteBoq.BoqItemId })) {
						container.data.storeCacheFor(parentService.selectedQuoteBoq, container.data);
					}
				}
			}

			function clearData() {
				clearContent();
				service.clearCache();
				// clear data cached in parent service
				parentService.lastSelectedQuoteBoq = null;
				parentService.selectedQuoteBoq = null;
				parentService.lastSelectedQuote = null;
				parentService.selectedQuote = null;
			}

			function clearContent() {
				if (container.data.clearContent) {
					container.data.clearContent(container.data);
				}
			}

			function initCreationData(creationData) {
				creationData.BoqItemFk = parentService.selectedQuoteBoq.BoqItemId;
				creationData.BoqHeaderFk = parentService.selectedQuoteBoq.BoqHeaderFk;
				creationData.ExistedTypes = service.getList().map(function (item) {
					return item.PrcPriceConditionTypeFk;
				});
			}

			function handleRecalculateDone(parentItem, loadedData, calParams) {

				if (!loadedData.IsSuccess) {
					resetTotal(loadedData.PriceConditions);
					redrawParentTree(parentItem, parentService.currentEnterCell);
					let errorString = loadedData.ErrorMessages.map(function(error) {
						if (error.Error) {
							return $translate.instant('basics.material.record.priceConditionTypeFormulaError', { 'errorCode': error.PriceConditionType.Code }) + '\t(' + error.Error + ').';
						}
						return $translate.instant('basics.material.record.priceConditionTypeFormulaError', { 'errorCode': error.PriceConditionType.Code });
					}).join('<hr>');

					platformModalService.showErrorBox(errorString, 'Price Calculation Error');
				} else {
					redrawParentTree(parentItem, parentService.currentEnterCell);
				}
			}

			function redrawParentTree(parentItem) {
				let selectedRow = parentService.getSelected() || parentService.currentRow;
				if (selectedRow.BoqLineTypeFk === compareLineTypes.compareField) {
					if (selectedRow.rowType === boqCompareRows.prcPriceConditionFk) {
						selectedRow[parentItem.QuoteKey] = parentItem.PrcPriceConditionFk ? parentItem.PrcPriceConditionFk : 0;
					} else {
						let targetRow = _.find(selectedRow.parentItem.BoqItemChildren, row => {
							return row.rowType === boqCompareRows.prcPriceConditionFk;
						});
						if (targetRow) {
							targetRow[parentItem.QuoteKey] = parentItem.PrcPriceConditionFk;
						}
					}
				}
				parentService.redrawTree(true, parentService.currentEnterCell);
			}

			function resetTotal(itemList) {
				service.total = 0;
				service.totalOc = 0;
				if (!_.isEmpty(itemList)) {
					let filterList = _.filter(itemList, {IsPriceComponent: true});
					service.total = _.sumBy(filterList, function (item) {
						return item.Total;
					});
					service.totalOc = _.sumBy(filterList, function (item) {
						return item.TotalOc;
					});
				}
			}

			function mergeChanges(oldItems, calculatedItems) {
				_.forEach(oldItems, function (oldItem) {
					let newItem = _.find(calculatedItems, {Id: oldItem.Id});
					if (newItem) {
						container.data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, container.data);
					}
				});
				service.gridRefresh();
			}

			function updateFieldReadonly(item, model) {
				let editable = getCellEditable(item, model);
				platformRuntimeDataService.readonly(item, [{field: model, readonly: !editable}]);
			}

			function getCellEditable(item, model) {
				if (parentService.selectedQuoteBoq && parentService.selectedQuoteBoq.IsIdealBidder) {
					return false;
				}
				if (model === 'Value') {
					if (_.isEmpty(item.PriceConditionType)) {
						return false;
					}
					return item.PriceConditionType.HasValue;
				}
				if (model === 'Total') {
					if (_.isEmpty(item.PriceConditionType)) {
						return false;
					}
					return item.PriceConditionType.HasTotal;
				}
				return true;
			}

			service.unloadOwnEntities = function () {
				unloadOwnEntities(container.data);
			};

			service.clearContent = clearContent;

			function onConditionChanged(value, args) {
				let selectedQuoteBoq = args && args.selectedQuoteBoq ? args.selectedQuoteBoq : parentService.selectedQuoteBoq;
				if (selectedQuoteBoq) {
					selectedQuoteBoq.PrcPriceConditionFk = value;
					let calParams = getCalParams(args);
					let quoteItems = calParams.quoteItems;
					_.forEach(quoteItems, function (quoteItem) {
						if (quoteItem.QtnHeaderId === selectedQuoteBoq.QtnHeaderId && quoteItem.BoqItemId === selectedQuoteBoq.BoqItemId) {
							quoteItem.PrcPriceConditionFk = value;
						}
					});

					if (!args || !args.isFromEvaluation) {
						service.reload(selectedQuoteBoq, selectedQuoteBoq.PrcPriceConditionFk, calParams);
					}
					parentService.setNewConditionFk(selectedQuoteBoq.BoqItemId, selectedQuoteBoq.PrcPriceConditionFk);
				}
			}

			function onRowDeselected() {
				parentService.selectedQuoteBoq = null;
				parentService.clearNewConditionFk();
				service.clearContent();
				service.clearCache();
			}

			function onCompareRowsAllowEditVisibleFieldsChanged(args) {
				let quoteItem = args && args.selectedQuoteBoq ? args.selectedQuoteBoq : null;
				let calParams = getCalParams(args);
				service.clearItems();
				clearIdealBidderItemCondition(quoteItem, calParams);
				parentService.onConditionChanged.fire(null, calParams);
			}

			function clearFromToSave(entity) {
				let selected = parentService.getSelected();
				if (selected && angular.isString(selected.Id)) {
					let flags = selected.Id.split('_');
					let mainItemId = selected.Id;
					if (flags && flags.length === 2 && flags[1] !== commonService.itemCompareFields.prcPriceConditionFk) {
						mainItemId = mainItemId.replace(flags[1], commonService.itemCompareFields.prcPriceConditionFk);
					} else {
						return;
					}
					let modState = platformModuleStateService.state(service.getModule());
					if (modState && angular.isObject(modState.modifications) && angular.isArray(modState.modifications['ItemComparisonDataToSave'])) {
						let parentState = _.find(modState.modifications['ItemComparisonDataToSave'], {MainItemId: mainItemId});
						let propName = container.data.itemName + 'ToSave';

						if (parentState && entity && parentState[propName]) {
							parentState[propName] = _.filter(parentState[propName], function (item) {
								return item.Id !== entity.Id;
							});
							modState.modifications.EntitiesCount -= 1;
						}
						if (entity && entity.Version === 0 && modState.modifications[propName]) {
							if (_.find(modState.modifications[propName], {Id: entity.Id})) {
								modState.modifications[propName] = _.filter(modState.modifications[propName], function (item) {
									return item.Id !== entity.Id;
								});
								modState.modifications.EntitiesCount -= 1;
							}
						}
					}
				}
			}

			function recalculateTotalByOc(loadedItems) {
				let exchangeRate = getExchangeRate();
				_.forEach(loadedItems, function (item) {
					item.Total = item.TotalOc / exchangeRate;
				});
			}

			parentService.onConditionChanged.register(onConditionChanged);
			parentService.onRowDeselected.register(onRowDeselected);
			parentService.onCompareRowsAllowEditVisibleFieldsChanged.register(onCompareRowsAllowEditVisibleFieldsChanged);
			return service;

			function initReadData(readData) {
				let mainId = null;
				if (parentService.selectedQuoteBoq && parentService.selectedQuoteBoq.BoqItemId) {
					mainId = parentService.selectedQuoteBoq.BoqItemId;
				}
				readData.filter = '?mainItemId=' + mainId;
			}

			function getQuoteItems() {
				let BoqItemTree = parentService.getTree();
				return commonService.getAllQuoteItems(BoqItemTree, 'BoqItemChildren');
			}

			function clearIdealBidderItemCondition(quoteItem, calParams) {
				quoteItem = quoteItem || parentService.selectedQuoteBoq;
				let quoteItems = calParams.quoteItems;
				if (quoteItem && !quoteItem.IsIdealBidder) {
					let idealQuoteItem = _.find(quoteItems, function (i) {
						return i.IsIdealBidder && quoteItem.QtnHeaderId === i[commonService.itemEvaluationRelatedFields.quoteId] && quoteItem.BoqItemId === i[commonService.itemEvaluationRelatedFields.sourceBoqItemId];
					});
					if (idealQuoteItem) {
						idealQuoteItem.PrcPriceConditionFk = null;
					}
				}
			}

			function getCurrentOperatingPriceConditions(operatingQuoteItem) {
				let list = [];
				if (parentService.selectedQuoteBoq && ((operatingQuoteItem && operatingQuoteItem.BoqItemId === parentService.selectedQuoteBoq.BoqItemId) || !operatingQuoteItem)) {
					list = service.getList();
				} else if ((parentService.lastSelectedQuoteBoq && operatingQuoteItem && operatingQuoteItem.BoqItemId === parentService.lastSelectedQuoteBoq.BoqItemId) ||
					(operatingQuoteItem && operatingQuoteItem.IsIdealBidder)) {
					let cache = container.data.provideCacheFor(operatingQuoteItem.BoqItemId, container.data);
					if (cache) {
						list = cache.loadedItems;
					}
				}
				return _.filter(list, function (item) {
					item.BoqHeaderFk = parentService.selectedQuoteBoq.BoqHeaderId;
					return item;
				});
			}

			function getCalParams(calParams) {
				let quoteItems = calParams && calParams.quoteItems ? calParams.quoteItems : getQuoteItems();
				let exchangeRate = calParams && calParams.exchangeRate ? calParams.exchangeRate : getExchangeRate();
				let rfqHeaderId = calParams && calParams.rfqHeaderId ? calParams.rfqHeaderId : parentService.selectedQuote.RfqHeaderId;
				let sourceItem4Copy = calParams && calParams.sourceItem4Copy ? calParams.sourceItem4Copy : null;
				return {
					quoteItems: quoteItems,
					exchangeRate: exchangeRate,
					rfqHeaderId: rfqHeaderId,
					sourceItem4Copy: sourceItem4Copy
				};
			}

			function doClearModifications(entity, data) {
				baseDoClearModification(entity, data);
				let propName = data.itemName + 'ToSave';
				let modState = platformModuleStateService.state(service.getModule());
				let modifiedItems = modState.modifications['ItemComparisonDataToSave'];
				_.forEach(modifiedItems || [], function (item) {
					if (angular.isArray(item[propName]) && item[propName].length > 0) {
						_.forEach(entity, function (del) {
							let index = _.findIndex(item[propName], {Id: del.Id});
							if (index > -1) {
								item[propName].splice(index, 1);
								modState.modifications.EntitiesCount -= 1;
							}
						});
					}
				});
			}
		}
	]);
})(angular);
