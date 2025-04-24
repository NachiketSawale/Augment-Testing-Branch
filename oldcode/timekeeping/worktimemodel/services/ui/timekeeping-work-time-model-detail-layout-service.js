/**
 * Created by shen on 6/10/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingWorkTimeModelDetailLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping worktimemodel detail entity.
	 **/
	angular.module(moduleName).service('timekeepingWorkTimeModelDetailLayoutService', TimekeepingWorkTimeModelDetailLayoutService);

	TimekeepingWorkTimeModelDetailLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingWorktimemodelContainerInformationService','timekeepingWorkTimeModelTranslationService'];

	function TimekeepingWorkTimeModelDetailLayoutService(platformUIConfigInitService, timekeepingWorktimemodelContainerInformationService, timekeepingWorkTimeModelTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingWorktimemodelContainerInformationService.getWorkTimeModelDtlLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Timekeeping.WorkTimeModel',
				typeName: 'WorkTimeModelDtlDto'
			},
			translator: timekeepingWorkTimeModelTranslationService
		});
	}
})(angular);
