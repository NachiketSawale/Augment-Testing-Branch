/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionMaterialCatalogPriceValidationService
	 * @description provides validation methods for logistic priceCondition materialCatalogPrice entities
	 */
	angular.module(moduleName).service('logisticPriceConditionMaterialCatalogPriceValidationService', LogisticPriceConditionMaterialCatalogPriceValidationService);

	LogisticPriceConditionMaterialCatalogPriceValidationService.$inject = ['platformValidationServiceFactory', 'platformDataValidationService',
		'logisticPriceConditionConstantValues', 'logisticPriceConditionMaterialCatalogPriceDataService'];

	function LogisticPriceConditionMaterialCatalogPriceValidationService(platformValidationServiceFactory, platformDataValidationService,
		logisticPriceConditionConstantValues, logisticPriceConditionMaterialCatalogPriceDataService) {

		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(
			logisticPriceConditionConstantValues.schemes.materialCatalogPrice,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPriceConditionConstantValues.schemes.materialCatalogPrice)
			},
			self,
			logisticPriceConditionMaterialCatalogPriceDataService);
	}

})(angular);
