
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceCommonPlantPricelistLookupDataService
	 * @function
	 *
	 * @description
	 * resourceCommonPlantPricelistLookupDataService is the data service providing data for unit look ups
	 */
	angular.module('resource.common').factory('resourceCommonPlantPricelistLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceCommonPlantPricelistLookupDataService', {
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
				uuid: '0cc6ad47566542e2a916d61ccefcf44f'
			});

			var locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/plantpricing/pricelist/',
					endPointRead: 'list',
					usePostForRead: true
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
