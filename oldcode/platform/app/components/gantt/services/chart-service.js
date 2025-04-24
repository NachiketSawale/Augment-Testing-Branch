/* global moment */
/**
 * Created by sprotte on 11.11.2016.
 */
/**
 * @ngdoc service
 * @name cloud.platform.chartService
 * @function
 * @requires $injector
 *
 * @description Provides data for the generic GANTT chart. Use it as a factory for your own GANTT data service and  configure the following properties:
 * * mainService: should take your standard main data service you want to visualize
 * * entityStart: which property of your model contains a start date you want to visualize
 * * entityEnd: which property of your model contains a end date you want to visualize
 *   Property timerange can only work if these three properties are set correctly
 */
angular.module('platform').factory('chartService', ['$injector', '$translate',
	function ($injector) {
		'use strict';

		/**
		 * @ngdoc Class
		 * @name Interval
		 * @param {moment}  startDate - Startdate of the Interval.
		 * @param {moment}  endDate - Enddate of the Interval.
		 *
		 * @property {moment}  startDate - Startdate of the Interval.
		 * @property {moment}  endDate - Enddate of the Interval.
		 * @constructor
		 */
		class Interval {
			constructor(startDate, endDate) {
				this.startDate = startDate.utc();
				this.endDate = endDate.utc();
			}
		}


		var service = Object.create({}, {
			'mainService': {
				value: {
					getList: _.noop
				}, enumerable: true, writable: true
			},
			'timerange': {
				get: getTimeRange,
				enumerable: true
			},
			'entities': {
				get: function () {
					return this.mainService.getList() || [];
				}, enumerable: true
			},
			'entityStart': {value: 'start', enumerable: true, writable: true},
			'entityEnd': {value: 'end', enumerable: true, writable: true},
			'listLoaded': {value: {}, enumerable: true, writable: true},
			'updateDone': {value: {}, enumerable: true, writable: true}
		});

		service.getFilteredItems = getFilteredItems;
		service.calculateIntervals = calculateIntervals;
		service.getZoomLevel = getZoomLevel;

		return service;

		function getTimeRange() {
			var mindate, maxdate;
			mindate = moment.min(_.compact(_.map(service.entities, service.entityStart)));
			var finishdates = _.compact(_.map(service.entities, service.entityEnd));
			if (finishdates.length > 0) {
				maxdate = moment.max(finishdates);
			} else {
				maxdate = mindate.clone().add(6, 'months');
			}

			return [mindate, maxdate];
		}

		function getFilteredItems(containerId) {
			var platformGridAPI = $injector.get('platformGridAPI');
			var result = platformGridAPI.grids.getGridState(containerId, false);
			if (_.isObject(result)) {
				return result.filteredItems;
			} else {
				// map with id and visual index
				var itemsmap = new Map();
				for (var i = 0; i < service.entities.length; i++) {
					var item = service.entities[i];
					itemsmap.set(item.Id, i * 25/* verticalscale(i) */);
				}

				return itemsmap;
			}
		}

		/**
		 * @name calculateIntervals
		 * @description Calculates the intervals with given time span for the calendar scale
		 *
		 * @param tickValues Tick values of calendar scale
		 * @param {Object} levelOfIntervals
		 * @param {Integer} levelOfIntervals.value The amount of given type (for ex weeks) for one interval
		 * @param {String} levelOfIntervals.type Type of the timespan for the calculation of interval
		 * @return {*[]}
		 */
		function calculateIntervals(tickValues, levelOfIntervals) {
			let newInterval = null;
			let intervals = [];
			let spanAboveMin = true;

			if (tickValues.length >= 2) {
				let tempLevelOfIntervals = levelOfIntervals ? levelOfIntervals : {value: 1, type: 'hour'};
				if(tempLevelOfIntervals.type === 'week') {
					tempLevelOfIntervals.type = 'isoWeek';
				}
				let minDuration = moment.duration(tempLevelOfIntervals.value, tempLevelOfIntervals.type).asSeconds(); // duration of minimal aggregation level in seconds
				let tickSpan =  moment(tickValues[1]).diff(tickValues[0], 'seconds'); // from first to second
				let firstTick = moment(tickValues[0]).subtract(tickSpan, 'seconds').toDate();
				tickValues.unshift(firstTick);
				let lastTick = moment(tickValues[tickValues.length - 1]).add(tickSpan, 'seconds').toDate();
				tickValues.push(lastTick);
				spanAboveMin = tickSpan - minDuration >= 0;
			}

			if (levelOfIntervals && levelOfIntervals !== 'hour' && !spanAboveMin) {
				let actualMomentStart = null;
				let actualMomentEnd = null;
				let tempIntervalArray = [];
				for (let tickValue of tickValues) {
					actualMomentStart = moment.utc(tickValue).startOf(levelOfIntervals.type);
					actualMomentEnd = moment.utc(tickValue).endOf(levelOfIntervals.type);
					if (!_.find(tempIntervalArray, actualMomentStart)) {
						tempIntervalArray.push(actualMomentStart);
						newInterval = new Interval(actualMomentStart, actualMomentEnd);
						intervals.push(newInterval);
					}
				}
			} else {
				for (let i = 0; i < tickValues.length - 1; i++) {
					if (!_.find(intervals, {startDate: tickValues[i], endDate: tickValues[i + 1]})) {
						newInterval = new Interval(moment(tickValues[i]), moment(tickValues[i + 1]));
						intervals.push(newInterval);
					}
				}
			}
			return intervals;
		}

		/**
		 * @name getZoomLevel
		 * @description Gets current zoom level in the chart.
		 *
		 * @param {Object} timeAxis
		 * @return {string} Possible return strings: hour, day, week, month, year
		 */
		function getZoomLevel(timeAxis) {
			const tickDiffSeconds = moment(timeAxis.tickvalues()[1]).diff(moment(timeAxis.tickvalues()[0]), 'seconds');
			let zoomLevel;

			if (tickDiffSeconds < 86400) {
				zoomLevel = 'hour';
			} else if (tickDiffSeconds >= 86400 && tickDiffSeconds < 604800) {
				zoomLevel = 'day';
			} else if (tickDiffSeconds >= 604800 < tickDiffSeconds < 2592000) {
				zoomLevel = 'week';
			} else if (tickDiffSeconds >= 2592000 < tickDiffSeconds < 31536000) {
				zoomLevel = 'month';
			} else if (tickDiffSeconds >= 31536000) {
				zoomLevel = 'year';
			}

			return zoomLevel;
		}

	}]);