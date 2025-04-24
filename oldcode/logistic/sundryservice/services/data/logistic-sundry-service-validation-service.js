/**
 * Created by baf on 02.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceValidationService
	 * @description provides validation methods for logistic sundryService  entities
	 */
	angular.module(moduleName).service('logisticSundryServiceValidationService', LogisticSundryServiceValidationService);

	LogisticSundryServiceValidationService.$inject = ['platformValidationServiceFactory', 'logisticSundryServiceConstantValues', 'logisticSundryServiceDataService'];

	function LogisticSundryServiceValidationService(platformValidationServiceFactory, logisticSundryServiceConstantValues, logisticSundryServiceDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSundryServiceConstantValues.schemes.sundryService, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSundryServiceConstantValues.schemes.sundryService)
		},
		self,
		logisticSundryServiceDataService);
	}

})(angular);
