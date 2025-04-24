/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules
	const currentModule = 'productionplanning.formworktype';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const customizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name productionplanningFormworktypeTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(currentModule).service('productionplanningFormworktypeTranslationService', TranslationService);

	TranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, basicsCommonModule, cloudCommonModule, customizeModule]
		};

		data.words = {
			DescriptionInfo: { location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description' },
			IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: '*Is Default' },
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive', initial: '*Active' },
			Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: '*Sorting' },
			Icon: { location: customizeModule, identifier: 'icon' },
			UserFlag1: { location: customizeModule, identifier: 'userflag1', initial: 'User Flag 1' },
			UserFlag2: { location: customizeModule, identifier: 'userflag2', initial: 'User Flag 2' },
			RubricCategoryFk: { location: customizeModule, identifier: 'rubriccategoryfk', initial: '*Rubric Category' },
			ProcessTemplateFk : {location: currentModule, identifier: 'processTemplateFk', initial: '*Process Template'},

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
