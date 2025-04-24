/*
 * $Id: privacy-main-translation-service.js 627998 2021-03-16 15:37:51Z leo $
 * Copyright (c) RIB Software SE
 */

( (angular) => {
	'use strict';

	// Modules, beside my own in alphabetic order
	let privacyMainModule = 'privacy.main';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name privacyMainTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(privacyMainModule).service('privacyMainTranslationService', PrivacyMainTranslationService);

	PrivacyMainTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function PrivacyMainTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [privacyMainModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			PrivacyHandledTypeFk: { location: privacyMainModule, identifier: 'entityHandledType', initial: 'Handled Type' },
			PrivacyGradeFk: { location: privacyMainModule, identifier: 'entityGrade', initial: 'Grade' },
			PrivacyRequestedByFk: { location: privacyMainModule, identifier: 'entityRequestedBy', initial: 'Requested By' },
			RenderedDataId: { location: privacyMainModule, identifier: 'entityRenderedData', initial: 'Rendered Data' },
			IsWithBackup: { location: privacyMainModule, identifier: 'entityIsWithBackup', initial: 'Backup available' },
			ConfirmedByUserFk: {location: privacyMainModule, identifier: 'entityConfirmedBy', initial: 'Confirmed by'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
