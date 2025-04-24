/**
 * Created by Frank on 25.02.2015.
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
	angular.module('basics.currency').factory('basicsCurrencyLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCurrencyLookupDataService', {
				valMember: 'Id',
				dispMember: 'Currency',
				columns: [
					{
						id: 'Currency',
						field: 'Currency',
						name: 'Currency',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCurrency'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'e4938ef1c6744c348a1265db2354a8d0'
			});

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/currency/', endPointRead: 'list' }
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
