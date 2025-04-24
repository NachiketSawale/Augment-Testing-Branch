/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionEquipmentCatalogPriceValidationService
	 * @description provides validation methods for logistic priceCondition equipmentCatalogPrice entities
	 */
	angular.module(moduleName).service('logisticPriceConditionEquipmentCatalogPriceValidationService', LogisticPriceConditionEquipmentCatalogPriceValidationService);

	LogisticPriceConditionEquipmentCatalogPriceValidationService.$inject = ['platformValidationServiceFactory', 'logisticPriceConditionConstantValues',
		'logisticPriceConditionEquipmentCatalogPriceDataService'];

	function LogisticPriceConditionEquipmentCatalogPriceValidationService(platformValidationServiceFactory, logisticPriceConditionConstantValues,
		logisticPriceConditionEquipmentCatalogPriceDataService) {

		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface(logisticPriceConditionConstantValues.schemes.plantCatalogPrice, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPriceConditionConstantValues.schemes.plantCatalogPrice)
		},
		self,
		logisticPriceConditionEquipmentCatalogPriceDataService);
	}
})(angular);
