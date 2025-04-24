/**
 * Created by baf on 17.01.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainObservationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  scheduling main observation entity.
	 **/
	angular.module(moduleName).service('schedulingMainObservationLayoutService', SchedulingMainObservationLayoutService);

	SchedulingMainObservationLayoutService.$inject = ['platformUIConfigInitService', 'schedulingMainContainerInformationService', 'schedulingMainConstantValues', 'schedulingMainTranslationService'];

	function SchedulingMainObservationLayoutService(platformUIConfigInitService, schedulingMainContainerInformationService, schedulingMainConstantValues, schedulingMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: schedulingMainContainerInformationService.getObservationLayout(),
			dtoSchemeId: schedulingMainConstantValues.schemes.observation,
			translator: schedulingMainTranslationService
		});
	}
})(angular);