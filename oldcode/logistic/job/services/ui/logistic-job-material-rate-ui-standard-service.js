/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobMaterialRateUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job material rateUI entity.
	 **/
	angular.module(moduleName).service('logisticJobMaterialRateUIStandardService', LogisticJobMaterialRateUIStandardService);

	LogisticJobMaterialRateUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobMaterialRateUIStandardService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobMaterialRateLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'LogisticMaterialRateDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);