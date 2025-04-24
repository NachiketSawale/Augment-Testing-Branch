
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceCatalogLookupDataService
	 * @function
	 *
	 * @description
	 * resourceCatalogLookupDataService is the data service for all controlling catalog related functionality.
	 */
	angular.module('object.project').factory('resourceCatalogLookupDataService', ['_', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'basicsCurrencyLookupDataService',

		function (_, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, basicsCurrencyLookupDataService) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceCatalogLookupDataService', {
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
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 200,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Currency',
						field: 'CurrencyFk',
						name: 'Currency',
						name$tr$: 'cloud.common.entityCurrency',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCurrencyLookupDataService',
							cacheEnable: true,
							additionalColumns: false
						}).grid.formatterOptions
					}
				],
				uuid: 'e384e8dce6c3437dabc82530b6321bd7'
			});

			var resourceCatalogLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'resource/catalog/catalog/', endPointRead: 'searchlist'}
			};

			var service = platformLookupDataServiceFactory.createInstance(resourceCatalogLookupDataServiceConfig).service;

			var currencyMapping = [];

			basicsCurrencyLookupDataService.getList({lookupType: 'basicsCurrencyLookupDataService'}).then(function (response){
				currencyMapping = response;
			});

			var setCurrency = function (item) {
				if (item && item.CurrencyFk){
					var temp = _.find(currencyMapping,function(curItem){return curItem.Id === item.CurrencyFk;});
					if(temp && temp.Currency){
						item.Currency = temp.Currency;
					}
				}
				return item;
			};

			// adding Currency property to promise's return item of getItemByIdAsync service method
			var tempGetItemByIdAsync = service.getItemByIdAsync;
			service.getItemByIdAsync = function getItemByIdAsync(ID, option) {
				return tempGetItemByIdAsync(ID, option).then(function (response) {
					var temp = response;
					return setCurrency(temp);
				});
			};

			// adding Currency property to return item of getItemById service method
			var tempGetItemById = service.getItemById;
			service.getItemById = function (ID, option) {
				var item = tempGetItemById(ID, option);
				return setCurrency(item);
			};

			return service;
		}]);
})(angular);
