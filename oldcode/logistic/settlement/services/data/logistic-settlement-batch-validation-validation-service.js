/**
 * Created by baf on 28.06.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementBatchValidationValidationService
	 * @description provides validation methods for logistic settlement batchValidation entities
	 */
	angular.module(moduleName).service('logisticSettlementBatchValidationValidationService', LogisticSettlementBatchValidationValidationService);

	LogisticSettlementBatchValidationValidationService.$inject = ['platformValidationServiceFactory', 'logisticSettlementConstantValues', 'logisticSettlementBatchValidationDataService'];

	function LogisticSettlementBatchValidationValidationService(platformValidationServiceFactory, logisticSettlementConstantValues, logisticSettlementBatchValidationDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSettlementConstantValues.schemes.batchvalidation, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSettlementConstantValues.schemes.batchvalidation)
		},
		self,
		logisticSettlementBatchValidationDataService);
	}
})(angular);
