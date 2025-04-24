/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionPlantPriceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic priceCondition plantPrice entity.
	 **/
	angular.module(moduleName).service('logisticPriceConditionPlantPriceLayoutService', LogisticPriceConditionPlantPriceLayoutService);

	LogisticPriceConditionPlantPriceLayoutService.$inject = ['platformUIConfigInitService', 'logisticPriceconditionContainerInformationService', 'logisticPriceConditionTranslationService'];

	function LogisticPriceConditionPlantPriceLayoutService(platformUIConfigInitService, logisticPriceconditionContainerInformationService, logisticPriceConditionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPriceconditionContainerInformationService.getLogisticPlantPriceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.PriceCondition',
				typeName: 'LogisticPlantPriceDto'
			},
			translator: logisticPriceConditionTranslationService
		});
	}
})(angular);