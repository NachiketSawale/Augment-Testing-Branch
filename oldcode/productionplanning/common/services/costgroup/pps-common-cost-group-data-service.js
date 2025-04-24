/**
 * Created by lav on 4/28/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonCostGroupDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory',
		'$injector'];

	function DataService(platformDataServiceFactory,
						 $injector) {

		var serviceCache = {};

		function createNewComplete(options) {
			var parentService = options.parentService;
			var dataLookupType = options.dataLookupType;
			var route = globals.webApiBaseUrl + options.route;
			var defaultServiceOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: dataLookupType + '_ppsCommonCostGroupDataService',
					httpRead: {
						route: route,
						endRead: 'listcostgroup',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							options.initReadData(readData);
						}
					},
					actions: {},
					entityRole: {
						leaf: {
							itemName: 'DummyCostGroups',//never be saved in service
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					},
					useItemFilter: true,
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData, data) {
								if (readData && readData.CostGroupCats && readData.CostGroupCats.LicCostGroupCats) {
									$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
										readData.dtos = [];
										basicsCostGroupAssignmentService.attach(readData, {
											attachDataName: dataLookupType, //name of MainItem2CostGroup
											dataLookupType: dataLookupType//name of MainItem2CostGroup
										});
									}]);
									//try to update,only support the same level
									_.forEach(parentService.getChildServices(), function (childService) {
										if (childService.getServiceName().endsWith('_CostGroupDataService')) {
											childService.load();
										}
									});
									var dtos = [];

									var both = _.concat(readData.CostGroupCats.PrjCostGroupCats, readData.CostGroupCats.LicCostGroupCats);
									_.forEach(both, function (item) {
										var existing = _.find(readData[dataLookupType], {CostGroupCatFk: item.Id});
										if (existing) {
											item.costgroup_ = existing.CostGroupFk;
										}
										item.MainItemId = readData.MainItemId;//for the node item service, has to set the MainItemId
										dtos.push(item);
									});
									dtos = _.sortBy(dtos, ['Sorting']);
									return data.handleReadSucceeded(dtos, data);
								}
								else//from cache
								{
									return data.handleReadSucceeded(readData, data);
								}
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(defaultServiceOptions);

			return serviceContainer.service;
		}

		function getService(serviceOptions) {
			var serviceKey = serviceOptions.serviceKey;
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createNewComplete(serviceOptions);
			}
			return serviceCache[serviceKey];
		}

		return {
			getService: getService
		};
	}

})(angular);