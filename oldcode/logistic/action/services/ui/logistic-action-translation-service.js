/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	var logisticActionModule = 'logistic.action';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name logisticActionTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(logisticActionModule).service('logisticActionTranslationService', LogisticActionTranslationService);

	LogisticActionTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function LogisticActionTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [logisticActionModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			Code: { location: logisticActionModule, identifier: 'entityCode' },
			Description: { location: basicsCommonModule, identifier: 'entityDescription' },
			ActionTargetFk: { location: logisticActionModule, identifier: 'entityActionTarget' },
			DescriptionInfo: { location: basicsCommonModule, identifier: 'entityDescriptionInfo' },
			RecordNo: { location: logisticActionModule, identifier: 'entityRecordNo' },
			LongDescriptionInfo: { location: logisticActionModule, identifier: 'entityLongDescriptionInfo' },
			Url: { location: basicsCustomizeModule, identifier: 'url' },
			IsLive: { location: basicsCustomizeModule, identifier: 'isLive' },
			HasDate: { location: logisticActionModule, identifier: 'entityHasDate' },
			HasUrl: { location: logisticActionModule, identifier: 'entityHasUrl' },
			HasPrjDoc: { location: logisticActionModule, identifier: 'entityHasPrjDoc' },
			HasPlantCert: { location: logisticActionModule, identifier: 'entityHasPlantCert' },
			HasBusinessPartner: { location: logisticActionModule, identifier: 'entityHasBusinessPartner' },
			HasPrcContract: { location: logisticActionModule, identifier: 'entityHasPrcContract' },
			HasClerk: { location: logisticActionModule, identifier: 'entityHasClerk' },
			CommentText: { location: basicsCustomizeModule, identifier: 'commenttext' },
			ActionItemTemplateFk: { location: logisticActionModule, identifier: 'entityActionItemTemplate' },
			ActionItemTypeFk: { location: logisticActionModule, identifier: 'entityActionItemType' },



		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
