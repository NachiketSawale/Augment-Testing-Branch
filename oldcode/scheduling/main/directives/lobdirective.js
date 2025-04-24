/* global d3: false, globals, _ */
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
angular.module('scheduling.main').directive('schedulingMainLobChartDirective', ['schedulingMainChartbase', 'schedulingMainService', 'schedulingMainLobService', '$timeout', '$translate', function (chart, schedulingMainService, ls, $timeout, $translate) {
	'use strict';

	return {
		link: link,
		restrict: 'A',
		scope: true,
		templateUrl: globals.appBaseUrl + 'scheduling.main/templates/lob.html',
		controller: 'schedulingMainLobController'
	};

	function link(scope, element) {
		var chartdiv, frame1;
		var size = {
			width: 1000,
			height: 500,
			viewportWidth: 1200,
			contentHeight: 800,
			timeaxisheight: 60,
			marginS: 0,
			/* was 5 */
			marginM: 8,
			/* was 8 */
			scrollbarwidth: 20
		};

		function settings() {
			return ls.getSettings(scope.getContainerUUID());
		}

		var layers = {};
		var lasttimerange = [];
		var timescale, zoomedscale, timeaxis, timeaxisTop, holidaybars, weekendbars, calendarlineobject, locationbar,
			activityarrows,
			activitylabels, locationaxis, selectionobject, timelineobject, tooltip;
		var zoom = {
			behavior: null,
			lastscale: 0.95,
			lasttranslate: [10, 0],
			factor: 1.148698355,
			direction: 'vertical', // default is 'horizontal',
			verticalFactor: 1
		};
		var firstrun = true;
		var locationbarIsdragging = false;
		var tooltipqueue = []; // holds currently 'touched' activities
		var handledata = {
			id: -1,
			start: null,
			middle: null,
			end: null
		};

		var containerScope = scope.$parent;
		while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
			containerScope = containerScope.$parent;
		}

		scope.$on('$destroy', function cleanupHandlers() {
			// save settings
			ls.saveSettings(ls.lastContainerID);
			ls.disconnectFromUsingDataServices(scope.getContainerUUID()); // GUID was stored on scope
			ls.dataUpdated.unregister(updateDataAndDraw);
			ls.dataUpdated.unregister(resetOnehundred);
			ls.selectionChanged.unregister(updateDataAndDraw);
			ls.forceLayoutUpdate.unregister(onResize);
			schedulingMainService.unregisterListLoaded(resetOnehundred);
			zoom.behavior.on('zoom', null);
		});

		setupDrawing(); // setup Drawing *before* setting up data listener

		// We will listen to a single combined update event (that is combined in LOB service)
		// which will cause a re-draw of all elements
		// Performance-wise this does no more work than when scrolling or zooming
		ls.connectToUsingDataServices(scope.getContainerUUID()); // GUID was stored on scope;
		ls.dataUpdated.register(updateDataAndDraw);
		ls.dataUpdated.register(resetOnehundred);
		ls.selectionChanged.register(updateDataAndDraw);

		// Now trigger loading of data (from controller)
		schedulingMainService.registerListLoaded(resetOnehundred);
		ls.load(scope.getContainerUUID());

		addLocationbarHandle();

		// initial resize
		setSize();
		adjustHeights();

		// weg mit initial resize geht nicht

		$timeout(updateDataAndDraw, 300); // initial draw for services that were already loaded at the start

		function resetOnehundred() {
			// only reset one hundred if maximum or minimum has actually changed
			var currenttimerange = ls.getTimeRange(scope.getContainerUUID());
			if (!currenttimerange[0].isSame(lasttimerange[0], 'day') || !currenttimerange[1].isSame(lasttimerange[1], 'day')) {
				timescale.domain(currenttimerange).range([0, size.viewportWidth]).startDate(currenttimerange[0]).endDate(currenttimerange[1]); // reset timescale
			}

			resetZoomHorizontal();
			lasttimerange[0] = moment(currenttimerange[0]); // clone start and endtimes
			lasttimerange[1] = moment(currenttimerange[1]); // clone start and endtimes
		}

		// setup layers and components without data yet
		function setupDrawing() { // called once. sets up document and d3 scales and components.
			chartdiv = d3.select(element[0]);
			frame1 = d3.select(element[0]).select('svg.frame1');
			layers.axis = chartdiv.select('div.bottomaxis svg.bottomaxis');
			layers.topaxis = chartdiv.select('div.topaxis svg.topaxis');
			layers.weekend = frame1.select('g.weekend');
			layers.holiday = frame1.select('g.holiday');
			layers.viewport = chartdiv.select('div.viewport');
			layers.locationline = frame1.select('g.locationline');
			layers.calendarline = frame1.select('g.calendarline');
			layers.activityarrows = frame1.select('g.activityarrows');
			layers.timeline = frame1.select('g.timeline');
			layers.activitylabels = frame1.select('g.activitylabels');
			layers.selection = frame1.select('g.selection');
			layers.locationbar = frame1.select('g.locationbar');

			timescale = chart.timescale().domain(ls.timerange).range([0, size.viewportWidth]).startDate(ls.timerange[0]).endDate(ls.timerange[1]); // setup timescale. * REALLY important to already setup a range here *.
			timeaxis = chart.timeaxis().scale(timescale).orientation('bottom').translations({
				weekAbbreviation: ls.translations['scheduling.main.calendar.weekAbbreviation'],
				weekNumberFormat: ls.translations['scheduling.main.calendar.weekNumberFormat']
			});
			timeaxisTop = chart.timeaxis().scale(timescale).orientation('top');
			zoom.behavior = d3.zoom().scaleExtent([0.0064, 60000])
				.translateExtent([
					[-Infinity, 0],
					[+Infinity, size.contentHeight]
				])
				.on('zoom', zoomAndDraw); // setup zoom behavior
			frame1.call(zoom.behavior).on('dblclick.zoom', null);

			// setup holiday component
			holidaybars = chart.holidays().scale(timescale);
			weekendbars = chart.weekends().scale(timescale);
			// setup vertical lines
			calendarlineobject = chart.calendarlines().scale(timescale);
			locationbar = chart.locations();
			activityarrows = chart.activityarrows().scale(timescale).getY(locationbar.getY)
				.handleData(handledata)
				.clickHandler(function setSelected(d) {
					if (d) {
						d3.event.stopPropagation();
						ls.setSelectedActivity(d);
					}
				})
				.enter(function (d) {
					var tooltipinfo = {
						type: 'activity',
						id: d.Id,
						xkey: d.PlannedStart,
						y: locationbar.getY(d.LocationFk)[0],
						desc: d.Description,
						code: d.Code,
						start: d.PlannedStart,
						end: d.PlannedFinish,
						duration: d.PlannedDuration
					};
					tooltipqueue.push(tooltipinfo);
					chartdiv.call(tooltip); // calling draw would be too expensive
				})
				.exit(function () {
					tooltipqueue.length = 0;
					chartdiv.call(tooltip); // calling draw would be too expensive
				});
			locationaxis = d3.axisRight().scale(d3.scaleLinear()).tickFormat('').tickValues(locationbar.tickValues());
			activitylabels = chart.activitylabels().scale(timescale).getY(locationbar.getY);
			selectionobject = chart.handles().scale(timescale).originalscale(timescale).getY(locationbar.getY).handleData(handledata)
				.onMoving(zoomSwitch)
				.onMovedMin(ls.validatePlannedMove)
				.onMovedMed(ls.validatePlannedStart)
				.onMovedMax(ls.validatePlannedFinish)
				.page1(frame1);
			tooltip = chart.tooltip().scale(timescale).labels(ls.translations);
			timelineobject = chart.timelines().scale(timescale).height(size.contentHeight);

			scope.onContentResized(onResize);
			ls.forceLayoutUpdate.register(onResize);
		}

		// Puts toolbar functions on the scope so the toolbar controller can access them
		function setupToolsHorizontal() {
			zoom.direction = 'horizontal';
			containerScope.containerID = scope.getContainerUUID();
			containerScope.zoomIn = function zoomIn() {
				var newtransform = d3.zoomTransform(frame1.node());
				newtransform.k = newtransform.k * 1.1;
				zoomAndDraw(newtransform);
			};
			containerScope.zoomOut = function zoomOut() {
				var newtransform = d3.zoomTransform(frame1.node());
				newtransform.k = newtransform.k * 0.9;
				zoomAndDraw(newtransform);
			};
			containerScope.resetZoom = resetOnehundred;
		}

		function setupToolsVertical() {
			var newtransform = d3.zoomTransform(frame1.node());
			zoom.lastscale = newtransform.k;
			zoom.lasttranslate = [newtransform.x, 0];

			zoom.direction = 'vertical';
			containerScope.containerID = scope.getContainerUUID();
			containerScope.zoomIn = function zoomIn() {
				var newtransform = d3.zoomTransform(frame1.node());
				zoom.verticalFactor = zoom.verticalFactor * 1.1;
				if (zoom.verticalFactor > 5) {
					zoom.verticalFactor = 5;
				}
				zoomAndDraw(newtransform);
			};
			containerScope.zoomOut = function zoomOut() {
				var newtransform = d3.zoomTransform(frame1.node());
				zoom.verticalFactor = zoom.verticalFactor * 0.9;
				if (zoom.verticalFactor < 1) {
					zoom.verticalFactor = 1;
				}
				zoomAndDraw(newtransform);
			};
			containerScope.resetZoom = resetZoomVertical;
		}

		containerScope.verticalMode = setupToolsVertical;
		containerScope.horizontalMode = setupToolsHorizontal;

		function resetZoomHorizontal() {
			var newtransform = d3.zoomTransform(frame1.node());
			newtransform.k = 0.95;
			newtransform.x = 10;
			newtransform.y = 0;
			zoomAndDraw(newtransform);
		}

		function resetZoomVertical() {
			var newtransform = d3.zoomTransform(frame1.node());
			zoom.verticalFactor = 1;
			zoomAndDraw(newtransform);
		}

		// needed for mouse pointer events if browser zoom is not 100 %
		function transformed(x, y) {
			var svgElement = frame1.node();
			var svgPoint = svgElement.createSVGPoint();
			svgPoint.x = x;
			svgPoint.y = y;
			svgPoint = svgPoint.matrixTransform(svgElement.getScreenCTM().inverse());
			svgPoint.x = svgPoint.x.toFixed(2);
			svgPoint.y = svgPoint.y.toFixed(2);
			return svgPoint;
		}

		function addLocationbarHandle() {
			var locationbardrag = d3.drag()
				.on('start', function () {
					var bar = d3.select(this);
					locationbarIsdragging = true;
					bar.attr('fill', '#bcb4b0');
				})
				.on('drag', function () {
					var bar = d3.select(this);
					locationbarIsdragging = true;
					var pagePoint = transformed(d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY);
					if (pagePoint.x > 70 && pagePoint.x <= 940) {
						bar.attr('x', pagePoint.x);
					}
				})
				.on('end', function () {
					var bar = d3.select(this);
					locationbarIsdragging = false;
					var pagePoint = transformed(d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY);
					bar.attr('fill', '#e6e6e6');
					if (pagePoint.x < 70) {
						pagePoint.x = 70;
					}
					if (pagePoint.x > 940) {
						pagePoint.x = 940;
					}
					var updateLocationbar = _.debounce(function () {
						settings().locationbarwidth = pagePoint.x + 10;
						locationbar.width((pagePoint.x + 10));
						layers.locationbar.call(locationbar);
						layers.locationbar.call(locationbar);
						draw();
					}, 240);
					updateLocationbar();
				});
			layers.locationbarhandle = frame1.append('g').classed('locationbarhandle', true);
			layers.locationbarhandle.append('rect').classed('locationbarhandle', true)
				.attrs({
					y: 0,
					width: 10,
					fill: '#e6e6e6',
					cursor: 'ew-resize'
				})
				.styles({
					'pointer-events': 'all',
					'opacity': 0
				})
				.on('mouseover', function () {
					var bar = d3.select(this);
					bar.transition().duration(240).style('opacity', 1);
				})
				.on('mouseout', function () {
					var bar = d3.select(this);
					if (!locationbarIsdragging) {
						bar.transition().duration(240).style('opacity', 0);
					}
				})
				.call(locationbardrag);
		}

		// setup layers with data (will be repeated after each data update)
		function updateDataAndDraw() {
			if (firstrun) {
				setupToolsHorizontal();
				setSize(false);
				adjustHeights();
				setSize(true);
				firstrun = false;
			}

			setSize();
			adjustHeights();
			updateData();
			draw();

			function updateData() {
				// 1st modify timescale as all other controls depend on it
				timescale.workingDays(ls.workingDays).showWeekends(settings().showWeekends).holidays(ls.exceptionDates).showHolidays(settings().showHolidays);
				if (zoomedscale) {
					zoomedscale.workingDays(ls.workingDays).showWeekends(settings().showWeekends).holidays(ls.exceptionDates).showHolidays(settings().showHolidays);
				}

				// In theory we would only need to assign data to layers once. However in many cases the identity of the arrays
				// is not preserved by the service, that is it returns a new array instead of modified existing array.
				var locations = ls.getLocations(scope.getContainerUUID());
				if (locations.length > 0) {
					chartdiv.selectAll('div').style('visibility', 'visible');
					chartdiv.select('h1').text('').style('visibility', 'collapse');
					layers.locationbar.datum({
						Locations: ls.getLocations(scope.getContainerUUID())
					}, itemId);
				} else {
					chartdiv.selectAll('div').style('visibility', 'collapse');
					chartdiv.select('h1').text($translate.instant('scheduling.main.nolob')).style('visibility', 'visible');
				}
				layers.holiday.datum(settings().showHolidays ? ls.holidays : []);
				layers.weekend.datum(settings().showWeekends ? ls.weekends : []);
				calendarlineobject.tickvalues(timeaxis.tickvalues()).showVerticalLines(settings().showVerticalLines);
				layers.calendarline.datum(settings().verticalLines);
				layers.activityarrows.datum(ls.lobActivities, itemId);
				activityarrows.showCritical(settings().showCritical).showLocationConnections(settings().showLocationConnections)
					.showProgress(settings().showProgress).exceptionDays(ls.exceptionDates);
				layers.timeline.datum([settings().showTimelines ? ls.timelines : []]);
				layers.activitylabels.datum(ls.getLabels(scope.getContainerUUID()), itemId);
				layers.selection.datum(ls.getSelectedActivity(scope.getContainerUUID()), itemId);
				setHandleData();
				chartdiv.datum(tooltipqueue, itemId);
			}
		}

		function itemId(item) {
			if (!item) {
				return;
			} // TBD how can this be? bug in labels. need to investigate further
			return item.Id || item.id;
		}

		function setHandleData() {
			var selected = ls.getSelectedActivity(scope.getContainerUUID());
			if (selected.length > 0) {
				handledata.id = selected[0].Id;
				handledata.start = selected[0].PlannedStart;
				handledata.end = selected[0].PlannedFinish;
				handledata.readonlyStart = ls.readonlyStart();
				handledata.readonlyFinish = ls.readonlyFinish();
			} else {
				handledata.id = -1;
				handledata.start = null;
				handledata.end = null;
				handledata.readonlyStart = false;
				handledata.readonlyFinish = false;
			}
		}

		function draw() {
			if (!ls.hasLocations || !settings()) {
				return;
			}
			// this is a hack, calling it twice. to be resolved.
			layers.locationbar.call(locationbar); // calling locationbar first to get the real locationbar width
			layers.locationbar.call(locationbar); // calling locationbar first to get the real locationbar width

			// now readjust some widths;
			size.viewportWidth = size.width - locationbar.actualWidth() - size.scrollbarwidth;
			timescale.range([0, size.viewportWidth]);
			locationaxis.tickSize(size.viewportWidth).tickValues(locationbar.tickValues());
			frame1.style('width', (size.width + size.scrollbarwidth) + 'px');
			frame1.select('svg.maincontent').attr('width', size.viewportWidth);
			layers.topaxis.attr('width', size.viewportWidth).attr('height', size.timeaxisheight);
			layers.axis.attr('width', size.viewportWidth).attr('height', size.timeaxisheight);

			var position = settings().timescalePosition;
			if (position === 'both' || position === 'top') {
				frame1.select('g.maincontent').attr('transform', 'translate(' + locationbar.actualWidth() + ',0)');
			} else {
				frame1.select('g.maincontent').attr('transform', 'translate(' + locationbar.actualWidth() + ',0)');
			}
			layers.axis.attr('transform', 'translate(' + locationbar.actualWidth() + ', 0)');
			layers.topaxis.attr('transform', 'translate(' + locationbar.actualWidth() + ', 0)');

			if (position === 'both') {
				frame1.select('rect.hidetickstop').attr('width', locationbar.actualWidth() - 1).attr('y', 0);
				frame1.select('rect.hideticksbottom').attr('width', locationbar.actualWidth() - 1).attr('y', size.contentHeight + size.timeaxisheight);
			} else if (position === 'top') {
				frame1.select('rect.hidetickstop').attr('width', locationbar.actualWidth() - 1).attr('y', 0);
				frame1.select('rect.hideticksbottom').attr('width', 0).attr('y', 0);
			} else if (position === 'bottom') {
				frame1.select('rect.hidetickstop').attr('width', 0).attr('y', 0);
				frame1.select('rect.hideticksbottom').attr('width', locationbar.actualWidth() - 1).attr('y', size.contentHeight);
			} else {
				frame1.select('rect.hidetickstop').attr('width', 0).attr('y', 0);
				frame1.select('rect.hideticksbottom').attr('width', 0).attr('y', 0);
			}

			// call all other components
			if (position === 'both' || position === 'top') {
				layers.axis.attr('transform', 'translate(' + locationbar.actualWidth() + ', 0)');
				layers.topaxis.call(timeaxisTop);
				chartdiv.select('div.topaxis').style('height', null); // will remove the height style
			} else {
				layers.axis.attr('transform', 'translate(' + locationbar.actualWidth() + ', 0)');
				layers.topaxis.selectAll('g').remove();
				chartdiv.select('div.topaxis').style('height', 0);
				layers.topaxis.attr('height', 0);
			}

			if (position === 'both' || position === 'bottom') {
				layers.axis.call(timeaxis);
				chartdiv.select('div.axis').style('height', null); // will remove the height style
			} else {
				layers.axis.selectAll('g').remove();
				chartdiv.select('div.axis').style('height', 0);
				layers.axis.attr('height', 0);
			}
			layers.weekend.call(weekendbars);
			layers.holiday.call(holidaybars);
			layers.locationline.call(locationaxis);
			layers.calendarline.call(calendarlineobject);
			layers.activityarrows.call(activityarrows);
			layers.timeline.call(timelineobject);
			layers.activitylabels.call(activitylabels);
			layers.activitylabels.call(activitylabels);
			layers.selection.call(selectionobject);
			layers.selection.call(selectionobject);
			chartdiv.call(tooltip);

			layers.locationbarhandle.select('rect.locationbarhandle')
				.attrs({
					x: locationbar.actualWidth() - 10,
					height: size.contentHeight,
				});
		}

		// Will also call draw again
		function onResize() {
			setSize(false);
			adjustHeights();
			setSize(true);
			zoomAndDraw(d3.zoomTransform(frame1.node()), true);
		}

		// called initially as well as on container resize
		// Widths can only be adjusted after drawing locationbar
		function adjustHeights() {
			timescale.range([0, size.width]);
			var position = settings().timescalePosition;
			holidaybars.height(size.contentHeight);
			weekendbars.height(size.contentHeight);
			calendarlineobject.height(size.contentHeight).tickvalues(timeaxis.tickvalues());
			locationbar.height(size.contentHeight);
			timelineobject.height(size.contentHeight);
			frame1.attr('height', null).attr('width', null);
			frame1.style('height', size.contentHeight + 'px'); // add 1 px space for border
			frame1.select('rect.maincontent').attr('width', size.width).attr('height', size.contentHeight);
			frame1.select('rect.topaxis').attr('width', size.width).attr('height', size.timeaxisheight);
			frame1.select('rect.axis').attr('width', size.width).attr('height', size.timeaxisheight);
			if (position === 'both' || position === 'top') {
				frame1.select('rect.maincontent').attr('y', size.timeaxisheight + size.marginS);
				frame1.select('g.maincontent').attr('transform', 'translate(0, 0)');
				layers.locationbar.attr('transform', 'translate(0, 0)');
			} else {
				frame1.select('rect.maincontent').attr('y', 0);
				frame1.select('g.maincontent').attr('transform', 'translate(0, 0)');
				layers.locationbar.attr('transform', 'translate(0,0)');
			}
			if (position === 'top') {
				frame1.select('rect.topaxis').style('visibility', 'visible');
				frame1.select('rect.axis').style('visibility', 'hidden');
			} else if (position === 'bottom') {
				frame1.select('rect.topaxis').style('visibility', 'hidden');
				frame1.select('rect.axis').style('visibility', 'visible').attr('y', (size.contentHeight + size.marginS));
			} else if (position === 'both') {
				frame1.select('rect.topaxis').style('visibility', 'visible');
				frame1.select('rect.axis').style('visibility', 'visible').attr('y', (size.contentHeight + size.marginS + size.timeaxisheight));
			} else {
				frame1.select('rect.topaxis').style('visibility', 'hidden');
				frame1.select('rect.axis').style('visibility', 'hidden');
			}
		}

		function zoomSwitch(transform) {
			if (zoom.direction === 'vertical') {
				onResize();
			} else if (zoom.direction === 'horizontal') {
				if (transform) {
					zoomAndDraw(transform);
				} else {
					draw();
				}
			}
		}

		function zoomAndDraw(myTransform) {
			setSize();

			var transform = myTransform || d3.event.transform;
			transform.y = 0;
			if (zoom.direction === 'vertical') {
				transform.k = zoom.lastscale;
				transform.x = zoom.lasttranslate[0];
				if (d3.event && d3.event.sourceEvent.wheelDelta > 0) {
					zoom.verticalFactor *= 1.1;
					if (zoom.verticalFactor > 5) {
						zoom.verticalFactor = 5;
					}

				} else if (d3.event && d3.event.sourceEvent.wheelDelta < 0) {
					zoom.verticalFactor *= 0.9;
					if (zoom.verticalFactor < 1) {
						zoom.verticalFactor = 1;
					}
				}

			}
			zoomedscale = transform.rescaleX(timescale);
			timeaxisTop.scale(zoomedscale);
			timeaxis.scale(zoomedscale);
			weekendbars.scale(zoomedscale);
			holidaybars.scale(zoomedscale);
			locationaxis.scale(zoomedscale);
			calendarlineobject.scale(zoomedscale).tickvalues(timeaxis.tickvalues());
			activityarrows.scale(zoomedscale);
			timelineobject.scale(zoomedscale);
			activitylabels.scale(zoomedscale);
			selectionobject.scale(zoomedscale);
			tooltip.scale(zoomedscale);

			adjustHeights();
			draw();
		}

		function setSize(containerAlso) {
			var noOfTimelines;
			var dimension = scope.getCurrentDimensions();
			if (!dimension || !_.isNumber(dimension.width) || !_.isNumber(dimension.height)) {
				console.warn('invalid heights from layout system');
			} else {
				size.width = dimension.width > 210 ? dimension.width : 210;
				size.height = dimension.height > 100 ? dimension.height : 100;
			}
			var position = settings().timescalePosition;
			layers.locationbarhandle.select('rect.locationbarhandle').attr('y', 0);
			var locationbarwidth = settings().locationbarwidth;
			locationbar.width(locationbarwidth);

			if (position === 'bottom' || position === 'top') {
				noOfTimelines = 1;
			} else if (position === 'both') {
				noOfTimelines = 2;
			} else {
				noOfTimelines = 0;
			}

			size.contentHeight = size.height * zoom.verticalFactor - size.timeaxisheight * noOfTimelines - size.marginS;
			size.outerContentHeight = size.height - size.timeaxisheight * noOfTimelines - size.marginS;
			if (containerAlso) {
				d3.select('div.viewport1').style('height', (size.outerContentHeight + 'px')).style('overflow-y', 'scroll')
					.style('overflow-x', 'hidden')
					.style('width', (size.width) + 'px');
				$timeout(function () {
					frame1.style('height', null); // first remove the style to trigger a re-draw in browser
				}, 0);
				$timeout(function () {
					frame1.style('height', size.contentHeight + 'px');
				}, 0);
			}
		}
	}
}]);