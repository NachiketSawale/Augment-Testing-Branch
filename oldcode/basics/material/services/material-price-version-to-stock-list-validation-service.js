/**
 * Created by lw on 11/10/2021.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialPriceVersionToStockListValidationService', basicsMaterialPriceVersionToStockListValidationService);
	basicsMaterialPriceVersionToStockListValidationService.$inject = ['platformRuntimeDataService', 'platformDataValidationService'];
	function basicsMaterialPriceVersionToStockListValidationService(platformRuntimeDataService, platformDataValidationService) {
		return function (dataService) {
			var service = {
				validateMaterialPriceVersionFk: validateMaterialPriceVersionFk
			};
			return service;

	        function validateMaterialPriceVersionFk(entity, value, model, notUpdate) {
				var tempValue = value === -1 ? '' : value;
				var dataListToCheck = angular.copy(dataService.getList());
				var result = platformDataValidationService.validateMandatoryUniqEntity(entity, tempValue, model, dataListToCheck, service, dataService);
				if (result.valid && !notUpdate) {
					var priceVersion = _.find(basicsLookupdataLookupDescriptorService.getData('MaterialPriceVersion'), {Id: value});
					if (priceVersion) {
						entity.CurrencyFk = priceVersion.PriceListCurrencyFk;
					}
				}
				var readOnlyField = [{field: 'PrjStockFk', readonly: true}];
				platformRuntimeDataService.readonly(entity, readOnlyField);
				return result;
			}
		};
	}
})(angular);



