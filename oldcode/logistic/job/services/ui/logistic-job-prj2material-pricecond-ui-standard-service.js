/**
 * Created by leo on 08.03.2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPrj2MaterialPriceCondLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job material entity.
	 **/
	angular.module(moduleName).service('logisticJobPrj2MaterialPriceCondUIStandardService', LogisticJobPrj2MaterialPriceCondUIStandardService);

	LogisticJobPrj2MaterialPriceCondUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobPrj2MaterialPriceCondUIStandardService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobPrj2MaterialPriceCondLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'Project2MaterialPriceConditionDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);