/**
 * Created by xia on 5/8/2019.
 */

(function (angular) {
	'use strict';

	let basicsIndexTableModule = 'basics.indextable';
	let cloudCommonModule = 'cloud.common';

	/**
     * @ngdoc service
     * @name basicsUnitTranslationService
     * @description provides translation for basics unit module
     */
	angular.module(basicsIndexTableModule).factory('basicsIndextableTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsIndexTableModule, cloudCommonModule]
			};

			data.words = {
				// attributes unit
				Code: { location: basicsIndexTableModule, identifier: 'code', initial: 'Code' },
				DescriptionInfo: { location: basicsIndexTableModule, identifier: 'descriptionInfo', initial: 'Description' },
				CommentText: { location: basicsIndexTableModule, identifier: 'commentText', initial: 'Comment Text' },
				UserDefined1: { location: basicsIndexTableModule, identifier: 'userDefined1', initial: 'UserDefined1' },
				UserDefined2:{ location: basicsIndexTableModule, identifier: 'userDefined2', initial: 'UserDefined2' },
				UserDefined3:{ location: basicsIndexTableModule, identifier: 'userDefined3', initial: 'UserDefined3' },
				UserDefined4:{ location: basicsIndexTableModule, identifier: 'userDefined4', initial: 'UserDefined4' },
				UserDefined5:{ location: basicsIndexTableModule, identifier: 'userDefined5', initial: 'UserDefined5' },
				Date:{ location: basicsIndexTableModule, identifier: 'date', initial: 'Date' },
				LowQuantity:{ location: basicsIndexTableModule, identifier: 'lowquantity', initial: 'Low Value' },
				Quantity:{ location: basicsIndexTableModule, identifier: 'quantity', initial: 'Value' },
				HighQuantity:{ location: basicsIndexTableModule, identifier: 'highquantity', initial: 'High Value' },
				IndexHeaderTitle:{ location: basicsIndexTableModule, identifier: 'indexHeaderTitle', initial: 'Index Header' },
				CurrencyFk:{ location: basicsIndexTableModule, identifier: 'CurrencyFk', initial: 'Currency' },
				RateFactorFk:{ location: basicsIndexTableModule, identifier: 'RateFactorFk', initial: 'Rate/Factor' }
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
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

