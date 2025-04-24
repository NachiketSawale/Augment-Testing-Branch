/**
 * Created by baf on 01.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementTransactionLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement transaction entity.
	 **/
	angular.module(moduleName).service('logisticSettlementTransactionLayoutService', LogisticSettlementTransactionLayoutService);

	LogisticSettlementTransactionLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementConstantValues', 'logisticSettlementTranslationService'];

	function LogisticSettlementTransactionLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementConstantValues, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getTransactionLayout(),
			dtoSchemeId: logisticSettlementConstantValues.schemes.transaction,
			translator: logisticSettlementTranslationService
		});
	}
})(angular);