
(function (angular) {
	'use strict';
	var moduleName = 'basics.site';
	var module = angular.module(moduleName);

	module.factory('basicsSite2StockDataService', Site2StockDataService);

	Site2StockDataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'basicsSiteMainService', 'platformRuntimeDataService'];

	function Site2StockDataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor, siteMainService, platformRuntimeDataService) {

		var serviceInfo = {
			flatLeafItem: {
				module: module,
				serviceName: 'basicsSite2StockDataService',
				entityNameTranslationID: 'basics.site.entitySite2Stock',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/site/site2stock/'},
				entityRole: {
					leaf: {
						itemName: 'Site2Stocks',
						parentService: siteMainService
					}
				},
				dataProcessor: [{processItem: processItem}],
				presenter: {
					list: {
						initCreationData: function (creationData) {
							creationData.Id = siteMainService.getSelected().Id;
						}
					}
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'Site2StockDto',
			validationService: 'basicsSite2StockValidationService'
		});
		function processItem(item) {
			let fields;
			if (item) {
				fields = [
					{field: 'PrjStockLocationFk', readonly: item.PrjStockFk ? false : true},
				];
			} else {
				fields = [
					{ field: 'PrjStockLocationFk', readonly: true },
				];

			}
			platformRuntimeDataService.readonly(item, fields);
		}

		return container.service;
	}
})(angular);