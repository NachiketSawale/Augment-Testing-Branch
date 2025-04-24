/**
 * Created by shen on 1/4/2022
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name salesTaxCodeLookupDataService
	 * @function
	 *
	 * @description
	 * salesTaxCodeLookupDataService is the data service for all tax codes
	 */
	angular.module('basics.lookupdata').factory('salesTaxCodeLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesTaxCodeLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'descriptioninfo',
						field: 'DescriptionInfo.Description',
						name: 'Description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'TaxPercent',
						field: 'TaxPercent',
						name: 'Original Percentage',
						formatter: 'quantity',
						width: 100,
						name$tr$: 'cloud.common.entityTaxPercent'
					},	{
						id: 'CalculationOrder',
						field: 'CalculationOrder',
						name: 'Calculation Order',
						formatter: 'integer',
						width: 100,
						name$tr$: 'cloud.common.entityCalculationOrder'
					}
				],
				uuid: '35ceaa7119114b2696a8b5b2ddabccd2'
			});

			let salesTaxCodeDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/salestaxcode/',
					endPointRead: 'lookuplist'
				}
			};

			return platformLookupDataServiceFactory.createInstance(salesTaxCodeDataServiceConfig).service;
		}]);
})(angular);
