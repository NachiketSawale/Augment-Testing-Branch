/*
 * $Id: resource-skill-translation-service.js 580913 2020-03-27 10:08:28Z berweiler $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var resourceSkillModule = 'resource.skill';
	var basicsCommonModule = 'basics.common';
	var basicsCustomizeModule = 'basics.customize';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name resourceSkillTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(resourceSkillModule).service('resourceSkillTranslationService', ResourceSkillTranslationService);

	ResourceSkillTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceSkillTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceSkillModule, basicsCommonModule, cloudCommonModule, basicsCustomizeModule]
		};

		data.words = {
			SkillTypeFk: { location: basicsCustomizeModule, identifier: 'resourceskilltype'},
			SkillGroupFk: { location: basicsCustomizeModule, identifier: 'resourceskillgroup'},
			ChainedSkillFk: { location: resourceSkillModule, identifier: 'chainedSkill'},
			IsMandatory: { location: resourceSkillModule, identifier: 'isMandatory'},
			TypeFk: {location: resourceSkillModule, identifier: 'TypeFk', initial: 'Resource Type'},
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
