/**
 * Created by Shankar on 23.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'logistic.action';

	/**
	 * @ngdoc service
	 * @name logisticActionItemTypesValidationService
	 * @description provides validation methods for logistic action item types entities
	 */
	angular.module(moduleName).service('logisticActionItemTypesValidationService', LogisticActionItemTypesValidationService);

	LogisticActionItemTypesValidationService.$inject = [
		'_', '$q', '$http', 'platformDataValidationService', 'platformValidationServiceFactory','logisticActionItemTypesDataService', 'logisticActionConstantValues'];

	function LogisticActionItemTypesValidationService(
		_, $q, $http, platformDataValidationService, platformValidationServiceFactory,logisticActionItemTypesDataService, logisticActionConstantValues) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticActionConstantValues.schemes.actionItemTypes, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticActionConstantValues.schemes.actionItemTypes)
		},
		self, logisticActionItemTypesDataService);
	}
})(angular);
