/**
 * Created by baf on 01.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementBillingSchemaLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement billingSchema entity.
	 **/
	angular.module(moduleName).service('logisticSettlementBillingSchemaLayoutService', LogisticSettlementBillingSchemaLayoutService);

	LogisticSettlementBillingSchemaLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementConstantValues', 'logisticSettlementTranslationService'];

	function LogisticSettlementBillingSchemaLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementConstantValues, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getBillingSchemaLayout(),
			dtoSchemeId: logisticSettlementConstantValues.schemes.billingSchema,
			translator: logisticSettlementTranslationService
		});
	}
})(angular);