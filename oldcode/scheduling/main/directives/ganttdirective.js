/* global d3: false, globals, moment */
// noinspection JSAnnotator
/**
 * @ngdoc directive
 * @name scheduling.main.directive:schedulingMainLobChartDirective
 * @element
 * @restrict A
 * @priority
 * @scope
 * @description
 * # LobChartDirective
 * The LobChartDirective wraps the LOB chart control. It requires the schedulingMainLOBService to
 * provide it with data and the schedulingMainService to share the selected item. The
 * schedulingMainLOBService also stores settings during a session.
 */
angular.module('scheduling.main').directive('schedulingMainGanttDirective', ['_', 'schedulingMainChartbase', 'schedulingMainGANTTService', 'schedulingMainService', function (_, chart, gs, activityservice) {
	'use strict';
	return {
		priority: 10, link: link, restrict: 'A', scope: false, templateUrl: globals.appBaseUrl + 'scheduling.main/templates/gantt.html', controller: 'schedulingMainGANTTController'
	};

	// Main difference to print version:
	// 1. gety-Method that gets info from gridapi
	// 2. different / additional event handlers --> grid events will result in an data updated event

	function link(scope, element) {
		var chartdiv, basestatic, staticpanel;
		scope.size = {
			width: 1000, containerHeight: 800, contentHeight: 725, viewportHeight: 725
		};

		function settings() {
			return gs.getSettings(scope.getContainerUUID());
		}

		var layers = {};
		var lasttimerange = [];
		var defaultrowheight = 25;
		var timescale, zoomedscale, verticalscale, timeaxis, bottomaxis, holidaybars, weekendbars, activitybars, splits, calendarlineobject, barinfos, eventobject, lastscreeny = 0, timelineobject, notes, relationshipobject, tooltip, progresslines,
			selectionobject, rsselection, dragline, hammock, lastselectionid = -1;
		var lasttransform = {
			x: -1, y: 0, k: -1
		}, verticalcounter = 0;
		scope.lastverticaloffset = 0; // for determining scrolling speed
		var handledata = {
			id: -1, start: null, middle: null, end: null, relationshipmode: false, leftend: false, fixedleftend: null, newy: 0, autoscrollX: d3.timer(_.noop), autoscrollY: d3.timer(_.noop)
		};
		var zoom = {
			behavior: null, factor: 1.148698355
		};
		var drawmode = {
			overlay: false, yfit: 0, baseactivityId: 0, autoscrollX: d3.timer(_.noop), autoscrollY: d3.timer(_.noop)
		};
		var hammockmode = {
			active: false
		};
		var firstrun = true;
		var relationshipend = {
			id: -1, start: null, end: null, leftend: true, overbackground: true
		};

		function transformed(x, y) {
			var svgElement = basestatic.node();
			var svgPoint = svgElement.createSVGPoint();
			svgPoint.x = x;
			svgPoint.y = y;
			svgPoint = svgPoint.matrixTransform(svgElement.getScreenCTM().inverse());
			svgPoint.x = svgPoint.x.toFixed(2);
			svgPoint.y = svgPoint.y.toFixed(2);
			return svgPoint;
		}

		var relationshipdrag = d3.drag()
			.on('start', function (d) {
				if (handledata.relationshipmode && (d.bartype.editable || d.bartype.milestone)) {
					d3.event.sourceEvent.stopPropagation(); // silence other listeners, e.g. stop panning of chart
					handledata.fixedleftend = handledata.leftend;
					if (d.bartype.milestone) {
						handledata.fixedleftend = false;
						handledata.leftend = false;
					}
					var pagePoint = transformed(d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY);
					layers.selection.select('line.fromto').remove();
					dragline = layers.selection.append('line').classed('fromto', true)
						.attrs({
							'stroke': 'steelblue', 'stroke-dasharray': '5, 1', 'x1': pagePoint.x, 'y1': pagePoint.y, 'x2': pagePoint.x, 'y2': pagePoint.y
						});
				}
			})
			/* jshint -W074 */ // Cyclomatic complexity
			.on('drag', function (d) {
				var pagePoint = transformed(d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY);
				var newy = pagePoint.y;
				var newx = pagePoint.x;
				handledata.newy = newy;
				if (handledata.relationshipmode && (d.bartype.editable || d.bartype.milestone)) {
					var cssClass = d3.event.sourceEvent.target.getAttribute('class');
					// Check if we are over background, that is not over rect.activity
					if (cssClass !== '' && (cssClass === 'background' || cssClass === 'activity' || cssClass === 'iconend')) {
						relationshipend.overbackground = false;
					} else {
						relationshipend.overbackground = true;
						layers.selection.select('rect.targetindicator').remove();
					}

					if (newx >= (timescale.range()[1] - 20)) {
						handledata.autoscrollX.restart(autoScrollRight, 33, 33);
					} else if (newx <= (timescale.range()[0] + 20)) {
						handledata.autoscrollX.restart(autoScrollLeft, 33, 33);
					} else {
						handledata.autoscrollX.stop();
					}

					var lowerLimit = scope.verticalOffset;
					var upperLimit = scope.verticalOffset + scope.size.viewportHeight;
					if (newy >= upperLimit) {
						handledata.autoscrollY.restart(autoScrollDown, 33, 33);
					} else if (newy <= lowerLimit) {
						handledata.autoscrollY.restart(autoScrollUp, 33, 33);
					} else {
						handledata.autoscrollY.stop();
					}

					newx = newx < timescale.range()[0] ? timescale.range()[0] : newx; // x-limits
					newx = newx > timescale.range()[1] ? timescale.range()[1] : newx;
					dragline.attr('x2', newx).attr('y2', newy);
				}

				function autoScrollUp() {
					return autoscrollY(false);
				}

				function autoScrollDown() {
					return autoscrollY(true);
				}

				// scrollByOffset
				function autoscrollY(direction) {
					if (_.isFunction(scope.scrollByOffset)) {
						scope.scrollByOffset(direction ? 5 : -5);
						handledata.newy += direction ? 5 : -5;
						if (handledata.newy < (scope.verticalOffset + 5)) { // lower limit
							handledata.newy = scope.verticalOffset + 5;
						}
						if (handledata.newy > (scope.verticalOffset + scope.size.contentHeight)) { // upper limit
							handledata.newy = scope.verticalOffset + scope.size.contentHeight;
						}
						dragline.attr('y2', handledata.newy);
					}
					draw();
					return !handledata.autoscrollY;
				}

				function autoScrollRight() {
					return autoscrollX(true);
				}

				function autoScrollLeft() {
					return autoscrollX(false);
				}

				function autoscrollX(direction) {
					var transform = d3.zoomTransform(basestatic.node());
					transform.x += direction ? -5 : 5;
					// var newscale = zoomedscale || timescale.copy();
					// newscale = transform.rescaleX(newscale);
					var newx = parseInt(dragline.attr('x1'));
					newx += direction ? -5 : 5;
					// dragline.attr('x1', newscale(d.start));
					dragline.attr('x1', newx);
					zoomAndDraw(transform);
				}
			})
			.on('end', function (d) {
				handledata.autoscrollX.stop();
				handledata.autoscrollY.stop();
				if (handledata.relationshipmode && (d.bartype.editable || d.bartype.milestone)) {
					layers.selection.select('line.fromto').remove();
					// create relationship, reset stuff, draw();
					if (!relationshipend.overbackground && handledata.id !== -1 && relationshipend.id !== -1 && handledata.id !== relationshipend.id) {
						var type;
						// now we have all the data to create a relationship
						if (handledata.fixedleftend === false && relationshipend.leftend === false) {
							type = 2;
						} else if (handledata.fixedleftend === true && relationshipend.leftend === false) {
							type = 3;
						} else if (handledata.fixedleftend === true && relationshipend.leftend === true) {
							type = 4;
						} else if (handledata.fixedleftend === false && relationshipend.leftend === true) {
							type = 1;
						}
						gs.addRelationship(handledata.id, relationshipend.id, type, false);
					}
					turnoffRelationshipMode();
				}
			});

		var tooltipqueue = []; // holds currently 'touched' activities

		scope.$on('$destroy', function cleanupHandlers() {
			toggleHammockMode(true);
			hammockmode.toolbaritem = null; // destroy reference
			unregisterExternalHandlers();
			gs.clearMaps(scope.getContainerUUID());
			tooltipqueue.length = 0;
			gs.disconnectFromUsingDataServices(scope.getContainerUUID()); // GUID was stored on scope
			gs.dataUpdated.unregister(updateDataAndDraw);
			gs.selectionChanged.unregister(updateSelection);
			// gs.collectionChanged.unregister(resetOnehundred);
			gs.scrolling.unregister(scrollViewport);
			gs.requestRedraw.unregister(onResizeAndZoom);
			activityservice.unregisterListLoaded(load); // this handler should be in ganttservice, but containerID is only known in directive or controller therefore triggered from here.
			window.removeEventListener('resize', onResize); // workaround for bug in layout system.
			zoom?.behavior?.on('zoom', null);
			basestatic?.on('dblclick', null);
			staticpanel?.on('dblclick', null);
			// scope.onContentResized is not deregistered because scope with it's messengers get's destroyed
		});

		// Now trigger loading of data (from controller)
		load().then(function () {

			setupDrawing(); // setup Drawing *before* setting up data listener
			setupTools();

			// We will listen to a single combined update event (that is combined in LOB service)
			// which will cause a re-draw of all elements
			// Performance-wise this does no more work than when scrolling or zooming
			registerExternalHandlers();
			registerSecondaryHandlers();
			updateDataAndDraw(true);
		});

		function resetOnehundred() {
			// only reset one hundred if maximum or minimum has actually changed
			var currenttimerange = gs.getTimeRange(scope.getContainerUUID());
			if (!currenttimerange[0].isSame(lasttimerange[0], 'day') || !currenttimerange[1].isSame(lasttimerange[1], 'day')) {
				timescale.domain(currenttimerange).range([0, scope.size.width]).startDate(currenttimerange[0]).endDate(currenttimerange[1]); // reset timescale
			}

			resetZoom();
			lasttimerange[0] = moment(currenttimerange[0]); // clone start and endtimes
			lasttimerange[1] = moment(currenttimerange[1]); // clone start and endtimes
		}

		// following handlers were moved from service to controller because they need containerID not known in service
		function registerExternalHandlers() {
			gs.connectToUsingDataServices(scope.getContainerUUID()); // GUID was stored on scope;
			gs.selectionChanged.register(updateSelection);
			// gs.collectionChanged.register(resetOnehundred);
			gs.scrolling.register(scrollViewport);
			activityservice.registerListLoaded(load); // re-trigger loading of complimentary services of activity service that are not child services of main service

			// we will need to react to activity service's  activity loaded and updated events.
			// in this case we check if the resulting no. of schedule ids has in fact changed.
			// in addition we need to react to activity services's baseline created event.
			activityservice.registerBaselineCreated(loadBaselineNew);
			activityservice.registerListLoaded(loadBaseline);
			activityservice.registerListLoaded(resetOnehundred); // initial resize
			activityservice.registerUpdateDone(loadBaseline);
			gs.registerBaselinesChanged(loadBaselineActivities);
		}

		// These handlers may only be attached AFTER the inital load is complete.
		function registerSecondaryHandlers() {
			gs.dataUpdated.register(updateDataAndDraw);
			gs.requestRedraw.register(onResizeAndZoom);
			gs.savePosition.register(reactToSplitterChange);
		}

		function unregisterExternalHandlers() {
			gs.selectionChanged.unregister(updateSelection);
			activityservice.unregisterListLoaded(load);
			activityservice.unregisterBaselineCreated(loadBaselineNew);
			activityservice.unregisterListLoaded(loadBaseline);
			activityservice.unregisterListLoaded(resetOnehundred);
			activityservice.unregisterUpdateDone(loadBaseline);
			gs.unregisterBaselinesChanged(loadBaselineActivities);
			gs.savePosition.unregister(reactToSplitterChange);
		}

		var oldtime, newtime;

		function reactToSplitterChange() {
			var pointA;
			if (moment.isMoment(newtime)) {
				oldtime = newtime.clone();
			}
			newtime = moment.utc(zoomedscale.extendedinvert(0));
			if (moment.isMoment(oldtime) && !oldtime.isSame(newtime)) { // calculate difference and apply
				pointA = zoomedscale(oldtime);
				// now re-apply some properties of the last transform
				var t = d3.zoomTransform(basestatic.node());
				t.x -= pointA;
				zoomedscale = t.rescaleX(zoomedscale);
				zoomAndDraw(t, true);
			}
		}

		function loadBaselineNew() {
			var myUUID = scope.getContainerUUID();
			gs.loadBaselines(myUUID, true).then(function () {
				gs.load(myUUID);
			}).then(function () {
				gs.update();
			});
		}

		function loadBaseline() {
			gs.loadBaselines(scope.getContainerUUID());
		}

		function loadBaselineActivities() {
			gs.loadbaselineActivities(scope.getContainerUUID());
		}

		function load() {
			return gs.load(scope.getContainerUUID());
		}

		// setup layers and components without data yet
		function setupDrawing() { // called once. sets up document and d3 scales and components.
			chartdiv = d3.select(element[0]);
			basestatic = chartdiv.select('div div.basestatic svg');
			staticpanel = chartdiv.select('div div.static svg');
			layers.axis = chartdiv.select('div.toppanel svg g.axis');
			layers.bottomaxis = chartdiv.select('div.bottompanel svg g.axis');
			layers.bottompanel = chartdiv.select('div.bottompanel');
			layers.weekend = basestatic.select('g.weekend');
			layers.holiday = basestatic.select('g.holiday');
			layers.holidaylabels = basestatic.select('g.holidaylabel');
			layers.hammock = basestatic.select('g.hammock');
			layers.calendarline = basestatic.select('g.calendarline');
			layers.timeline = staticpanel.select('g.timeline');
			layers.relationship = basestatic.select('g.relationship');
			layers.activity = basestatic.select('g.activity');
			layers.splits = basestatic.select('g.splits');
			layers.barinformation = basestatic.select('g.barinformation');
			layers.event = basestatic.select('g.event');
			layers.progressline = basestatic.select('g.progressline');
			layers.selection = staticpanel.select('g.selection');
			layers.addition = staticpanel.select('g.addition');
			var currenttimerange = gs.getTimeRange(scope.getContainerUUID());
			timescale = chart.timescale().domain(currenttimerange).range([0, scope.size.width]).startDate(currenttimerange[0]).endDate(currenttimerange[1]); // setup timescale. * REALLY important to already setup a range here *.
			zoomedscale = timescale.copy();
			zoom.behavior = d3.zoom().scaleExtent([0.0064, 60000])
				.translateExtent([[-Infinity, 0], [+Infinity, scope.size.viewportHeight]])
				.on('zoom', zoomAndDraw); // setup zoom behavior
			basestatic.call(zoom.behavior); // .on('dblclick.zoom', null);
			verticalscale = d3.scaleLinear().domain([0, 1]).range([0, defaultrowheight]); // just a placeholder
			timeaxis = chart.timeaxis().scale(timescale).translations({
				weekAbbreviation: gs.translations['scheduling.main.calendar.weekAbbreviation'], weekNumberFormat: gs.translations['scheduling.main.calendar.weekNumberFormat']
			});
			bottomaxis = chart.timeaxis().orientation('bottom').scale(timescale).translations({
				weekAbbreviation: gs.translations['scheduling.main.calendar.weekAbbreviation'], weekNumberFormat: gs.translations['scheduling.main.calendar.weekNumberFormat']
			});
			holidaybars = chart.holidays().scale(timescale);
			weekendbars = chart.weekends().scale(timescale);
			calendarlineobject = chart.calendarlines().scale(timescale).tickvalues(timeaxis.tickvalues()).scrollOptimization(false);
			timelineobject = chart.timelines().scale(timescale);
			relationshipobject = chart.relationships().scaleX(timescale).scaleY(verticalscale)
				.simpleMode(!settings().showSeparatedRelationships)
				.doubleClickHandler(function (d) {
					if (d) {
						d3.event.stopPropagation();
						selectionobject.offset(scope.verticalOffset);
						gs.editRelationship(d.id, scope);
					}
				});

			activitybars = chart.activities().scaleX(timescale).scaleY(verticalscale).handleData(handledata)
				.clickHandler(setSelected)
				.doubleClickHandler(activityDouble)
				.mouseoverHandler(activityMouse)
				.mouseoutHandler(activityMouseOut);
			splits = chart.splits().scale(timescale);
			notes = chart.notes().scaleX(timescale)
				.click(function (d) {
					if (!d) {
						return;
					}

					// check if d is is already in tooltipqueue. if yes, remove it
					var result = _.find(tooltipqueue, {
						id: d.id
					});
					if (result) {
						_.remove(tooltipqueue, {
							id: d.id
						});
					} else {
						// if no match add it to tooltipqueue
						var tooltipinfo = {
							type: 'note', id: d.id, activity: d, xkey: d.end, y: scope.getSource().filteredItems.get(d.id),
						};
						tooltipqueue.push(tooltipinfo);
					}
					// now call the tooltip object
					chartdiv.call(tooltip); // calling draw would be too expensive
				});

			progresslines = chart.progresslines().scale(timescale).scrollOptimization(true);

			tooltip = chart.tooltip().scale(timescale).labels(gs.translations);
			eventobject = chart.events().scale(timescale)
				.enter(function (d) {
					var tooltipinfo = {
						type: 'event', id: d.Id, xkey: d.Date, y: scope.getSource().filteredItems.get(d.ActivityFk), desc: d.Description, eventtype: gs.lookupEventtype(d), start: d.Date, end: d.EndDate
					};
					tooltipqueue.push(tooltipinfo);
					chartdiv.call(tooltip); // calling draw would be too expensive
				})
				.exit(function () {
					tooltipqueue.length = 0;
					chartdiv.call(tooltip); // calling draw would be too expensive
				});
			barinfos = chart.barinfo().scale(timescale);

			selectionobject = chart.handles().scale(timescale).originalscale(timescale).lobMode(false).handleData(handledata)
				.onMoving(zoomSwitch)
				.onMovedMin(gs.validatePlannedMove)
				.onMovedMed(gs.validatePlannedStart)
				.onMovedMax(gs.validatePlannedFinish)
				.onMovedMilestone(gs.validatePlannedStart)
				/* .onMovedMilestone(gs.validatePlannedDurationAndFinish) */
				.offset(scope.verticalOffset)
				.page1(basestatic);
			rsselection = chart.relationshiphandles()
				.scale(timescale)
				.handleData([handledata, relationshipend])
				.onMoving(zoomSwitch)
				.onDetailIconClicked(function editDetails(d) {
					d3.event.stopPropagation();
					gs.editActivity(d, scope);
				});

			hammock = chart.hammocks().scale(timescale);

			setupTools();
			adjustHeights(); // initial size adjust, called again on change of container size
			window.addEventListener('resize', onResize); // workaround for bug in layout system.
			scope.onContentResized(onResize);
			scope.verticalOffset = 0;
			currenttimerange = gs.getTimeRange(scope.getContainerUUID());
			lasttimerange[0] = moment(currenttimerange[0]); // clone start and endtimes
			lasttimerange[1] = moment(currenttimerange[1]); // clone start and endtimes
		}

		function setSelected(d) {
			d3.event.stopPropagation();
			selectionobject.offset(scope.verticalOffset);
			handledata.relationshipmode = false;
			if (!handledata.relationshipmode) {
				gs.setSelectedActivityId(d.id);
			}
			draw();
		}

		function activityDouble(d) {
			d3.event.stopPropagation();
			if (d.bartype.hammock) {
				turnoffRelationshipMode();
			} else {
				handledata.relationshipmode = !handledata.relationshipmode;
			}
			draw();
		}

		function activityMouse(d) {
			var pagePoint = transformed(d3.event.pageX, d3.event.pageY);
			relationshipend.overbackground = false;

			var selectedActivity = gs.getSelectedActivity(scope.getContainerUUID())[0];
			if (handledata.relationshipmode && !d.bartype.hammock && handledata.fixedleftend !== null && selectedActivity && d.id !== selectedActivity.Id && selectedActivity.ActivityTypeFk !== 5) {
				relationshipend.id = d.id;
				relationshipend.start = d.start;
				relationshipend.end = d.end;
				relationshipend.leftend = true; // default

				// now determine before or after
				/* jshint -W040 */ // valid d3 construct d3.select(this)
				var rectangle = d3.select(this).select('rect');
				if (!rectangle.empty()) {
					var halfmark = parseInt(rectangle.attr('x')) + parseInt(rectangle.attr('width')) * 0.5;
					if (pagePoint.x > halfmark) {
						relationshipend.leftend = false;
					} else {
						relationshipend.leftend = true;
					}
				}

				// exception milestone only ends on end (right)
				if (d.bartype.milestone) {
					relationshipend.leftend = false;
				}

				draw();
			}
			if (handledata.relationshipmode && selectedActivity && d.id === selectedActivity.Id && selectedActivity.ActivityTypeFk !== 5) {
				handledata.leftend = false; // default

				// now determine before or after
				/* jshint -W040 */ // valid d3 construct d3.select(this)
				var rectangle2 = d3.select(this).select('rect');
				if (!rectangle2.empty()) {
					var halfmark2 = parseInt(rectangle2.attr('x')) + parseInt(rectangle2.attr('width')) * 0.5;
					if (pagePoint.x < halfmark2) {
						handledata.leftend = true;
					} else {
						handledata.leftend = false;
					}
				}

				// exception milestone only start on end (right)
				if (d.bartype.milestone) {
					handledata.leftend = false;
				}
				draw();
			}
		}

		function activityMouseOut() { // Issue is that mouseout is always triggered BEFORE dragend
			if (handledata.relationshipmode && relationshipend.overbackground) {
				relationshipend.id = -1;
			}
			draw();
		}

		function turnoffRelationshipMode() {
			if (handledata.relationshipmode) {
				handledata.relationshipmode = false;
				relationshipend.id = -1;
				relationshipend.start = null;
				relationshipend.end = null;
				relationshipend.leftend = true;
				handledata.fixedleftend = null;
				updateSelection();
			}
		}

		// Puts toolbar functions on the scope so the toolbar controller can access them
		function setupTools() {
			scope.resize = onResize;
			var containerScope = scope.$parent;
			while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
				if (containerScope.$parent) {
					containerScope = containerScope.$parent;
				}
			}
			if (!_.isFunction(scope.getSource)) {
				scope.getSource = getSource;
			}
			if (!_.isFunction(scope.getRawSource)) {
				scope.getRawSource = getSource; // yes, we intentionally assign getSource to getSource AND getRawSource
			}

			containerScope.containerID = scope.getContainerUUID();
			if (!_.isFunction(containerScope.zoomIn)) {
				containerScope.zoomIn = function zoomIn() {
					var newtransform = d3.zoomTransform(basestatic.node());
					newtransform.k = newtransform.k * 1.1;
					zoomAndDraw(newtransform);
				};
			}
			if (!_.isFunction(containerScope.zoomOut)) {
				containerScope.zoomOut = function zoomOut() {
					var newtransform = d3.zoomTransform(basestatic.node());
					newtransform.k = newtransform.k * 0.9;
					zoomAndDraw(newtransform);
				};
			}
			containerScope.resetZoom = resetOnehundred;
			containerScope.toggleDrawActivity = toggleDrawActivity;
			containerScope.toggleHammockMode = toggleHammockMode;
			// creates a function that returns the visual index
			// DON'T USE directly. Use scope.getSource (as it may be overwritten)
			function getSource() {
				// map with id and visual index
				var itemsmap = new Map();
				for (var i = 0; i < gs.activities.length; i++) {
					var activity = gs.activities[i];
					itemsmap.set(activity.Id, verticalscale(i));
				}

				return {
					filteredItems: itemsmap
				};
			}

			if (!_.isFunction(containerScope.turnoffTooltips)) {
				containerScope.turnoffTooltips = function turnoffTooltips() {
					tooltipqueue.length = 0;
					chartdiv.call(tooltip);
				};
			}
		}

		function toggleHammockMode(forceOff) {
			// var escPressed;
			if (forceOff && forceOff.id === 'addHammockActivity') { // store reference to button to enable toggeling of checked state from code
				hammockmode.toolbaritem = forceOff;
				if (forceOff===true) {
					return;
				}
			}

			if (!basestatic) {
				return;
			}
			zoomAndDraw(d3.zoomTransform(basestatic.node()), true);

			// conditions for hammock mode: selected activity is of type hammock.
			var canAddHammock = gs.getHammocks(scope.getContainerUUID()).length !== 0;

			if (!hammockmode.drag) {
				hammockmode.drag = d3.drag()
					.on('start', function (e) {
						if (!e.bartype || _.findIndex(gs.getHammockActivities(scope.getContainerUUID()), function (item) {
							return item === e.id;
						}) >= 0) {
							return; // we didn't catch an activity too bad
						}
						hammockmode.draggedactivityId = e.id;

						d3.event.sourceEvent.stopPropagation(); // silence other listeners, e.g. stop panning of chart
						var pagePoint = transformed(d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY);
						hammockmode.offsetX = pagePoint.x - zoomedscale(e.start);
						hammockmode.offsetY = pagePoint.y - scope.getSource().filteredItems.get(e.id);
						hammockmode.rect = layers.addition.append('rect').classed('hammock', true)
							.attrs({
								'fill': 'steelblue',
								'stroke': 'steelblue',
								'x': pagePoint.x - hammockmode.offsetX,
								'y': pagePoint.y - hammockmode.offsetY - scope.verticalOffset,
								'width': Math.abs(zoomedscale(e.end) - zoomedscale(e.start)),
								'height': defaultrowheight
							});
					})
					.on('drag', function () {
						var pagePoint = transformed(d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY);
						if (!hammockmode.rect) {
							return;
						}
						hammockmode.rect
							.attrs({
								'x': pagePoint.x - hammockmode.offsetX, 'y': pagePoint.y - hammockmode.offsetY - scope.verticalOffset,
							});
					})
					.on('end', function () {
						if (!hammockmode.rect) {
							return;
						}

						// Check conditions for hammock creation
						// draggedactivityId is the id of the activity to add,  targetHammock is the activity we're adding hammocks to
						if (hammockmode.draggedactivityId && hammockmode.targetHammock) {
							gs.addHammockActivity(hammockmode.targetHammock.Id, hammockmode.draggedactivityId);
							// redraw is then triggered by update event of hammock service
						}

						// turn off several things
						hammockmode.draggedactivityId = -1;
						hammockmode.rect.remove();
						hammockmode.rect = null;
						// hammockmode.draggedactivityId is set to null in mouseover handler of hammock rect
					});
			}

			if (forceOff !== true && canAddHammock && !hammockmode.active) {
				hammockmode.active = true;
				// hammockmode.hammockActivities = _.clone(gs.getHammocks(scope.getContainerUUID())); // don't want to destroy selection later
				activitybars
					.clickHandler(null)
					.doubleClickHandler(null)
					.mouseoverHandler(null)
					.mouseoutHandler(null);
				layers.activity.selectAll('rect.background').call(hammockmode.drag);
				layers.activity.call(activitybars);
				layers.hammock.selectAll('rect.hammock').on('mouseover', mouseOnHammock).on('mouseout', mouseOutHammock).style('pointer-events', 'auto');
			} else if (forceOff === true || hammockmode.active) {
				if (hammockmode.toolbaritem) {
					hammockmode.toolbaritem.value = false;
				}
				hammockmode.active = false;
				layers.activity.selectAll('rect.background').on('mousedown.drag', null);
				activitybars
					.clickHandler(setSelected)
					.doubleClickHandler(activityDouble)
					.mouseoverHandler(activityMouse)
					.mouseoutHandler(activityMouseOut);
				layers.hammock.selectAll('rect.hammock').on('mouseover', null).on('mouseout', null).style('pointer-events', 'none');
				layers.activity.call(activitybars);
			}

			function mouseOnHammock(e) {
				if (e.Code) {
					hammockmode.targetHammock = e; // target hammock is of type activity
				}
				// delayed effect on
				/* jshint -W040 */ // valid d3 construct d3.select(this)
				d3.select(this).attr('stroke', 'black');
			}

			function mouseOutHammock() {
				hammockmode.targetHammock = null;
				// delayed effect off
				/* jshint -W040 */ // valid d3 construct d3.select(this)
				d3.select(this).attr('stroke', 'none');
			}
		}

		function toggleDrawActivity( /* toolbar */) {
			toggleHammockMode(true); // turn off hammock mode just in case
			var escPressed;

			drawmode.drag = d3.drag()
				.on('start', function () {
					escPressed = false;
					d3.select('body').on('keydown.gantt', handleEsc); // 'typed' event listener
					d3.event.sourceEvent.stopPropagation(); // silence other listeners, e.g. stop panning of chart
					var pagePoint = transformed(d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY);
					layers.addition.select('rect.new').remove();
					drawmode.xstart = pagePoint.x;
					drawmode.rect = layers.addition.append('rect').classed('new', true)
						.attrs({
							'fill': 'steelblue', 'opacity': 0.7, 'stroke': 'Black', 'x': pagePoint.x, 'y': drawmode.yfit, 'width': 0, 'height': defaultrowheight
						});
					drawmode.label = layers.addition.append('text')
						.attrs({
							'x': pagePoint.x + 10, 'y': drawmode.yfit + defaultrowheight / 2,
						});
				})
				.on('drag', function () {
					// Possible cancelation
					if (escPressed) {
						return;
					}

					var pagePoint = transformed(d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY);
					var newx = pagePoint.x;
					if (newx >= (timescale.range()[1] - 20)) {
						drawmode.autoscrollX.restart(autoScrollRight, 33, 33);
					} else if (newx <= (timescale.range()[0] + 20)) {
						drawmode.autoscrollX.restart(autoScrollLeft, 33, 33);
					} else {
						drawmode.autoscrollX.stop();
					}
					//
					newx = newx < timescale.range()[0] ? timescale.range()[0] : newx; // x-limits
					newx = newx > timescale.range()[1] ? timescale.range()[1] : newx;
					drawmode.xend = newx;
					var width = drawmode.xend - drawmode.xstart;
					if (width >= 0) {
						drawmode.rect.attrs({
							x: drawmode.xstart, width: width
						});
					} else {
						drawmode.rect.attrs({
							x: drawmode.xend, width: width * -1
						});
					}

					displayApproximateDuration();

					// scrollByOffset
					function autoScrollRight() {
						return autoscrollX(true);
					}

					function autoScrollLeft() {
						return autoscrollX(false);
					}

					function autoscrollX(direction) {
						var transform = d3.zoomTransform(basestatic.node());
						transform.x += direction ? -5 : 5;
						var start = drawmode.xstart <= drawmode.xend ? 'xstart' : 'xend';
						var end = drawmode.xend >= drawmode.xstart ? 'xend' : 'xstart';

						if (direction) { // scroll right
							drawmode[end] += 5;
							drawmode[start] -= 5;
						} else { // scroll left
							drawmode[start] -= 5;
							drawmode[end] += 5;
						}

						var width = drawmode.xend - drawmode.xstart;
						if (width >= 0) {
							drawmode.rect.attrs({
								x: drawmode.xstart, width: width
							});
						} else {
							drawmode.rect.attrs({
								x: drawmode.xend, width: width * -1
							});
						}

						displayApproximateDuration();

						zoomAndDraw(transform);
					}
				})
				.on('end', function () {
					// Possible cancelation
					if (escPressed) {
						d3.select('body').on('keydown.gantt', null); // only remove OUR handler and leave others alone
						return;
					}

					d3.select('body').on('keydown.gantt', null); // only remove OUR handler and leave others alone
					drawmode.autoscrollX.stop();
					drawmode.autoscrollY.stop();

					drawmode.label.remove();

					// Set Selection, then create item

					if (drawmode.baseactivityId === -1 && activityservice.getList().length > 1) {
						drawmode.baseactivityId = activityservice.getList()[1].Id;
					}

					gs.setSelectedActivityId(drawmode.baseactivityId)
						.then(gs.insertNewTask).then(function (activity) {
						// copy my start and stop date to the newly created item;
						var start = _.min([drawmode.xstart, drawmode.xend]);
						var end = _.max([drawmode.xstart, drawmode.xend]);
						activity.PlannedStart = new moment.utc(zoomedscale.extendedinvert(start)).startOf('day');
						activity.PlannedFinish = new moment.utc(zoomedscale.extendedinvert(end)).endOf('day');
						// activity.ParentActivityFk = $injector.get('schedulingMainConstantValues').activity.transientRootEntityId;

						// now trigger validation to correct those values
						gs.validatePlannedMove(activity, {
							start: activity.PlannedStart, end: activity.PlannedFinish
						});
					});

					layers.addition.select('rect.new').remove();
					draw();
				});

			if (!drawmode.overlay) {
				layers.addition.append('rect').classed('drawlayer', true).attrs({
					width: scope.size.width, height: scope.size.viewportHeight
				})
					.style('pointer-events', 'all')
					.styles({
						'cursor': 'crosshair', 'opacity': 0
					})
					.on('mouseover', onMouseOver)
					.on('mousemove', onMouseMove)
					.on('mouseout', onMouseOut);
				layers.addition.call(drawmode.drag);
			} else {
				layers.addition.style('pointer-events', 'none');
				layers.addition.selectAll('*').remove();
			}
			drawmode.overlay = !drawmode.overlay;

			function displayApproximateDuration() {
				// approximate duration
				var start = _.min([drawmode.xstart, drawmode.xend]);
				var end = _.max([drawmode.xstart, drawmode.xend]);
				var tempstart = new moment.utc(zoomedscale.extendedinvert(start)).startOf('day');
				var tempfinish = new moment.utc(zoomedscale.extendedinvert(end)).endOf('day');
				var duration = moment.duration(tempfinish.diff(tempstart));
				drawmode.label.text('≅ ' + duration.humanize());
			}

			function handleEsc() {
				escPressed = d3.event.keyCode === 27;
				if (escPressed) {
					drawmode.autoscrollX.stop();
					drawmode.autoscrollY.stop();
					layers.addition.select('rect.new').remove();
					drawmode.label.remove();
					draw();
				}
			}

			// determine y position and therefore the currently "selected" row
			// new item will be BELOW selected row
			function onMouseMove() {
				var pagePoint = transformed(d3.event.pageX, d3.event.pageY);
				var indicator = layers.addition.select('g.indicator');
				// find item. we loop through all of them. there can't be too many
				var filteredItems = scope.getSource().filteredItems;

				filteredItems.forEach(function (value, key) {
					if (pagePoint.y >= (value + defaultrowheight / 2) && pagePoint.y < (value + defaultrowheight * 1.5)) {
						drawmode.baseactivityId = key;
						drawmode.yfit = value - scope.verticalOffset + defaultrowheight / 2;
					}
				});

				indicator.style('transform', 'translateY(' + drawmode.yfit + 'px)');
			}

			// draw selection sprite
			function onMouseOver() {
				layers.addition.append('g').classed('indicator', true)
					.append('path')
					.attr('d', 'M0,' + (defaultrowheight / 2) + 'L80,00H' + scope.size.width + 'V' + defaultrowheight + 'L80,' + defaultrowheight)
					.styles({
						'fill': 'LightGray', 'opacity': 0.5
					});
			}

			// remove selection sprite
			function onMouseOut() {
				layers.addition.select('g.indicator').remove();
			}
		}

		function resetZoom() {
			const newtransform = d3.zoomTransform(basestatic.node());
			newtransform.k = 0.95;
			newtransform.x = 10;
			newtransform.y = 0;
			zoomAndDraw(newtransform);
		}

		function itemId(item) {
			if (!item) {
				return;
			} // TBD how can this be? bug in labels. need to investigate further
			return item.Id || item.id;
		}

		function setHandleData() {
			if (gs.getSelectedActivity(scope.getContainerUUID()).length > 0) {
				const selected = gs.getSelectedActivity(scope.getContainerUUID())[0];
				handledata.id = selected.Id;
				handledata.start = selected.PlannedStart;
				handledata.end = selected.PlannedFinish;
				handledata.readonlyStart = gs.readonlyStart();
				handledata.readonlyFinish = gs.readonlyFinish();
			} else {
				handledata.id = -1;
				handledata.start = null;
				handledata.end = null;
				handledata.readonlyStart = false;
				handledata.readonlyFinish = false;
			}
		}

		// update hammock and selection
		function updateSelection() {
			var source = scope.getSource();
			// turn off hammock mode
			if (activityservice.getSelected() && activityservice.getSelected().Id !== lastselectionid) {
				lastselectionid = activityservice.getSelected().Id;
				toggleHammockMode(true);
			}
			if (!activityservice.getSelected()) {
				lastselectionid = -1;
				toggleHammockMode(true);
			}
			var filtereditems = source.filteredItems;
			selectionobject.getY(filtereditems);
			rsselection.getY(filtereditems);
			layers.selection.datum(gs.getSelectedActivity(scope.getContainerUUID()), itemId);
			setHandleData();
			selectionobject.handleData(handledata).offset(scope.verticalOffset);
			layers.hammock.datum(gs.getHammocks(scope.getContainerUUID()), itemId);
			hammock.verticalIndex(filtereditems).assignedActivities(gs.getHammockActivities(scope.getContainerUUID())).color(gs.getHammockColor());
			layers.selection.call(selectionobject);
			layers.selection.call(rsselection);
			layers.hammock.call(hammock);
		}

		// setup layers with data (will be repeated after each data update)
		function updateDataAndDraw(force) {
			// cleanup relationships
			layers.relationship.selectAll('g.link').remove();

			updateData();
			adjustHeights();
			draw(force);
		}

		function updateData() {
			// 1st modify timescale as all other controls depend on it
			timescale.workingDays(gs.workingDays).showWeekends(settings().showWeekends).holidays(gs.exceptionDates).showHolidays(settings().showHolidays);
			if (zoomedscale) {
				zoomedscale.workingDays(gs.workingDays).showWeekends(settings().showWeekends).holidays(gs.exceptionDates).showHolidays(settings().showHolidays);
			}

			// In theory we would only need to assign data to layers once. However in many cases the identity of the arrays
			// is not preserved by the service, that is it returns a new array instead of modified existing array.
			layers.holiday.datum(settings().showHolidays ? gs.holidays : []);
			layers.holidaylabels.datum(settings().showHolidays ? gs.holidays : []);
			layers.weekend.datum(settings().showWeekends ? gs.weekends : []);
			layers.calendarline.datum(settings().verticalLines);
			layers.timeline.datum([settings().showTimelines ? gs.timelines : []]);
			layers.activity.datum(gs.getActivities(scope.getContainerUUID()), itemId);
			layers.splits.datum(gs.getBreaks(scope.getContainerUUID()), itemId);
			layers.selection.datum(gs.getSelectedActivity(scope.getContainerUUID()), itemId);
			layers.hammock.datum(gs.getHammocks(scope.getContainerUUID()), itemId);
			var source = scope.getSource();
			var filtereditems = source.filteredItems;
			calendarlineobject.verticalIndex(filtereditems).showHorizontalLines(true) /* we say horizontal lines on is the default */
				.showVerticalLines(settings().showVerticalLines);
			layers.relationship.datum(gs.getFilteredRelationships(scope.getContainerUUID(), filtereditems, source.sortColumn, scope.getRawSource().filteredItems), itemId);
			selectionobject.getY(filtereditems).middle(gs.getMiddle(scope.getContainerUUID()));
			rsselection.getY(filtereditems);
			splits.verticalIndex(filtereditems);
			activitybars.verticalIndex(filtereditems)
				.showCritical(settings().showCritical).splits(gs.getSplits(scope.getContainerUUID))
				.progresssplits(gs.getProgressSplits(scope.getContainerUUID));
			notes.verticalIndex(filtereditems);
			layers.barinformation.datum(gs.getActivityInfo(scope.getContainerUUID()));
			barinfos.verticalIndex(filtereditems);
			relationshipobject.verticalIndex(filtereditems).showCritical(settings().showCritical).simpleMode(!settings().showSeparatedRelationships);
			eventobject.verticalIndex(filtereditems).icons(gs.icondefinitions).templateMap(gs.eventicons);
			layers.event.datum(gs.getEvents(scope.getContainerUUID()));
			layers.progressline.datum(gs.getProgresslines(scope.getContainerUUID()));
			progresslines.progressDates(gs.progressdates).verticalIndex(filtereditems);
			hammock.verticalIndex(filtereditems).version(gs.getAccessProperty(scope.getContainerUUID())).assignedActivities(gs.getHammockActivities(scope.getContainerUUID())).color(gs.getHammockColor());
			setHandleData();
			chartdiv.datum(tooltipqueue, itemId);
		}

		function scrollViewport(a, b) {
			var verticalOffset = b || scope.verticalOffset;
			if (handledata.id > 0) {
				selectionobject.offset(verticalOffset);
				layers.selection.call(selectionobject);
			}
			calendarlineobject.verticalIndex(scope.getSource().filteredItems);

			layers.holidaylabels.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.hammock.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.calendarline.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.relationship.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.activity.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.splits.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.barinformation.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.event.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.progressline.attr('transform', 'translate(0, ' + -verticalOffset + ')')

			adjustHeights();
			verticalUpdate();
		}

		function verticalUpdate() {
			layers.weekend.call(weekendbars);
			layers.holiday.call(holidaybars);
			layers.calendarline.call(calendarlineobject);
			layers.timeline.call(timelineobject);
		}

		function draw(forceRedraw) {
			if (!gs.getSettings(scope.getContainerUUID()) || !gs.getActivities(scope.getContainerUUID())) {
				return;
			}

			layers.axis.call(timeaxis);
			var showBottomAxis = gs.getSettings(scope.getContainerUUID()).timescalePosition === 'both' ? true : false;
			if (showBottomAxis) {
				layers.bottomaxis.call(bottomaxis);
				layers.bottompanel.style('border-width', '3px 0 0 0');
			} else {
				layers.bottomaxis.selectAll('g').remove();
				layers.bottompanel.style('border-width', '0');
			}

			// only draw if horizontal movement or big vertical movement
			if (forceRedraw || horizontalMovement() || verticalMovement()) {
				calendarlineobject.tickvalues(timeaxis.tickvalues()).verticalIndex(scope.getSource().filteredItems);
				verticalUpdate();
			}

			relationshipobject.offset(scope.verticalOffset);
			relationshipobject.headerOffset((scope.getSource().showFilterRow ? scope.filterRowHeight : 0));
			layers.relationship.call(relationshipobject);
			layers.relationship.call(relationshipobject); // we need to draw it twice because of relationship alternation
			layers.activity.call(activitybars);
			layers.splits.call(splits);
			if (settings().showNoteIcon) {
				layers.activity.call(notes);
			} else { // Can't elegantly set note's data source to empty array b/c notes and activitybars share same data source
				layers.activity.selectAll('g.notes').remove();
			}
			layers.activity.selectAll('g.activities').call(relationshipdrag);
			layers.barinformation.call(barinfos);
			layers.event.call(eventobject);
			layers.progressline.call(progresslines);
			layers.selection.call(selectionobject);
			layers.selection.call(rsselection);
			layers.hammock.call(hammock);
			chartdiv.call(tooltip);
		}

		// Returns true if there is zooming or horizontal movement
		function horizontalMovement() {
			var t = d3.zoomTransform(basestatic.node());
			var newt = {
				k: t.k, x: t.x, y: 0
			};
			var result = _.isEqual(newt, lasttransform);
			lasttransform.k = t.k;
			lasttransform.x = t.x;
			return !result;
		}

		// Returns true if vertical movement is greater than one page
		function verticalMovement() {
			var result1 = Math.abs(scope.verticalOffset - scope.lastverticaloffset) > 200; // scope.size.containerHeight;
			var result2 = verticalcounter > 20;
			if (verticalcounter > 20) {
				verticalcounter = 0;
			}
			verticalcounter++;
			scope.lastverticaloffset = scope.verticalOffset;
			return result2 || result1;
		}

		// Will also call draw again
		function onResize() {
			adjustHeights();
			draw();
		}

		function onResizeAndZoom() {
			// if no data there should be no triggering this
			updateData();
			if (gs.getActivities(scope.getContainerUUID())) {
				zoomAndDraw(d3.zoomTransform(basestatic.node()), true);
			}
		}

		// called initially as well as on container resize; also on row count changed as this affects scroller
		function adjustHeights() {
			if (!scope.combinedMode) {
				let success = true;
				var dimension
				try {
					dimension = scope.getCurrentDimensions();
				} catch {
					success = false;
					console.warn('invalid heights from layout system');
				}
				if (success && (!dimension || !_.isNumber(dimension.width) || !_.isNumber(dimension.height))) {
					success = false;
					console.warn('invalid heights from layout system');
				}

				if (success) {
					scope.size.containerHeight = dimension.height;
					scope.size.viewportHeight = dimension.height;
					scope.size.width = dimension.width;
				}
			}

			timescale.range([0, scope.size.width]);

			if (firstrun) { // on first opening zoom to 95 %.
				// zoom.behavior.scale(zoom.lastscale).translate(zoom.lasttranslate);
				firstrun = false;
			}

			var source = scope.getSource();
			// console.log(source.filteredItems.get(248695)); // 33 höher wenn filterrow an; kein unterschied zwischen vorletztem und letztem

			if (source && source.showFilterRow) { // Workaround for DEV-9247 / DEV-9196
				staticpanel.style('height', (scope.size.viewportHeight + 26 + 9) + 'px');
				basestatic.style('height', (scope.size.viewportHeight + 26 + 9) + 'px');
			} else if (source && source.showMainTopPanel) { // Workaround for DEV-9247 / DEV-9196
				staticpanel.style('height', (scope.size.viewportHeight - 17) + 'px');
				basestatic.style('height', (scope.size.viewportHeight - 17) + 'px');
			} else {
				staticpanel.style('height', scope.size.viewportHeight + 'px');
				basestatic.style('height', scope.size.viewportHeight + 'px');
			}

			// scrollbar hack
			// var contentHeight = scope.size.contentHeight <= scope.size.viewportHeight ? scope.size.contentHeight + 30 : scope.size.contentHeight;

			// basestatic.style('height', contentHeight + 'px');
			holidaybars.height(scope.size.viewportHeight);
			relationshipobject.offset(scope.verticalOffset).height(scope.size.viewportHeight);
			relationshipobject.headerOffset((scope.getSource().showFilterRow ? scope.filterRowHeight : 0));
			calendarlineobject.offset(scope.verticalOffset).height(scope.size.viewportHeight);
			weekendbars.height(scope.size.viewportHeight);
			progresslines.offset(scope.verticalOffset).height(scope.size.viewportHeight);
			timelineobject.offset(0).height(scope.size.viewportHeight); // offset(scope.verticalOffset)
		}

		function zoomSwitch(transform) {
			if (transform) {
				zoomAndDraw(transform);
			} else {
				draw();
			}
		}

		function zoomAndDraw(myTransform, forceRedraw) {
			if (d3.event && d3.event.sourceEvent && d3.event.sourceEvent.ctrlKey) {
				var diff = d3.event.sourceEvent.screenY - lastscreeny;
				var limiteddiff = 1;
				if (diff > 0) {
					limiteddiff = 1;
				} else if (diff < 0) {
					limiteddiff = -1;
				} else if (diff > 100 || diff < 100) {
					limiteddiff = 0;
				}
				lastscreeny = d3.event.sourceEvent.screenY;
				scope.scrollByOffset(limiteddiff * defaultrowheight);
				return;
			}

			var transform = myTransform || d3.event.transform;
			transform.y = 0;
			zoomedscale = transform.rescaleX(timescale);
			timeaxis.scale(zoomedscale);
			bottomaxis.scale(zoomedscale);
			weekendbars.scale(zoomedscale);
			holidaybars.scale(zoomedscale);
			calendarlineobject.scale(zoomedscale);
			timelineobject.scale(zoomedscale);
			relationshipobject.scaleX(zoomedscale);
			activitybars.scaleX(zoomedscale);
			splits.scale(zoomedscale);
			notes.scaleX(zoomedscale);
			barinfos.scale(zoomedscale);
			eventobject.scale(zoomedscale);
			progresslines.scale(zoomedscale);
			selectionobject.scale(zoomedscale);
			rsselection.scale(zoomedscale);
			tooltip.scale(zoomedscale);
			hammock.scale(zoomedscale);

			adjustHeights();
			draw(forceRedraw);
		}
	}
}]);
