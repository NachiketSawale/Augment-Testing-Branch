/**
 * Created by baf on 24.08.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionCostCodeRateValidationService
	 * @description provides validation methods for logistic priceCondition CostCodeRate entities
	 */
	angular.module(moduleName).service('logisticPriceConditionCostCodeRateValidationService', LogisticPriceConditionCostCodeRateValidationService);

	LogisticPriceConditionCostCodeRateValidationService.$inject = ['platformValidationServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'logisticPriceConditionConstantValues', 'logisticPriceConditionCostCodeRateDataService'];

	function LogisticPriceConditionCostCodeRateValidationService(platformValidationServiceFactory, basicsLookupdataLookupDescriptorService,
		logisticPriceConditionConstantValues, logisticPriceConditionCostCodeRateDataService) {

		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface(logisticPriceConditionConstantValues.schemes.costCodeRate, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPriceConditionConstantValues.schemes.costCodeRate)
		},
		self,
		logisticPriceConditionCostCodeRateDataService);

		this.validateCostCodeFk = function validateCostCodeFk(entity, value) {
			var coCo = basicsLookupdataLookupDescriptorService.getLookupItem('costcode', value);

			entity.Rate = coCo.Rate;
			entity.SalesPrice = coCo.Rate;
			entity.CurrencyFk = coCo.CurrencyFk;
			return !!coCo;
		};
	}
})(angular);
