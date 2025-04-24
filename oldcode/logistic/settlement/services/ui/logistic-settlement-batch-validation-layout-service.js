/**
 * Created by baf on 28.06.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementBatchValidationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement batchValidation entity.
	 **/
	angular.module(moduleName).service('logisticSettlementBatchValidationLayoutService', LogisticSettlementBatchValidationLayoutService);

	LogisticSettlementBatchValidationLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementConstantValues', 'logisticSettlementTranslationService'];

	function LogisticSettlementBatchValidationLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementConstantValues, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getBatchValidationLayout(),
			dtoSchemeId: logisticSettlementConstantValues.schemes.batchvalidation,
			translator: logisticSettlementTranslationService
		});
	}
})(angular);