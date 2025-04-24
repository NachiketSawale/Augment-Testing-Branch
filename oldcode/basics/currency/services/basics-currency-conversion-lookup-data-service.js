/**
 * Created by Frank on 25.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCurrencyConversionLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCurrencyConversionLookupDataService is the data service for all location related functionality.
	 */
	angular.module('basics.currency').factory('basicsCurrencyConversionLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCurrencyConversionLookupDataService', {
				valMember: 'Id',
				dispMember: 'Comment',
				columns: [
					{
						id: 'CurrencyHome',
						field: 'CurrencyHomeFk',
						name: 'Currency Home',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'basicsCurrencyLookupDataService',
							dataServiceName: 'basicsCurrencyLookupDataService',
							displayMember: 'Currency',
							dispMember:'Currency',
							valMember:'Id'
						},
						name$tr$: 'basics.currency.Currency'
					},
					{
						id: 'CurrencyForeign',
						field: 'CurrencyForeignFk',
						name: 'Currency Foreign',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'basicsCurrencyLookupDataService',
							dataServiceName: 'basicsCurrencyLookupDataService',
							dispMember:'Currency',
							valMember:'Id',
							displayMember: 'Currency'
						},
						name$tr$: 'basics.currency.ForeignCurrency'
					},
					{
						id: 'Comment',
						field: 'Comment',
						name: 'Comment',
						formatter: 'comment',
						name$tr$: 'cloud.common.entityComment'
					}
				],
				uuid: '991bd6b1885c45f7a05bca681b93e155'
			});

			var conversionLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'project/main/currencyconversion/', endPointRead: 'list'},
				filterParam: 'companyId'
			};

			return platformLookupDataServiceFactory.createInstance(conversionLookupDataServiceConfig).service;
		}]);
})(angular);
