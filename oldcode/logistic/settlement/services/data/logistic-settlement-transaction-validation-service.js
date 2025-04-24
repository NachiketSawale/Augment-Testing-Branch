/**
 * Created by baf on 2019-02-05
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementTransactionValidationService
	 * @description provides validation methods for logistic settlement transaction entities
	 */
	angular.module(moduleName).service('logisticSettlementTransactionValidationService', LogisticSettlementTransactionValidationService);

	LogisticSettlementTransactionValidationService.$inject = ['platformValidationServiceFactory', 'logisticSettlementConstantValues', 'logisticSettlementDataService'];

	function LogisticSettlementTransactionValidationService(platformValidationServiceFactory, logisticSettlementConstantValues, logisticSettlementTransactionDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSettlementConstantValues.schemes.transaction, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSettlementConstantValues.schemes.transaction)
			},
			self,
			logisticSettlementTransactionDataService);
	}
})(angular);
