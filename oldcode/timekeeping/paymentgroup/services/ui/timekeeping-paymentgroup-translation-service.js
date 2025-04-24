/*
 * $Id: timekeeping-paymentgroup-translation-service.js 623094 2021-02-08 11:24:09Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var timekeepingPaymentgroupModule = 'timekeeping.paymentgroup';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentgroupTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(timekeepingPaymentgroupModule).service('timekeepingPaymentGroupTranslationService', TimekeepingPaymentgroupTranslationService);

	TimekeepingPaymentgroupTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TimekeepingPaymentgroupTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [timekeepingPaymentgroupModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: timekeepingPaymentgroupModule, identifier: 'key', initial: 'English' }
			DescriptionInfo: { location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description' },
			IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' },
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active' },
			CommentText: { location: basicsCommonModule, identifier: 'entityCommentText', initial: 'Comment Text'},
			ControllingUnitFk: { location: cloudCommonModule, identifier: 'entityControllingUnit' , initial: 'Controlling Unit'},
			Rate: { location: cloudCommonModule, identifier: 'entityRate', initial: 'Rate'},
			ValidFrom: { location: cloudCommonModule, identifier: 'entityValidFrom' , initial: 'Valid From' },
			SurchargeTypeFk: { location: timekeepingPaymentgroupModule, identifier: 'entitySurchargeTypeFk', initial: 'Surcharge Type'},
			Code:{location:timekeepingPaymentgroupModule,identifier:'code'},
			PaymentGroupRateFk:{location:timekeepingPaymentgroupModule,identifier:'paymentGroupRateFk'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 10, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 10, 'UserDefinedNumber', '0');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 10, 'UserDefinedDate', '0');
		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
