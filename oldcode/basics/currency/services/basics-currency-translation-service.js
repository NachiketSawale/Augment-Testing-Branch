/**
 * Created by joshi on 18.11.2014.
 */

(function (angular) {
	'use strict';

	var basicsCurrencyModule = 'basics.currency';
	var cloudCommonModule = 'cloud.common';


	/**
	 * @ngdoc service
	 * @name basicsCurrencyTranslationService
	 * @description provides translation for basics currency module
	 */
	angular.module(basicsCurrencyModule).factory('basicsCurrencyTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsCurrencyModule, cloudCommonModule]
			};

			data.words = {
				basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
				Id: { location: basicsCurrencyModule, identifier: 'Id', initial: 'Id' },
				Currency: { location: basicsCurrencyModule, identifier: 'Currency', initial: 'Currency' },
				DescriptionInfo: { location: cloudCommonModule, identifier: 'descriptionInfo', initial: 'Description' },
				ForeignCurrency:{location: basicsCurrencyModule, identifier: 'ForeignCurrency', initial: 'Foreign Currency'},
				SortBy: { location: basicsCurrencyModule, identifier: 'SortBy', initial: 'Sort by' },
				IsDefault: { location: basicsCurrencyModule, identifier: 'IsDefault', initial: 'Is Default' },
				ConversionPrecision: { location: basicsCurrencyModule, identifier: 'ConversionPrecision', initial: 'Conversion Precision' },
				DisplayPrecision: { location: basicsCurrencyModule, identifier: 'DisplayPrecision', initial: 'Display Precision' },
				Description: { location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description' },
				Basis: { location: basicsCurrencyModule, identifier: 'Basis', initial: 'Basis' },
				CommentText: { location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment' },
				Comment: { location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment' },
				Rate: { location: cloudCommonModule, identifier: 'entityRate', initial: 'Rate' },
				RateType: { location: basicsCurrencyModule, identifier: 'RateType', initial: 'Rate Type' },
				CurrencyForeignFk:{location: basicsCurrencyModule, identifier: 'ForeignCurrency', initial: 'Foreign Currency'},
				CurrencyHomeFk:{location: basicsCurrencyModule, identifier: 'Currency', initial: 'Currency'},
				CurrencyRateTypeFk:{location: basicsCurrencyModule, identifier: 'RateType', initial: 'Rate Type'},
				RateDate: { location: basicsCurrencyModule, identifier: 'RateDate', initial: 'Rate Date' },
				RoundlogicTypeFk: { location: basicsCurrencyModule, identifier: 'RoundlogicTypeFk' }
			};

			// Get some predefined packages of words used in project
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
