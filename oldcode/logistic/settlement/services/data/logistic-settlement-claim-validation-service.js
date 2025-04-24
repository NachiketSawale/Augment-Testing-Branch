/**
 * Created by chin-han.lai on 01/09/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementClaimValidationService
	 * @description provides validation methods for logistic settlement claim entities
	 */
	angular.module(moduleName).service('logisticSettlementClaimValidationService', LogisticSettlementClaimValidationService);

	LogisticSettlementClaimValidationService.$inject = ['platformValidationServiceFactory', 'logisticSettlementConstantValues', 'logisticSettlementClaimDataService'];

	function LogisticSettlementClaimValidationService(platformValidationServiceFactory, logisticSettlementConstantValues, logisticSettlementClaimDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSettlementConstantValues.schemes.settlementClaim, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSettlementConstantValues.schemes.settlementClaim)
		},
		self,
		logisticSettlementClaimDataService);
	}
})(angular);
