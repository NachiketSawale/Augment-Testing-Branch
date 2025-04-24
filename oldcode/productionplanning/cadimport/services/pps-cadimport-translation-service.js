(function (angular) {
	'use strict';

	var currentModule = 'productionplanning.cadimport';
	var drawingModule = 'productionplanning.drawing';
	var cloudCommonModule = 'cloud.common';
	var logisticJobModule = 'logistic.job';
	var ppsCommonModule = 'productionplanning.common';
	var ppsImportConfigModule = 'productionplanning.cadimportconfig';

	/**
	 * @ngdoc service
	 * @name ppsCadImportTranslationService
	 * @description provides translation for productionplanning engineering module
	 */
	angular.module(currentModule).factory('ppsCadImportTranslationService', TranslationService);

	TranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceFactory'];

	function TranslationService(platformTranslationUtilitiesService, customColumnsServiceFactory) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, drawingModule, cloudCommonModule, logisticJobModule, ppsCommonModule,
				ppsImportConfigModule]
		};

		data.words = {
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			EngDrawingTypeFk: {location: drawingModule, identifier: 'engDrawingTypeFk', initial: '*Drawing Type'},
			EngDrawingStatusFk: {location: drawingModule, identifier: 'entityStatus', initial: 'Status'},
			PrjProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: '*Project'},
			LgmJobFk: {location: logisticJobModule, identifier: 'titleLogisticJob', initial: '*Logistic Job'},
			PpsItemFk: {location: ppsCommonModule, identifier: 'event.itemFk', initial: 'PPS Item'},
			RuleId: {location: ppsImportConfigModule, identifier: 'validation.ruleId', initial: '*Rule'},
			MessageLevel: {
				location: ppsImportConfigModule,
				identifier: 'validation.messageLevel',
				initial: '*Message Level'
			},
			Message: {location: currentModule, identifier: 'log.message', initial: '*Message'},
			IsChecked: {location: currentModule, identifier: 'preview.checked', initial: '*Checked'},
			EntityTypeDescription: {location: currentModule, identifier: 'preview.entityType', initial: '*Type'},
			DbId: {location: ppsImportConfigModule, identifier: 'summary', initial: '*Summary'},
			StackListNew:{location: currentModule, identifier: 'preview.newStacks', initial: '*New Stacks'},
			StackListExisted: {location: currentModule, identifier: 'preview.existingStacks', initial: '*Existed Stacks'},
			entityTypeDescription: {location: currentModule, identifier: 'log.entityTypeDescription', initial: '*Type'}
		};

		var customColumnsService = customColumnsServiceFactory.getService('productionplanning.drawing');
		customColumnsService.setTranslation(data.words);

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
