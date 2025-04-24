/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var privacyConfigModule = 'privacy.config';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name privacyConfigTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(privacyConfigModule).service('privacyConfigTranslationService', PrivacyConfigTranslationService);

	PrivacyConfigTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function PrivacyConfigTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [privacyConfigModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: privacyConfigModule, identifier: 'key', initial: 'English' }
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
