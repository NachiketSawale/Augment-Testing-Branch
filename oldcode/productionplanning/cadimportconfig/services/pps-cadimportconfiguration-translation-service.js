(function (angular) {
	'use strict';

	var currentModule = 'productionplanning.cadimportconfig';
	var drawingModule = 'productionplanning.drawing';
	var cloudCommonModule = 'cloud.common';
	var customizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name ppsCadImportConfigurationTranslationService
	 * @description provides translation for productionplanning engineering module
	 */
	angular.module(currentModule).factory('ppsCadImportConfigurationTranslationService', TranslationService);

	TranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TranslationService(platformTranslationUtilitiesService) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, drawingModule, cloudCommonModule, customizeModule]
		};

		data.words = {
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: '*Basic Data'},
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description'},
			IsLive: {location: customizeModule, identifier: 'islive', initial: '*Is Live'},
			ImporterKind: {location: currentModule, identifier: 'importerKind', initial: '*Importer Kind'},
			BaseDirectory: {location: currentModule, identifier: 'baseDirectory', initial: '*Base Directory'},
			MatchPattern: {location: currentModule, identifier: 'matchPattern', initial: '*Match Pattern'},
			MatchPatternType: {location: currentModule, identifier: 'matchPatternType', initial: '*Pattern Type'},
			EngDrawingTypeFk: {location: drawingModule, identifier: 'engDrawingTypeFk', initial: '*Drawing Type'},
			RuleId: {location: currentModule, identifier: 'validation.ruleId', initial: '*Rule'},
			MessageLevel: {location: currentModule, identifier: 'validation.messageLevel', initial: '*Message Level'}
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}
})(angular);
