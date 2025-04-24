/**
 * Created by baf on 28.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic price condition entity.
	 **/
	angular.module(moduleName).service('logisticPriceConditionLayoutService', LogisticPriceConditionLayoutService);

	LogisticPriceConditionLayoutService.$inject = ['platformUIConfigInitService', 'logisticPriceconditionContainerInformationService', 'logisticPriceConditionTranslationService'];

	function LogisticPriceConditionLayoutService(platformUIConfigInitService, logisticPriceConditionContainerInformationService, logisticPriceConditionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPriceConditionContainerInformationService.getLogisticPriceConditionLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.PriceCondition',
				typeName: 'PriceConditionDto'
			},
			translator: logisticPriceConditionTranslationService
		});
	}
})(angular);