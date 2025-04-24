/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.controllingunittemplate';
	// Modules, beside my own in alphabetic order
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var controllingStructureModule = 'controlling.structure';

	/**
	 * @ngdoc service
	 * @name controllingControllingunittemplateTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(moduleName).service('controllingControllingunittemplateTranslationService', ControllingControllingunittemplateTranslationService);

	ControllingControllingunittemplateTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ControllingControllingunittemplateTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [moduleName, basicsCommonModule, cloudCommonModule, controllingStructureModule]
		};

		data.words = {
			// TODO: common translation keys (controlling module)
			ControllingGroupFk: {location: moduleName, identifier: 'entityControllinggroupFk', initial: 'Controlling Group'},
			ControllingGrpDetailFk: {location: moduleName, identifier: 'entityControllinggroupdetailFk', initial: 'Group Detail'},
			ControllingCatFk: {location: moduleName, identifier: 'entityControllingCatFk', initial: 'Category'},
			UomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
			CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
			IsBillingElement: {location: moduleName, identifier: 'entityIsBilling', initial: 'Is Billing'},
			IsAccountingElement: {location: moduleName, identifier: 'entityIsAccounting', initial: 'Is Accounting'},
			IsPlanningElement: {location: moduleName, identifier: 'entityIsPlanning', initial: 'Is Planning'},
			IsTimekeepingElement: {location: moduleName, identifier: 'entityIsTimekeeping', initial: 'Is Timekeeping'},
			IsAssetmanagement: {location: moduleName, identifier: 'entityIsAssetmanagement', initial: 'Is Assetmanagement'},
			IsStockmanagement: {location: moduleName, identifier: 'entityIsStockmanagement', initial: 'Is Stockmanagement'},
			IsPlantmanagement: {location: moduleName, identifier: 'entityIsPlantmanagement', initial: 'Is Plantmanagement'},
			CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment Text'},
			assignments: { location: moduleName, identifier: 'entityAssignments', initial: 'Assignment' },
			Assignment01: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '01' }, initial: 'Assignment 01' },
			Assignment02: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '02' }, initial: 'Assignment 02' },
			Assignment03: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '03' }, initial: 'Assignment 03' },
			Assignment04: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '04' }, initial: 'Assignment 04' },
			Assignment05: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '05' }, initial: 'Assignment 05' },
			Assignment06: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '06' }, initial: 'Assignment 06' },
			Assignment07: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '07' }, initial: 'Assignment 07' },
			Assignment08: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '08' }, initial: 'Assignment 08' },
			Assignment09: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '09' }, initial: 'Assignment 09' },
			Assignment10: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '10' }, initial: 'Assignment 10' },
			IsFixedBudget:{location: moduleName, identifier: 'isFixedBudget', initial: 'Fix Budget'},
			IsDefault:{location: moduleName, identifier: 'isDefault', initial: 'Is Default'},
			IsIntercompany:{location: moduleName, identifier: 'isIntercompany', initial: 'Intercompany'},
			userDefTextGroup: { location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'Userdefined Texts' },
			UserDefined1: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '1' }, initial: 'User Defined 1' },
			UserDefined2: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '2' }, initial: 'User Defined 2' },
			UserDefined3: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '3' }, initial: 'User Defined 3' },
			UserDefined4: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '4' }, initial: 'User Defined 4' },
			UserDefined5: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '5' }, initial: 'User Defined 5' }
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
