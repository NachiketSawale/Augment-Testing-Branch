/**
 * Created by baf on 01.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic price  entity.
	 **/
	angular.module(moduleName).service('logisticPriceConditionItemLayoutService', LogisticPriceConditionItemLayoutService);

	LogisticPriceConditionItemLayoutService.$inject = ['platformUIConfigInitService', 'logisticPriceconditionContainerInformationService', 'logisticPriceConditionTranslationService'];

	function LogisticPriceConditionItemLayoutService(platformUIConfigInitService, logisticPriceConditionContainerInformationService, logisticPriceConditionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPriceConditionContainerInformationService.getLogisticPriceConditionItemLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.PriceCondition',
				typeName: 'PriceConditionItemDto'
			},
			translator: logisticPriceConditionTranslationService
		});
	}
})(angular);