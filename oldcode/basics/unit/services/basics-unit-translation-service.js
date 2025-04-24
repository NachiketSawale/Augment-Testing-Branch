
(function (angular) {
	'use strict';

	var basicsUnitModule = 'basics.unit';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name basicsUnitTranslationService
	 * @description provides translation for basics unit module
	 */
	angular.module(basicsUnitModule).factory('basicsUnitTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsUnitModule, cloudCommonModule]
			};

			data.words = {
				// attributes unit
				UnitInfo: { location: basicsUnitModule, identifier: 'entityUnit', initial: 'Unit' },
				convGroup: { location: basicsUnitModule, identifier: 'convGroup', initial: 'Conversion' },
				RoundingPrecision: { location: basicsUnitModule, identifier: 'entityRoundingPrecision', initial: 'Rounding Precision' },
				Synonym: { location: basicsUnitModule, identifier: 'entitySynonym', initial: 'Synonym' },
				UomTypeFk:{ location: basicsUnitModule, identifier: 'entityUomType', initial: 'Type' },
				LengthDimension:{ location: basicsUnitModule, identifier: 'entityLengthDimension', initial: 'Length Dimension' },
				TimeDimension:{ location: basicsUnitModule, identifier: 'entityTimeDimension', initial: 'Time Dimension' },
				MassDimension:{ location: basicsUnitModule, identifier: 'entityMassDimension', initial: 'Mass Dimension' },
				Factor:{ location: cloudCommonModule, identifier: 'entityFactor', initial: 'Factor' },
				IsBase:{ location: basicsUnitModule, identifier: 'isBase', initial: 'Is Base' },
				IsLive:{ location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Is Active' },
				IsoCode: { location: basicsUnitModule, identifier: 'isoCode' },

				// attributes synonym
				CommentText: { location: basicsUnitModule, identifier: 'entityRemark', initial: 'Remark' }
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
