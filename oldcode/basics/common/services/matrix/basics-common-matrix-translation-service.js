/**
 * Created by baf on 04.09.2014.
 */

(function (angular) {
	'use strict';

	const common = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsClerkTranslationService
	 * @description provides translation for basics clerk module
	 */
	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(common).factory('basicsCommonMatrixTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			const service = {};

			const platform = 'platform';

			const data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [common, 'cloud.common', platform],
				words: {
					listRoleTitle: {location: platform, identifier: 'listRoleTitle', initial: 'Roles'},
					baseGroup: {location: platform, identifier: 'baseGroup', initial: 'baseGroup'},
					Description: {location: common, identifier: 'Description', initial: 'description'},
					Colour: {location: platform, identifier: 'Colour', initial: 'Colour'},
					Isbold: {location: platform, identifier: 'Bold', initial: 'Bold'},
					Isitalic: {location: platform, identifier: 'Isitalic', initial: 'Isitalic'},
					Isunderlined: {location: platform, identifier: 'Isunderlined', initial: 'Isunderlined'},
					Isstriked: {location: platform, identifier: 'Isstriked', initial: 'Isstriked'},
					Icon: {location: platform, identifier: 'Icon', initial: 'Icon'},
					IsDisabled: {location: platform, identifier: 'IsDisabled', initial: 'IsDisabled'}
				}
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
