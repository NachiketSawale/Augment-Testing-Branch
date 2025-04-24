/**
 */

(function (angular) {
	'use strict';
	/* global globals */

	/**
	 * @ngdoc service
	 * @name procurementStructureAccountLookupDataService
	 * @function
	 *
	 * @description
	 * procurementStructureAccountLookupDataService is the data service for all Account related functionality.
	 */
	angular.module('basics.efbsheets').factory('procurementStructureAccountLookupDataService', ['$http','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($http,platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('procurementStructureAccountLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'isBalanceSheet',
						field: 'IsBalanceSheet',
						name: 'Is Balance Sheet',
						formatter: 'boolean',
						name$tr$: 'basics.procurementstructure.isBalanceSheet'
					},
					{
						id: 'isProfitAndLoss',
						field: 'IsProfitAndLoss',
						name: 'Is Profit And Loss',
						formatter: 'boolean',
						name$tr$: 'basics.procurementstructure.isProfitAndLoss'
					},
					{
						id: 'isCostCode',
						field: 'IsCostCode',
						name: 'Is Cost Code',
						formatter: 'boolean',
						name$tr$: 'basics.procurementstructure.isCostCode'
					},
					{
						id: 'isRevenueCode',
						field: 'IsRevenueCode',
						name: 'Is Revenue Code',
						formatter: 'boolean',
						name$tr$: 'basics.procurementstructure.isRevenueCode'
					}
				],
				uuid: 'ae7ce2f0f1d24bfc91d6300b18e636ad'
			});

			let procurementStructureAccountLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/lookupdata/master/', endPointRead: 'getlist?lookup=basaccount' }
			};

			return platformLookupDataServiceFactory.createInstance(procurementStructureAccountLookupDataServiceConfig).service;

		}]);
})(angular);
