
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceCommonEstimatePlantPricelistLookupDataService
	 * @function
	 *
	 * @description
	 * resourceCommonEstimatePlantPricelistLookupDataService is the data service providing data for unit look ups
	 */
	angular.module('resource.common').factory('resourceCommonEstimatePlantPricelistLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceCommonEstimatePlantPricelistLookupDataService', {
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
				uuid: '89f60af079af4e94acef6cf7b21c7a0d'
			});

			var locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/plantpricing/estpricelist/',
					endPointRead: 'list',
					usePostForRead: true
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
