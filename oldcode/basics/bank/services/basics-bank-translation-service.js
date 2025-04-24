(function (angular) {
	'use strict';

	var basicsBankModule = 'basics.bank';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name basicsBankTranslationService
	 * @description provides translation for basics Bank module
	 */
	angular.module(basicsBankModule).factory('basicsBankTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};

			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsBankModule, cloudCommonModule]
			};

			data.words = {
				bank: { location: basicsBankModule, identifier: 'listBankTitle', initial: 'Banken' },
				entityBank: { location: basicsBankModule, identifier: 'entityBank', initial: 'Bank' },
				BasCountryFk: { location: basicsBankModule, identifier: 'BasCountryFk', initial: 'Country' },
				Sortcode: { location: basicsBankModule, identifier: 'Sortcode', initial: 'Sortcode' },
				BankName: { location: basicsBankModule, identifier: 'BankName', initial: 'Bank Name' },
				Street: { location: basicsBankModule, identifier: 'Street', initial: 'Street' },
				City: { location: basicsBankModule, identifier: 'City', initial: 'City' },
				Bic: { location: basicsBankModule, identifier: 'Bic', initial: 'BIC' },
				Zipcode: { location: basicsBankModule, identifier: 'Zipcode', initial: 'Zipcode' },
				LeiIdentification: { location: basicsBankModule, identifier: 'leiIdentification', initial: 'LEI Identification' },
				BankSignificanceFk: { location: basicsBankModule, identifier: 'bankSignificance', initial: 'Bank Significance' }
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
