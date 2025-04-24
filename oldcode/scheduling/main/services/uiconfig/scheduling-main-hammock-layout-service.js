/**
 * Created by nitsche on 13.06.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainHammockLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  scheduling main hammock entity.
	 **/
	angular.module(moduleName).service('schedulingMainHammockLayoutService', SchedulingMainHammockLayoutService);

	SchedulingMainHammockLayoutService.$inject = ['platformUIConfigInitService', 'schedulingMainContainerInformationService', 'schedulingMainTranslationService'];

	function SchedulingMainHammockLayoutService(platformUIConfigInitService, schedulingMainContainerInformationService, schedulingMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: schedulingMainContainerInformationService.getHammockLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Scheduling.Main',
				typeName: 'HammockActivityDto'
			},
			translator: schedulingMainTranslationService
		});
	}
})(angular);