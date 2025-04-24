/**
 * Created by joy on 01.05.2021.
 */
(function () {
	'use strict';
	var modName = 'mtwo.chatbot';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name mtwoChatbotWf2intentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of Wf2intent entity
	 */
	module.service('mtwoChatbotWf2intentLayoutService', MtwoChatbotWf2intentLayoutService);
	MtwoChatbotWf2intentLayoutService.$inject = ['platformUIConfigInitService', 'mtwoChatbotContainerInformationService',
		'mtwoChatbotConstantValues', 'mtwoChatBotTranslationService', 'mtwoChatBotUIConfigurationService'];

	function MtwoChatbotWf2intentLayoutService(platformUIConfigInitService, mtwoChatbotContainerInformationService,
		mtwoChatbotConstantValues, mtwoChatBotTranslationService, mtwoChatBotUIConfigurationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: mtwoChatBotUIConfigurationService.getWf2intentListLayout(),
			dtoSchemeId: mtwoChatbotConstantValues.schemes.wf2intent,
			translator: mtwoChatBotTranslationService
		});
	}
})();
