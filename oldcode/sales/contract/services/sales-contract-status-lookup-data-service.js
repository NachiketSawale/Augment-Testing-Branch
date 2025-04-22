/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesContractStatusLookupDataService
	 * @function
	 *
	 * @description
	 * salesContractStatusLookupDataService is the data service for sales contract status
	 */
	angular.module('sales.contract').factory('salesContractStatusLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesContractStatusLookupDataService', {
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
				uuid: '5c35c2f09e7f4605ad9ff00dcdbadd65'
			});

			var salesContractStatusLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'sales/contract/status/', endPointRead: 'list' }
			};

			return platformLookupDataServiceFactory.createInstance(salesContractStatusLookupDataServiceConfig).service;
		}]);
})();
