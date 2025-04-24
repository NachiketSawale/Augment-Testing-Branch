/**
 * Created by ada on 2018/6/14.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('priceComparisonBillingSchemaService', [
		'_',
		'$q',
		'basicsBillingSchemaServiceFactory',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonCommonHelperService',
		function (
			_,
			$q,
			basicsBillingSchemaServiceFactory,
			parentService,
			mainDataService,
			commonService,
			boqService,
			commonHelperService) {

			var oldAllSelectedQuote;
			var qualifier = 'procurement.quote.billingschmema';
			var service = basicsBillingSchemaServiceFactory.getService(qualifier, parentService, {
				onUpdateSuccessNotify: parentService.onUpdateSucceeded,
				getIfSelectedIdElse: getSelectedQuoteId
			});

			mainDataService.onQuoteSelectedLoadEvaluation.register(OnQuoteItemSelectionChanged);
			mainDataService.registerRefreshRequested(clearData);
			mainDataService.registerSelectionChanged(clearData);
			parentService.dataChangeMessenger.register(clearData);

			var data = service.getContainerData();
			// avoid to load data when parent item selection changed

			service.unloadSubEntities = function (/* data */) {
			};

			service.loadSubItemList = function () {
			};

			data.loadSubItemList = function () {
			};

			data.doReadData = function doReadData(data) {
				data.listLoadStarted.fire();

				if (data.usesCache && parentService.allSelectedQuote && parentService.allSelectedQuote.Id) {
					var cache = data.provideCacheFor(parentService.allSelectedQuote.Id, data);
					if (cache) {
						var readDataItems = {
							Main: cache.loadedItems
						};
						data.onReadSucceeded(readDataItems, data);
						return $q.when(readDataItems);
					}
				}

				var readData = {};
				readData.filter = '';

				if (data.initReadData) {
					data.initReadData(readData, data);
				} else if (data.filter) {
					readData.filter = '?' + data.filter;
				}

				return data.doCallHTTPRead(readData, data, data.onReadSucceeded);
			};

			service.mergeInUpdateData = function mergeInUpdateData(updateData) {
				service.updateBillingSchemaData(updateData[data.itemName + 'ToSave']);
			};

			service.updateBillingSchemaData = function (billingSchemaData) {
				if (billingSchemaData) {
					var list = service.getList();
					var caches = data.cache;
					_.forEach(billingSchemaData, function (updateItem) {
						updateItem.QuoteId = updateItem.HeaderFk;
						var oldItem = _.find(list, {Id: updateItem.Id});
						if (oldItem) {
							angular.extend(oldItem, updateItem);
							return;
						}
						_.find(caches, function (item) {
							if (item.loadedItems) {
								oldItem = _.find(item.loadedItems, {Id: updateItem.Id});
								if (oldItem) {
									angular.extend(oldItem, updateItem);
									return true;
								}
							}
						});
					});
					commonService.setFinalBillingSchema(billingSchemaData);
					service.gridRefresh();
				}
			};

			service.getParentSelected = function () {
				return parentService.allSelectedQuote;
			};

			service.getRubricCategory = function (item) {
				var selectItem = item || service.getParentSelected();
				return selectItem.RubricCategoryFk;
			};

			function getSelectedQuoteId() {
				return parentService.allSelectedQuote ? parentService.allSelectedQuote.Id || -1 : -1;
			}

			function OnQuoteItemSelectionChanged(selectedQuote) {
				parentService.allSelectedQuote = selectedQuote;
				data.currentParentItem = selectedQuote;
				data.selectedEntities = [];
				data.selectedItem = null;
				if (oldAllSelectedQuote) {
					unloadOwnEntities(data, oldAllSelectedQuote); // cache data
				}
				oldAllSelectedQuote = selectedQuote;
				// click GrandTotal Row also can show billingSchema.
				if (selectedQuote /* && selectedQuote.LineType !== comparisonLineTypes.grandTotal */) {
					data.filter = '?MainItemId=' + selectedQuote.QtnHeaderId + '&qualifier=' + service.getQualifier();
					service.load();
				} else if (data.clearContent) {
					data.clearContent(data);
				}
				data.selectionChanged.fire();
			}

			function unloadOwnEntities(data, oldAllSelectedQuote) {
				if (data.usesCache && oldAllSelectedQuote) {
					data.storeCacheFor(oldAllSelectedQuote, data);
				}

				if (data.clearContent) {
					data.clearContent(data);
				}
			}

			function clearData() {
				oldAllSelectedQuote = null;
				parentService.allSelectedQuote = null;
				clearContent();
			}

			function clearContent() {
				if (data.clearContent) {
					data.clearContent(data);
				}
			}

			service.onValueChanged.register(function (args) {

				if (_.includes(['Description', 'Description2', 'CodeRetention'], args.column.field)) {
					return;
				}

				service.recalculateBillingSchema();

			});

			service.recalculateBillingSchema = function recalculateBillingSchema() {
				let selectedQuote = (parentService.selectedQuote || boqService.selectedQuote);
				if (selectedQuote) {
					let exchangeRate = commonService.getExchangeRate(selectedQuote.RfqHeaderId, selectedQuote.Id);
					let dataService = parentService.selectedQuote ? parentService : boqService;

					let modifiedPrcItems = [];
					if (parentService.modifiedData && parentService.modifiedData[selectedQuote.Id]) {
						let modifiedPrcItemIds = _.map(parentService.modifiedData[selectedQuote.Id], function (item) {
							return parseFloat(item.Id);
						});
						modifiedPrcItems = _.filter(commonService.getAllQuoteItems(parentService.getTree(), 'Children'), function (item) {
							return item.QtnHeaderId === selectedQuote.Id && _.includes(modifiedPrcItemIds, item.PrcItemId);
						});
					}

					let modifiedBoqItems = [];
					if (boqService.modifiedData && boqService.modifiedData[selectedQuote.Id]) {
						let modifiedBoqItemIds = _.map(boqService.modifiedData[selectedQuote.Id], function (item) {
							return parseInt(item.Id);
						});
						modifiedBoqItems = _.filter(commonService.getAllQuoteItems(boqService.getTree(), 'BoqItemChildren'), function (item) {
							return item.QuoteKey === selectedQuote.QuoteKey && _.includes(modifiedBoqItemIds, item.BoqItemId);
						});
					}

					return commonHelperService.recalculateBillingSchema(dataService, selectedQuote.Id, exchangeRate, modifiedPrcItems, modifiedBoqItems, parentService.modifiedData, boqService.modifiedData, service.getList());
				}
				return $q.when(service.getList());
			};

			return service;
		}]);

})(angular);
