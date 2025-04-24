(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	// please see procurementCommonPriceConditionService
	angular.module(moduleName).factory('procurementPriceComparisonPriceConditionService', [
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
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonItemHelperService',
		'prcCommonItemCalculationHelperService',
		'procurementPriceComparisonCommonService',
		'platformModuleStateService',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonConfigurationService',
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
			itemHelperService,
			prcItemCalculationHelper,
			commonService,
			platformModuleStateService,
			procurementPriceComparisonLineTypes,
			procurementPriceComparisonConfigurationService
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
					serviceName: 'procurementPriceComparisonPriceConditionService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'procurement/common/pricecondition/'
					},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData, data) {
								let items = data.usesCache && angular.isArray(readData) ? readData : (readData.Main || []);
								recalculateTotalByOc(items);
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
							return !!(parentService.selectedQuoteItem && parentService.selectedQuoteItem.PrcItemId && !parentService.selectedQuoteItem.IsIdealBidder) && !readonly();
						},
						delete: {},
						canDeleteCallBackFunc: function canDeleteCallBackFunc() {
							return !!(parentService.selectedQuoteItem && parentService.selectedQuoteItem.PrcItemId && !parentService.selectedQuoteItem.IsIdealBidder) && !readonly();
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
					if (parentService.selectedQuoteItem && parentService.selectedQuoteItem.PrcItemId) {
						mainId = parentService.selectedQuoteItem.PrcItemId;
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

			function recalculateTotalByOc(loadedItems) {
				let exchangeRate = getExchangeRate();
				_.forEach(loadedItems, function (item) {
					item.Total = prcItemCalculationHelper.round(prcItemCalculationHelper.roundingType.Total, item.TotalOc / exchangeRate);
				});
			}

			// handle cache
			container.data.addEntityToCache = function addEntityToCache(entity, data) {
				let prcItemId = entity.PrcItemFk;
				let caches = container.data.cache;
				let cache = data.provideCacheFor(prcItemId, data);
				if (!cache) {
					cache = {
						loadedItems: [],
						selectedItems: [],
						modifiedItems: [],
						deletedItems: []
					};
					caches[prcItemId] = cache;
				}

				cache.loadedItems.push(entity);
			};

			let baseDoClearModification = container.data.doClearModifications;
			container.data.doClearModifications = doClearModifications;

			service.recalculate = function recalculate(selectedQuoteItem, calParams) {
				if (!selectedQuoteItem || !selectedQuoteItem.QtnHeaderId) {
					selectedQuoteItem = parentService.selectedQuoteItem;
				}
				if (!selectedQuoteItem) {
					return $q.when();
				}
				let priceConditions = getCurrentOperatingPriceConditions(selectedQuoteItem);
				calParams = getCalParams(calParams);
				let exchangeRate = calParams.exchangeRate;
				let quoteItems = calParams.quoteItems;
				let parentItem = _.find(quoteItems, function (item) {
					return item.QtnHeaderId === selectedQuoteItem.QtnHeaderId && item.PrcItemId === selectedQuoteItem.PrcItemId;
				});
				if (!parentItem) {
					return $q.when();
				}

				let oldPriceExtra = parentItem.PriceExtra;
				let oldPriceExtraOc = parentItem.PriceExtraOc;
				if (angular.isUndefined(parentItem.Id)) {
					parentItem.Id = parentItem.PrcItemId;
				}
				return $http.post(globals.webApiBaseUrl + 'procurement/common/pricecondition/recalculate', {
					PriceConditions: priceConditions,
					MainItem: parentItem,
					ExchangeRate: exchangeRate
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
				if (item && parentService.selectedQuoteItem && parentService.selectedQuoteItem.IsIdealBidder) {
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
				if (updateData.PrcItemToSave) {
					let parentData = updateData.PrcItemToSave[0];
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

			function recalculateProxy(selectedQuoteItem, calParams) {
				$timeout.cancel(service.__recalculateTimerId);
				service.__recalculateTimerId = $timeout(function () {
					service.recalculate(selectedQuoteItem, calParams);
				}, 50);
			}

			service.registerEntityCreated(recalculateProxy);
			service.registerEntityDeleted(recalculateProxy);
			service.registerListLoaded(function () {
				resetTotal(service.getList());
			});

			service.reload = function reload(parentItem, priceConditionId, calParams) {
				service.isLoading = true;
				parentItem = parentItem || parentService.selectedQuoteItem;
				if (!parentItem) {
					service.isLoading = false;
					return $q.when(true);
				}
				if (angular.isUndefined(parentItem.Id)) {
					parentItem.Id = parentItem.PrcItemId;
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
						sourceConditions = caches[calParams.sourceItem4Copy.PrcItemId];
					}

					if (!sourceConditions || !angular.isArray(sourceConditions.loadedItems) || sourceConditions.loadedItems.length === 0) {
						let url = globals.webApiBaseUrl + 'procurement/common/pricecondition/reload';
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

			service.copyFromPrcItem = function copyFromPrcItem(parentItem, sourceItem, priceConditionId, calParams) {
				service.idLoading = true;
				parentItem = parentItem || parentService.selectedQuoteItem;

				if (!parentItem || !sourceItem) {
					return $q.when(true);
				}

				if (angular.isUndefined(parentItem.Id)) {
					parentItem.Id = parentItem.PrcItemId;
				}

				if (!priceConditionId) {
					let result = {
						ErrorMessages: [],
						ExchangeRate: 0,
						IsSuccess: true,
						MainItem: parentItem,
						PriceConditions: []
					};
					service.handleReloadSucceeded(parentItem, result.PriceConditions);
					recalculateProxy(parentItem, calParams);
					service.isLoading = false;
					parentService.collectFieldValueByPriceConditions(parentItem, parentItem.PrcPriceConditionFk, 'PrcPriceConditionFk');
					return $q.when(true);
				} else {
					let cache = container.data.provideCacheFor(sourceItem.PrcItemId, container.data);
					let requestData = {
						SourceItemId: sourceItem.PrcItemId,
						TargetItemId: parentItem.Id,
						SourceItemPriceConditions: cache ? angular.copy(cache.loadedItems) : null
					};
					let url = globals.webApiBaseUrl + 'procurement/common/pricecondition/copyfromprcitem';
					return $http.post(url, requestData).then(function (result) {
						let resData = result.data;
						basicsLookupdataLookupDescriptorService.attachData(resData.Lookups);
						service.handleReloadSucceeded(parentItem, resData.PriceConditions);
						recalculateProxy(parentItem, calParams);
						return true;
					}).finally(function () {
						service.isLoading = false;
						parentService.collectFieldValueByPriceConditions(parentItem, parentItem.PrcPriceConditionFk, 'PrcPriceConditionFk');
					});
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
				let selected = parentService.selectedQuoteItem;
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
				let selectedQuoteItem = parentService.selectedQuoteItem;
				if (selectedQuoteItem && parentItem && selectedQuoteItem.PrcItemId === parentItem.PrcItemId) {
					service.clearItems();
					angular.forEach(loadedData, function (item) {
						container.data.handleCreateSucceededWithoutSelect(item, container.data, service);
					});
				} else if (parentItem) {
					let caches = container.data.cache;
					let cache = caches[parentItem.PrcItemId];
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
					caches[parentItem.PrcItemId] = cache;
				}
			};

			parentService.onQuoteItemSelected.register(OnQuoteItemSelectionChanged);
			mainDataService.registerRefreshRequested(clearData);
			mainDataService.registerSelectionChanged(clearData);
			parentService.dataChangeMessenger.register(clearData);

			function OnQuoteItemSelectionChanged() {
				container.data.selectionChanged.fire();
				if (parentService.lastSelectedQuoteItem) {
					unloadOwnEntities(container.data); // cache data
				}

				if (parentService.selectedQuoteItem && parentService.selectedQuoteItem.PrcItemId) {
					container.data.filter = 'mainItemId=' + parentService.selectedQuoteItem.PrcItemId;
					service.load();
				}
			}

			function unloadOwnEntities(data) {
				if (data.usesCache && parentService.lastSelectedQuoteItem && parentService.lastSelectedQuoteItem.PrcItemId) {
					let itemList = service.getList();
					if (_.isEmpty(itemList) || _.find(itemList, {MainItemId: parentService.lastSelectedQuoteItem.PrcItemId})) {
						data.storeCacheFor(parentService.lastSelectedQuoteItem, data);
					}
				}
				clearContent();

				if (data.selectedItem && !data.doNotDeselctOnClearContent && data.itemList && data.itemList.length === 0) {
					data.selectedItem = null;
				}
			}

			function storeCacheForCurrent() {
				if (container.data.usesCache && parentService.selectedQuoteItem && parentService.selectedQuoteItem.PrcItemId) {
					let itemList = service.getList();
					if (_.isEmpty(itemList) || _.find(itemList, {MainItemId: parentService.selectedQuoteItem.PrcItemId})) {
						container.data.storeCacheFor(parentService.selectedQuoteItem, container.data);
					}
				}
			}

			function clearData() {
				clearContent();
				service.clearCache();
				// clear data cached in parent service
				parentService.lastSelectedQuoteItem = null;
				parentService.selectedQuoteItem = null;
				parentService.lastSelectedQuote = null;
				parentService.selectedQuote = null;
			}

			function clearContent() {
				if (container.data.clearContent) {
					container.data.clearContent(container.data);
				}
			}

			function initCreationData(creationData) {
				creationData.MainItemId = parentService.selectedQuoteItem.PrcItemId;
				creationData.existedTypes = service.getList().map(function (item) {
					return item.PrcPriceConditionTypeFk;
				});
			}

			function handleRecalculateDone(parentItem, loadedData, calParams) {

				updateIdealBidderItem(parentItem, loadedData, calParams);

				let idealExchangeRate = parentItem.IsIdealBidder ? commonService.getExchangeRate(calParams.rfqHeaderId, parentItem.QtnHeaderId) : null;
				updateParentTotal(parentItem, loadedData.PriceConditions, true, idealExchangeRate, calParams);

				if (!loadedData.IsSuccess) {
					resetTotal(loadedData.PriceConditions);

					let errorString = loadedData.ErrorMessages.map(function (error) {
						if (error.Error) {
							return $translate.instant('basics.material.record.priceConditionTypeFormulaError', {'errorCode': error.PriceConditionType.Code}) + '\t(' + error.Error + ').';
						}
						return $translate.instant('basics.material.record.priceConditionTypeFormulaError', {'errorCode': error.PriceConditionType.Code});
					}).join('<hr>');

					platformModalService.showErrorBox(errorString, 'Price Calculation Error');
				}
				parentService.recalculatePrcItemBy(parentItem, false);
			}

			function updateParentTotal(prcItem, priceConditions, updateTotals, idealExchangeRate, calParams) {

				prcItem.PriceExtra = _.sumBy(priceConditions, function (item) {
					return item.PriceConditionType.IsPriceComponent && item.IsActivated ? item.Total : 0;
				});

				if (!prcItem.IsIdealBidder || (prcItem.IsIdealBidder && idealExchangeRate === calParams.exchangeRate)) {
					prcItem.PriceExtraOc = _.sumBy(priceConditions, function (item) {
						return item.PriceConditionType.IsPriceComponent && item.IsActivated ? item.TotalOc : 0;
					});
				} else {
					prcItem.PriceExtraOc = prcItemCalculationHelper.round(prcItemCalculationHelper.roundingType.PriceExtraOc, prcItem.PriceExtra * (idealExchangeRate || 1));
				}

				if (!prcItemCalculationHelper.setTotalFieldsZeroIfOptionalOrAlternativeItem(prcItem)) {
					prcItem.TotalPrice = prcItemCalculationHelper.getTotalPrice(prcItem);
					prcItem.TotalPriceOc = prcItemCalculationHelper.getTotalPriceOc(prcItem);
					prcItem.Total = prcItemCalculationHelper.getTotal(prcItem);
					prcItem.TotalOc = prcItemCalculationHelper.getTotalOc(prcItem);
					prcItem.TotalNoDiscount = prcItemCalculationHelper.getTotalNoDiscount(prcItem);
					prcItem.TotalCurrencyNoDiscount = prcItemCalculationHelper.getTotalOcNoDiscount(prcItem);
				}

				if (updateTotals) {
					service.total = prcItem.PriceExtra;
					service.totalOc = prcItem.PriceExtraOc;
				}
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
				if (parentService.selectedQuoteItem && parentService.selectedQuoteItem.IsIdealBidder) {
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
				let selectedQuoteItem = args && args.selectedQuoteItem ? args.selectedQuoteItem : parentService.selectedQuoteItem;
				if (selectedQuoteItem) {
					selectedQuoteItem.PrcPriceConditionFk = value;
					let calParams = getCalParams(args);
					let quoteItems = calParams.quoteItems;
					_.forEach(quoteItems, function (quoteItem) {
						if (quoteItem.QtnHeaderId === selectedQuoteItem.QtnHeaderId && quoteItem.PrcItemId === selectedQuoteItem.PrcItemId) {
							quoteItem.PrcPriceConditionFk = value;
						}
					});

					parentService.setNewConditionFk(selectedQuoteItem.PrcItemId, selectedQuoteItem.PrcPriceConditionFk);
					if (!args || !args.isFromEvaluation) {
						service.reload(selectedQuoteItem, selectedQuoteItem.PrcPriceConditionFk, calParams);
					} else {
						service.copyFromPrcItem(selectedQuoteItem, args.sourceItem4Copy, selectedQuoteItem.PrcPriceConditionFk, calParams);
					}
				}
			}

			function onRowDeselected() {
				parentService.selectedQuoteItem = null;
				parentService.clearNewConditionFk();
				service.clearContent();
				service.clearCache();
			}

			function onCompareRowsAllowEditVisibleFieldsChanged(args) {
				let quoteItem = args && args.selectedQuoteItem ? args.selectedQuoteItem : null;
				let calParams = getCalParams(args);
				service.clearItems();
				clearIdealBidderItemCondition(quoteItem, calParams);
				parentService.onConditionChanged.fire(null, calParams);
			}

			function onPriceChanged(args) {
				let calParams = getCalParams(args);
				service.recalculate(args && args.originalItem ? args.originalItem : null, calParams).then(function () {
					parentService.redrawTree(); // redraw tree
				});
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

			parentService.onConditionChanged.register(onConditionChanged);
			parentService.onRowDeselected.register(onRowDeselected);
			parentService.onCompareRowsAllowEditVisibleFieldsChanged.register(onCompareRowsAllowEditVisibleFieldsChanged);
			itemHelperService.onPriceChanged.register(onPriceChanged);
			return service;

			function initReadData(readData) {
				let mainId = null;
				if (parentService.selectedQuoteItem && parentService.selectedQuoteItem.PrcItemId) {
					mainId = parentService.selectedQuoteItem.PrcItemId;
				}
				readData.filter = '?mainItemId=' + mainId;
			}

			function updateIdealBidderItem(parentItem, loadedData, calParams) {
				if (!parentItem.IsIdealBidder) {
					let quoteIdField = commonService.itemEvaluationRelatedFields.quoteId;
					let sourceItemIdField = commonService.itemEvaluationRelatedFields.sourcePrcItemId;
					let priceField = commonService.itemCompareFields.price;
					let priceOcField = commonService.itemCompareFields.priceOc;
					calParams = getCalParams(calParams);
					let quoteItems = calParams.quoteItems;
					let idealQuoteItems = _.filter(quoteItems, function (i) {
						return i.IsIdealBidder && parentItem.QtnHeaderId === i[quoteIdField] && parentItem.PrcItemId === i[sourceItemIdField];
					});
					if (angular.isArray(idealQuoteItems) && idealQuoteItems.length > 0) {
						idealQuoteItems = _.filter(quoteItems, function (i) {
							return i.IsIdealBidder && _.some(idealQuoteItems, {QtnHeaderId: i.QtnHeaderId, PrcItemId: i.PrcItemId});
						});
						_.forEach(idealQuoteItems, function (idealQuoteItem) {
							let exchangeRate = commonService.getExchangeRate(calParams.rfqHeaderId, idealQuoteItem.QtnHeaderId);
							idealQuoteItem[priceField] = parentItem[priceField];
							idealQuoteItem[priceOcField] = parentItem[priceField] * (exchangeRate || 1);
							updateParentTotal(idealQuoteItem, loadedData.PriceConditions, false, exchangeRate, calParams);
							parentService.recalculatePrcItemBy(idealQuoteItem, false);

							if (idealQuoteItem[quoteIdField] === parentItem.QtnHeaderId && idealQuoteItem[sourceItemIdField] === parentItem.PrcItemId) {
								let caches = container.data.cache;
								let idealConditionCache = caches[idealQuoteItem.PrcItemId];
								if (!idealConditionCache) {
									idealConditionCache = {
										loadedItems: [],
										selectedItems: [],
										modifiedItems: [],
										deletedItems: []
									};
									caches[idealQuoteItem.PrcItemId] = idealConditionCache;
								}

								if (angular.isArray(loadedData.PriceConditions)) {
									idealConditionCache.loadedItems = _.map(loadedData.PriceConditions, function (condition) {
										let item = angular.copy(condition);
										item.PrcItemFk = idealQuoteItem.PrcItemId;
										return item;
									});
								}
							}
						});
					}
				}
			}

			function getQuoteItems() {
				let itemTree = parentService.getTree();
				return commonService.getAllQuoteItems(itemTree, 'Children');
			}

			function clearIdealBidderItemCondition(quoteItem, calParams) {
				quoteItem = quoteItem || parentService.selectedQuoteItem;
				let quoteItems = calParams.quoteItems;
				if (quoteItem && !quoteItem.IsIdealBidder) {
					let idealQuoteItem = _.find(quoteItems, function (i) {
						return i.IsIdealBidder && quoteItem.QtnHeaderId === i[commonService.itemEvaluationRelatedFields.quoteId] && quoteItem.PrcItemId === i[commonService.itemEvaluationRelatedFields.sourcePrcItemId];
					});
					if (idealQuoteItem) {
						idealQuoteItem.PrcPriceConditionFk = null;
					}
				}
			}

			function getCurrentOperatingPriceConditions(operatingQuoteItem) {
				let list = [];
				if (parentService.selectedQuoteItem && ((operatingQuoteItem && operatingQuoteItem.PrcItemId === parentService.selectedQuoteItem.PrcItemId) || !operatingQuoteItem)) {
					list = service.getList();
				} else if ((parentService.lastSelectedQuoteItem && operatingQuoteItem && operatingQuoteItem.PrcItemId === parentService.lastSelectedQuoteItem.PrcItemId) ||
					(operatingQuoteItem && operatingQuoteItem.IsIdealBidder)) {
					let cache = container.data.provideCacheFor(operatingQuoteItem.PrcItemId, container.data);
					if (cache) {
						list = cache.loadedItems;
					}
				}
				return _.filter(list, function (item) {
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