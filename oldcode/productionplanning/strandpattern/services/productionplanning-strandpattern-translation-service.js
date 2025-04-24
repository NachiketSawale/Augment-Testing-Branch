/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	var productionplanningStrandpatternModule = 'productionplanning.strandpattern';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var platform = 'platform';

	/**
	 * @ngdoc service
	 * @name productionplanningStrandpatternTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(productionplanningStrandpatternModule).service('productionplanningStrandpatternTranslationService', ProductionplanningStrandpatternTranslationService);

	ProductionplanningStrandpatternTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProductionplanningStrandpatternTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [productionplanningStrandpatternModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			CadCode: { location: productionplanningStrandpatternModule, identifier: 'CadCode', initial: '*Cad Code' },
			PpsMaterialFk: {location: productionplanningStrandpatternModule, identifier: 'ppsMaterial', initial: '*PPS Material'}
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
