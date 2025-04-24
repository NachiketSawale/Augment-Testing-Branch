/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingPlantLocationReceivingLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching  entity.
	 **/
	angular.module(moduleName).service('logisticDispatchingPlantLocationReceivingLayoutService', LogisticDispatchingPlantLocationReceivingLayoutService);

	LogisticDispatchingPlantLocationReceivingLayoutService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingPlantLocationReceivingLayoutService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getLogisticDispatchingPlantLocationLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'JobPlantAllocationDto'
			},
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);