/**
 * Created by baf on 2020/06/15
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceCommonPlantComponentLookupDataService
	 * @function
	 *
	 * @description
	 * resourceCommonPlantComponentLookupDataService is a data service based lookup for resource skills
	 */
	angular.module('resource.common').factory('resourceCommonPlantComponentLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceCommonPlantComponentLookupDataService', {
				valMember: 'Id',
				dispMember: 'SerialNumber',
				columns: [
					{
						id: 'SerialNumber',
						field: 'SerialNumber',
						name: 'SerialNumber',
						formatter: 'description',
						width: 200,
						name$tr$: 'resource.equipment.entitySerialNumber'
					},{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 200,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'c0e6c18397cf4700ae2b8c40cac83d4f'
			});

			var resourceCommonPlantComponentLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'resource/equipment/plantcomponent/', endPointRead: 'listByParent' },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item || -1;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(resourceCommonPlantComponentLookupDataServiceConfig).service;
		}]);
})(angular);
