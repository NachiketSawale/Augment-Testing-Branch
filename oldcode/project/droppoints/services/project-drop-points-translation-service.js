/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	let projectDroppointsModule = 'project.droppoints';
	let projectMainModule = 'project.main';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name projectDropPointsTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(projectDroppointsModule).service('projectDropPointsTranslationService', ProjectDroppointsTranslationService);

	ProjectDroppointsTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProjectDroppointsTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [projectDroppointsModule, projectMainModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			ProjectNo: {location: projectMainModule, identifier: 'projectNo'},
			ProjectName: {location: cloudCommonModule, identifier: 'entityName'},
			ProjectName2: {location: projectMainModule, identifier: 'name2'},
			CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency'},
			ProjectFk:{location: projectDroppointsModule, identifier: 'entityProject'},
			Code:{location: projectDroppointsModule, identifier: 'entityCode'},
			GLNCode:{location: projectDroppointsModule, identifier: 'entityGlncode'},
			DropPointTypeFk:{location: projectDroppointsModule, identifier: 'entityDroppointtype'},
			IsActive:{location: projectDroppointsModule, identifier: 'entityIsactive'},
			HidInPubApi:{location: projectDroppointsModule, identifier: 'entityHidinpubapi'},
			IsManual:{location: projectDroppointsModule, identifier: 'entityIsmanual'},
			ControllingUnitFk:{location: projectDroppointsModule, identifier: 'entityControllingunit'},
			ProjectAddressFk:{location: projectDroppointsModule, identifier: 'entityPrjaddress'},
			Icon:{location: projectDroppointsModule, identifier: 'entityIcon'},
			ClerkRespFk:{location: projectDroppointsModule, identifier: 'entityClerkresp'},
			Comment:{location: projectDroppointsModule, identifier: 'entityComment'},
			DropPointFk:{location: projectDroppointsModule, identifier: 'entityDroppoint'},
			Quantity:{location: projectDroppointsModule, identifier: 'entityQuantity'},
			ArticleFk:{location: projectDroppointsModule, identifier: 'entityArticle'},
			ArticleTypeFk:{location: projectDroppointsModule, identifier: 'entityArticleType'},

			// Word: { location: projectDroppointsModule, identifier: 'key', initial: 'English' }
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		//platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
