/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc service
	 * @name timekeepingSettlementItemValidationService
	 * @description provides validation methods for timekeeping settlement item entities
	 */
	angular.module(moduleName).service('timekeepingSettlementItemValidationService', TimekeepingSettlementItemValidationService);

	TimekeepingSettlementItemValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingSettlementConstantValues', 'timekeepingSettlementItemDataService'];

	function TimekeepingSettlementItemValidationService(platformValidationServiceFactory, timekeepingSettlementConstantValues, timekeepingSettlementItemDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingSettlementConstantValues.schemes.item, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingSettlementConstantValues.schemes.item)
		},
		self,
		timekeepingSettlementItemDataService);
	}
})(angular);
