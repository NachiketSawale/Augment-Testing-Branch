/**
 * Created by lav on 4/28/2019.
 */

(function (angular) {
	/* global _, globals */
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupCommonDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory',
		'$injector', 'basicsLookupdataLookupDescriptorService'];

	function DataService(platformDataServiceFactory,
						 $injector, basicsLookupdataLookupDescriptorService) {

		var serviceCache = {};

		function createNewComplete(options) {
			var parentService = options.parentService;
			var dataLookupType = options.dataLookupType;
			var route = globals.webApiBaseUrl + options.route;
			var defaultServiceOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: dataLookupType + '_CommonCostGroupDataService',
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
							itemName: 'DummyCostGroups',// never be saved in service
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					},
					useItemFilter: true,
					entitySelection: {supportsMultiSelection: false},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData, data) {
								if (readData && readData.CostGroupCats && readData.CostGroupCats.LicCostGroupCats) {
									$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
										readData.dtos = [];
										basicsCostGroupAssignmentService.attach(readData, {
											attachDataName: dataLookupType, // name of MainItem2CostGroup
											dataLookupType: dataLookupType// name of MainItem2CostGroup
										});
									}]);
									// try to update,only support the same level
									/* _.forEach(parentService.getChildServices(), function (childService) {
										if (childService.getServiceName().endsWith('_CostGroupDataService')) {
											childService.load();
										}
									}); */
									var dtos = [];

									var both = _.concat(readData.CostGroupCats.PrjCostGroupCats, readData.CostGroupCats.LicCostGroupCats);
									_.forEach(both, function (item) {
										var existing = _.find(readData[dataLookupType], {CostGroupCatFk: item.Id});
										if (existing) {
											item.costgroup_ = existing.CostGroupFk;
										}else{
											var lookupData = basicsLookupdataLookupDescriptorService.getData(options.dataLookupType);
											var	lookupItems = lookupData ? _.map(lookupData) : [];
											var existingInCache = _.find(lookupItems, {CostGroupCatFk: item.Id, MainItemId : readData.MainItemId, RootItemId : readData.RootItemId});
											if(existingInCache){
												item.costgroup_ = existingInCache.CostGroupFk;
											}
										}
										item.MainItemId = readData.MainItemId;// for the node item service, has to set the MainItemId
										item.RootItemId = readData.RootItemId;
										dtos.push(item);
									});
									dtos = _.sortBy(dtos, ['Sorting']);
									return data.handleReadSucceeded(dtos, data);
								}
								else// from cache
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