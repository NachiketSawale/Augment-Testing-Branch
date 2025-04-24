/**
 * Created by joshi on 16.09.2014.
 */

(function (angular) {
	'use strict';

	let basicsCostCodesModule = 'basics.costcodes';
	let cloudCommonModule = 'cloud.common';
	let basicsCommonModule = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCostCodesTranslationService
	 * @description provides translation for basics costcodes module
	 */
	/* jshint -W106 */ // letiable name is according usage in translation json
	angular.module(basicsCostCodesModule).factory('basicsCostCodesPriceVersionListRecordTranslationService',
		['platformTranslationUtilitiesService',

			function (platformTranslationUtilitiesService) {
				let service = {};
				let data = {
					toTranslate: {},
					translate: null,
					updateCallback: null,
					allUsedModules: [basicsCostCodesModule, cloudCommonModule, basicsCommonModule]
				};

				data.words = {
					CostcodePriceVerFk: { location: basicsCostCodesModule, identifier: 'priceList.priceVersionDescription', initial: 'Price Version' },
					Rate: { location: basicsCostCodesModule, identifier: 'priceList.rate', initial: 'Market Rate' },
					SalesPrice: { location: basicsCostCodesModule, identifier: 'dayWorkRate', initial: 'DW/T+M Rate' },
					CurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency' },
					FactorCost: { location: basicsCostCodesModule, identifier: 'factorCost', initial: 'Factor (Cost)' },
					FactorQuantity: { location: basicsCostCodesModule, identifier: 'factorQuantity', initial: 'Factor (Quantity)' },
					RealFactorCost: { location: basicsCostCodesModule, identifier: 'realFactorCost', initial: 'RealFactor (Cost)' },
					RealFactorQuantity: { location: basicsCostCodesModule, identifier: 'realFactorQuantity', initial: 'RealFactor (Quantity)' },
					FactorHour: { location: basicsCostCodesModule, identifier: 'factorHour', initial: 'Factor (Hour)' },
					Co2Source:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Source', initial: 'CO2/kg (Source)'},
					Co2SourceFk:{location: basicsCommonModule, identifier: 'sustainabilty.entityBasCo2SourceFk', initial: 'CO2/kg (Source Name)'},
					Co2Project:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Project', initial: 'CO2/kg (Project)'}
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
