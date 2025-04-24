/**
 * Created by zen on 5/17/2017.
 */
(function () {
	'use strict';
	var moduleName = 'boq.main';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('boqMainTextTranslationService', ['platformTranslationUtilitiesService',
		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [moduleName, cloudCommonModule]
			};

			data.words = {
				ConfigCaption: {location: moduleName, identifier: 'ConfigCaption', initial: 'Description'},
				ConfigBody: {location: moduleName, identifier: 'ConfigBody', initial: 'Detail'},
				ConfigTail: {location: moduleName, identifier: 'ConfigTail', initial: 'Postfix'},
				Isoutput: {location: moduleName, identifier: 'Isoutput', initial: 'Is Output'},
				Remark: {location: moduleName, identifier: 'Remark', initial: 'Remark'}
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

			return service;
		}
	]);
})();