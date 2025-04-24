/**
 * Created by leo on 16.09.2014.
 */

(function (angular) {
	'use strict';

	var schedulingCalendarModule = 'scheduling.calendar';
	var cloudCommonModule = 'cloud.common';
	var customizeModule = 'basics.customize';


	/**
	 * @ngdoc service
	 * @name schedulingCalendarTranslationService
	 * @description provides translation for scheduling calendar module
	 */
	angular.module(schedulingCalendarModule).factory('schedulingCalendarTranslationService', ['platformTranslateService', 'platformTranslationUtilitiesService',

		function (platformTranslateService, platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [schedulingCalendarModule, cloudCommonModule, customizeModule]
			};

			data.words = {
				workHours: { location: schedulingCalendarModule, identifier: 'entityWorkHours', initial: 'Work hours' },
				CommentText: { location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment' },
				IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Default' },
				WorkHourDefinesWorkDay:{ location: schedulingCalendarModule, identifier: 'entityWorkHourDefinesWorkDay', initial: 'Worhhour def. workdays' },
				WeekdayFk:{ location: schedulingCalendarModule, identifier: 'entityWeekday', initial: 'Weekday' },
				WorkHoursPerDay:{ location: schedulingCalendarModule, identifier: 'entityWorkHoursPerDay', initial: 'Work hours per day' },
				WorkHoursPerWeek:{ location: schedulingCalendarModule, identifier: 'entityWorkHoursPerWeek', initial: 'Work hours per week' },
				WorkHoursPerMonth:{ location: schedulingCalendarModule, identifier: 'entityWorkHoursPerMonth', initial: 'Work hours per month' },
				WorkHoursPerYear:{ location: schedulingCalendarModule, identifier: 'entityWorkHoursPerYear', initial: 'Work hours per Year' },
				BasUomHourFk:{ location: schedulingCalendarModule, identifier: 'entityBasUomHour', initial: 'UoM of hour' },
				BasUomDayFk:{ location: schedulingCalendarModule, identifier: 'entityBasUomDay', initial: 'UoM of day' },
				IsLive:{ location: schedulingCalendarModule, identifier: 'entityIsLive', initial: 'Live' },
				WorkStart:{ location: schedulingCalendarModule, identifier: 'entityWorkStart', initial: 'Start work' },
				WorkEnd:{ location: schedulingCalendarModule, identifier: 'entityWorkEnd', initial: 'End work' },
				IsWeekend:{ location: schedulingCalendarModule, identifier: 'entityIsWeekend', initial: 'Weekend' },
				AcronymInfo:{ location: schedulingCalendarModule, identifier: 'entityAcronym', initial: 'AcronymInfo' },
				WeekdayIndex:{ location: schedulingCalendarModule, identifier: 'entityAcronym', initial: 'Acronym' },
				IsWorkingDay:{ location: schedulingCalendarModule, identifier: 'entityIsWorkingDay', initial: 'Working day' },
				IsWorkday:{ location: schedulingCalendarModule, identifier: 'entityIsWorkingDay', initial: 'Working day' },
				BackgroundColor:{ location: schedulingCalendarModule, identifier: 'entityBackgroundColor', initial: 'Background color' },
				FontColor:{ location: schedulingCalendarModule, identifier: 'entityFontColor', initial: 'Font color' },
				IsShownInChart:{ location: schedulingCalendarModule, identifier: 'entityIsShownInChart', initial: 'Is shown in chart' },
				ExceptDate:{ location: schedulingCalendarModule, identifier: 'entityExceptionDate', initial: 'Exception date' },
				HeaderTitle:{ location: schedulingCalendarModule, identifier: 'detailTitle', initial:'Details'},
				CalendarGridHeader:{ location: schedulingCalendarModule, identifier: 'CalendarGridHeader', initial:'Calendar List'},
				Percent: { location: cloudCommonModule, identifier: 'entityPercent', initial: 'Percent' },
				Year:{ location: schedulingCalendarModule, identifier: 'year', initial:'Year'},
				Month:{ location: schedulingCalendarModule, identifier: 'month', initial:'Month'},
				CalendarTypeFk: {location: customizeModule, identifier: 'calendartype', initial:'Calendar Type'},
				BasUomWorkDayFk: {location: schedulingCalendarModule, identifier: 'uomWorkDay'},
				BasUomWeekFk: {location: schedulingCalendarModule, identifier: 'uomWeek'},
				BasUomMonthFk: {location: schedulingCalendarModule, identifier: 'uomMonth'},
				BasUomYearFk: {location: schedulingCalendarModule, identifier: 'uomYear'},
				BasUomMinuteFk: {location: schedulingCalendarModule, identifier: 'uomMinute'}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');

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
