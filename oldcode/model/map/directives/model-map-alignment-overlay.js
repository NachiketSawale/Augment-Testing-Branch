/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var sizePattern = /^\s*(\d+)\s*(?:px)?\s*$/i;

	angular.module('model.map').directive('modelMapAlignmentOverlay', ['d3', 'modelMapLevelDataService', '_',
		'platformUnitFormattingService', '$translate',
		function (d3, modelMapLevelDataService, _, platformUnitFormattingService, $translate) {
			return {
				restrict: 'A',
				scope: {
					setLink: '&'
				},
				link: function (scope, elem) {
					var drawingArea = d3.select(elem[0]);
					drawingArea.classed('model-map-alignment-overlay', true);

					var bg = drawingArea.append('rect').classed('background', true).attrs({
						width: '100%',
						height: '100%'
					});

					var markersLayer = drawingArea.select('g.markers');
					if (markersLayer.empty()) {
						markersLayer = drawingArea.append('g').classed('markers', true);
					}

					var levelMarkersLayer = drawingArea.select('g.levelMarkers');
					if (levelMarkersLayer.empty()) {
						levelMarkersLayer = drawingArea.append('g').classed('levelMarkers', true).style('opacity', 0);
					}

					var state = {
						svgNamespaceUri: drawingArea.node().namespaceURI,
						interactionListener: null,
						levelInteractionListener: null,
						currentMarkers: [],
						currentLevelMarkers: [],
						findMarkerAtPoint: function (x, y) {
							switch (state.mode) {
								case 'alignment':
									return _.find(state.currentMarkers, function (m) {
										var dx = m.x - x;
										var dy = m.y - y;
										return Math.sqrt(dx * dx + dy * dy) <= state.markerGraphicSize + 5;
									});
								case 'levels':
									return _.find(state.currentLevelMarkers, function (lm) {
										var dx = lm.x - x;
										var dy = lm.y - y;
										return Math.sqrt(dx * dx + dy * dy) <= 12;
									});
							}
						},
						markerDragOperation: null,
						modelPanOperation: null,
						modelRotationOperation: null,
						modelZoomOperation: null,
						mode: 'alignment',
						markerGraphic: null,
						markerGraphicSize: 10,
						updateRequest: null,
						tryUpdate: function (data) {
							if (this.markerGraphic) {
								this.doUpdate(data);
								return true;
							} else {
								this.updateRequest = {
									data: this.updateRequest ? _.assign(this.updateRequest.data, data) : data
								};
								return false;
							}
						},
						tryCompleteRequests: function () {
							if (this.updateRequest) {
								if (this.tryUpdate(this.updateRequest.data)) {
									this.updateRequest = null;
								}
							}
						},
						doUpdate: function (data) {
							var that = this;

							if (_.isObject(data)) {
								if (_.isArray(data.markers)) {
									that.currentMarkers = data.markers;
								}
								if (_.isArray(data.levelMarkers)) {
									that.currentLevelMarkers = data.levelMarkers;
								}
							}

							(function drawMarkers() {
								(function drawHelperLine() {
									var helperLine = markersLayer.select('line.helper');
									if (helperLine.empty()) {
										helperLine = markersLayer.append('line').classed('helper', true);
									}

									if (_.isArray(that.currentMarkers)) {
										var start = _.find(that.currentMarkers, {id: 'ref1'});
										var end = _.find(that.currentMarkers, {id: 'ref2'});

										if (start && end) {
											var delta = {
												x: end.x - start.x,
												y: end.y - start.y
											};
											delta.length = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
											if (delta.length >= 3 * state.markerGraphicSize) {
												var offsetDelta = {
													x: delta.x / delta.length * state.markerGraphicSize,
													y: delta.y / delta.length * state.markerGraphicSize
												};
												helperLine.attrs({
													x1: start.x + offsetDelta.x,
													y1: start.y + offsetDelta.y,
													x2: end.x - offsetDelta.x,
													y2: end.y - offsetDelta.y
												}).classed('short', false);
												return;
											}
										}
									}

									helperLine.classed('short', true);
								})();

								var markerGs = markersLayer.selectAll('g.marker').data(that.currentMarkers, function (d) {
									return d.id;
								});

								var newMarkerGs = markerGs.enter().append('g').classed('marker', true).each(function (d) {
									d3.select(this).classed(d.type, true);
								});
								newMarkerGs.append(function () {
									var el = document.createElementNS(state.svgNamespaceUri, 'g');
									for (var i = 0; i < state.markerGraphic.documentElement.children.length; i++) {
										var child = state.markerGraphic.documentElement.children[i];
										el.appendChild(child.cloneNode(true));
									}
									el.setAttribute('style', state.markerGraphic.documentElement.getAttribute('style') || '');
									el.setAttribute('transform', 'translate(-' + state.markerGraphicSize + ',-' + state.markerGraphicSize + ')');
									return el;
								});
								newMarkerGs.append('text').classed('marker-color', true).attrs({
									x: state.markerGraphicSize * 4 / 5,
									y: state.markerGraphicSize * 4 / 5
								}).text(function (d) {
									switch (d.id) {
										case 'ref1':
											return $translate.instant('model.map.alignmentEditor.refPoint1Label');
										case 'ref2':
											return $translate.instant('model.map.alignmentEditor.refPoint2Label');
									}
									return '';
								});

								markerGs.exit().remove();

								markerGs = newMarkerGs.merge(markerGs);
								markerGs.attr('transform', function (d) {
									return 'translate(' + d.x + ',' + d.y + ')';
								});
							})();

							(function drawLevelMarkers() {
								var levelMarkerGs = levelMarkersLayer.selectAll('g.levelMarker').data(that.currentLevelMarkers, function (d) {
									return d.id;
								});

								var newLevelMarkerGs = levelMarkerGs.enter().append('g').classed('levelMarker', true).each(function (d) {
									var thisSel = d3.select(this);
									thisSel.classed(d.id, true).append('path').attr('d', (function () {
										switch (d.id) {
											case 'zMax':
												return 'M 0,0 L -10,0 L -10,5 Z';
											case 'zMin':
												return 'M 0,0 L -10,0 L -10,-5 Z';
											case 'zLevel':
												return 'M 0,0 L -10,0 L -10,5';
											case 'zLevelBoundary':
												return 'M 0,0 L -10,0 L -10,-5';
											default:
												return 'M 0,0 L -10,0';
										}
									})());

									this.zText = thisSel.append('text').attrs({
										x: -13,
										y: 0
									});
								});

								levelMarkerGs.exit().remove();

								levelMarkerGs = newLevelMarkerGs.merge(levelMarkerGs);
								levelMarkerGs.attr('transform', function (d) {
									return 'translate(' + d.x + ',' + d.y + ')';
								}).each(function (d) {
									this.zText.text(platformUnitFormattingService.formatLength(Math.round(d.zValue * 100) / 100));
								});
							})();
						}
					};

					modelMapLevelDataService.loadAlignmentMarkerGraphic().then(function (svg) {
						state.markerGraphic = svg;
						state.markerGraphicSize = (function () {
							var sizeAttr = svg.documentElement.getAttribute('width');
							if (sizeAttr && _.isString(sizeAttr)) {
								var match = sizeAttr.match(sizePattern);
								if (match) {
									return parseInt(match[1]) / 2;
								}
							}
							return 10;
						})();
						state.tryCompleteRequests();
					});

					function calculateDelta(event) {
						state.modelRotationOperation.deltaY = event.pageY - state.modelRotationOperation.currentY;
						state.modelRotationOperation.deltaX = event.pageX - state.modelRotationOperation.currentX;
						state.modelRotationOperation.currentX = event.pageX;
						state.modelRotationOperation.currentY = event.pageY;
					}

					bg.on('mousedown', function () {
						if (d3.event.button === 0) {
							var m = state.findMarkerAtPoint(d3.event.offsetX, d3.event.offsetY);
							if (m) {
								state.markerDragOperation = {
									marker: m,
									x: d3.event.offsetX - m.x,
									y: d3.event.offsetY - m.y
								};
							} else {
								state.modelRotationOperation = {
									deltaY: 0,
									deltaX: 0,
									currentX: 0,
									currentY: 0
								};
								calculateDelta(d3.event);
							}

						} else if (d3.event.button === 1) {
							state.modelPanOperation = {
								x: d3.event.offsetX,
								y: d3.event.offsetY
							};

						}

					}).on('mouseup', function () {
						if (d3.event.button === 0) {
							if (state.markerDragOperation) {
								state.markerDragOperation = null;
							}
							if (state.modelRotationOperation) {
								state.modelRotationOperation = null;
							}
						}

						if (d3.event.button === 1) {

							if (state.modelPanOperation) {
								state.modelPanOperation = null;
							}
						}
					}).on('mousemove', function () {
						if (state.markerDragOperation) {
							switch (state.mode) {
								case 'alignment':
									if (state.interactionListener) {
										state.interactionListener.moveMarker(state.markerDragOperation.marker.id,
											d3.event.offsetX - state.markerDragOperation.x,
											d3.event.offsetY - state.markerDragOperation.y);
									}
									break;
								case 'levels':
									if (state.levelInteractionListener) {
										state.levelInteractionListener.moveMarker(state.markerDragOperation.marker.id,
											d3.event.offsetX - state.markerDragOperation.x,
											d3.event.offsetY - state.markerDragOperation.y);
									}
									break;
							}
						}
						if (state.modelRotationOperation) {
							if (d3.event.button === 0) {
								if (state.mode === 'levels') {
									calculateDelta(d3.event);
									state.levelInteractionListener.rotateModel(state.modelRotationOperation.deltaX, state.modelRotationOperation.deltaY);
								}
							}

						}
						if (state.modelPanOperation) {
							var x = d3.event.offsetX;
							var y = d3.event.offsetY;
							var dx = x - state.modelPanOperation.x;
							var dy = y - state.modelPanOperation.y;
							if (Math.abs(dx) > 2 && Math.abs(dy) > 2) {
								if (dx * dx + dy * dy > 25) {
									switch (state.mode) {
										case 'alignment':
											if (state.interactionListener) {
												state.interactionListener.pan(x, y, state.modelPanOperation.x, state.modelPanOperation.y);
											}
											break;
										case 'levels':

											if (state.levelInteractionListener) {
												state.levelInteractionListener.panModel(x, y, state.modelPanOperation.x, state.modelPanOperation.y);
											}

											break;
									}
									state.modelPanOperation.x = x;
									state.modelPanOperation.y = y;
								}
							}
						}
					}).on('wheel', function () {
						switch (state.mode) {
							case 'alignment':
								if (state.interactionListener) {
									state.interactionListener.zoom(d3.event.offsetX, d3.event.offsetY, -d3.event.deltaY);
								}
								break;
							case 'levels':
								if (state.levelInteractionListener) {
									state.levelInteractionListener.zoomModel(d3.event.offsetX, d3.event.offsetY, -d3.event.deltaY);
								}
								break;
						}
					});

					scope.setLink({
						link: {
							updateMarkers: function (markers) {
								state.tryUpdate({
									markers: markers
								});
							},
							updateLevelMarkers: function (levelMarkers) {
								state.tryUpdate({
									levelMarkers: levelMarkers
								});
							},
							redraw: function () {
								state.tryUpdate();
							},
							setInteractionListener: function (listener) {
								state.interactionListener = listener;
							},
							setLevelInteractionListener: function (listener) {
								state.levelInteractionListener = listener;
							},
							setMode: function (mode) {
								if (mode === state.mode) {
									return;
								}

								switch (mode) {
									case 'levels':
										markersLayer.transition().duration(800).style('opacity', 0);
										levelMarkersLayer.transition().duration(800).style('opacity', 1);
										break;
									case 'alignment':
										markersLayer.transition().duration(800).style('opacity', 1);
										levelMarkersLayer.transition().duration(800).style('opacity', 0);
										break;
									default:
										throw new Error('Unknown model map alignment overlay mode: ' + mode);
								}
								state.markerDragOperation = null;
								state.mode = mode;
							}
						}
					});
				}
			};
		}
	]);
})(angular);
