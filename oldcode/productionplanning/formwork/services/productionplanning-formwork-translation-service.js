/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals, angular */
	//Modules, beside my own in alphabetic order
	var ppsFormworkModule = 'productionplanning.formwork';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var siteModule = 'basics.site';
	var ppsPhaseModule = 'productionplanning.processconfiguration';
	var ppsCommonModule = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name productionplanningFormworkTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(ppsFormworkModule).service('productionplanningFormworkTranslationService', ProductionplanningFormworkTranslationService);

	ProductionplanningFormworkTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProductionplanningFormworkTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [ppsFormworkModule, basicsCommonModule, cloudCommonModule, siteModule,
				ppsPhaseModule, ppsCommonModule]
		};

		data.words = {
			// Word: { location: productionplanningFormworkModule, identifier: 'key', initial: 'English' }
			FormworkTypeFk: { location: ppsFormworkModule, identifier: 'formworkType', initial: '*Type' },
			productionGroup: { location: ppsFormworkModule, identifier: 'productionGroup', initial: '*Production' },
			ProcessFk:{ location: ppsFormworkModule, identifier: 'process', initial: '*Process ' },
			BasSiteFk: { location: siteModule, identifier: 'entitySite', initial: '*Site' },
			ProductionPlaceFk: { location: ppsFormworkModule, identifier: 'productionPlace', initial: '*Production Place' }
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
