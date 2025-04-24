/* global d3 */
/**
 * @ngdoc directive
 * @name cloud.platform.directive:ganttDirective
 * @element div
 * @restrict A
 * @$scope child $scope
 * @description
 * Generic GANTT directive for multiple modules. To configure it provide a controller via the attribute 'ctrl'
 *
 */
angular.module('platform').directive('simpleGanttDirective', ['chartbase', 'ganttbase', '$injector', function (chart, gantt, $injector) {
	'use strict';

	return {
		link: link,
		restrict: 'A',
		$scope: false,
		templateUrl: globals.appBaseUrl + 'app/components/gantt/templates/gantt.html',
	};

	function link($scope, el, attr, ctrl) {
		var $timeout = $injector.get('$timeout'),
			barItems,
			calendarline,
			cs,
			d3isready = false,
			defaultrowheight = 25,
			element = $(el[0]),
			elementd3 = d3.select(el[0]),
			grid,
			gridid = $scope.leftGridId, // $scope.getContainerUUID(),
			gridviewport,
			gs = {},
			holiday,
			lastsplitterstate = {},
			layers = {},
			locks,
			root = elementd3.select('div.gantt'),

			mainPanel = root.select('div div.viewport svg.chart'),
			mainViewService = $injector.get('mainViewService'),
			platformGridAPI = $injector.get('platformGridAPI'),
			relationships,
			selector,
			splitter,
			splitterstate = {
				left: 40,
				right: 60,
				leftcollapsed: false,
				rightcollapsed: false
			},
			timeaxis,
			timescale,
			verticalIndex,
			verticalScale,
			weekend,
			zoom = {
				behavior: null,
				lastscale: 0.95,
				lasttranslate: [10, 0],
				factor: 1.148698355,
				extentx: 1000,
				minimum: 0.0064,
				maximum: 6000
			},
			zoomedscale;
			const basestatic = elementd3.select('div div.basestatic svg');
			const staticpanel = elementd3.select('div div.staticpanel svg');

		var ganttMoveModeTools = [{
			id: 'ganttMoveModes',
			sort: 2,
			iconClass: 'tlb-icons ico-move-day',
			type: 'dropdown-btn',
			caption: 'platform.gantt.moveModes',
			showTitles: false,
			list: {
				showImages: true,
				cssClass: 'dropdown-menu-right',
				activeValue: 'day',
				items: [{
					id: 'auto',
					caption: 'platform.gantt.auto',
					type: 'radio',
					value: 'auto',
					iconClass: 'tlb-icons ico-move-automatic',
					fn: function () {
						setGanttMoveMode(this);
					}
				}, {
					id: 'hour',
					caption: 'platform.gantt.hour',
					type: 'radio',
					value: 'hour',
					iconClass: 'tlb-icons ico-move-hour',
					fn: function () {
						setGanttMoveMode(this);
					}
				}, {
					id: 'day',
					caption: 'platform.gantt.day',
					type: 'radio',
					value: 'day',
					iconClass: 'tlb-icons ico-move-day',
					fn: function () {
						setGanttMoveMode(this);
					}
				}, {
					id: 'week',
					caption: 'platform.gantt.week',
					type: 'radio',
					value: 'week',
					iconClass: 'tlb-icons ico-move-week',
					fn: function () {
						setGanttMoveMode(this);
					}
				}]
			}
		}];

		$scope.activeMoveMode = 'day'; // default move mode
		function setGanttMoveMode(element) {
			$scope.activeMoveMode = element.id;
			selector.moveMode($scope.activeMoveMode);

			// set active mode in toolbar
			var moveModes = _.find($scope.tools.items, {
				'id': 'ganttMoveModes'
			});
			moveModes.iconClass = _.find(moveModes.list.items, {
				'id': element.id
			}).iconClass;
			$scope.tools.update();
		}

		$scope.$on('$destroy', function cleanupHandlers() {
			platformGridAPI.events.unregister(gridid, 'onSort', postponedUpdate);
			platformGridAPI.events.unregister(gridid, 'onRenderCompleted', updateContentSizes);
			platformGridAPI.events.unregister(gridid, 'onHeaderToggled', onContainerResize);
			platformGridAPI.events.unregister(gridid, 'onScroll', onScroll);
			platformGridAPI.events.unregister(gridid, 'onRowCountChanged', onContainerResize);

			$scope.leftGridDataService.unregisterListLoaded(dataLoaded);
			$scope.onUpdateDone.unregister(update);
			$scope.leftGridDataService.scrolling.unregister(scrollViewport);
			$scope.leftGridDataService.ganttDataLoaded.unregister(ganttDataLoaded);

			window.removeEventListener('resize', onContainerResize); // workaround for bug in layout system.
		});

		setup(); // setup drawing and handlers;
		update(); // initial update; later updates via handler;
		onContainerResize(); // initial sizing

		function dataLoaded() {
			timescale.domain([$scope.timeRange.start, $scope.timeRange.end]).range([0, getChartWidth()]).startDate($scope.timeRange.start).endDate($scope.timeRange.end);
			update();
			resetZoom();
		}

		function resetZoom() {
			var newtransform = d3.zoomTransform(root.node());
			newtransform.k = 0.95;
			newtransform.x = 10;
			newtransform.y = 0;
			zoomAndDraw(newtransform);
		}

		function setSelected(baritem) {
			var item = $scope.leftGridDataService.getItemById(baritem.id);
			var entities;
			if (item) {
				entities = $scope.leftGridDataService.getSelectedEntities();
				if (_.isArray(entities)) {
					entities.push(item);
				} else {
					entities = [item];
				}
				$scope.leftGridDataService.setSelectedEntities(entities);
				$scope.leftGridDataService.setSelected(item);
			}
		}

		function setup() {
			cs = $scope.chartService;

			setupLayers();
			setupGridandSplitter();
			setupTools();
			setupDrawing();
			setupHandlers();

			function setupLayers() {
				// setup layers
				layers.axis = root.select('g.axis');
				layers.viewport = root.select('div div.viewport');
				layers.barItems = basestatic.select('g.bar-items');
				layers.locks = basestatic.select('g.locks');
				layers.relationships = basestatic.select('g.relationships');
				layers.selection = staticpanel.select('g.selection');
				layers.calendarline = basestatic.select('g.calendarline');
				layers.holiday = basestatic.select('g.holiday');
				layers.weekend = basestatic.select('g.weekend');
			}

			function setupDrawing() {
				// setup components
				zoom.behavior = d3.zoom()
					.on('zoom', zoomAndDraw)
					.on('end', endZoom) // setup zoom behavior
					.extent([
						[0, 0],
						[zoom.extentx, 1000 /* $scope.size.viewportHeight */]
					])
					.scaleExtent([zoom.minimum, zoom.maximum]);

				root.call(zoom.behavior);
				verticalScale = d3.scaleLinear().domain([0, 1]).range([0, defaultrowheight]);
				verticalIndex = $scope.getGridState().filteredItems;
				timescale = chart.timescale().domain([$scope.timeRange.start, $scope.timeRange.end]).range([0, getChartWidth()]).startDate($scope.timeRange.start).endDate($scope.timeRange.end);
				timeaxis = chart.timeaxis().scale(timescale);/*.translations({
					weekAbbreviation: gs.translations['scheduling.main.calendar.weekAbbreviation'],
					weekNumberFormat: gs.translations['scheduling.main.calendar.weekNumberFormat']
				});*/
				calendarline = chart.calendarlines().scale(timescale).tickvalues(timeaxis.tickvalues()).maintickvalues(timeaxis.maintickvalues()).showVerticalLines(true).showHorizontalLines(true);
				holiday = chart.holidays().scale(timescale).scrollOptimization(false);
				weekend = chart.weekends().scale(timescale).scrollOptimization(false);
				barItems = gantt.barItems().scaleX(timescale).scaleY(verticalScale).verticalIndex(verticalIndex).clickHandler(setSelected);
				locks = chart.locks().scaleX(timescale).verticalIndex(verticalIndex);
				relationships = gantt.relationships().scaleX(timescale).scaleY(verticalScale).verticalIndex(verticalIndex);
				selector = chart.handles().scale(timescale).originalscale(timescale).zoom(zoom.behavior).verticalIndex(verticalIndex).rootElement(root).moveMode($scope.activeMoveMode)
					.onMoving(draw)
					.moveCanvas(zoomAndDraw)
					.onMovedMin(validateStart)
					.onMovedMed(validateFull)
					.onMovedMax(validateFinish);
				/*
								.onMovedMilestone(gs.validatePlannedDurationAndFinish)
								.offset(scope.verticalOffset)
								.page1(mainpanel); */
				$scope.selectedIds = [];
				d3isready = true;

				adjustHeights();
			}

			function validateFull(element) {
				if (!_.isUndefined($scope.validationService) && !_.isUndefined($scope.validationService.validateActivity)) {
					$scope.validationService.validateActivity(element, element.BarStart, element.BarEnd);
				}
				update(0);
			}

			function validateStart(element) {
				if (!_.isUndefined($scope.validationService) && !_.isUndefined($scope.validationService.validateActivity)) {
					$scope.validationService.validateActivity(element, element.BarStart);
				}
				update(0);
			}

			function validateFinish(element) {
				if (!_.isUndefined($scope.validationService) && !_.isUndefined($scope.validationService.validateActivity)) {
					$scope.validationService.validateActivity(element, null, element.BarEnd);
				}
				update(1000);
			}

			function setupHandlers() {
				$scope.onUpdateDone.register(update);
				platformGridAPI.events.register(gridid, 'onSort', postponedUpdate);
				platformGridAPI.events.register(gridid, 'onRenderCompleted', updateContentSizes);
				$scope.leftGridDataService.registerListLoaded(dataLoaded);
				$scope.leftGridDataService.scrolling.register(scrollViewport);
				$scope.leftGridDataService.ganttDataLoaded.register(ganttDataLoaded);
			}
		}

		function ganttDataLoaded() {
			update();
		}

		function update(time, withTransition) {
			if (_.isUndefined(time)) {
				time = 0;
			}
			$timeout(function () {
				updateData();
				draw(null, withTransition);
			}, time);
		}

		function updateData() {
			verticalIndex = $scope.getGridState().filteredItems;
			barItems.verticalIndex(verticalIndex);
			locks.verticalIndex(verticalIndex);
			relationships.verticalIndex(verticalIndex);
			selector.selectedIds($scope.selectedIds).verticalIndex(verticalIndex);
			layers.barItems.datum($scope.itemList);
			layers.locks.datum($scope.itemList);
			layers.selection.datum($scope.itemList);
			$scope.relationshipList = $scope.leftGridMappingService.mapRelationships($scope.unmappedRelationshipList, $scope.leftGridData);
			layers.relationships.datum(filterRelationships($scope.relationshipList, verticalIndex));

			var calendarData = $scope.leftGridMappingService.getCalendarChartData($scope.leftGridDataService);
			$scope.holidays = (!_.isUndefined(calendarData.holidays) && calendarData.holidays.length > 0) ? calendarData.holidays : [];
			$scope.weekends = (!_.isUndefined(calendarData.WeekendDaysIso) && calendarData.WeekendDaysIso.length > 0) ? calendarData.WeekendDaysIso : [];
			layers.holiday.datum($scope.holidays || []);
			layers.weekend.datum($scope.weekends || []);
			calendarline.tickvalues(timeaxis.tickvalues()).maintickvalues(timeaxis.maintickvalues()).verticalIndex(verticalIndex);
			layers.calendarline.datum([]);
		}

		function filterRelationships(relationshipList, verticalIndex) {
			return _.filter(relationshipList, function (relationship) {
				return verticalIndex.has(relationship.parentid) && verticalIndex.has(relationship.childid); // todo: new attributes SuccessorFk and PredesesorFk
			});
		}

		function draw(el, withTransition) {
			$scope.isMoving = (!_.isNil(el));

			if (!_.isUndefined($scope.validationService) && !_.isUndefined($scope.validationService.validateActivityOnDraw)) {
				$scope.validationService.validateActivityOnDraw(el, $scope);
				$scope.itemList = $scope.leftGridMappingService.mapElements($scope.leftGridData);
				$scope.relationshipList = $scope.leftGridMappingService.mapRelationships($scope.unmappedRelationshipList, $scope.leftGridData);
				layers.relationships.datum(filterRelationships($scope.relationshipList, verticalIndex));
			}

			if (withTransition) {
				layers.axis.transition().call(timeaxis);
				layers.barItems.transition().call(barItems);
				layers.locks.transition().call(locks);
				layers.relationships.transition().call(relationships);
				layers.selection.transition().call(selector);
				layers.holiday.transition().call(holiday);
				layers.weekend.transition().call(weekend);
				layers.calendarline.transition().call(calendarline);
			} else {
				layers.axis.call(timeaxis);
				layers.barItems.call(barItems);
				layers.locks.call(locks);
				layers.relationships.call(relationships);
				layers.selection.call(selector);
				layers.holiday.call(holiday);
				layers.weekend.call(weekend);
				layers.calendarline.call(calendarline);
			}

		}

		function zoomAndDraw(myTransform) {
			if (!d3isready) {
				return;
			}
			var transform = myTransform || d3.event.transform || d3.zoomIdentity;
			transform.y = 0;

			// Defaults if no range limit is set
			var translateextendleft = -Infinity,
				translateextendright = +Infinity;
			zoom.behavior.scaleExtent([zoom.minimum, zoom.maximum]);

			if (moment.isDuration($scope.timeRangeLimit[0])) {
				translateextendleft = timescale(moment.utc($scope.timeRange.start).subtract($scope.timeRangeLimit[0])) - timescale(moment.utc($scope.timeRange.start));
				zoom.behavior.scaleExtent([1, zoom.maximum]);
			}

			// possible optimization: recalculate only when k is changed
			if (moment.isDuration($scope.timeRangeLimit[1])) {
				// var translateextendright = (extentx-width)/transform.k+b1-b+width; //Works for width 750
				translateextendright = (zoom.extentx - getChartWidth()) / transform.k + timescale(moment.utc($scope.timeRange.end).add($scope.timeRangeLimit[1])) - timescale(moment.utc($scope.timeRange.end)) + getChartWidth(); // Works for width 750
				zoom.behavior.scaleExtent([1, zoom.maximum]);
			}

			zoom.behavior.translateExtent([
				[translateextendleft, 0],
				[translateextendright, 0]
			]);

			if (transform.k !== 1) { // We are zooming and re-defining the original timescale
				timescale = transform.rescaleX(timescale);
				var domain = timescale.domain();
				if ($scope.snapToDay) {
					domain[0] = moment.utc(domain[0]).startOf('d');
					domain[1] = moment.utc(domain[1]).startOf('d');
				}
				if ($scope.snapToSmallestUnit) {
					tickprovideraxis.scale(timescale);
					layer.timeaxis.call(tickprovideraxis);
					domain[0] = tickprovideraxis.tickvalues()[0];
					var index = tickprovideraxis.tickvalues().length - 1;
					domain[1] = tickprovideraxis.tickvalues()[index];
				}
				// Absolute minimum: one day visible
				var mindomain = moment.utc(domain[0]).add(1, 'd');
				if (moment.utc(domain[1]).isBefore(mindomain)) {
					domain[1] = mindomain;
				}

				timescale.domain(domain).range([0, getChartWidth()]);
				reassignScales(timescale);
				// adjustHeights();
				// update();
				transform.k = 1;
				transform.x = 0;
			} else { // We are panning and just translating the zoomed timescale
				zoomedscale = transform.rescaleX(timescale);
				zoomedscale.range([0, getChartWidth()]);
				reassignScales(zoomedscale);
			}
			adjustHeights();
			update();
		}

		function endZoom() {
			if (!$scope.snapToDay && !$scope.snapToSmallestUnit) {
				return;
			}
			var transform = d3.event ? d3.event.transform : d3.zoomIdentity;
			var start, end;
			if ($scope.snapToDay) {
				start = zoomedscale(moment.utc('2010-01-01'));
				end = zoomedscale(moment.utc('2010-01-02'));
			}
			if ($scope.snapToSmallestUnit) {
				start = zoomedscale(tickprovideraxis.tickvalues()[0]);
				end = zoomedscale(tickprovideraxis.tickvalues()[1]);
			}
			var oneunitwidth = end - start;
			transform.y = 0;
			var superx = Math.round(transform.x / oneunitwidth) * oneunitwidth;
			transform.x = superx;
			zoomedscale = transform.rescaleX(timescale);
			reassignScales(zoomedscale);
			update(0, false); // true would be with transition, but components are not prepared yet
		}

		// don't forget to add any new component to be drawn here
		function reassignScales(timescale) {
			timeaxis.scale(timescale);
			calendarline.scale(timescale);
			barItems.scaleX(timescale);
			locks.scaleX(timescale);
			relationships.scaleX(timescale);
			selector.scale(timescale);
			holiday.scale(timescale);
			weekend.scale(timescale);
		}

		// Grid and Splitter Stuff
		function saveSplitterState() {
			if (!_.isEqual(splitterstate, lastsplitterstate)) {
				mainViewService.customData(gridid, 'splitterstate', splitterstate);
				_.assign(lastsplitterstate, splitterstate);
			}
		}

		function setupGridandSplitter() {
			_.assign(splitterstate, mainViewService.customData(gridid, 'splitterstate'));
			_.assign(lastsplitterstate, splitterstate);
			// Grid
			grid = platformGridAPI.grids.element('id', gridid);
			// Register several events of the data view
			platformGridAPI.events.register(gridid, 'onHeaderToggled', onContainerResize);
			platformGridAPI.events.register(gridid, 'onScroll', onScroll);

			// Splitter
			splitter = element.find('div.ganttsplitter').kendoSplitter({
				panes: [{
					collapsible: true,
					size: splitterstate.left + '%',
					collapsed: splitterstate.leftcollapsed
				}, {
					collapsible: true,
					size: splitterstate.right + '%',
					collapsed: splitterstate.rightcollapsed
				}],
				orientation: 'horizontal',
				collapse: function (e) {
					if (e.pane.nextElementSibling) { // left panel {
						splitterstate.leftcollapsed = true;
					} else { // right panel.
						splitterstate.rightcollapsed = true;
					}
					saveSplitterState();
				},
				expand: function (e) {
					if (e.pane.nextElementSibling) { // left panel {
						splitterstate.leftcollapsed = false;
					} else { // right panel.
						splitterstate.rightcollapsed = false;
					}
					saveSplitterState();
				}
			});
			splitter.data('kendoSplitter').bind('resize', onContainerResize);

			// Resize
			$scope.verticalOffset = 0;
			$scope.size = $scope.size || {};
			window.addEventListener('resize', onContainerResize); // workaround for bug in layout system.
			$scope.onContentResized(onContainerResize);
			platformGridAPI.events.register(gridid, 'onRowCountChanged', onContainerResize);
			onContainerResize(); // initial resize
			$timeout(onContainerResize, 50); // initial resize (TWICE). We always resize the grid twice. Timeout because we don't really know when the grid is finished with resizing
		}

		// Note: if stylewise the header row or group row is changed, we will need to change these pixel adjustments
		function adaptHeaders() {
			var openpanels = 0,
				bottomheight = 0;
			var args = arguments[1];
			if (args) {
				openpanels += args.grouppanel ? 1 : 0;
				openpanels += args.findpanel ? 1 : 0;
			} else {
				openpanels = getOpenPanels();
			}

			var paddings = [{
				lefttop: 55,
				middle: 55,
				righttop: 10
			}, {
				lefttop: 19,
				middle: 13,
				righttop: 10
			}, {
				lefttop: 10,
				middle: -2,
				righttop: 37
			}];

			elementd3.select('div.gridspacer').style('height', paddings[openpanels].lefttop + 'px'); // looks bad if animated
			const localgrid = platformGridAPI.grids.element('id', gridid);
			if (localgrid && localgrid.instance && localgrid.instance.getOptions().showFilterRow) {
				elementd3.select('div.gridwrapper').style('height', ($scope.size.containerHeight - 27) + 'px');
			} else {
				elementd3.select('div.gridwrapper').style('height', ($scope.size.containerHeight - paddings[openpanels].middle - bottomheight) + 'px');
			}

			elementd3.select('div.toppanel').transition().duration(240).style('padding-top', paddings[openpanels].righttop + 'px');
			resizeCanvas();
		}

		function getOpenPanels() {
			var openpanels = 0;
			if (gridIsReady(gridid)) { // gridcheck. global event handler could be called after grid is already destroyed
				openpanels += grid.instance.groupPanelVisibility() ? 1 : 0;
				openpanels += grid.instance.getOptions().showMainTopPanel ? 1 : 0;
			}
			return openpanels;
		}

		// OnContainerResize may be called *before* initial setup
		function onContainerResize() {
			// kendo resize issue, therefore manual resize hack, same as on initial sizing
			var splitbar = element.find('div.k-splitbar');
			var dimension = $scope.getCurrentDimensions();
			if (!dimension || !_.isNumber(dimension.width) || !_.isNumber(dimension.height)) {
				throw new Error('invalid heights from layout system');
			}
			$scope.size.containerHeight = dimension.height;

			gridviewport = element.find('div.slick-viewport-right');
			splitbar.css({
				height: dimension.height + 'px'
			});
			var kpane = element.find('div.k-pane');
			kpane.css({
				height: dimension.height + 'px'
			});

			// find last pane
			var lastkpane = element.find('div.k-pane:last');

			// proper resize
			splitter.css({
				height: dimension.height + 'px'
			});
			// splitter.resize(true); // jquery migration caused problems with call of resize -> #126363 ALM

			calculateSplitRatio();

			$timeout(function () {
				if (gridIsReady(gridid)) { // gridcheck. global event handler could be called after grid is already destroyed
					adaptHeaders();
					resizeCanvas();
					platformGridAPI.grids.refresh(gridid, true);
				}
			}, 0);

			adjustHeights();
		}

		function postponedUpdate() {
			$timeout(update, 0);
		}

		function getChartWidth() {
			var rightpane = element.find('div.k-pane:last').width();
			return rightpane || 500;
		}

		function calculateSplitRatio() {
			// Determine splitbar ratio
			if (splitterstate.leftcollapsed || splitterstate.rightcollapsed) {
				return; // do not save pane sizes so that pane sizes before collapsing can be restored
			}
			var leftpane = element.find('div.k-pane:first').width();
			var rightpane = element.find('div.k-pane:last').width();
			splitterstate.left = Math.round(100 / (leftpane + rightpane) * leftpane, 0);
			splitterstate.right = Math.round(100 / (leftpane + rightpane) * rightpane, 0);
			saveSplitterState();
		}

		function resizeCanvas() {
			grid.instance.resizeCanvas(); // double resize as workaround for grid layout bug
			updateContentSizes();
		}

		function updateContentSizes() {
			// self-unsubscribe
			platformGridAPI.events.unregister(gridid, 'onRenderCompleted', updateContentSizes);
			$scope.size.contentHeight = $scope.getGridState().canvasHeight;
			$scope.size.viewportHeight = $scope.getGridState().viewportHeight.height;
			$timeout(zoomAndDraw(d3.zoomTransform(root.node())), 16); // get current zoom level and re-apply it
		}

		function onScroll() {
			var scrollTop = arguments[1].scrollTop;
			$scope.verticalOffset = scrollTop; // for possible initial offset
			$scope.leftGridDataService.scrolling.fire(scrollTop); // for new offset
		}

		function gridIsReady(gridid) {
			var localgrid;
			grid = null;
			if (platformGridAPI.grids.exist(gridid)) {
				localgrid = platformGridAPI.grids.element('id', gridid);
				if (localgrid.instance && localgrid.dataView) {
					grid = localgrid;
					return true;
				}
			}
			return false;
		}

		function setupTools() {
			var containerScope = $scope.$parent;
			while (containerScope && !containerScope.hasOwnProperty('setTools')) {
				containerScope = containerScope.$parent;
			}
			$scope.getGridState = function getGridState() {
				return platformGridAPI.grids.getGridState(gridid, true);
			};

			$scope.getVirtualizedGridState = function getVirtualizedGridState() {
				return platformGridAPI.grids.getGridState(gridid, false);
			};

			$scope.scrollRowIntoView = function scrollRowIntoView(row, doPaging) {
				if (gridIsReady(gridid)) { // gridcheck. global event handler could be called after grid is already destroyed
					grid.instance.scrollRowIntoView(row, doPaging);
				}
			};
			$scope.getTotalRows = function getTotalRows() {
				if (gridIsReady(gridid)) { // gridcheck. global event handler could be called after grid is already destroyed
					return grid.instance.getData().getPagingInfo().totalRows;
				} else {
					return 0;
				}
			};
			$scope.scrollByOffset = function scrollByOffset(verticalOffset) {
				if (gridviewport) {
					gridviewport[0].scrollTop = gridviewport[0].scrollTop + verticalOffset;
				}
			};

			if (!_.isUndefined($scope.crudTools) && !$scope.crudTools) {
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && !['create', 'createChild', 'delete'].includes(item.id);
				});
				$scope.tools.update();
			}

			// add gantt move mode tools to toolbar
			if (!_.isUndefined($scope.toolsConfig) && $scope.toolsConfig.ganttMoveModes) {
				_.forEach(ganttMoveModeTools, function (tool) {
					$scope.tools.items.unshift(tool);
				});
			}

			// add dateshift tools to toolbar
			if (!_.isUndefined($scope.dateShiftModeTools)) {
				_.forEach($scope.dateShiftModeTools, function (tool) {
					$scope.tools.items.unshift(tool);
				});
			}
		}

		function scrollViewport(offsetTop) {
			const verticalOffset = offsetTop || $scope.verticalOffset;

			layers.barItems.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.locks.attr('transform', 'translate(0, ' + -verticalOffset + ')')
			layers.relationships.attr('transform', 'translate(0, ' + -verticalOffset + ')')

			adjustHeights();

			layers.holiday.datum($scope.holidays || []);
			layers.weekend.datum($scope.weekends || []);
			layers.calendarline.datum([]);

			holiday.offset(0).height($scope.size.viewportHeight + 100);
			weekend.offset(0).height($scope.size.viewportHeight + 100);

			let suboffset = verticalOffset - (Math.floor(verticalOffset / 25) * 25) + 1;

			const localgrid = platformGridAPI.grids.element('id', gridid);
			if (localgrid && localgrid.instance && localgrid.instance.getOptions().showFilterRow) {
				suboffset += 16;
			}

			calendarline.offset(-suboffset).height($scope.size.viewportHeight+100);

			layers.holiday.call(holiday);
			layers.weekend.call(weekend);
			layers.calendarline.call(calendarline);
		}

		// called initially as well as on container resize; also on row count changed as this affects scroller
		function adjustHeights() {
			const contentHeight = $scope.size.contentHeight <= $scope.size.viewportHeight ? $scope.size.contentHeight + 30 : $scope.size.contentHeight;
			mainPanel.style('height', contentHeight + 'px');
			mainPanel.style('height', $scope.size.viewportHeight + 'px');
			layers.viewport.style('height', $scope.size.viewportHeight + 'px');

			const localgrid = platformGridAPI.grids.element('id', gridid);
			if (localgrid && localgrid.instance) {
				if (localgrid.instance.getOptions().showFilterRow) {
					d3.select('div.gridspacer').style('height', 27+'px');
					staticpanel.style('height', ($scope.size.viewportHeight + 33) + 'px');
					basestatic.style('height', ($scope.size.viewportHeight + 33) + 'px');
				} else if (localgrid.instance.getOptions().showMainTopPanel) {
					d3.select('div.gridspacer').style('height', 22+'px');
					staticpanel.style('height', ($scope.size.viewportHeight - 17) + 'px');
					basestatic.style('height', ($scope.size.viewportHeight - 17) + 'px');
				} else {
					d3.select('div.gridspacer').style('height', 55+'px');
					staticpanel.style('height', $scope.size.viewportHeight + 'px');
					basestatic.style('height', $scope.size.viewportHeight + 'px');
				}
			}

			// console.log(source.filteredItems.get(248695)); // 33 höher wenn filterrow an; kein unterschied zwischen vorletztem und letztem
		}
	}
}]);
