/**
 * Created by shen on 6/10/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingWorkTimeDerivationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping worktime derivation entity.
	 **/
	angular.module(moduleName).service('timekeepingWorkTimeDerivationLayoutService', TimekeepingWorkTimeDerivationLayoutService);

	TimekeepingWorkTimeDerivationLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingWorktimemodelContainerInformationService','timekeepingWorkTimeModelTranslationService'];

	function TimekeepingWorkTimeDerivationLayoutService(platformUIConfigInitService, timekeepingWorktimemodelContainerInformationService, timekeepingWorkTimeModelTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingWorktimemodelContainerInformationService.getWorkTimeDerivationLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Timekeeping.WorkTimeModel',
				typeName: 'WorkTimeDerivationDto'
			},
			translator: timekeepingWorkTimeModelTranslationService
		});
	}
})(angular);

