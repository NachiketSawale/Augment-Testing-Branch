(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupEventDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupEventDataService is the data service for calendar look up
	 */
	angular.module('scheduling.main').factory('schedulingLookupEventDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator', 'ServiceDataProcessDatesExtension',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, ServiceDataProcessDatesExtension) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingLookupEventDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Date',
						field: 'Date',
						name: 'Date',
						formatter: 'dateutc',
						name$tr$: 'cloud.common.entityDate'
					},
					{
						id: 'EventTypeFk',
						field: 'EventTypeFk',
						name: 'Event Type',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.eventtype',
							displayMember: 'Description',
							valueMember: 'Id'
						},
						name$tr$: 'scheduling.template.eventType'
					},
					{
						id: 'ActivityFk',
						field: 'ActivityFk',
						name: 'Activity',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SchedulingActivityNew',
							displayMember: 'Code',
							version: 3
						},
						name$tr$: 'scheduling.main.entityActivity'
					}
				],
				uuid: 'f3fb42ca164a45b88ac07b09c8a1e39a'
			});
			let schedulingEventLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'scheduling/main/event/',
					endPointRead: 'list'
				},
				filterParam: 'mainItemId',
				lookupType: 'schedulingLookupEventDataService',
				selectableCallback: function select(dataItem, entity){
					return dataItem.Id !== entity.Id && dataItem.EventFk !== entity.Id;
				},
				dataProcessor: [new ServiceDataProcessDatesExtension(['Date', 'EndDate'])]
			};

			return platformLookupDataServiceFactory.createInstance(schedulingEventLookupDataServiceConfig).service;
		}]);
})(angular);
