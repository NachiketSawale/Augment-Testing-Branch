/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let basicsTextModulesModule = 'basics.textmodules';
	let cloudCommonModule = 'cloud.common';
	let basicsCustomizeModule = 'basics.customize';
	let basicsCompanyModule = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsTextModulesTranslationService
	 * @description provides translation for text modules module
	 */
	angular.module(basicsTextModulesModule).factory('basicsTextModulesTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsTextModulesModule, cloudCommonModule, basicsCustomizeModule, basicsCompanyModule]
			};

			data.words = {
				basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDesc', initial: 'Description'},
				LanguageFk: {
					location: cloudCommonModule,
					identifier: 'languageColHeader_Language',
					initial: 'Language'
				},
				TextModuleTypeFk: {
					location: basicsCustomizeModule,
					identifier: 'textmoduletype',
					initial: 'Text Module Type'
				},
				KeyCode: {location: basicsTextModulesModule, identifier: 'key', initial: 'Key'},
				LanguageDependent: {
					location: basicsTextModulesModule,
					identifier: 'languageDependent',
					initial: 'Language Dependent'
				},
				TextFormat: {location: basicsTextModulesModule, identifier: 'textFormat', initial: 'Text Format'},
				Client: {location: basicsTextModulesModule, identifier: 'client', initial: 'Client'},
				RubricFk: {location: basicsCustomizeModule, identifier: 'rubric', initial: 'Rubric'},
				ClerkFk: {location: cloudCommonModule, identifier: 'entityClerk', initial: 'Clerk'},
				AccessRoleFk: {location: basicsTextModulesModule, identifier: 'accessRole', initial: 'Access Role'},
				PortalUserGroupFk: {location: basicsTextModulesModule, identifier: 'portalUserGroup', initial: 'Portal Group'},
				TextAssemblyFk: {location: basicsTextModulesModule, identifier: 'textAssembly', initial: 'Text Assembly'},
				IsLanguageDependent: {
					location: basicsTextModulesModule,
					identifier: 'languageDependent',
					initial: 'Language Dependent'
				},
				Url: {
					location: basicsCustomizeModule, identifier: 'url', initial: 'Url'
				},
				UrlInfo: {
					location: basicsCustomizeModule, identifier: 'url', initial: 'Url'
				},
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
				IsLive: {location: basicsCustomizeModule, identifier: 'islive', initial: 'Is Live'},
				TextFormatFk: {location: basicsTextModulesModule, identifier: 'textFormat', initial: 'Text Format'},
				TextModuleContextFk: {location: basicsCompanyModule, identifier: 'entityTextModuleContextFk', initial: 'Text Module Context'}
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
