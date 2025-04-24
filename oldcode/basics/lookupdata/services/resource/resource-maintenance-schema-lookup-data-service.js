
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceMaintenanceSchemaLookupDataService
	 * @function
	 *
	 * @description
	 * resourceMaintenanceSchemaLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('resourceMaintenanceSchemaLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceMaintenanceSchemaLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Description',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '218bd94f773f41368745da41df52aebd'
			});

			var resourceTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/maintenance/schema/',
					endPointRead: 'listbycontext'
				}
			};

			return platformLookupDataServiceFactory.createInstance(resourceTypeLookupDataServiceConfig).service;
		}]);
})(angular);
