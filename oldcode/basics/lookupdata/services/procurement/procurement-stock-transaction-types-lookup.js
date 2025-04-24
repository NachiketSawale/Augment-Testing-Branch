(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementStockTransactionTypesService
	 * @function
	 *
	 * @description
	 * procurementStockTransactionTypesService is the data service for procurementStockTransactionTypes
	 */
	angular.module('basics.lookupdata').factory('procurementStockTransactionTypesService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {
			var readData = {Id: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('procurementStockTransactionTypesService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 200,
						name$tr$: 'cloud.common.descriptionInfo'
					}
				]
			});

			var config = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/customize/prcstocktransactiontype/',
					endPointRead: 'list',
					usePostForRead: true
				},
				filterParam: readData,
			};

			var filters = [
				{
					key: 'TransactionTypeIsDispatchingFilter',
					fn: function (transactionType) {
					    return transactionType.IsDispatching;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			return platformLookupDataServiceFactory.createInstance(config).service;
		}]);
})(angular);
