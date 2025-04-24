/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/*global angular*/
	var moduleName = 'basics.riskregister';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name basicsRiskRegisterTranslationService
	 * @description provides translation for risk register module
	 */

	angular.module(moduleName).service('basicsRiskRegisterTranslationService', ['platformTranslationUtilitiesService',
		'platformUIBaseTranslationService',
		function (platformTranslationUtilitiesService,platformUIBaseTranslationService) {
			/*var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [moduleName, cloudCommonModule]
			};

			data.words = {
				basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' }
			};

			//Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			//Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			//Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;*/

			var basicsTranslations = {
				translationInfos: {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
						CentralImpact: {location: moduleName, identifier: 'centralimpact', initial: 'Central Impact'},
						DistributionType: {location: moduleName, identifier: 'distributiontype', initial: 'Distribution Type'},
						HighImpact: {location: moduleName, identifier: 'highimpact', initial: 'High Impact'},
						Iterations: {location: moduleName, identifier: 'iterations', initial: 'Iterations'},
						LowImpact: {location: moduleName, identifier: 'lowimpact', initial: 'Low Impact'},

						ProbRiskOccur: {location: moduleName, identifier: 'probriskoccur', initial: 'Probability of Risk Occurance %'},

						Seed: {location: moduleName, identifier: 'seed', initial: 'Seed'},
						LowImpactDetail: {location: moduleName,identifier:'lowimpactdetail',initial:'Low Impact Input'},
						HighImpactDetail: {location: moduleName,identifier:'highimpactdetail',initial:'High Impact Input'}
					}
				}
			};

			var translationService = {
				getTranslationInformation: function getTranslationInformation(key) {
					var information = translationService.words[key];
					if(angular.isUndefined(information) || (information === null)){
						key = key.substring(key.indexOf('.') + 1);
						information = translationService.words[key];
					}
					return information;
				}
			};
			platformUIBaseTranslationService.call(this, [basicsTranslations], translationService);
		}
	]);
})(angular);

