/**
 * Created by leo on 10.06.2014.
 */
/* global moment */
(function () {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name calendarUtilitiesService
	 * @function
	 *
	 * @description
	 * calendarService is the data service for all calendar data functions.
	 */
	angular.module('scheduling.calendar').factory('calendarUtilitiesService', ['$http', '_', function ($http, _) {

		var service = {};

		service.assertSameDate = function assertSameDate(setTo, getFrom) {
			if (getFrom && setTo) {
				setTo.year(getFrom.year());
				setTo.month(getFrom.month());
				setTo.date(getFrom.date());
			}
		};

		service.getCalendarChartData = function getCalendarChartData(calendarID) {
			return getCalendarChartDataBySpec({Calendar: calendarID});
		};

		service.getCalendarChartDataByProject = function getCalendarChartDataByProject(calendarID, projectID) {
			return getCalendarChartDataBySpec({Calendar: calendarID, Project: projectID});
		};

		service.getCalendarChartDataInRange = function getCalendarChartDataInRange(calendarID, startDate, endDate) {
			return getCalendarChartDataBySpec({Calendar: calendarID, Start: startDate, End: endDate});
		};

		service.getNonWorkingDays = function getNonWorkingDays(calendarID) {
			return getNonWorkingDaysBySpec({Calendar: calendarID});
		};

		service.getNonWorkingDaysByProject = function getNonWorkingDaysByProject(calendarID, projectID) {
			return getNonWorkingDaysBySpec({Calendar: calendarID, Project: projectID});
		};

		service.getNonWorkingDaysInRange = function getNonWorkingDaysInRange(calendarID, startDate, endDate) {
			return getNonWorkingDaysBySpec({Calendar: calendarID, Start: startDate, End: endDate});
		};

		service.getDuration = function getDuration(calendarID, startDate, endDate) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/calendar/utilities/getduration', {
				Calendar: calendarID,
				Start: startDate,
				End: endDate
			}).then(function (result) {
				return result.data;
			});
		};

		service.getStartDate = function getStartDate(calendarID, endDate, duration) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/calendar/utilities/getstartdate', {
				Calendar: calendarID,
				End: endDate,
				Duration: duration
			}).then(function (result) {
				return result.data;
			});
		};

		service.getEndDate = function getEndDate(calendarID, startDate, duration) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/calendar/utilities/getenddate', {
				Calendar: calendarID,
				Start: startDate,
				Duration: duration
			}).then(function (result) {
				return result.data;
			});
		};

		service.getCalendarIdFromCompany = function getCalendarIdFromCompany() {
			return $http.get(globals.webApiBaseUrl + 'scheduling/calendar/utilities/getcalendaridfromcompany').then(function (result) {
				return result.data;
			});
		};

		service.getWorkingDays = function getWorkingDays(projectId, startDate, endDate) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/calendar/utilities/getworkingdays', {
				Project: projectId,
				Start: startDate,
				End: endDate
			}).then(function (result) {
				return result.data;
			});
		};

		service.getWorkingHours = function getWorkingHours(projectId, startDate, endDate) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/calendar/utilities/getworkinghours', {
				Project: projectId,
				Start: startDate,
				End: endDate
			}).then(function (result) {
				return result.data;
			});
		};

		return service;

		function getCalendarChartDataBySpec(spec) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/calendar/utilities/calendarchartdata', spec).then(function (result) {
				var res = result.data;
				res.StartDate = moment.utc(res.StartDate);
				res.ExceptionDays = parseExceptionDayDates(res.ExceptionDays);
				res.NonWorkingDays = parseWorkingDayDates(res.NonWorkingDays);

				return res;
			});
		}

		function getNonWorkingDaysBySpec(spec) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/calendar/utilities/calendarchartdata', spec).then(function (result) {
				return parseWorkingDayDates(result.data.NonWorkingDays);
			});
		}

		function parseExceptionDayDates(days) {
			_.forEach(days, function (day) { // not using foreach for performance reasons
				day.ExceptDate = moment.utc(day.ExceptDate);
			});

			return days;
		}

		function parseWorkingDayDates(days) {
			_.forEach(days, function (day) { // not using foreach for performance reasons
				day.Start = moment.utc(day.Start);
				day.End = moment.utc(day.End);
			});

			return days;
		}
	}]);
})();
