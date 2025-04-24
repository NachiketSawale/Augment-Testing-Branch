/**
 * Created by Sudarshan on 28.06.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelBreakValidationService
	 * @description provides validation methods for timekeeping shiftmodel break entities
	 */
	angular.module(moduleName).service('timekeepingShiftModelBreakValidationService', TimekeepingShiftModelBreakValidationService);

	TimekeepingShiftModelBreakValidationService.$inject = ['timekeepingShiftModelBreakValidationServiceFactory','platformValidationServiceFactory', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelBreakDataService'];

	function TimekeepingShiftModelBreakValidationService(timekeepingShiftModelBreakValidationServiceFactory,platformValidationServiceFactory, timekeepingShiftModelConstantValues,timekeepingShiftModelBreakDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingShiftModelConstantValues.schemes.break, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingShiftModelConstantValues.schemes.break),
			   periods: [{ from: 'BreakStart', to: 'BreakEnd'} ]
			},
			self,
			timekeepingShiftModelBreakDataService);
		timekeepingShiftModelBreakValidationServiceFactory.createTimekeepingShiftBreakValidationService(this, timekeepingShiftModelBreakDataService);
	}
})(angular);
