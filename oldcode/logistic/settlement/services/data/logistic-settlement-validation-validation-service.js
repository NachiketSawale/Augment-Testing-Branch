/**
 * Created by baf on 09.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementValidationValidationService
	 * @description provides validation methods for logistic settlement validation entities
	 */
	angular.module(moduleName).service('logisticSettlementValidationValidationService', LogisticSettlementValidationValidationService);

	LogisticSettlementValidationValidationService.$inject = ['platformValidationServiceFactory', 'logisticSettlementConstantValues', 'logisticSettlementValidationDataService'];

	function LogisticSettlementValidationValidationService(platformValidationServiceFactory, logisticSettlementConstantValues, logisticSettlementValidationDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSettlementConstantValues.schemes.validation, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSettlementConstantValues.schemes.validation)
		},
		self,
		logisticSettlementValidationDataService);
	}
})(angular);
