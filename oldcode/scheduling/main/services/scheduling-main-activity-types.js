(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name schedulingMainActivityTypes
	 * @function
	 *
	 * @description
	 * schedulingMainActivityTypes holds all activityTypes with its Ids
	 */

	angular.module('scheduling.main').constant('schedulingMainActivityTypes', {
		Activity: 1,
		SummaryActivity: 2,
		Milestone: 3,
		SubSchedule: 4,
		Hammock: 5
	});
})(angular);