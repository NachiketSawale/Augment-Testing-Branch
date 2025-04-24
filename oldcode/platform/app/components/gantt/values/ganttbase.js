/**
 * Created by sprotte on 03.05.2019
 */
/* global d3: false, moment, angular */
(function () {
	'use strict';
	if (typeof angular !== 'undefined') {
		angular.module('platform').factory('ganttbase', standalone);
	} else {
		window.gantt = standalone();
	}

	function standalone() {
		function itemId(item) {
			return item.Id || item.id;
		}

		var defaultrowheight = 25;
		var defaultrowheightprint = 15;
		return {
			hammocks: function hammocks() {
				// private 'static' stuff (functions and members)
				var scale,
					/* offset = 0, */
					scroll = false,
					verticalIndex = new Map(),
					printmode,
					color,
					rowheight = defaultrowheight,
					assignedActivities = [],
					myY, border = 5;
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

						sel.attr('x', scale(d.CurrentStart) - border)
							.attr('y', myY.y)
							.attr('height', myY.height)
							.attr('width', scale(d.CurrentFinish) - scale(d.CurrentStart) + border + border).style('fill', color);
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
							y: min,
							height: modifiedheight
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

			barItems: function barItems() {
				/* id rowIndex barStart barEnd barConfig */
				// private 'static' stuff
				var criticalColor = '#FF0000',
					criticalBorderWidth = '1px',
					printmode = false;

				var scalex = d3.scaleUtc(),
					scaley = d3.scaleLinear(),
					showCritical = false,
					verticalIndex = null,
					clickHandler = _.noop(),
					doubleClickHandler = _.noop(),
					mouseoverHandler = _.noop(),
					mouseoutHandler = _.noop(),
					handledata = {
						id: -1,
						start: null,
						middle: null,
						end: null
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
					return d._tempBarStart || scalex(d.barStart);
				}

				function getEnd(d) {
					return d._tempBarEnd || scalex(d.barEnd);
				}

				var _barItems = function (selection) {
					// on the first go: try to attach icon templates ...
					attachIcons(selection);
					if (!selection.datum) {
						return; // happens when transition is active
					}
					var groups = selection.selectAll('g.level1')
						.data(selection.datum());
					groups.exit().remove();
					var newgroups = groups.enter().append('g').classed('level1', true);
					var combinedgroups = newgroups.merge(groups);
					var bars = combinedgroups.selectAll('g.activities').data(function (subarray) {
						return subarray.filter(function (item) {
							return verticalIndex.has(item.id);
						});
					}, itemId);
					var newbars = bars.enter().append('g').classed('activities', true)
						.each(function () {
							var sel = d3.select(this);
							sel.append('rect').classed('activity', true);
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
							var myY;
							// lookup template
							var currenttemplate = d.barConfig;
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

							myY = Math.floor(verticalIndex.get(d.id) + scaley(currenttemplate.up));

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

							sel.select('rect.activity').attr('x', function (d) {
								return getStart(d);
							})
								.attr('y', myY)
								.attr('width', function (d) {
									var result = getEnd(d) - getStart(d);
									return result >= 0 ? result : 0;
								})
								.attr('fill', getFill)
								.attr('height', scaley(currenttemplate.down) - scaley(currenttemplate.up))
								.attr('stroke', getStroke)
								.attr('stroke-width', getStrokeWidth);

							sel.select('use.iconstart').attr('x', function (d) {
								return getStart(d) - 7.5;
							})
								.attr('y', myY)
								.style('fill', function () {
									return d.color || currenttemplate.pattern || currenttemplate.fill;
								})
								.attr('xlink:href', function () {
									return '#' + currenttemplate.iconstart;
								});

							sel.select('use.iconend').attr('x', function (d) {
								return getEnd(d) - 7.5;
							})
								.attr('y', myY)
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

							function getStroke() {
								return (currenttemplate.editable && showCritical && d.isCritical) ? criticalColor : currenttemplate.fill;
							}

							function getFill() {
								return (currenttemplate.editable && showCritical && d.isCritical) ? 'url(#critical)' : (d.color || currenttemplate.pattern || currenttemplate.fill);
							}

							function getStrokeWidth() {
								return (currenttemplate.editable && showCritical && d.isCritical) ? criticalBorderWidth : currenttemplate.outline ? '1px' : '0px';
							}
						});
					}
				};
				_barItems.scaleX = function (x) {
					if (!arguments.length) {
						return scalex;
					}
					scalex = x;
					return this;
				};
				_barItems.scaleY = function (x) {
					if (!arguments.length) {
						return scaley;
					}
					scaley = x;
					return this;
				};
				_barItems.showCritical = function (x) {
					if (!arguments.length) {
						return showCritical;
					}
					showCritical = x;
					return this;
				};
				_barItems.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalIndex;
					}
					verticalIndex = x;
					return this;
				};
				_barItems.clickHandler = function (x) {
					if (!arguments.length) {
						return clickHandler;
					}
					clickHandler = x;
					return this;
				};
				_barItems.doubleClickHandler = function (x) {
					if (!arguments.length) {
						return doubleClickHandler;
					}
					doubleClickHandler = x;
					return this;
				};
				_barItems.mouseoverHandler = function (x) {
					if (!arguments.length) {
						return mouseoverHandler;
					}
					mouseoverHandler = x;
					return this;
				};
				_barItems.mouseoutHandler = function (x) {
					if (!arguments.length) {
						return mouseoutHandler;
					}
					mouseoutHandler = x;
					return this;
				};
				_barItems.handleData = function (x) {
					if (!arguments.length) {
						return handledata;
					}
					handledata = x;
					return this;
				};
				_barItems.printmode = function (x) {
					if (!arguments.length) {
						return printmode;
					}
					printmode = x;
					return this;
				};

				return _barItems;
			},

			notes: function notes() {
				// private 'static' stuff

				var scalex = d3.scaleUtc(),
					verticalIndex = null,
					notehandler = _.noop();

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
							width: 14,
							height: 11,
							fill: 'lightyellow'
						})
							.parent()
							.append('path')
							.attr('d', 'M3 6h10v1H3zm0 3h10v1H3zm0 3h10v1H3z M3 0h10c1.66 0 3 1.34 3 3v13H0V3c0-1.66 1.34-3 3-3ZM1 4v11h14V4H1Z');
					}
				}

				var notes_ = function (selection) {
					// on the first go: try to attach icon templates ...
					attachIcons(selection);
					var groups = selection.selectAll('g.notes')
						.data(selection.datum().filter(function (item, i) {
							return i === 0;
						})); // TBD Note: need to use same logic as for display of relationships (getAccessProperty).... to determine where to put icon
					groups.exit().remove();
					var newgroups = groups.enter().append('g').classed('notes', true);
					var allgroups = newgroups.merge(groups);
					var notes = allgroups.selectAll('use.note').data(function (subarray) {
						return subarray.filter(function (item) {
							return verticalIndex.has(item.id) && item.note && item.note.length > 0;
						});
					}, itemId);
					notes.exit().on('click', null).remove(); // remove notehandler
					var newnotes = notes.enter().append('use').classed('note', true)
						.attr('xlink:href', '#notes')
						.on('click', notehandler);
					var allnotes = newnotes.merge(notes);
					allnotes.attr('x', function (d) {
						return scalex(d.end) + 13;
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
				var scale = d3.scaleUtc(),
					verticalIndex = null,
					printmode = false,
					horizontalspacer = 19;
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
					var barinfos = selection.selectAll('text.barinfo')
						.data(selection.datum().filter(function (item) {
							return verticalIndex.has(item.id);
						}), function (item) {
							return item.id;
						});
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
				var scale = d3.scaleUtc(),
					height = 500,
					verticalIndex,
					templateMap, icons, resetIcons = true,
					printmode,
					enter = _.noop(),
					exit = _.noop();

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
									'fill': 'black',
									'stroke': 'white',
									'stroke-linejoin': 'round'
								});
						});
						resetIcons = false;
					}
				}

				var events_ = function (selection) {
					// on the first go: try to attach icon templates ...
					attachIcons(selection);

					var singleevents = selection.selectAll('use.event').data(
						selection.datum().filter(function (item) {
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

					var doubleevents = selection.selectAll('g.event').data(
						selection.datum().filter(function (item) {
							return (validDate(item.EndDate)) && verticalIndex.has(item.ActivityFk);
						}), itemId);
					var newdoubleevents = doubleevents.enter().append('g').classed('event', true);
					newdoubleevents.on('mouseover', enter)
						.on('mouseout', exit)
						.append('use').classed('eventall left', true).attr('width', 11).attr('height', 11).parent()
						.append('use').classed('eventall right', true).attr('width', 11).attr('height', 11).parent()
						.append('line').styles({
						'stroke': 'black',
						'stroke-width': '1px'
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
				var
					doubleClickHandler = null,
					height = 500,
					offset = 0,
					printmode = false,
					scaleY = d3.scaleLinear(),
					showCritical = false,
					verticalindex = new Map(),
					criticalColor = '#FF0000',
					scaleX = d3.scaleUtc();
				var rline = d3.line()
					.x(function (d) {
						return d.x;
					})
					.y(function (d) {
						return d.y;
					});
				var relationships_ = function (selection) {
					if (!selection.datum) {
						return; // happens when transition is active
					}
					var link, filterfunction;
					/*					if (!printmode) {
											filterfunction = function(el) {
												return !(el.parenty < offset && el.childy < offset || el.parenty > offset + height && el.childy > offset + height);
											};
										} else {
											filterfunction = function(el) {
												return el.points[0].h >= 0 && el.points[3].h < chunksize; // jshint ignore:line
											};
										} */
					// link = selection.selectAll('g.link').data(selection.datum().filter(filterfunction));
					link = selection.selectAll('g.link').data(selection.datum());
					// remove exiting relationships
					link.exit().remove();
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
								x: path.endpoint.x,
								y: path.endpoint.y
							}, path.direction);
						});

						if (showCritical && d.isCritical) {
							rsline.style('stroke', criticalColor);
							rsarrow.styles({
								'stroke': criticalColor,
								'fill': criticalColor
							});
						} else {
							rsline.attr('style', null);
							rsarrow.attr('style', null);
						}
					});
				};

				// Scale up generated points with current scales (only known on server)
				function generatePoints(rl) {
					// just scale up the points with the current scales and calculate halfy
					var points = rl.points;
					var direction = 'down';
					points[0].x = scaleX(points[0].t);
					points[1].x = scaleX(points[1].t);
					points[2].x = scaleX(points[2].t);
					points[3].x = scaleX(points[3].t);

					points[0].y = (getY(points[0])) + scaleY(points[0].hadjust);
					if (getY(points[0]) > getY(points[3])) {
						points[0].y = getY(points[0]) + 1 - scaleY(points[0].hadjust);
						points[3].y = getY(points[3]) + 1 + 4 - scaleY(points[3].hadjust);
						direction = 'up';
					} else {
						points[0].y = getY(points[0]) + scaleY(points[0].hadjust);
						points[3].y = getY(points[3]) + scaleY(points[3].hadjust);
						direction = 'down';
					}

					points[1].y = (points[3].y - points[0].y) * 0.5 + points[0].y;
					points[2].y = (points[3].y - points[0].y) * 0.5 + points[0].y;

					// limit to visible viewport
					/*					_.forEach(points, function(point) {
											if (point.y < (offset - height)) {
												point.y = offset - height;
											} else if (point.y > (height + offset + height)) {
												point.y = height + offset + height;
											}
										}); */

					return {
						path: rline(points),
						endpoint: {
							x: points[3].x,
							y: points[3].y
						},
						direction: direction
					};

					function getY(point) {
						var yid = verticalindex.get(point.h);
						return yid || 0;
					}
				}

				function generateArrow(width, height, coord, direction) {
					var arrowpath;
					switch (direction) {
						case 'up':
							arrowpath = 'M ' + (coord.x + width * 0.5) + ' ' + (coord.y) +
								' h ' + (-width) + ' l ' + (width * 0.5) + ' ' + (-height) + ' Z';
							break;
						case 'left':
							arrowpath = 'M ' + (coord.x) + ' ' + (coord.y + (height * 0.5)) +
								' v ' + (-height) + ' l ' + (-height) + ' ' + (+width * 0.5) + ' Z';
							break;
						case 'right':
							arrowpath = 'M ' + (coord.x) + ' ' + (coord.y - (height * 0.5)) +
								' v ' + (height) + ' l ' + (height) + ' ' + (-width * 0.5) + ' Z';
							break;
						/* jshint -W086 */ // fall-through intended: 'down' is also default case
						case 'down':
						default:
							arrowpath = 'M ' + (coord.x - width * 0.5) + ' ' + (coord.y - height) +
								' h ' + (width) + ' l ' + (-width * 0.5) + ' ' + (height) + ' Z';
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
				relationships_.height = function (newheight) {
					if (!arguments.length) {
						return height;
					}
					height = newheight;
					return this;
				};
				relationships_.verticalIndex = function (x) {
					if (!arguments.length) {
						return verticalindex;
					}
					verticalindex = x;
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

			// component for table
			/* PRINT only */
			activitytable: function activitytable() {
				var columns = [],
					columnwidths = [],
					headers = [],
					position = 'top',
					page = 1,
					printadjustment = 0; // set to -1 if in printmode
				// private stuff
				var scale = d3.scaleLinear();

				var activitytable_ = function (selection) {
					var table = selection;
					var thead = selection.select('thead'),
						tfoot = selection.select('tfoot'),
						tbody = selection.select('tbody');

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
									column: column,
									value: row[column]
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

			activitylabels: function activitylabels() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(),
					getY = function () {
						return [0, 50];
					};

				var activitylabels_ = function (selection) {
					var domain = scale.extendeddomain();
					var texts = selection.selectAll('g.label').data(selection.datum().filter(function (item) {
						return item.Code && item.PlannedFinish > domain[0] &&
							item.PlannedStart < domain[1];
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
							x: scale(d.PlannedStart),
							y: y1
						};
						var end = {
							x: scale(d.PlannedFinish),
							y: y2
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

			progresslines: function progresslines() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(),
					height = 500,
					offset = 0,
					scroll = false,
					verticalIndex = new Map(),
					progressdates = new Map(),
					colorscale = d3.scaleOrdinal(d3.schemeCategory10),
					rline = d3.line()
						.x(function (d) {
							return d.x;
						})
						.y(function (d) {
							return d.y;
						})
						.curve(d3.curveStepBefore),
					printmode = false;

				function generateProgresspoints(dateparam) {
					var date = dateparam.date;
					var modifiedoffset = scroll ? offset - 1000 : offset;
					var modifiedheight = scroll ? height + 2000 : height;
					var progressdate;
					// add start point
					var points = [{
						x: scale(date),
						y: modifiedoffset
					}]; // start point
					verticalIndex.forEach(function (v, k) { // points in between
						progressdate = getProgressDate(date, k); // getProgressdate should return date if no match
						if (progressdate) {
							points.push({
								x: scale(progressdate.stateDate),
								y: v
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
						x: scale(date),
						y: lastelement + (printmode ? defaultrowheightprint : defaultrowheight)
					});
					points.push({
						x: scale(date),
						y: modifiedheight
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

			/* screen only */
			relationshiphandles: function relationshiphandles() {
				// private 'static' stuff (functions and members)
				var scale = d3.scaleUtc(),
					getY = function () {
						return [0, 50];
					},
					onMoving = function () {
					},
					onMovedMin = _.noop(),
					onMovedMed = _.noop(),
					onMovedMax = _.noop(),
					onDetailIconClicked = _.noop(),
					handledata = {
						id: -1,
						start: null,
						middle: null,
						end: null,
						leftend: true
					};

				var relationshiphandles_ = function (selection) {
					var data = selection.datum().filter(function (item) {
						return handledata[0].relationshipmode && getY.has(item.Id);
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
						var leftend = handledata[0].fixedleftend === null ?
							handledata[0].leftend : handledata[0].fixedleftend;
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
							.attr('x', handledata[1].leftend ?
								scale(handledata[1].start) - 6 : scale(handledata[1].end) + 1)
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
				var scale = d3.scaleUtc(),
					durationOn = 250,
					durationOff = 450,

					labels = {
						'scheduling.main.plannedStart': 'Start',
						'scheduling.main.plannedFinish': 'Finish',
						'scheduling.main.plannedDuration': 'Duration'
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
									label = '<b>' + d.eventtype + '<\/b> ' + d.desc +
										'<br>' + moment(d.start).format('LL');
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
									label = '<b>' + d.code + '<\/b> ' + d.desc +
										'<br><br><b>' + labels['scheduling.main.plannedStart'] + '<\/b> ' + moment(d.start).format('LL') +
										'<br><b>' + labels['scheduling.main.plannedFinish'] + '<\/b> ' + moment(d.end).format('LL') +
										/*  TBD WBS element code (german: PSP) and description not implemented yet */
										'<br><b>' + labels['scheduling.main.plannedDuration'] + '<\/b> ' + duration;
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