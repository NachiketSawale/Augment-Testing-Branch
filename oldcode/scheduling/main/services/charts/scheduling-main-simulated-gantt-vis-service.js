/*
 * $Id: scheduling-main-simulated-gantt-vis-service.js 634480 2021-04-28 12:48:05Z sprotte $
 * Copyright (c) RIB Software SE
 */

/* global d3 */
// This file uses D3 v4.
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name scheduling.main.schedulingMainSimulatedGanttVisService
	 * @function
	 * @requires _, platformDatavisService, moment, platformModuleNavigationService, cloudDesktopSvgIconService,
	 *           $translate
	 *
	 * @description Provides a simulated Gantt chart.
	 */
	angular.module('scheduling.main').factory('schedulingMainSimulatedGanttVisService', ['_', 'platformDatavisService',
		'moment', 'platformModuleNavigationService', 'cloudDesktopSvgIconService', '$translate', 'schedulingMainSimulatedGanttDataService',
		function (_, platformDatavisService, moment, platformModuleNavigationService, cloudDesktopSvgIconService,
			$translate, schedulingMainSimulatedGanttDataService) {

			function Chart(dataVisualizationLink, visParent) {
				platformDatavisService.DataVisualization.call(this, dataVisualizationLink, visParent.append('g').classed('simulatedGantt', true));
			}

			Chart.prototype = Object.create(platformDatavisService.DataVisualization.prototype);
			Chart.prototype.constructor = Chart;

			Chart.prototype.draw = function (info) { // jshint -W074
				if (!info.data) {
					return;
				}
				var data = info.data;

				// definitions
				var labelWidth = info.width / 5;
				var timeAxisHeight;
				var chartWidth = info.width - labelWidth;
				var timescale = d3.scaleUtc().clamp(false).domain([data.currentWindowStart, data.currentWindowEnd]).range([0, chartWidth]);

				var svgDefs = info.visParent.select('defs');
				if (svgDefs.empty()) {
					svgDefs = info.visParent.append('defs');
				}

				cloudDesktopSvgIconService.appendIconDefs('tlb-icons', 'ico-goto', 'tlb-', svgDefs);

				var prepareClipPathRect = function (name) {
					var cp = svgDefs.select('clipPath#' + name + ' rect');
					if (cp.empty()) {
						cp = svgDefs.append('clipPath').attr('id', name).append('rect').attrs({
							x: 0,
							y: 0
						});
					}
					return cp;
				};

				var chartClipPath = prepareClipPathRect('chartClipPath');
				var labelsClipPath = prepareClipPathRect('labelsClipPath');

				var labelHeight = (function () {
					var measurementText = info.visParent.append('text').classed('temporaryMeasurement', true).text('Gg');
					try {
						return measurementText.node().getBBox().height;
					} finally {
						measurementText.remove();
					}
				})();

				var activityBarHeight = labelHeight + 2;
				var getActivityBarY = function (d, i) {
					return 2 + i * (activityBarHeight + 2);
				};

				// timeAxis area
				var isAxisInitialized = true;
				var timeAxisArea = info.visParent.select('g.timeAxisArea');
				if (timeAxisArea.empty()) {
					timeAxisArea = info.visParent.append('g').classed('timeAxisArea', true).attr('clip-path', 'url(#chartClipPath)');
					timeAxisArea.append('rect').classed('bg', true).attrs({
						x: 0,
						y: 0
					});
					timeAxisArea.append('g').classed('axisGraphic', true);
					isAxisInitialized = false;
				}

				(function () {
					var timeaxis = d3.axisBottom(timescale).ticks(5).tickFormat(function (d) {
						return moment(d).format('l');
					});

					var timeAxisEl = timeAxisArea.select('g.axisGraphic');
					if (isAxisInitialized) {
						timeAxisEl.transition().call(timeaxis);
					} else {
						timeAxisEl.call(timeaxis);
						isAxisInitialized = true;
					}

					timeAxisHeight = timeAxisEl.node().getBBox().height;
					timeAxisArea.select('rect.bg').attrs({
						width: chartWidth,
						height: timeAxisHeight
					});
				})();

				// chart area
				var chartArea = info.visParent.select('g.chartArea');
				if (chartArea.empty()) {
					chartArea = info.visParent.append('g').classed('chartArea', true).attr('clip-path', 'url(#chartClipPath)');
					chartArea.append('g').classed('barsLayer', true);
					chartArea.append('g').classed('overlayLayer', true);
				}

				(function () {
					var chartHeight = info.height - timeAxisHeight;

					var barsLayer = chartArea.select('g.barsLayer');

					var bars = barsLayer.selectAll('.activity').data(data.activities.visible, function (d) {
						return d.id;
					});

					var newBars = bars.enter().append('rect').classed('activity highlightable', true).attrs({
						x: -5,
						width: 0,
						height: activityBarHeight
					}).attr('y', getActivityBarY).each(function (d) {
						if (d.svgColor) {
							d3.select(this).attr('style', 'fill: ' + d.svgColor + ';');
						}
					}).on('dblclick', function (d) {
						data.showActivityDetails(d.id);
					});

					var obsoleteBars = bars.exit();
					obsoleteBars.remove();

					bars = newBars.merge(bars);
					bars.transition().attr('x', function (d) {
						return timescale(d.from);
					}).attr('y', getActivityBarY).attr('width', function (d) {
						var result = timescale(d.to) - timescale(d.from);
						return result < 2 ? 2 : result;
					});

					var overlayLayer = chartArea.select('g.overlayLayer');

					var drawLineOverlay = function (className, atTime) {
						var line = overlayLayer.select('.' + className);
						if (atTime.isBetween(data.currentWindowStart, data.currentWindowEnd)) {
							if (line.empty()) {
								line = overlayLayer.append('line').classed(className, true).attr('y1', 0).attr('y2', chartHeight).attr('x1', -5).attr('x2', -5);
							}

							var lineX = timescale(atTime);
							line.transition().attr('x1', lineX).attr('x2', lineX);
						} else {
							if (!line.empty()) {
								line.remove();
							}
						}
					};

					drawLineOverlay('today', moment());
					drawLineOverlay('current', data.currentTime);
				})();

				// label area
				var labelArea = info.visParent.select('g.labelArea');
				if (labelArea.empty()) {
					labelArea = info.visParent.append('g').classed('labelArea', true).attr('clip-path', 'url(#labelsClipPath)');
					labelArea.append('g').classed('bgLayer', true);
					labelArea.append('g').classed('labelLayer', true);
					labelArea.append('g').classed('actionLayer', true);
				}

				(function () {
					var bgLayer = labelArea.select('g.bgLayer');

					var barTitleBackgrounds = bgLayer.selectAll('rect.activity').data(data.activities.visible, function (d) {
						return d.id;
					});

					var newBarTitleBackgrounds = barTitleBackgrounds.enter().append('rect').classed('activity highlightable', true).attrs({
						x: 0,
						width: labelWidth,
						height: activityBarHeight
					});

					var obsoleteBarTitleBackgrounds = barTitleBackgrounds.exit();
					obsoleteBarTitleBackgrounds.remove();

					barTitleBackgrounds = newBarTitleBackgrounds.merge(barTitleBackgrounds);
					barTitleBackgrounds.attr('y', getActivityBarY);

					var labelLayer = labelArea.select('g.labelLayer');

					var barTitles = labelLayer.selectAll('text.activity').data(data.activities.visible, function (d) {
						return d.id;
					});

					var newBarTitles = barTitles.enter().append('text').classed('activity', true).text(function (d) {
						return d.niceName;
					}).attr('x', -2 * labelWidth).attr('y', getActivityBarY);

					var obsoleteBarTitles = barTitles.exit();
					obsoleteBarTitles.transition().attr('x', -2 * labelWidth).remove();

					barTitles = newBarTitles.merge(barTitles);
					barTitles.transition().attr('x', function (d) {
						return 4 + d.depth * 6;
					}).attr('y', function (d, i) {
						return getActivityBarY(d, i) + labelHeight - 1;
					});

					var actionLayer = labelArea.select('g.actionLayer');

					var actions = actionLayer.selectAll('g.goTo').data(data.activities.visible, function (d) {
						return d.id;
					});

					var newActions = actions.enter().append('g').classed('goTo highlightable', true).attr('transform', function (d, i) {
						return 'translate(-40,' + getActivityBarY(d, i) + ')';
					}).each(function (d) {
						var thisSel = d3.select(this);
						thisSel.append('title').text($translate.instant('scheduling.main.simulatedGantt.selectActivity', {
							activity: d.niceName
						}));

						thisSel.append('rect').attrs({
							x: 0,
							y: 0,
							width: activityBarHeight,
							height: activityBarHeight,
							fill: 'white',
							'fill-opacity': 0.5
						});
						thisSel.append('use').attrs({
							x: 1,
							y: 1,
							width: 16,
							height: 16,
							href: '#tlb-ico-goto'
						});
					}).on('click', function (d) {
						platformModuleNavigationService.navigate({
							moduleName: 'scheduling.main'
						}, {
							activityId: d.id,
							scheduleFk: d.ScheduleId
						}, 'activityWithSchedule');
					});

					var obsoleteActions = actions.exit();
					obsoleteActions.transition().attr('transform', function (d, i) {
						return 'translate(-40,' + getActivityBarY(d, i) + ')';
					}).remove();

					actions = newActions.merge(actions);
					actions.transition().attr('transform', function (d, i) {
						return 'translate(' + (labelWidth - 1 - activityBarHeight) + ',' + getActivityBarY(d, i) + ')';
					});
				})();

				// interactivity
				info.visParent.selectAll('.highlightable')
					.on('click', function (d) {
						schedulingMainSimulatedGanttDataService.setSelectedItemId(d.id);
						var highlightedItem = d;
						info.visParent.selectAll('.highlightable').classed('selected', function (d) {
							return d.id === highlightedItem.id;
						});
					}).on('mouseover', function (d) {
						var highlightedItem = d;
						info.visParent.selectAll('.highlightable').classed('highlighted', function (d) {
							return d.id === highlightedItem.id;
						});
					}).on('mouseout', function () {
						info.visParent.selectAll('.highlightable').classed('highlighted', false);
					}).each(function (d) {
						d3.select(this).append('title').text(d.niceName);
					});

				// final positioning
				labelArea.attr('transform', 'translate(0,' + timeAxisHeight + ')');
				timeAxisArea.attr('transform', 'translate(' + labelWidth + ',0)');
				chartArea.attr('transform', 'translate(' + labelWidth + ',' + timeAxisHeight + ')');
				chartClipPath.attr('width', chartWidth).attr('height', info.height - timeAxisHeight);
				labelsClipPath.attr('width', labelWidth).attr('height', info.height);
			};

			return function (link, visParent) {
				return new Chart(link, visParent);
			};
		}]);
})();
