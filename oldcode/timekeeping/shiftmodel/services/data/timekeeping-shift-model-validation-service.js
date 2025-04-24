/**
 * Created by leo on 02.05.2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelValidationService
	 * @description provides validation methods for shift model
	 */
	var moduleName='timekeeping.shiftmodel';
	angular.module(moduleName).service('timekeepingShiftModelValidationService', TimekeepingShiftModelValidationService);

	TimekeepingShiftModelValidationService.$inject = [ 'platformValidationServiceFactory','timekeepingShiftModelConstantValues',
		'timekeepingShiftModelDataService'];

	function TimekeepingShiftModelValidationService(platformValidationServiceFactory, timekeepingShiftModelConstantValues, timekeepingShiftModelDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingShiftModelConstantValues.schemes.shift, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingShiftModelConstantValues.schemes.shift)
		},
		self,
		timekeepingShiftModelDataService);
	}

})(angular);
