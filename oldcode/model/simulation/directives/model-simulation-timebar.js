/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

// This file uses D3 v4.
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.simulation.directive:modelSimulationTimebar
	 * @description Displays a timeline that indicates simulation progress.
	 */
	angular.module('model.simulation').directive('modelSimulationTimebar', modelSimulationTimebar);

	modelSimulationTimebar.$inject = ['_', '$q', '$translate',
		'schedulingMainChartbase', 'moment', 'modelSimulationTimelineGraphicService', 'modelSimulationMasterService',
		'cloudDesktopSvgIconService', 'd3'];

	function modelSimulationTimebar(_, $q, $translate, chart, moment, modelSimulationTimelineGraphicService, modelSimulationMasterService,
		cloudDesktopSvgIconService, d3) {

		const dragTolerance = 5;

		return {
			restrict: 'A',
			scope: false,
			templateUrl: globals.appBaseUrl + 'model.simulation/partials/model-simulation-timebar-template.svg',
			link: function (scope, elem /* , attrs */ ) {
				const drawingArea = d3.select(elem[0]).select('svg');

				(function prepareSvgDefs() {
					let svgDefs = drawingArea.select('defs');
					if (svgDefs.empty()) {
						svgDefs = drawingArea.append('defs');
					}
					return cloudDesktopSvgIconService.appendIconDefs('tlb-icons', ['ico-refresh', 'ico-delete2'], 'tlb-', svgDefs);
				})().then(function prepareSvgDefsFinished() {
					draw();
				});

				const timerange = [moment().year(2014).month(0).date(1), moment().year(2016).month(11).date(31)];

				const masterTimescale = d3.scaleUtc().clamp(false).domain(timerange).range([0, elem.width()]);
				// const detailTimescale = chart.timescale().domain(timerange).range([0, elem.width()]).startDate(timerange[0]).endDate(timerange[1]);
				const detailTimescale = d3.scaleUtc().clamp(false).domain(timerange).range([0, elem.width()]);

				const timelinePadding = {
					h: 1,
					v: 3,
					innerH: 4
				};
				const timelineHeight = 16 + 2 * timelinePadding.v;

				function updateTimerange() {
					const effectiveTimerange = modelSimulationMasterService.isTimelineReady() ? modelSimulationMasterService.getTimerange() : [moment().month(0).date(1), moment().month(11).date(31)];
					masterTimescale.domain(effectiveTimerange);
					detailTimescale.domain(effectiveTimerange);
					draw();
				}

				const drawMasterBar = (function () {
					const bgBox = modelSimulationTimelineGraphicService.bgBox();
					const bgBoxEl = drawingArea.select('.master g.background');

					const timeaxis = d3.axisBottom(masterTimescale).ticks(9).tickFormat(function (d) {
						return moment(d).format('l');
					});
					const d3AxisEl = drawingArea.select('.master g.axis');

					const past = modelSimulationTimelineGraphicService.past(d3AxisEl).scale(masterTimescale);
					const pastEl = drawingArea.select('.master g.past');

					const thumb = modelSimulationTimelineGraphicService.thumb(d3AxisEl).scale(masterTimescale);
					const thumbEl = drawingArea.select('.master g.thumb');

					const today = modelSimulationTimelineGraphicService.today(d3AxisEl).scale(masterTimescale);
					const todayEl = drawingArea.select('.master g.today');

					function updateBrushedArea() {
						const brushSel = d3.brushSelection(brushEl.node());

						let range;
						if (!angular.isArray(brushSel) || (brushSel.length < 2) || (brushSel[0] >= brushSel[1])) {
							range = masterTimescale.domain();
						} else {
							range = [masterTimescale.invert(brushSel[0]), masterTimescale.invert(brushSel[1])];
						}
						modelSimulationMasterService.setZoomedTimerange(range);

						detailTimescale.domain(range);
						draw();
					}

					const brush = d3.brushX().on('brush', updateBrushedArea).on('end', updateBrushedArea);
					const brushEl = drawingArea.select('.master .brush');

					return function () {
						bgBoxEl.call(bgBox);
						d3AxisEl.call(timeaxis);
						pastEl.call(past);
						thumbEl.call(thumb);
						todayEl.call(today);
						const bbox = drawingArea.select('.master .axis').node().getBBox();
						drawingArea.select('.master .background rect.box').attr('width', bbox.width).attr('height', bbox.height);
						brushEl.call(brush).selectAll('rect').attr('y', 0).attr('height', bbox.height);
					};
				})();

				const drawDetailBar = (function () {
					const timeaxis = chart.timeaxis().scale(detailTimescale);
					const d3AxisEl = drawingArea.select('.detail g.axis');

					const past = modelSimulationTimelineGraphicService.past(d3AxisEl).scale(detailTimescale);
					const pastEl = drawingArea.select('.detail g.past');

					const thumb = modelSimulationTimelineGraphicService.thumb(d3AxisEl).scale(detailTimescale);
					const thumbEl = drawingArea.select('.detail g.thumb');

					const today = modelSimulationTimelineGraphicService.today(d3AxisEl).scale(detailTimescale);
					const todayEl = drawingArea.select('.detail g.today');

					const detailInteractionEl = drawingArea.select('.detail .interaction rect');
					detailInteractionEl.on('mousemove', function () {
						if (modelSimulationMasterService.isTimelineReady()) {
							if (modelSimulationMasterService.isTimeSuggested()) {
								modelSimulationMasterService.suggestTime(detailTimescale.invert(d3.mouse(this)[0]));
								draw();
							} else {
								if (Math.abs(d3.mouse(this)[0] - detailTimescale(modelSimulationMasterService.getCurrentTime())) <= dragTolerance) {
									d3.select(this).style('cursor', 'ew-resize');
								} else {
									d3.select(this).style('cursor', 'crosshair');
								}
							}
						}
					}).on('mousedown', function () {
						if (modelSimulationMasterService.isTimelineReady()) {
							const xPos = d3.mouse(this)[0];
							if (Math.abs(xPos - detailTimescale(modelSimulationMasterService.getCurrentTime())) <= dragTolerance) {
								modelSimulationMasterService.suggestTime(detailTimescale.invert(xPos));
							} else {
								modelSimulationMasterService.cancelTimeSuggestion();
								modelSimulationMasterService.moveToTime(detailTimescale.invert(xPos));
							}
						}
					}).on('mouseup', function () {
						if (modelSimulationMasterService.isTimelineReady()) {
							if (modelSimulationMasterService.isTimeSuggested()) {
								modelSimulationMasterService.applySuggestedTime();
							}
						}
					}).on('mouseleave', function () {
						if (modelSimulationMasterService.isTimelineReady()) {
							if (modelSimulationMasterService.isTimeSuggested()) {
								modelSimulationMasterService.cancelTimeSuggestion();
								d3.select(this).style('cursor', 'crosshair');
								draw();
							}
						}
					});

					return function () {
						drawingArea.select('.detail').attr('transform', function () {
							return 'translate(0,' + (drawingArea.select('.master').node().getBBox().height + 2) + ')';
						});

						d3AxisEl.call(timeaxis);
						pastEl.call(past);
						thumbEl.call(thumb);
						todayEl.call(today);

						detailInteractionEl.attr('height', d3AxisEl.node().getBBox().height + 'px');
					};
				})();

				function drawTimelineBars(totalWidth) {
					function computeTimelineTranslate(d, i) {
						return 'translate(0,' + (timelineHeight * i) + ')';
					}

					const redrawPromises = [];

					let timelinesLayer = drawingArea.select('.timelines');
					if (timelinesLayer.empty()) {
						timelinesLayer = drawingArea.append('g').classed('timelines', true).attr('transform', 'translate(0,' + drawingArea.select('.timebar').node().getBBox().height + ')');
					}

					let timelines = timelinesLayer.selectAll('.timeline').data(modelSimulationMasterService.getLoadedTimelines(), function (d) {
						return d.id;
					});

					const newTimelines = timelines.enter().append('g').classed('timeline', true).attr('transform', computeTimelineTranslate);

					timelines.exit().remove();

					timelines = newTimelines.merge(timelines);
					timelines.each(function (d) {
						const timelineLayer = d3.select(this);

						(function drawBars() {
							const barHeightValue = (timelineHeight * 2 / 5) + 'px';

							let barLayer = timelineLayer.select('.bar');
							if (barLayer.empty()) {
								barLayer = timelineLayer.append('g').classed('bar', true).attr('transform', 'translate(0,' + (timelineHeight / 2) + ')');
							}

							// total bar (total simulation duration of all timelines)
							let totalBar = barLayer.select('rect.total');
							if (totalBar.empty()) {
								totalBar = barLayer.append('rect').classed('total', true);
							}
							totalBar.attr('height', barHeightValue).attr('width', totalWidth + 'px');

							// timeline lifetime bar (extent of this timeline)
							const lifeRange = d.getTimerange();
							let lifeBar = barLayer.select('rect.life');
							if (lifeBar.empty()) {
								lifeBar = barLayer.append('rect').classed('life', true);
							}
							lifeBar.attr('height', barHeightValue).transition().attr('x', detailTimescale(lifeRange.from)).attr('width', Math.abs(detailTimescale(lifeRange.to) - detailTimescale(lifeRange.from)));

							// timeline activity bar (periods during which something happens on this timeline)
							let activePeriods;
							if (_.isArray(d.activePeriods)) {
								activePeriods = d.activePeriods;
							} else {
								activePeriods = [];
								if (d.activePeriodsPromise) {
									redrawPromises.push(d.activePeriodsPromise);
								}
							}

							const getPeriodExtent = function (d) {
								const start = detailTimescale(d.from);
								return {
									x: start,
									width: Math.max(0, detailTimescale(d.to) - start)
								};
							};

							let periods = barLayer.selectAll('.activity').data(activePeriods);

							const newPeriods = periods.enter().append('rect').classed('activity', true).attrs(getPeriodExtent);

							periods.exit().remove();

							periods = newPeriods.merge(periods);
							periods.attr('height', barHeightValue).attrs(getPeriodExtent);
						})();

						(function drawDecoration() {
							function createIconButton(buttonElement, icon, textKey, fn) {
								const buttonState = {
									isBusy: false
								};

								buttonElement.append('rect').classed('d3-btn-bg', true).attrs({
									width: 16,
									height: 16
								});

								const iconEl = buttonElement.append('use').classed('d3-btn-icon', true).attrs({
									width: 16,
									height: 16,
									href: icon
								});

								buttonElement.classed('d3-btn', true).on('mouseenter', function () {
									d3.select(this).classed('hovered', true);
									if (d3.select(this).classed('clicked')) {
										iconEl.attr('transform', 'translate(1,1)');
									}
								}).on('mouseleave', function () {
									d3.select(this).classed('hovered', false);
									iconEl.attr('transform', null);
								}).on('mousedown', function () {
									d3.select(this).classed('clicked', true);
									iconEl.attr('transform', 'translate(1,1)');
								}).on('mouseup', function () {
									d3.select(this).classed('clicked', false);
									iconEl.attr('transform', null);
									if (d3.select(this).classed('hovered')) {
										if (!buttonState.isBusy) {
											buttonState.isBusy = true;
											$q.when(fn()).then(function () {
												buttonState.isBusy = false;
											});
										}
									}
								});

								buttonElement.append('title').text($translate.instant(textKey, {
									timeline: d.getDisplayName()
								}));
							}

							let decorationLayer = timelineLayer.select('.decoration');
							if (decorationLayer.empty()) {
								decorationLayer = timelineLayer.append('g').classed('decoration', true);
							}

							let refreshButton = decorationLayer.select('.refresh');
							if (refreshButton.empty()) {
								refreshButton = decorationLayer.append('g').classed('refresh', true).attr('transform', 'translate(' + timelinePadding.h + ',' + timelinePadding.v + ')');
								createIconButton(refreshButton, '#tlb-ico-refresh', 'model.simulation.timeline.refresh', function refreshTimeline() {
									return d.reload();
								});
							}

							let nameText = decorationLayer.select('.name');
							if (nameText.empty()) {
								nameText = decorationLayer.append('text').classed('name', true).attrs({
									x: timelinePadding.h + 16 + timelinePadding.innerH,
									y: timelineHeight / 2
								});
							}
							nameText.text(d.getDisplayName());

							let deleteButton = decorationLayer.select('.delete');
							if (deleteButton.empty()) {
								deleteButton = decorationLayer.append('g').classed('delete', true);
								createIconButton(deleteButton, '#tlb-ico-delete2', 'model.simulation.timeline.delete', function deleteTimeline() {
									d.unload();
								});
							}
							deleteButton.attr('transform', 'translate(' + (totalWidth - 16 - timelinePadding.h) + ',' + timelinePadding.v + ')');
						})();
					}).transition().attr('transform', computeTimelineTranslate);

					if (redrawPromises.length > 0) {
						$q.all(redrawPromises).then(function () {
							draw();
						});
					}
				}

				function resize() {
					const dimensions = scope.getCurrentDimensions();
					masterTimescale.range([0, dimensions.width]);
					detailTimescale.range([0, dimensions.width]);
					draw(dimensions.width);
				}

				scope.onContentResized(resize);
				window.addEventListener('resize', resize);

				function draw(totalWidth) {
					if (!_.isNumber(totalWidth)) {
						totalWidth = elem.width();
					}

					drawMasterBar();
					drawDetailBar();
					drawTimelineBars(totalWidth);

					drawingArea.attr('height', ((drawingArea.select('g.timebar').node().getBBox().height + 6) + (timelineHeight * modelSimulationMasterService.countLoadedTimelines())) + 'px');
				}

				draw();

				scope.$watch('timerange', updateTimerange);

				modelSimulationMasterService.onCurrentTimeChanged.register(draw);

				const timelineListChanged = function () {
					updateTimerange();
				};
				modelSimulationMasterService.registerTimelineListChanged(timelineListChanged);

				scope.$on('$destroy', function () {
					window.removeEventListener('resize', resize);
					modelSimulationMasterService.onCurrentTimeChanged.unregister(draw);
					modelSimulationMasterService.unregisterTimelineListChanged(timelineListChanged);
				});
			}
		};
	}
})(angular);
