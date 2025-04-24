/**
 * Created by lcn on 1/18/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.workflowAdministration';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('basicsWorkflowAdministrationTranslationService', ['platformTranslateService', 'platformTranslationUtilitiesService',

		function (platformTranslateService, platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [moduleName, cloudCommonModule]

			};
			data.words = {};
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
	]);
})(angular);
