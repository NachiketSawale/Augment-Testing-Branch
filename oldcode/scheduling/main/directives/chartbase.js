/**
 * Created by sprotte on 14.09.2015.
 */
/* global d3: false, moment, _ */
(function () {
	'use strict';
	if (typeof angular !== 'undefined') {
		angular.module('scheduling.main').factory('schedulingMainChartbase', standalone);
	} else {
		window.chart = standalone();
	}

	function standalone() {
		// Helper functions for components

		if (!d3.selection.prototype.parent) {
			d3.selection.prototype.parent = function selectParent() {
				return this.select(function () {
					return this.parentNode;
				});
			};
		}

		// fix for d3 library bug:
		if (typeof d3.bisect !== 'function') {
			d3.bisect = d3.bisector(function (d) {
				return d;
			}).right;
		}

		var defaultrowheight = 25;
		var defaultrowheightprint = 15;

		// noinspection JSUnusedGlobalSymbols Reason: library code that may be called by others
		var vector = {
			length: function length(p1) {
				return Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
			}, unitVector: function unitVector(p1) {
				var l = vector.length(p1);
				return {
					x: p1.x / l, y: p1.y / l
				};
			}, dotProduct: function dotProduct(p1, p2) {
				var _p1 = vector.unitVector(p1);
				var _p2 = vector.unitVector(p2);
				return _p1.x * _p2.x + _p1.y * _p2.y;
			}, add: function add(p1, p2) {
				return {
					x: p1.x + p2.x, y: p1.y + p2.y
				};
			}, sub: function sub(p1, p2) {
				return {
					x: p2.x - p1.x, y: p2.y - p1.y
				};
			}, mul: function mul(p1, value) {
				return {
					x: p1.x * value, y: p1.y * value
				};
			}, middlepoint: function middlepoint(p1, p2) {
				if (p1.x === p2.x && p1.y === p2.y) {
					return p1;
				}
				var myvector = vector.sub(p1, p2);
				var distance = vector.length(myvector);
				var unitv = vector.unitVector(myvector);
				return vector.add(vector.mul(unitv, (distance / 2)), p1);
			}, slope: function calcSlope(start, end, noDegrees) {
				var m, alpha;
				var deltaX = end.x - start.x;
				var deltaY = end.y - start.y;
				if (deltaX === 0) {
					return 0;
				}
				m = deltaY / deltaX;
				if (noDegrees) { // if I do not need slope in degrees
					return m;
				}
				alpha = Math.atan(Math.abs(m)) * (180 / Math.PI);
				return alpha;
			}
		};
		vector.base = function base(start, end, m) {
			// 1. calc m
			m = m || vector.slope(start, end, true);
			var b = start.y - m * start.x;
			return b;
		};

		function itemId(item) {
			return item.Id || item.id;
		}

		function validDate(date) {
			return moment.isDate(date) || moment.isMoment(date) && date.isValid();
		}

		function decimalToHex(decimal, chars) {
			return '#' + ((decimal + Math.pow(16, chars)).toString(16).slice(-chars).toUpperCase());
		}

		// weekenddays: array of weekenddays in ISO format (1 for Monday ... 7 for sunday)
		// exceptions: array of moment dates
		// startDate: moment date that marks start of time range
		// endDate: moment date that marks end of time range
		function configureWorkdays(weekenddays, exceptions, startDate, endDate) {
			weekenddays = weekenddays || [6, 7];
			exceptions = exceptions || [];
			var isBusinessDayCache = new Map();
			var numberOfWeekdays = 7 - weekenddays.length;
			var numberOfWeekenddays = weekenddays.length;
			var week = [1, 1, 1, 1, 1, 1, 1]; // weekdays in JS format (0 for Sunday, 1 for Monday);
			weekenddays.forEach(function (item) {
				if (item === 7) {
					week[0] = 0; // map iso weekday to JS weekday
				} else {
					week[item] = 0;
				}
			});

			// lazy worker case
			if (numberOfWeekdays === 0) {
				throw 'need at least one workday per week';
			}

			function isDateOnWeekend(date) {
				for (var i = numberOfWeekenddays - 1; i >= 0; i--) {
					if (date.isoWeekday() === weekenddays[i]) {
						return true;
					}
				}
				return false;
			}

			// filter list of exceptions if some of them fall on weekends
			var exceptionsWithoutWeekends = exceptions.filter(function (item) {
				return !isDateOnWeekend(item);
			});

			var exceptionsWithinRange = exceptionsWithoutWeekends.filter(function (exceptionday) {
				// return exceptionday.isBetween(startDate, endDate, 'd', '[]'); // option from moment 1.13 on. still on 1.10
				return exceptionday.isSame(endDate, 'd') || exceptionday.isSame(startDate, 'd') || exceptionday.isBetween(startDate, endDate, 'd');
			});

			// var exceptionsWithinRange = exceptionsWithoutWeekends;
			var hasExceptionDays = exceptionsWithinRange.length > 0;

			var businessDays = {};

			businessDays.add = function addWorkdaysWithExceptions(date, days) {
				function addWorkdays(date, days) {
					var increment = days / Math.abs(days);
					var internaldate = date.clone().add(Math.floor(Math.abs(days) / numberOfWeekdays) * 7 * increment, 'days');
					var remaining = days % numberOfWeekdays;
					while (remaining !== 0) {
						internaldate.add(increment, 'days');
						remaining -= isDateOnWeekend(internaldate) ? 0 : increment;
					}
					return internaldate;
				}

				// second step: remove exception days

				var newDate = addWorkdays(date, days);
				if (hasExceptionDays) {
					return addWorkdays(newDate, exceptionsWithinRange.length);
				} else {
					return newDate;
				}
			};

			businessDays.newAdd = function newAddWorkdaysWithExceptions(myday, days) {
				function isBusinessDay(day) {
					if (isBusinessDayCache.has(day.toDate().getTime())) {
						return isBusinessDayCache.get(day.toDate().getTime());
					}
					if (isDateOnWeekend(day)) {
						isBusinessDayCache.set(day.toDate().getTime(), false);
						return false;
					}
					var duringHoliday = exceptionsWithoutWeekends
						.filter(function (exceptionday) {
							return exceptionday.isSame(day /* date */, 'd');
						});
					isBusinessDayCache.set(day.toDate().getTime(), duringHoliday.length === 0);
					return duringHoliday.length === 0;
				}

				var day = myday.clone();
				if (!day.isValid()) {
					return day;
				}

				if (days < 0) {
					days = Math.round(-1 * days) * -1;
				} else {
					days = Math.round(days);
				}

				var direction = days < 0 ? -1 : 1;

				var remaining = Math.abs(days);
				while (remaining > 0) {
					day.add(direction, 'd');

					if (isBusinessDay(day)) {
						remaining--;
					}
				}

				return day;
			};

			businessDays.diffCache = new Map();

			businessDays.diff = function businessDiff(mystartDate, myendDate, countStartDay) {
				if (businessDays.diffCache.has(mystartDate.toDate().getTime() + myendDate.toDate().getTime())) {
					return businessDays.diffCache.get(mystartDate.toDate().getTime() + myendDate.toDate().getTime());
				}
				var startDate, endDate;
				var direction = 1;
				if (mystartDate.isBefore(myendDate, 'day')) {
					startDate = mystartDate;
					endDate = myendDate;
				} else {
					startDate = myendDate;
					endDate = mystartDate;
					direction = -1;
				}
				var startWeekday = startDate.day(), endOffset = endDate.day() + 1, endSunday = endDate.clone().day(0).startOf('day'), startSunday = startDate.clone().day(7).startOf('day'), weeks = endSunday.diff(startSunday, 'weeks'), firstWeek,
					lastWeek;

				// week definition in the form [0,1,1,1,1,1,0]
				firstWeek = _.sum(week.slice(startWeekday + 1)); // Remaining workdays in first week after start day
				lastWeek = _.sum(week.slice(0, endOffset)); // Remaining workdays in last week <= end day

				var exceptionsWithinRange = exceptionsWithoutWeekends.filter(function (exceptionday) {
					// return exceptionday.isBetween(startDate, endDate, 'd', '[]'); // option from moment 1.13 on. still on 1.10
					return exceptionday.isSame(endDate, 'd') || exceptionday.isSame(startDate, 'd') || exceptionday.isBetween(startDate, endDate, 'd');
				});
				var result = (weeks * numberOfWeekdays + firstWeek + lastWeek + (countStartDay ? week[startWeekday] : 0) - exceptionsWithinRange.length) * direction;
				businessDays.diffCache.set(mystartDate.toDate().getTime() + myendDate.toDate().getTime(), result);
				return result;
			};

			return businessDays;
		}

		// Components
		return {
			configureWorkdays: configureWorkdays,

			timescale: function timescale() {
				return modifyTimescale(d3.scaleUtc(), [2, 3, 4, 5, 6], true, [], true, moment.utc(), moment.utc().add(30, 'd'), null);

				function modifyTimescale(originalscale, workingDays, showWeekends, holidays, showHolidays, basedate, baseenddate, cache) {
					var ISOworkingdays, JSworkingdays, weekend;

					function setupWeek(workingDays) {
						var weekdaymap = [null, 7, 1, 2, 3, 4, 5, 6]; // mapping our weekday index to ISO week
						ISOworkingdays = workingDays.map(function (item) { // when using iso week: monday: 1 ... sunday: 7
							return weekdaymap[item];
						});
						JSworkingdays = workingDays.map(function (item) { // when using native js date functions sunday: 0  monday 1 ...
							return item - 1;
						});
						weekend = _.difference([1, 2, 3, 4, 5, 6, 7], ISOworkingdays);
					}

					setupWeek(workingDays);

					var businessDays = configureWorkdays((showWeekends ? [] : weekend), (showHolidays ? [] : holidays), basedate, baseenddate);

					function filterIsActive() {
						return (!showWeekends && workingDays.length < 7 || !showHolidays && holidays.length > 0);
					}

					function extendedscale(date) {
						var result;
						if (_.isUndefined(date) || _.isNull(date)) {
							return 0;
						}

						if (_.isNumber(date)) {
							return date;
						}

						if (!validDate(date)) {
							throw new Error('No valid date. Unparsed string?');
						}
						if (cache) {
							result = cache[date.valueOf()];
							if (result) {
								return result;
							}
						}
						if (!filterIsActive()) {
							result = originalscale(date);
							if (cache) {
								cache[date.valueOf()] = result;
							}
							return result;
						}
						var startdate;
						date = moment.utc(date);
						startdate = basedate.clone();
						var noOfWorkingDays = businessDays.diff(basedate, date, false);
						startdate.add(noOfWorkingDays, 'd');

						// ALWAYS copy time
						startdate.hour(date.hour());
						startdate.minute(date.minute());
						startdate.second(date.second());
						result = originalscale(startdate);
						if (cache) {
							cache[date.valueOf()] = result;
						}
						return result;
					}

					extendedscale.extendeddomain = function (x) {
						if (!arguments.length) {
							var range = originalscale.range();
							return [extendedscale.extendedinvert(range[0]), extendedscale.extendedinvert(range[1])];
						}
						originalscale.domain(x);
						return extendedscale;
					};
					extendedscale.extendedinvertOld = function extendedinvert(x) {
						var originaldate = moment.utc(originalscale.invert(x));
						if (!filterIsActive()) {
							return originaldate;
						}
						var startdate = moment.utc(originalscale.domain()[0]);
						// original is too small
						// recalc original
						var x2 = extendedscale(originaldate);
						var differenceinpixels = x - x2;
						// convert differenceinpixels to difference in days
						var differenceindays = moment.utc(originalscale.invert(differenceinpixels)).diff(startdate, 'd');
						return originaldate.add(differenceindays, 'd');
						// return businessDays.add(originaldate, differenceindays);
					};

					extendedscale.extendedinvert = function extendedinvert(x) {
						// 1. Invertiere x zu 1.3(1.4')
						var rawdate = moment.utc(extendedscale.invert(x));
						if (!filterIsActive()) {
							return rawdate;
						}
						// es kommt 1.3 (1.4') raus
						// 2 Wieviele normale Tage zwischen 1.1 und 1.3
						var startdate = basedate.clone();
						var diffindays = moment.utc(rawdate).startOf('d').diff(startdate, 'd');

						// 3 auf das Startdate dffindays addieren als arbeitstage
						var result = businessDays.newAdd(startdate, diffindays);

						// ALWAYS copy time
						result.hour(rawdate.hour());
						result.minute(rawdate.minute());
						result.second(rawdate.second());

						return result;
					};

					extendedscale.ticks = function () { // jshint ignore:line
						if (arguments[0] === 0) {
							return [];
						}

						// what would be the behavior for number of ticks?

						var result;
						var start = extendedscale.extendedinvert(extendedscale.range()[0]).add(-3, 'M'); // cannot use domain
						// Note: start has to be adjusted to the left by the number of all the possible non-working days that are hidden from view
						// 3 months is a shortcut assumption.
						var stop = extendedscale.extendedinvert(extendedscale.range()[1]).add(1, 'd');

						var step = arguments[1] || 1;
						var name = arguments[2];
						var originalstep = step;
						if (originalstep === 2 || originalstep === 5 || originalstep === 6) {
							step = 1;
						}

						switch (name) {
							case 'sunday':
								result = d3.utcSundays(start, stop, step);
								break;
							case 'monday':
								result = d3.utcMondays(start, stop, step);
								break;
							case 'tuesday':
								result = d3.utcTuesdays(start, stop, step);
								break;
							case 'wednesday':
								result = d3.utcWednesdays(start, stop, step);
								break;
							case 'thursday':
								result = d3.utcThursdays(start, stop, step);
								break;
							case 'friday':
								result = d3.utcFridays(start, stop, step);
								break;
							case 'saturday':
								result = d3.utcSaturdays(start, stop, step);
								break;
							case 'hour':
								result = d3.utcHours(start, stop, step);
								break;
							case 'day':
								result = d3.utcDays(start, stop, step);
								break;
							case 'week':
								result = d3.utcWeeks(start, stop, step);
								break;
							case 'month':
								result = d3.utcMonths(start, stop, step);
								break;
							case 'year':
								result = d3.utcYears(start, stop, step);
								break;
							default:
								result = d3.utcYears(start, stop, 5);
						}
						/*
						                        if (originalstep === 2 && name === 'week') {
						                            result = result.filter(function(item) {
						                                var mItem = moment.utc(item);
						                                return mItem.week() % 2 === 0;
						                            });
						                        } else if (originalstep === 2 && name === 'day') {
						                            result = result.filter(function(item) {
						                                return item.getDate() % 2 === 0;
						                            });
						                        } else if (originalstep === 5) {
						                            result = result.filter(function(item) {
						                                return item.getYear() % 5 === 0;
						                            });
						                        } else if (originalstep === 6) {
						                            result = result.filter(function(item) {
						                                return item.getMonth() === 0 || item.getMonth() === 6;
						                            });
						                        } */

						if (originalstep === 6) { // Half year ticks should show up only twice per year
							result = result.filter(function (item) {
								return item.getMonth() === 0 || item.getMonth() === 6;
							});
						}

						// filter out ticks that should be invisible, only on day zoom level
						if (!showWeekends && name === 'day') {
							result = result.filter(function (item) {
								return JSworkingdays.find(function (subitem) {
									return subitem === item.getDay();
								});
							});
						}

						// filter out invisible holidays from the ticks collection, only on day zoom level
						if (!showHolidays && name === 'day') {
							result = result.filter(function (item) {
								// all items but items in holiday collection
								return !holidays.find(function (subitem) {
									return subitem.isSame(item, 'day');
								});
							});
						}

						return result;
					};
					extendedscale.workingDays = function (x) {
						if (!arguments.length) {
							return workingDays;
						}
						if (!_.isEqual(workingDays, x)) { // compare old and new value
							workingDays = x; // when using RIB week definition: sunday: 1, monday: 2
							setupWeek(workingDays);
							businessDays = configureWorkdays((showWeekends ? [] : weekend), (showHolidays ? [] : holidays), basedate, baseenddate);
						}
						return extendedscale;
					};
					extendedscale.showWeekends = function (x) {
						if (!arguments.length) {
							return showWeekends;
						}
						if (!_.isEqual(showWeekends, x)) { // compare old and new value
							showWeekends = x;
							businessDays = configureWorkdays((showWeekends ? [] : weekend), (showHolidays ? [] : holidays), basedate, baseenddate);
						}
						return extendedscale;
					};
					extendedscale.holidays = function (x) {
						if (!arguments.length) {
							return holidays;
						}
						if (!_.isEqual(holidays, x)) { // compare old and new value
							holidays = x;
							businessDays = configureWorkdays((showWeekends ? [] : weekend), (showHolidays ? [] : holidays), basedate, baseenddate);
						}
						return extendedscale;
					};
					extendedscale.showHolidays = function (x) {
						if (!arguments.length) {
							return showHolidays;
						}
						if (!_.isEqual(showHolidays, x)) { // compare old and new value
							showHolidays = x;
							businessDays = configureWorkdays((showWeekends ? [] : weekend), (showHolidays ? [] : holidays), basedate, baseenddate);
						}
						return extendedscale;
					};
					extendedscale.startDate = function (x) {
						if (!arguments.length) {
							return basedate;
						}
						basedate = moment.utc(x).clone(); // .add(-10, 'm');
						businessDays = configureWorkdays((showWeekends ? [] : weekend), (showHolidays ? [] : holidays), basedate, baseenddate);
						return extendedscale;
					};
					extendedscale.endDate = function (x) {
						if (!arguments.length) {
							return baseenddate;
						}
						baseenddate = moment.utc(x).clone(); // .add(10, 'm');
						businessDays = configureWorkdays((showWeekends ? [] : weekend), (showHolidays ? [] : holidays), basedate, baseenddate);
						return extendedscale;
					};
					extendedscale.copy = function () {
						return modifyTimescale(originalscale.copy(), workingDays, showWeekends, holidays, showHolidays, basedate, baseenddate, cache);
					};
					extendedscale.range = function (args) {
						var value;
						if (args) {
							value = originalscale.range.apply(originalscale, [args]);
						} else {
							value = originalscale.range.apply(originalscale);
						}

						return value === originalscale ? extendedscale : value;
					};
					extendedscale.invert = function (args) {
						var value = originalscale.invert.call(originalscale, args);
						return value === originalscale ? extendedscale : value;
					};
					extendedscale.domain = function (args) {
						var value;
						if (args) {
							value = originalscale.domain.apply(originalscale, [args]);
						} else {
							value = originalscale.domain.apply(originalscale);
						}

						return value === originalscale ? extendedscale : value;
					};
					extendedscale.cache = function (x) {
						if (!arguments.length) {
							return cache;
						}
						cache = x;
						return extendedscale;
					};

					return extendedscale;
				}
			},

			timeaxis: function timeaxis() {
				// private 'static' stuff (functions and members)

				var scale = d3.scaleUtc(), axisheight = 20, orientation = 'top', tickvalues = [], maintickvalues = [], translations = {
					weekAbbreviation: 'W', weekNumberFormat: 'W'
				};

				/* may make axisheight property? */

				function formatDate(raw) {
					var myfunction;
					if (typeof (raw) === 'string') { // native JS instead of lowdash because no lowdash on server
						myfunction = function (d) {
							var mymoment = moment.isMoment(d) ? d : moment.utc(d);
							return mymoment.format(raw);
						};
						return myfunction;
					} else {
						return raw;
					}
				}

				var timeaxis_ = function (selection) {
					var time1, time2, time3;
					var timeaxis1, timeaxis2, timeaxis3;
					var t;
					time1 = selection.select('g.time1');
					if (time1.empty()) {
						time1 = selection.append('g').classed('time1', true);
					}
					time2 = selection.select('g.time2');
					if (time2.empty()) {
						time2 = selection.append('g').classed('time2', true);
					}
					time3 = selection.select('g.time3');
					if (time3.empty()) {
						time3 = selection.append('g').classed('time3', true);
					}

					t = scaleTime();

					var currentwidth = scale.range()[1];
					var tickvalues3 = currentwidth <= 490 ? [] : tickValues(t.ticks[2]);

					tickvalues = tickvalues3; // make tickvalues public for consumption in calendarlines function
					maintickvalues = tickValues(t.ticks[1]); // make main tickvalues public for consumption in calendarlines function
					var currenttext = '';
					currenttext = (function getcurrenttext() {
						var formatter = t.format[0];
						if (_.isString(formatter)) {
							currenttext = moment.utc(scale.domain()[0]).format(formatter);
						}
						if (_.isFunction(formatter)) {
							currenttext = formatter(moment.utc(scale.domain()[0]));
						}
						return currenttext;
					})();
					let currenttextlength = currenttext.length * 5 + 2;

					if (orientation === 'bottom') {
						time3.attr('transform', 'translate(0,2)');
						time2.attr('transform', 'translate(0,' + axisheight + ')');
						time1.attr('transform', 'translate(0,' + 2 * axisheight + ')');
						timeaxis1 = d3.axisBottom().scale(scale).tickValues(tickValues(t.ticks[0]).filter(tick => scale(tick) > currenttextlength)).tickFormat(formatDate(t.format[0]));
						timeaxis2 = d3.axisBottom().scale(scale).tickValues(tickValues(t.ticks[1])).tickFormat(formatDate(t.format[1]));
						timeaxis3 = d3.axisBottom().scale(scale).tickValues(tickvalues3).tickFormat(formatDate(t.format[2]));
					} else { // default is 'top'
						time1.attr('transform', 'translate(0,2)');
						time2.attr('transform', 'translate(0,' + axisheight + ')');
						time3.attr('transform', 'translate(0,' + 2 * axisheight + ')');
						timeaxis1 = d3.axisBottom().scale(scale).tickValues(tickValues(t.ticks[0]).filter(tick => scale(tick) > currenttextlength)).tickFormat(formatDate(t.format[0]));
						timeaxis2 = d3.axisBottom().scale(scale).tickValues(tickValues(t.ticks[1])).tickFormat(formatDate(t.format[1]));
						timeaxis3 = d3.axisBottom().scale(scale).tickValues(tickvalues3).tickFormat(formatDate(t.format[2]));
					}

					time1.call(timeaxis1);

					// postprocessing of timeaxis1
					var extralabel = selection.select('g.extralabel');
					if (extralabel.empty()) {
						selection.append('g').classed('extralabel', true).attr('transform', 'translate(0,8)').append('rect').attrs({width: 100, height: 12, fill: 'white'})
							.parent().append('text').attr('transform', 'translate(0,10)').style('font-size', '10px').style('font-family', 'sans-serif');
					}
					extralabel.select('text').text(currenttext);
					extralabel.select('rect').attr('width', currenttextlength);

					time2.call(timeaxis2);
					time3.call(timeaxis3);
					selection.selectAll('text').style('text-anchor', 'start');
				};

				// Public functions
				timeaxis_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newscale;
					return timeaxis_;
				};

				timeaxis_.orientation = function (x) {
					if (!arguments.length) {
						return orientation;
					}
					orientation = x;
					return timeaxis_;
				};

				timeaxis_.tickvalues = function ( /* x */) { // tickvalues to be treated as read-only.
					return tickvalues;
				};

				timeaxis_.maintickvalues = function ( /* x */) { // tickvalues to be treated as read-only.
					return maintickvalues;
				};

				timeaxis_.translations = function (x) {
					if (!arguments.length) {
						return translations;
					}
					translations = x;
					return timeaxis_;
				};

				return timeaxis_;

				// Internal functions
				function scaleTime() { // jshint ignore:line
					var currentwidth = scale.range()[1];
					var currentrange = moment.duration(scale.domain()[1] - scale.domain()[0]);
					var ticks = [{
						t: 0
					}, {
						t: 0
					}, {
						t: 0
					}];
					var format = ['', '', ''];

					var displaymonths = currentwidth < 900 ? 'MMM YYYY' : 'MMMM YYYY';
					var weekspan = currentwidth < 700 ? 2 : 1;

					switch (true) {
						/* case (currentrange.asHours() <= 1.3):
							ticks = [{
								t: d3.utcHour,
								n: 'hour'
							}, {
								t: d3.utcMinute,
								s: 15,
								n: 'minute'
							}, {
								t: 40
							}];
							format = ['H', 'mm', 'mm'];
							break;
						case (currentrange.asHours() <= 4.4):
							ticks = [{
								t: d3.utcHour,
								n: 'hour'
							}, {
								t: d3.utcMinute,
								s: 15,
								n: 'minute'
							}, {
								t: 35
							}];
							format = ['H', 'mm', 'mm'];
							break; */
						case (currentrange.asHours() <= 12):
							ticks = [{
								t: d3.utcMonth, n: 'month'
							}, {
								t: d3.utcDay, n: 'day', s: weekspan
							}, {
								t: d3.utcHour, n: 'hour'
							}];
							format = [displaymonths, 'dddd D', 'H'];
							break;
						case (currentrange.asHours() <= 17.5):
							ticks = [{
								t: d3.utcDay, n: 'day'
							}, {
								t: d3.utcHour, n: 'hour'
							}, {
								t: 25
							}];
							format = ['dddd D', 'H', 'mm'];
							break;
						case (currentrange.asDays() <= 7):
							ticks = [{
								t: d3.utcMonday, n: 'monday', s: weekspan
							}, {
								t: d3.utcDay, n: 'day'
							}, {
								t: 30
							}];
							format = ['[' + translations.weekAbbreviation + '] ' + translations.weekNumberFormat + ' MMMM YYYY', 'dddd D', 'H'];
							break;
						case (currentrange.asMonths() <= 1.0):
							ticks = [{
								t: d3.utcMonth, n: 'month'
							}, {
								t: d3.utcMonday, n: 'monday', s: weekspan
							}, {
								t: d3.utcDay, n: 'day', s: weekspan
							}];
							format = [displaymonths, '[' + translations.weekAbbreviation + '] ' + translations.weekNumberFormat, 'DD dd'];
							break;
						case (currentrange.asMonths() <= 1.8):
							ticks = [{
								t: d3.utcMonth, n: 'month'
							}, {
								t: d3.utcMonday, n: 'monday', s: weekspan
							}, {
								t: d3.utcDay, n: 'day', s: weekspan
							}];
							format = [displaymonths, '[' + translations.weekAbbreviation + '] ' + translations.weekNumberFormat, 'DD'];
							break;
						case (currentrange.asMonths() <= 6.6):
							ticks = [{
								t: d3.utcYear, n: 'year'
							}, {
								t: d3.utcMonth, n: 'month'
							}, {
								t: d3.utcMonday, n: 'monday', s: weekspan
							}];
							format = ['YYYY', displaymonths, '[' + translations.weekAbbreviation + '] ' + translations.weekNumberFormat];
							break;
						case (currentrange.asMonths() <= 9.5):
							ticks = [{
								t: d3.utcYear, n: 'year'
							}, {
								t: d3.utcMonth, n: 'month'
							}, {
								t: d3.utcMonday, n: 'monday', s: 2
							}];
							format = ['YYYY', displaymonths, translations.weekNumberFormat];
							break;
						case (currentrange.asYears() <= 1):
							ticks = [{
								t: d3.utcYear, n: 'year'
							}, {
								t: d3.utcMonth, s: 6, n: 'month'
							}, {
								t: d3.utcMonth, n: 'month'
							}];
							format = ['YYYY', halfYear(), displaymonths];
							break;
						case (currentrange.asYears() <= 5):
							ticks = [{
								t: d3.utcYear, s: 5, n: 'year'
							}, {
								t: d3.utcYear, n: 'year'
							}, {
								t: d3.utcMonth, s: 6, n: 'month'
							}];
							format[0] = formattimespan;
							format[1] = 'YYYY';
							format[2] = halfYear();
							break;
						default:
							ticks = [{
								t: d3.utcYear, s: 5
							}, {
								t: 0
							}, {
								t: 0
							}];
							format = [formattimespan, '', ''];
					}

					return {
						ticks: ticks, format: format
					};

					function formattimespan(d) {
						var seconddate;
						var mysuperstep;
						var localdate = new Date(d);
						if (ticks[0].s && currentrange.asYears() > 1 && localdate.getFullYear() % ticks[0].s !== 0) {
							mysuperstep = Math.floor(localdate.getFullYear() / ticks[0].s) * ticks[0].s;
							localdate.setFullYear(mysuperstep);
						}
						seconddate = new Date(localdate);
						seconddate.setFullYear(localdate.getFullYear() + ticks[0].s);
						return localdate.getFullYear() + '-' + seconddate.getFullYear();
					}

					function halfYear() {
						return function (d) {
							// var subyear = (d.getFullYear() + '').substr(2, 2);
							var subyear = d.getFullYear();
							var result;
							if (d.getMonth() < 6) {
								result = 'I/' + subyear;
							} else {
								result = 'II/' + subyear;
							}

							return result;
						};
					}
				}

				function tickValues(tt) {
					return scale.ticks(tt.t, tt.s, tt.n);
				}
			},

			holidays: function holidays() {
				// private 'static' stuff (functions and members)
				var scale, height = 500, printadjustment = -20, labelwidths = new Map();
				const adjustment = 50;
				var holidays_ = function (selection) {
					var holidaygroups;
					var domain = scale.extendeddomain();
					holidaygroups = selection.selectAll('g.holiday').data(selection.datum().filter(function (item) {
						return item.End > domain[0] && item.Start < domain[1];
					}));
					holidaygroups.exit().remove(); // old holidays

					var newholidaygroups = holidaygroups.enter() // new holidays
						.append('g').classed('holiday', true)
						.append('rect').classed('holiday', true)
						.parent().append('g').classed('textbox', true)
						.append('text').classed('holiday', true);

					var combinedholidaygroups = newholidaygroups.merge(holidaygroups);
					combinedholidaygroups.each(function (d) {
						var g = d3.select(this); // the current g group
						var xvalue = getXValue(d);
						g.select('rect.holiday')
							.attr('x', function (d) {
								return scale(d.Start);
							})
							.attr('y', 0)
							.attr('height', height + adjustment)
							.attr('width', function (d) {
								return scale(d.End) - scale(d.Start);
							})
							.style('fill', function (d) {
								return decimalToHex(d.Color, 6);
							});

						g.select('g.textbox text')
							.attrs({
								x: xvalue, y: 4
							})
							.text(function (d) {
								return _.unescape(d.Text);
							})
							.style('alignment-baseline', 'middle', 'font-size', '8px');

						var bboxouter = g.select('g.textbox text');
						if (!bboxouter.empty()) {
							var bbox = bboxouter.node().getBBox();
							g.select('g.textbox')
								.attrs({
									x: bbox.x - 5, y: bbox.y - 2, width: bbox.width + 10, height: bbox.height + 4, opacity: function (d) {
										var width = scale(d.End) - scale(d.Start);
										if (width < 10) {
											return 0;
										} else {
											return 1;
										}
									}
								})
								.styles({
									'shape-rendering': 'auto'
								});
							g.select('g.textbox').attr('transform', 'rotate (270 ' + (bbox.x) + ' ' + (bbox.y) + ') translate(' + (-bbox.width + printadjustment) + ' ' + (-bbox.height / 2) + ')');
						}
					});

					function getXValue(d) {
						if (!d.End) {
							return scale(d.Start);
						}

						var a = scale(d.Start);
						var b = scale(d.End);
						return a + 0.5 * (b - a);
					}
				};
				// public properties and functions
				holidays_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					labelwidths.clear();
					scale = newscale;
					return this;
				};
				holidays_.height = function (newheight) {
					if (!arguments.length) {
						return height;
					}
					height = newheight;
					return this;
				};
				return holidays_;
			},

			hammocks: function hammocks() {
				// private 'static' stuff (functions and members)
				var scale, /* offset = 0, */
					scroll = false, verticalIndex = new Map(), printmode, version = 'Planned', color, rowheight = defaultrowheight, assignedActivities = [], myY, border = 5;
				var hammocks_ = function (selection) {
					var hammock;
					// var domain = scale.extendeddomain();
					hammock = selection.selectAll('rect.hammock').data(selection.datum().filter(function (item) {
						return item;
					}));

					hammock.exit().remove(); // old hammocks

					var newhammock = hammock.enter() // new hammocks
						.append('rect').classed('hammock', true).attr('rx', 5).attr('ry', 5).style('fill', color)
						.style('opacity', 0.3).style('pointer-events', 'none');

					var combinedhammock = newhammock.merge(hammock);

					combinedhammock.each(function (d) {
						var sel = d3.select(this);
						myY = myY || getY(d);
						var first, last;

						switch (version) {
							case 'Planned':
								first = d.PlannedStart;
								last = d.PlannedFinish;
								break;
							case 'Actual':
								first = d.ActualStart;
								last = d.ActualFinish;
								break;
							case 'Current':
								first = d.CurrentStart;
								last = d.CurrentFinish;
								break;
							default:
						}

						if (!last) {
							last = new moment.utc(first); // fallback, should be invisible but not throw errors
						}

						sel.attr('x', scale(first) - border)
							.attr('y', myY.y)
							.attr('height', myY.height)
							.attr('width', scale(last) - scale(first) + border + border).style('fill', color);
					});

					function getY(item) {
						// get min and max of all visible activities that belong to hammock
						var combined = _.concat(item.Id, assignedActivities);
						combined = combined.filter(function (item) {
							return verticalIndex.has(item);
						})
							.map(function (item) {
								return verticalIndex.get(item);
							});
						var min = _.min(combined) || 0;
						var max = _.max(combined) || 0;
						min -= border;
						max += border;
						var height = max + rowheight - min;

						var modifiedheight = scroll ? height + 2000 : height;
						return {
							y: min, height: modifiedheight
						};
					}
				};
				// public properties and functions
				hammocks_.scale = function (x) {
					if (!arguments.length) {
						return scale;
					}
					scale = x;
					return this;
				};
				hammocks_.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = x;
					return this;
				};
				hammocks_.assignedActivities = function (x) {
					if (!arguments.length) {
						return assignedActivities;
					}
					myY = null;
					assignedActivities = x;
					return this;
				};
				hammocks_.scrollOptimization = function (x) {
					if (!arguments.length) {
						return scroll;
					}
					scroll = x;
					return this;
				};
				hammocks_.color = function (x) {
					if (!arguments.length) {
						return color;
					}
					color = x;
					return this;
				};
				hammocks_.version = function (x) {
					if (!arguments.length) {
						return version;
					}
					if (x !== 'Current' && x !== 'Planned' && x !== 'Actual') {
						version = 'Planned'; // restore the default
						return this;
					}
					version = x;
					return this;
				};
				hammocks_.printmode = function (x) {
					if (!arguments.length) {
						return printmode;
					}
					printmode = x;
					rowheight = printmode ? defaultrowheightprint : defaultrowheight;
					return this;
				};

				return hammocks_;
			},

			// NOTE: CANNOT use ES6 map on server
			weekends: function holidays() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), height = 500, offset = 0, scroll = false, weekdaymap = [null, // sunday is index1, monday is 2 ... saturday is 7.
					d3.utcSunday, d3.utcMonday, d3.utcTuesday, d3.utcWednesday, d3.utcThursday, d3.utcFriday, d3.utcSaturday];

				var weekdaynames = [null, // sunday is index1, monday is 2 ... saturday is 7.
					'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
				var weekends_ = function (selection) {
					const adjustment = 50;
					var a = moment.utc().startOf('isoWeek');
					var b = a.clone().endOf('d');
					var width = scale(b) - scale(a); // does not work if monday declared non-working
					var weekenddata = [];
					var dates = selection.datum() || [];
					dates.forEach(function (lala) {
						weekenddata = weekenddata.concat(scale.ticks(weekdaymap[lala], 1, weekdaynames[lala]));
					});

					var weekends = selection.selectAll('rect.weekend').data(weekenddata);
					weekends.exit().remove(); // old holidays
					var newweekends = weekends.enter() // new holidays
						.append('rect').classed('weekend', true);
					var allweekends = newweekends.merge(weekends);

					// update existing weekends
					allweekends
						.attr('x', function (d) {
							return scale(d);
						})
						.attr('y', 0)
						.attr('height', height + adjustment)
						.attr('width', width);
				};
				// public properties and functions
				weekends_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newscale;
					return this;
				};
				weekends_.height = function (newheight) {
					if (!arguments.length) {
						return height;
					}
					height = newheight;
					return this;
				};

				return weekends_;
			},

			activities: function activities() {
				// private 'static' stuff
				var printmode = false;

				var scalex = d3.scaleUtc(), page = 1, scaley = d3.scaleLinear(), showCritical = false, verticalIndex = null, splits = new Map(), progresssplits = new Map(), clickHandler = _.noop(), doubleClickHandler = _.noop(),
					mouseoverHandler = _.noop(), mouseoutHandler = _.noop(), handledata = {
						id: -1, start: null, middle: null, end: null
					};

				function attachIcons(selection) {
					var defblock = selection.select('defs');
					if (defblock.empty()) {
						defblock = selection.append('defs');
						defblock.append('symbol').attr('id', 'diamond').append('path').attr('d', 'M0,7.5L7.5,0L15,7.5L7.5,15 0,7.5Z');
						defblock.append('symbol').attr('id', 'triangle-down').append('path').attr('d', 'M0,-0.5L20,0L10,15L 0,0Z');
						defblock.append('symbol').attr('id', 'triangle-up').append('path').attr('d', 'M10,0L20,15L0,15L10,0Z');
						defblock.append('symbol').attr('id', 'circle').append('path').attr('d', 'M7.5,0C11.64,0 15,3.36 15,7.5C15,11.64 11.64,15 7.5,15C3.36,15 0,11.64 0,7.5C0,3.36 3.36,0 7.5,0Z');
						defblock.append('symbol').attr('id', 'warning-red').append('path').attr('d', 'M8,3l-6,10c-0.309,0.514 0.013,1 1,1l10,0c0.718,0 1.379,-0.368 1,-1l-6,-10Z').style('fill', '#cc4c33').parent()
							.append('path').attr('d', 'M7,7l2,0l0,3l-2,0l0,-3').style('fill', '#fff').parent()
							.append('path').attr('d', 'M7,11l2,0l0,1l-2,0l0,-1').style('fill', '#fff');
						defblock.append('pattern').attr('id', 'critical').attr('width', '4').attr('height', '4').attr('patternUnits', 'userSpaceOnUse').append('path').attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
							.style('stroke', 'red').style('stroke-width', '1');
					}
				}

				function getStart(d) {
					var result = (d.id === handledata.id && d.bartype.editable) ? handledata.start : d.start;
					return scalex(result);
				}

				function getEnd(d) {
					var result = (d.id === handledata.id && d.bartype.editable) ? handledata.end : d.end;
					return scalex(result);
				}

				var activities_ = function (selection) {
					// on the first go: try to attach icon templates ...
					attachIcons(selection);
					var groups = selection.selectAll('g.level1')
						.data(selection.datum());
					groups.exit().remove();
					var newgroups = groups.enter().append('g').classed('level1', true);
					var combinedgroups = newgroups.merge(groups);
					var bars;
					if (printmode) {
						bars = combinedgroups.selectAll('g.activities').data(function (subarray) {
							return subarray;
						}, itemId);
					} else {
						bars = combinedgroups.selectAll('g.activities').data(function (subarray) {
							return subarray.filter(function (item) {
								return verticalIndex.has(item.id);
							});
						}, itemId);
					}
					var newbars = bars.enter().append('g').classed('activities', true)
						.each(function () {
							var sel = d3.select(this);
							sel.append('line').classed('activity', true);
							sel.append('use').classed('iconstart', true);
							sel.append('use').classed('iconend', true);
							sel.append('use').classed('float', true);
							if (!printmode) {
								sel.append('rect').classed('background', true);
							}
						});
					bars.exit()
						.on('dblclick', null)
						.on('click', null)
						.on('mouseover', null)
						.on('mousemove', null)
						.on('mouseout', null)
						.remove();
					var combinedbars = newbars.merge(bars);
					combinedbars.call(updateBar);

					function updateBar(selection) {
						selection.each(function (d) {
							var sel = d3.select(this); // the current g group
							var myY, iconY;
							// lookup template
							var currenttemplate = d.bartype;
							/*if (_.isBoolean(d.simpleMilestone) && d.simpleMilestone) {
								currenttemplate.iconstart = null;
								currenttemplate.iconend = 'diamond';
								currenttemplate.up = 0;
								currenttemplate.down = 0;
							}*/
							if (currenttemplate.editable) { // append event handler only when selectable
								sel.classed('editable', true);
								sel.classed('readonly', false);
								sel.on('dblclick', doubleClickHandler);
								sel.on('click', clickHandler);
								sel.on('mouseover', mouseoverHandler);
								sel.on('mousemove', mouseoverHandler);
								sel.on('mouseout', mouseoutHandler);
							} else {
								sel.classed('readonly', true);
								sel.classed('editable', false);
							}

							sel.select('rect.background').each(function (d) {
								var rect = d3.select(this);
								var backgroundstart;
								if (currenttemplate.iconstart) {
									backgroundstart = getStart(d) - 7.5;
								} else if (currenttemplate.down - currenttemplate.up > 0) {
									backgroundstart = getStart(d);
								} else {
									backgroundstart = getEnd(d) - 7.5;
								}
								rect.attr('x', backgroundstart);
								rect.attr('width', function (d) {
									var result = getEnd(d) + (currenttemplate.iconend ? 7.5 : 0) - backgroundstart;
									return result > 0 ? result : 0;
								});
								rect.attr('y', function (d) {
									return verticalIndex.get(d.id) + (defaultrowheight * 0.2);
								});
								rect.attr('height', defaultrowheight * 0.7);
							});

							myY = Math.floor(verticalIndex.get(d.id) + (scaley(currenttemplate.down) - scaley(currenttemplate.up)) * 0.5 + scaley(currenttemplate.up));

							// for circle and trapez except barheight 0
							if (currenttemplate.iconstart === 'diamond' || currenttemplate.iconstart === 'circle') {
								iconY = verticalIndex.get(d.id) + (scaley(currenttemplate.down) - scaley(currenttemplate.up)) * 0.5 + scaley(currenttemplate.up) - 7.5;
							} else {
								// for triangle up and triangle down except barheight 0
								iconY = verticalIndex.get(d.id) + scaley(currenttemplate.up) - 0.5;
							}

							sel.select('line.activity').each(function (d) {
								var line = d3.select(this);
								line.attr('x1', function (d) {
									return getStart(d);
								})
									.attr('y1', myY).attr('y2', myY)
									.attr('x2', function (d) {
										var start = getStart(d);
										var end = getEnd(d);
										var result = end - start;
										if (result < 0) {
											return start;
										} else {
											return end;
										}
									})
									.attr('stroke', getFill)
									.attr('stroke-width', scaley(currenttemplate.down) - scaley(currenttemplate.up));

								// split activity
								if (splits.has(d.id) && currenttemplate.type !== 'progress') {
									line.attr('stroke-dasharray', function (d) {
										var result = '';
										var value = splits.get(d.id);
										for (let index = 0; index < value.length; index++) {
											var currentsplit = value[index];
											if (index === 0 && d.id === handledata.id) {
												currentsplit.start = handledata.start;
											}
											if (index === value.length - 1 && d.id === handledata.id) {
												currentsplit.end = handledata.end;
											}
											result += (scalex(currentsplit.end) - scalex(currentsplit.start)) + ' ';
										}
										return result;
									});
									// progress splits activity
								} else if (progresssplits.has(d.id) && currenttemplate.type === 'progress') {
									line.attr('stroke-dasharray', function (d) {
										var result = '';
										var value = progresssplits.get(d.id);
										for (let index = 0; index < value.length; index++) {
											var currentsplit = value[index];
											if (index === 0 && d.id === handledata.id) {
												currentsplit.start = handledata.start;
											}
											if (index === value.length - 1 && d.id === handledata.id) {
												currentsplit.end = handledata.end;
											}
											result += (scalex(currentsplit.end) - scalex(currentsplit.start)) + ' ';
										}
										return result;
									});
								}
							});

							sel.select('use.iconstart')
								.attr('x', function (d) {
									return getStart(d) - 7.5;
								})
								.attr('y', iconY)
								.style('fill', function () {
									return d.color || currenttemplate.pattern || currenttemplate.fill;
								})
								.attr('xlink:href', function () {
									return '#' + currenttemplate.iconstart;
								});

							sel.select('use.iconend')
								.attr('x', function (d) {
									if (currenttemplate.iconstart === 'triangle-up' || currenttemplate.iconstart === 'triangle-down') {
										return getEnd(d) - 9.5;
									} else {
										return getEnd(d) - 7.5;
									}
								})
								.attr('y', iconY)
								.style('fill', function () {
									return d.color || currenttemplate.pattern || currenttemplate.fill;
								})
								.attr('xlink:href', function () {
									return '#' + currenttemplate.iconend;
								});

							sel.select('use.float').attr('x', function (d) {
								return getStart(d) - 17;
							})
								.attr('y', myY)
								.attr('xlink:href', function (d) {
									if (currenttemplate.baseline) {
										return '';
									} else {
										return showCritical && d.float < 0 ? '#warning-red' : '';
									}
								});

							function getFill() {
								return (currenttemplate.canShowCritical && showCritical && d.isCritical) ? 'url(#critical)' : (d.color || currenttemplate.pattern || currenttemplate.fill);
							}
						});
					}
				};
				activities_.scaleX = function (x) {
					if (!arguments.length) {
						return scalex;
					}
					scalex = x;
					return this;
				};
				activities_.scaleY = function (x) {
					if (!arguments.length) {
						return scaley;
					}
					scaley = x;
					return this;
				};
				activities_.showCritical = function (x) {
					if (!arguments.length) {
						return showCritical;
					}
					showCritical = x;
					return this;
				};
				activities_.page = function (x) {
					if (!arguments.length) {
						return page;
					}
					page = x;
					return this;
				};
				activities_.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = x;
					return this;
				};
				activities_.splits = function (x) {
					if (!arguments.length) {
						return splits;
					}
					splits = x;
					return this;
				};
				activities_.progresssplits = function (x) {
					if (!arguments.length) {
						return progresssplits;
					}
					progresssplits = x;
					return this;
				};
				activities_.clickHandler = function (x) {
					if (!arguments.length) {
						return clickHandler;
					}
					clickHandler = x;
					return this;
				};
				activities_.doubleClickHandler = function (x) {
					if (!arguments.length) {
						return doubleClickHandler;
					}
					doubleClickHandler = x;
					return this;
				};
				activities_.mouseoverHandler = function (x) {
					if (!arguments.length) {
						return mouseoverHandler;
					}
					mouseoverHandler = x;
					return this;
				};
				activities_.mouseoutHandler = function (x) {
					if (!arguments.length) {
						return mouseoutHandler;
					}
					mouseoutHandler = x;
					return this;
				};
				activities_.handleData = function (x) {
					if (!arguments.length) {
						return handledata;
					}
					handledata = x;
					return this;
				};
				activities_.printmode = function (x) {
					if (!arguments.length) {
						return printmode;
					}
					printmode = x;
					return this;
				};

				return activities_;
			},

			splits: function splits() {
				// private 'static' stuff

				var scale = d3.scaleUtc(), verticalIndex = null;

				var splits_ = function (selection) {
					var mysplits = selection.selectAll('line.splits').data(selection.datum());
					mysplits.enter().append('line').classed('splits', true);
					mysplits.exit().remove();

					mysplits
						.attr('x1', function (d) {
							return scale(d.start);
						})
						.attr('x2', function (d) {
							return scale(d.end);
						})
						.attr('y1', function (d) {
							return (verticalIndex.get(d.a_id) || 0) + defaultrowheight / 2;
						})
						.attr('y2', function (d) {
							return (verticalIndex.get(d.a_id) || 0) + defaultrowheight / 2;
						});
				};

				splits_.scale = function (x) {
					if (!arguments.length) {
						return scale;
					}
					scale = x;
					return this;
				};
				splits_.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = x;
					return this;
				};

				return splits_;
			},

			// screen only. not in print
			notes: function notes() {
				// private 'static' stuff

				var scalex = d3.scaleUtc(), verticalIndex = null, notehandler = _.noop();

				function attachIcons(selection) {
					var defblock = selection.select('defs');
					if (defblock.empty()) {
						defblock = selection.append('defs');
					}
					var notesymbol = selection.select('defs symbol#notes');
					if (notesymbol.empty()) {
						defblock.append('symbol').attr('id', 'notes')
							.append('g')
							.append('rect').attrs({
							width: 14, height: 11, fill: 'lightyellow'
						})
							.parent()
							.append('path')
							.attr('d', 'M3 6h10v1H3zm0 3h10v1H3zm0 3h10v1H3z M3 0h10c1.66 0 3 1.34 3 3v13H0V3c0-1.66 1.34-3 3-3ZM1 4v11h14V4H1Z');
					}
				}

				var notes_ = function (selection) {
					var horizontalIndex = new Map();
					// on the first go: try to attach icon templates ...
					attachIcons(selection);
					var groups = selection.selectAll('g.notes')
						.data(selection.datum());
					groups.exit().remove();
					var newgroups = groups.enter().append('g').classed('notes', true);
					var allgroups = newgroups.merge(groups);
					var notes = allgroups.selectAll('use.note').data(function (subarray) {
						return subarray.filter(function (item) {
							var result = verticalIndex.has(item.id) && item.note && item.note.length > 0;
							if (result && (!horizontalIndex.has(item.id) || horizontalIndex.get(item.id) < item.end)) {
								horizontalIndex.set(item.id, item.end);
							}
							return result;
						});
					}, itemId);
					notes.exit().on('click', null).remove(); // remove notehandler
					var newnotes = notes.enter().append('use').classed('note', true)
						.attr('xlink:href', '#notes')
						.on('click', notehandler);
					var allnotes = newnotes.merge(notes);
					allnotes.attr('x', function (d) {
						return scalex(horizontalIndex.get(d.id)) + 13;
					})
						.attr('y', function (d) {
							return verticalIndex.get(d.id) + 4.5;
						});
				};
				notes_.scaleX = function (x) {
					if (!arguments.length) {
						return scalex;
					}
					scalex = x;
					return this;
				};
				notes_.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = x;
					return this;
				};
				notes_.click = function (x) {
					if (!arguments.length) {
						return notehandler;
					}
					notehandler = x;
					return this;
				};

				return notes_;
			},

			// NOTES will have open and closed notes stuff and take currentfinish as alignment guide plus vertical stuff...
			// probably should use HTML instead of SVG text for the notes container ...

			barinfo: function barinfo() {
				// private 'static' stuff
				var scale = d3.scaleUtc(), verticalIndex = null, printmode = false, horizontalspacer = 19;
				var textcache = new Map();

				function wrap() {
					/* jshint -W040 */
					var self = d3.select(this);
					var text = self.text();
					var textWidth = textcache.get(text);
					if (textWidth === undefined) {
						textWidth = self.node().getComputedTextLength();
						textcache.set(text, textWidth);
					}
					while (textWidth > self.attr('width') && text.length > 0) {
						text = text.slice(0, -2);
						if (text.length !== 0) {
							self.text(text + '…');
						} else {
							self.text('');
						}
						textWidth = textcache.get(text);
						if (textWidth === undefined) {
							textWidth = self.node().getComputedTextLength();
							textcache.set(text, textWidth);
						}
					}
				}

				var barinfo_ = function (selection) {
					var barinfos;
					if (printmode) {
						barinfos = selection.selectAll('text.barinfo')
							.data(selection.datum(), function (item) {
								return item.id;
							});
					} else {
						barinfos = selection.selectAll('text.barinfo')
							.data(selection.datum().filter(function (item) {
								return verticalIndex.has(item.id);
							}), function (item) {
								return item.id;
							});
					}

					barinfos.exit().remove();
					var newbarinfos = barinfos.enter().append('text').classed('barinfo', true);
					newbarinfos.append('tspan').classed('left', true).attr('text-anchor', 'end').parent()
						.append('tspan').classed('middle', true).attr('text-anchor', 'middle').parent()
						.append('tspan').classed('right', true).attr('text-anchor', 'start');
					var allbarinfos = newbarinfos.merge(barinfos);
					allbarinfos.selectAll('tspan').attr('y', function (d) {
						return verticalIndex.get(d.id) + (printmode ? 11 : 17);
					});

					allbarinfos.select('tspan.left')
						.text(function (d) {
							return _.unescape(d.left);
						})
						.attr('x', function (d) {
							return scale(d.start) - horizontalspacer;
						})
						.attr('width', 200);
					allbarinfos.select('tspan.middle')
						.text(function (e) {
							return _.unescape(e.middle);
						})
						.attr('x', function (d) {
							return scale(d.start) + (scale(d.end) - scale(d.start)) * 0.5;
						})
						.attr('width', function (d) {
							return (scale(d.end) - scale(d.start)) - 2;
						});
					allbarinfos.select('tspan.right')
						.text(function (e) {
							return _.unescape(e.right);
						})
						.attr('x', function (d) {
							return scale(d.end) + horizontalspacer;
						})
						.attr('width', 200);
					allbarinfos.selectAll('tspan').each(wrap);
				};
				barinfo_.scale = function (x) {
					if (!arguments.length) {
						return scale;
					}
					scale = x;
					return this;
				};
				barinfo_.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = x;
					return this;
				};
				barinfo_.printmode = function (x) {
					if (!arguments.length) {
						return printmode;
					}
					printmode = x;
					return this;
				};

				return barinfo_;
			},

			// component for events
			events: function events() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), height = 500, verticalIndex, templateMap, icons, resetIcons = true, printmode, enter = _.noop(), exit = _.noop();

				function attachIcons(selection) {
					if (resetIcons) {
						selection.select('defs').remove();
					}
					var defblock = selection.select('defs');
					if (defblock.empty()) {
						defblock = selection.append('defs');
						icons.forEach(function (v, k) {
							defblock.append('symbol').attr('id', k).append('path').attr('d', v)
								.attrs({
									'fill': 'black', 'stroke': 'white', 'stroke-linejoin': 'round'
								});
						});
						resetIcons = false;
					}
				}

				var events_ = function (selection) {
					// on the first go: try to attach icon templates ...
					attachIcons(selection);

					var singleevents = selection.selectAll('use.event').data(selection.datum().filter(function (item) {
						return verticalIndex.has(item.ActivityFk) && !(validDate(item.EndDate));
					}), itemId);
					var newsingleevents = singleevents.enter().append('use').classed('event', true)
						.attr('width', 11)
						.attr('height', 11)
						.on('mouseover', enter)
						.on('mouseout', exit);
					var allsingleevents = newsingleevents.merge(singleevents);

					singleevents.exit()
						.on('mouseover', null)
						.on('mouseout', null)
						.remove();

					allsingleevents
						.attr('xlink:href', function (d) {
							return templateMap.get(d.EventTypeFk);
						})
						.attr('x', function (d) {
							return scale(d.Date) - 5.5;
						})
						.attr('y', function (d) {
							return verticalIndex.get(d.ActivityFk) + (printmode ? 5 : 8); // 0;
						});

					var doubleevents = selection.selectAll('g.event').data(selection.datum().filter(function (item) {
						return (validDate(item.EndDate)) && verticalIndex.has(item.ActivityFk);
					}), itemId);
					var newdoubleevents = doubleevents.enter().append('g').classed('event', true);
					newdoubleevents.on('mouseover', enter)
						.on('mouseout', exit)
						.append('use').classed('eventall left', true).attr('width', 11).attr('height', 11).parent()
						.append('use').classed('eventall right', true).attr('width', 11).attr('height', 11).parent()
						.append('line').styles({
						'stroke': 'black', 'stroke-width': '1px'
					});
					var alldoubleevents = newdoubleevents.merge(doubleevents);

					doubleevents.exit()
						.on('mouseover', null)
						.on('mouseout', null)
						.remove();
					alldoubleevents.selectAll('use.eventall').attr('xlink:href', function (d) {
						return templateMap.get(d.EventTypeFk);
					}).attr('y', function (d) {
						return verticalIndex.get(d.ActivityFk) + (printmode ? 5 : 8); // 0;
					});
					alldoubleevents.select('use.left').attr('x', function (d) {
						return scale(d.Date) - 5.5;
					});
					alldoubleevents.select('use.right').attr('x', function (d) {
						return scale(d.EndDate) - 5.5;
					});
					alldoubleevents.select('line').attr('x1', function (d) {
						return scale(d.Date) + 5.4;
					})
						.attr('y1', function (d) {
							return verticalIndex.get(d.ActivityFk) + (printmode ? 8 : 13.5); // 5.5;
						})
						.attr('y2', function (d) {
							return verticalIndex.get(d.ActivityFk) + (printmode ? 8 : 13.5); // 5.5;
						})
						.attr('x2', function (d) {
							return scale(d.EndDate) - 5.4;
						});
				};
				// public properties and functions
				events_.scale = function (x) {
					if (!arguments.length) {
						return scale;
					}
					scale = x;
					return this;
				};
				events_.rowheight = function (x) {
					if (!arguments.length) {
						return height;
					}
					height = x;
					return this;
				};
				events_.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = x;
					return this;
				};
				events_.enter = function (x) {
					if (!arguments.length) {
						return enter;
					}
					enter = x;
					return this;
				};
				events_.exit = function (x) {
					if (!arguments.length) {
						return exit;
					}
					exit = x;
					return this;
				};
				events_.templateMap = function (x) {
					if (!arguments.length) {
						return templateMap;
					}
					templateMap = x;
					return this;
				};
				events_.icons = function (x) {
					if (!arguments.length) {
						return icons;
					}
					icons = x;
					resetIcons = true;
					return this;
				};
				events_.printmode = function (x) {
					if (!arguments.length) {
						return printmode;
					}
					printmode = x;
					return this;
				};

				return events_;
			},

			// component for relationships
			relationships: function relationships() {
				// private 'static' stuff
				var criticalColor = '#FF0000', scaleX = d3.scaleUtc(), scaleY = d3.scaleLinear(), page = 1, simpleMode = false, doubleClickHandler = null, height = 500, showCritical = false, offset = 0, printmode = false, headerOffset = 0,
					verticalIndex = new Map(), rline = d3.line()
						.x(function (d) {
							return d.x;
						})
						.y(function (d) {
							return d.y;
						});
				var relationships_ = function (selection) {
					const relationshipdata = selection.datum().filter((item, index, self) => index === self.findIndex((t) => t.id === item.id)); // remove duplicates

					const groupedByTime = relationshipdata.reduce((acc, obj) => {
						const time = obj.points[0].t.unix();
						if (!acc[time]) {
							acc[time] = [];
						}
						acc[time].push(obj);
						return acc;
					}, {});

					for (const key in groupedByTime) {
						let offset = -6;
						if (groupedByTime[key].length == 1) {
							groupedByTime[key][0]._xoffset = 0;
						}
						if (groupedByTime[key].length > 1) {
							groupedByTime[key].forEach(function (key) {
								key._xoffset = offset;
								offset += 3;
								if (offset > 6) {
									offset = -6;
								}
							})
						}
					}

					var headers = selection.select('g.headers'), links;
					if (headers.empty()) { // we will append these svg groups only once
						links = selection.append('g').classed('links', true);
						headers = selection.append('g').classed('headers', true);
					}
					links = selection.select('g.links');

					var link, header;

					if (printmode) {
						link = links.selectAll('g.link').data(relationshipdata);
					} else {
						link = links.selectAll('g.link').data(relationshipdata.filter(function (el) {
							return !(el.parenty < offset && el.childy < offset || el.parenty > offset + height && el.childy > offset + height);
						}));
					}

					var newlink = link.enter() // new relationships
						.append('g').classed('link', true);
					newlink.on('dblclick', doubleClickHandler)
						.append('path').classed('background', true).parent()
						.append('path').parent()
						.append('path').classed('arrow', true);
					var alllink = newlink.merge(link);

					// This construct helps to reuse the results of generatePoints twice
					alllink.each(function (d) {
						var rsline, rsarrow;
						var group = d3.select(this);
						var path = generatePoints(d);
						group.select('path.background').attr('d', path.path);
						rsline = group.select('path:nth-child(2)').attr('d', path.path);
						rsarrow = group.select('path.arrow').attr('d', function () {
							return generateArrow(4, 4, {
								x: path.endpoint.x, y: path.endpoint.y
							}, path.direction);
						});

						if (showCritical && d.isCritical) {
							rsline.style('stroke', criticalColor);
							rsarrow.styles({
								'stroke': criticalColor, 'fill': criticalColor
							});
						} else {
							rsline.attr('style', null);
							rsarrow.attr('style', null);
						}
					});

					if (!printmode) { // headers in a seperate layer on top as click target
						header = headers.selectAll('rect.header').data(relationshipdata.filter(function (el) {
							return !(el.parenty < offset && el.childy < offset || el.parenty > offset + height && el.childy > offset + height);
						}));
						var newheader = header.enter().append('rect').classed('header', true).on('dblclick', doubleClickHandler).attrs({
							width: 10, height: 10
						});
						var allheaders = newheader.merge(header);
						allheaders.each(function (d) {
							var rect = d3.select(this);
							var path = generatePoints(d);
							rect.attrs({
								x: path.endpoint.x - 5, y: path.endpoint.y - 5
							});
						});
					}
				};

				// Scale up generated points with current scales (only known on server)
				function generatePoints(rl) {
					// just scale up the points with the current scales and calculate halfy
					var points = rl.points;
					var direction = 'down';
					var parentx = scaleX(points[0].t) + (simpleMode ? 0 : (rl._xoffset || 0));
					var childx = scaleX(points[2].t) + (simpleMode ? 0 : (rl._xoffset || 0));
					points[0].x = parentx;
					points[1].x = parentx;
					points[2].x = childx;
					points[3].x = childx;
					var mediumadjust = printmode ? 10 : 0;
					var smalladjust = printmode ? 5 : 0;

					points[0].y = getY(points[0].h) + 0;
					if (getY(points[0].h) > getY(points[3].h)) {
						points[0].y = (getY(points[0].h) + 15) - scaleY(points[0].hadjust) - mediumadjust;
						points[3].y = (getY(points[3].h) + 15) + 4 - scaleY(points[3].hadjust) - smalladjust;
						direction = 'up';
					} else {
						points[0].y = getY(points[0].h) + scaleY(points[0].hadjust) + mediumadjust;
						points[3].y = getY(points[3].h) + scaleY(points[3].hadjust) + smalladjust;
						direction = 'down';
					}

					points[1].y = (points[3].y - points[0].y) * 0.5 + points[0].y;
					points[2].y = (points[3].y - points[0].y) * 0.5 + points[0].y;

					// limit to visible viewport
					if (!printmode) {
						_.forEach(points, function (point) {
							if (point.y < (offset - height)) {
								point.y = offset - height;
							} else if (point.y > (height + offset + height)) {
								point.y = height + offset + height;
							}
						});
					}

					return {
						path: rline(points), endpoint: {
							x: childx, y: points[3].y
						}, direction: direction
					};

					function getY(id) {
						if (!printmode) {
							return scaleY(id) + headerOffset;
						}

						if (!verticalIndex.has(id)) {
							return 0;
						}
						var result = verticalIndex.get(id);
						if (result.page < page) {
							return 0;
						} else if (result.page > page) {
							return 3000;
						} else if (result.page === page) {
							return result.value;
						}
					}
				}

				function generateArrow(width, height, coord, direction) {
					var arrowpath;
					switch (direction) {
						case 'up':
							arrowpath = 'M ' + (coord.x + width * 0.5) + ' ' + (coord.y) + ' h ' + (-width) + ' l ' + (width * 0.5) + ' ' + (-height) + ' Z';
							break;
						case 'left':
							arrowpath = 'M ' + (coord.x) + ' ' + (coord.y + (height * 0.5)) + ' v ' + (-height) + ' l ' + (-height) + ' ' + (+width * 0.5) + ' Z';
							break;
						case 'right':
							arrowpath = 'M ' + (coord.x) + ' ' + (coord.y - (height * 0.5)) + ' v ' + (height) + ' l ' + (height) + ' ' + (-width * 0.5) + ' Z';
							break;
						/* jshint -W086 */ // fall-through intended: 'down' is also default case
						case 'down':
						default:
							arrowpath = 'M ' + (coord.x - width * 0.5) + ' ' + (coord.y - height) + ' h ' + (width) + ' l ' + (-width * 0.5) + ' ' + (height) + ' Z';
							break;
					}
					return arrowpath;
				}

				relationships_.scaleX = function (newscalex) {
					if (!arguments.length) {
						return scaleX;
					}
					scaleX = newscalex;
					return this;
				};
				relationships_.scaleY = function (newscaley) {
					if (!arguments.length) {
						return scaleY;
					}
					scaleY = newscaley;
					return this;
				};
				relationships_.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = x;
					return this;
				};
				relationships_.height = function (newheight) {
					if (!arguments.length) {
						return height;
					}
					height = newheight;
					return this;
				};
				relationships_.page = function (x) {
					if (!arguments.length) {
						return page;
					}
					page = x;
					return this;
				};
				relationships_.simpleMode = function (x) {
					if (!arguments.length) {
						return simpleMode;
					}
					simpleMode = x;
					return this;
				};
				relationships_.showCritical = function (newshowCritical) {
					if (!arguments.length) {
						return showCritical;
					}
					showCritical = newshowCritical;
					return this;
				};
				relationships_.offset = function (x) {
					if (!arguments.length) {
						return offset;
					}
					offset = x;
					return this;
				};
				relationships_.headerOffset = function (x) {
					if (!arguments.length) {
						return headerOffset;
					}
					headerOffset = x;
					return this;
				};
				relationships_.printmode = function (x) {
					if (!arguments.length) {
						return printmode;
					}
					printmode = x;
					return this;
				};
				relationships_.doubleClickHandler = function (newDoubleClickHandler) {
					if (!arguments.length) {
						return doubleClickHandler;
					}
					doubleClickHandler = newDoubleClickHandler;
					return this;
				};
				return relationships_;
			},

			// print only component
			headers: function headers() {
				var columns = [], columnwidths = [], headers = [];
				// private stuff
				var scale = d3.scaleLinear();

				var headers_ = function (selection) {
					var row = selection
						.append('div').classed('myrows', true).style('display', 'table-row')
						.style('height', '15px');

					headers.forEach(function (item, i) {
						row.append('div').classed('text', true).text(headers[i]).style('width', columnwidths[i] + 'px')
							.style('max-width', columnwidths[i] + 'px')
							// .style('display', 'table-cell')
							.style('height', scale(1))
							.style('font-weight', 'bold')
							.style('position', 'absolute')
							.style('display', 'block')
							.style('white-space', 'nowrap')
							.style('text-overflow', 'ellipsis')
							.style('overflow', 'hidden')
							.style('left', function () {
								return columnwidths.slice(0, i).reduce(function (sum, value) {
									return sum + value;
								}, 0) + 'px';
							});
						// .style('border-bottom', '1px solid #d6d6d6');
					});

				};
				// public properties and functions
				headers_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newscale;
					return this;
				};
				headers_.columns = function (x) {
					if (!arguments.length) {
						return columns;
					}
					columns = x;
					return this;
				};
				headers_.columnwidths = function (x) {
					if (!arguments.length) {
						return columnwidths;
					}
					columnwidths = x;
					return this;
				};
				headers_.headers = function (x) {
					if (!arguments.length) {
						return headers;
					}
					headers = x;
					return this;
				};

				return headers_;
			},

			// print only component
			table: function table() {
				var columns = [], columnwidths = [], headers = [], printadjustment = 0; // set to -1 if in printmode
				// private stuff
				var scale = d3.scaleLinear();

				var table_ = function (selection) {
					var tablerows = selection.selectAll('div.myrows').data(selection.datum());

					tablerows.exit().remove(); // old tablerows

					var newtablerows = tablerows.enter() // new tablerows
						.append('div').classed('myrows', true).style('display', 'table-row')
						.style('height', '15px');

					var combinedtablerows = newtablerows.merge(tablerows);

					// create a cell in each row for each column
					combinedtablerows.selectAll('div.text')
						.data(function (row) {
							return columns.map(function (column) {
								return {
									column: column, value: row[column]
								};
							});
						})
						.enter()
						.append('div')
						.classed('text', true)
						.classed('description', function (d) {
							return d.column === 'Description';
						})
						.html(function (d, i) {
							return '<div style="width:' + columnwidths[i] + 'px"><div>' + d.value + '</div></div>';
						})
						.style('height', (scale(1) + printadjustment) + 'px')
						.style('font-size', '10px')
						.style('width', function (column, i) {
							return columnwidths[i] + 'px';
						})
						.style('display', 'table-cell')
						.style('border-bottom', '1px solid #d6d6d6');
				};
				// public properties and functions
				table_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newscale;
					return this;
				};
				table_.columns = function (x) {
					if (!arguments.length) {
						return columns;
					}
					columns = x;
					return this;
				};
				table_.columnwidths = function (x) {
					if (!arguments.length) {
						return columnwidths;
					}
					columnwidths = x;
					return this;
				};
				table_.headers = function (x) {
					if (!arguments.length) {
						return headers;
					}
					headers = x;
					return this;
				};

				return table_;
			},

			// component for table
			/* PRINT only */
			activitytable: function activitytable() {
				var columns = [], columnwidths = [], headers = [], position = 'top', page = 1, printadjustment = 0; // set to -1 if in printmode
				// private stuff
				var scale = d3.scaleLinear();

				var activitytable_ = function (selection) {
					var table = selection;
					var thead = selection.select('thead'), tfoot = selection.select('tfoot'), tbody = selection.select('tbody');

					// append the header row
					thead.select('tr')
						.selectAll('th.text')
						.data(columns)
						.enter()
						.insert('th', '.axis')
						.classed('text', true)
						.style('width', function (column, i) {
							return columnwidths[i] + 'px';
						})
						.text(function (column, i) {
							return _.unescape(headers[i] || column);
						});

					if (position !== 'top') {
						// append footer row
						tfoot.select('tr')
							.selectAll('th.text')
							.data(columns)
							.enter()
							.insert('th', '.axis')
							.classed('text', true);
					} else {
						tfoot.remove();
					}

					// create a row for each object in the data, except the first one
					var datawithoutfirst = selection.datum().slice(1);
					tbody.selectAll('tr.more').data(datawithoutfirst).enter().append('tr').classed('more', true);

					var rows = tbody.selectAll('tr').data(selection.datum());
					tbody.select('td.page' + page).attr('rowspan', selection.datum().length);

					if (selection.datum().length > 0) {
						rows.selectAll('td.text').remove();
					}

					// create a cell in each row for each column
					rows.selectAll('td.text')
						.data(function (row) {
							return columns.map(function (column) {
								return {
									column: column, value: row[column]
								};
							});
						})
						.enter()
						.insert('td', '.page' + page)
						.classed('text', true)
						.classed('description', function (d) {
							return d.column === 'Description';
						})
						.html(function (d) {
							return '<div>' + d.value + '</div>';
						})
						.style('height', (scale(1) + printadjustment) + 'px');

					return table;
				};
				activitytable_.scale = function (x) {
					if (!arguments.length) {
						return scale;
					}
					scale = x;
					return this;
				};
				activitytable_.columns = function (x) {
					if (!arguments.length) {
						return columns;
					}
					columns = x;
					return this;
				};
				activitytable_.columnwidths = function (x) {
					if (!arguments.length) {
						return columnwidths;
					}
					columnwidths = x;
					return this;
				};
				activitytable_.headers = function (x) {
					if (!arguments.length) {
						return headers;
					}
					headers = x;
					return this;
				};
				activitytable_.position = function (x) {
					if (!arguments.length) {
						return position;
					}
					position = x;
					return this;
				};
				activitytable_.page = function (x) {
					if (!arguments.length) {
						return page;
					}
					page = x;
					return this;
				};
				activitytable_.printmode = function (x) {
					if (!arguments.length) {
						return printadjustment !== 0;
					}
					printadjustment = x ? -1 : 0;
					return this;
				};

				return activitytable_;
			},

			calendarlines: function calendarlines() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), height = 500, offset = 0, scroll = false, defaultopt = [new moment.utc(), true, true], globaltickvalues = [], linedata = [], verticalIndex = new Map(), showverticallines, showhorizontallines, printmode;
				let additionaloffset = 0;
				const adjustment = 50;

				function makeLinedata() {
					linedata.length = 0;
					var outervalue = 0;
					verticalIndex.forEach(function (value) {
						linedata.push(value);
						outervalue = value;
					});
					linedata.push(outervalue + (printmode ? defaultrowheightprint : defaultrowheight));
				}

				var calendarlines_ = function (selection) {
					var todayline, verticallines, horizontallines;
					var opt = selection.datum() || defaultopt;
					var tickvalues1 = opt[1] ? scale.ticks(d3.utcMonday, 1, 'monday') : [];
					var tickvalues2 = opt[2] ? scale.ticks(d3.utcMonth, 1, 'month') : [];
					var tickvalues = tickvalues1.concat(tickvalues2);
					// special case: more than 1400 tick values
					if (tickvalues.length > 1400) {
						tickvalues.length = 0;
						var tickWide = selection.select('g.tick-wide');
						if (tickWide.empty()) { // horizontal offset needs to be half scale, i.e. stretch 2000 pixel, move 100 pixel to left
							// selection.append('g').classed('tick-wide', true).attr('transform', 'translate(' + (scale.range()[1] / 2) + ',0) scale (' + (scale.range()[1]) + ', 1)').append('line').attrs({
							selection.append('g').classed('tick-wide', true).attr('transform', 'translate(0,0) scale (' + (scale.range()[1] * 2) + ', 1)').append('line').attrs({
								x1: 0, x2: 0, y1: 0, y2: height + adjustment + additionaloffset
							});
						}
					} else {
						selection.select('g.tick-wide').remove();
					}

					var timeaxis = d3.axisBottom().scale(scale).tickSize(height + additionaloffset + adjustment).tickValues(tickvalues).tickFormat('');
					selection.call(timeaxis);

					// top: 0 height: height // inter: defaultrowheight

					horizontallines = selection.selectAll('line.horizontal').data(showhorizontallines ? linedata : []);
					horizontallines.exit().remove();

					var newhorizontallines = horizontallines.enter()
						.append('line').classed('horizontal', true);

					var combinedhorizontallines = newhorizontallines.merge(horizontallines);

					combinedhorizontallines.attrs({
						y1: function (item) {
							return item - offset + (printmode ? -0.5 : 0);
						}, y2: function (item) {
							return item - offset + (printmode ? -0.5 : 0);
						}, x1: scale.range()[0], x2: scale.range()[1]
					});

					todayline = selection.select('line.today');
					if (opt[0]) {
						if (todayline.empty()) {
							todayline = selection.append('line').classed('today', true);
						}
						var today = moment.utc().startOf('day');
						todayline.attrs({
							x1: scale(today), x2: scale(today), y1: 0, y2: height + adjustment + additionaloffset
						});
					} else {
						todayline.remove();
					}

					verticallines = selection.selectAll('line.vertical').data(showverticallines ? globaltickvalues : []);
					verticallines.exit().remove();

					var newverticallines = verticallines.enter()
						.append('line').classed('vertical', true).attrs({
							y1: 0, y2: height + adjustment + additionaloffset
						});

					var combinedverticallines = newverticallines.merge(verticallines);

					combinedverticallines.attrs({
						x1: function (item) {
							return scale(item);
						}, x2: function (item) {
							return scale(item);
						}, y1: 0, y2: height + adjustment + additionaloffset
					});
				};
				calendarlines_.scale = function (x) {
					if (!arguments.length) {
						return scale;
					}
					scale = x;
					return this;
				};
				calendarlines_.height = function (x) {
					if (!arguments.length) {
						return height;
					}
					height = x;
					return this;
				};
				calendarlines_.offset = function (x) {
					if (!arguments.length) {
						return additionaloffset;
					}
					additionaloffset = x;
					return this;
				};
				calendarlines_.tickvalues = function (x) {
					if (!arguments.length) {
						return globaltickvalues;
					}
					globaltickvalues = x;
					return this;
				};
				calendarlines_.showVerticalLines = function (x) {
					if (!arguments.length) {
						return showverticallines;
					}
					showverticallines = x;
					return this;
				};
				calendarlines_.showHorizontalLines = function (x) {
					if (!arguments.length) {
						return showhorizontallines;
					}
					showhorizontallines = x;
					return this;
				};
				calendarlines_.scrollOptimization = function (x) {
					if (!arguments.length) {
						return scroll;
					}
					scroll = x;
					return this;
				};
				calendarlines_.printmode = function (x) {
					if (!arguments.length) {
						return printmode;
					}
					printmode = x;
					return this;
				};
				calendarlines_.verticalIndex = function (x) {
					if (!arguments.length) {
						return scroll;
					}
					verticalIndex = x;
					makeLinedata();
					return this;
				};
				return calendarlines_;
			},

			locations: function locations() {
				var size = [700, 240], flattenedLocations = [], actualWidth = size[1], tickValues = [];
				var locations_ = function (selection) {
					flattenedLocations.length = 0;
					tickValues.length = 0;
					if (selection.datum().length === 0) {
						selection.remove();
						return;
					}

					var root = d3.hierarchy(selection.datum(), function (d) {
						return d.Locations;
					});

					root.sum(function (d) {
						return d.Locations.length === 0 ? d.Quantity : 0; // return zero for any node with children
					});

					var partitionmap = d3.partition() // partition
						.size(size);
					partitionmap(root);

					// Modify leave nodes to fill all horizontal space
					// Also fill map with y values
					var singlewidth = root.y1 - root.y0;
					// Calculate actual width
					actualWidth = singlewidth * root.height;
					root.descendants().forEach(function (node) {
						if (!node.children && node.depth < root.height) {
							node.y1 = node.y0 + (root.height - node.depth + 1) * singlewidth; // width in
						}
						node.y0 -= singlewidth;
						node.y1 -= singlewidth;
					});

					tickValues = _.uniq(_.map(root.descendants(), 'x0'));
					flattenedLocations = root.descendants().splice(1);

					var subselection = selection.selectAll('g').data(flattenedLocations);

					subselection.exit().remove();

					var newsubselection = subselection.enter().append('g');
					newsubselection.append('rect')
						.parent()
						.append('text')
						.classed('code', true)
						.attr('style', 'font-size:10px;fill:black;')
						.attr('text-anchor', 'left')
						.parent()
						.append('text')
						.classed('description', true)
						.attr('style', 'font-size:10px;fill:black;')
						.attr('text-anchor', 'left');
					var allsubselection = newsubselection.merge(subselection);

					// X and Y of treemap get swapped!!.
					allsubselection.each(function () {
						var g = d3.select(this);
						g.select('rect')
							.attr('fill', colorizeBar)
							.attr('x', function (d) {
								return _.round(d.y0, 2);
							})
							.attr('y', function (d) {
								return _.round(d.x0, 2);
							})
							.attr('width', function (d) {
								return _.round(d.y1 - d.y0, 2);
							})
							.attr('height', function (d) {
								return _.round(d.x1 - d.x0, 2);
							})
							.attr('style', function (d) {
								// There is a drawing bug if stroke-dasharray is not rounded to two digits
								return 'stroke:white;stroke-width:1px;stroke-dasharray:' + _.round(d.y1 - d.y0, 2) + 'px, ' + (_.round(d.x1 - d.x0, 2) * 2 + _.round(d.y1 - d.y0, 2)) + 'px';
							});
						g.select('text.code')
							.text(function (d) {
								return _.unescape(d.data.Code);
							})
							.attr('x', function (d) {
								return _.round(d.y0 + 5, 2);
							})
							.attr('y', function (d) {
								return _.round(d.x0 + 10, 2);
							});
						g.select('text.description')
							.text(function (d) {
								var desc = d.data.DescriptionInfo ? d.data.DescriptionInfo.Translated : d.data._description;
								/* jshint -W116 */ // here we WANT automatic type conversion
								if (desc !== d.data.Code) {
									return _.unescape(desc);
								}
							})
							.attr('x', function (d) {
								return _.round(d.y0 + 5, 2);
							})
							.attr('y', function (d) {
								return _.round(d.x0 + 21, 2);
							});
					});

					allsubselection.each(locationwrap);

					function locationwrap() {
						/* jshint -W040 */
						if (d3.select(this).select('rect').empty()) {
							return;
						}
						/* jshint -W040 */
						var width = d3.select(this).select('rect').attr('width') - 6;
						wrapSelection(d3.select(this).select('text.code'));
						wrapSelection(d3.select(this).select('text.description'));

						function wrapSelection(self) {
							var textLength = self.node().getComputedTextLength();
							var text = self.text();
							while (textLength > width && text.length > 0) {
								text = text.slice(0, -1);
								if (text.length !== 0) {
									self.text(text + '…');
								} else {
									self.text('');
								}
								textLength = self.node().getComputedTextLength();
							}
						}
					}

					function colorizeBar(item) {
						var lvl = item.depth - 2; // start level 2;
						var basecolor = 'hsl(205, 54%, ';
						var light = 59;
						var factor = 1 - (lvl / 10);
						basecolor += _.round(light / factor, 2) + '%)';
						return basecolor;
					}
				};
				// public properties and functions
				locations_.width = function (newwidth) {
					if (!arguments.length) {
						return size[1] / 1.5; // factor needed for constant discrepancy between internal size and width
					}
					if (newwidth < 80 || newwidth > 950) {
						return this;
					}

					size[1] = newwidth * 1.5; // factor needed for constant discrepancy between internal size and width
					return this;
				};
				locations_.actualWidth = function () {
					return actualWidth <= 0 ? 1 : actualWidth;
				};
				locations_.tickValues = function () {
					return tickValues;
				};
				locations_.height = function (newheight) {
					if (!arguments.length) {
						return size[0];
					}
					size[0] = newheight;
					return this;
				};
				locations_.getY = function (locationId) {
					var found = _.find(flattenedLocations, function (item) {
						return item.data.Id === locationId;
					});
					if (found) {
						return [found.x0, found.x1, found.x1 - found.x0];
					} else {
						return [0, 0, 0];
					}
				};

				return locations_;
			},

			activityarrows: function activityarrows() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), getY = function () {
						return [0, 50];
					}, criticalColor = '#FF0000', globalpoints = [], showCritical = false, showLocationConnections = false, showProgress = false,

					clickHandler = _.noop(), enter = _.noop(), exit = _.noop(), handledata = {
						id: -1, start: null, middle: null, end: null
					}, exceptionDays = [];

				var rline = d3.line()
					.x(function (d) {
						return d.x;
					})
					.y(function (d) {
						return d.y;
					});

				function getColor(d) {
					return (showCritical && d.IsCritical) ? criticalColor : d._color;
				}

				function getStart(d) {
					var result = (d.Id === handledata.id) ? handledata.start : d.PlannedStart;
					return result;
				}

				function getEnd(d) {
					var result = (d.Id === handledata.id) ? handledata.end : d.PlannedFinish;
					return result;
				}

				function generatePath(d) {
					var points = [];
					var start = getStart(d), end = getEnd(d);
					var result = getY(d.LocationFk);
					// startpoint is easy
					var y1 = (d.ActivityPresentationFk === 2) ? result[0] : result[1]; // asc or desc
					var y2 = (d.ActivityPresentationFk === 2) ? result[1] : result[0]; // asc or desc
					var startpoint = {
						x: scale(start), y: y1
					};
					// to calculate endpoint we need to subtract all exception days
					var exceptiondaysinrange = exceptionDays.filter(function (day) {
						return day.ExceptDate >= start && day.ExceptDate <= end;
					});
					var noOfExceptiondays = exceptiondaysinrange.length;
					var netend = end.clone().add(-noOfExceptiondays, 'd');
					var endpointnet = {
						x: scale(netend), y: y2
					};
					var m = vector.slope(startpoint, endpointnet, true);
					var b = vector.base(startpoint, endpointnet, m);

					// now we cluster the exception days with start/end
					var clusteredexeptiondays = buildHolidays(exceptiondaysinrange);
					points.push(startpoint);
					var globalpoint = {};
					globalpoint.x1 = startpoint.x;
					globalpoint.y1 = startpoint.y;
					clusteredexeptiondays.forEach(function (holiday) {
						var x = scale(holiday.start);
						var y = m * x + b;
						y = restrictY(y);
						var firstpoint = {
							x: x, y: y
						};
						var secondpoint = {
							x: scale(holiday.end), y: y
						};
						points.push(firstpoint);
						points.push(secondpoint);
					});
					var endpoint = {
						x: scale(end), y: y2
					};
					points.push(endpoint);
					globalpoint.x2 = endpoint.x;
					globalpoint.y2 = endpoint.y;
					globalpoint.parent = d.ParentActivityFk;
					globalpoint.color = d._color; // don't use getColor(d) because we don't show critical path here
					// globalpoint.code = d.Code; // Just for debugging
					globalpoints.push(globalpoint);

					return rline(points);

					function restrictY(y) {
						if (y1 < y2) {
							y = y > y2 ? y2 : y;
							y = y < y1 ? y1 : y;
						} else if (y1 > y2) {
							y = y > y1 ? y1 : y;
							y = y < y2 ? y2 : y;
						} else { // they are the same
							y = y1;
						}
						return y;
					}
				}

				function buildHolidays(rawdates) {
					var holidays = [];
					var dates = _.map(_.sortBy(rawdates, 'ExceptDate'), 'ExceptDate');
					var holidaycounter = -1;
					dates.forEach(function (date, i, dates) {
						if (!dates[i - 1] || date - dates[i - 1] > moment.duration(1, 'd')) {
							holidays.push({
								start: date, end: date
							});
							holidaycounter++;
						} else {
							holidays[holidaycounter].end = date;
						}
					});
					return holidays;
				}

				var activityarrows_ = function (selection) {
					var areagroup = selection.select('g.areas');
					if (areagroup.empty()) {
						selection.append('g').classed('areas', true);
						areagroup = selection.select('g.areas');
					}

					var groups = selection.selectAll('g.activitygroup')
						.data(selection.datum());
					var newgroups = groups.enter().append('g').classed('activitygroup', true);
					var allgroups = newgroups.merge(groups);
					groups.exit().remove();

					var areagroups = areagroup.selectAll('g.area')
						.data(selection.datum());
					var newareagroups = areagroups.enter().append('g').classed('area', true);
					var allareagroups = newareagroups.merge(areagroups);
					areagroups.exit().remove();

					var areas = allareagroups.selectAll('rect').data(function (e) {
						var domain = scale.extendeddomain();
						return e.filteredActivities.filter(function (d) {
							return d.ActivityPresentationFk === 3 && /* only deal with areas */
								d.PlannedFinish > domain[0] && d.PlannedStart < domain[1];
						});
					}, itemId);

					areas.exit().on('click', null).on('mouseover', null).on('mouseout', null).remove();

					// new activities
					var newareas = areas.enter().append('rect')
						.attr('opacity', 0.7)
						.on('click', clickHandler)
						.on('mouseover', enter).on('mouseout', exit);
					var allareas = newareas.merge(areas);

					allareas.each(function (d) {
						var area = d3.select(this);
						var result = arrowAttrs(d);
						area.attrs({
							x: result.x1, y: result.y2, width: result.x2 - result.x1, height: result.y1 - result.y2, fill: getColor(d)
						});
					});

					var arrows = allgroups.selectAll('path.base').data(function (e) {
						var domain = scale.extendeddomain();
						globalpoints.length = 0;
						return e.filteredActivities.filter(function (d) {
							return d.ActivityPresentationFk !== 3 && d.PlannedFinish > domain[0] && d.PlannedStart < domain[1];
						}); // filter out areas... hidden items are already filtered at service level
					}, itemId);

					arrows.exit().remove();

					// new activities
					var newarrows = arrows.enter().append('path')
						.classed('base', true);
					var allarrows = newarrows.merge(arrows);
					globalpoints.length = 0;
					allarrows.each(function (d) {
						var arrow = d3.select(this);
						arrow.attr('d', generatePath(d));
						// arrow.attr(arrowAttrs(d));
						arrow.classed('critical', function (d) {
							return showCritical && d.IsCritical;
						});
						arrow.attr('stroke', getColor(d));
					});
					globalpoints = _.orderBy(globalpoints, ['x2', 'x1', 'y2', 'y1'], ['desc', 'asc', 'asc', 'asc']);
					var grouped = _.groupBy(globalpoints, 'parent');

					function generateD(pointarray) {
						var path = '';

						for (var i = 0; i < pointarray.length; i += 1) {
							if (!_.isUndefined(pointarray[i + 1])) {
								path += ' M ' + pointarray[i].x1 + ', ' + pointarray[i].y1;
								path += ' L ' + pointarray[i].x1 + ', ' + pointarray[i + 1].y2;
								path += ' L ' + pointarray[i + 1].x2 + ', ' + pointarray[i + 1].y2;
							}
						}
						return path;
					}

					selection.selectAll('path.locationgap').remove();
					if (showLocationConnections) {
						_.forEach(grouped, function (group) {
							selection.append('path').classed('locationgap', true).style('fill', 'none').style('stroke', group[0].color).style('stroke-dasharray', '8 2 4 2')
								.attr('d', generateD(group));
						});
					}

					function arrowAttrs(d) {
						var result = getY(d.LocationFk);
						var y1 = (d.ActivityPresentationFk === 2) ? result[0] : result[1]; // ascending or descending
						var y2 = (d.ActivityPresentationFk === 2) ? result[1] : result[0]; // ascending or descending
						return {
							x1: scale(getStart(d)), y1: y1, x2: scale(getEnd(d)), y2: y2
						};
					}

					var progressarrows = allgroups.selectAll('line.progress').data(function (e) {
						var domain = scale.extendeddomain();
						return showProgress ? e.filteredActivities.filter(function (item) {
							return item.PercentageCompletion > 0 && item.PlannedFinish > domain[0] && item.PlannedStart < domain[1];
						}) : [];
					}, itemId);
					progressarrows.exit().remove();
					var newprogressarrows = progressarrows.enter().append('line').classed('progress', true);
					newprogressarrows.attr('stroke', 'orange').attr('stroke-dasharray', '5, 1');
					var allprogressarrows = newprogressarrows.merge(progressarrows);

					// some vector calculation

					allprogressarrows.each(function (d) {
						var currentarrow = d3.select(this);
						var result = getY(d.LocationFk);
						var p1 = {
							x: scale(d.PlannedStart), y: (d.ActivityPresentationFk === 2) ? result[0] : result[1]
						};
						var p2 = {
							x: scale(d.PlannedFinish), y: (d.ActivityPresentationFk === 2) ? result[1] : result[0]
						};
						var p2line = secondPoint(p1, p2, d);
						currentarrow
							.attr('x1', p1.x)
							.attr('y1', p1.y)
							.attr('x2', p2line.x)
							.attr('y2', p2line.y);
					});

					// clickarrows. clickarrows are fat invisible lines with clicktargets. not needed for printing or areas
					var clickarrows = allgroups.selectAll('path.click').data(function (e) {
						var domain = scale.extendeddomain();
						return e.filteredActivities.filter(function (d) {
							return d.ActivityPresentationFk !== 3 && d.PlannedFinish > domain[0] && d.PlannedStart < domain[1];
						}); // filter out areas... hidden items are already filtered at service level
					}, itemId);

					clickarrows.exit().on('click', null).on('mouseover', null).on('mouseout', null).remove();

					// new activities
					var newclickarrows = clickarrows.enter().append('path')
						.classed('click', true)
						.on('click', clickHandler)
						.on('mouseover', enter).on('mouseout', exit);
					var allclickarrows = newclickarrows.merge(clickarrows);

					allclickarrows.each(function (d) {
						var arrow = d3.select(this);
						arrow.attr('d', generatePath(d));
					});

					function secondPoint(p1, p2, d) {
						var factor = d.PercentageCompletion, factordate = d.LastProgressDate;
						if (validDate(factordate) && factordate > d.PlannedStart) {
							var result = getY(d.LocationFk);
							var ystart = (d.ActivityPresentationFk === 2) ? result[0] : result[1];
							var yend = (d.ActivityPresentationFk === 2) ? result[1] : result[0];
							var newy = (yend - ystart) * (factor / 100) + ystart;
							return {
								x: scale(factordate), y: newy
							};
						} else {
							var myvector = vector.sub(p1, p2);
							var distance = vector.length(myvector);
							var unitv = vector.unitVector(myvector);
							return vector.add(vector.mul(unitv, (distance * factor / 100)), p1);
						}
					}
				};

				// public properties and functions
				activityarrows_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newscale;
					return this;
				};
				activityarrows_.getY = function (newgetY) {
					if (!arguments.length) {
						return getY;
					}
					getY = newgetY;
					return this;
				};
				activityarrows_.showCritical = function (newshowCritical) {
					if (!arguments.length) {
						return showCritical;
					}
					showCritical = newshowCritical;
					return this;
				};
				activityarrows_.showProgress = function (newshowProgress) {
					if (!arguments.length) {
						return showProgress;
					}
					showProgress = newshowProgress;
					return this;
				};
				activityarrows_.exceptionDays = function (newExceptionDays) {
					if (!arguments.length) {
						return exceptionDays;
					}
					exceptionDays = newExceptionDays;
					return this;
				};
				activityarrows_.clickHandler = function (newClickHandler) {
					if (!arguments.length) {
						return clickHandler;
					}
					clickHandler = newClickHandler;
					return this;
				};
				activityarrows_.enter = function (newEnter) {
					if (!arguments.length) {
						return enter;
					}
					enter = newEnter;
					return this;
				};
				activityarrows_.exit = function (newExit) {
					if (!arguments.length) {
						return exit;
					}
					exit = newExit;
					return this;
				};
				activityarrows_.handleData = function (newHandledata) {
					if (!arguments.length) {
						return handledata;
					}
					handledata = newHandledata;
					return this;
				};
				activityarrows_.showLocationConnections = function (x) {
					if (!arguments.length) {
						return showLocationConnections;
					}
					showLocationConnections = x;
					return this;
				};

				return activityarrows_;
			},

			activitylabels: function activitylabels() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), getY = function () {
					return [0, 50];
				};

				var activitylabels_ = function (selection) {
					var domain = scale.extendeddomain();
					var texts = selection.selectAll('g.label').data(selection.datum().filter(function (item) {
						return item.Code && item.PlannedFinish > domain[0] && item.PlannedStart < domain[1];
					}));
					texts.exit().remove();
					var newtexts = texts.enter().append('g').classed('label', true);
					newtexts.append('line').attr('stroke', 'none').attr('stroke-width', 0).attr('opacity', 0).parent().append('text');
					var alltexts = newtexts.merge(texts);

					alltexts.each(function (d) {
						var text = d3.select(this);
						var result = getY(d.LocationFk);
						var orient = d.ActivityPresentationFk === 2 ? '+' : '-';
						var y1 = (d.ActivityPresentationFk === 2) ? result[0] : result[1]; // ascending or descending};
						var y2 = (d.ActivityPresentationFk === 2) ? result[1] : result[0]; // ascending or descending};
						var start = {
							x: scale(d.PlannedStart), y: y1
						};
						var end = {
							x: scale(d.PlannedFinish), y: y2
						};
						var middlepoint = vector.middlepoint(start, end);
						text.select('line') /* this line is just to align text. it is not visible */
							.attr('x1', start.x)
							.attr('y1', start.y)
							.attr('x2', end.x)
							.attr('y2', end.y);
						text.select('text')
							.attr('x', function (d) {
								return d.Alignment === 2 ? start.x : d.Alignment === 4 ? end.x : middlepoint.x;
							}).attr('y', function (d) {
							return d.Alignment === 2 ? start.y - 5 : d.Alignment === 4 ? end.y - 5 : middlepoint.y - 5;
						})
							.attr('text-anchor', function (d) {
								return d.Alignment === 2 ? 'start' : d.Alignment === 4 ? 'end' : 'middle';
							})
							.attr('transform', function () {
								if (d.Alignment === 2) {
									return 'rotate(' + orient + vector.slope(start, end) + ' ' + start.x + ', ' + start.y + ')';
								} else if (d.Alignment === 4) {
									return 'rotate(' + orient + vector.slope(start, end) + ' ' + end.x + ', ' + end.y + ')';
								} else {
									return 'rotate(' + orient + vector.slope(start, end) + ' ' + middlepoint.x + ', ' + middlepoint.y + ')';
								}
							})
							.text(function (d) {
								return _.unescape(d.Code);
							});
					});
				};
				// public properties and functions
				activitylabels_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newscale;
					return this;
				};
				activitylabels_.getY = function (newgetY) {
					if (!arguments.length) {
						return getY;
					}
					getY = newgetY;
					return this;
				};

				return activitylabels_;
			},

			timelines: function timelines() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), height = 500, offset = 0, scroll = false, printadjustment = -13; // -11 if in print mode
				var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

				function getColor(timeline) {
					if (!_.isNull(timeline.Color)) {
						return decimalToHex(timeline.Color, 6);
					} else {
						return colorscale(timeline.Date);
					}
				}

				var timelines_ = function (selection) {
					var modifiedoffset = scroll ? offset - 1000 : offset;
					var modifiedheight = scroll ? height + 2000 : height + 50;
					var todaylines = selection.selectAll('g.timeline').data(selection.datum()[0].filter(function (item) {
						return scale(item.Date) > scale.range()[0] - 500 && scale(item.Date) < scale.range()[1] + 500;
					}));
					todaylines.exit().remove();
					var newtodaylines = todaylines.enter().append('g').classed('timeline', true);
					newtodaylines.append('line').parent().append('g').append('rect').parent().append('text');
					var alltodaylines = newtodaylines.merge(todaylines);
					// update existing timelines
					alltodaylines.each(function (d) {
						var g = d3.select(this); // the current g group
						var xvalue = getXValue(d);
						g.select('line')
							.attrs({
								x1: xvalue, y1: 0, x2: xvalue, y2: modifiedheight
							})
							.styles({
								stroke: getColor(d), 'stroke-width': getStrokeWidth(d), 'opacity': d.EndDate ? '0.5' : '1.0'
							});
						g.select('g text')
							.attrs({
								x: xvalue, y: 4
							})
							.text(function (d) {
								return _.unescape(d.Text);
							})
							.style('alignment-baseline', 'middle', 'font-size', '8px');

						var bboxouter = g.select('g text');
						if (!bboxouter.empty()) {
							var bbox = bboxouter.node().getBBox();
							g.select('g rect')
								.attrs({
									x: bbox.x - 5, y: bbox.y - 2, width: bbox.width + 10, height: bbox.height + 4, rx: 5, ry: 5, 'opacity': d.EndDate ? '0' : '1'
								})
								.styles({
									fill: getColor(d), 'shape-rendering': 'auto'
								});
							g.select('g').attr('transform', 'rotate (270 ' + (bbox.x) + ' ' + (bbox.y) + ') translate(' + (-bbox.width + printadjustment) + ' ' + (-bbox.height / 2) + ')');
						}
					});

					function getStrokeWidth(d) {
						if (!d.EndDate) {
							return '2.5px';
						}

						var result = Math.abs(scale(d.EndDate) - scale(d.Date));
						return result + 'px';
					}

					function getXValue(d) {
						if (!d.EndDate) {
							return scale(d.Date);
						}

						var a = scale(d.Date);
						var b = scale(d.EndDate);
						return a + 0.5 * (b - a);
					}

					selection.selectAll('g.timeline line').attr('transform', 'translate(0,' + modifiedoffset + ')');
				};
				timelines_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newscale;
					return this;
				};
				timelines_.height = function (newheight) {
					if (!arguments.length) {
						return height;
					}
					height = newheight;
					return this;
				};
				timelines_.offset = function (newOffset) {
					if (!arguments.length) {
						return offset;
					}
					offset = newOffset;
					return this;
				};
				timelines_.printmode = function (x) {
					if (!arguments.length) {
						return printadjustment !== -13;
					}
					printadjustment = x ? -11 : -13;
					return this;
				};
				return timelines_;
			},

			progresslines: function progresslines() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), height = 500, offset = 0, scroll = false, verticalIndex = new Map(), progressdates = new Map(), colorscale = d3.scaleOrdinal(d3.schemeCategory10), rline = d3.line()
					.x(function (d) {
						return d.x;
					})
					.y(function (d) {
						return d.y;
					})
					.curve(d3.curveStepBefore), printmode = false;

				function generateProgresspoints(dateparam) {
					var date = dateparam.date;
					var modifiedoffset = scroll ? offset - 1000 : offset;
					var modifiedheight = scroll ? height + 2000 : height;
					var progressdate;
					// add start point
					var points = [{
						x: scale(date), y: modifiedoffset
					}]; // start point
					verticalIndex.forEach(function (v, k) { // points in between
						progressdate = getProgressDate(date, k); // getProgressdate should return date if no match
						if (progressdate) {
							points.push({
								x: scale(progressdate.stateDate), y: v
							});
						}
					});

					points = _.sortBy(points, 'y');

					// move first two points a little
					points[0].y = points[0].y += 1;
					if (points[1]) {
						points[1].y = points[1].y += 1;
					}

					// add two endpoints
					var lastelement = points[points.length - 1].y;
					points.push({
						x: scale(date), y: lastelement + (printmode ? defaultrowheightprint : defaultrowheight)
					});
					points.push({
						x: scale(date), y: modifiedheight
					});
					return rline(points);
				}

				function getProgressDate(linedate, activityId) {
					var datekey, result1;
					if (moment.isMoment(linedate)) {
						datekey = linedate.toISOString();
					}
					datekey = datekey.substr(0, 10);
					result1 = progressdates.get(datekey);
					if (result1) {
						return result1.get(activityId);
					} else {
						return undefined; // to prevent jshint warning
					}
				}

				function progressLineInView(item) {
					if (printmode) {
						return true;
					}
					var date = item.date;
					var result = false;
					var domain = scale.extendeddomain();
					verticalIndex.forEach(function (v, k) { // points in between
						var progressdate = getProgressDate(date, k); // getProgressdate should return date if no match
						if (progressdate) {
							if (progressdate.stateDate >= domain[0] && progressdate.stateDate <= domain[1]) {
								result = true;
							}
						}
					});
					return result;
				}

				var progresslines_ = function (selection) {
					var progresslines;
					progresslines = selection.selectAll('path.progressline').data(selection.datum().filter(progressLineInView));
					progresslines.exit().remove(); // old progresslines
					var newprogresslines = progresslines.enter() // new progresslines
						.append('path').classed('progressline', true);
					var allprogresslines = newprogresslines.merge(progresslines);

					// update existing progresslines
					allprogresslines
						.attr('d', generateProgresspoints)
						.style('stroke', function (d) {
							return d.color || colorscale(d.date);
						});
				};
				// public properties and functions
				progresslines_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newscale;
					return this;
				};
				progresslines_.height = function (newheight) {
					if (!arguments.length) {
						return height;
					}
					height = newheight;
					return this;
				};
				progresslines_.offset = function (newOffset) {
					if (!arguments.length) {
						return offset;
					}
					offset = newOffset;
					return this;
				};
				progresslines_.progressDates = function (newProgressDates) {
					if (!arguments.length) {
						return progressdates;
					}
					progressdates = newProgressDates;
					return this;
				};
				progresslines_.verticalIndex = function (newVerticalIndex) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = newVerticalIndex;
					return this;
				};
				progresslines_.scrollOptimization = function (newscrollOptimization) {
					if (!arguments.length) {
						return scroll;
					}
					scroll = newscrollOptimization;
					return this;
				};
				progresslines_.printmode = function (x) {
					if (!arguments.length) {
						return printmode;
					}
					printmode = x;
					return this;
				};

				return progresslines_;
			},

			// handles are drawn above activity arrows. it's data source
			// is the selecteditem in union with the currently displayed activities. dragging results in triggering the async validation service. resulting new data is displayed via the normal update mechanism
			/* screen only */
			handles: function handles() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), originalscale = d3.scaleUtc(), getY = function () {
					return [0, 50];
				}, onMoving = _.noop(), onMovedMin = _.noop(), onMovedMed = _.noop(), onMovedMax = _.noop(), onMovedMilestone = _.noop(), radius = 5, offset = 0, handledata = {
					id: -1, start: null, middle: null, end: null
				}, middleadjust = [0, 1], lobMode = true, page1, timer = d3.timer(_.noop);

				function start() {
					d3.event.sourceEvent.stopPropagation(); // silence other listeners
				}

				function findMiddle(d) {
					var yStart, yEnd;
					if (lobMode) {
						var result = getY(d.LocationFk);
						yStart = (d.ActivityPresentationFk === 2) ? result[0] : result[1]; // ascending or descending
						yEnd = (d.ActivityPresentationFk === 2) ? result[1] : result[0]; // ascending or descending
					} else {
						var adjustwidth = middleadjust[1] - middleadjust[0];
						adjustwidth = adjustwidth ? adjustwidth : 1;
						var adjust = getY.get(d.Id) + (adjustwidth * 0.5 + middleadjust[0]) * defaultrowheight;
						yStart = adjust;
						yEnd = adjust;
					}

					var plannedStart = scale(handledata.start || d.PlannedStart);
					var plannedFinish = scale(handledata.end || d.PlannedFinish);
					if (d.ActivityTypeFk === 3 && d.PlannedDuration === 0) {
						var customend = handledata.end || d.PlannedFinish;
						plannedStart = scale(customend.endOf('day'));
					}
					var start = {
						x: plannedStart, y: yStart
					};
					var end = {
						x: plannedFinish, y: yEnd
					};
					var middle = vector.middlepoint(start, end);
					return {
						plannedStart: plannedStart, plannedFinish: plannedFinish, yStart: yStart, yEnd: yEnd, middle: middle
					};
				}

				var dragMin = d3.drag().on('start', start).on('end', function (d) {
					timer.stop();
					// check for minimum move by checking difference between _visualStart and PlannedStart
					var diff = scale(d.PlannedStart) - scale(handledata.start);
					if (diff > 3 || diff < -3) {
						onMovedMin(d, handledata);
					}
				})
					.on('drag', function (d) {
						var newx = d3.event.x;
						var stop = scale(handledata.end || d.PlannedFinish);
						newx = newx > stop ? stop : newx; // x-limits
						if (newx < scale.range()[0] + radius) {
							timer.restart(autoScrollDown, 500, 1000);
						} else {
							timer.stop();
						}
						newx = newx < scale.range()[0] + radius ? scale.range()[0] + radius : newx; // x-limits
						adjustCircle(scale);

						function autoScrollDown() {
							var transform = d3.zoomTransform(page1.node());
							var newscale = transform.rescaleX(scale);
							transform.x += 5;
							adjustCircle(newscale, transform);
						}

						function adjustCircle(myscale, transform) {
							var newscale;
							if (transform) {
								newscale = transform.rescaleX(originalscale);
							} else {
								newscale = scale;
							}
							handledata.start = new moment.utc(newscale.extendedinvert(newx));
							onMoving(transform); // execute optional onMoving function. For live updates this will call draw
						}
					});
				var dragMed = d3.drag().on('start', start).on('end', function (d) {
					timer.stop();
					// check for minimum move by checking difference between _visualStart and PlannedStart
					var diff = scale(d.PlannedStart) - scale(handledata.start);
					if (diff > 3 || diff < -3) {
						onMovedMed(d, handledata);
					}
				})
					.on('drag', function (d) {
						var newx = d3.event.x;
						if (newx > scale.range()[1] - radius) {
							timer.restart(autoScrollUp, 500, 1000);
						} else if (newx < scale.range()[0]) {
							timer.restart(autoScrollDown, 500, 1000);
						} else {
							timer.stop();
						}
						newx = newx < scale.range()[0] + radius ? scale.range()[0] + radius : newx; // x-limits
						newx = newx > scale.range()[1] - radius ? scale.range()[1] - radius : newx;
						adjustCircle(scale);

						function autoScrollUp() {
							return autoScroll(true);
						}

						function autoScrollDown() {
							return autoScroll(false);
						}

						function autoScroll(direction) {
							var transform = d3.zoomTransform(page1.node());
							var difference = direction ? -5 : 5;
							transform.x += difference;
							var time1 = scale.extendedinvert(0);
							var time2 = scale.extendedinvert(difference);
							var timediff = time1.diff(time2);
							handledata.start.add(timediff, 'ms');
							handledata.end.add(timediff, 'ms');
							onMoving(transform); // execute optional onMoving function. For live updates this will call draw
						}

						function adjustCircle(myscale, transform) {
							var newscale = transform ? transform.rescaleX(originalscale) : myscale;
							var __ret = findMiddle(d);
							var middle = __ret.middle;
							var diff = newx - middle.x;
							var oldStart = newscale(handledata.start || d.PlannedStart);
							oldStart += diff;
							var oldEnd = newscale(handledata.end || d.PlannedFinish);
							oldEnd += diff;
							handledata.start = new moment.utc(newscale.extendedinvert(oldStart));
							handledata.end = new moment.utc(newscale.extendedinvert(oldEnd));
							onMoving(transform); // execute optional onMoving function. For live updates this will call draw
						}
					});
				var dragMax = d3.drag().on('start', start).on('end', function (d) {
					timer.stop();
					// check for minimum move by checking difference between _visualEnd and PlannedFinish
					var diff = scale(d.PlannedFinish) - scale(handledata.end);
					if (diff > 3 || diff < -3) {
						onMovedMax(d, handledata);
					}
				})
					.on('drag', draggingMax);

				function draggingMax(d) {
					var newx = d3.event.x;
					var start = scale(handledata.start || d.PlannedStart);
					newx = newx < start ? start : newx; // x-limits
					if (newx > scale.range()[1] - radius) {
						timer.restart(autoScrollUp, 500, 1000);
					} else {
						timer.stop();
					}
					newx = newx > scale.range()[1] - radius ? scale.range()[1] - radius : newx;
					adjustCircle(scale);

					function autoScrollUp() {
						var transform = d3.zoomTransform(page1.node());
						transform.x += -5;
						var newscale = transform.rescaleX(scale);
						adjustCircle(newscale, transform);
					}

					function adjustCircle(myscale, transform) {
						if (transform) {
							var newscale2 = transform.rescaleX(originalscale);
							handledata.end = new moment(newscale2.extendedinvert(myscale.range()[1]));
						} else {
							handledata.end = new moment.utc(myscale.extendedinvert(newx));
						}

						onMoving(transform); // execute optional onMoving function. For live updates this will call draw
					}
				}

				var dragMilestone = d3.drag()
					.on('start', start)
					.on('drag', function (d) {
						var newx = d3.event.x;
						if (newx > scale.range()[1] - radius) {
							timer.restart(autoScrollUp, 500, 1000);
						} else if (newx < scale.range()[0] + radius) {
							timer.restart(autoScrollDown, 500, 1000);
						} else {
							timer.stop();
						}
						newx = newx < scale.range()[0] + radius ? scale.range()[0] + radius : newx; // x-limits
						newx = newx > scale.range()[1] - radius ? scale.range()[1] - radius : newx;
						adjustCircle(scale);

						function autoScrollUp() {
							return autoScroll(true);
						}

						function autoScrollDown() {
							return autoScroll(false);
						}

						function autoScroll(direction) {
							var transform = d3.zoomTransform(page1.node());
							var difference = direction ? -5 : 5;
							transform.x += difference;
							var time1 = scale.extendedinvert(0);
							var time2 = scale.extendedinvert(difference);
							var timediff = time1.diff(time2);
							handledata.start.add(timediff, 'ms');
							handledata.end.add(timediff, 'ms');
							onMoving(transform); // execute optional onMoving function. For live updates this will call draw
						}

						function adjustCircle(myscale, transform) {
							var newscale = transform ? transform.rescaleX(originalscale) : myscale;
							var __ret = findMiddle(d);
							var diff = __ret.plannedFinish - __ret.plannedStart;
							handledata.start = new moment.utc(newscale.extendedinvert(newx - diff));
							handledata.end = new moment.utc(newscale.extendedinvert(newx));
							onMoving(transform); // execute optional onMoving function. For live updates this will call draw
						}
					})
					.on('end', function (d) {
						timer.stop();
						// check for minimum move by checking difference between _visualEnd and PlannedFinish
						var diff = scale(d.PlannedFinish) - scale(handledata.end);
						if (diff > 3 || diff < -3) {
							onMovedMilestone(d, handledata);
						}
					});

				var handles_ = function (selection) {
					var data = selection.datum().filter(function (item) {
						if (lobMode) {
							return item;
						} else {
							return !handledata.relationshipmode && getY.has(item.Id);
						}
					});
					var handlegroup = selection.selectAll('g.handle').data(data.filter(function (item) {
						return !handledata.readonlyStart && (item.ActivityTypeFk === 1 || item.ActivityTypeFk === 5 || ((item.ActivityTypeFk === 4 && item.Predecessor.length === 0 && item.Successor.length === 0)) || lobMode); // filter type only in gantt mode
					}), itemId);
					handlegroup.exit().remove(); // old handles
					var newhandlegroup = handlegroup.enter() // new handles
						.append('g').classed('handle', true);
					newhandlegroup.append('circle').classed('min', true).attr('r', radius).call(dragMin)
						.parent().append('circle').classed('max', true).attr('r', radius).call(dragMax)
						.parent().append('circle').classed('med', true).attr('r', radius * 1.5).call(dragMed);
					var allhandlegroup = newhandlegroup.merge(handlegroup);

					// update existing handles
					allhandlegroup.each(function (d) {
						var g = d3.select(this);
						var __ret = findMiddle(d);
						var plannedStart = __ret.plannedStart;
						var plannedFinish = __ret.plannedFinish;
						var yStart = __ret.yStart;
						var yEnd = __ret.yEnd;
						var middle = __ret.middle;
						g.select('circle.min')
							.attr('cx', plannedStart)
							.attr('cy', yStart);
						g.select('circle.med')
							.attr('cx', middle.x)
							.attr('cy', middle.y);
						g.select('circle.max')
							.attr('cx', plannedFinish)
							.attr('cy', yEnd);
					});

					var starthandles = selection.selectAll('g.starthandle').data(data.filter(function (item) {
						return !handledata.readonlyStart && handledata.readonlyFinish && (item.ActivityTypeFk === 1 || lobMode); // filter type only in gantt mode;
					}), itemId);
					starthandles.exit().remove(); // old starthandles
					var newstarthandles = starthandles.enter().append('g').classed('starthandle', true);
					newstarthandles.append('circle').classed('min', true).attr('r', radius).call(dragMin);
					var allstarthandles = newstarthandles.merge(starthandles);

					// update existing handles
					allstarthandles.each(function (d) {
						var g = d3.select(this);
						var __ret = findMiddle(d);
						var plannedStart = __ret.plannedStart;
						var yStart = __ret.yStart;
						g.select('circle.min')
							.attr('cx', plannedStart)
							.attr('cy', yStart);
					});

					var finishhandles = selection.selectAll('g.finishhandle').data(data.filter(function (item) {
						return handledata.readonlyStart && !handledata.readonlyFinish && (item.ActivityTypeFk === 1 || lobMode); // filter type only in gantt mode;
					}), itemId);
					finishhandles.exit().remove(); // old finishhandles
					var newfinishhandles = finishhandles.enter().append('g').classed('finishhandle', true);
					newfinishhandles.append('circle').classed('max', true).attr('r', radius).call(dragMax);
					var allfinishhandles = newfinishhandles.merge(finishhandles);

					// update existing handles
					allfinishhandles.each(function (d) {
						var g = d3.select(this);
						var __ret = findMiddle(d);
						var plannedFinish = __ret.plannedFinish;
						var yEnd = __ret.yEnd;
						g.select('circle.max')
							.attr('cx', plannedFinish)
							.attr('cy', yEnd);
					});

					var milestonehandles = selection.selectAll('g.milestonehandle').data(data.filter(function (item) {
						return (!lobMode && item.ActivityTypeFk === 3); // filter type only in gantt mode;
					}), itemId);
					milestonehandles.exit().remove(); // old milestonehandles
					var newmilestonehandles = milestonehandles.enter().append('g').classed('milestonehandle', true);
					newmilestonehandles.append('circle').classed('milestone', true).attr('r', radius).call(dragMilestone);
					var allmilestonehandles = newmilestonehandles.merge(milestonehandles);

					// update existing handles
					allmilestonehandles.each(function (d) {
						var g = d3.select(this);
						var __ret = findMiddle(d);
						var plannedFinish = __ret.plannedFinish;
						var yEnd = __ret.yEnd;
						g.select('circle.milestone')
							.attr('cx', plannedFinish)
							.attr('cy', yEnd);
					});
					selection.attr('transform', 'translate(0,' + (-offset) + ')');
				};

				// public properties and functions
				handles_.scale = function (x) {
					if (!arguments.length) {
						return scale;
					}
					scale = x;
					return this;
				};
				handles_.originalscale = function (x) {
					if (!arguments.length) {
						return originalscale;
					}
					originalscale = x;
					return this;
				};
				handles_.getY = function (newgetY) {
					if (!arguments.length) {
						return getY;
					}
					getY = newgetY;
					return this;
				};
				handles_.lobMode = function (newLobMode) {
					if (!arguments.length) {
						return lobMode;
					}
					lobMode = newLobMode;
					return this;
				};
				handles_.radius = function (newradius) {
					if (!arguments.length) {
						return radius;
					}
					radius = newradius;
					return this;
				};
				handles_.onMoving = function (newOnMoving) {
					if (!arguments.length) {
						return onMoving;
					}
					onMoving = newOnMoving;
					return this;
				};
				handles_.onMovedMin = function (newOnMovedMin) {
					if (!arguments.length) {
						return onMovedMin;
					}
					onMovedMin = newOnMovedMin;
					return this;
				};
				handles_.onMovedMed = function (newOnMovedMed) {
					if (!arguments.length) {
						return onMovedMed;
					}
					onMovedMed = newOnMovedMed;
					return this;
				};
				handles_.onMovedMax = function (newOnMovedMax) {
					if (!arguments.length) {
						return onMovedMax;
					}
					onMovedMax = newOnMovedMax;
					return this;
				};
				handles_.onMovedMilestone = function (x) {
					if (!arguments.length) {
						return onMovedMilestone;
					}
					onMovedMilestone = x;
					return this;
				};
				handles_.handleData = function (newHandledata) {
					if (!arguments.length) {
						return handledata;
					}
					handledata = newHandledata;
					return this;
				};
				handles_.middle = function (x) {
					if (!arguments.length) {
						return middleadjust;
					}
					middleadjust = x;
					return this;
				};
				handles_.offset = function (newOffset) {
					if (!arguments.length) {
						return offset;
					}
					offset = newOffset;
					return this;
				};
				handles_.page1 = function (x) {
					if (!arguments.length) {
						return page1;
					}
					page1 = x;
					return this;
				};
				return handles_;
			},

			/* screen only */
			relationshiphandles: function relationshiphandles() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), getY = function () {
					return [0, 50];
				}, onMoving = function () {
				}, onMovedMin = _.noop(), onMovedMed = _.noop(), onMovedMax = _.noop(), onDetailIconClicked = _.noop(), handledata = {
					id: -1, start: null, middle: null, end: null, leftend: true
				};

				var relationshiphandles_ = function (selection) {
					var data = selection.datum().filter(function (item) {
						return handledata[0].relationshipmode && getY.has(item.Id) & item.ActivityTypeFk !== 5;
					});

					var handlegroup = selection.selectAll('g.relationshiphandle').data(data, itemId);
					handlegroup.exit().remove(); // old handles
					var newhandlegroup = handlegroup.enter().append('g').classed('relationshiphandle', true);
					newhandlegroup.append('path')
						.parent()
						.append('use').classed('detailicon', true)
						.attr('href', '#edit-activity-icon')
						.attr('x', function (d) {
							var left = scale(d.PlannedStart) - 1;
							var right = scale(d.PlannedFinish) + 1;
							var middle = left + (right - left) / 2;
							return middle;
						})
						.attr('y', function (d) {
							return getY.get(d.Id) + 4;
						})
						.on('click', onDetailIconClicked);
					var allhandlegroup = newhandlegroup.merge(handlegroup);

					// update existing handles
					allhandlegroup.each(function (d) {
						var g = d3.select(this);
						var left = scale(d.PlannedStart) - 1;
						var right = scale(d.PlannedFinish) + 1;
						var y = getY.get(d.Id) + 7;
						var leftend = handledata[0].fixedleftend === null ? handledata[0].leftend : handledata[0].fixedleftend;
						if (leftend) {
							g.select('path')
								.attr('d', 'M 0 0 l -15 6 l +15 6 Z')
								.attr('transform', 'translate(' + left + ',' + y + ')');
						} else {
							g.select('path')
								.attr('d', 'M 0 0 l 15 6 l -15 6 Z')
								.attr('transform', 'translate(' + right + ',' + y + ')');
						}
						var middle = left + (right - left) / 2;
						g.select('use.detailicon')
							.attr('x', middle)
							.attr('y', function (d) {
								return getY.get(d.Id) + 4;
							});
					});

					selection.select('rect.targetindicator').remove();
					if (handledata[1].id !== -1) {
						selection.append('rect').classed('targetindicator', true)
							.attr('x', handledata[1].leftend ? scale(handledata[1].start) - 6 : scale(handledata[1].end) + 1)
							.attr('y', getY.get(handledata[1].id))
							.style('pointer-events', 'none')
							.attr('width', 5)
							.attr('height', defaultrowheight);
					}
				};
				// public properties and functions
				relationshiphandles_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newscale;
					return this;
				};
				relationshiphandles_.getY = function (newgetY) {
					if (!arguments.length) {
						return getY;
					}
					getY = newgetY;
					return this;
				};
				relationshiphandles_.onMoving = function (newOnMoving) {
					if (!arguments.length) {
						return onMoving;
					}
					onMoving = newOnMoving;
					return this;
				};
				relationshiphandles_.onMovedMin = function (newOnMovedMin) {
					if (!arguments.length) {
						return onMovedMin;
					}
					onMovedMin = newOnMovedMin;
					return this;
				};
				relationshiphandles_.onMovedMed = function (newOnMovedMed) {
					if (!arguments.length) {
						return onMovedMed;
					}
					onMovedMed = newOnMovedMed;
					return this;
				};
				relationshiphandles_.onMovedMax = function (newOnMovedMax) {
					if (!arguments.length) {
						return onMovedMax;
					}
					onMovedMax = newOnMovedMax;
					return this;
				};
				relationshiphandles_.onDetailIconClicked = function (x) {
					if (!arguments.length) {
						return onDetailIconClicked;
					}
					onDetailIconClicked = x;
					return this;
				};
				relationshiphandles_.handleData = function (newHandledata) {
					if (!arguments.length) {
						return handledata;
					}
					handledata = newHandledata;
					return this;
				};
				return relationshiphandles_;
			},

			/* screen only */
			tooltip: function tooltip() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(), durationOn = 250, durationOff = 450,

					labels = {
						'scheduling.main.plannedStart': 'Start', 'scheduling.main.plannedFinish': 'Finish', 'scheduling.main.plannedDuration': 'Duration'
					};
				var tooltip_ = function (selection) {
					var tooltips = selection.selectAll('div.chart-tooltip').data(selection.datum(), function (item) {
						return item.type + item.id;
					});
					tooltips.exit().transition().duration(durationOff).style('opacity', 1e-6).remove();
					var newtooltips = tooltips.enter().append('div').classed('chart-tooltip', true)
						.style('opacity', 1e-6);
					var alltooltips = newtooltips.merge(tooltips);
					alltooltips.transition().style('opacity', 1).duration(durationOn);

					alltooltips
						.html(function (d) {
							var label;
							switch (d.type) {
								case 'event':
									label = '<b>' + d.eventtype + '</b> ' + d.desc + '<br>' + moment(d.start).format('LL');
									if (validDate(d.End)) {
										label += ' – ' + moment(d.end).format('LL');
									}
									break;
								case 'note':
									// We will display the truncated notes field. To always show fresh data we can use a reference to the activity object.
									if (d.activity) {
										label = d.activity.note || d.note || '';
									} else {
										label = d.note || '';
									}
									break;
								/* jshint -W086 */ // fall-through intended: 'activity' is also default case
								case 'activity':
								default:
									var duration = _.isNumber(d.duration) ? d.duration.toUserLocaleNumberString(3) : '';
									label = '<b>' + d.code + '</b> ' + d.desc + '<br><br><b>' + labels['scheduling.main.plannedStart'] + '</b> ' + moment(d.start).format('LL') + '<br><b>' + labels['scheduling.main.plannedFinish'] + '</b> ' + moment(d.end).format('LL') + /*  TBD WBS element code (german: PSP) and description not implemented yet */
										'<br><b>' + labels['scheduling.main.plannedDuration'] + '</b> ' + duration;
									/* TBD Rate of Completion: not implemented yet */
									break;
							}
							return label;
						})
						.style('left', function (d) {
							var x = scale(d.xkey) + 50;
							if (x > scale.range()[1] - 40) {
								x = scale.range()[1] - 40;
							}
							return x + 'px';
						})
						.style('top', function (d) {
							return (d.y + 50) + 'px';
						});
				};

				// public properties and functions
				tooltip_.scale = function (newScale) {
					if (!arguments.length) {
						return scale;
					}
					scale = newScale;
					return this;
				};
				tooltip_.labels = function (newLabels) {
					if (!arguments.length) {
						return labels;
					}
					labels = newLabels;
					return this;
				};
				tooltip_.transition = function (x) {
					if (!arguments.length) {
						return durationOn === 500;
					}
					if (x) {
						durationOn = 250;
						durationOff = 450;
					} else {
						durationOn = 0;
						durationOff = 0;
					}
					return this;
				};

				return tooltip_;
			}
		};
	}
})();
