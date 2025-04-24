/**
 * Created by leo on 26.08.2015.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc service
	 * @name schedulingScheduleTimelineStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of timeline entities
	 */
	angular.module(moduleName).factory('schedulingScheduleTimelinePresentConfigurationService',

		['platformUIStandardConfigService', 'schedulingScheduleTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, schedulingScheduleTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createSchedulingScheduleTimelineDetailLayout() {
					return {
						'fid': 'scheduling.schedule.scheduletimnelinedetailform',
						'version': '1.0.0',
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['date', 'enddate', 'text', 'remark', 'isactive', 'color']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							date: {
								readonly: true
							},
							enddate: {
								readonly: true
							},
							text: {
								readonly: true
							},
							remark: {
								readonly: true
							},
							isactive: {
								readonly: true
							},
							color: {
								readonly: true
							}

						}
					};
				}

				var schedulingScheduleimelineDetailLayout = createSchedulingScheduleTimelineDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var schedulingScheduleTimelineAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'TimelineDto',
					moduleSubModule: 'Scheduling.Schedule'
				});
				schedulingScheduleTimelineAttributeDomains = schedulingScheduleTimelineAttributeDomains.properties;

				function ScheduleUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ScheduleUIStandardService.prototype = Object.create(BaseService.prototype);
				ScheduleUIStandardService.prototype.constructor = ScheduleUIStandardService;

				return new BaseService(schedulingScheduleimelineDetailLayout, schedulingScheduleTimelineAttributeDomains, schedulingScheduleTranslationService);
			}
		]);
})();
