/**
 * Created by baf on 2019-02-05
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementBillingSchemaValidationService
	 * @description provides validation methods for logistic settlement billing schema entities
	 */
	angular.module(moduleName).service('logisticSettlementBillingSchemaValidationService', LogisticSettlementBillingSchemaValidationService);

	LogisticSettlementBillingSchemaValidationService.$inject = ['platformValidationServiceFactory', 'logisticSettlementConstantValues', 'logisticSettlementDataService'];

	function LogisticSettlementBillingSchemaValidationService(platformValidationServiceFactory, logisticSettlementConstantValues, logisticSettlementBillingSchemaDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSettlementConstantValues.schemes.billingSchema, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSettlementConstantValues.schemes.billingSchema)
			},
			self,
			logisticSettlementBillingSchemaDataService);
	}
})(angular);
