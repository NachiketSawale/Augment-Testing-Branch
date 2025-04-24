/**
 * Created by wed on 5/23/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonQuoteRowServiceFactory', [
		'_',
		'globals',
		'$q',
		'platformGridAPI',
		'platformRuntimeDataService',
		'platformDataServiceFactory',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonCommonHelperService',
		function (_,
			globals,
			$q,
			platformGridAPI,
			platformRuntimeDataService,
			platformDataServiceFactory,
			commonService,
			boqService,
			itemService,
			commonHelperService) {

			var serviceCache = new window.Map();

			function createService(serviceName, compareService, createOptions) {

				if (serviceCache.has(serviceName)) {
					return serviceCache[serviceName];
				}

				var options = angular.extend({
					compareType: null
				}, createOptions);
				var serviceOption = {
					module: angular.module(moduleName),
					serviceName: serviceName,
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/pricecomparison/comparerow/',
						endRead: 'listofquote',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var baseInfo = commonService.getBaseRfqInfo();
							readData.rfqHeaderFk = baseInfo.baseRfqId;
							readData.compareType = options.compareType;
						}
					},
					dataProcessor: [],
					presenter: {list: {}},
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: serviceName,
						title: 'Compare Field Translation',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
					}
				};

				var currentItem = {};
				var configItems = [];

				var container = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = container.service;
				var data = container.data;

				// avoid console error: service.parentService() is not a function (see: platformDataServiceModificationTrackingExtension line 300)
				data.markItemAsModified = angular.noop;
				service.markItemAsModified = angular.noop;

				service.createItem = null;
				service.deleteItem = null;

				// rewrite container.data.setList to avoid error in sorting of compare fields using drag/drop
				service.setList = function (items) {
					data.selectedItem = {};
					data.itemList.length = 0;
					for (var i = 0; i < items.length; ++i) {
						data.itemList.push(items[i]);
					}
				};

				var loadBaseFn = service.load;
				service.load = function () {
					var deferred = $q.defer();

					compareService.getCustomSettingsCompareQuoteRowsAsync().then(function (compareQuoteRows) {
						var itemList = compareQuoteRows || [];
						if (itemList && itemList.length > 0) {
							var items = angular.copy(itemList);
							service.setDataReadOnly(items);
							service.setList(items);
							service.gridRefresh();
							fireGrandTotalRankChanged();
							deferred.resolve(data.itemList);
						} else {
							loadBaseFn().then(function (data) {
								service.setDataReadOnly(data);
								fireGrandTotalRankChanged();
								deferred.resolve(data);
							});
						}
					});

					return deferred.promise;
				};

				service.setDataReadOnly = function (readData, isRefreshGrid) {
					commonHelperService.setQuoteCompareFieldsReadOnly(readData);
					if (isRefreshGrid) {
						service.gridRefresh();
					}
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
									// platformGridAPI.grids.commitEdit($scope.gridId);
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

				function fireGrandTotalRankChanged() {
					var compareService = options.compareType === commonService.constant.compareType.boqItem ? boqService : itemService,
						items = service.getList(),
						grandTotal = _.find(items, {Field: commonService.quoteCompareFields.grandTotalRank}),
						checked = grandTotal ? grandTotal.IsSorting : false;
					compareService.onGrandTotalRankSortingChanged.fire({
						origin: commonService.constant.compareSection.UI,
						checked: checked
					});
					compareService.setGrandTotalRankSortingCheckedState('ui', checked);
				}

				serviceCache.set(serviceName, service);

				return service;
			}

			return {
				createService: createService
			};

		}]);
})(angular);

