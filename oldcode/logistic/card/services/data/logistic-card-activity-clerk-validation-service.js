/**
 * Created by Shankar on 11.08.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc service
	 * @name logisticCardActivityClerkValidationService
	 * @description provides validation methods for logistic card activity entities
	 */
	angular.module(moduleName).service('logisticCardActivityClerkValidationService', LogisticCardActivityClerkValidationService);

	LogisticCardActivityClerkValidationService.$inject = ['platformValidationServiceFactory', 'logisticCardConstantValues', 'logisticCardActivityClerkDataService'];

	function LogisticCardActivityClerkValidationService(platformValidationServiceFactory, logisticCardConstantValues, logisticCardActivityClerkDataService) {
		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface(logisticCardConstantValues.schemes.cardactivityclerk, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticCardConstantValues.schemes.cardactivityclerk)
		},
			self,
			logisticCardActivityClerkDataService);
		
	}
})(angular);
