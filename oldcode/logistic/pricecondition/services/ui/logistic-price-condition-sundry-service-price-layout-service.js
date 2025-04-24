/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionSundryServicePriceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic priceCondition sundryServicePrice entity.
	 **/
	angular.module(moduleName).service('logisticPriceConditionSundryServicePriceLayoutService', LogisticPriceConditionSundryServicePriceLayoutService);

	LogisticPriceConditionSundryServicePriceLayoutService.$inject = ['platformUIConfigInitService', 'logisticPriceconditionContainerInformationService', 'logisticPriceConditionTranslationService'];

	function LogisticPriceConditionSundryServicePriceLayoutService(platformUIConfigInitService, logisticPriceconditionContainerInformationService, logisticPriceConditionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPriceconditionContainerInformationService.getLogisticSundryServicePriceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.PriceCondition',
				typeName: 'LogisticSundryServicePriceDto'
			},
			translator: logisticPriceConditionTranslationService
		});
	}
})(angular);