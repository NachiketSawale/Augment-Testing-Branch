/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	let timekeepingWorkTimeModelModule = 'timekeeping.worktimemodel';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';


	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(timekeepingWorkTimeModelModule).service('timekeepingWorkTimeModelTranslationService', TimekeepingWorkTimeModelTranslationService);

	TimekeepingWorkTimeModelTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TimekeepingWorkTimeModelTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [timekeepingWorkTimeModelModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: timekeepingWorkTimeModelModule, identifier: 'key', initial: 'English' }
			WeekEndsOn:{location: timekeepingWorkTimeModelModule,identifier:'entityWeekEndsOn',initial:'Week Ends On'},
			Description: { location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description' },
			IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' },
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active' },
			Isstatussensitive: { location: timekeepingWorkTimeModelModule, identifier:'entityIsstatussensitive', initial:'Is Status Sensitive'},
			Sorting:{location: timekeepingWorkTimeModelModule,identifier:'entitySorting',initial:'Sorting'},
			CommentText: { location: basicsCommonModule, identifier: 'entityCommentText', initial: 'Comments'},
			WorkingTimeModelFk:{location: timekeepingWorkTimeModelModule,identifier:'entityWorkingTimeModel',initial:'Working Time Model'},
			TimeSymbolFk:{location: timekeepingWorkTimeModelModule, identifier: 'entityTimeSymbol',initial:'Time Symbol'},
			WeekDayIndex:{location: timekeepingWorkTimeModelModule,identifier:'entityWeekDayIndex',initial:'WeekDay'},
			FromTime:{location: timekeepingWorkTimeModelModule,identifier:'entityFromTime',initial:'From Time'},
			ToTime:{location: timekeepingWorkTimeModelModule,identifier:'entityToTime',initial:'To Time'},
			FromQuantity:{location: timekeepingWorkTimeModelModule,identifier:'entityFromQuantity',initial:'From Quantity'},
			ToQuantity:{location: timekeepingWorkTimeModelModule,identifier:'entityToQuantity',initial:'To Quantity'},
			TimeSymbolDerivedFk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolDerivedFk',initial:'Time Symbol Derived'},
			ValidFrom:{location: cloudCommonModule,identifier:'entityValidFrom',initial:'Valid From'},
			TargetHours:{location: timekeepingWorkTimeModelModule,identifier:'entityTargetHours',initial:'Target Hours'},
			DailyLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityDailyLimit',initial:'Daily Limit'},
			WeeklyLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityWeeklyLimit',initial:'Weekly Limit'},
			MonthlyLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityMonthlyLimit',initial:'Monthly Limit'},
			DailySavingLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityDailySavingLimit',initial:'Daily Saving Limit'},
			WeeklySavingLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityWeeklySavingLimit',initial:'Weekly Saving Limit'},
			MonthlySavingLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityMonthlySavingLimit',initial:'Monthly Saving Limit'},
			YearlySavingLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityYearlySavingLimit',initial:'Yearly Saving Limit'},
			TimeSymbolBusl1Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolBusl1Fk',initial:'Time symbol for hrs before upper saving limit'},
			TimeSymbolBusl2Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolBusl2Fk',initial:'Additional time symbol for hrs before upper saving limit'},
			TimeSymbolAsl1Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolAsl1Fk',initial:'Time symbol for hrs over saving limit '},
			TimeSymbolAsl2Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolAsl2Fk',initial:'Additional Time symbol for hrs over saving limit'},
			AccountMaxLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityAccountMaxLimit',initial:'Account max. Limit'},
			AccountMinLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityAccountMinLimit',initial:'Account min. Limit'},
			TimeSymbolOml1Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolOml1Fk',initial:'Time Symbol for hrs over account limit'},
			TimeSymbolOml2Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolOml2Fk',initial:'Additional Time Symbol for hrs over account limit'},
			TimeSymbolRecapBlFk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolRecapBlFk',initial:'Time Symbol to consume recup hours'},
			TimeSymbolRecapUlFk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolRecapUlFk',initial:'Additional Time Symbol to consume recup hours'},
			CalendarFk:{location: timekeepingWorkTimeModelModule,identifier:'entityCalendarFk',initial:'Calendar'},
			TimeSymbolBdl1Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolBDL1Fk',initial:'Time Symbol before daily limit'},
			TimeSymbolBdl2Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolBDL2Fk',initial:'Additional Time Symbol before daily limit'},
			TimeSymbolBlsl1Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolTimeSymbolBlsl1FK',initial:'Time Symbol before lower daily saving limit'},
			TimeSymbolBlsl2Fk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolTimeSymbolBlsl2FK',initial:'Additional Time Symbol before lower daily saving limit'},
			LowerDailySavingLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityLowerDailySavingLimit',initial:'Lower daily saving limit'},
			UpperDailySavingLimit:{location: timekeepingWorkTimeModelModule,identifier:'entityUpperDailySavingLimit',initial:'Upper daily saving limit'},
			limits:{location: timekeepingWorkTimeModelModule,identifier:'limits'},
			timeSymbolLimits:{location: timekeepingWorkTimeModelModule,identifier:'timeSymbolLimits'},
			savingLimits:{location: timekeepingWorkTimeModelModule,identifier:'savingLimits'},
			timeSymbolSavingLimits:{location: timekeepingWorkTimeModelModule,identifier:'timeSymbolSavingLimits'},
			WorkingTimemodelFk:{location:timekeepingWorkTimeModelModule, identifier:'workingTimeModelFk'},
			EvaluatePositiveHour:{location:timekeepingWorkTimeModelModule, identifier:'evaluatePositiveHour'},
			VactionYearStart:{location:timekeepingWorkTimeModelModule, identifier:'entityVactionYearStart'},
			VactionExpiryDate:{location:timekeepingWorkTimeModelModule, identifier:'entityVactionExpiryDate'},
			TimeSymbolLevelTimesFk:{location: timekeepingWorkTimeModelModule,identifier:'entityTimeSymbolLevelTimesFK'},
			IsFallback:{location: timekeepingWorkTimeModelModule,identifier:'entityisfallback'},
			WorkingTimeModelFbFk:{location: timekeepingWorkTimeModelModule,identifier:'entityworkingtimemodelfbfk'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words,'basicData');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0', '');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
