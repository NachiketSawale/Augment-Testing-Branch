(function (angular) {
	'use strict';
	/* global globals, angular */
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportWaypointLookupDataService
	 * @function
	 *
	 * @description
	 * transportplanningTransportWaypointLookupDataService is the data service for getting waypoints of the corresponding routeId.
	 */
	angular.module(moduleName).factory('transportplanningTransportWaypointLookupDataService', lookupDataService);
	lookupDataService.$inject = ['$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];

	function lookupDataService($injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('transportplanningTransportWaypointLookupDataService', {
			valMember: 'Id',
			dispMember: 'Code',
			uuid: '04eb381ae49b4cf58c71b73525709289',
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

		var lookupDataServiceConfig = {
			httpRead: {
				route: globals.webApiBaseUrl + 'transportplanning/transport/waypoint/',
				endPointRead: 'lookuplist'
			},
			filterParam: 'routeId',
			dataIsAlreadySorted: true,
			modifyLoadedData: function (itemList) {
				if (container.service.transientData) {
					var route = container.service.transientData.routeFn();
					if (route && route.isAddingTrsGood && route.Id === container.data.filter) {
						_.forEach(container.service.transientData.items, function (item) {
							if (!_.some(itemList, {Id: item.Id})) {
								itemList.push(item);
							}
						});
					}
				}
			}
		};

		var container = platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig);
		return container.service;
	}
})(angular);
