/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let estimateParameterModule = 'estimate.parameter',
		cloudCommonModule = 'cloud.common',
		basicsCustomizeModule = 'basics.customize';
	/**
	 * @ngdoc service
	 * @name estimateParameterPrjParamTranslationService
	 * @description provides translation for estimate parameter module
	 */
	angular.module(estimateParameterModule).factory('estimateParameterPrjParamTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			let service = {};

			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [ estimateParameterModule, cloudCommonModule, basicsCustomizeModule]
			};

			data.words = {
				EstParameterGroupFk: { location: basicsCustomizeModule, identifier: 'estparametergroup', initial: 'Parameter Group'},
				ParameterValue :{location: basicsCustomizeModule, identifier: 'parametervalue', initial: 'Parameter Value'},
				DefaultValue: { location: estimateParameterModule, identifier: 'defaultValue', initial: 'Default Value'},
				ValueDetail: { location: estimateParameterModule, identifier: 'valueDetail', initial: 'Value Detail'},
				IsLookup: { location: estimateParameterModule, identifier: 'isLookup', initial: 'Is Lookup'},
				EstRuleParamValueFk: { location: estimateParameterModule, identifier: 'estRuleParamValueFk', initial: 'Item Value'},
				ValueType: { location: estimateParameterModule, identifier: 'valueType', initial: 'Value Type'},
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
