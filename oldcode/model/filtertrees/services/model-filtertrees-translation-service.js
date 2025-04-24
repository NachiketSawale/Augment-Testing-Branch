/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	var modelFiltertreesModule = 'model.filtertrees';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name modelFiltertreesTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(modelFiltertreesModule).service('modelFiltertreesTranslationService', ModelFiltertreesTranslationService);

	ModelFiltertreesTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ModelFiltertreesTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [modelFiltertreesModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: modelFiltertreesModule, identifier: 'key', initial: 'English' }
			DescriptionInfo: { location: modelFiltertreesModule, identifier: 'entityDescription', initial: 'DescriptionInfo' }
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
