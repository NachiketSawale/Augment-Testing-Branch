/**
 * Created by Sahil Saluja on 30.12.2019.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
     * @ngdoc service
     * @name projectLocationMainService
     * @function
     *
     * @description
     * projectLocationMainService is the data service for all location related functionality.
     */
	angular.module('basics.indextable').factory('basicsIndexRateFactorLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsIndexRateFactorLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Description',
				columns: [
					{
						id: 'id',
						field: 'DescriptionInfo.Description',
						name: 'Rate/Factor',
						formatter: 'description',
						name$tr$: 'cloud.common.entityRateFactor'
					}
				],
				uuid: '830d68f417d34e928e2bc60ad511de33'
			});

			let locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/indexheader/', endPointRead: 'ratefactorlist' }
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
