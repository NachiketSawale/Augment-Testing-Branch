/**
 * Created by leo on 03.05.2018.
 */
(function (angular) {
	'use strict';

	var tkModule = 'timekeeping.shiftmodel';
	var customizeModule = 'basics.customize';
	var cloudCommonModule = 'cloud.common';
	var tkCommonModule = 'timekeeping.common';
	var tkRecordingModule = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelTranslationService
	 * @description provides translation for timekeeping shift model module
	 */
	angular.module(tkModule).factory('timekeepingShiftModelTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [tkModule, customizeModule, cloudCommonModule, tkCommonModule,tkRecordingModule],
				words: {
					Acronym: {location: customizeModule, identifier: 'acronym'},
					TimeSymbolFk: {location: tkCommonModule, identifier: 'timeSymbol'},
					FromTime: {location: tkCommonModule, identifier: 'fromTime'},
					ToTime: {location: tkCommonModule, identifier: 'toTime'},
					Duration: {location: tkCommonModule, identifier: 'duration'},
					CommentText: {location: cloudCommonModule, identifier: 'entityComment'},
					ExceptionDayFk: {location: tkModule, identifier: 'entityExceptionDay'},
					WeekdayFk: {location: tkCommonModule, identifier: 'entityWeekday'},
					CalendarFk: {location: cloudCommonModule, identifier: 'entityCalCalendarFk'},
					ExceptDate: {location: tkModule, identifier: 'entityExceptDate'},
					IsWorkday: {location: tkModule, identifier: 'entityIsWorkday'},
					BreakFrom: {location: tkModule, identifier: 'entityBreakFrom'},
					BreakTo: {location: tkModule, identifier: 'entityBreakTo'},
					TimeSymWorkOnHolidayFk: {location: tkModule, identifier: 'entityTimeSymWorkOnHoliday'},
					DefaultWorkdayFk: {location: tkModule, identifier: 'entityDefaultWorkday'},
					ShiftGroupFk: {location: tkModule, identifier: 'entityShiftGroup'},
					TimekeepingGroupFk: {location: tkModule, identifier: 'entityTimekeepingGroup'},

					BreakStart: {location: tkModule, identifier: 'entityBreakStart'},
					BreakEnd: {location: tkModule, identifier: 'entityBreakEnd'},
					ISStartAfterMidnight:{location: tkModule, identifier: 'entityStartAfterMidnight'},
					ISEndAfterMidnight:{location: tkModule, identifier: 'entityEndAfterMidnight'}
				}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
