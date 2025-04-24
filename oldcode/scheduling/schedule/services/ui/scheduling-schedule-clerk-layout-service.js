/**
 * Created by baf on 21.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleClerkLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  scheduling schedule clerk entity.
	 **/
	angular.module(moduleName).service('schedulingScheduleClerkLayoutService', SchedulingScheduleClerkLayoutService);

	SchedulingScheduleClerkLayoutService.$inject = ['platformUIConfigInitService', 'schedulingScheduleContainerInformationService', 'schedulingScheduleTranslationService'];

	function SchedulingScheduleClerkLayoutService(platformUIConfigInitService, schedulingScheduleContainerInformationService, schedulingScheduleTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: schedulingScheduleContainerInformationService.getSchedulingScheduleClerkLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Scheduling.Schedule',
				typeName: 'Schedule2ClerkDto'
			},
			translator: schedulingScheduleTranslationService
		});
	}
})(angular);