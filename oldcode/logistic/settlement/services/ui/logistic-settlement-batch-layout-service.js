/**
 * Created by baf on 27.06.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementBatchLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement batch entity.
	 **/
	angular.module(moduleName).service('logisticSettlementBatchLayoutService', LogisticSettlementBatchLayoutService);

	LogisticSettlementBatchLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementConstantValues', 'logisticSettlementTranslationService'];

	function LogisticSettlementBatchLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementConstantValues, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getBatchLayout(),
			dtoSchemeId: logisticSettlementConstantValues.schemes.batch,
			translator: logisticSettlementTranslationService
		});
	}
})(angular);