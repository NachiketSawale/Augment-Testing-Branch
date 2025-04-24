/**
 * Created by baf on 24.08.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionCostCodeRateLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic priceCondition costCodeRate entity.
	 **/
	angular.module(moduleName).service('logisticPriceConditionCostCodeRateLayoutService', LogisticPriceConditionCostCodeRateLayoutService);

	LogisticPriceConditionCostCodeRateLayoutService.$inject = ['platformUIConfigInitService', 'logisticPriceconditionContainerInformationService', 'logisticPriceConditionTranslationService'];

	function LogisticPriceConditionCostCodeRateLayoutService(platformUIConfigInitService, logisticPriceconditionContainerInformationService, logisticPriceConditionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPriceconditionContainerInformationService.getLogisticCostCodeRateLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.PriceCondition',
				typeName: 'LogisticCostCodeRateDto'
			},
			translator: logisticPriceConditionTranslationService
		});
	}
})(angular);