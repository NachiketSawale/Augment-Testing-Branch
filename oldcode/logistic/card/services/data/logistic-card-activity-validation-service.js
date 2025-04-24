/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc service
	 * @name logisticCardActivityValidationService
	 * @description provides validation methods for logistic card activity entities
	 */
	angular.module(moduleName).service('logisticCardActivityValidationService', LogisticCardActivityValidationService);

	LogisticCardActivityValidationService.$inject = ['platformValidationServiceFactory', 'logisticCardConstantValues', 'logisticCardActivityDataService'];

	function LogisticCardActivityValidationService(platformValidationServiceFactory, logisticCardConstantValues, logisticCardActivityDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticCardConstantValues.schemes.activity, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticCardConstantValues.schemes.activity),
			periods: [{from: 'ActualStartDate', to: 'ActualStopDate'}]
		},
		self,
		logisticCardActivityDataService);
	}
})(angular);
