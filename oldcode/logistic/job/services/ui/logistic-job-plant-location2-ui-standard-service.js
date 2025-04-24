/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantLocation2LayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job  entity.
	 **/
	angular.module(moduleName).service('logisticJobPlantLocation2LayoutService', LogisticJobPlantLocation2LayoutService);

	LogisticJobPlantLocation2LayoutService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobPlantLocation2LayoutService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobPlantLocationLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'JobPlantAllocationDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);