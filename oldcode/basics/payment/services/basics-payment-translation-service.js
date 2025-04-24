(function (angular) {
	'use strict';

	var basicsPaymentModule = 'basics.payment';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name basicsPaymentTranslationService
	 * @description provides translation for basics Payment module
	 */
	angular.module(basicsPaymentModule).factory('basicsPaymentTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsPaymentModule, cloudCommonModule]
			};

			data.words = {
				Code: { location: cloudCommonModule, identifier: 'entityCode', initial: 'Code' },
				DescriptionInfo: { location: cloudCommonModule, identifier: 'descriptionInfo', initial: 'Descriptions' },
				NetDays: { location: basicsPaymentModule, identifier: 'netDays', initial: 'Country' },
				DiscountPercent: { location: basicsPaymentModule, identifier: 'DiscountPercent', initial: 'DiscountPercent' },
				CalculationTypeFk: { location: basicsPaymentModule, identifier: 'CalculationType', initial: 'Calculation Type' },
				DayOfMonth: { location: basicsPaymentModule, identifier: 'DayOfMonth', initial: 'Day Of Month' },
				PrintDescriptionInfo: { location: basicsPaymentModule, identifier: 'PrintDescriptionInfo', initial: 'Print Description Info' },
				PrintTextDescriptionInfo: { location: basicsPaymentModule, identifier: 'PrintTextDescriptionInfo', initial: 'Print Text Description Info' },
				Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting' },
				IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' },
				payment: { location: basicsPaymentModule, identifier: 'payment', initial: 'Payment' },
				DiscountDays: { location: basicsPaymentModule, identifier: 'DiscountDays', initial: 'Discount Days' },
				Codefinance: { location: basicsPaymentModule, identifier: 'codefinance', initial: 'Code (Finance)' },
				IsDateInvoiced: { location: basicsPaymentModule, identifier: 'entityIsDateInvoiced', initial: 'Is Date Invoiced' },
				IsLive: { location: basicsPaymentModule, identifier: 'entityIsLive', initial: 'Active' },
				Month: { location: basicsPaymentModule, identifier: 'entityMonth', initial: 'Month' },
				IsDefaultCreditor: { location: basicsPaymentModule, identifier: 'isDefaultCreditor', initial: 'Is Default Creditor' },
				IsDefaultDebtor: { location: basicsPaymentModule, identifier: 'isDefaultDebtor', initial: 'Is Default Debtor' }
			};

			//Get some predefined packages of words used in project
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