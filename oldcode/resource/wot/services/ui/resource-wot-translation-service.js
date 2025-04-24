/*
 * $Id: resource-wot-translation-service.js 623508 2021-02-11 13:04:50Z nitsche $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var resourceWotModule = 'resource.wot';
	var basicsCommonModule = 'basics.common';
	var customizeModule = 'basics.customize';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name resourceWotTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(resourceWotModule).service('resourceWotTranslationService', ResourceWotTranslationService);

	ResourceWotTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceWotTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceWotModule, basicsCommonModule, customizeModule, cloudCommonModule]
		};

		data.words = {
			IsHire: { location: resourceWotModule, identifier: 'isHire'},
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive'},
			Sorting: { location: cloudCommonModule, identifier: 'entitySorting'},
			IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault'},
			UomFk: { location: cloudCommonModule, identifier: 'entityUoM'},
			PlantTypeFk: { location: customizeModule, identifier: 'planttype'},
			Code: {location: cloudCommonModule, identifier: 'entityCode'},
			WorkOperationTypeFk: { location: resourceWotModule, identifier: 'entityWorkOperationTypeFk'},
			ReservationstatusStartFk: { location: resourceWotModule, identifier: 'entityReservationstatusStartFk'},
			IsTimekeepingDefault: { location: resourceWotModule, identifier: 'isTimekeepingDefault'},
			IsMinorEquipment: { location: resourceWotModule, identifier: 'isMinorEquipment'},
			HasLoadingCosts: { location: resourceWotModule, identifier: 'hasLoadingCosts'},
			IsEstimate: { location: resourceWotModule, identifier: 'isEstimate'},
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
