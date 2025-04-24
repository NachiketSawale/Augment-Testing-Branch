/**
 * Created by leo on 08.03.2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPrj2MaterialLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job material entity.
	 **/
	angular.module(moduleName).service('logisticJobPrj2MaterialUIStandardService', LogisticJobPrj2MaterialUIStandardService);

	LogisticJobPrj2MaterialUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobPrj2MaterialUIStandardService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobPrj2MaterialLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'Project2MaterialDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);