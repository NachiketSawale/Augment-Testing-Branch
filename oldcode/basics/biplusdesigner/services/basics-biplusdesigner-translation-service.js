/*
 * $Id: basics-biplusdesigner-translation-service.js 608681 2020-10-26 07:00:24Z lta $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var basicsBiPlusDesignerModule = 'basics.biplusdesigner';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name basicsBiPlusDesignerTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(basicsBiPlusDesignerModule).service('basicsBiPlusDesignerTranslationService', BasicsBiPlusDesignerTranslationService);

	BasicsBiPlusDesignerTranslationService.$inject = ['platformTranslationUtilitiesService','platformUIBaseTranslationService','basicsBiPlusDesignerDashboard2GroupLayout',
		'basicsBiPlusDesignerDashboardLayout','basicsBiPlusDesignerDashboardParameterLayout'];

	function BasicsBiPlusDesignerTranslationService(platformTranslationUtilitiesService,platformUIBaseTranslationService,basicsBiPlusDesignerDashboard2GroupLayout,
		basicsBiPlusDesignerDashboardLayout,basicsBiPlusDesignerDashboardParameterLayout) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [basicsBiPlusDesignerModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: basicsBiPlusDesignerModule, identifier: 'key', initial: 'English' }
			BasDashboardGroupFk: { location: basicsBiPlusDesignerModule, identifier: 'BasDashboardGroupFk', initial: 'Dashboard Group Name' },
			IsVisible: { location: basicsBiPlusDesignerModule, identifier: 'IsVisible', initial: 'Is Visible' },
			Visibility : { location: basicsBiPlusDesignerModule, identifier: 'Visibility', initial: 'Visibility' }
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

		var localBuffer = {};
		platformUIBaseTranslationService.call(this, new Array(basicsBiPlusDesignerDashboard2GroupLayout,basicsBiPlusDesignerDashboardLayout,basicsBiPlusDesignerDashboardParameterLayout), localBuffer);
	}

})(angular);
