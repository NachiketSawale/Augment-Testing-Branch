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
	 * @name model.changeset.modelChangeSetSummaryVisService
	 * @function
	 * @requires _, platformDatavisService, $translate, platformStringUtilsService
	 *
	 * @description Provides a data visualization that summarizes results from a model comparison.
	 */
	angular.module('model.changeset').factory('modelChangeSetSummaryVisService', ['_', 'platformDatavisService',
		'$translate', 'platformStringUtilsService',
		function (_, platformDatavisService, $translate, platformStringUtilsService) {

			function Chart(dataVisualizationLink, visParent) {
				platformDatavisService.DataVisualization.call(this, dataVisualizationLink, visParent.append('g').classed('modelChangeSetSummary', true));
			}
			Chart.prototype = Object.create(platformDatavisService.DataVisualization.prototype);
			Chart.prototype.constructor = Chart;

			Chart.prototype.draw = function (info) { // jshint -W074
				function addRowTitle(parent, text) {
					var titleText = parent.select('text.title');
					if (titleText.empty()) {
						titleText = parent.append('text').classed('title', true);
					}
					titleText.attrs({
						x: titleWidth - padding,
						y: rowHeight / 2
					}).text(text);
				}

				function addTotalText(parent, isOnTop, scale, value) {
					var modelClass = isOnTop ? 'm1' : 'm2';

					var totalText = parent.select('text.total.' + modelClass);
					if (totalText.empty()) {
						totalText = parent.append('text').classed('total ' + modelClass, true);
					}
					var scaledValue = scale(value);
					totalText.text(value);
					var bBox = totalText.node().getBBox();

					totalText.attrs({
						x: Math.max(scaledValue, titleWidth + padding),
						y: isOnTop ? (barY - thinLineThickness - 1) : (barY + barHeight + thinLineThickness + 1 + bBox.height)
					});

					if (bBox.width + padding > scaledValue - titleWidth) {
						totalText.classed('normalPosition', false).classed('shiftedPosition', true);
					} else {
						totalText.classed('normalPosition', true).classed('shiftedPosition', false);
					}
				}

				if (!info.data) {
					return;
				}
				var data = info.data;

				var rowHeight = info.height / 4;
				if (!angular.isNumber(rowHeight)) {
					return;
				}
				var barY = 0.2 * rowHeight;
				var barHeight = 0.4 * rowHeight;
				var thinLineThickness = 3;

				// data drawing area
				var drawingArea = info.visParent.select('g.drawingArea');
				if (drawingArea.empty()) {
					drawingArea = info.visParent.append('g').classed('drawingArea', true);
				}

				// prepare text

				var modelTitle = $translate.instant('model.changeset.changeSetSummary.modelTitle');
				var objectsTitle = $translate.instant('model.changeset.changeSetSummary.objectsTitle');
				var propertiesTitle = $translate.instant('model.changeset.changeSetSummary.propertiesTitle');

				var padding = 10;
				var titleWidth = (function () {
					var result = 0;
					var tmpTexts = drawingArea.selectAll('text.temporary').data([modelTitle, objectsTitle, propertiesTitle]).enter();
					tmpTexts = tmpTexts.append('text').classed('temporary', true).text(function (d) { return d; });
					tmpTexts.each(function () {
						var currentWidth = this.getComputedTextLength();
						if (currentWidth > result) {
							result = currentWidth;
						}
						this.remove();
					});
					return result;
				})() + 2 * padding;

				var titleSeparator = drawingArea.select('line.titleSep');
				if (titleSeparator.empty()) {
					titleSeparator = drawingArea.append('line').classed('titleSep', true);
				}
				titleSeparator.attrs({
					x1: titleWidth - 0.5,
					y1: padding,
					x2: titleWidth - 0.5,
					y2: 3 * rowHeight
				});

				// model changes

				if (data.isReady && data.comparisonOptions.modelColumns) {
					(function () {
						var area = drawingArea.select('g.model');
						if (area.empty()) {
							area = drawingArea.append('g').classed('model', true);
						}

						addRowTitle(area, modelTitle);

						var modelChangeScale = d3.scalePoint().domain(_.map(data.modelChanges, function (chg) {
							return chg.id;
						})).range([titleWidth + barHeight, info.width - titleWidth - padding - barHeight]);

						var modelChanges = area.selectAll('rect.modelProp').data(data.modelChanges, function (chg) {
							return chg.id;
						});

						var newChanges = modelChanges.enter();
						newChanges = newChanges.append('rect').classed('modelProp', true).attrs({
							width: barHeight,
							height: barHeight
						});

						makeHighlightable(newChanges, function (d) {
							d3.select(this).text($translate.instant(d.value ? 'model.changeset.changeSetSummary.modelPropChanged' : 'model.changeset.changeSetSummary.modelPropUnchanged', {
								prop: d.name
							}));
						});

						var obsoleteChanges = modelChanges.exit();
						obsoleteChanges.remove();

						modelChanges = newChanges.merge(modelChanges);

						var squareDisplacement = barHeight / 2;
						modelChanges.attr('y', barY).attr('x', function (d) {
							return modelChangeScale(d.id) - squareDisplacement;
						}).classed('hasChanged', function (d) {
							return d.value;
						}).attr('width', function () {
							var dist = modelChangeScale.step();
							if (dist >= barHeight + 4) {
								return barHeight;
							} else {
								return Math.max(2, dist - 4);
							}
						});
					})();
				} else {
					(function () {
						var area = drawingArea.select('g.model');
						if (!area.empty()) {
							area.remove();
						}
					})();
				}

				// object changes

				if (data.isReady && data.comparisonOptions.objects) {
					(function () {
						function addBar(name, x, width, y, height, isThin, buildDescriptionFunc) {
							var bar = area.select('rect.' + name);
							if (bar.empty()) {
								bar = area.append('rect').classed(name, true).classed(isThin ? 'thinbar' : 'bar', true);
							}
							bar.attrs({
								x: objectsScale(x),
								y: y,
								width: objectsScale(width) - zeroX,
								height: height
							});
							if (buildDescriptionFunc) {
								makeHighlightable(bar, buildDescriptionFunc);
							}
						}

						var area = drawingArea.select('g.objects');
						if (area.empty()) {
							area = drawingArea.append('g').classed('objects', true);
						}
						area.attr('transform', 'translate(0,' + rowHeight + ')');

						addRowTitle(area, objectsTitle);

						var objectsScale = d3.scaleLinear().domain([0, data.maxObjects]).range([titleWidth, info.width - titleWidth - padding]);
						var zeroX = objectsScale(0);

						addBar('unchanged', 0, data.unchangedObjects, barY, barHeight, false, function () {
							d3.select(this).text($translate.instant('model.changeset.changeSetSummary.objectsUnchanged', {
								count: data.unchangedObjects
							}));
						});
						addBar('changed', data.unchangedObjects, data.changedObjects, barY, barHeight, false, function () {
							d3.select(this).text($translate.instant('model.changeset.changeSetSummary.objectsChanged', {
								count: data.changedObjects
							}));
						});
						addBar('propChanged', data.unchangedObjects - data.onlyPropertyChangedObjects, data.onlyPropertyChangedObjects + data.alsoPropertyChangedObjects, barY + (barHeight / 3), barHeight / 3, false, function () {
							d3.select(this).text($translate.instant('model.changeset.changeSetSummary.objectsPropChanged', {
								count: data.onlyPropertyChangedObjects + data.alsoPropertyChangedObjects,
								onlyCount: data.onlyPropertyChangedObjects,
								alsoCount: data.alsoPropertyChangedObjects
							}));
						});
						addBar('only1', data.unchangedObjects + data.changedObjects, data.onlyObjects1, barY, barHeight / 2, false, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.objectsOnly1', {
								count: data.onlyObjects1,
								model1: data.model1NiceName
							}));
						});
						addBar('only2', data.unchangedObjects + data.changedObjects, data.onlyObjects2, barY + barHeight / 2, barHeight / 2, false, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.objectsOnly2', {
								count: data.onlyObjects2,
								model2: data.model2NiceName
							}));
						});
						addBar('total1', 0, data.totalObjects1, barY - thinLineThickness, thinLineThickness, true, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.objectsTotal1', {
								count: data.totalObjects1,
								model1: data.model1NiceName
							}));
						});
						addBar('total2', 0, data.totalObjects2, barY + barHeight, thinLineThickness, true, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.objectsTotal2', {
								count: data.totalObjects2,
								model2: data.model2NiceName
							}));
						});

						addTotalText(area, true, objectsScale, data.totalObjects1);
						addTotalText(area, false, objectsScale, data.totalObjects2);
					})();
				} else {
					(function () {
						var area = drawingArea.select('g.objects');
						if (!area.empty()) {
							area.remove();
						}
					})();
				}

				// property changes

				if (data.isReady && data.comparisonOptions.properties) {
					(function () {
						function addBar(name, secondaryName, x, width, y, height, isThin, buildDescriptionFunc) {
							var bar = area.select('rect.' + name + (secondaryName ? ('.' + secondaryName) : ''));
							if (bar.empty()) {
								bar = area.append('rect').classed(name + (secondaryName ? (' ' + secondaryName) : ''), true).classed(isThin ? 'thinbar' : 'bar', true);
							}
							bar.attrs({
								x: propertiesScale(x),
								y: y,
								width: propertiesScale(width) - zeroX,
								height: height
							});
							if (buildDescriptionFunc) {
								makeHighlightable(bar, buildDescriptionFunc);
							}
						}

						var area = drawingArea.select('g.properties');
						if (area.empty()) {
							area = drawingArea.append('g').classed('properties', true);
						}
						area.attr('transform', 'translate(0,' + (2 * rowHeight) + ')');

						addRowTitle(area, propertiesTitle);

						var propertiesScale = d3.scaleLinear().domain([0, data.maxProperties]).range([titleWidth, info.width - titleWidth - padding]);
						var zeroX = propertiesScale(0);

						addBar('unchanged', null, 0, data.unchangedProperties, barY, barHeight, false, function () {
							d3.select(this).text($translate.instant('model.changeset.changeSetSummary.propsUnchanged', {
								count: data.unchangedProperties
							}));
						});
						addBar('changed', null, data.unchangedProperties, data.changedProperties, barY, barHeight, false, function () {
							d3.select(this).text($translate.instant('model.changeset.changeSetSummary.propsChanged', {
								count: data.changedProperties
							}));
						});
						addBar('only1', null, data.unchangedProperties + data.changedProperties, data.onlyProperties1, barY, barHeight / 2, false, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.propsOnly1', {
								count: data.onlyProperties1,
								model1: data.model1NiceName
							}));
						});
						addBar('only2', null, data.unchangedProperties + data.changedProperties, data.onlyProperties2, barY + barHeight / 2, barHeight / 2, false, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.propsOnly2', {
								count: data.onlyProperties2,
								model2: data.model2NiceName
							}));
						});
						addBar('only1', 'nestedObjects', data.unchangedProperties + data.changedProperties + data.onlyProperties1, data.onlyObjects1Properties, barY, barHeight / 4, false, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.propsOnlyObjects1', {
								count: data.onlyObjects1Properties,
								model1: data.model1NiceName
							}));
						});
						addBar('only2', 'nestedObjects', data.unchangedProperties + data.changedProperties + data.onlyProperties2, data.onlyObjects2Properties, barY + barHeight / 4 * 3, barHeight / 4, false, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.propsOnlyObjects2', {
								count: data.onlyObjects2Properties,
								model2: data.model2NiceName
							}));
						});
						addBar('total1', null, 0, data.totalProperties1, barY - thinLineThickness, thinLineThickness, true, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.propsTotal1', {
								count: data.totalProperties1,
								model1: data.model1NiceName
							}));
						});
						addBar('total2', null, 0, data.totalProperties2, barY + barHeight, thinLineThickness, true, function () {
							setTextWithModelMarkings(d3.select(this), $translate.instant('model.changeset.changeSetSummary.propsTotal2', {
								count: data.totalProperties2,
								model2: data.model2NiceName
							}));
						});

						addTotalText(area, true, propertiesScale, data.totalProperties1);
						addTotalText(area, false, propertiesScale, data.totalProperties2);
					})();
				} else {
					(function () {
						var area = drawingArea.select('g.properties');
						if (!area.empty()) {
							area.remove();
						}
					})();
				}

				// description

				function retrieveDescriptionElement() {
					var area = drawingArea.select('g.description');
					if (area.empty()) {
						area = drawingArea.append('g').classed('description', true);
					}
					area.attr('transform', 'translate(0,' + (3 * rowHeight) + ')');

					var descText = area.select('text');
					if (descText.empty()) {
						descText = area.append('text');
					}
					descText.attrs({
						x: info.width / 2,
						y: rowHeight / 2
					});

					return descText;
				}

				function makeHighlightable(selection, buildDescriptionFunc) {
					selection.on('mouseover', function (d, i) {
						d3.select(this).classed('hovered highlighted', true);
						buildDescriptionFunc.call(retrieveDescriptionElement().text('').node(), d, i);
					}).on('mouseout', function () {
						d3.select(this).classed('hovered', false);
						resetDescription();
					});
				}

				function resetDescription() {
					var translatedText = $translate.instant('model.changeset.changeSetSummary.generalDesc', {
						model1: data.model1NiceName,
						model2: data.model2NiceName
					});

					setTextWithModelMarkings(retrieveDescriptionElement(), translatedText);
				}

				function setTextWithModelMarkings(selection, text) {
					var el = selection.text('');
					platformStringUtilsService.processPlaceholderString(text, function (literal) {
						el.append('tspan').text(literal);
					}, function (placeholder) {
						switch (placeholder) {
							case 'm1':
								el.append('tspan').classed('model1', true).text('\u25FC');
								break;
							case 'm2':
								el.append('tspan').classed('model2', true).text('\u25FC');
								break;
						}
					});
				}

				resetDescription();
			};

			return function (link, visParent) {
				return new Chart(link, visParent);
			};
		}]);
})();