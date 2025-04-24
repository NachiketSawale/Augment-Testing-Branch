/**
 * Created by leo on 08.03.2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobCostCodePriceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job costcode price entity.
	 **/
	angular.module(moduleName).service('logisticJobCostCodePriceUIStandardService', LogisticJobCostCodePriceUIStandardService);

	LogisticJobCostCodePriceUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobCostCodePriceUIStandardService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobCostCodePriceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'LogisticCostCodePriceDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);