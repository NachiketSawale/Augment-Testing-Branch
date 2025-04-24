
(function (angular) {
	'use strict';

	var projectAssemblylModule = 'project.assembly';
	var cloudCommonModule = 'cloud.common';
	var estimateMainModule = 'estimate.main';
	var estimateProjectModule = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name projectMaterialTranslationService
	 * @description provides translation for project Material module
	 */
	angular.module(projectAssemblylModule).factory('projectAssemblyTranslationService', ['platformTranslateService', 'platformTranslationUtilitiesService', 'estimateMainTranslationService',

		function (platformTranslateService, platformTranslationUtilitiesService, estimateMainTranslationService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [projectAssemblylModule, cloudCommonModule, estimateMainModule, estimateProjectModule]
			};

			data.words = {
				basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
				QuantityFactor1:{ location: estimateMainModule, identifier: 'quantityFactor1', initial: 'Quantity Factor1(Project)' },
				QuantityFactor2:{ location: estimateMainModule, identifier: 'quantityFactor2', initial: 'Quantity Factor2(Project)' },
				QuantityFactor3:{ location: estimateMainModule, identifier: 'quantityFactor3', initial: 'Quantity Factor3(Project)' },
				QuantityFactor4:{ location: estimateMainModule, identifier: 'quantityFactor4', initial: 'Quantity Factor4(Project)' },
				CostFactor1:{ location: estimateMainModule, identifier: 'costFactor1', initial: 'Cost Factor1(Project)' },
				CostFactor2:{ location: estimateMainModule, identifier: 'costFactor2', initial: 'Cost Factor2(Project)' },
				LgmJobFk: {location: estimateProjectModule, identifier: 'lgmJobFk', initial: 'Job'}
			};

			//Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			//Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			service.getTranslationInformation = function (key) {
				var information = data.words[key];

				if(key.indexOf('.') >= 0){
					key = key.substring(key.indexOf('.')+1);
					information = estimateMainTranslationService.getTranslationInformation(key);
				}
				return information;
			};

			service.getTranslate = function () {
				return data.translate;
			};

			platformTranslationUtilitiesService.loadModuleTranslation(data);

			service.loadTranslations = function () {
				platformTranslationUtilitiesService.reloadModuleTranslation(data);
			};

			service.registerUpdates = function (callback) {
				data.updateCallback = callback;
				platformTranslateService.translationChanged.register(service.loadTranslations);
			};

			service.unregisterUpdates = function () {
				data.updateCallback = null;
				platformTranslateService.translationChanged.unregister(service.loadTranslations);
			};

			// register a module - translation table will be reloaded if module isn't available yet
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
