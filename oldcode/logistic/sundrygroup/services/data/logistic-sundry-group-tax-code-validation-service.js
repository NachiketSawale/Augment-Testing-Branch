/**
 * Created by cakiral on 03.02.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('logistic.sundrygroup');

	/**
	 * @ngdoc service
	 * @name logisticSundryGroupTaxCodeValidationService
	 * @description provides validation methods for resource equipment TaxCode entities
	 */
	myModule.service('logisticSundryGroupTaxCodeValidationService', LogisticSundryGroupTaxCodeValidationService);

	LogisticSundryGroupTaxCodeValidationService.$inject = ['platformValidationServiceFactory', 'logisticSundryServiceGroupConstantValues', 'logisticSundryGroupTaxCodeDataService'];

	function LogisticSundryGroupTaxCodeValidationService(platformValidationServiceFactory, logisticSundryServiceGroupConstantValues, logisticSundryGroupTaxCodeDataService) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			logisticSundryServiceGroupConstantValues.schemes.taxCode,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSundryServiceGroupConstantValues.schemes.taxCode)
			},
			self,
			logisticSundryGroupTaxCodeDataService);
	}
})(angular);