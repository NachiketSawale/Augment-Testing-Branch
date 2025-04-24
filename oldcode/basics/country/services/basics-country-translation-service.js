(function (angular) {
	'use strict';

	var basicsCountryModule = 'basics.country';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name basicsCountryTranslationService
	 * @description provides translation for basics Country module
	 */
	angular.module(basicsCountryModule).factory('basicsCountryTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsCountryModule, cloudCommonModule]
			};

			data.words = {
				Iso2: { location: cloudCommonModule, identifier: 'entityISO2', initial: 'ISO2' },
				Iso3: { location: basicsCountryModule, identifier: 'entityISO3', initial: 'ISO3' },
				Description: { location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description' },
				DescriptionInfo: { location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description' },
				AddressFormatFk: { location: basicsCountryModule, identifier: 'entityAddressFormat', initial: 'Address Format' },
				AreaCode: { location: basicsCountryModule, identifier: 'entityAreaCode', initial: 'Area Code' },
				IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' },
				CountryFk: { location: basicsCountryModule, identifier: 'entityCountryFk', initial: 'Country' },
				State: { location: basicsCountryModule, identifier: 'entityState', initial: 'State' },
				Sorting: { location: basicsCountryModule, identifier: 'entitySorting', initial: 'Sorting' },
				RecordState: { location: basicsCountryModule, identifier: 'entityRecordState', initial: 'Record State' },
				country:{ location: basicsCountryModule, identifier: 'entityCountryFk', initial: 'Country' },
				RegexVatno:{ location: basicsCountryModule, identifier: 'entityRegexVatno', initial: 'RegexVatno' },
				RegexTaxno:{ location: basicsCountryModule, identifier: 'entityRegexTaxno', initial: 'RegexTaxno' },
				VatNoValidExample: { location: basicsCountryModule, identifier: 'entityVatNoValidExample', initial: 'Vat No. Valid Example' },
				TaxNoValidExample: { location: basicsCountryModule, identifier: 'entityTaxNoValidExample', initial: 'Tax No. Valid Example' }
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
