/**
 * Created by Baedeker on 12.06.2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityLookupDataProviderService
	 * @description provides data for activity full lookup
	 */

	angular.module(moduleName).service('schedulingMainActivityLookupDataProviderService', SchedulingMainActivityLookupDataProviderService);

	SchedulingMainActivityLookupDataProviderService.$inject = ['_', 'schedulingMainService', 'schedulingLookupActivityDataServiceFull'];

	/* jshint -W072 */ // many parameters because of dependency injection
	function SchedulingMainActivityLookupDataProviderService(_, schedulingMainService, schedulingLookupActivityDataServiceFull) {
		var self = this;
		var additionalActivities = [];

		this.processItem = function processItem(item) {
			/* jshint -W106 */
			if(item.ActivityEntity_ChildActivityFk) {
				additionalActivities.push(item.ActivityEntity_ChildActivityFk);
				item.ActivityEntity_ChildActivityFk = null;

				var items = schedulingMainService.getList();
				var allItems = _.concat(items, additionalActivities);
				var schedule = schedulingMainService.getSelectedSchedule();
				if(schedule) {
					schedulingLookupActivityDataServiceFull.setFilter(schedule.Id);
				}
				else{
					schedulingLookupActivityDataServiceFull.setFilter('LoadedActivities');
				}
				schedulingLookupActivityDataServiceFull.setCache(null, allItems);
			}
		};

		this.onActivitiesLoaded = function onActivitiesLoaded() {
			additionalActivities.length = 0;
			var schedule = schedulingMainService.getSelectedSchedule();
			if(schedule) {
				schedulingLookupActivityDataServiceFull.setFilter(schedule.Id);
			}
			else{
				schedulingLookupActivityDataServiceFull.setFilter('LoadedActivities');
			}
			schedulingLookupActivityDataServiceFull.setCache(null, schedulingMainService.getList());
		};

		this.onActivityCreated = function onActivityCreated() {
			var items = schedulingMainService.getList();
			var allItems = _.concat(items, additionalActivities);
			var schedule = schedulingMainService.getSelectedSchedule();
			if(schedule) {
				schedulingLookupActivityDataServiceFull.setFilter(schedule.Id);
			}
			else{
				schedulingLookupActivityDataServiceFull.setFilter('LoadedActivities');
			}
			schedulingLookupActivityDataServiceFull.setCache(null, allItems);
		};

		(function init() {
			schedulingMainService.registerListLoaded(self.onActivitiesLoaded);
			schedulingMainService.registerEntityCreated(self.onActivityCreated);
		})();
	}
})(angular);
