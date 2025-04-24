/**
 * Created by baf on 06.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelWorkingTimeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping shiftModel workingTime entity.
	 **/
	angular.module(moduleName).service('timekeepingShiftModelWorkingTimeLayoutService', TimekeepingShiftModelWorkingTimeLayoutService);

	TimekeepingShiftModelWorkingTimeLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingShiftmodelContainerInformationService', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelTranslationService'];

	function TimekeepingShiftModelWorkingTimeLayoutService(platformUIConfigInitService, timekeepingShiftmodelContainerInformationService, timekeepingShiftModelConstantValues, timekeepingShiftModelTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingShiftmodelContainerInformationService.getWorkingTimeLayout(),
			dtoSchemeId: timekeepingShiftModelConstantValues.schemes.workingTime,
			translator: timekeepingShiftModelTranslationService
		});
	}
})(angular);