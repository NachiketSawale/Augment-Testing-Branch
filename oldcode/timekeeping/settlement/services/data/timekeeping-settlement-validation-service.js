/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc service
	 * @name timekeepingSettlementValidationService
	 * @description provides validation methods for timekeeping settlement entities
	 */
	angular.module(moduleName).service('timekeepingSettlementValidationService', TimekeepingSettlementValidationService);

	TimekeepingSettlementValidationService.$inject = ['_', 'platformValidationServiceFactory', 'timekeepingSettlementConstantValues', 'timekeepingSettlementDataService'];

	function TimekeepingSettlementValidationService(_, platformValidationServiceFactory, timekeepingSettlementConstantValues, timekeepingSettlementDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingSettlementConstantValues.schemes.settlement, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingSettlementConstantValues.schemes.settlement)
		},
		self,
		timekeepingSettlementDataService);

	}
})(angular);
