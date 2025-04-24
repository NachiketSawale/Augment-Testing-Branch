/**
 * Created by Frank Baedeker on 26.08.2014.
 */
(function (angular) {
	'use strict';

	var projectLocationModule = 'project.location';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name projectLocationTranslationService
	 * @description provides translation for project main module
	 */
	angular.module(projectLocationModule).factory('projectLocationTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [projectLocationModule, cloudCommonModule]
			};

			data.words = {
				listTitle: { location: projectLocationModule, identifier: 'listContainerTitle', initial: 'Locations'},
				detailTitle: { location: projectLocationModule, identifier: 'detailContainerTitle', initial: 'Details Location'},
				deleteLoc: { location: projectLocationModule, identifier: 'taskBarDeleteLoc', initial: 'Delete Location'},
				newLoc: { location: projectLocationModule, identifier: 'taskBarNewLoc', initial: 'New Location'},
				newSubLoc: { location: projectLocationModule, identifier: 'taskBarNewSubLoc', initial: 'New Location'},
				IsShownInChart:{ location: projectLocationModule, identifier: 'entityIsShownInChart', initial: 'Is shown in chart' },
				QuantityPercent: { location: cloudCommonModule, identifier: 'entityPercent', initial: 'Percent' },
				Quantity: { location: projectLocationModule, identifier: 'locQuantity', initial: 'Quantity Factor' },
				Location: { location: projectLocationModule, identifier: 'location'},
				ExternalCode: {location: projectLocationModule, identifier: 'externalCode' }
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
