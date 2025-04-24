/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	let cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name estimateMainBackwardCalculationGridTranslationService
	 * @description
	 */

	angular.module(moduleName).service('estimateMainBackwardCalculationGridTranslationService', ['platformUIBaseTranslationService',
		function (platformUIBaseTranslationService) {
			var basicsTranslations = {
				translationInfos: {
					'extraModules': [moduleName,cloudCommonModule],
					'extraWords': {
						basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
						ResourceType: {location: moduleName, identifier: 'backwardCalculation.resourceType', initial: 'Resource Type'},
						MajorCostCode: {location: moduleName, identifier: 'backwardCalculation.majorCostCode', initial: 'Major Cost Code'},
						IsChange: {location: moduleName, identifier: 'backwardCalculation.isChange', initial: 'Is Change'},
						ChangeValueFk: {location: moduleName, identifier: 'backwardCalculation.changeValue', initial: 'Change Value'},
						CalculationMethod: {location: moduleName, identifier: 'backwardCalculation.calculationMethod', initial: 'Calculation Method'}
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

