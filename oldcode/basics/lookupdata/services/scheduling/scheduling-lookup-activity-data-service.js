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
	angular.module('basics.lookupdata').factory('schedulingLookupActivityDataService', ['_', '$injector', 'platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'schedulingMainActivityImageProcessor',

		function (_, $injector, platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator, filterService, schedulingMainActivityImageProcessor) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingLookupActivityDataService', {
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
					}
				],
				uuid: '4f726ae7d8244ab189c82a301cb4bc08'
			});

			var schedulingActivityLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/main/activity/', endPointRead: 'tree'},
				filterParam: 'scheduleId',
				dataProcessor: [new ServiceDataProcessArraysExtension(['Activities']), schedulingMainActivityImageProcessor],
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

			var filters = [
				{
					key: 'self-reference-activity',
					fn: function (activityItem, relationShip) {
						return activityItem.Id !== relationShip.ParentActivityFk && activityItem.ActivityTypeFk !== 5;
					}
				},
				{
					key: 'self-reference-child-activity',
					fn: function (activityItem, relationShip) {
						return activityItem.Id !== relationShip.ChildActivityFk;
					}
				},
				{
					key: 'self-reference-type-activity',
					fn: function (activityItem, relationShip) {
						return 1 === activityItem.ActivityTypeFk || 3 === activityItem.ActivityTypeFk;
					}
				},
				{
					key: 'self-reference-type-activity-hammock-exclude-linked',
					fn: function (activityItem, relationShip) {
						var actualActivity = $injector.get('schedulingMainService').getLatestActivity(activityItem);
						var isSameItem = actualActivity.Id === relationShip.ActivityMemberFk;
						return isSameItem || $injector.get('schedulingMainHammockDataService').isActivityLinkableAndUnlinked(actualActivity);
					}
				},
				{
					key: 'self-reference-type-activity-subschedules',
					fn: function (activityItem, relationShip) {
						return activityItem.Id !== relationShip.ParentActivityFk && activityItem.ActivityTypeFk === 4 && _.isNil(activityItem.ActivitySubFk);
					}
				}
			];

			filterService.registerFilter(filters);

			return platformLookupDataServiceFactory.createInstance(schedulingActivityLookupDataServiceConfig).service;
		}]);
})(angular);
