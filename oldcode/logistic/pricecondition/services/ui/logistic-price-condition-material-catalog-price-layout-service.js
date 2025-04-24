/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionMaterialCatalogPriceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic priceCondition materialCatalogPrice entity.
	 **/
	angular.module(moduleName).service('logisticPriceConditionMaterialCatalogPriceLayoutService', LogisticPriceConditionMaterialCatalogPriceLayoutService);

	LogisticPriceConditionMaterialCatalogPriceLayoutService.$inject = ['platformUIConfigInitService', 'logisticPriceconditionContainerInformationService', 'logisticPriceConditionTranslationService'];

	function LogisticPriceConditionMaterialCatalogPriceLayoutService(platformUIConfigInitService, logisticPriceconditionContainerInformationService, logisticPriceConditionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPriceconditionContainerInformationService.getLogisticMaterialCatalogPriceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.PriceCondition',
				typeName: 'LogisticMaterialCatalogPriceDto'
			},
			translator: logisticPriceConditionTranslationService
		});
	}
})(angular);