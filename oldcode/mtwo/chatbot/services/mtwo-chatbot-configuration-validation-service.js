/**
 * Created by joy on 12.08.2021.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoChatbotConfigurationValidationService
	 * @description provides validation methods for chatbot configuration
	 */
	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).service('mtwoChatbotConfigurationValidationService', MtwoChatbotConfigurationValidationService);

	MtwoChatbotConfigurationValidationService.$inject = ['platformDataValidationService', 'mtwoChatBotConfigurationDataService', 'platformValidationServiceFactory', 'mtwoChatbotConstantValues'];

	function MtwoChatbotConfigurationValidationService(platformDataValidationService, mtwoChatBotConfigurationDataService, platformValidationServiceFactory, mtwoChatbotConstantValues) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(mtwoChatbotConstantValues.schemes.configuration, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(mtwoChatbotConstantValues.schemes.configuration),
			periods: [{from: 'StartDate', to: 'TerminalDate'}]
		}, self, mtwoChatBotConfigurationDataService);
		self.validateNlpModuleId = function (entity, value) {
			platformDataValidationService.validateMandatory(entity, value, 'ActiveVersion', self, mtwoChatBotConfigurationDataService);
			return platformDataValidationService.validateMandatory(entity, value, 'LuisModelId', self, mtwoChatBotConfigurationDataService);

		};
	}

})(angular);
