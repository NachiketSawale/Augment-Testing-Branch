/**
 * Created by wui on 2/26/2016.
 */

(function (angular) {
	'use strict';

	angular.module('constructionsystem.master').factory('constructionsystemMasterActivityScheduleService', [
		'$q', 'basicsLookupdataLookupDescriptorService',
		function ($q, basicsLookupdataLookupDescriptorService) {
			return {
				getItemByIdAsync: function (id) {
					var scheduleItem,
						activityItem = basicsLookupdataLookupDescriptorService.getLookupItem('estlineitemactivity', id);

					if (activityItem !== null && activityItem !== undefined) {
						scheduleItem = basicsLookupdataLookupDescriptorService.getLookupItem('packageSchedulingLookupService', activityItem.ScheduleFk);
					}

					return $q.when(scheduleItem);
				},
				getItemById: function(id) {
					var scheduleItem,
						activityItem = basicsLookupdataLookupDescriptorService.getLookupItem('estlineitemactivity', id);

					if (activityItem !== null && activityItem !== undefined) {
						scheduleItem = basicsLookupdataLookupDescriptorService.getLookupItem('packageSchedulingLookupService', activityItem.ScheduleFk);
					}

					return scheduleItem;
				}
			};
		}]);
})(angular);