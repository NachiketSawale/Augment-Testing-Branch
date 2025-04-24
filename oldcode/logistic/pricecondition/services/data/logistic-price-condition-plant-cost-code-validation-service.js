/**
 * Created by Nikhil on 31.08.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionPlantCostCodeValidationService
	 * @description provides validation methods for logistic priceCondition PlantCostCode entities
	 */
	angular.module(moduleName).service('logisticPriceConditionPlantCostCodeValidationService', LogisticPriceConditionPlantCostCodeValidationService);

	LogisticPriceConditionPlantCostCodeValidationService.$inject = ['platformValidationServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'logisticPriceConditionConstantValues', 'logisticPriceConditionPlantCostCodeDataService'];

	function LogisticPriceConditionPlantCostCodeValidationService(platformValidationServiceFactory, basicsLookupdataLookupDescriptorService,
		logisticPriceConditionConstantValues, logisticPriceConditionPlantCostCodeDataService) {

		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface(logisticPriceConditionConstantValues.schemes.costCodeRate, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPriceConditionConstantValues.schemes.plantCostCode)
			},
			self,
			logisticPriceConditionPlantCostCodeDataService);

		this.validateAdditionalPlantCostCodeTypeFk = function validateAdditionalPlantCostCodeTypeFk(entity, value) {
			let valueType = basicsLookupdataSimpleLookupService.getItemById(value, { lookupModuleQualifier: 'basics.customize.logisticsplantcostcodetype' });
			if(valueType) {
				entity.UomFromTypeFk = value.Type.UomFk;
			}

			return true;
		};



	}
})(angular);
