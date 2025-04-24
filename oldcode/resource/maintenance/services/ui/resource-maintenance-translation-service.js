/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var resourceMaintenanceModule = 'resource.maintenance';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name resourceMaintenanceTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(resourceMaintenanceModule).service('resourceMaintenanceTranslationService', ResourceMaintenanceTranslationService);

	ResourceMaintenanceTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceMaintenanceTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceMaintenanceModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			IsFixedDays: { location: resourceMaintenanceModule, identifier: 'fixedDays'},
			DaysAfter: { location: resourceMaintenanceModule, identifier: 'daysAfter'},
			IsPerformanceBased: { location: resourceMaintenanceModule, identifier: 'performanceBased'},
			UomFk:{ location: cloudCommonModule, identifier: 'entityUoM'},
			Duration:{ location: resourceMaintenanceModule, identifier: 'duration'},
			JobCardTemplateFk:{ location: resourceMaintenanceModule, identifier: 'jobCardTemplate'},
			LeadQuantity:{ location: resourceMaintenanceModule, identifier: 'leadQuantity'},
			LeadDays:{ location: resourceMaintenanceModule, identifier: 'leadDays'},
			IsRecalcDates: { location: resourceMaintenanceModule, identifier: 'entityIsRecalcDates' },
			IsRecalcPerformance: { location: resourceMaintenanceModule, identifier: 'entityIsRecalcPerformance' }
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
