/**
 * Created by leo on 23.09.2014.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarWeekDayCultureItemService
	 * @function
	 *
	 * @description
	 * weekdayItemService is the data service to get the data for the dropdown box in the workhours list.
	 */
	angular.module('scheduling.calendar').factory('schedulingCalendarWeekdayCultureItemService',

		['$http', '$q', function ($http, $q) {

			var deffered = $q.defer();
			var data;      // cached indexed object list
			var service = {};

			service.loadData = function () {

				if (!data) {
					$http.get(globals.webApiBaseUrl + 'scheduling/calendar/weekday/getcurrentdaynames'
					).then(
						function (response) {
							data = response.data;
							deffered.resolve();
						}
					);
				}
				return deffered.promise;
			};

			service.getList = function () {

				return data;
			};

			service.loadData();

			return service;

		}]);
})();

