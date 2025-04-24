/**
 * Created by baf on 09.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementValidationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement validation entity.
	 **/
	angular.module(moduleName).service('logisticSettlementValidationLayoutService', LogisticSettlementValidationLayoutService);

	LogisticSettlementValidationLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementConstantValues', 'logisticSettlementTranslationService'];

	function LogisticSettlementValidationLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementConstantValues, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getValidationLayout(),
			dtoSchemeId: logisticSettlementConstantValues.schemes.validation,
			translator: logisticSettlementTranslationService
		});
	}
})(angular);