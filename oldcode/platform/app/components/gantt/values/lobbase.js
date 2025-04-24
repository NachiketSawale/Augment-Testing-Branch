/**
 * Created by sprotte on 03.05.2019
 */
/* global d3: false, moment, angular */
(function () {
	'use strict';
	if (typeof angular !== 'undefined') {
		angular.module('platform').factory('lobbase', standalone);
	} else {
		window.lob = standalone();
	}

	function standalone() {
		return {
			locations: function locations() {
				var size = [700, 240],
					flattenedLocations = [],
					actualWidth = size[1],
					tickValues = [];
				var locations_ = function (selection) {
					flattenedLocations.length = 0;
					tickValues.length = 0;

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
								var desc = d.data.DescriptionInfo ? d.data.DescriptionInfo.Translated : d._description;
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
					return actualWidth;
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
				var scale = d3.scaleUtc(),
					getY = function () {
						return [0, 50];
					},
					criticalColor = '#FF0000',
					globalpoints = [],
					showCritical = false,
					showLocationConnections = false,
					showProgress = false,

					clickHandler = _.noop(),
					enter = _.noop(),
					exit = _.noop(),
					handledata = {
						id: -1,
						start: null,
						middle: null,
						end: null
					},
					exceptionDays = [];

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
					var start = getStart(d),
						end = getEnd(d);
					var result = getY(d.LocationFk);
					// startpoint is easy
					var y1 = (d.ActivityPresentationFk === 2) ? result[0] : result[1]; // asc or desc
					var y2 = (d.ActivityPresentationFk === 2) ? result[1] : result[0]; // asc or desc
					var startpoint = {
						x: scale(start),
						y: y1
					};
					// to calculate endpoint we need to subtract all exception days
					var exceptiondaysinrange = exceptionDays.filter(function (day) {
						return day.ExceptDate >= start && day.ExceptDate <= end;
					});
					var noOfExceptiondays = exceptiondaysinrange.length;
					var netend = end.clone().add(-noOfExceptiondays, 'd');
					var endpointnet = {
						x: scale(netend),
						y: y2
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
							x: x,
							y: y
						};
						var secondpoint = {
							x: scale(holiday.end),
							y: y
						};
						points.push(firstpoint);
						points.push(secondpoint);
					});
					var endpoint = {
						x: scale(end),
						y: y2
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
								start: date,
								end: date
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
								d.PlannedFinish > domain[0] &&
								d.PlannedStart < domain[1];
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
							x: result.x1,
							y: result.y2,
							width: result.x2 - result.x1,
							height: result.y1 - result.y2,
							fill: getColor(d)
						});
					});

					var arrows = allgroups.selectAll('path.base').data(function (e) {
						var domain = scale.extendeddomain();
						globalpoints.length = 0;
						return e.filteredActivities.filter(function (d) {
							return d.ActivityPresentationFk !== 3 &&
								d.PlannedFinish > domain[0] &&
								d.PlannedStart < domain[1];
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
							x1: scale(getStart(d)),
							y1: y1,
							x2: scale(getEnd(d)),
							y2: y2
						};
					}

					var progressarrows = allgroups.selectAll('line.progress').data(function (e) {
						var domain = scale.extendeddomain();
						return showProgress ?
							e.filteredActivities.filter(function (item) {
								return item.PercentageCompletion > 0 &&
									item.PlannedFinish > domain[0] &&
									item.PlannedStart < domain[1];
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
							x: scale(d.PlannedStart),
							y: (d.ActivityPresentationFk === 2) ?
								result[0] : result[1]
						};
						var p2 = {
							x: scale(d.PlannedFinish),
							y: (d.ActivityPresentationFk === 2) ?
								result[1] : result[0]
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
							return d.ActivityPresentationFk !== 3 &&
								d.PlannedFinish > domain[0] &&
								d.PlannedStart < domain[1];
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
						var factor = d.PercentageCompletion,
							factordate = d.LastProgressDate;
						if (validDate(factordate) && factordate > d.PlannedStart) {
							var result = getY(d.LocationFk);
							var ystart = (d.ActivityPresentationFk === 2) ?
								result[0] : result[1];
							var yend = (d.ActivityPresentationFk === 2) ?
								result[1] : result[0];
							var newy = (yend - ystart) * (factor / 100) + ystart;
							return {
								x: scale(factordate),
								y: newy
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
		};
	}
})();
