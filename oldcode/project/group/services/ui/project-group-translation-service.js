/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	const projectGroupModule = 'project.group';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const customizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name projectGroupTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(projectGroupModule).service('projectGroupTranslationService', ProjectGroupTranslationService);

	ProjectGroupTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProjectGroupTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [projectGroupModule, basicsCommonModule, cloudCommonModule, customizeModule]
		};

		data.words = {
			basicData: {location: cloudCommonModule, identifier: 'entityProperties'},
			CompanyFk:{location: projectGroupModule, identifier: 'entityCompany'},
			ProjectGroupFk:{location: projectGroupModule, identifier: 'entityProjectGroup'},
			ProjectGroupStatusFk:{location: projectGroupModule, identifier: 'entityProjectGroupStatus'},
			Code:{location: projectGroupModule, identifier: 'entityCode'},
			DescriptionInfo:{location: projectGroupModule, identifier: 'entityDescriptionInfo'},
			ITwoBaselineServerFk:{location: customizeModule, identifier: 'itwobaselineserver'},
			CommentText:{location: projectGroupModule, identifier: 'entityCommentText'},
			IsActive:{location: projectGroupModule, identifier: 'entityIsActive'},
			UncPath: {location: customizeModule, identifier: 'uncpath'},
			IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault'},
			InstanceAction: {location: customizeModule, identifier: 'action'},
			IsAutoIntegration: { location: projectGroupModule, identifier: 'isAutoIntegration' },
			DefaultTemplateProjectFk: { location: projectGroupModule, identifier: 'defaultTemplateProject' }
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
	}

})(angular);
