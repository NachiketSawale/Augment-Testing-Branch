/**
 * Created by welss on 10.06.2014.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainEventConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainEventConfigurationService',

		['platformUIStandardConfigService', 'schedulingMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'schedulingMainEventAllService', 'basicsLookupdataLookupFilterService',

			function (platformUIStandardConfigService, schedulingMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService, schedulingMainEventAllService, filterService) {

				let BaseService = platformUIStandardConfigService;

				let filters = [
					{
						key: 'self-reference-event',
						fn: function (item, entity) {
							return item.Id !== entity.Id && item.ActivityFk === entity.ActivityFk && item.EventFk !== entity.Id;
						}
					}];
				filterService.registerFilter(filters);

				function createEventDetailLayout() {
					return {
						fid: 'scheduling.main.eventdetailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['eventtypefk', 'description', 'date', 'isfixeddate', 'eventfk', 'placedbefore', 'distanceto', 'isdisplayed']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							eventtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.eventtype', null, {
								showIcon: true,
								imageSelectorService: 'basicsCustomizeEventIconService'
							}),
							date: {
								editor: 'dateutc',
								formatter: 'dateutc'
							},
							eventfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupEventDataService',
								filter: function (item) {
									return item.ActivityFk !== null ? item.ActivityFk : -1;
								},
								filterKey: 'self-reference-event'})
						}
					};
				}

				let eventDetailLayout = createEventDetailLayout();

				let eventAttributeDomains = platformSchemaService.getSchemaFromCache({
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
