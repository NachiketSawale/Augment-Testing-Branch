/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	const resourcePlantestimateModule = 'resource.plantestimate';
	const resourceEquipmentModule = 'resource.equipment';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name resourcePlantestimateTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(resourcePlantestimateModule).service('resourcePlantestimateTranslationService', ResourcePlantestimateTranslationService);

	ResourcePlantestimateTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourcePlantestimateTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourcePlantestimateModule, resourceEquipmentModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: resourcePlantestimateModule, identifier: 'key', initial: 'English' }
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
