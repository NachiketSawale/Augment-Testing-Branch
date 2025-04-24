/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	const currentModule = 'productionplanning.drawingtype';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const customizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name productionPlanningDrawingTypeTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(currentModule).service('productionPlanningDrawingTypeTranslationService', TranslationService);

	TranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, basicsCommonModule, cloudCommonModule, customizeModule]
		};

		data.words = {
			// DrawingType
			Icon: {location: customizeModule, identifier: 'icon'},
			DescriptionInfo: { location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description' },
			IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: '*Is Default' },
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive', initial: '*Active' },
			Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: '*Sorting' },
			RubricCategoryFk: {location: customizeModule, identifier: 'rubriccategoryfk', initial: '*Rubric Category'},
			MaterialGroupFk: { location: customizeModule, identifier: 'materialgroupfk', initial: '*Material Group'},
			ResTypeDetailerFk: { location: customizeModule, identifier: 'resourcetype', initial: '*Resource Type' },
			// DrawingTypeSkill
			CommentText: { location: basicsCommonModule, identifier: 'entityCommentText', initial: '*Comment Text'},
			EngDrawingTypeFk: {location: currentModule, identifier: 'entityDrawingType', initial: '*Drawing Type'},
			ResSkillFk: {location: currentModule, identifier: 'skill.resSkillFk', initial: '*Skill'},
			// xxx

		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
