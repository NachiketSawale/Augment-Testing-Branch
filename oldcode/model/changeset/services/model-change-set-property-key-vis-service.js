/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global d3 */
// This file uses D3 v4.
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.changeset.modelChangeSetPropertyKeyVisService
	 * @function
	 * @requires _, platformDatavisService, $translate, modelChangeSetPropertyKeyDataService
	 *
	 * @description Provides a data visualization that summarizes results from a model comparison by property key.
	 */
	angular.module('model.changeset').factory('modelChangeSetPropertyKeyVisService', ['_', 'platformDatavisService',
		'$translate', 'modelChangeSetPropertyKeyDataService',
		function (_, platformDatavisService, $translate, modelChangeSetPropertyKeyDataService) {

			var groupCount = 4;
			var allGroupClasses = _.map(_.range(1, groupCount + 1), function (groupIndex) {
				return 'group' + groupIndex;
			}).join(' ');

			function Chart(dataVisualizationLink, visParent) {
				platformDatavisService.DataVisualization.call(this, dataVisualizationLink, visParent.append('g').classed('modelChangeSetPropKeySummary', true));
			}
			Chart.prototype = Object.create(platformDatavisService.DataVisualization.prototype);
			Chart.prototype.constructor = Chart;

			Chart.prototype.draw = function (info) { // jshint -W074
				function showBox(name, title, rect, lines, isHidden) {
					var box = drawingArea.select('g.box.' + name);

					if (isHidden) {
						if (!box.empty()) {
							box.remove();
						}
						return;
					}

					if (box.empty()) {
						box = drawingArea.append('g').classed('box', true).classed(name, true);
						box.append('defs').append('path').attr('id', name + 'TextPath');
					}
					box.attr('transform', 'translate(' + rect.x + ',' + rect.y + ')');
					box.select('defs path#' + name + 'TextPath').attr('d', 'M 0 ' + padding + ' H ' + rect.width);

					var headlineParent = box.select('text.headline');
					if (headlineParent.empty()) {
						headlineParent = box.append('text').classed('headline', true);
					}

					var headline = headlineParent.select('textPath');
					if (headline.empty()) {
						headline = headlineParent.append('textPath').attr('xlink:href', '#' + name + 'TextPath');
					}
					var headlineText = headline.select('tspan');
					if (headlineText.empty()) {
						headlineText = headline.append('tspan');
					}
					headlineText.text(title);

					var lineElements = box.selectAll('text.line').data(lines);

					var newLineElements = lineElements.enter().append('text').classed('line', true);
					newLineElements.append('textPath').attr('xlink:href', '#' + name + 'TextPath').append('tspan');

					var obsoleteLineElements = lineElements.exit();
					obsoleteLineElements.remove();

					var lineHeight = headlineParent.node().getBBox().height * 1.2;
					lineElements = newLineElements.merge(lineElements);
					lineElements.classed('hidden', function (d, i) {
						return (i + 2) * lineHeight >= rect.height;
					}).each(function (d, i) {
						d3.select(this).select('tspan').attr('dy', (i + 1) * lineHeight).text(d);
					});
				}

				if (!info.data) {
					return;
				}
				var data = info.data;

				var relevantItems = _.take(data.items, 60);

				// layout ----------------------------------------------------------------

				var maxRadius = Math.min(info.width, info.height) / 2 - 20;
				var changeTypeScale = d3.scaleLinear().domain([0, 1]).range([0, maxRadius]);

				var centerTranslation = 'translate(' + (info.width / 2) + ',' + (info.height / 2) + ')';

				var padding = 10;

				var topBoxInfo, hoverBoxInfo;
				if (info.width > info.height) {
					topBoxInfo = {
						x: info.width / 2 + maxRadius + 2 * padding,
						y: padding,
						width: info.width / 2 - maxRadius - 3 * padding,
						height: info.height - 2 * padding,
						showConnectorLines: true
					};
					hoverBoxInfo = {
						x: padding,
						y: padding,
						width: topBoxInfo.width,
						height: topBoxInfo.height
					};
				} else {
					topBoxInfo = {
						x: padding,
						y: info.height / 2 + maxRadius + 2 * padding,
						width: info.width - 2 * padding,
						height: info.height / 2 - maxRadius - 3 * padding,
						showConnectorLines: false
					};
					hoverBoxInfo = {
						x: padding,
						y: padding,
						width: topBoxInfo.width,
						height: topBoxInfo.height
					};
				}

				// data drawing area ----------------------------------------------------------------
				var drawingArea = info.visParent.select('g.drawingArea');
				if (drawingArea.empty()) {
					drawingArea = info.visParent.append('g').classed('drawingArea', true);
				}

				var changedArc = d3.arc().innerRadius(0).outerRadius(maxRadius);
				var only1Arc = d3.arc().innerRadius(0).outerRadius(function (d) {
					return changeTypeScale(d.data.only1 / d.data.total);
				});
				var only2Arc = d3.arc().innerRadius(0).outerRadius(function (d) {
					return changeTypeScale((d.data.only2 + d.data.only1) / d.data.total);
				});

				var pie = d3.pie().value(function (d) {
					return d.total;
				}).sort(modelChangeSetPropertyKeyDataService.comparePropertyKeys);
				var arcs = pie(relevantItems);

				// drawing ----------------------------------------------------------------

				var segments = drawingArea.selectAll('.segment').data(arcs);

				var newSegments = segments.enter().append('g').classed('segment', true);
				newSegments.append('path').classed('changed', true);
				newSegments.append('path').classed('only2', true);
				newSegments.append('path').classed('only1', true);

				var obsoleteSegments = segments.exit();
				obsoleteSegments.remove();

				segments = newSegments.merge(segments);
				segments.classed(allGroupClasses, false).each(function (d, i) {
					d3.select(this).classed('group' + ((i % groupCount) + 1), true);
				});
				segments.attr('transform', centerTranslation);
				segments.select('.changed').attr('d', changedArc).on('mouseover', function (d) {
					d3.select(this).classed('hovered', true);
					highlightedPropKey = d.data;
					updateInfoBox();
				}).on('mouseout', function () {
					d3.select(this).classed('hovered', false);
					highlightedPropKey = null;
					updateInfoBox();
				});
				segments.select('.only2').attr('d', only2Arc);
				segments.select('.only1').attr('d', only1Arc);

				// top box ----------------------------------------------------------------

				showBox('topBox', $translate.instant('model.changeset.changeSetSummary.topProps'), topBoxInfo, _.map(relevantItems, function (item) {
					return $translate.instant('model.changeset.changeSetSummary.topProp', {
						name: item.name,
						count: item.total
					});
				}), false);

				// info box ----------------------------------------------------------------

				var highlightedPropKey = null;

				function updateInfoBox() {
					var infoLines;
					if (highlightedPropKey) {
						infoLines = [
							$translate.instant('model.changeset.changeSetSummary.propName', {
								name: highlightedPropKey.name
							}),
							$translate.instant('model.changeset.changeSetSummary.propTotalChanges', {
								count: highlightedPropKey.total
							}),
							$translate.instant('model.changeset.changeSetSummary.propOnlyM2', {
								count: highlightedPropKey.only2
							}),
							$translate.instant('model.changeset.changeSetSummary.propOnlyM1', {
								count: highlightedPropKey.only1
							}),
							$translate.instant('model.changeset.changeSetSummary.propChanges', {
								count: highlightedPropKey.changed
							})
						];
					} else {
						infoLines = [];
					}
					showBox('infoBox', $translate.instant('model.changeset.changeSetSummary.selProp'), hoverBoxInfo, infoLines, !highlightedPropKey);
				}

				updateInfoBox();
			};

			return function (link, visParent) {
				return new Chart(link, visParent);
			};
		}]);
})();