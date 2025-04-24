/**
 * Created by lst on 6/7/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOneDriveTranslationService', [
		'platformTranslateService', 'platformTranslationUtilitiesService', '$q',
		function (platformTranslateService, platformTranslationUtilitiesService, $q) {

			var cloudCommonModule = 'cloud.common';

			var service = {instant: platformTranslateService.instant};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [
					cloudCommonModule, moduleName
				]
			};

			data.words = {
				name: {location: moduleName, identifier: 'name', initial: 'Name'},
				lastModifiedDateTime: {
					location: moduleName,
					identifier: 'lastModifiedDateTime',
					initial: 'Date modified'
				},
				size: {location: moduleName, identifier: 'size', initial: 'Size'}
			};

			// translate common properties
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			// for container information service use   module container lookup
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}
	]);
})(angular);