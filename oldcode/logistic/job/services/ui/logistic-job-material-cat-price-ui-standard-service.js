/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobMaterialCatPriceUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job materialCatPriceUI entity.
	 **/
	angular.module(moduleName).service('logisticJobMaterialCatPriceUIStandardService', LogisticJobMaterialCatPriceUIStandardService);

	LogisticJobMaterialCatPriceUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobMaterialCatPriceUIStandardService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobMaterialCatPriceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'LogisticMaterialCatalogPriceDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);