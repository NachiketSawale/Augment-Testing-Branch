/**
 * Created by Frank on 08.01.2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsForeignCurrencyLookupService
	 * @function
	 *
	 * @description
	 * basicsForeignCurrencyLookupService is the data service for all foreign currencies allowed to a home currencies
	 */
	angular.module('basics.currency').service('basicsForeignCurrencyLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsForeignCurrencyLookupService', {
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
				uuid: '3bf3e20418e24950903fdf46aea95e3c'
			});

			var basicsForeignCurrencyLookupServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/currency/', endPointRead: 'listforeign' },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsForeignCurrencyLookupServiceConfig).service;
		}]);
})(angular);