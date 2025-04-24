
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceWorkOperationTypeLookupDataService
	 * @function
	 *
	 * @description
	 * resourceWorkOperationTypeLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('resourceWorkOperationTypeLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceWorkOperationTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'description',
						width: 180,
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
				uuid: '589c4b127312498b8f9686be00ac5edd'
			});

			var resourceTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/wot/workoperationtype/',
					endPointRead: 'listbycontext'
				}
			};

			return platformLookupDataServiceFactory.createInstance(resourceTypeLookupDataServiceConfig).service;
		}]);
})(angular);
