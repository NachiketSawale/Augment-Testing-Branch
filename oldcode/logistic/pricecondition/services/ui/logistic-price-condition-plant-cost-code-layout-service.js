/**
 * Created by Nikhil on 01.09.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionPlantCostCodeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic priceCondition sundryServicePrice entity.
	 **/
	angular.module(moduleName).service('logisticPriceConditionPlantCostCodeLayoutService', LogisticPriceConditionPlantCostCodeLayoutService);

	LogisticPriceConditionPlantCostCodeLayoutService.$inject = ['platformUIConfigInitService', 'logisticPriceconditionContainerInformationService', 'logisticPriceConditionTranslationService'];

	function LogisticPriceConditionPlantCostCodeLayoutService(platformUIConfigInitService, logisticPriceconditionContainerInformationService, logisticPriceConditionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPriceconditionContainerInformationService.getLogisticPlantCostCodeLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.PriceCondition',
				typeName: 'PlantCostCodeDto'
			},
			translator: logisticPriceConditionTranslationService
		});
	}
})(angular);