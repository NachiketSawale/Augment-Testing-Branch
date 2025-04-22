/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesBillingStatusLookupDataService
	 * @function
	 *
	 * @description
	 * salesBillingStatusLookupDataService is the data service for sales billing status
	 */
	angular.module('sales.billing').factory('salesBillingStatusLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesBillingStatusLookupDataService', {
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
				uuid: '156197ff77d0447f94f824dea0cd1d24'
			});

			var salesBillingStatusLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'sales/billing/status/', endPointRead: 'list' }
			};

			return platformLookupDataServiceFactory.createInstance(salesBillingStatusLookupDataServiceConfig).service;
		}]);
})();
