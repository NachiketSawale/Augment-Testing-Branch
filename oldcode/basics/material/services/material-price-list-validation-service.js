/**
 * Created by chi on 5/26/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialPriceListValidationService', basicsMaterialPriceListValidationService);
	basicsMaterialPriceListValidationService.$inject = ['_', '$q', 'math', 'platformDataValidationService', 'basicsMaterialPriceListPriceConditionDataService',
		'basicsLookupdataLookupDescriptorService'];
	function basicsMaterialPriceListValidationService(_, $q, math, platformDataValidationService, basicsMaterialPriceListPriceConditionDataService,
		basicsLookupdataLookupDescriptorService) {
		return function (dataService) {	
	        var service = {
				validateMaterialPriceVersionFk: validateMaterialPriceVersionFk,
				asyncValidatePrcPriceConditionFk: asyncValidatePrcPriceConditionFk,
				validateListPrice: calculateCost,
				validateDiscount: calculateCost,
				validateCharges: calculateCost,
				validatePriceExtras: calculateCost,
				validateTaxCodeFk: validateTaxCodeFk,
				validateCostPriceGross: validateCostPriceGross
			};

			return service;

	        //////////////////////
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
				return result;
			}

			function asyncValidatePrcPriceConditionFk(entity, value){
				var defer = $q.defer();
				entity.PrcPriceConditionFk = value;
				basicsMaterialPriceListPriceConditionDataService.reload(entity, value).then(function()
				{
					defer.resolve(true);
				}, function(){
					defer.resolve(true);
				});

				return defer.promise;
			}

			function calculateCost(entity, value, model) {
				entity[model] = value;
				dataService.calculateCost(entity, true);
				return true;
			}

			function validateTaxCodeFk(entity, value) {
				entity.TaxCodeFk = value;
				dataService.setCostPriceGross (entity);
				return true;
			}

			function validateCostPriceGross(entity, value) {
				dataService.recalculatePriceByPriceGross(entity, value);
			}

		};
	}
})(angular);