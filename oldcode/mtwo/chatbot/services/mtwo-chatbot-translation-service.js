/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var mtwoChatBotModule = 'mtwo.chatbot';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name mtwoChatBotTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(mtwoChatBotModule).service('mtwoChatBotTranslationService', MtwoChatBotTranslationService);

	MtwoChatBotTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function MtwoChatBotTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [mtwoChatBotModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			Code: {location: mtwoChatBotModule, identifier: 'entityChatbotConfigurationCode'},
			Description: {location: mtwoChatBotModule, identifier: 'entityChatbotConfigurationDescription'},
			LuisModelId: {location: mtwoChatBotModule, identifier: 'entityChatbotConfigurationNlpAppId'},
			Islive: {location: mtwoChatBotModule, identifier: 'entityChatbotConfigurationIslive'}, // this is from dto class properties
			UpdatedAt: {location: mtwoChatBotModule, identifier: 'entityChatbotConfigurationUpdatedAt'},
			WfeTemplateFk: {location: mtwoChatBotModule, identifier: 'entityChatbotWf2intentWfeTpFk'},
			Intent: {location: mtwoChatBotModule, identifier: 'entityChatbotWf2intentIntent'},
			NlpModelName: {location: mtwoChatBotModule, identifier: 'entityChatbotConfigurationNlpName'},
			Culture: {location: mtwoChatBotModule, identifier: 'entityChatbotConfigurationNlpCulture'},
			ModuleId: {location: mtwoChatBotModule, identifier: 'entityChatbotHeaderModuleId'},
			LanguageId : {location: mtwoChatBotModule, identifier: 'entityChatbotHeaderLanguageFK'},
			IsGeneral:{location: mtwoChatBotModule, identifier: 'entityChatbotHeaderIsGeneral'}
			// Word: { location: mtwoChatBotModule, identifier: 'key', initial: 'English' }
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
