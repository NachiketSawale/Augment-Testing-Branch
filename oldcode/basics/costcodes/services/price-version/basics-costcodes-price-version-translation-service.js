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
	angular.module(basicsCostCodesModule).factory('basicsCostCodesPriceVersionTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsCostCodesModule,cloudCommonModule]
			};

			data.words = {
				PriceListFk: { location: basicsCostCodesModule, identifier: 'priceVerion.pricelist', initial: 'Price List' },
				ValidFrom: { location: basicsCostCodesModule, identifier: 'priceVerion.validfrom', initial: 'Valid From' },
				ValidTo: { location: basicsCostCodesModule, identifier: 'priceVerion.validTo', initial: 'Valid To' },
				DataDate: { location: basicsCostCodesModule, identifier: 'priceVerion.dataDate', initial: 'Record Date' },
				Weighting: { location: basicsCostCodesModule, identifier: 'priceVerion.weighting', initial: 'Weighting' },
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
