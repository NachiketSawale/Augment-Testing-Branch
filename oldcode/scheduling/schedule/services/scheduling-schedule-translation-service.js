/**
 * Created by baf on 01.09.2014.
 */

(function (angular) {
	'use strict';

	var schedulingScheduleModule = 'scheduling.schedule';
	var cloudCommonModule = 'cloud.common';
	var basicsCompanyModule = 'basics.company';
	/**
	 * @ngdoc service
	 * @name schedulingScheduleTranslationService
	 * @description provides translation for scheduling schedule module
	 */
	angular.module(schedulingScheduleModule).factory('schedulingScheduleTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [schedulingScheduleModule, cloudCommonModule, basicsCompanyModule]
			};

			data.words = {
				baseData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
				DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
				Project: {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'},
				ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'},
				CalendarFk: {location: cloudCommonModule, identifier: 'entityCalCalendarFk', initial: 'Calendar (FI)'},
				Percent: {location: cloudCommonModule, identifier: 'entityPercent', initial: 'Percent'},
				PerformanceSheetFk: {
					location: cloudCommonModule,
					identifier: 'entityPsdPerformanceSheetFk',
					initial: 'PerformanceSheet'
				},
				ScheduleTypeFk: {
					location: schedulingScheduleModule,
					identifier: 'entityPsdScheduleTypeFk',
					initial: 'ScheduleType'
				},
				Date: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'},
				Text: {location: schedulingScheduleModule, identifier: 'entityText', initial: 'Text'},
				Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
				entitySchedule: {location: schedulingScheduleModule, identifier: 'entitySchedule', initial: 'Schedule'},
				CommentText: {location: schedulingScheduleModule, identifier: 'commenttext', initial: 'Comment'},
				TargetStart: {location: schedulingScheduleModule, identifier: 'targetstart', initial: 'Target Start'},
				TargetEnd: {location: schedulingScheduleModule, identifier: 'targetend', initial: 'Target End'},
				IsGenerated: {location: cloudCommonModule, identifier: 'isGenerated', initial: 'IsGenerated'},
				Color:{ location: schedulingScheduleModule, identifier: 'entityColor', initial: 'Color' },
				InitWithTargetStart:{ location: schedulingScheduleModule, identifier: 'initWithTargetStart', initial: 'XXX' },
				ScheduleStatusFk:{ location: schedulingScheduleModule, identifier: 'entitySchedulestatusfk', initial: 'Schedule Status' },
				ScheduleChartIntervalFk:{ location: schedulingScheduleModule, identifier: 'entityScheduleChartInterval', initial: 'Schedule Chart Interval' },
				ChartIntervalStartDate: {location: schedulingScheduleModule, identifier: 'chartintervalstartdate', initial: 'Chart Interval Start'},
				ChartIntervalEndDate: {location: schedulingScheduleModule, identifier: 'chartintervalenddate', initial: 'Chart Interval End'},
				UseCalendarForLagtime: {  location: schedulingScheduleModule, identifier: 'useCalendarForLagtime', initial: 'Use Calendar For Lagtime' },
				ScheduleMasterFk: {  location: schedulingScheduleModule, identifier: 'scheduleMasterFk', initial: 'Schedule Master' },
				IsActive:{location: schedulingScheduleModule, identifier:'isactive'}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addClerkContainerTranslations(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 10, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			var addScheduleBasicWordsFn = function addScheduleBasicWords(words) {
				words.listTitle = {
					location: schedulingScheduleModule,
					identifier: 'listContainerTitle',
					initial: 'Schedules'
				};
				words.detailTitle = {
					location: schedulingScheduleModule,
					identifier: 'detailContainerTitle',
					initial: 'Details Schedule'
				};
				words.entityTimeline = {
					location: schedulingScheduleModule,
					identifier: 'entityTimeline',
					initial: 'Timelines'
				};
				words.entityDetailTimeline = {
					location: schedulingScheduleModule,
					identifier: 'entityDetailTimeline',
					initial: 'Detail Timeline'
				};
				words.IsActive = {location: cloudCommonModule, identifier: 'entityIsActive', initial: 'Is Active'};
				words.EndDate = {location: cloudCommonModule, identifier: 'entityEndDate', initial: 'End Date'};
				words.CodeFormatFk = {
					location: schedulingScheduleModule,
					identifier: 'codeformat',
					initial: 'Code Format'
				};
				words.ScheduleVersion = {
					location: schedulingScheduleModule,
					identifier: 'entityScheduleVersion',
					initial: 'Schedule Version'
				};
				words.IsFinishedWith100Percent = {location: schedulingScheduleModule, identifier: 'entityFinishedWith100', initial: 'Activities are finished with 100% progress'};
				words.basicData = {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'};
				words.scheduleClerkListTitle = {location: cloudCommonModule, identifier: 'scheduleClerkListTitle', initial: 'Schedule Clerks'};
				words.scheduleClerkDetailTitle = {location: cloudCommonModule, identifier: 'scheduleClerkDetailTitle', initial: 'Schedule Clerk Details'};
			};
			addScheduleBasicWordsFn(data.words);

			service.addScheduleBasicWords = addScheduleBasicWordsFn;

			return service;
		}
	]);
})(angular);
