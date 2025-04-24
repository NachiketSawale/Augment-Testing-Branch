/* global d3: false, globals */
/**
 * @ngdoc directive
 * @name scheduling.main.directive:schedulingMainGanttGridDirective
 * @element
 * @restrict A
 * @priority
 * @scope
 * @description
 * #GanttGridDirective
 * Creates a kendo splitter and facilitates communication between grid and gantt directives.
 */
angular.module('scheduling.main').directive('schedulingMainGanttGridDirective', ['$', '_', 'platformGridAPI', '$timeout', 'schedulingMainGANTTService', 'mainViewService', function ($, _, platformGridAPI, $timeout, gs, mainViewService) {
	'use strict';

	return {
		link: link, restrict: 'A', scope: true, templateUrl: globals.appBaseUrl + 'scheduling.main/templates/ganttgrid.html'
	};

	function link(scope, el) {

		var grid, gridid = scope.getContainerUUID(), element = $(el[0]), elementd3 = d3.select(el[0]), splitter, gridviewport, splitterstate = {
			left: 40, right: 60, leftcollapsed: false, rightcollapsed: false
		}, lastsplitterstate = {}, oldheaderstate = false;

		_.assign(splitterstate, mainViewService.customData(gridid, 'splitterstate'));
		_.assign(lastsplitterstate, splitterstate);

		setupGridandSplitter();
		setupTools();

		scope.$on('$destroy', function cleanupHandlers() {
			platformGridAPI.events.unregister(gridid, 'onSort', gs.updateFast);
			platformGridAPI.events.unregister(gridid, 'onHeaderToggled', onContainerResize);
			platformGridAPI.events.unregister(gridid, 'onRenderCompleted', detectHeaderAndUpdate);
			platformGridAPI.events.unregister(gridid, 'onScroll', onScroll);
			platformGridAPI.events.unregister(gridid, 'onRowCountChanged', onContainerResize);
			gs.forceLayoutUpdate.unregister(onContainerResize);
			// window.removeEventListener('resize', onContainerResize); // workaround for bug in layout system.
		});

		function saveSplitterState() {
			if (!_.isEqual(splitterstate, lastsplitterstate)) {
				mainViewService.customData(gridid, 'splitterstate', splitterstate);
				_.assign(lastsplitterstate, splitterstate);
			}
		}

		function detectHeaderAndUpdate() {
			var newheaderstate = platformGridAPI.grids.getGridState(gridid, true).showFilterRow;
			if (oldheaderstate !== newheaderstate) {
				onContainerResize();
			} else {
				gs.updateFast();
			}
			oldheaderstate = newheaderstate;
		}

		function setupGridandSplitter() {
			// Grid
			grid = platformGridAPI.grids.element('id', gridid);
			// Register several events of the data view
			platformGridAPI.events.register(gridid, 'onSort', gs.updateFast);
			platformGridAPI.events.register(gridid, 'onHeaderToggled', onContainerResize);
			platformGridAPI.events.register(gridid, 'onRenderCompleted', detectHeaderAndUpdate); // to enable virtual scroll
			platformGridAPI.events.register(gridid, 'onScroll', onScroll);

			// Splitter
			splitter = element.find('div.ganttsplitter').kendoSplitter({
				panes: [{
					collapsible: true, size: splitterstate.left + '%', collapsed: splitterstate.leftcollapsed
				}, {
					collapsible: true, size: splitterstate.right + '%', collapsed: splitterstate.rightcollapsed
				}], orientation: 'horizontal', collapse: function (e) {
					if (!_.isNil(e.pane.nextElementSibling)) { // left panel {
						splitterstate.leftcollapsed = true;
					} else { // right panel.
						splitterstate.rightcollapsed = true;
					}
					saveSplitterState();
				}, expand: function (e) {
					if (!_.isNil(e.pane.nextElementSibling)) { // left panel {
						splitterstate.leftcollapsed = false;
					} else { // right panel.
						splitterstate.rightcollapsed = false;
					}
					saveSplitterState();
				}
			});
			splitter.data('kendoSplitter').bind('resize', onContainerResize);

			// Resize
			scope.verticalOffset = 0;
			scope.size = scope.size || {};
			// window.addEventListener('resize', onContainerResize); // workaround for bug in layout system.
			scope.onContentResized(onContainerResize);
			platformGridAPI.events.register(gridid, 'onRowCountChanged', onContainerResize);
			gs.forceLayoutUpdate.register(onContainerResize);

			onContainerResize(); // initial resize
			$timeout(onContainerResize, 50); // initial resize (TWICE). We always resize the grid twice. Timeout because we don't really know when the grid is finished with resizing
		}

		// Note: if stylewise the header row or group row is changed, we will need to change these pixel adjustments
		function adaptHeaders() {
			const openpanels = getOpenPanels();

			var paddings = [{
				lefttop: 56, //55
				middle: 55, righttop: 10
			}, {
				lefttop: 22, //19
				middle: 13, righttop: 10
			}, {
				lefttop: 10, // 10
				middle: -2, righttop: 37
			}];

			var bottomheight = 0;
			if (gs.getSettings(gridid) && gs.getSettings(gridid).timescalePosition === 'both') {
				bottomheight = 72;
			}

			const currentpadding = paddings[openpanels];
			if (gridIsReady(gridid)) {
				if (grid.instance.getOptions().showFilterRow) { // gridcheck. global event handler could be called after grid is already destroyed
					currentpadding.middle -= grid.instance.getOptions().rowHeight;
					// currentpadding.middle += 13;
					currentpadding.lefttop -= 28; //adjustment needed because of new text "Column filter"
				} else {
					// currentpadding.middle -= 16;
				}
			}
			currentpadding.lefttop -= 1;

			/*				if (gridIsReady(gridid) && grid.instance.getOptions().showFilterRow) { // gridcheck. global event handler could be called after grid is already destroyed
								currentpadding.middle -= grid.instance.getOptions().rowHeight;
							}*/

			elementd3.select('div.placeholder').style('height', currentpadding.lefttop + 'px'); // looks bad if animated
			elementd3.select('div.gridwrapper').style('height', (scope.size.containerHeight - currentpadding.middle - bottomheight) + 'px');
			elementd3.select('div.toppanel').transition().duration(240).style('padding-top', currentpadding.righttop + 'px');
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

		function onContainerResize() {
			// kendo resize issue, therefore manual resize hack, same as on initial sizing
			var splitbar = element.find('div.k-splitbar');
			var dimension = scope.getCurrentDimensions();
			if (!dimension || !_.isNumber(dimension.width) || !_.isNumber(dimension.height)) {
				console.warn('invalid heights from layout system');
			} else {
				scope.size.containerHeight = dimension.height;
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
				scope.size.width = lastkpane.width(); // dimension.width for stand-alone grid... (still needs wrapper directive)

				// proper resize
				splitter.css({
					height: dimension.height + 'px'
				});
				//splitter.resize(); // this will call itself again. probably a workaround for drawing while outer containers are not finished redrawing
				//splitter.resize(); //causes big issues

				calculateSplitRatio();
			}
			$timeout(function () {
				if (gridIsReady(gridid)) { // gridcheck. global event handler could be called after grid is already destroyed
					gs.savePosition.fire(splitterstate); // also save position of left to put it into view again
					adaptHeaders();
					resizeCanvas();
					platformGridAPI.grids.refresh(gridid, true);
					// also save position of left to put it into view again
					gs.savePosition.fire(splitterstate);
				}
			}, 0);
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
			platformGridAPI.events.register(gridid, 'onRenderCompleted', updateContentSizes);
			grid.instance.resizeCanvas(); // double resize as workaround for grid layout bug

			function updateContentSizes() {
				// self-unsubscribe
				platformGridAPI.events.unregister(gridid, 'onRenderCompleted', updateContentSizes);
				var source = scope.getSource();
				scope.size.contentHeight = source.canvasHeight;
				scope.size.viewportHeight = source.viewportHeight.height;
				gs.requestRedraw.fire();
			}
		}

		function onScroll() {
			var scrollTop = arguments[1].scrollTop;
			scope.verticalOffset = scrollTop; // for possible initial offset
			gs.scrolling.fire(null, scrollTop); // for new offset
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
			var containerScope = scope.$parent;
			while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
				containerScope = containerScope.$parent;
			}
			scope.getSource = getSource;
			scope.getRawSource = getRawSource;

			scope.containerID = gridid;
			scope.combinedMode = true;

			scope.scrollRowIntoView = function (row, doPaging) {
				if (gridIsReady(gridid)) { // gridcheck. global event handler could be called after grid is already destroyed
					grid.instance.scrollRowIntoView(row, doPaging);
				}
			};
			scope.totalRows = function () {
				if (gridIsReady(gridid)) { // gridcheck. global event handler could be called after grid is already destroyed
					return grid.instance.getData().getPagingInfo().totalRows;
				} else {
					return 0;
				}
			};

			scope.scrollByOffset = function (verticalOffset) {
				if (gridviewport) {
					gridviewport[0].scrollTop = gridviewport[0].scrollTop + verticalOffset; // verticalOffset;
				}
			};

			scope.filterRowHeight = platformGridAPI.filters.getFilterRowProperties().height;

			// DON'T USE directly. Use scope.getSource (as it may be overwritten)
			function getSource() {
				return platformGridAPI.grids.getGridState(gridid, true);
			}

			// DON'T USE directly. Use scope.getSource (as it may be overwritten)
			function getRawSource() {
				return platformGridAPI.grids.getGridState(gridid, false);
			}
		}
	}
}]);
