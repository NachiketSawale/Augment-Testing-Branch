/**
 * Created by baf on 05.03.2018
 */

(function (angular) {

	'use strict';
	var resourceEnterpriseModule = 'resource.enterprise';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';
	var resourceMasterModule = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceEnterpriseTranslationService
	 * @description provides translation methods for resource enterprise module
	 */
	angular.module(resourceEnterpriseModule).service('resourceEnterpriseTranslationService', ResourceEnterpriseTranslationService);

	ResourceEnterpriseTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceEnterpriseTranslationService(platformTranslationUtilitiesService) {
		var self = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceEnterpriseModule, cloudCommonModule, basicsCustomizeModule, resourceMasterModule, 'resource.reservation', 'resource.requisition']
		};

		data.words = {};

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