/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const estimateProjectModuleName = 'estimate.project';
	const cloudCommonModule = 'cloud.common';
	const basicsCompanyModule = 'basics.company';

	/**
	 * @ngdoc service
	 * @name estimateProjectTranslationService
	 * @description provides translation for estimate Project module
	 */
	angular.module(estimateProjectModuleName).factory('estimateProjectTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [estimateProjectModuleName, cloudCommonModule, basicsCompanyModule]
			};

			data.words = {
				basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				baseData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addClerkContainerTranslations(data.words);
			platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

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
