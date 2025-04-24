/*
 * $Id: cloud-uitesting-translation-service.js 562411 2019-10-10 11:46:18Z ong $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	var cloudUitestingModule = 'cloud.uitesting';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name cloudUitestingTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(cloudUitestingModule).service('cloudUitestingTranslationService', CloudUitestingTranslationService);

	CloudUitestingTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function CloudUitestingTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [cloudUitestingModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: cloudUitestingModule, identifier: 'key', initial: 'English' }
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
