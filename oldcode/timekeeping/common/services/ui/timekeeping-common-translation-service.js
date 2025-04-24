/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var timekeepingCommonModule = 'timekeeping.common';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name timekeepingCommonTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(timekeepingCommonModule).service('timekeepingCommonTranslationService', TimekeepingCommonTranslationService);

	TimekeepingCommonTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TimekeepingCommonTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [timekeepingCommonModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: timekeepingCommonModule, identifier: 'key', initial: 'English' }
			ResultFk: {location: timekeepingCommonModule, identifier: 'entityTksResult'},
			EmployeeFk: {location: timekeepingCommonModule, identifier: 'employee'},
			TimekeepingPeriodFk: {location: timekeepingCommonModule, identifier: 'period'},
			SheetSymbolFk: {location: timekeepingCommonModule, identifier: 'sheetSymbol'},
			TimeSymbolFk: {location: timekeepingCommonModule, identifier: 'timeSymbol'},
			From: {location: timekeepingCommonModule, identifier: 'fromTime'},
			To: {location: timekeepingCommonModule, identifier: 'toTime'},
			Duration: {location: timekeepingCommonModule, identifier: 'duration'},
			PayrollYear:{location: timekeepingCommonModule, identifier: 'payrollYear'},
			StartDate: { location: timekeepingCommonModule, identifier: 'startTime'},
			EndDate: { location: timekeepingCommonModule, identifier: 'endTime'},
			PayrollPeriod: { location: timekeepingCommonModule, identifier: 'payrollPeriod'},
			PayrollDate: { location: timekeepingCommonModule, identifier: 'payrollDate'},
			PostingDate: { location: timekeepingCommonModule, identifier: 'postingDate'},
			Due1Date: { location: timekeepingCommonModule, identifier: 'due1Date'},
			Due2Date: { location: timekeepingCommonModule, identifier: 'due2Date'},
			TimekeepingGroupFk: { location: timekeepingCommonModule, identifier: 'timekeepingGroup'},
			FromTime: {location: timekeepingCommonModule, identifier: 'fromTime'},
			ToTime: {location: timekeepingCommonModule, identifier: 'toTime'},
			ExceptionDayFk: {location: timekeepingCommonModule, identifier: 'entityExceptionDay'},
			WeekdayFk: {location: timekeepingCommonModule, identifier: 'entityWeekday'},
			ExceptDate:{location:timekeepingCommonModule, identifier: 'entityExceptDate'},
			IsWorkday:{location:timekeepingCommonModule, identifier: 'entityIsWorkday'}
		};

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
