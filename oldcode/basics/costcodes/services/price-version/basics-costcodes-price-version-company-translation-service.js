/**
 * Created by joshi on 16.09.2014.
 */

(function (angular) {
	'use strict';

	let basicsCostCodesModule = 'basics.costcodes';
	let cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name basicsCostCodesTranslationService
	 * @description provides translation for basics costcodes module
	 */
	/* jshint -W106 */ // letiable name is according usage in translation json
	angular.module(basicsCostCodesModule).factory('basicsCostCodesPriceVersionCompanyTranslationService',
		['platformTranslationUtilitiesService',

			function (platformTranslationUtilitiesService) {
				let service = {};
				let data = {
					toTranslate: {},
					translate: null,
					updateCallback: null,
					allUsedModules: [basicsCostCodesModule, cloudCommonModule]
				};

				data.words = {
					IsChecked: {location: basicsCostCodesModule, identifier: 'checked', initial: 'Checked'},
					CompanyName: {location: basicsCostCodesModule, identifier: 'companyName', initial: 'Company Name'},
					ContextFk: {location: basicsCostCodesModule, identifier: 'ContextFk', initial: 'ContextFk'}
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
})(angular);
