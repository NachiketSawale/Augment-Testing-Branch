(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonItemBillingSchemaRowService
	 * @function
	 * @requires platformGridAPI
	 * @description
	 * data service of pricecomparison item quote compare row controller
	 */
	angular.module(moduleName).factory('procurementPriceComparisonItemBillingSchemaRowService', [
		'_', 'globals', '$q', 'platformGridAPI', 'platformDataServiceFactory', 'procurementPriceComparisonCommonService', 'procurementPriceComparisonItemService',
		function (_, globals, $q, platformGridAPI, platformDataServiceFactory, commonService, procurementPriceComparisonItemService) {
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonItemBillingSchemaRowService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/pricecomparison/comparerow/',
					endRead: 'listofbillingschema',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var baseInfo = commonService.getBaseRfqInfo();
						readData.rfqHeaderFk = baseInfo.baseRfqId;
						readData.CompareType = 1; // (1:Item; 2: Boq)
					}
				},
				dataProcessor: [],
				presenter: {list: {}},
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'procurementPriceComparisonItemBillingSchemaRowService',
					title: 'Compare Field Translation',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = container.service;
			var data = container.data;

			var currentItem = {};
			var configItems = [];

			// avoid console error: service.parentService() is not a function (see: platformDataServiceModificationTrackingExtension line 300)
			data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};
			service.createItem = null;
			service.deleteItem = null;

			// rewrite data.setList to avoid error in sorting of compare fields using drag/drop
			service.setList = function (items) {
				data.selectedItem = {};
				data.itemList.length = 0;
				for (var i = 0; i < items.length; ++i) {
					data.itemList.push(items[i]);
				}
			};

			service.load = function () {
				var deferred = $q.defer();

				procurementPriceComparisonItemService.getCustomSettingsCompareBillingSchemaRowsAsync().then(function (compareQuoteRows) {
					var itemList = compareQuoteRows || [];
					if (itemList && itemList.length > 0) {
						service.setList(angular.copy(itemList));
						service.gridRefresh();
						deferred.resolve(data.itemList);
					} else {
						deferred.resolve([]);
					}
				});

				return deferred.promise;
			};

			// see gridconfig-controller/service.js
			service.moveUp = function () {
				currentItem = service.getSelected();
				if (service.isSelection(currentItem)) {
					if (currentItem && currentItem.id !== 'tree') {
						configItems = service.getList();

						var index = indexInItems(currentItem);
						if (index > 0 && configItems[index - 1].id !== 'tree') {
							configItems.move(index, --index);

							platformGridAPI.items.data(service.gridId, configItems);

							if (platformGridAPI.rows.selection({gridId: service.gridId}) !== currentItem) {
								platformGridAPI.rows.selection({
									gridId: service.gridId,
									rows: [currentItem]
								});
							}
						}
					}
				}
			};
			service.moveDown = function () {
				currentItem = service.getSelected();
				if (service.isSelection(currentItem)) {
					if (currentItem && currentItem.id !== 'tree') {
						configItems = service.getList();

						var index = indexInItems(currentItem);
						if (index >= 0 && index < configItems.length - 1) {
							configItems.move(index, ++index);

							platformGridAPI.items.data(service.gridId, configItems);

							if (platformGridAPI.rows.selection({gridId: service.gridId}) !== currentItem) {
								platformGridAPI.rows.selection({
									gridId: service.gridId,
									rows: [currentItem]
								});
							}
						}
					}
				}
			};

			function indexInItems(item) {
				return _.findIndex(configItems, {Id: item.Id});
			}

			return service;
		}
	]);
})(angular);
