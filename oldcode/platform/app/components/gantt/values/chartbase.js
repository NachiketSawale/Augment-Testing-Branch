/**
 * Created by sprotte on 14.09.2015.
 */
/* global d3: false, moment, angular */
(function () {
	'use strict';
	if (typeof angular !== 'undefined') {
		angular.module('platform').factory('chartbase', standalone);
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

		var globalMainTickValues;
		var globalTickValues;

		// noinspection JSUnusedGlobalSymbols Reason: library code that may be called by others
		var vector = {
			length: function length(p1) {
				return Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
			},
			unitVector: function unitVector(p1) {
				var l = vector.length(p1);
				return {
					x: p1.x / l,
					y: p1.y / l
				};
			},
			dotProduct: function dotProduct(p1, p2) {
				var _p1 = vector.unitVector(p1);
				var _p2 = vector.unitVector(p2);
				return _p1.x * _p2.x + _p1.y * _p2.y;
			},
			add: function add(p1, p2) {
				return {
					x: p1.x + p2.x,
					y: p1.y + p2.y
				};
			},
			sub: function sub(p1, p2) {
				return {
					x: p2.x - p1.x,
					y: p2.y - p1.y
				};
			},
			mul: function mul(p1, value) {
				return {
					x: p1.x * value,
					y: p1.y * value
				};
			},
			middlepoint: function middlepoint(p1, p2) {
				if (p1.x === p2.x && p1.y === p2.y) {
					return p1;
				}
				var myvector = vector.sub(p1, p2);
				var distance = vector.length(myvector);
				var unitv = vector.unitVector(myvector);
				return vector.add(vector.mul(unitv, (distance / 2)), p1);
			},
			slope: function calcSlope(start, end, noDegrees) {
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

			businessDays.diff = function businessDiff(mystartDate, myendDate, countStartDay) {
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
				var startWeekday = startDate.day(),
					endOffset = endDate.day() + 1,
					endSunday = endDate.clone().day(0).startOf('day'),
					startSunday = startDate.clone().day(7).startOf('day'),
					weeks = endSunday.diff(startSunday, 'weeks'),
					firstWeek, lastWeek;

				// week definition in the form [0,1,1,1,1,1,0]
				firstWeek = _.sum(week.slice(startWeekday + 1)); // Remaining workdays in first week after start day
				lastWeek = _.sum(week.slice(0, endOffset)); // Remaining workdays in last week <= end day

				var exceptionsWithinRange = exceptionsWithoutWeekends.filter(function (exceptionday) {
					// return exceptionday.isBetween(startDate, endDate, 'd', '[]'); // option from moment 1.13 on. still on 1.10
					return exceptionday.isSame(endDate, 'd') || exceptionday.isSame(startDate, 'd') || exceptionday.isBetween(startDate, endDate, 'd');
				});

				return (weeks * numberOfWeekdays + firstWeek + lastWeek + (countStartDay ? week[startWeekday] : 0) - exceptionsWithinRange.length) * direction;
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
							return [
								extendedscale.extendedinvert(range[0]),
								extendedscale.extendedinvert(range[1])
							];
						}
						originalscale.domain(x);
						return extendedscale;
					};
					extendedscale.extendedinvert = function extendedinvert(x) {
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
						return businessDays.add(originaldate, differenceindays);
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

				var scale = d3.scaleUtc(),
					axisheight = 20,
					orientation = 'top',
					tickvalues = [],
					maintickvalues = [],
					translations = {
						weekAbbreviation: 'W',
						weekNumberFormat: 'W'
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
						return currenttext; })();
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
						selection.append('g').classed('extralabel', true).attr('transform', 'translate(0,8)').append('rect').attrs({width:100, height:12, fill:'white'})
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

				timeaxis_.tickvalues = function ( /* x */ ) { // tickvalues to be treated as read-only.
					return tickvalues;
				};

				timeaxis_.maintickvalues = function ( /* x */ ) { // tickvalues to be treated as read-only.
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
								t: d3.utcMonth,
								n: 'month'
							}, {
								t: d3.utcDay,
								n: 'day',
								s: weekspan
							}, {
								t: d3.utcHour,
								n: 'hour'
							}];
							format = [displaymonths, 'dddd D', 'H'];
							break;
						case (currentrange.asHours() <= 17.5):
							ticks = [{
								t: d3.utcDay,
								n: 'day'
							}, {
								t: d3.utcHour,
								n: 'hour'
							}, {
								t: 25
							}];
							format = ['dddd D', 'H', 'mm'];
							break;
						case (currentrange.asDays() <= 7):
							ticks = [{
								t: d3.utcMonday,
								n: 'monday',
								s: weekspan
							}, {
								t: d3.utcDay,
								n: 'day'
							}, {
								t: 30
							}];
							format = ['[' + translations.weekAbbreviation + '] ' + translations.weekNumberFormat + ' MMMM YYYY', 'dddd D', 'H'];
							break;
						case (currentrange.asMonths() <= 1.0):
							ticks = [{
								t: d3.utcMonth,
								n: 'month'
							}, {
								t: d3.utcMonday,
								n: 'monday',
								s: weekspan
							}, {
								t: d3.utcDay,
								n: 'day',
								s: weekspan
							}];
							format = [displaymonths, '[' + translations.weekAbbreviation + '] ' + translations.weekNumberFormat, 'DD dd'];
							break;
						case (currentrange.asMonths() <= 1.8):
							ticks = [{
								t: d3.utcMonth,
								n: 'month'
							}, {
								t: d3.utcMonday,
								n: 'monday',
								s: weekspan
							}, {
								t: d3.utcDay,
								n: 'day',
								s: weekspan
							}];
							format = [displaymonths, '[' + translations.weekAbbreviation + '] ' + translations.weekNumberFormat, 'DD'];
							break;
						case (currentrange.asMonths() <= 6.6):
							ticks = [{
								t: d3.utcYear,
								n: 'year'
							}, {
								t: d3.utcMonth,
								n: 'month'
							}, {
								t: d3.utcMonday,
								n: 'monday',
								s: weekspan
							}];
							format = ['YYYY', displaymonths, '[' + translations.weekAbbreviation + '] ' + translations.weekNumberFormat];
							break;
						case (currentrange.asMonths() <= 9.5):
							ticks = [{
								t: d3.utcYear,
								n: 'year'
							}, {
								t: d3.utcMonth,
								n: 'month'
							}, {
								t: d3.utcMonday,
								n: 'monday',
								s: 2
							}];
							format = ['YYYY', displaymonths, translations.weekNumberFormat];
							break;
						case (currentrange.asYears() <= 1):
							ticks = [{
								t: d3.utcYear,
								n: 'year'
							}, {
								t: d3.utcMonth,
								s: 6,
								n: 'month'
							}, {
								t: d3.utcMonth,
								n: 'month'
							}];
							format = ['YYYY', halfYear(), displaymonths];
							break;
						case (currentrange.asYears() <= 5):
							ticks = [{
								t: d3.utcYear,
								s: 5,
								n: 'year'
							}, {
								t: d3.utcYear,
								n: 'year'
							}, {
								t: d3.utcMonth,
								s: 6,
								n: 'month'
							}];
							format[0] = formattimespan;
							format[1] = 'YYYY';
							format[2] = halfYear();
							break;
						default:
							ticks = [{
								t: d3.utcYear,
								s: 5
							}, {
								t: 0
							}, {
								t: 0
							}];
							format = [formattimespan, '', ''];
					}

					return {
						ticks: ticks,
						format: format
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

			// handles are drawn above activity arrows. it's data source
			// is the selecteditem in union with the currently displayed activities. dragging results in triggering the async validation service. resulting new data is displayed via the normal update mechanism
			/* screen only */
			handles: function handles() {
				// private 'static' stuff (functions and members)
				var getY = new Map(),
					middleadjust = [0, 1],
					offset = 0,
					onMovedMax = _.noop(),
					onMovedMed = _.noop(),
					onMovedMilestone = _.noop(),
					onMovedMin = _.noop(),
					onMoving = _.noop(),
					moveCanvas = _.noop(),
					originalscale = d3.scaleUtc(),
					rootElement,
					radius = 5,
					selectedIds = [-1],
					zoom = d3.zoom(),
					scale = d3.scaleUtc(),
					timer = d3.timer(_.noop),
					oldXMoment = _.noop(),
					dragStartBarValues = _.noop(),
					moveMode = 'day'; // default moveMode

				function start(d) {
					oldXMoment = _.noop();
					adjustCircleObj.movedUnits = 0;
					if (!_.isUndefined(d)) {
						dragStartBarValues = {
							barStart: moment(d.barStart),
							barEnd: moment(d.barEnd)
						};
					}

					d3.event.sourceEvent.stopPropagation(); // silence other listeners
				}

				function getZoomLevel() {
					var tickDiffSeconds = moment(globalTickValues[1]).diff(moment(globalTickValues[0]), 'seconds');
					var zoomLevel;

					if (tickDiffSeconds < 86400) {
						zoomLevel = 'hour';
					} else if (tickDiffSeconds >= 86400 && tickDiffSeconds < 604800) {
						zoomLevel = 'day';
					} else if (tickDiffSeconds >= 604800) {
						zoomLevel = 'week';
					}

					return zoomLevel;
				}

				function findMiddle(d) {
					var yStart, yEnd;
					var adjustwidth = middleadjust[1] - middleadjust[0];
					adjustwidth = adjustwidth ? adjustwidth : 1;
					var adjust = getY.get(d.id) + (adjustwidth * 0.5 + middleadjust[0]) * defaultrowheight;
					yStart = adjust;
					yEnd = adjust;

					var plannedStart = d._tempBarStart || scale(d.barStart);
					var plannedFinish = d._tempBarEnd || scale(d.barEnd);
					var start = {
						x: plannedStart,
						y: yStart
					};
					var end = {
						x: plannedFinish,
						y: yEnd
					};
					var middle = vector.middlepoint(start, end);
					return {
						plannedStart: plannedStart,
						plannedFinish: plannedFinish,
						yStart: yStart,
						yEnd: yEnd,
						middle: middle
					};
				}

				var adjustCircleObj = {
					zoomLevel: 'day',
					zoomLevelSeconds: 86400,
					movedUnits: 0,
					move: function move(element, movedX, circle, zl) {
						if (zl === 'auto' || _.isUndefined(zl)) {
							this.zoomLevel = getZoomLevel();
						} else {
							this.zoomLevel = zl;
						}

						var movedXMoment;

						switch (this.zoomLevel) {
							case 'hour':
								movedXMoment = moment(scale.invert(movedX)).utc().set({
									minute: 0,
									second: 0
								});
								this.zoomLevelSeconds = 3600;
								break;
							case 'day':
								movedXMoment = moment(scale.invert(movedX)).utc().set({
									hour: 0,
									minute: 0,
									second: 0
								});
								this.zoomLevelSeconds = 86400;
								break;
							case 'week':
								movedXMoment = moment(scale.invert(movedX)).utc().set({
									hour: 0,
									minute: 0,
									second: 0
								});
								break;
							default:
								console.warn('No definitions for [' + this.zoomLevel + '] this zoom level.');
								break;
						}

						if (_.isUndefined(oldXMoment) || !_.isUndefined(oldXMoment) && !movedXMoment.isSame(oldXMoment, this.zoomLevel)) {
							if (_.isUndefined(oldXMoment)) {
								oldXMoment = moment(movedXMoment);
							}
							var movedDiff = movedXMoment.diff(oldXMoment, 'seconds');
							oldXMoment = moment(movedXMoment);
							if (movedDiff > 0) {
								if (this.zoomLevel === 'week') {
									this.movedUnits++;
								} else {
									this.movedUnits += Math.ceil(movedDiff / this.zoomLevelSeconds);
								}
							} else {
								if (this.zoomLevel === 'week') {
									this.movedUnits--;
								} else {
									this.movedUnits += Math.floor(movedDiff / this.zoomLevelSeconds);
								}
							}

							switch (this.zoomLevel) {
								case 'hour':
									if (circle === 'max') {
										movedXMoment.set({
											minutes: dragStartBarValues.barEnd.format('mm'),
											seconds: dragStartBarValues.barEnd.format('ss')
										});
									} else if (circle === 'min') {
										movedXMoment.set({
											minutes: dragStartBarValues.barStart.format('mm'),
											seconds: dragStartBarValues.barStart.format('ss')
										});
									}
									break;
								case 'day':
									this.setStartBarValues(movedXMoment, circle);
									break;
								case 'week':
									this.setStartBarValues(movedXMoment, circle);
									movedXMoment.day(dragStartBarValues.barStart.day());
									break;
							}

							this.setBarDates(element, movedXMoment, movedDiff, circle);
							element.circle = circle;
							onMoving(element);
						}
					},
					setBarDates: function setBarDates(element, movedXMoment, movedDiff, circle) {
						switch (circle) {
							case 'min':
								element.BarStart = moment(movedXMoment);
								element.BarEnd = moment(element.barEnd);
								break;
							case 'max':
								element.BarStart = moment(element.barStart);
								element.BarEnd = moment(movedXMoment);
								break;
							case 'mid':
								element.BarStart = moment(dragStartBarValues.barStart).add(this.movedUnits, this.zoomLevel);
								element.BarEnd = moment(dragStartBarValues.barEnd).add(this.movedUnits, this.zoomLevel);
								break;
						}
					},
					setStartBarValues: function setStartBarValues(movedXMoment, circle) {
						if (circle === 'max') {
							movedXMoment.set({
								hour: dragStartBarValues.barEnd.format('HH'),
								minutes: dragStartBarValues.barEnd.format('mm'),
								seconds: dragStartBarValues.barEnd.format('ss')
							});
						} else if (circle === 'min') {
							movedXMoment.set({
								hour: dragStartBarValues.barStart.format('HH'),
								minutes: dragStartBarValues.barStart.format('mm'),
								seconds: dragStartBarValues.barStart.format('ss')
							});
						}
					}
				};

				var dragMin = d3.drag().on('start', function (d) {
					start(d);
				}).on('end', function (d) {
					timer.stop();
					d.BarStart = scale.invert(d._tempBarStart);
					d._tempBarStart = null;
					onMovedMin(d);
				})
					.on('drag', function (d) {
						var movedX = d3.event.x;
						var stop = d._tempBarEnd || scale(d.barEnd);
						if (movedX < scale.range()[0] + radius) {
							timer.restart(autoScrollLeft, 500, 1000);
						} else if (movedX > scale.range()[1] - radius) {
							timer.restart(autoScrollRight, 500, 1000);
						} else {
							timer.stop();
						}
						movedX = movedX > stop ? stop : movedX; // x-limits
						movedX = movedX < scale.range()[0] + radius ? scale.range()[0] + radius : movedX;
						if (d3.event.dx !== 0) {
							// only move if x is greater than 0
							adjustCircleObj.move(d, movedX, 'min', moveMode);
						}

						function autoScrollLeft() {
							return autoScroll(false, d);
						}

						function autoScrollRight() {
							return autoScroll(true, d);
						}
					});

				var dragMax = d3.drag().on('start', function (d) {
					start(d);
				}).on('end', function (d) {
					timer.stop();
					d.BarEnd = scale.invert(d._tempBarEnd);
					d._tempBarEnd = null;
					onMovedMax(d);
				})
					.on('drag', function (d) {
						var movedX = d3.event.x;
						var stop = d._tempBarStart || scale(d.barStart);
						if (movedX > scale.range()[1] - radius) {
							timer.restart(autoScrollRight, 500, 1000);
						} else if (movedX < scale.range()[0] + radius) {
							timer.restart(autoScrollLeft, 500, 1000);
						} else {
							timer.stop();
						}
						movedX = movedX < stop ? stop : movedX; // x-limits
						movedX = movedX > scale.range()[1] + radius ? scale.range()[1] + radius : movedX;
						if (d3.event.dx !== 0) {
							// only move if x is greater than 0
							adjustCircleObj.move(d, movedX, 'max', moveMode);
						}

						function autoScrollLeft() {
							return autoScroll(false, d);
						}

						function autoScrollRight() {
							return autoScroll(true, d);
						}
					});

				var dragMed = d3.drag().on('start', function (d) {
					start(d);
				}).on('end', function (d) {
					timer.stop();
					d.BarStart = scale.invert(d._tempBarStart);
					d.BarEnd = scale.invert(d._tempBarEnd);
					d._tempBarStart = null;
					d._tempBarEnd = null;
					onMovedMed(d);
				})
					.on('drag', function (d) {
						var movedX = d3.event.x;
						if (movedX > scale.range()[1] - radius) {
							timer.restart(autoScrollRight, 500, 1000);
						} else if (movedX < scale.range()[0]) {
							timer.restart(autoScrollLeft, 500, 1000);
						} else {
							timer.stop();
						}
						movedX = movedX < scale.range()[0] + radius ? scale.range()[0] + radius : movedX; // x-limits
						movedX = movedX > scale.range()[1] - radius ? scale.range()[1] - radius : movedX;
						if (d3.event.dx !== 0) {
							// only move if x is greater than 0
							adjustCircleObj.move(d, movedX, 'mid', moveMode);
						}

						function autoScrollLeft() {
							return autoScroll(false);
						}

						function autoScrollRight() {
							return autoScroll(true);
						}

						function autoScroll(direction) {
							var transform = d3.zoomTransform(rootElement.node());
							var difference = direction ? -5 : 5;
							transform.x += difference;
							var time1 = scale.extendedinvert(0);
							var time2 = scale.extendedinvert(difference);
							var timediff = time1.diff(time2);
							d.BarStart.add(timediff, 'ms');
							d.BarEnd.add(timediff, 'ms');
							onMoving(d);
							moveCanvas(transform);
						}
					});

				function autoScroll(direction, d) {
					var transform = d3.zoomTransform(rootElement.node());
					var difference = direction ? -5 : 5;
					transform.x += difference;
					var time1 = scale.extendedinvert(0);
					var time2 = scale.extendedinvert(difference);
					var timediff = time1.diff(time2);
					if (direction) {
						d.BarEnd.add(timediff, 'ms');
					} else {
						d.BarStart.add(timediff, 'ms');
					}
					onMoving(d);
					moveCanvas(transform);
				}

				var handles_ = function (selection) {
					if (!selection.datum) {
						return; // happens when transition is active
					}
					var data = selection.datum()[0];
					var handlegroup = selection.selectAll('g.handle').data(data.filter(function (item) {
						return !item._relationshipmode && item.isSelectable && _.find(selectedIds, function (what) {
							return what === item.id;
						});
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

					return;
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
				handles_.verticalIndex = function (x) {
					if (!arguments.length) {
						return getY;
					}
					getY = x;
					return this;
				};
				handles_.selectedIds = function (x) {
					if (!arguments.length) {
						return selectedIds;
					}
					selectedIds = x;
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
				handles_.moveCanvas = function (x) {
					if (!arguments.length) {
						return moveCanvas;
					}
					moveCanvas = x;
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
				handles_.zoom = function (x) {
					if (!arguments.length) {
						return zoom;
					}
					zoom = x;
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
				handles_.rootElement = function (x) {
					if (!arguments.length) {
						return rootElement;
					}
					rootElement = x;
					return this;
				};
				handles_.moveMode = function (mode) {
					if (!arguments.length) {
						return moveMode;
					}
					moveMode = mode;
					return this;
				};
				return handles_;
			},

			locks: function locks() {
				var scalex = d3.scaleUtc(),
					verticalIndex = null;

				function attachIcons(selection) {
					var defblock = selection.select('defs');
					if (defblock.empty()) {
						defblock = selection.append('defs');
					}
					var locksymbol = selection.select('defs symbol#locks');
					if (locksymbol.empty()) {
						defblock.append('symbol').attr('id', 'locks')
							.append('g')
							.append('path')
							.attr('d', 'M1.5,5l0,-1c0,-2.208 1.792,-4 4,-4c2.208,0 4,1.792 4,4l0,1l0.5,0l0,6l-9,0l0,-6l0.5,0Zm4,1.5c0.552,0 1,0.56 1,1.25c0,0.69 -0.448,1.25 -1,1.25c-0.552,0 -1,-0.56 -1,-1.25c0,-0.69 0.448,-1.25 1,-1.25Zm-2.5,-1.5l5,0l0,-1c0,-1.38 -1.12,-2.5 -2.5,-2.5c-1.38,0 -2.5,1.12 -2.5,2.5l0,1Z');
					}
				}

				function getStart(d) {
					return d._tempBarStart - 20 || scalex(d.barStart) - 20;
				}

				var locks_ = function (selection) {
					// on the first go: try to attach icon templates ...
					attachIcons(selection);
					if (!selection.datum) {
						return; // happens when transition is active
					}
					var groups = selection.selectAll('g.locks')
						.data(selection.datum().filter(function (item, i) {
							return i === 0;
						}));
					groups.exit().remove();
					var newgroups = groups.enter().append('g').classed('locks', true);
					var allgroups = newgroups.merge(groups);
					var locks = allgroups.selectAll('use.lock').data(function (subarray) {
						return subarray.filter(function (item) {
							return item.isLocked && verticalIndex.has(item.id);
						});
					}, itemId);
					locks.exit().remove();
					var newlocks = locks.enter().append('use').classed('lock', true)
						.attr('xlink:href', '#locks');
					var alllocks = newlocks.merge(locks);
					alllocks.attr('x', getStart)
						.attr('y', function (d) {
							return verticalIndex.get(d.id) + 4.5;
						});
				};
				locks_.scaleX = function (x) {
					if (!arguments.length) {
						return scalex;
					}
					scalex = x;
					return this;
				};
				locks_.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = x;
					return this;
				};

				return locks_;
			},

			calendarlines: function calendarlines() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(),
					height = 500,
					offset = 0,
					defaultopt = [new moment.utc(), true, true],
					globaltickvalues = [],
					maintickvalues = [],
					linedata = [],
					verticalIndex = new Map(),
					showverticallines,
					showhorizontallines,
					printadjustment = 0; // set to -0.5 in printmode;

				// Why this function? It makes more or less horizontal lines according to the currently filtered resultset of the grid
				function makeLinedata() {
					linedata.length = 0;
					linedata.push(0);
					var outervalue = 0;
					verticalIndex.forEach(function (value) {
						outervalue += defaultrowheight;
						linedata.push(outervalue);
					});
				}

				var calendarlines_ = function (selection) {
					if (!selection.datum) {
						return; // happens when transition is active
					}
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
								x1: 0,
								x2: 0,
								y1: 0,
								y2: height
							});
						}
					} else {
						selection.select('g.tick-wide').remove();
					}

					var timeaxis = d3.axisBottom().scale(scale).tickSize(height).tickValues(tickvalues).tickFormat('');
					selection.call(timeaxis);

					// top: 0 height: height // inter: defaultrowheight

					horizontallines = selection.selectAll('line.horizontal').data(showhorizontallines ? linedata : []);
					horizontallines.exit().remove();

					var newhorizontallines = horizontallines.enter()
						.append('line').classed('horizontal', true);

					var combinedhorizontallines = newhorizontallines.merge(horizontallines);

					combinedhorizontallines.attrs({
						y1: function (item) {
							return item;
						},
						y2: function (item) {
							return item;
						},
						x1: scale.range()[0],
						x2: scale.range()[1]
					});

					todayline = selection.select('line.today');
					if (opt[0]) {
						if (todayline.empty()) {
							todayline = selection.append('line').classed('today', true);
						}
						var today = moment.utc().startOf('day');
						todayline.attrs({
							x1: scale(today),
							x2: scale(today),
							y1: 0,
							y2: height
						});
					} else {
						todayline.remove();
					}

					verticallines = selection.selectAll('line.vertical').data(showverticallines ? globaltickvalues : []);
					verticallines.exit().remove();

					var newverticallines = verticallines.enter()
						.append('line').classed('vertical', true).attrs({
							y1: 0,
							y2: height
						});

					var combinedverticallines = newverticallines.merge(verticallines);

					combinedverticallines.attrs({
						x1: function (item) {
							return scale(item);
						},
						x2: function (item) {
							return scale(item);
						},
						y1: 0,
						y2: height
					});

					var boldverticallines = selection.selectAll('line.bold').data(showverticallines ? maintickvalues : []);
					boldverticallines.exit().remove();

					var newboldverticallines = boldverticallines.enter()
						.append('line').classed('bold', true).attrs({
							y1: 0,
							y2: height
						})
						.style('stroke', 'black')
						.style('stroke-width', '1px');

					var combinedboldverticallines = newboldverticallines.merge(boldverticallines);

					combinedboldverticallines.attrs({
						x1: function (item) {
							return scale(item);
						},
						x2: function (item) {
							return scale(item);
						},
						y1: 0,
						y2: height
					});

					selection.attr('transform', 'translate(0,' + offset + ')');
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
						return offset;
					}
					offset = x;
					return this;
				};
				calendarlines_.tickvalues = function (x) {
					if (!arguments.length) {
						return globaltickvalues;
					}
					globaltickvalues = x;
					return this;
				};
				calendarlines_.maintickvalues = function (x) {
					if (!arguments.length) {
						return maintickvalues;
					}
					maintickvalues = x;
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
				calendarlines_.printmode = function (x) {
					if (!arguments.length) {
						return printadjustment !== 0;
					}
					printadjustment = x ? -0.5 : 0;
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

			holidays: function holidays() {
				// private 'static' stuff (functions and members)
				var scale, height = 500,
					offset = 0,
					scroll = false;
				var holidays_ = function (selection) {
					var modifiedoffset = scroll ? offset - 1000 : offset;
					var modifiedheight = scroll ? height + 2000 : height;
					var holidayrects;
					var domain = scale.extendeddomain();
					holidayrects = selection.selectAll('rect.holiday').data(selection.datum().filter(function (item) {
						return item.End > domain[0] && item.Start < domain[1];
					}));

					holidayrects.exit().remove(); // old holidays

					var newholidayrects = holidayrects.enter() // new holidays
						.append('rect').classed('holiday', true);

					var combinedholidayrects = newholidayrects.merge(holidayrects);

					combinedholidayrects.attr('x', function (d) {
						return scale(d.Start);
					})
						.attr('y', 0)
						.attr('height', modifiedheight)
						.attr('width', function (d) {
							return scale(d.End) - scale(d.Start);
						})
						.style('fill', function (d) {
							return decimalToHex(d.Color, 6);
						});

					selection.attr('transform', 'translate(0,' + modifiedoffset + ')');
				};
				// public properties and functions
				holidays_.scale = function (newscale) {
					if (!arguments.length) {
						return scale;
					}
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
				holidays_.offset = function (newOffset) {
					if (!arguments.length) {
						return offset;
					}
					offset = newOffset;
					return this;
				};
				holidays_.scrollOptimization = function (newscrollOptimization) {
					if (!arguments.length) {
						return scroll;
					}
					scroll = newscrollOptimization;
					return this;
				};

				return holidays_;
			},

			// NOTE: CANNOT use ES6 map on server
			weekends: function holidays() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(),
					height = 500,
					offset = 0,
					scroll = false,
					weekdaymap = [
						null, // sunday is index1, monday is 2 ... saturday is 7.
						d3.utcSunday,
						d3.utcMonday,
						d3.utcTuesday,
						d3.utcWednesday,
						d3.utcThursday,
						d3.utcFriday,
						d3.utcSaturday
					];

				var weekdaynames = [
					null, // sunday is index1, monday is 2 ... saturday is 7.
					'sunday',
					'monday',
					'tuesday',
					'wednesday',
					'thursday',
					'friday',
					'saturday'
				];
				var weekends_ = function (selection) {
					var modifiedoffset = scroll ? offset - 1000 : offset;
					var modifiedheight = scroll ? height + 2000 : height;
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
						.attr('height', modifiedheight)
						.attr('width', width);
					selection.attr('transform', 'translate(0,' + modifiedoffset + ')');
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
				weekends_.offset = function (newOffset) {
					if (!arguments.length) {
						return offset;
					}
					offset = newOffset;
					return this;
				};
				weekends_.scrollOptimization = function (newscrollOptimization) {
					if (!arguments.length) {
						return scroll;
					}
					scroll = newscrollOptimization;
					return this;
				};

				return weekends_;
			},

			timelines: function timelines() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(),
					height = 500,
					offset = 0,
					scroll = false,
					printadjustment = -13; // -11 if in print mode
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
					var modifiedheight = scroll ? height + 2000 : height;
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
								x1: xvalue,
								y1: 0,
								x2: xvalue,
								y2: modifiedheight
							})
							.styles({
								stroke: getColor(d),
								'stroke-width': getStrokeWidth(d),
								'opacity': d.EndDate ? '0.5' : '1.0'
							});
						g.select('g text')
							.attrs({
								x: xvalue,
								y: 4
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
									x: bbox.x - 5,
									y: bbox.y - 2,
									width: bbox.width + 10,
									height: bbox.height + 4,
									rx: 5,
									ry: 5,
									'opacity': d.EndDate ? '0' : '1'
								})
								.styles({
									fill: getColor(d),
									'shape-rendering': 'auto'
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
				timelines_.scrollOptimization = function (newscrollOptimization) {
					if (!arguments.length) {
						return scroll;
					}
					scroll = newscrollOptimization;
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
		};
	}
})();