/**
 * Created by leo on 17.09.2014.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarWeekDayItemService
	 * @function
	 *
	 * @description
	 * weekdayItemService is the data service to get the data for the dropdown box in the workhours list.
	 */
	angular.module('scheduling.calendar').factory('schedulingCalendarWeekdayItemService',

		['$http', '$q', 'schedulingCalendarMainService', function ($http, $q, schedulingCalendarMainService) {

			var data;      // cached indexed object list
			var service = {};

			service.loadData = function () {

				var deferred = $q.defer();
				data = [];
				var mainItemId = schedulingCalendarMainService.getSelected().Id;
				$http(
					{
						method: 'GET',
						url: globals.webApiBaseUrl + 'scheduling/calendar/weekday/' + 'list?mainItemId=' + mainItemId,
						timeout: deferred.promise
					}).then(function (response) {
					data = response.data;
					deferred.resolve(data);
				});

				return deferred.promise;
			};

			service.getList = function () {

				return data;
			};

			return service;

		}]);
})();

