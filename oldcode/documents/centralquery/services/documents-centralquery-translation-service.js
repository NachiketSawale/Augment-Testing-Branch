/*
 * $Id: documents-centralquery-translation-service.js 589978 2020-06-08 07:48:38Z pel $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global */
	// Modules, beside my own in alphabetic order
	var documentsCentralQueryModule = 'documents.centralquery';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name documentsCentralQueryTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(documentsCentralQueryModule).service('documentsCentralQueryTranslationService', DocumentsCentralQueryTranslationService);

	DocumentsCentralQueryTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function DocumentsCentralQueryTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [documentsCentralQueryModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: documentsCentralQueryModule, identifier: 'key', initial: 'English' }
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
