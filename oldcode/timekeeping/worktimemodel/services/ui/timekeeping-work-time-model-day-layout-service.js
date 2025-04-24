/**
 * Created by shen on 6/10/2021
 */


(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingWorkTimeModelDayLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping worktimemodel day entity.
	 **/
	angular.module(moduleName).service('timekeepingWorkTimeModelDayLayoutService', TimekeepingWorkTimeModelDayLayoutService);

	TimekeepingWorkTimeModelDayLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingWorktimemodelContainerInformationService','timekeepingWorkTimeModelConstantValues', 'timekeepingWorkTimeModelTranslationService'];

	function TimekeepingWorkTimeModelDayLayoutService(platformUIConfigInitService, timekeepingWorktimemodelContainerInformationService, timekeepingWorkTimeModelConstantValues,timekeepingWorkTimeModelTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingWorktimemodelContainerInformationService.getWorkTimeModelDayLayout(),
			dtoSchemeId:timekeepingWorkTimeModelConstantValues.schemes.day,
			translator: timekeepingWorkTimeModelTranslationService
		});
	}
})(angular);
