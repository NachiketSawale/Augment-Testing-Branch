(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	/**
	 * @ngdoc service
	 * @name constructionSystemProjectTranslateService
	 * @function
	 * @requires platformTranslateService
	 *
	 * @description
	 * #
	 * constructionsystem project translate service
	 */
	angular.module(moduleName).factory('constructionSystemProjectTranslateService', [
		'platformTranslateService', 'platformTranslationUtilitiesService',
		function (platformTranslateService, platformTranslationUtilitiesService) {
			var service = {instant: platformTranslateService.instant};

			var cloudCommonModule = 'cloud.common';
			var modelMainModule = 'model.main';
			var estimateMainModule = 'estimate.main';
			var schedulingScheduleModule = 'scheduling.schedule';

			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [moduleName, cloudCommonModule, modelMainModule, estimateMainModule, schedulingScheduleModule]
			};
			data.words = {
				// Instance header
				StateFk: {location: cloudCommonModule, identifier: 'entityState', initial: 'Status'},
				ModelFk: {location: modelMainModule, identifier: 'entityModel', initial: 'Model'},
				EstimateHeaderFk: {location: estimateMainModule, identifier: 'estimate', initial: 'Estimate'},
				PsdScheduleFk: {location: schedulingScheduleModule, identifier: 'entitySchedule', initial: 'Schedule'},
				BoqHeaderFk:{ location: estimateMainModule, identifier: 'boqHeaderFk', initial: 'BoqHeader' },
				CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'},
				BasLanguageQtoFk:{location: moduleName, identifier: 'languageQto', initial: 'LanguageQto'},
				QtoAcceptQuality: {location: moduleName, identifier: 'entityQtoAcceptQuality', initial: 'Qto Accept Quality'},
				Hint: {location: moduleName, identifier: 'hint', initial: 'Copy Source'},
				CosToEstModeFk: {location: moduleName, identifier: 'entityCosToEstModeFk', initial: 'Estimate Mode'},
				MdlChangeSetFk: {location: moduleName, identifier: 'entityMdlChangeSetFk', initial: 'Model Comparison'},
				ModelOldFk: {location: moduleName, identifier: 'entityModelOldFk', initial: 'Old Model'},
				IsIncremental: {location: moduleName, identifier: 'entityIsIncremental', initial: 'Is Incremental'},
				ModelNewFk: {location: moduleName, identifier: 'entityModelNewFk', initial: 'New Model'}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			// platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, '', '');

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
