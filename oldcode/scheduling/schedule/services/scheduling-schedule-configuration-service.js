/**
 * Created by baf on 03.09.2014.
 */

(function () {
	'use strict';
	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc service
	 * @name schedulingScheduleStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of schedule entities
	 */
	angular.module(moduleName).factory('schedulingScheduleConfigurationService',

		['platformUIStandardConfigService', 'schedulingScheduleTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'basicsCommonComplexFormatter',

			function (platformUIStandardConfigService, schedulingScheduleTranslationService, basicsLookupdataConfigGenerator, platformSchemaService, basicsCommonComplexFormatter) {

				function createSchedulingScheduleDetailLayout() {
					return {
						'fid': 'scheduling.schedule.scheduledetailform',
						'version': '1.0.0',
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'descriptioninfo', 'commenttext', 'scheduletypefk', 'calendarfk', 'performancesheetfk', 'targetstart', 'targetend', 'codeformatfk', 'remark', 'scheduleversion', 'isfinishedwith100percent', 'initwithtargetstart', 'schedulestatusfk', 'schedulechartintervalfk', 'chartintervalstartdate', 'chartintervalenddate', 'usecalendarforlagtime', 'isactive']
							},
							{
								'gid': 'userDefTextGroup',
								'isUserDefText': true,
								'attCount': 10
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							/*
															calendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
																dataServiceName: 'schedulingLookupCalendarDataService',
																enableCache: true,
																navigator: {
																	moduleName: 'scheduling.calendar',
																	registerService: 'schedulingCalendarMainService'
																}
															}),
							*/
							calendarfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'scheduling-calendar-filter-lookup',
										descriptionMember: 'Rate',
										lookupOptions: {
											showClearButton: true,
											defaultFilter: {'calendarType': 'enterprise', 'projectId': 'ProjectFk'},
											version: 3
										}
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											showClearButton: true,
											defaultFilter: {'calendarType': 'enterprise', 'projectId': 'ProjectFk'}
										},
										directive: 'scheduling-calendar-filter-lookup'
									},
									width: 150,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'schedulingCalendar',
										displayMember: 'Code',
										version: 3
									}
								}
							},
							performancesheetfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.performancesheet', 'Description'),
							codeformatfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomCodeFormatLookupDataService',
								enableCache: true
							}, {required: false}),
							scheduletypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.scheduletype', 'Description'),
							'code': {
								navigator: {
									moduleName: 'scheduling.main',
									registerService: 'schedulingMainService',
									targetIdProperty: 'Id'
								}
							},
							// schedulemasterfk: {
							// 	readonly: true,
							// 	'grid': {
							// 		'field': 'ScheduleDto',
							// 		'formatter': basicsCommonComplexFormatter,
							// 		'formatterOptions': {
							// 			displayMember: 'Code'
							// 		}
							// 	},
							// 	detail: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							// 		dataServiceName: 'schedulingLookupScheduleDataService',
							// 		moduleQualifier: 'schedulingLookupScheduleDataService',
							// 		desMember: 'DescriptionInfo.Translated',
							// 		readonly: false,
							// 		filter: function (item) {
							// 			return item && item.ProjectFk !== null ? item.ProjectFk : -1;
							// 		}
							// 	})
							// },
							scheduleversion: {readonly: true},
							schedulestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.schedulestatus', null, {
								showIcon: true,
								filterKey: 'scheduling-schedule-status-by-rubric-category-filter',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								imageSelectorService: 'platformStatusIconService'
							}),
							schedulechartintervalfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.schedulechartinterval', 'Description', {showIcon: true})
						}
					};
				}

				var schedulingScheduleDetailLayout = createSchedulingScheduleDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var schedulingScheduleAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ScheduleDto',
					moduleSubModule: 'Scheduling.Schedule'
				});
				schedulingScheduleAttributeDomains = schedulingScheduleAttributeDomains.properties;

				function ScheduleUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ScheduleUIStandardService.prototype = Object.create(BaseService.prototype);
				ScheduleUIStandardService.prototype.constructor = ScheduleUIStandardService;

				return new BaseService(schedulingScheduleDetailLayout, schedulingScheduleAttributeDomains, schedulingScheduleTranslationService);
			}
		]);
})();
