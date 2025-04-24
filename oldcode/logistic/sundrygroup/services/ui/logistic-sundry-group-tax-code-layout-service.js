/**
 * Created by cakiral on 03.02.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('logistic.sundrygroup');

	/**
	 * @ngdoc service
	 * @name logisticSundryGroupTaxCodeLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment TaxCode entity.
	 */
	myModule.service('logisticSundryGroupTaxCodeLayoutService', LogisticSundryGroupTaxCodeLayoutService);

	LogisticSundryGroupTaxCodeLayoutService.$inject = ['logisticSundryServiceGroupConstantValues', 'logisticSundryServiceGroupTranslationService', 'platformUIConfigInitService', 'logisticSundrygroupContainerInformationService'];

	function LogisticSundryGroupTaxCodeLayoutService(logisticSundryServiceGroupConstantValues, logisticSundryServiceGroupTranslationService, platformUIConfigInitService, logisticSundrygroupContainerInformationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSundrygroupContainerInformationService.getTaxCodeLayout(),
			dtoSchemeId: logisticSundryServiceGroupConstantValues.schemes.taxCode,
			translator: logisticSundryServiceGroupTranslationService
		});
	}

})(angular);