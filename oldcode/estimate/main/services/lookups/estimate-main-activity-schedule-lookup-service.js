/**
 * Created by joshi on 3.06.2015.
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainActivityScheduleLookupService
	 * @function
	 *
	 * @description
	 * estimateMainActivityScheduleLookupService provides schedule code for the line item activity
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainActivityScheduleLookupService', ['_', '$q', 'estimateMainActivityLookupService',
		function (_, $q, estimateMainActivityLookupService) {

			// Object presenting the service
			let service = {};

			// get schedule for the activity
			let getSchedule = function getSchedule(item, schedules) {
				let schedule = {};
				if (item && item.Id) {
					let scheduleList = schedules.length ? schedules : estimateMainActivityLookupService.getActSchedule();
					if (scheduleList && scheduleList.length > 0) {
						schedule = _.find(scheduleList, {Id: item.ScheduleFk});
					}
				}
				return schedule && schedule.Id ? schedule : null;
			};

			// get schedule for the activity
			let getScheduleAsync = function getScheduleAsync(item) {
				return estimateMainActivityLookupService.getActScheduleAsync().then(function (result) {
					return $q.when(getSchedule(item, result));
				});
			};

			// get list of the estimate activity item by Id
			service.getItemById = function getItemById(value) {
				let item = estimateMainActivityLookupService.getItemById(value);
				return getSchedule(item, []);
			};

			// for activity schedule lookup
			service.getItemByKey = function getItemByKey(value) {
				return service.getItemById(value);
			};

			// get list of the estimate activity item by Id async
			service.getItemByIdAsync = function getItemByIdAsync(value,options) {
				return estimateMainActivityLookupService.getItemByIdAsync(value,options).then(function (item) {
					return getScheduleAsync(item).then(function (result) {
						return result;
					});
				});
			};

			// estimate look up data service call
			service.loadLookupData = function () {
				estimateMainActivityLookupService.loadLookupData();
			};

			// General stuff
			service.reload = function () {
				service.loadLookupData();
			};

			return service;
		}]);
})();
