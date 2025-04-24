/**
 * Created by baf on 07.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionMaterialPriceValidationService
	 * @description provides validation methods for logistic priceCondition materialPrice entities
	 */
	angular.module(moduleName).service('logisticPriceConditionMaterialPriceValidationService', LogisticPriceConditionMaterialPriceValidationService);

	LogisticPriceConditionMaterialPriceValidationService.$inject = ['platformValidationServiceFactory', 'logisticPriceConditionConstantValues', 'logisticPriceConditionMaterialPriceDataService','$http','platformDataValidationService'];

	function LogisticPriceConditionMaterialPriceValidationService(platformValidationServiceFactory, logisticPriceConditionConstantValues, logisticPriceConditionMaterialPriceDataService,$http,platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticPriceConditionConstantValues.schemes.materialPrice, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPriceConditionConstantValues.schemes.materialPrice),
			periods: [{from: 'ValidFrom', to: 'ValidTo'}]
		},
		self,
		logisticPriceConditionMaterialPriceDataService);
	}
})(angular);
