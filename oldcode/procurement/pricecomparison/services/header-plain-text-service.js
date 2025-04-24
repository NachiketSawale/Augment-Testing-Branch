/**
 * Created by ada on 2018/3/7.
 */
(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonHeaderPlainTextService', [
		'_',
		'globals',
		'$q',
		'platformDataServiceFactory',
		'procurementPriceComparisonItemService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonMainService',
		'basicsLookupdataLookupFilterService',
		'procurementPriceComparisonLineTypes',
		'boqMainLineTypes',
		'procurementPriceComparisonCommonHelperService',
		function (
			_,
			globals,
			$q,
			platformDataServiceFactory,
			parentService,
			basicsLookupdataLookupDescriptorService,
			mainDataService,
			basicsLookupdataLookupFilterService,
			procurementPriceComparisonLineTypes,
			boqMainLineTypes,
			commonHelperService) {

			let oldAllSelectedQuote;
			let service;
			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonHeaderPlainTextService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'procurement/common/prcheadertext/',
						endRead: 'list'
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selectedQuote = parentService.allSelectedQuote;
								creationData.MainItemId = selectedQuote.PrcHeaderId;
								creationData.PrcConfigFk = selectedQuote.ConfigurationId;
							},
							incorporateDataRead: function incorporateDataRead(readData, data) {
								let items = data.usesCache && angular.isArray(readData) ? readData : (readData.Main || []);
								basicsLookupdataLookupDescriptorService.attachData(readData || {});
								return data.handleReadSucceeded(items, data, true);
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'PrcHeaderBlob',
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					},
					actions: {
						create: 'flat',
						canCreateCallBackFunc: function canCreateCallBackFunc() {
							if (parentService.allSelectedQuote && checkLineType(parentService.allSelectedQuote.LineType)) {
								return !!(parentService.allSelectedQuote && parentService.allSelectedQuote.PrcHeaderId && !parentService.allSelectedQuote.IsIdealBidder);
							}
							return false;
						},
						delete: {},
						canDeleteCallBackFunc: function canDeleteCallBackFunc() {
							return !!(parentService.allSelectedQuote && parentService.allSelectedQuote.PrcHeaderId && service.getSelected() && !parentService.allSelectedQuote.IsIdealBidder);
						}
					},
					entitySelection: {}
				}
			};
			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			service = serviceContainer.service;

			service.canCreate = function () {
				if (parentService.allSelectedQuote && checkLineType(parentService.allSelectedQuote.LineType)) {
					return !!(parentService.allSelectedQuote && parentService.allSelectedQuote.PrcHeaderId && !parentService.allSelectedQuote.IsIdealBidder);
				}
				return false;
			};

			// avoid to load data when parent item selection changed
			service.unloadSubEntities = function (/* data */) {
			};
			service.loadSubItemList = function () {
			};
			serviceContainer.data.loadSubItemList = function () {
			};
			serviceContainer.data.doReadData = function doReadData(data) {
				data.listLoadStarted.fire();

				if (data.usesCache && parentService.allSelectedQuote && parentService.allSelectedQuote.PrcHeaderId) {
					let cache = data.provideCacheFor(parentService.allSelectedQuote.PrcHeaderId, data);
					if (cache) {
						data.onReadSucceeded(cache.loadedItems, data);
						return $q.when(cache.loadedItems);
					}
				}

				let readData = {};
				readData.filter = '';

				if (data.initReadData) {
					data.initReadData(readData, data);
				} else if (data.filter) {
					readData.filter = '?' + data.filter;
				}

				return serviceContainer.data.doCallHTTPRead(readData, data, data.onReadSucceeded);
			};
			mainDataService.onQuoteSelectedLoadEvaluation.register(OnQuoteItemSelectionChanged);
			mainDataService.registerRefreshRequested(clearData);
			mainDataService.registerSelectionChanged(clearData);
			parentService.dataChangeMessenger.register(clearData);

			basicsLookupdataLookupDescriptorService.loadData(['PrcConfiguration']);
			let filters = [
				{
					key: 'prc-req-header-text-prc-text-type-filter',
					serverSide: true,
					fn: function () {
						let parentItem = parentService.allSelectedQuote;
						if (parentItem) {
							let configuration = _.find(basicsLookupdataLookupDescriptorService.getData('PrcConfiguration'), {Id: parentItem.ConfigurationId});

							return {
								ForHeader: true,
								PrcConfigHeaderFk: configuration ? configuration.PrcConfigHeaderFk : 0
							};
						}
						return {
							ForHeader: true,
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

			function OnQuoteItemSelectionChanged(selectedQuote) {
				parentService.allSelectedQuote = selectedQuote;
				serviceContainer.data.currentParentItem = selectedQuote;
				serviceContainer.data.selectedEntities = [];
				serviceContainer.data.selectedItem = null;
				if (oldAllSelectedQuote) {
					unloadOwnEntities(serviceContainer.data, oldAllSelectedQuote); // cache data
				}
				oldAllSelectedQuote = angular.copy(selectedQuote);
				if (parentService.allSelectedQuote) {

					if (selectedQuote && checkLineType(selectedQuote.LineType)) {
						let mainItemId = parentService.allSelectedQuote.PrcHeaderId;
						serviceContainer.data.filter = 'MainItemId=' + mainItemId + '&ConfigurationFk=' + -1;
						service.load();
					} else {
						serviceContainer.data.selectionChanged.fire();
					}
				} else {
					serviceContainer.data.selectionChanged.fire();
				}
			}

			function unloadOwnEntities(data, oldAllSelectedQuote) {
				if (data.usesCache && oldAllSelectedQuote && oldAllSelectedQuote.PrcHeaderId && checkLineType(oldAllSelectedQuote.LineType)) {
					oldAllSelectedQuote.Id = oldAllSelectedQuote.PrcHeaderId;
					data.storeCacheFor(oldAllSelectedQuote, data);
				}

				if (data.clearContent) {
					data.clearContent(data);
				}
			}

			function clearData() {
				clearContent();
				service.clearCache();
				serviceContainer.data.selectedEntities = [];
				serviceContainer.data.selectedItem = null;
				oldAllSelectedQuote = null;
				parentService.allSelectedQuote = null;
			}

			function clearContent() {
				if (serviceContainer.data.clearContent) {
					serviceContainer.data.selectionChanged.fire();
					serviceContainer.data.clearContent(serviceContainer.data);
				}
			}

			function checkLineType(lineType) {
				return lineType === procurementPriceComparisonLineTypes.requisition ||
					lineType === procurementPriceComparisonLineTypes.compareField ||
					lineType === procurementPriceComparisonLineTypes.prcItem ||
					lineType === procurementPriceComparisonLineTypes.quoteNewItemTotal ||
					lineType === procurementPriceComparisonLineTypes.quoteNewItem ||
					commonHelperService.isBoqRow(lineType);
			}

			service.mergeInUpdateData = function mergeInUpdateData(updateData) {
				if (updateData[serviceContainer.data.itemName + 'ToSave']) {
					let list = service.getList();
					let caches = serviceContainer.data.cache;
					_.forEach(updateData[serviceContainer.data.itemName + 'ToSave'], function (updateItem) {
						let oldItem = _.find(list, {Id: updateItem.Id});
						if (oldItem) {
							angular.extend(oldItem, updateItem);
							return;
						}
						_.find(caches, function (item) {
							oldItem = _.find(item.loadedItems, {Id: updateItem.Id});
							if (oldItem) {
								angular.extend(oldItem, updateItem);
								return true;
							}
						});
					});
					service.gridRefresh();
				}
			};
			let baseOnReadSucceeded = serviceContainer.data.onReadSucceeded;
			serviceContainer.data.onReadSucceeded = function onReadSucceeded(result, data) {
				let readResult = baseOnReadSucceeded(result, data);
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

			service.registerEntityDeleted((data, entities) => {
				if (!data) {
					data = serviceContainer.data;
				}
				if (data.usesCache && parentService.allSelectedQuote && parentService.allSelectedQuote.PrcHeaderId) {
					let cache = data.provideCacheFor(parentService.allSelectedQuote.PrcHeaderId, data);
					if (cache) {
						cache.loadedItems = _.filter(cache.loadedItems, function (item) {
							return !_.find(entities, function (entity) {
								return entity.Id === item.Id;
							});
						});
					}
				}
			});

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