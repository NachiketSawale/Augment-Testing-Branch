(function () {
	'use strict';
	var modName = 'mtwo.chatbot';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name mtwoChatbotLayoutService
	 * @function
	 *
	 * @description
	 *
	 */
	module.service('mtwoChatbotLayoutService', MtwoChatbotLayoutService);
	MtwoChatbotLayoutService.$inject = ['platformUIConfigInitService', 'mtwoChatbotContainerInformationService',
		'mtwoChatbotConstantValues', 'mtwoChatBotTranslationService', 'mtwoChatBotUIConfigurationService'];

	function MtwoChatbotLayoutService(platformUIConfigInitService, mtwoChatbotContainerInformationService,
		mtwoChatbotConstantValues, mtwoChatBotTranslationService, mtwoChatBotUIConfigurationService) {
		
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: mtwoChatBotUIConfigurationService.getConfigurationListLayout(),
			dtoSchemeId: mtwoChatbotConstantValues.schemes.configuration,
			translator: mtwoChatBotTranslationService
		});
	}
})();
