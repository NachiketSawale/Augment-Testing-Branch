/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';

	/**
	 * @ngdoc service
	 * @name salesBidStatusLookupDataService
	 * @function
	 *
	 * @description
	 * salesBidStatusLookupDataService is the data service for sales bid status
	 */
	angular.module('sales.bid').factory('salesBidStatusLookupDataService', ['globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesBidStatusLookupDataService', {
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
				uuid: '636627460b11487d9635af184b68a801'
			});

			var salesBidStatusLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'sales/bid/status/', endPointRead: 'list' }
			};

			return platformLookupDataServiceFactory.createInstance(salesBidStatusLookupDataServiceConfig).service;
		}]);
})();
