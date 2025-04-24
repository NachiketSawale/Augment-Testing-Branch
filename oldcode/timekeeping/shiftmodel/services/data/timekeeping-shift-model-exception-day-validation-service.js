/**
 * Created by baf on 06.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelExceptionDayValidationService
	 * @description provides validation methods for timekeeping shiftModel exceptionDay entities
	 */
	angular.module(moduleName).service('timekeepingShiftModelExceptionDayValidationService', TimekeepingShiftModelExceptionDayValidationService);

	TimekeepingShiftModelExceptionDayValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelWorkingTimeDataService'];

	function TimekeepingShiftModelExceptionDayValidationService(platformValidationServiceFactory, timekeepingShiftModelConstantValues, timekeepingShiftModelExceptionDayDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingShiftModelConstantValues.schemes.exceptionDay, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingShiftModelConstantValues.schemes.exceptionDay)
		},
		self,
		timekeepingShiftModelExceptionDayDataService);
	}
})(angular);
