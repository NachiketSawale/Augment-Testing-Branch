/**
 * Created by baf on 27.06.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementBatchValidationService
	 * @description provides validation methods for logistic settlement batch entities
	 */
	angular.module(moduleName).service('logisticSettlementBatchValidationService', LogisticSettlementBatchValidationService);

	LogisticSettlementBatchValidationService.$inject = ['platformValidationServiceFactory', 'logisticSettlementConstantValues', 'logisticSettlementBatchDataService'];

	function LogisticSettlementBatchValidationService(platformValidationServiceFactory, logisticSettlementConstantValues, logisticSettlementBatchDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSettlementConstantValues.schemes.batch, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSettlementConstantValues.schemes.batch)
		},
		self,
		logisticSettlementBatchDataService);
	}
})(angular);
