/*
 * $Id: platform-datavis-orthogonal-chart-service.js 603838 2020-09-21 06:37:10Z alisch $
 * Copyright (c) RIB Software GmbH
 */

/* global d3 */
// This file uses D3 v4.
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformDatavisOrthogonalChartService
	 * @function
	 * @requires _, platformDatavisService, $injector, $log
	 *
	 * @description Provides a data visualization that outputs charts in a two-dimensional coordinate system.
	 */
	angular.module('platform').factory('platformDatavisOrthogonalChartService', ['_', 'platformDatavisService',
		'$injector', '$log',
		function (_, platformDatavisService, $injector, $log) {

			var defaultAxisId = '::default::';

			function createAxis(axisDef, length) { // jshint -W074
				var orientedAxis;
				switch (axisDef.position) {
					case 'near':
						if (axisDef.isHorizontal) {
							orientedAxis = 'axisTop';
						} else {
							orientedAxis = 'axisLeft';
						}
						axisDef.getAxisTransform = function (margin) {
							return 'translate(' + margin.left + ',' + margin.top + ')';
						};
						break;
					case 'far':
						if (axisDef.isHorizontal) {
							orientedAxis = 'axisBottom';
							axisDef.getAxisTransform = function (margin, clientSize) {
								return 'translate(' + margin.left + ',' + (margin.top + clientSize.height) + ')';
							};
						} else {
							orientedAxis = 'axisRight';
							axisDef.getAxisTransform = function (margin, clientSize) {
								return 'translate(' + (margin.left + clientSize.width) + ',' + margin.top + ')';
							};
						}
						break;
					case 'middle':
						if (axisDef.otherAxis.isReversed) {
							if (axisDef.isHorizontal) {
								orientedAxis = 'axisBottom';
								axisDef.getAxisTransform = function (margin) {
									return 'translate(' + margin.left + ',' + (margin.top + axisDef.otherAxis.scale(axisDef.anchor)) + ')';
								};
							} else {
								orientedAxis = 'axisRight';
								axisDef.getAxisTransform = function (margin) {
									return 'translate(' + (margin.left + axisDef.otherAxis.scale(axisDef.anchor)) + ',' + margin.top + ')';
								};
							}
						} else {
							if (axisDef.isHorizontal) {
								orientedAxis = 'axisTop';
								axisDef.getAxisTransform = function (margin) {
									return 'translate(' + margin.left + ',' + (margin.top + axisDef.otherAxis.scale(axisDef.anchor)) + ')';
								};
							} else {
								orientedAxis = 'axisLeft';
								axisDef.getAxisTransform = function (margin) {
									return 'translate(' + (margin.left + axisDef.otherAxis.scale(axisDef.anchor)) + ',' + margin.top + ')';
								};
							}
						}
						break;
					default:
						axisDef.axis = null;
						return;
				}

				axisDef.axis = d3[orientedAxis](axisDef.scale).ticks(axisDef.isHorizontal ? (Math.floor(length / 40)) : (Math.floor(length / 25)));
				if (angular.isFunction(axisDef.formatFn)) {
					axisDef.axis.tickFormat(axisDef.formatFn);
				}
				if (axisDef.scaleKind === 'ordinal') {
					axisDef.axis.tickSize(0).tickPadding(6);
				}
			}

			function prepareAxis(axisDef, data, clientSize, seriesData) {
				var scale;
				var domainValues;
				var setDomain, setRange;
				var relevantClientSize = axisDef.isHorizontal ? clientSize.width : clientSize.height;

				var relevantSeries = _.filter(seriesData, function (series) {
					return (series.keyAxis === axisDef) || (series.valueAxis === axisDef);
				});

				if (axisDef.scaleKind === 'ordinal') {
					scale = d3.scalePoint();
					if (axisDef.items) {
						domainValues = axisDef.items;
					} else {
						domainValues = _.flatten(_.map(relevantSeries, function (series) {
							return _.map(series.pairs, function (pair) {
								return pair[axisDef.field];
							});
						}));
					}
					if (axisDef.isReversed) {
						domainValues.reverse();
					}

					setDomain = function (domain) {
						scale.domain(_.uniq(domain));
					};
					setRange = function (range) {
						scale.range(range).padding(0.5);
					};
				} else {
					switch (axisDef.scaleKind) {
						case 'sqrt':
							scale = d3.scaleSqrt();
							break;
						case 'log':
							scale = d3.scaleLog();
							break;
						case 'time':
							scale = d3.scaleTime();
							break;
						default:
							scale = d3.scaleLinear();
							break;
					}

					domainValues = _.flatten(_.map(relevantSeries, function (series) {
						return _.map(series.pairs, function (pair) {
							return pair[axisDef.field];
						});
					}));

					setDomain = function (domain) {
						if (angular.isArray(axisDef.overrideBoundaries)) {
							scale.domain(d3.extent(axisDef.overrideBoundaries));
						} else {
							scale.domain(d3.extent(domain));
							if (axisDef.roundBoundaries) {
								scale.nice();
							}
						}
					};
					setRange = function (range) {
						if (axisDef.isReversed) {
							scale.range([range[1], range[0]]);
						} else {
							scale.range(range);
						}
					};
				}

				if (angular.isArray(axisDef.includeItems)) {
					domainValues.push.apply(domainValues, axisDef.includeItems);
				}
				if (axisDef.otherAxis.position === 'middle') {
					domainValues.push(axisDef.otherAxis.anchor);
				}
				axisDef.highlights.forEach(function (hl) {
					if (hl.forceVisible) {
						domainValues.push(hl.anchor);
					}
				});

				setDomain(domainValues);
				setRange([0, relevantClientSize]);

				axisDef.scale = scale;
				createAxis(axisDef, relevantClientSize);
			}

			function extractCanonicalHighlightDef(highlight, autoId) {
				if (angular.isObject(highlight)) {
					if (angular.isDefined(highlight.anchor)) {
						return {
							id: angular.isDefined(highlight.id) ? highlight.id : autoId,
							anchor: highlight.anchor,
							forceVisible: !!highlight.forceVisible,
							cssClass: highlight.cssClass
						};
					}
				}
				return null;
			}

			function extractCanonicalAxisDefs(data, axisFieldName) {
				function extractCanonicalAxisDef(config) {
					var autoHighlightId = 1;
					var result = {
						id: _.isString(config.id) ? config.id : null,
						isReversed: !!config.isReversed,
						scaleKind: config.scale,
						items: config.items,
						formatFn: config.formatFn,
						includeItems: config.includeItems,
						field: axisFieldName,
						highlights: angular.isArray(config.highlights) ? _.filter(_.map(config.highlights, function (hl) {
							return extractCanonicalHighlightDef(hl, autoHighlightId++);
						}), function (hl) {
							return hl !== null;
						}) : [],
						roundBoundaries: angular.isDefined(config.roundBoundaries) ? !!config.roundBoundaries : true,
						overrideBoundaries: angular.isArray(config.overrideBoundaries) ? config.overrideBoundaries : null
					};

					result.isHorizontal = (axisFieldName === 'key') ? isKeyAxisHorizontal : !isKeyAxisHorizontal;

					switch (config.position) {
						case 'near':
						case 'far':
							result.position = config.position;
							break;
						case 'middle':
							result.position = 'middle';
							if (angular.isDefined(config.anchor)) {
								result.anchor = config.anchor;
							} else {
								result.anchor = 0;
							}
							break;
						default:
							result.position = 'none';
							break;
					}

					return result;
				}

				var axisConfigName = axisFieldName + 'Axis';
				var config = data[axisConfigName] ? data[axisConfigName] : {};
				if (!_.isArray(config)) {
					config = [config];
				}

				var isKeyAxisHorizontal = (function determineKeyAxisHorizontality() {
					var orientation = 'h';
					if (_.isObject(data.keyAxis)) {
						if (_.isString(data.keyAxis.orientation)) {
							orientation = data.keyAxis.orientation;
						} else if (_.isArray(data.keyAxis)) {
							var firstDefiningAxis = _.find(data.keyAxis, function (axisDef) {
								return _.isString(axisDef.orientation);
							});
							if (firstDefiningAxis) {
								orientation = firstDefiningAxis.orientation;
							}
						}
					}

					switch (orientation) {
						case 'y':
						case 'v':
							return false;
						default:
							return true;
					}
				})();

				var allAxes = _.map(config, extractCanonicalAxisDef);
				var defaultAxis = _.find(allAxes, function (axisDef) {
					return _.isNil(axisDef.id);
				});
				if (defaultAxis) {
					defaultAxis.id = defaultAxisId;
				}
				allAxes = _.filter(allAxes, function (axisDef) {
					return _.isString(axisDef.id);
				});
				allAxes.byId = {};
				allAxes.forEach(function (axisDef) {
					if (_.isString(axisDef.id)) {
						allAxes.byId[axisDef.id] = axisDef;
					} else {
						$log.warn('Only one unnamed axis is supported. Any other unnamed axes will be ignored.');
					}
				});
				return allAxes;
			}

			function extractInlineColor(value) {
				if (_.isNumber(value)) {
					var basicsCommonDrawingUtilitiesService = $injector.get('basicsCommonDrawingUtilitiesService');
					return basicsCommonDrawingUtilitiesService.intToRgbColor(value).toString();
				} else if (_.isObject(value)) {
					return value.toString();
				} else {
					return null;
				}
			}

			function extractCanonicalSeriesDef(data, keyAxes, valueAxes) {
				var allKeys = {};

				var countBarSeries = 0;
				var result = _.filter(_.map(angular.isArray(data.series) ? data.series : [], function (series) { // jshint -W074
					var seriesResult = {
						id: series.id,
						keyAxisId: _.isString(series.keyAxisId) ? series.keyAxisId : defaultAxisId,
						valueAxisId: _.isString(series.valueAxisId) ? series.valueAxisId : defaultAxisId,
						bars: series.bars ? {
							baseValue: angular.isDefined(series.bars.baseValue) ? series.bars.baseValue : 0,
							cssClass: series.bars.cssClass ? series.bars.cssClass : null,
							color: extractInlineColor(series.bars.color),
							positiveCssClass: series.bars.positiveCssClass ? series.bars.positiveCssClass : null,
							negativeCssClass: series.bars.negativeCssClass ? series.bars.negativeCssClass : null,
							barIndex: countBarSeries,
							enableHoverClass: series.enableHoverClass || series.bars.enableHoverClass
						} : false,
						line: series.line ? {
							shape: series.line.shape,
							cssClass: series.line.cssClass ? series.line.cssClass : null,
							color: extractInlineColor(series.line.color),
							enableHoverClass: series.enableHoverClass || series.line.enableHoverClass
						} : false,
						markers: series.markers ? {
							shape: (function () {
								switch (series.markers.shape) {
									case 'cross':
										return d3.symbolCross;
									case 'diamond':
										return d3.symbolDiamond;
									case 'square':
										return d3.symbolSquare;
									case 'triangle':
										return d3.symbolTriangle;
									case 'star':
										return d3.symbolStar;
									case 'wye':
										return d3.symbolWye;
									default:
										return d3.symbolCircle;
								}
							})(),
							sizeProperty: angular.isString(series.markers.sizeProperty) ? series.markers.sizeProperty : null,
							cssClass: series.markers.cssClass ? series.markers.cssClass : null,
							color: extractInlineColor(series.markers.color),
							getToolTipText: _.isFunction(series.markers.getToolTipText) ? series.markers.getToolTipText : null,
							enableHoverClass: series.enableHoverClass || series.markers.enableHoverClass
						} : false,
						labels: series.labels ? {
							getText: _.isFunction(series.labels.getText) ? series.labels.getText : _.identity,
							color: extractInlineColor(series.labels.color),
							cssClass: series.labels.cssClass ? series.labels.cssClass : null
						} : false,
						pairs: angular.isArray(series.pairs) ? _.filter(series.pairs, function (pair) {
							if (pair && angular.isDefined(pair.key) && angular.isDefined(pair.value)) {
								allKeys[pair.key] = true;
								return true;
							} else {
								return false;
							}
						}) : []
					};
					if (series.bars) {
						countBarSeries++;
					}
					seriesResult.keyAxis = _.find(keyAxes, {id: seriesResult.keyAxisId});
					seriesResult.valueAxis = _.find(valueAxes, {id: seriesResult.valueAxisId});
					return seriesResult;
				}), function (series) {
					return (series.pairs.length > 0) && series.keyAxis && series.valueAxis;
				});
				result.barSeriesCount = countBarSeries;
				result.keyCount = _.size(allKeys);
				return result;
			}

			function Chart(dataVisualizationLink, visParent) {
				platformDatavisService.DataVisualization.call(this, dataVisualizationLink, visParent.append('g').classed('orthoChart', true));
			}

			Chart.prototype = Object.create(platformDatavisService.DataVisualization.prototype);
			Chart.prototype.constructor = Chart;

			Chart.prototype.draw = function (info) { // jshint -W074
				function updateDrawingAreas(parentArea, fn) { // fn is called once for each series
					var series = parentArea.selectAll('g').data(seriesData, function (d) {
						return d.id;
					});

					var newSeries = series.enter().append('g');

					var obsoleteSeries = series.exit();
					obsoleteSeries.remove();

					series = newSeries.merge(series);
					series.each(fn);
				}

				var that = this;
				var data = info.data ? info.data : {};

				function addAnimation(selection) {
					if (!data.suppressAnimations) {
						return selection.transition().duration(400);
					}
					return selection;
				}

				function addHoverClassing(selection, elementDef) {
					if (!data.suppressHoverClass || (_.isObject(elementDef) && elementDef.enableHoverClass)) {
						return selection.on('mouseover', function () {
							d3.select(this).classed('hover', true);
						}).on('mouseout', function () {
							d3.select(this).classed('hover', false);
						});
					}
					return selection;
				}

				// axis definitions
				var keyAxes = extractCanonicalAxisDefs(data, 'key');
				var valueAxes = extractCanonicalAxisDefs(data, 'value');

				(function assignOtherAxes() {
					var defaultKeyAxis = _.find(keyAxes, {id: defaultAxisId});
					var defaultValueAxis = _.find(valueAxes, {id: defaultAxisId});

					keyAxes.forEach(function (axis) {
						axis.otherAxis = defaultValueAxis;
					});
					valueAxes.forEach(function (axis) {
						axis.otherAxis = defaultKeyAxis;
					});
				})();

				// client area
				var isKeyAxisHorizontal = !_.some(keyAxes, function (axisDef) {
					return !!axisDef.isHoriztonal;
				});
				var margin = {
					left: _.some(isKeyAxisHorizontal ? valueAxes : keyAxes, {position: 'near'}) ? 30 : 10,
					top: _.some(isKeyAxisHorizontal ? keyAxes : valueAxes, {position: 'near'}) ? 20 : 10,
					right: _.some(isKeyAxisHorizontal ? valueAxes : keyAxes, {position: 'far'}) ? 30 : 10,
					bottom: _.some(isKeyAxisHorizontal ? keyAxes : valueAxes, {position: 'far'}) ? 20 : 10
				};
				var clientSize = {
					width: info.width - margin.left - margin.right,
					height: info.height - margin.top - margin.bottom
				};

				// scales, axes and data
				var seriesData = extractCanonicalSeriesDef(data, keyAxes, valueAxes);

				keyAxes.forEach(function (keyAxis) {
					prepareAxis(keyAxis, data, clientSize, seriesData);
				});
				valueAxes.forEach(function (valueAxis) {
					prepareAxis(valueAxis, data, clientSize, seriesData);
				});

				// data drawing area
				var drawingArea = info.visParent.select('g.drawingArea');
				if (drawingArea.empty()) {
					drawingArea = info.visParent.append('g').classed('drawingArea', true);
				}
				drawingArea.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

				var highlightDrawingAreas = {};
				(function () {
					var highlightDrawingArea = drawingArea.select('g.highlights');
					if (highlightDrawingArea.empty()) {
						highlightDrawingArea = drawingArea.append('g').classed('highlights', true);
					}

					highlightDrawingAreas.key = highlightDrawingArea.select('g.keyHighlights');
					if (highlightDrawingAreas.key.empty()) {
						highlightDrawingAreas.key = highlightDrawingArea.append('g').classed('keyHighlights', true);
					}

					highlightDrawingAreas.value = highlightDrawingArea.select('g.valueHighlights');
					if (highlightDrawingAreas.value.empty()) {
						highlightDrawingAreas.value = highlightDrawingArea.append('g').classed('valueHighlights', true);
					}
				})();

				function retrieveDrawingArea(name, parent) {
					if (!parent) {
						parent = drawingArea;
					}
					var resultDrawingArea = parent.select('g.' + name);
					if (resultDrawingArea.empty()) {
						resultDrawingArea = parent.append('g').classed(name, true);
					}
					return resultDrawingArea;
				}

				var barDrawingArea = retrieveDrawingArea('bars');
				var lineDrawingArea = retrieveDrawingArea('lines');
				var markerDrawingArea = retrieveDrawingArea('markers');
				var labelDrawingArea = retrieveDrawingArea('chartLabels');

				var axisDrawingArea = retrieveDrawingArea('axes', info.visParent);
				var keyAxisDrawingArea = retrieveDrawingArea('keyAxes', axisDrawingArea);
				var valueAxisDrawingArea = retrieveDrawingArea('valueAxes', axisDrawingArea);

				var barSizeInfo = (function () {
					var result = {
						keyPadding: 4,
						barPadding: 1
					};
					result.keySize = (isKeyAxisHorizontal ? that.width : that.height) / seriesData.keyCount - 2 * result.keyPadding;
					result.barSize = result.keySize / seriesData.barSeriesCount - 2 * result.barPadding;
					return result;
				})();

				updateDrawingAreas(barDrawingArea, function (d) {
					var seriesDef = d;
					var keyAxis = seriesDef.keyAxis;
					var valueAxis = seriesDef.valueAxis;

					var rects = d3.select(this).selectAll('rect.bar').data(d.pairs, function (d) {
						return d.key;
					});

					if (seriesDef.bars) {
						var barsDef = seriesDef.bars;

						var newRects = addHoverClassing(rects.enter().append('rect').classed('bar', true), barsDef);
						if (barsDef.cssClass) {
							newRects.classed(barsDef.cssClass, true);
						}

						var obsoleteRects = rects.exit();
						obsoleteRects.remove();

						rects = newRects.merge(rects);

						if (_.isString(barsDef.color)) {
							rects.style('fill', barsDef.color);
						} else {
							rects.style('fill', null);
						}

						rects.each(function (d) {
							var attrs = {};

							// key axis
							attrs[keyAxis.isHorizontal ? 'x' : 'y'] = keyAxis.scale(d.key) - barSizeInfo.keySize / 2 +
								barsDef.barIndex * (barSizeInfo.barSize + 2 * barSizeInfo.barPadding) + barSizeInfo.barPadding;
							attrs[keyAxis.isHorizontal ? 'width' : 'height'] = barSizeInfo.barSize + 'px';

							// value axis
							var scaledBaseValue = valueAxis.scale(barsDef.baseValue);
							var scaledValue = valueAxis.scale(d.value);

							var valuePos, valueSize;
							if (valueAxis.isReversed) {
								valueSize = scaledBaseValue - scaledValue;
								valuePos = valueSize >= 0 ? valueAxis.scale(d.value) : valueAxis.scale(barsDef.baseValue);
							} else {
								valueSize = scaledValue - scaledBaseValue;
								valuePos = valueSize >= 0 ? valueAxis.scale(barsDef.baseValue) : valueAxis.scale(d.value);
							}
							attrs[keyAxis.isHorizontal ? 'y' : 'x'] = valuePos;

							attrs[keyAxis.isHorizontal ? 'height' : 'width'] = Math.abs(valueSize);

							var rects = addAnimation(d3.select(this)).attrs(attrs);
							if (barsDef.positiveCssClass) {
								rects.classed(barsDef.positiveCssClass, valueSize >= 0);
							}
							if (barsDef.negativeCssClass) {
								rects.classed(barsDef.negativeCssClass, valueSize < 0);
							}
						});
					} else {
						rects.remove();
					}
				});

				updateDrawingAreas(lineDrawingArea, function (d) {
					var seriesDef = d;
					var keyAxis = seriesDef.keyAxis;
					var valueAxis = seriesDef.valueAxis;

					var line = d3.select(this).selectAll('path.line');
					if (seriesDef.line) {
						var lineDef = seriesDef.line;
						if (line.empty()) {
							line = addHoverClassing(d3.select(this).append('path').classed('line', true), lineDef);
							if (lineDef.cssClass) {
								line.classed(lineDef.cssClass, true);
							}
						}

						if (_.isString(lineDef.color)) {
							line.style('stroke', lineDef.color);
						} else {
							line.style('stroke', null);
						}

						var lineFormatter = d3.line().x(function (d) {
							return keyAxis.isHorizontal ? keyAxis.scale(d.key) : valueAxis.scale(d.value);
						}).y(function (d) {
							return keyAxis.isHorizontal ? valueAxis.scale(d.value) : keyAxis.scale(d.key);
						});
						switch (lineDef.shape) {
							case 'step':
								lineFormatter.curve(d3.curveStep);
								break;
							case 'bspline':
								lineFormatter.curve(d3.curveBasis);
								break;
							case 'cardinal':
							case 'cubic':
								lineFormatter.curve(d3.curveCardinal);
								break;
							default:
								lineFormatter.curve(d3.curveLinear);
								break;
						}

						addAnimation(line.datum(d.pairs)).attr('d', lineFormatter);
					} else {
						if (!line.empty()) {
							line.remove();
						}
					}
				});

				updateDrawingAreas(markerDrawingArea, function (d) {
					var seriesDef = d;
					var keyAxis = seriesDef.keyAxis;
					var valueAxis = seriesDef.valueAxis;

					var paths = d3.select(this).selectAll('path.marker').data(d.pairs, function (d) {
						return d.key;
					});
					if (seriesDef.markers) {
						var markersDef = seriesDef.markers;

						var newPaths = addHoverClassing(paths.enter().append('path').classed('marker entering', true), markersDef);
						if (markersDef.cssClass) {
							newPaths.classed(markersDef.cssClass, true);
						}
						if (markersDef.getToolTipText) {
							newPaths.style('fill', 'transparent').each(function (d, i) {
								var markerEl = d3.select(this);
								markerEl.append('title').text(markersDef.getToolTipText(d, i));
							});
						}

						var obsoletePaths = paths.exit();
						obsoletePaths.remove();

						paths = newPaths.merge(paths);

						if (_.isString(markersDef.color)) {
							paths.style('stroke', markersDef.color);
						} else {
							paths.style('stroke', null);
						}

						paths.each(function (d) {
							var attrs = {};

							attrs.transform = 'translate(' + (keyAxis.isHorizontal ? keyAxis.scale(d.key) : valueAxis.scale(d.value)) + ',' + (keyAxis.isHorizontal ? valueAxis.scale(d.value) : keyAxis.scale(d.key)) + ')';

							var symbol = d3.symbol().type(markersDef.shape);
							if (markersDef.sizeProperty) {
								var sizeValue = _.get(d, markersDef.sizeProperty);
								if (isFinite(sizeValue)) {
									symbol.size(sizeValue);
								} else {
									symbol.size(0);
								}
							}

							attrs.d = symbol;

							var markerEl = d3.select(this);
							if (markerEl.classed('entering')) {
								markerEl.classed('entering', false).attrs(attrs);
							} else {
								addAnimation(markerEl).attrs(attrs);
							}
						});
					} else {
						paths.remove();
					}
				});

				updateDrawingAreas(labelDrawingArea, function (d) {
					var seriesDef = d;
					var keyAxis = seriesDef.keyAxis;
					var valueAxis = seriesDef.valueAxis;

					var labels = d3.select(this).selectAll('text.chartLabel').data(d.pairs, function (d) {
						return d.key;
					});

					if (seriesDef.labels) {
						var labelsDef = seriesDef.labels;

						var avgNumSize = (function (parent) {
							var testText = '0123456789';
							var measurementText = parent.append('text').classed('temporaryMeasurement chartLabel', true).text(testText);
							try {
								if (labelsDef.cssClass) {
									measurementText.classed(labelsDef.cssClass, true);
								}
								var bbox = measurementText.node().getBBox();
								return {
									width: bbox.width / testText.length,
									height: bbox.height
								};
							} finally {
								measurementText.remove();
							}
						})(d3.select(this));

						var newLabels = labels.enter().append('text').classed('chartLabel', true).styles({
							'text-anchor': 'middle',
							'pointer-events': 'none'
						}).attrs({
							dy: '-2px'
						});
						if (labelsDef.cssClass) {
							newLabels.classed(labelsDef.cssClass, true);
						}

						var obsoleteLabels = labels.exit();
						obsoleteLabels.remove();

						labels = newLabels.merge(labels);

						if (_.isString(labelsDef.color)) {
							labels.style('fill', labelsDef.color);
						} else {
							labels.style('fill', null);
						}

						labels.attrs(function (d) {
							var attrs = {};
							attrs[keyAxis.isHorizontal ? 'x' : 'y'] = keyAxis.scale(d.key);
							attrs[keyAxis.isHorizontal ? 'y' : 'x'] = valueAxis.scale(d.value);
							this.collisionRectInfo = _.clone(attrs);
							this.collisionRectInfo.visible = true;
							return attrs;
						}).text(function (d, i, nodes) {
							var text = labelsDef.getText.call(this, d, i, nodes);
							var halfTextWidth = text.length * avgNumSize.width / 2;
							_.assign(this.collisionRectInfo, {
								x1: this.collisionRectInfo.x - halfTextWidth,
								x2: this.collisionRectInfo.x + halfTextWidth,
								y1: this.collisionRectInfo.y - 2 - avgNumSize.height,
								y2: this.collisionRectInfo.y - 2
							});
							return text;
						});
					} else {
						labels.remove();
					}
				});

				(function hideCollidingLabels() {
					function rectsOverlap(info1, info2) {
						return (info1.x1 < info2.x2) && (info2.x1 < info1.x2) && (info1.y1 < info2.y2) && (info2.y1 < info1.y2);
					}

					drawingArea.selectAll('g.chartLabels text.chartLabel').style('display', function (d, i, nodes) {
						var collisionFound = false;
						if (this.collisionRectInfo) {
							for (var idx = 0; idx < i; idx++) {
								var otherNode = nodes[idx];
								if (otherNode.collisionRectInfo && otherNode.collisionRectInfo.visible) {
									if (rectsOverlap(this.collisionRectInfo, otherNode.collisionRectInfo)) {
										collisionFound = true;
										break;
									}
								}
							}
							if (collisionFound) {
								this.collisionRectInfo.visible = false;
							}
						}
						return collisionFound ? 'none' : 'inline';
					});
				})();

				var drawAxes = function (parent, axisDefs) {
					var axes = parent.selectAll('g.axis').data(axisDefs, function (d) {
						return d.id;
					});

					var newAxes = axes.enter().append('g').classed('axis', true);

					var obsoleteAxes = axes.exit();
					obsoleteAxes.remove();

					axes = newAxes.merge(axes);

					axes.each(function (d) {
						var axisDef = d;
						var axisParent = d3.select(this);

						axisParent.attr('transform', axisDef.getAxisTransform(margin, clientSize));
						axisParent.call(axisDef.axis);

						if (!axisDef.isHorizontal) {
							var maxWidth = 0;
							axisParent.selectAll('.tick text').each(function () {
								var width = this.getComputedTextLength();
								if (width > maxWidth) {
									maxWidth = width;
								}
							});
							if (maxWidth > 20) {
								var shrinkRatio = 20 / maxWidth;
								axisParent.selectAll('.tick text').each(function () {
									var text = d3.select(this).text();
									d3.select(this).text(null).append('tspan').attr('dy', '0.5ex').attr('font-size', Math.round(shrinkRatio * 100) + '%').text(text);
								});
							}
						}
					});
				};
				drawAxes(keyAxisDrawingArea, keyAxes);
				drawAxes(valueAxisDrawingArea, valueAxes);

				var drawHighlights = function (parent, axisDefs) {
					var hlAxisParents = parent.selectAll('g.axis-highlight').data(axisDefs, function (axisDef) {
						return axisDef.id;
					});

					var newHlAxisParents = hlAxisParents.enter().append('g').classed('axis-highlight', true);

					var obsoleteHlAxisParents = hlAxisParents.exit();
					obsoleteHlAxisParents.remove();

					hlAxisParents = newHlAxisParents.merge(hlAxisParents);

					hlAxisParents.each(function (d) {
						var axisDef = d;
						var hlAxisParent = d3.select(this);

						var hlParents = hlAxisParent.selectAll('g.highlight').data(axisDef.highlights, function (hl) {
							return hl.id;
						});

						var newHlParents = hlParents.enter().append('g').classed('highlight entering', true);
						newHlParents.each(function (d) {
							if (d.cssClass) {
								d3.select(this).classed(d.cssClass, true);
							}
							d3.select(this).append('line').attrs({
								x1: 0,
								y1: 0
							});
							d3.select(this).append('text');
						});

						var obsoleteHlParents = hlParents.exit();
						obsoleteHlParents.remove();

						hlParents = newHlParents.merge(hlParents);

						hlParents.each(function (d) {
							var scaledAnchor = axisDef.scale(d.anchor);
							if (_.isNaN(scaledAnchor)) {
								scaledAnchor = 0;
							}

							var thisSel = d3.select(this);
							if (thisSel.classed('entering')) {
								thisSel.classed('entering', false).attr('transform', 'translate(' + (axisDef.isHorizontal ? scaledAnchor : 0) + ',' + (axisDef.isHorizontal ? 0 : scaledAnchor) + ')');
							} else {
								addAnimation(thisSel).attr('transform', 'translate(' + (axisDef.isHorizontal ? scaledAnchor : 0) + ',' + (axisDef.isHorizontal ? 0 : scaledAnchor) + ')');
							}

							var attrs = {
								x2: axisDef.isHorizontal ? 0 : clientSize.width,
								y2: axisDef.isHorizontal ? clientSize.height : 0
							};
							thisSel.select('line').attrs(attrs);
						});
					});
				};
				drawHighlights(highlightDrawingAreas.key, keyAxes);
				drawHighlights(highlightDrawingAreas.value, valueAxes);
			};

			return function (link, visParent) {
				return new Chart(link, visParent);
			};
		}]);
})();
