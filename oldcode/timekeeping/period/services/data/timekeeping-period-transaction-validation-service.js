/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.period';

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodTransactionValidationService
	 * @description provides validation methods for timekeeping period period entities
	 */
	angular.module(moduleName).service('timekeepingPeriodTransactionValidationService', TimekeepingTransactionValidationService);

	TimekeepingTransactionValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingPeriodConstantValues', 'timekeepingPeriodTransactionDataService'];

	function TimekeepingTransactionValidationService(platformValidationServiceFactory, timekeepingPeriodConstantValues, timekeepingPeriodTransactionDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingPeriodConstantValues.schemes.transaction, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingPeriodConstantValues.schemes.transaction)
		},
		self,
		timekeepingPeriodTransactionDataService);
	}
})(angular);
