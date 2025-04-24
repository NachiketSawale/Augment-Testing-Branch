/**
 * Created by baf on 06.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelExceptionDayLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping shiftModel exceptionDay entity.
	 **/
	angular.module(moduleName).service('timekeepingShiftModelExceptionDayLayoutService', TimekeepingShiftModelExceptionDayLayoutService);

	TimekeepingShiftModelExceptionDayLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingShiftmodelContainerInformationService', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelTranslationService'];

	function TimekeepingShiftModelExceptionDayLayoutService(platformUIConfigInitService, timekeepingShiftmodelContainerInformationService, timekeepingShiftModelConstantValues, timekeepingShiftModelTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingShiftmodelContainerInformationService.getExceptionDayLayout(),
			dtoSchemeId: timekeepingShiftModelConstantValues.schemes.exceptionDay,
			translator: timekeepingShiftModelTranslationService
		});
	}
})(angular);