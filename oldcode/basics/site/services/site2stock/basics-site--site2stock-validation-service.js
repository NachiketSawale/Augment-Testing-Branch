(function (angular) {
	'use strict';

	var moduleName = 'basics.site';

	angular.module(moduleName).factory('basicsSite2StockValidationService', Site2StockValidationService);

	Site2StockValidationService.$inject = ['platformDataValidationService', 'basicsSite2StockDataService', 'platformRuntimeDataService'];

	function Site2StockValidationService(platformDataValidationService, dataService, platformRuntimeDataService) {
		var service = {};

		service.validatePrjStockFk = function (entity, value, model) {
			platformRuntimeDataService.readonly(entity, [{ field: 'PrjStockLocationFk', readonly: !value }]);
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validatePrjStocklocationFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		return service;
	}
})(angular);