/**
 * Created by ada on 2018/3/20.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module(moduleName).factory('procurementPriceComparisonItemPlainTextService', [
		'$q', 'platformDataServiceFactory', 'procurementPriceComparisonItemService', 'basicsLookupdataLookupDescriptorService','procurementPriceComparisonLineTypes','procurementPriceComparisonMainService', 'basicsLookupdataLookupFilterService',
		function($q, platformDataServiceFactory, parentService, basicsLookupdataLookupDescriptorService, procurementPriceComparisonLineTypes, mainDataService, basicsLookupdataLookupFilterService){

			// procurementPriceComparisonItemService;
			var serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonItemPlainTextService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'procurement/common/prcitemtext/',
						endRead: 'list'
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.MainItemId = parentService.selectedQuoteItem.Id;
								creationData.PrcConfigFk = parentService.selectedQuoteItem.ConfigurationId;
							},
							incorporateDataRead: function incorporateDataRead(readData, data) {
								var items = data.usesCache && angular.isArray(readData) ? readData : (readData.Main || []);
								basicsLookupdataLookupDescriptorService.attachData(readData || {});
								return data.handleReadSucceeded(items, data, true);
							}
						}
					},
					entityRole: { leaf: { itemName: 'PrcItemblob', parentService: parentService, doesRequireLoadAlways: true } },
					actions: {
						create: 'flat',
						canCreateCallBackFunc: function canCreateCallBackFunc() {
							return !!(parentService.selectedQuoteItem && parentService.selectedQuoteItem.Id && !parentService.selectedQuoteItem.IsIdealBidder && parentService.selectedQuoteItem.ItemTypeFk !== 7);
						},
						delete: {},
						canDeleteCallBackFunc: function canDeleteCallBackFunc() {
							return !!(parentService.selectedQuoteItem && parentService.selectedQuoteItem.Id && !parentService.selectedQuoteItem.IsIdealBidder && parentService.selectedQuoteItem.ItemTypeFk !== 7);
						}
					},
					entitySelection: {}
				}
			};
			var  serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			var service = serviceContainer.service;

			// avoid to load data when parent item selection changed
			service.unloadSubEntities = function (/* data */) {};
			service.loadSubItemList = function () {};
			serviceContainer.data.loadSubItemList = function () {};
			serviceContainer.data.doReadData = function doReadData(data) {
				data.listLoadStarted.fire();

				if (data.usesCache && parentService.selectedQuoteItem && parentService.selectedQuoteItem.Id) {
					var cache = data.provideCacheFor(parentService.selectedQuoteItem.Id, data);
					if (cache) {
						data.onReadSucceeded(cache.loadedItems, data);
						return $q.when(cache.loadedItems);
					}
				}

				var readData = {};
				readData.filter = '';

				if (data.initReadData) {
					data.initReadData(readData, data);
				}
				else if (data.filter) {
					readData.filter = '?' + data.filter;
				}

				return serviceContainer.data.doCallHTTPRead(readData, data, data.onReadSucceeded);
			};
			parentService.onQuoteItemSelected.register(OnQuoteItemSelectionChanged);
			mainDataService.registerRefreshRequested(clearData);
			mainDataService.registerSelectionChanged(clearData);
			parentService.dataChangeMessenger.register(clearData);

			basicsLookupdataLookupDescriptorService.loadData(['PrcConfiguration']);
			var filters = [
				{
					key: 'prc-req-item-text-prc-text-type-filter',
					serverSide: true,
					fn: function () {
						var parentItem = parentService.selectedQuoteItem;
						if (parentItem) {
							var configuration = _.find(basicsLookupdataLookupDescriptorService.getData('PrcConfiguration'), {Id: parentItem.ConfigurationId});

							return {
								ForItem: true,
								PrcConfigHeaderFk: configuration ? configuration.PrcConfigHeaderFk : 0
							};
						}
						return {
							ForItem: true,
							PrcConfigHeaderFk: 0
						};
					}
				}
			];
			service.registerLookupFilter = function registerLookupFilter() {
				if (basicsLookupdataLookupFilterService.hasFilter(filters[0].key)) {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				}
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};
			service.unregisterLookupFilter = function unregisterLookupFilter() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			function OnQuoteItemSelectionChanged() {
				if (parentService.lastSelectedQuoteItem && parentService.lastSelectedQuoteItem.Id) {
					unloadOwnEntities(serviceContainer.data); // cache data
				}

				if (parentService.selectedQuoteItem && parentService.selectedQuoteItem.Id && parentService.selectedQuoteItem.BusinessPartnerFk !== 0) {
					if (parentService.currentRow.LineType === procurementPriceComparisonLineTypes.compareField ||
						parentService.currentRow.LineType === procurementPriceComparisonLineTypes.prcItem ||
						parentService.currentRow.LineType === procurementPriceComparisonLineTypes.quoteNewItemTotal ||
						parentService.currentRow.LineType === procurementPriceComparisonLineTypes.quoteNewItem) {
						serviceContainer.data.filter =  'MainItemId=' +  parentService.selectedQuoteItem.Id + '&ConfigurationFk=' + -1;
						service.load();
					} else {
						serviceContainer.data.selectionChanged.fire();
					}
				} else {
					serviceContainer.data.selectionChanged.fire();
				}
			}

			function unloadOwnEntities(data) {
				if (data.usesCache && parentService.lastSelectedQuoteItem && parentService.lastSelectedQuoteItem.Id) {
					data.storeCacheFor(parentService.lastSelectedQuoteItem, data);
				}

				if (data.clearContent) {
					data.clearContent(data);
				}

				if (data.selectedItem && !data.doNotDeselctOnClearContent && data.itemList && data.itemList.length === 0) {
					data.selectedItem = null;
				}
			}

			function clearData() {
				clearContent();
				service.clearCache();
				serviceContainer.data.selectedEntities = [];
				serviceContainer.data.selectedItem = null;
				// clear data cached in parent service
				parentService.lastSelectedQuoteItem = null;
				parentService.selectedQuoteItem = null;
				parentService.lastSelectedQuote = null;
				parentService.selectedQuote = null;
			}

			function clearContent() {
				if (serviceContainer.data.clearContent) {
					serviceContainer.data.selectionChanged.fire();
					serviceContainer.data.clearContent(serviceContainer.data);
				}
			}

			service.mergeInUpdateData = function mergeInUpdateData(updateData) {
				if(updateData['PrcItemToSave']) {// jshint ignore: line
					var parentData = updateData['PrcItemToSave'][0];// jshint ignore: line
					if(parentData && parentData[serviceContainer.data.itemName + 'ToSave']) {
						var list = service.getList();
						var caches = serviceContainer.data.cache;
						_.forEach(parentData[serviceContainer.data.itemName + 'ToSave'], function (updateItem) {
							var oldItem = _.find(list, {Id : updateItem.Id});
							if (oldItem) {
								angular.extend(oldItem, updateItem);
								return;
							}
							_.find(caches, function(item){
								oldItem = _.find(item.loadedItems, {Id : updateItem.Id});
								if (oldItem) {
									angular.extend(oldItem, updateItem);
									return true;
								}
							});
						});
						service.gridRefresh();
					}
				}
			};

			var baseOnReadSucceeded = serviceContainer.data.onReadSucceeded;
			serviceContainer.data.onReadSucceeded = function onReadSucceeded(result, data) {
				var readResult = baseOnReadSucceeded(result, data);
				if (data.itemList.length > 0) {
					serviceContainer.service.goToFirst();
				} else {
					serviceContainer.data.selectionChanged.fire();
				}
				service.gridRefresh();
				return readResult;
			};

			service.getPrcHeader = function () {
				let selectedQuote = parentService.allSelectedQuote;
				if (selectedQuote) {
					return {
						Id: selectedQuote.PrcHeaderId,
						ConfigurationFk: selectedQuote.ConfigurationId
					};
				}
				return null;
			};

			service.getParentEntity = function () {
				return {
					ProjectFk: parentService.allSelectedQuote.ProjectId
				};
			};

			service.updateByTextType = function (entity, needUpdateText) {

			};

			service.getPrcConfigurationId = function () {
				let selectedQuote = parentService.allSelectedQuote;
				if (selectedQuote) {
					return selectedQuote.ConfigurationId;
				}
				return null;
			};

			return service;
		}]);

})(angular);