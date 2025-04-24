/**
 * Created by chin-han.lai on 01/09/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementClaimLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement claim entity.
	 **/
	angular.module(moduleName).service('logisticSettlementClaimLayoutService', LogisticSettlementClaimLayoutService);

	LogisticSettlementClaimLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementConstantValues', 'logisticSettlementTranslationService'];

	function LogisticSettlementClaimLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementConstantValues, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getSettlementClaimLayout(),
			dtoSchemeId: logisticSettlementConstantValues.schemes.settlementClaim,
			translator: logisticSettlementTranslationService
		});
	}
})(angular);