/*
 * $Id: timekeeping-layout-translation-service.js 548926 2019-06-25 15:38:39Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var timekeepingLayoutModule = 'timekeeping.layout';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var tkCommonModule = 'timekeeping.common';
	var tkRecordingModule = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(timekeepingLayoutModule).service('timekeepingLayoutTranslationService', TimekeepingLayoutTranslationService);

	TimekeepingLayoutTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TimekeepingLayoutTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [timekeepingLayoutModule, basicsCommonModule, cloudCommonModule, tkCommonModule,
				tkRecordingModule]
		};

		data.words = {
			TimeSymbolFk: { location: tkCommonModule, identifier: 'timeSymbol', initial: 'Time Symbol' },
			MinCount: { location: timekeepingLayoutModule, identifier: 'minCount', initial: 'Minimum Count' },
			MaxCount: { location: timekeepingLayoutModule, identifier: 'maxCount', initial: 'Maximum Count' },
			DurationModeFk: { location: timekeepingLayoutModule, identifier: 'durationMode', initial: 'Duration Mode' },
			TimeSymbolUserInterfaceFk: { location: timekeepingLayoutModule, identifier: 'timeSymbolUi', initial: 'Time Symbol Representation' },
			InputPhaseChainModeFk: { location: timekeepingLayoutModule, identifier: 'inputChainMode', initial: 'Chaining Mode' },
			ModificationFactor: { location: timekeepingLayoutModule, identifier: 'modificationFactor', initial: 'Modification Factor' },
			ModificationDelta: { location: timekeepingLayoutModule, identifier: 'modificationDelta', initial: 'Modification Delta' },
			TimeSymbolChainedFk: { location: timekeepingLayoutModule, identifier: 'chainedTimeSymbol', initial: 'Chained Time Symbol' }
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
