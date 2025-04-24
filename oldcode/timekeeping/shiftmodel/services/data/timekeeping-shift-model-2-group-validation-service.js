(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModel2GroupValidationService
	 * @description provides validation methods for timekeeping shiftModel2group entities
	 */
	angular.module(moduleName).service('timekeepingShiftModel2GroupValidationService', TimekeepingShiftModel2GroupValidationService);

	TimekeepingShiftModel2GroupValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModel2GroupDataService'];

	function TimekeepingShiftModel2GroupValidationService(platformValidationServiceFactory, timekeepingShiftModelConstantValues, timekeepingShiftModel2GroupDataService) {

		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingShiftModelConstantValues.schemes.shift2Group, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingShiftModelConstantValues.schemes.shift2Group)
		},
		self,
		timekeepingShiftModel2GroupDataService);
	}
})(angular);
