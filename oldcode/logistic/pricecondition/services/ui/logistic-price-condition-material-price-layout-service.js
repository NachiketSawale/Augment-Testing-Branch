/**
 * Created by baf on 07.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionMaterialPriceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic priceCondition materialPrice entity.
	 **/
	angular.module(moduleName).service('logisticPriceConditionMaterialPriceLayoutService', LogisticPriceConditionMaterialPriceLayoutService);

	LogisticPriceConditionMaterialPriceLayoutService.$inject = ['platformUIConfigInitService', 'logisticPriceconditionContainerInformationService', 'logisticPriceConditionConstantValues', 'logisticPriceConditionTranslationService'];

	function LogisticPriceConditionMaterialPriceLayoutService(platformUIConfigInitService, logisticPriceconditionContainerInformationService, logisticPriceConditionConstantValues, logisticPriceConditionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPriceconditionContainerInformationService.getMaterialPriceLayout(),
			dtoSchemeId: logisticPriceConditionConstantValues.schemes.materialPrice,
			translator: logisticPriceConditionTranslationService
		});
	}
})(angular);