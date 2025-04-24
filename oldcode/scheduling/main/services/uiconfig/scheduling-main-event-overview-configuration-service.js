/**
 * Created by welss on 10.06.2014.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainEventOverviewConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainEventOverviewConfigurationService',

		['platformUIStandardConfigService', 'schedulingMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, schedulingMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function createEventDetailLayout() {
					return {
						fid: 'scheduling.main.eventdetailform',
						version: '0.2.4',
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['eventtypefk', 'description', 'date', 'isfixeddate', 'placedbefore', 'distanceto', 'isdisplayed', 'activityfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							eventtypefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.eventtype', null, {
								showIcon: true,
								imageSelectorService: 'basicsCustomizeEventIconService'
							}),
							date: {
								formatter: 'dateutc',
								readonly: true
							},
							activityfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupActivityDataServiceFull',
								filterKey: 'self-reference-child-activity',
								filter: function (item) {
									if (item) {
										return item.ScheduleFk;
									}
								},
								additionalColumns: true,
								readonly: true
							}),
							description: {
								readonly: true
							},
							isfixeddate: {
								readonly: true
							},
							placedbefore: {
								readonly: true
							},
							distanceto: {
								readonly: true
							},
							isdisplayed: {
								readonly: true
							}
						}
					};
				}

				var eventDetailLayout = createEventDetailLayout();

				var eventAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'EventDto',
					moduleSubModule: 'Scheduling.Main'
				});
				if (eventAttributeDomains) {
					eventAttributeDomains = eventAttributeDomains.properties;
				}

				function SchedulingUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				SchedulingUIStandardService.prototype = Object.create(BaseService.prototype);
				SchedulingUIStandardService.prototype.constructor = SchedulingUIStandardService;

				return new BaseService(eventDetailLayout, eventAttributeDomains, schedulingMainTranslationService);
			}
		]);
})();
