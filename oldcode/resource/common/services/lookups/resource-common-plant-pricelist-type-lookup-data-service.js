
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceCommonPlantPricelistTypeLookupDataService
	 * @function
	 *
	 * @description
	 * resourceCommonPlantPricelistTypeLookupDataService is the data service providing data for unit look ups
	 */
	angular.module('resource.common').factory('resourceCommonPlantPricelistTypeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceCommonPlantPricelistTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'b15cae398da54b0ba758a0c8ee991837'
			});

			var locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/plantpricing/pricelisttype/',
					endPointRead: 'filtered',
					usePostForRead: true
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
