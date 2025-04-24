(function (angular) {
	'use strict';

	var moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name platformDateshiftCalendarService
	 * @description
	 * platformDateshiftCalendarService provides ...
	 */
	angular.module(moduleName).service('platformDateshiftCalendarService', PlatformDateshiftCalendarService);
	PlatformDateshiftCalendarService.$inject = ['calendarUtilitiesService', '_', 'math', 'moment', '$q'];

	function PlatformDateshiftCalendarService(calendarUtilitiesService, _, math, moment, $q) {

		var service = {
			getCalendarByFilter: getCalendarByFilter,
			getCalendarsByIds: getCalendarsByIds,
			getCalendarByProjectIds: getCalendarByProjectIds,
			getCompanyCalendar: getCompanyCalendar,
			getNextFreeDay: getNextFreeDay,
			getExceptionDaysCount: getExceptionDaysCount,
			clearCalendarCache: clearCalendarCache,
			isExceptionDay: isExceptionDay,
			calculateNextNonExceptionDate: calculateNextNonExceptionDate,
			parseCalendarData: parseCalendarData
		};

		// calendar cache includes
		var calendarCache = [];
		// project cache
		var projectCache = new Map();
		// company calendar id
		var companyCache;

		// region public methods

		/**
		 * @ngdoc function
		 * @name getCalendarByFilter
		 * @description Public function that returns a promise for calendar data for a filtered calendar.
		 *
		 * @param {Object} filter - A filter object.
		 * @param {Number} filter.Calendar - The id of the calendar.
		 * @param {(Moment | String)} filter.StartDate - The start date of the calendar filter.
		 * @param {(Moment | String)} filter.EndDate - The end date of the calendar filter.
		 *
		 * @returns {promise} Promise to load calendar or already loaded calendar.
		 **/
		function getCalendarByFilter(filter) {
			if (_.isString(filter.StartDate)) {
				filter.StartDate = moment.utc(filter.StartDate);
			}
			if (_.isString(filter.EndDate)) {
				filter.EndDate = moment.utc(filter.EndDate);
			}
			var loadedCalendar = findLoadedCalendar(filter);

			var calendarPromise;
			if (!_.isNil(loadedCalendar)) {
				calendarPromise = !_.isNil(loadedCalendar.Promise) ? loadedCalendar.Promise : $q.when(loadedCalendar);
			} else {
				calendarPromise = loadCalendar(filter);
			}
			return calendarPromise;
		}

		/**
		 * @ngdoc function
		 * @name getCalendar
		 * @description Public function that returns a promise for calendar data for a list of calendar ids.
		 *
		 * @param {Number[]} calendarIdList - A list of calendar ids that need to be loaded.
		 *
		 * @returns {promise} Collected promise to load all of the requested calendars.
		 **/
		function getCalendarsByIds(calendarIdList) {
			// compress id list
			calendarIdList = _.uniq(_.filter(calendarIdList, function (idValue) {
				return _.isNumber(idValue) && idValue > 0;
			}));

			var filterList = _.map(calendarIdList, function (calendarId) {
				return {Calendar: calendarId};
			});

			var calendarPromises = _.map(filterList, function (filter) {
				return getCalendarByFilter(filter);
			});

			return $q.all(calendarPromises);
		}

		/**
		 * @ngdoc function
		 * @name getCalendarByProjectIds
		 * @description Public function that returns a promise for calendar data for a list of project ids.
		 *
		 * @param {Number[]} projectIdList - A list of project ids for which calendar data needs to be loaded.
		 *
		 * @returns {promise} Collected promise to load all of the requested calendars.
		 **/
		function getCalendarByProjectIds(projectIdList) {
			let splitProjectIds = _.partition(projectIdList, (prjId) => {
				return projectCache.has(prjId);
			});
			let presentProjectCalendarFilterList = _.map(splitProjectIds[0], (presentProjectId) => {
				return {Calendar: projectCache.get(presentProjectId)};
			});
			let missingProjectCalendarFilterList = _.map(splitProjectIds[1], (missingProjectId) => {
				return {Project: missingProjectId};
			});
			let presentProjectCalendarPromises = _.map(presentProjectCalendarFilterList, (filter) => {
				return getCalendarByFilter(filter);
			});
			let missingProjectCalendarPromises = _.map(missingProjectCalendarFilterList, (filter) => {
				return getCalendarByFilter(filter).then((calendarData) => {
					projectCache.set(filter.Project, calendarData.Id);
					return calendarData;
				});
			});
			let calendarPromises = _.concat(presentProjectCalendarPromises, missingProjectCalendarPromises);
			return $q.all(calendarPromises);
		}

		function getCompanyCalendar() {
			let companyCalendarFilter = {
				Calendar: companyCache
			};
			let calendarPromise = getCalendarByFilter(companyCalendarFilter).then((calendarData) => {
				companyCache = calendarData.Id;
				return calendarData;
			});
			return $q.all([calendarPromise]);
		}

		/**
		 * @ngdoc function
		 * @name getNextFreeDay
		 * @description Public function that returns the next free day starting from a start day.
		 *
		 * @param {Object} calendar - The data of the calendar.
		 * @param {Moment | String} startDate - The start date of the search. Defaults to today if not set.
		 * @param {Boolean} moveBackwards - If flag is set to true, tries moving back in time. False by default.
		 *
		 * @returns {Moment} First free day after start date.
		 **/
		function getNextFreeDay(calendar, startDate = moment(), moveBackwards = false, isStartDate = false) {
			const currentDate = _.isString(startDate) ?  moment.utc(startDate) : moment(startDate);
			if (_.isNil(calendar)) {
				return currentDate;
			}
			const moveDirection = moveBackwards? -1 : 1;
			const loopMax = 100;
			let loopTimeout = loopMax;
			while ((isStartDate && isExceptionDay(calendar, currentDate)
			|| !isStartDate && currentDate.isSame(moment(currentDate).startOf('d')) && isExceptionDay(calendar, moment(currentDate).subtract(1, 's'))
			)
			&& loopTimeout > 0) {
				// add 1 day, check again
				currentDate.add(moveDirection, 'day');
				loopTimeout--;
			}
			if (loopTimeout === 0) {
				console.error(`Timeout: There is no valid day for calendar [Id: ${calendar.Id}] in the next ${loopMax} days.`);
				return;
			}
			return currentDate;
		}

		function getExceptionDaysCount(calendar, startDate = moment(), endDate = moment()){
			const currentDate = _.isString(startDate) ?  moment.utc(startDate) : moment(startDate);
			const endDateCorrected = endDate.isSame(moment(endDate).startOf('d')) ? moment(endDate).subtract(1, 's') : endDate;
			let exceptionalDayCount = 0;

			while(moment(currentDate).isBefore(endDateCorrected) || moment(currentDate).isSame(endDateCorrected)){
				if(isExceptionDay(calendar, currentDate)) {
					// add 1 day, check again
					exceptionalDayCount = exceptionalDayCount + 1;
				}
				currentDate.add(1, 'day');
			}
			return exceptionalDayCount;

		}

		/**
		 * @name calculateNextNonExceptionDate
		 * @description Calculates next non-exception date based on start and end date and returns the requested date based on isStartCalculation bool value
		 *
		 * @param {Moment} startDate
		 * @param {Moment} endDate
		 * @param {Object} calendar
		 * @param {boolean} isStartCalculation
		 * @returns {Moment} Calculated either start or end date depending on isStartCalculation bool value
		 */
		function calculateNextNonExceptionDate(startDate, endDate, calendar, isStartCalculation = false) {
			let exceptionDaysCount = 0;
			if (isStartCalculation) {
				exceptionDaysCount = getExceptionDaysCount(calendar, startDate, endDate);
				return getNextFreeDay(calendar, moment(startDate).subtract(exceptionDaysCount, 'd'), true, true);
			} else {
				exceptionDaysCount = getExceptionDaysCount(calendar, startDate, endDate);
				return getNextFreeDay(calendar, moment(endDate).add(exceptionDaysCount, 'd'), false, false);
			}
		}
		// endregion

		// region private methods

		function findLoadedCalendar(filter) {
			var loadedCalendarCache = _.find(calendarCache, function (loadedCalendar) {
				var isCalendar = loadedCalendar.Calendar === filter.Calendar;
				var isEarlier = (!_.isNil(loadedCalendar.StartDate)) && (!_.isNil(filter.StartDate)) ? loadedCalendar.StartDate > filter.StartDate : true;
				var isLater = (!_.isNil(loadedCalendar.EndDate)) && (!_.isNil(filter.EndDate)) ? loadedCalendar.EndDate < filter.EndDate : true;
				return isCalendar && isEarlier && isLater;
			});
			return !_.isNil(loadedCalendarCache) ? loadedCalendarCache.Data : null;
		}

		function loadCalendar(filter) {
			// immediately create, then store promise

			// region create cached calendar

			var cachedCalendar = _.find(calendarCache, {Calendar: filter.Calendar});
			// if already loaded, update in cache
			if (cachedCalendar) {
				cachedCalendar.StartDate = filter.StartDate;
				cachedCalendar.EndDate = filter.EndDate;
			} else {
				cachedCalendar = {
					Calendar: filter.Calendar,
					StartDate: filter.StartDate,
					EndDate: filter.EndDate
				};
				calendarCache.push(cachedCalendar);
			}

			// endregion

			// region create calendar promise

			// call correct method based on filter!
			var calendarPromise;
			if (filter.Calendar) {
				calendarPromise = calendarUtilitiesService.getCalendarChartDataInRange(filter.Calendar, filter.StartDate, filter.EndDate);
			} else {
				if (filter.StartDate || filter.EndDate) {
					console.warn('Warning: Fetching calendar data for a date range without the calendar id is not currently supported. Will fetch entire calendar data.');
				}
				calendarPromise = calendarUtilitiesService.getCalendarChartDataByProject(null, filter.Project);
			}
			cachedCalendar.Promise = calendarPromise;

			// endregion

			return calendarPromise.then((result) => {
				cachedCalendar.Promise = null;
				cachedCalendar.Data = parseCalendarData(result);
				cachedCalendar.Calendar = cachedCalendar.Calendar || result.CalendarId;
				return cachedCalendar.Data;
			});
		}

		// calendar infos are store as integer arrays
		function parseCalendarData(data) {

			if(typeof data !== 'undefined'){
				var result = {
					Id: data.CalendarId
				};
				result.ExceptionDays = _.map(_.filter(data.ExceptionDays, {IsWorkday: false}), function (exceptionDay) {
					return parseCalendarDateAsInteger(exceptionDay.ExceptDate);
				});
				// we can talk about the names... ;)
				result.NonExceptionDays = _.map(_.filter(data.ExceptionDays, {IsWorkday: true}), function (exceptionDay) {
					return parseCalendarDateAsInteger(exceptionDay.ExceptDate);
				});
				result.WeekendDays = _.map(_.filter(data.WeekDays, {IsWeekend: true}), function (weekendDay) {
					// WeekdayIndex of WeekDays is default value of .net where 1 = Sunday, 7 = Saturday
					return (weekendDay.WeekdayIndex - 1) > 0 ? (weekendDay.WeekdayIndex - 1) : (weekendDay.WeekdayIndex - 1) + 7;
				});

				result.ExceptionDaysUnfiltered = data.ExceptionDays;
				result.WeekendDaysIso = _.map(_.filter(data.WeekDays, {IsWeekend: true}), function (weekendDay) {
					return weekendDay.WeekdayIndex;
				});

				return result;
			}
		}

		function isExceptionDay(calendarData, dateToCheck) {
			// var calendar = _.find(service.calendarData, {Id: calendarId});
			if (!_.isNil(calendarData)) {
				const date = !moment.isMoment(dateToCheck) ? moment(dateToCheck) : dateToCheck;
				const dateAsInteger = parseCalendarDateAsInteger(date);
				const isNonExceptionDay = _.includes(calendarData.NonExceptionDays, dateAsInteger);
				const isNonWorkingDay = _.includes(calendarData.WeekendDays, date.isoWeekday());
				if (isNonWorkingDay) {
					return isNonWorkingDay && !isNonExceptionDay;
				} else {
					const isExceptionDay = _.includes(calendarData.ExceptionDays, dateAsInteger);
					return isExceptionDay && !isNonExceptionDay;
				}
			} else {
				return false;
			}
		}

		function parseCalendarDateAsInteger(date) {
			if (_.isString(date)) {
				date = moment.utc(date);
			}
			let tempDate = new Date(date.toDate().getTime());
			return parseInt(((tempDate.getUTCFullYear() * 100) + tempDate.getUTCMonth() + 1) * 100 + tempDate.getUTCDate());
		}

		function clearCalendarCache() {
			calendarCache = [];
		}

		// endregion

		return service;
	}
})(angular);
