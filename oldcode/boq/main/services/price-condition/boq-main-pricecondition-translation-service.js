/**
 * Created by xia on 5/8/2019.
 */

(function (angular) {
	'use strict';

	var basicsIndexTableModule = 'boq.main';
	var cloudCommonModule = 'cloud.common';
	var basicsPriceConditionModule = 'basics.pricecondition';

	/**
	 * @ngdoc service
	 * @name basicsUnitTranslationService
	 * @description provides translation for basics unit module
	 */
	angular.module(basicsIndexTableModule).factory('boqMainPriceconditionTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsIndexTableModule, cloudCommonModule, basicsPriceConditionModule]
			};

			data.words =
				{
					PrcPriceConditionTypeFk: {
						location: cloudCommonModule,
						identifier: 'priceType',
						initial: 'Type'
					},
					Description: {
						location: cloudCommonModule,
						identifier: 'priceDescription',
						initial: 'Description'
					},
					Value: {location: cloudCommonModule, identifier: 'priceValue', initial: 'Value'},
					Total: {location: cloudCommonModule, identifier: 'priceTotal', initial: 'Total'},
					TotalOc: {location: cloudCommonModule, identifier: 'priceTotalOc', initial: 'TotalOc'},
					Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
					Formula: {location: cloudCommonModule, identifier: 'priceFormula', initial: 'Formula'},
					IsPriceComponent: {
						location: cloudCommonModule,
						identifier: 'priceComponent',
						initial: 'priceComponent'
					},
					IsActivated: {
						location: basicsPriceConditionModule,
						identifier: 'entityIsActivated',
						initial: 'Is Activated'
					},
					Date: {
						location: cloudCommonModule,
						identifier: 'entityDate',
						initial: 'Date'
					},
					Userdefined1: {
						location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 1}, initial: 'User-Defined 1'
					},
					Userdefined2: {
						location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 2}, initial: 'User-Defined 2'
					},
					Userdefined3: {
						location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 3}, initial: 'User-Defined 3'
					},
					Userdefined4: {
						location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 4}, initial: 'User-Defined 4'
					},
					Userdefined5: {
						location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 5}, initial: 'User-Defined 5'
					}
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

