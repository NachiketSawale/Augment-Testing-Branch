/**
 * Created by jpfriedel on 30/3/2022
 */


(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeSymbol2WorkTimeModelLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping worktimemodel day entity.
	 **/
	angular.module(moduleName).service('timekeepingTimeSymbol2WorkTimeModelLayoutService', TimekeepingTimeSymbol2WorkTimeModelLayoutService);

	TimekeepingTimeSymbol2WorkTimeModelLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingWorktimemodelContainerInformationService','timekeepingWorkTimeModelConstantValues', 'timekeepingWorkTimeModelTranslationService'];

	function TimekeepingTimeSymbol2WorkTimeModelLayoutService(platformUIConfigInitService, timekeepingWorktimemodelContainerInformationService, timekeepingWorkTimeModelConstantValues,timekeepingWorkTimeModelTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingWorktimemodelContainerInformationService.getTimeSymbol2WorkTimeModelLayout(),
			dtoSchemeId:timekeepingWorkTimeModelConstantValues.schemes.ts2wtm,
			translator: timekeepingWorkTimeModelTranslationService
		});
	}
})(angular);