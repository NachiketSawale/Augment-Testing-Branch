/**
 * Created by jhe on 7/23/2018.
 */

(function (angular) {
	'use strict';

	var basicsRegionCatalogModule = 'basics.regionCatalog';
	var cloudCommonModule = 'cloud.common';

	/**
     * @ngdoc service
     * @name basicsRegionCatalogTranslationService
     * @description provides translation for basics unit module
     */
	angular.module(basicsRegionCatalogModule).factory('basicsRegionCatalogTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsRegionCatalogModule, cloudCommonModule]
			};

			data.words = {
				//attributes RegionCatalog
				CommentTextInfo:{ location: basicsRegionCatalogModule, identifier: 'entityCommentTextInfo', initial: 'Comment Text' },
				OrgCode:{ location: basicsRegionCatalogModule, identifier: 'entityOrgCode', initial: 'Org Code' },
				IsLive:{ location: basicsRegionCatalogModule, identifier: 'entityIsLive', initial: 'Is Live' }
				//attributes RegionType

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

			return service;
		}
	]);
})(angular);
