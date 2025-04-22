/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';

	/**
	 * @ngdoc service
	 * @name salesWipStatusLookupDataService
	 * @function
	 *
	 * @description
	 * salesWipStatusLookupDataService is the data service for sales wip status
	 */
	angular.module('sales.wip').factory('salesWipStatusLookupDataService', ['globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesWipStatusLookupDataService', {
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
				uuid: 'bd2a6aa453a64a01907b18efcd2cb14f'
			});

			var salesWipStatusLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'sales/wip/status/', endPointRead: 'list' }
			};

			return platformLookupDataServiceFactory.createInstance(salesWipStatusLookupDataServiceConfig).service;
		}]);
})();
