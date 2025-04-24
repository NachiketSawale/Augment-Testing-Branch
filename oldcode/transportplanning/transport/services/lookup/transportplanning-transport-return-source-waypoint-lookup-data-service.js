(function (angular) {
	'use strict';
	/* global globals, angular */
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportReturnResourceWaypointLookupDataService
	 * @function
	 *
	 * @description
	 * transportplanningTransportReturnResourceWaypointLookupDataService is the data service for getting waypoints of the corresponding routeId.
	 */
	angular.module(moduleName).factory('transportplanningTransportReturnResourceWaypointLookupDataService', lookupDataService);
	lookupDataService.$inject = ['$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$q',
		'basicsLookupdataLookupDescriptorService'];

	function lookupDataService($injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, $q,
							   basicsLookupdataLookupDescriptorService) {
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('transportplanningTransportReturnResourceWaypointLookupDataService', {
			valMember: 'Id',
			dispMember: 'Code',
			uuid: '14eb381ae49b4cf58c71b73525709289',
			disableDataCaching: false,
			columns: [
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					formatter: 'code',
					name$tr$: 'cloud.common.entityCode'
				},
				{
					id: 'address',
					field: 'Address.Address',
					name: 'Address',
					name$tr$: 'basics.common.entityAddress',
					width: 150
				},
				{
					id: 'PlannedTime',
					field: 'PlannedTime',
					name: 'PlannedTime',
					formatter: 'datetimeutc',
					name$tr$: 'cloud.common.entityPlannedTime'
				},
				{
					id: 'IsDefaultSrc',
					field: 'IsDefaultSrc',
					name: 'IsDefaultSrc',
					formatter: 'boolean',
					name$tr$: 'transportplanning.transport.entityIsDefaultSrc',
					width: 120
				},
				{
					id: 'IsDefaultDst',
					field: 'IsDefaultDst',
					name: 'IsDefaultDst',
					formatter: 'boolean',
					name$tr$: 'transportplanning.transport.entityIsDefaultDst',
					width: 120
				}
			]
		});
		var service;
		var lookupDataServiceConfig = {
			httpRead: {
				route: globals.webApiBaseUrl + 'transportplanning/transport/waypoint/',
				endPointRead: 'lookuplistreturnresource'
			},
			filterParam: 'routeId',
			dataIsAlreadySorted: true,
			prepareFilter: function () {
				return service.entity;
			}
		};

		service = platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		service.updateWaypoint = function (waypointEntity) {
			service.entity.waypointEntity = waypointEntity;
			service.entity.DstWPFk = waypointEntity.Id;
		};
		var origFnGetList = service.getList;
		service.getList = function (options) {
			if (options) {
				options.disableDataCaching = false;
			}
			service.clearCache = function () {
				service.setCache(options, []);
			};
			if (service.entity.DstWPFk === -1) {//clear when item changed
				service.clearCache();
			}
			var defer = $q.defer();
			origFnGetList(options).then(function (filterResult) {
				if (filterResult && filterResult.length > 0 && service.entity) {
					if (!_.find(filterResult, {Id: service.entity.DstWPFk})) {//if not found id, set to last one
						service.updateWaypoint(filterResult[filterResult.length - 1]);
						basicsLookupdataLookupDescriptorService.updateData('transportplanningTransportReturnResourceWaypointLookupDataService', filterResult);//update the lookup
					}
				}
				defer.resolve(filterResult);
			});
			return defer.promise;
		};
		var origFnSetFilter = service.setFilter;
		service.setFilter = function (filter) {
			service.entity = filter;
			origFnSetFilter(filter.Id);
		};
		return service;
	}
})(angular);
