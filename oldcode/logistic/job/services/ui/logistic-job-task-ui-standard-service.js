/**
 * Created by welss on 12.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobTaskLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job task entity.
	 **/
	angular.module(moduleName).service('logisticJobTaskUIStandardService', LogisticJobTaskUIStandardService);

	LogisticJobTaskUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobTaskUIStandardService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobTaskLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'JobTaskDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);