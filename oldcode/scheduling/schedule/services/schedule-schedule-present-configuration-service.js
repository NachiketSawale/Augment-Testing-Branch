/**
 * Created by leo on 04.11.2014.
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
	angular.module(moduleName).factory('schedulingSchedulePresentConfigurationService',

		['platformUIStandardConfigService', 'schedulingScheduleTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, schedulingScheduleTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createSchedulingSchedulePresentDetailLayout() {
					return {
						'fid': 'scheduling.schedule.schedulepresentdetailform',
						'version': '1.0.0',
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'descriptioninfo', 'calendarfk', 'scheduletypefk', 'performancesheetfk', 'codeformatfk', 'projectfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							descriptioninfo: {
								readonly: true
							},
							calendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupCalendarDataService',
								enableCache: true,
								readonly: true,
								navigator: {
									moduleName: 'scheduling.calendar'
								}
							}),
							performancesheetfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.performancesheet', 'Description'),
							scheduletypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupScheduleTypeDataService',
								enableCache: true,
								readonly: true
							}),
							codeformatfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomCodeFormatLookupDataService',
								enableCache: true
							}, {required: false}),
							projectfk: {
								readonly: true,
								navigator: {
									moduleName: 'project.main',
									targetIdProperty: 'ProjectFk'
								},
								detail: {
									type: 'code',
									formatter: 'code',
									model: 'Schedule.Project.ProjectNo'
								},
								grid: {
									formatter: 'code',
									field: 'Schedule.Project.ProjectNo'
								}
							},
							code: {
								readonly: true,
								navigator: {
									moduleName: 'scheduling.main',
									targetIdProperty: 'Id'
								}
							}
						}
					};
				}

				var schedulingSchedulePresentDetailLayout = createSchedulingSchedulePresentDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var schedulingScheduleAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ScheduleDto',
					moduleSubModule: 'Scheduling.Schedule'
				});
				schedulingScheduleAttributeDomains = schedulingScheduleAttributeDomains.properties;

				return new BaseService(schedulingSchedulePresentDetailLayout, schedulingScheduleAttributeDomains, schedulingScheduleTranslationService);
			}
		]);
})();
