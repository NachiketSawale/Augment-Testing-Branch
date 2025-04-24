/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc service
	 * @name logisticCardTemplateActivityValidationService
	 * @description provides validation methods for logistic cardTemplate activity entities
	 */
	angular.module(moduleName).service('logisticCardTemplateActivityValidationService', LogisticCardTemplateActivityValidationService);

	LogisticCardTemplateActivityValidationService.$inject = ['platformValidationServiceFactory', 'logisticCardTemplateConstantValues', 'logisticCardTemplateActivityDataService'];

	function LogisticCardTemplateActivityValidationService(platformValidationServiceFactory, logisticCardTemplateConstantValues, logisticCardTemplateActivityDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticCardTemplateConstantValues.schemes.cardTemplateActivity, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticCardTemplateConstantValues.schemes.cardTemplateActivity)
		},
		self,
		logisticCardTemplateActivityDataService);
	}
})(angular);
