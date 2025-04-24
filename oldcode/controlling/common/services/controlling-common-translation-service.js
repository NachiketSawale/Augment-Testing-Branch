
(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	let controllingCommonModule = 'controlling.common';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';

	angular.module(controllingCommonModule).service('controllingCommonTranslationService', ControllingCommonTranslationService);

	ControllingCommonTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ControllingCommonTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [controllingCommonModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: controllingCommonModule, identifier: 'key', initial: 'English' }
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
