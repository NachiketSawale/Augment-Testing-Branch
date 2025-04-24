/**
 * Created by leo on 08.03.2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobCostCodeRateLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job costcode price entity.
	 **/
	angular.module(moduleName).service('logisticJobCostCodeRateUIStandardService', LogisticJobCostCodeRateUIStandardService);

	LogisticJobCostCodeRateUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobCostCodeRateUIStandardService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobCostCodeRateLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'LogisticCostCodeRateDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);