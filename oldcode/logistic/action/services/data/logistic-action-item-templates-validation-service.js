/**
 * Created by Shankar on 23.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'logistic.action';

	/**
	 * @ngdoc service
	 * @name logisticActionItemTemplatesValidationService
	 * @description provides validation methods for logistic action item templates entities
	 */
	angular.module(moduleName).service('logisticActionItemTemplatesValidationService', LogisticActionItemTemplatesValidationService);

	LogisticActionItemTemplatesValidationService.$inject = [
		'_', '$q', '$http', 'platformDataValidationService', 'platformValidationServiceFactory','logisticActionItemTemplatesDataService', 'logisticActionConstantValues'];

	function LogisticActionItemTemplatesValidationService(
		_, $q, $http, platformDataValidationService, platformValidationServiceFactory,logisticActionItemTemplatesDataService, logisticActionConstantValues) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticActionConstantValues.schemes.actionItemTemplates, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticActionConstantValues.schemes.actionItemTemplates)
		},
		self, logisticActionItemTemplatesDataService);
	}
})(angular);
