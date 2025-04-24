
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourcePlantComponentMaintenanceSchemaLookupDataService
	 * @function
	 *
	 * @description
	 * resourcePlantComponentMaintenanceSchemaLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('resourcePlantComponentMaintenanceSchemaLookupDataService', ['platformLookupDataServiceFactory','$injector','ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory,$injector, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			var readData = {PKey1: null};
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourcePlantComponentMaintenanceSchemaLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '599301823fdb4ba48d3a5b922cd25c9a'
			});

			var componentMaintSchemaLookupConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantcomponentmaintschema/',
					endPointRead: 'listbyparent',
					usePostForRead: true
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(readData) {
					var selected = $injector.get('resourceEquipmentPlantComponentDataService').getSelected();
					if (selected) {
						readData = {PKey1: selected.Id};
					}
					return readData;
				},
			};
			return platformLookupDataServiceFactory.createInstance(componentMaintSchemaLookupConfig).service;
		}]);
})(angular);
