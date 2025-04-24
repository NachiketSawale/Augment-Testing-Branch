/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionEquipmentCatalogPriceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic priceCondition equipmentCatalogPrice entity.
	 **/
	angular.module(moduleName).service('logisticPriceConditionEquipmentCatalogPriceLayoutService', LogisticPriceConditionEquipmentCatalogPriceLayoutService);

	LogisticPriceConditionEquipmentCatalogPriceLayoutService.$inject = ['platformUIConfigInitService', 'logisticPriceconditionContainerInformationService', 'logisticPriceConditionTranslationService'];

	function LogisticPriceConditionEquipmentCatalogPriceLayoutService(platformUIConfigInitService, logisticPriceconditionContainerInformationService, logisticPriceConditionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPriceconditionContainerInformationService.getLogisticEquipmentCatalogPriceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.PriceCondition',
				typeName: 'LogisticEquipCatalogPriceDto'
			},
			translator: logisticPriceConditionTranslationService
		});
	}
})(angular);