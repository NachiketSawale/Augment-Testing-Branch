/**
 * Created by baf on 16.11.2017
 */

(function (angular) {

	'use strict';
	var resourceComponentTypeModule = 'resource.componenttype';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name resourceComponentTypeTranslationService
	 * @description provides translation methods for resource componenttype module
	 */
	angular.module(resourceComponentTypeModule).service('resourceComponentTypeTranslationService', ResourceComponentTypeTranslationService);

	ResourceComponentTypeTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceComponentTypeTranslationService(platformTranslationUtilitiesService) {
		var self = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceComponentTypeModule, cloudCommonModule]
		};

		data.words = {
			IsBaseComponent: { location: resourceComponentTypeModule, identifier: 'entityIsBaseComponent'},
			IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault'},
			Sorting: { location: cloudCommonModule, identifier: 'entitySorting'},
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);