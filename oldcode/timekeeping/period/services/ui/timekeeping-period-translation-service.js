/*
 * $Id: timekeeping-period-translation-service.js 625930 2021-03-03 13:16:53Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	let tkPeriodModule = 'timekeeping.period';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';
	let tkCommonModule = 'timekeeping.common';
	let basicsCustomizeModule = 'basics.customize';
	let tkRecordingModule = 'timekeeping.recording';
	let projectMainModule = 'project.main';

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(tkPeriodModule).service('timekeepingPeriodTranslationService', TimekeepingPeriodTranslationService);

	TimekeepingPeriodTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TimekeepingPeriodTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [tkPeriodModule, basicsCommonModule, cloudCommonModule, tkCommonModule, basicsCustomizeModule, tkRecordingModule, projectMainModule]
		};

		data.words = {
			// Word: { location: tkPeriodModule, identifier: 'key', initial: 'XX' },
			PeriodStatusFk: {location: cloudCommonModule, identifier: 'entityStatus'},
			StartDate: {location: tkCommonModule, identifier: 'startTime'},
			EndDate: {location: tkCommonModule, identifier: 'endTime'},
			PayrollYear: {location: tkCommonModule, identifier: 'payrollYear'},
			PayrollPeriod: {location: tkCommonModule, identifier: 'payrollPeriod'},
			PayrollDate: {location: tkCommonModule, identifier: 'payrollDate'},
			PostingDate: {location: tkCommonModule, identifier: 'postingDate'},
			Due1Date: {location: tkCommonModule, identifier: 'due1Date'},
			Due2Date: {location: tkCommonModule, identifier: 'due2Date'},
			TimekeepingGroupFk: {location: tkCommonModule, identifier: 'timekeepingGroup'},
			VoucherNumber: {location: cloudCommonModule, identifier: 'entityVoucherNumber'},
			VoucherDate: {location: cloudCommonModule, identifier: 'entityVoucherDate'},
			MessageSeverityFk: {location: basicsCustomizeModule, identifier: 'messageseverity'},
			Message: {location: basicsCustomizeModule, identifier: 'message'},
			RecordingFk: {location: tkRecordingModule, identifier: 'timekeepingRecordingEntity'},
			IsTransaction: {location: tkPeriodModule, identifier: 'entityIsTransaction'},
			NominalDimension1: {location: tkPeriodModule, identifier: 'nominalDimension', param: {'index': '1'}},
			NominalDimension2: {location: tkPeriodModule, identifier: 'nominalDimension', param: {'index': '2'}},
			NominalDimension3: {location: tkPeriodModule, identifier: 'nominalDimension', param: {'index': '3'}},
			ControllingUnitCode: {location: cloudCommonModule, identifier: 'entityControllingUnit'},
			ControllingUnitFk: {location: cloudCommonModule, identifier: 'entityControllingUnit'},
			CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany'},
			CompanyChargedFk: {location: tkPeriodModule, identifier: 'entityCompanyChargedFk'},
			TransactionCase: {location: tkPeriodModule, identifier: 'entityTransactionCase'},
			controllingAssignments: {location: tkPeriodModule, identifier: 'controllingAssignments'},
			PostingNarritive: {location: cloudCommonModule, identifier: 'entityPostingNarritive'},
			EmployeeFk: {location: tkPeriodModule, identifier: 'entityEmployee'},
			ActivityFk: {location: tkPeriodModule, identifier: 'entityActivity'},
			Amount: {location: cloudCommonModule, identifier: 'entityAmount'},
			IsDebit: {location: tkPeriodModule, identifier: 'entityIsDebit'},
			IsSuccess: {location: tkPeriodModule, identifier: 'entityIsSuccess'},
			Account: {location: tkPeriodModule, identifier: 'entityAccountNumber'},
			AccountFk: {location: tkPeriodModule, identifier: 'entityAccount'},
			CompanyCostHeaderFk: {location: tkPeriodModule, identifier: 'entityCompanyCostHeader'},
			InvHeaderFk: {location: tkPeriodModule, identifier: 'entityInvHeader'},
			BilHeaderFk: {location: tkPeriodModule, identifier: 'entityBilHeader'},
			financialInfo: {location: tkPeriodModule, identifier: 'financialInfo'},
			UomFk: {location: tkPeriodModule, identifier: 'UomFk'},
			SettlementItemFk: {location: tkPeriodModule, identifier: 'SettlementItemFk'},
			ProjectChangeFk: {location: projectMainModule, identifier: 'entityChange', initial: 'Change'},
			IsBaseRate:{location: tkPeriodModule, identifier: 'entityIsBaseRate'}
		};

		let conf = {
			count: 10,
			default: 'Assignment',
			ident: 'controllingUnitAssign',
			interFix: '0',
			preFix: 'ControllingUnitAssign',
			where: tkPeriodModule,
			words: data.words
		};
		platformTranslationUtilitiesService.addMultipleTranslations(conf);
		conf.default = 'Assignment Text';
		conf.ident = 'controllingUnitAssignText';
		conf.preFix = 'ControllingUnitAssignDesc';
		platformTranslationUtilitiesService.addMultipleTranslations(conf);

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0', 'userdefinedtext');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0', 'userdefinednumber');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0', 'userdefineddate');

		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
