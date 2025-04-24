/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job  entity.
	 **/
	angular.module(moduleName).service('logisticJobEquipmentCatPriceUIStandardService', LogisticJobEquipmentCatPriceUIStandardService);

	LogisticJobEquipmentCatPriceUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobEquipmentCatPriceUIStandardService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobEquipmentCatPriceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'LogisticEquipmentCatalogPriceDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);