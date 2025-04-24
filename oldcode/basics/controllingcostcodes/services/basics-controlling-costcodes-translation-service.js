/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function (angular) {
	'use strict';
	let moduleName = 'basics.controllingcostcodes';
	let basicsCostCodesModule = 'basics.costcodes';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';

	angular.module(moduleName).service('basicsControllingCostCodesTranslationService', ['platformTranslationUtilitiesService',
		function (platformTranslationUtilitiesService) {
			// let localBuffer = {};
			//
			// platformUIBaseTranslationService.call(this, basicsControllingCostCodesTranslations, localBuffer);
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [moduleName, basicsCommonModule, cloudCommonModule, basicsCostCodesModule]
			};

			data.words = {
				UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM'},
				CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'},
				IsRevenue: {location: cloudCommonModule, identifier: 'entityIsRevenue', initial: 'Is Revenue'},
				IsCostPrr: {location: cloudCommonModule, identifier: 'entityIsCostPrr', initial: 'Cost for Revenue Recognition'},
				IsRevenuePrr: {location: cloudCommonModule, identifier: 'entityIsRevenuePrr', initial: 'Revenue for Revenue Recognition'},
				MdcContextFk: {location: moduleName, identifier: 'mdcContextFk', initial: 'Master Data Context'},
				MdcLedgerContextFk: {location: moduleName, identifier: 'mdcLedgerContextFk', initial: 'Ledger-Context'},
				BasAccountFk: {location: moduleName, identifier: 'basAccountFk', initial: 'Account'},
				Factor: {location: moduleName, identifier: 'factor', initial: 'Factor'},
				NominalDimension1: {location: moduleName, identifier: 'nominalDimension1', initial: 'Nominal Dimension1'},
				NominalDimension2: {location: moduleName, identifier: 'nominalDimension2', initial: 'Nominal Dimension2'},
				NominalDimension3: {location: moduleName, identifier: 'nominalDimension3', initial: 'Nominal Dimension3'},
			};

			// Get some predefined packages of words used in project

			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}]);
})(angular);