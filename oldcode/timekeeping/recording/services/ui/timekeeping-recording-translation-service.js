/*
 * $Id: timekeeping-recording-translation-service.js 626837 2021-03-09 15:46:07Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var tkRecordingModule = 'timekeeping.recording';
	var basicsCommonModule = 'basics.common';
	var basicsCustomModule = 'basics.customize';
	var cloudCommonModule = 'cloud.common';
	var tkCommonModule = 'timekeeping.common';
	var tkShiftModule = 'timekeeping.shiftmodel';
	var tkEmployeeModule = 'timekeeping.employee';
	var tkPeriodModule = 'timekeeping.period';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(tkRecordingModule).service('timekeepingRecordingTranslationService', TimekeepingRecordingTranslationService);

	TimekeepingRecordingTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TimekeepingRecordingTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [tkRecordingModule, basicsCommonModule, basicsCustomModule, cloudCommonModule,tkCommonModule, tkEmployeeModule, tkShiftModule, tkPeriodModule]
		};

		data.words = {
			CommentText: {location: cloudCommonModule, identifier: 'entityComment'},
			ShiftFk: {location: tkShiftModule, identifier: 'entityShift'},
			TimekeepingPeriodFk: {location: tkCommonModule, identifier: 'period'},
			EmployeeFk: {location: tkCommonModule, identifier: 'employee'},
			RecordingStatusFk: {location: basicsCustomModule, identifier: 'timekeepingrecordingstatus'},
			ReportStatusFk: {location: basicsCustomModule, identifier: 'timekeepingreportstatus'},
			SheetStatusFk: {location: basicsCustomModule, identifier: 'timekeepingsheetstatus'},
			SheetSymbolFk: {location: tkCommonModule, identifier: 'sheetSymbol'},
			DueDate: {location: tkRecordingModule, identifier: 'bookingDate'},
			TimeSymbolFk: {location: tkCommonModule, identifier: 'timeSymbol'},
			From: {location: tkCommonModule, identifier: 'fromTime'},
			To: {location: tkCommonModule, identifier: 'toTime'},
			Duration: {location: tkCommonModule, identifier: 'duration'},
			ControllingUnitFk: {location: cloudCommonModule, identifier: 'entityControllingUnit'},
			ResultStatusFk: {location: basicsCustomModule, identifier: 'timekeepingresultstatus'},
			Hours: {location: tkRecordingModule, identifier: 'hours'},
			SheetFk: {location: tkRecordingModule, identifier: 'entitySheet'},
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProject'},
			ProjectActionFk: {location: tkRecordingModule, identifier: 'entityProjectAction'},
			RubricCategoryFk: {location: basicsCustomModule, identifier: 'rubriccategory'},
			JobFk:{location: tkRecordingModule, identifier: 'entityJobFk'},
			PlantFk:{location: tkRecordingModule, identifier: 'entityPlantFk'},
			BreakFrom:{location: tkRecordingModule, identifier: 'entityBreakFrom'},
			BreakTo:{location: tkRecordingModule, identifier: 'entityBreakTo'},
			Rate:{location: cloudCommonModule, identifier: 'entityRate'},
			PayrollYear:{location: tkCommonModule, identifier: 'payrollYear'},
			FromTimePartTime:{location: tkRecordingModule, identifier: 'fromtimeparttime'},
			FromTimePartDate:{location: tkRecordingModule, identifier: 'fromtimepartdate'},
			ToTimePartTime:{location: tkRecordingModule, identifier: 'totimeparttime'},
			ToTimePartDate:{location: tkRecordingModule, identifier: 'totimepartdate'},

			FromTimeBreakTime:{location: tkRecordingModule, identifier: 'fromtimebreaktime'},
			FromTimeBreakDate:{location: tkRecordingModule, identifier: 'fromtimebreakdate'},
			ToTimeBreakTime:{location: tkRecordingModule, identifier: 'totimebreaktime'},
			ToTimeBreakDate:{location: tkRecordingModule, identifier: 'totimebreakdate'},
			BreakDuration:{location: tkRecordingModule, identifier : 'breakduration'},


			Weekday:{location: tkRecordingModule, identifier: 'weekday'},
			IsGenerated:{location: tkRecordingModule, identifier: 'isGenerated'},
			IsModified:{location: tkRecordingModule, identifier: 'isModified'},
			IsLive:{location: cloudCommonModule, identifier: 'entityIsLive'},
			RecordingFk: {location: tkRecordingModule, identifier: 'entityRecordingFk'},
			ReportFk: {location: tkRecordingModule, identifier: 'entityReportFk'},
			BreakStart: {location: tkRecordingModule, identifier: 'entityBreakStart'},
			BreakEnd: {location: tkRecordingModule, identifier: 'entityBreakEnd'},
			Longitude:{location: tkRecordingModule, identifier : 'entityLongitude'},
			Latitude:{location: tkRecordingModule, identifier : 'entityLatitude'},
			TimeRecorded:{location: tkRecordingModule, identifier : 'entityTimeRecorded'},
			ReportVerificationTypeFk:{location: tkRecordingModule, identifier : 'entityReportVerificationTypeFk'},
			InsertedAtOriginal:{location: tkRecordingModule, identifier : 'entityInsertedAtOriginal'},
			InsertedByOriginal:{location: tkRecordingModule, identifier : 'entityInsertedByOriginal'},
			FromTime:{location: tkRecordingModule, identifier: 'entityFromTime'},
			ToTime:{location: tkRecordingModule, identifier: 'entityToTime'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 10, 'UserDefinedText', '0', 'userdefinedtext');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 10, 'UserDefinedNumber', '0', 'userdefinednumber');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 10, 'UserDefinedDate', '0', 'userdefineddate');

		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
