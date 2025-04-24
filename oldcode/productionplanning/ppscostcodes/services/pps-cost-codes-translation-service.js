/*
 * $Id: pps-cost-codes-translation-service.js 64239 2022-11-30 08:03:08Z jay.ma $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const ppsCostCodesModule = 'productionplanning.ppscostcodes';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const basicsCostCodesModule = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name ppsCostCodesTranslationService
	 * @description Provides translations for the module.
	 */
	angular.module(ppsCostCodesModule).service('ppsCostCodesTranslationService', ProductionPlanningPpsCostCodesTranslationService);

	ProductionPlanningPpsCostCodesTranslationService.$inject = ['platformTranslationUtilitiesService', 'basicsCostCodesTranslationService'];

	function ProductionPlanningPpsCostCodesTranslationService(platformTranslationUtilitiesService, basicsCostCodesTranslationService) {
		const service = {};
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [ppsCostCodesModule, basicsCommonModule, cloudCommonModule, basicsCostCodesModule]
		};

		data.words = {
			ppsProperties: { location: ppsCostCodesModule, identifier: 'ppsProperties', initial: '*PPS Properties' },
			'PpsCostCode.NewTksTimeSymbolFk': { location: ppsCostCodesModule, identifier: 'tksTimeSymbolFk', initial: '*Time Symbol' },
			'PpsCostCode.UseToCreateComponents': { location: ppsCostCodesModule, identifier: 'useToCreateComponents', initial: '*Use To Create Components' },
			'PpsCostCode.UseToUpdatePhaseReq': { location: ppsCostCodesModule, identifier: 'useToUpdatePhaseReq', initial: '*Use To Update Phase Requirement' },
			'PpsCostCode.ShowAsSlotOnProduct': { location: ppsCostCodesModule, identifier: 'showAsSlotOnProduct', initial: '*Show As Slot On Product' },
			'PpsCostCode.CommentText': { location: cloudCommonModule, identifier: 'entityComment' },
			'PpsCostCode.UserDefined1': { location: ppsCostCodesModule, identifier: 'userDefined1', initial: '*Pps Cost Code Text 1' },
			'PpsCostCode.UserDefined2': { location: ppsCostCodesModule, identifier: 'userDefined2', initial: '*Pps Cost Code Text 2' },
			'PpsCostCode.UserDefined3': { location: ppsCostCodesModule, identifier: 'userDefined3', initial: '*Pps Cost Code Text 3' },
			'PpsCostCode.UserDefined4': { location: ppsCostCodesModule, identifier: 'userDefined4', initial: '*Pps Cost Code Text 4' },
			'PpsCostCode.UserDefined5': { location: ppsCostCodesModule, identifier: 'userDefined5', initial: '*Pps Cost Code Text 5' },
			'PpsCostCode.IsReadonly': { location: ppsCostCodesModule, identifier: 'isReadonly', initial: '*Readonly as Component' },
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined', '', 'userDefText');

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);

		service.getTranslationInformation = function (key) {
			let information = data.words[key];
			if (!information) {
				information = basicsCostCodesTranslationService.getTranslationInformation(key);
			}
			return information;
		};

		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}

})(angular);
