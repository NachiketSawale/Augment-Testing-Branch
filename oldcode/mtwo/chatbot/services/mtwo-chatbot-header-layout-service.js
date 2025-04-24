(function () {
	'use strict';
	var modName = 'mtwo.chatbot';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name mtwoChatbotHeaderLayoutService
	 * @function
	 *
	 * @description
	 *
	 */
	module.service('mtwoChatbotHeaderLayoutService', MtwoChatbotHeaderLayoutService);
	MtwoChatbotHeaderLayoutService.$inject = ['platformUIConfigInitService', 'mtwoChatbotContainerInformationService',
		'mtwoChatbotConstantValues', 'mtwoChatBotTranslationService', 'mtwoChatBotUIConfigurationService'];

	function MtwoChatbotHeaderLayoutService(platformUIConfigInitService, mtwoChatbotContainerInformationService,
		mtwoChatbotConstantValues, mtwoChatBotTranslationService, mtwoChatBotUIConfigurationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: mtwoChatBotUIConfigurationService.getHeaderListLayout(),
			dtoSchemeId: mtwoChatbotConstantValues.schemes.header,
			translator: mtwoChatBotTranslationService
		});
	}
})();
