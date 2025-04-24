(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonRowFactory', [
		'_',
		'globals',
		'$q',
		'platformGridAPI',
		'platformRuntimeDataService',
		'platformDataServiceFactory',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonCommonHelperService',
		function (
			_,
			globals,
			$q,
			platformGridAPI,
			platformRuntimeDataService,
			platformDataServiceFactory,
			procurementPriceComparisonMainService,
			commonService,
			commonHelperService) {

			var serviceCache = {};

			function createService(serviceName, options) {

				var opts = angular.extend({
					compareType: '',
					deviationFields: '',
					parentService: '',
					setDataReadOnly: angular.noop()
				}, options);

				if (serviceName && serviceCache[serviceName]) {
					return serviceCache[serviceName];
				}

				var service = {};
				var serviceOption = {
					module: angular.module(moduleName),
					serviceName: serviceName,
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/pricecomparison/comparerow/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var baseInfo = commonService.getBaseRfqInfo();
							readData.rfqHeaderFk = baseInfo.baseRfqId;
							readData.CompareType = opts.compareType;
						}
					},
					dataProcessor: [],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								service.setPercentDeviation(readData);
								// set item's properties readonly in 'leadingField /showInSummary' columns
								opts.setDataReadOnly(readData, opts.deviationFields, service.isDeviationColumn);
								return data.handleReadSucceeded(readData, data);
							}
						}
					},
					entitySelection: {},
					modification: {multi: {}}, // add to enable setList function
					translation: {
						uid: serviceName,
						title: 'Compare Field Translation',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
					}
				};

				var container = platformDataServiceFactory.createNewComplete(serviceOption);
				service = container.service;
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

				var loadBaseFn = service.load;
				service.load = function () {
					var deferred = $q.defer();

					opts.parentService.getCustomSettingsCompareRowsAsync().then(function (compareRows) {
						var itemList = compareRows || [];
						if (itemList && itemList.length > 0) {
							service.setPercentDeviation(itemList);
							var copyList = angular.copy(itemList);
							opts.setDataReadOnly(copyList, opts.deviationFields, service.isDeviationColumn);
							service.setList(copyList);
							service.gridRefresh();
							deferred.resolve(data.itemList);
						} else {
							loadBaseFn().then(function (data) {
								deferred.resolve(data);
							});
						}
					});

					return deferred.promise;
				};

				// set the percent Deviation fields the same as the discountAbsolute
				service.setPercentDeviation = function (compareRows) {
					let percentage = _.find(compareRows, {Field: commonService.itemCompareFields.percentage});
					let discountAbsolute = _.find(compareRows, {Field: commonService.itemCompareFields.absoluteDifference});
					if (percentage && discountAbsolute) {
						percentage.DeviationField = discountAbsolute.DeviationField;
						percentage.DeviationPercent = discountAbsolute.DeviationPercent;
						percentage.DeviationReference = discountAbsolute.DeviationReference;
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

								commonHelperService.fireEvent('Scope_Compare_Setting', 'onCompareFieldSortingChanged', {
									name: 'moveUp',
									items: configItems
								});
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

								commonHelperService.fireEvent('Scope_Compare_Setting', 'onCompareFieldSortingChanged', {
									name: 'moveDown',
									items: configItems
								});
							}
						}
					}
				};

				function indexInItems(item) {
					return _.findIndex(configItems, {Id: item.Id});
				}

				if (serviceName) {
					serviceCache[serviceName] = service;
				}

				return service;
			}

			return {
				getService: createService
			};
		}
	]);
})(angular);
