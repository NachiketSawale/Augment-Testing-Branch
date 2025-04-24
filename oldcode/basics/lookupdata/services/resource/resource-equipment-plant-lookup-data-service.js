/**
 * Created by leo on 19.09.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantLookupDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('resourceEquipmentPlantLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceEquipmentPlantLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '3af0e3ceeb374d9ab3060d8fc1fdbf82'
			});

			var resourceTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/equipment/plant/',
					endPointRead: 'lookuplist'
				}
			};

			return platformLookupDataServiceFactory.createInstance(resourceTypeLookupDataServiceConfig).service;
		}]);
})(angular);
