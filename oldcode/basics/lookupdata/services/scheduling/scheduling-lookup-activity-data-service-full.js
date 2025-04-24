/**
 * Created by Frank on 25.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupActivityDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupActivityDataService is the data service for activity look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupActivityDataServiceFull', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingLookupActivityDataServiceFull', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Schedule',
						field: 'Schedule.Code',
						name: 'Schedule',
						formatter: 'description',
						width: 300,
						name$tr$: 'scheduling.schedule.entitySchedule'
					}
				],
				uuid: 'aefeddae8d814189815420abba2f0a3e'
			});

			var schedulingActivityLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/main/activity/', endPointRead: 'tree'},
				filterParam: 'scheduleId',
				dataProcessor: [new ServiceDataProcessArraysExtension(['Activities'])],
				tree: {parentProp: 'ParentActivityFk', childProp: 'Activities'},
				navigator: {moduleName: 'scheduling.main'},
				selectableCallback: function (dataItem, entity, settings) {
					var isSelectable = false;
					if (dataItem.ActivityTypeFk !== 2) {
						isSelectable = true;
					}
					return isSelectable;
				}
			};
			return platformLookupDataServiceFactory.createInstance(schedulingActivityLookupDataServiceConfig).service;
		}]);
})(angular);
