/*
* $Id$
* Copyright (c) RIB Software SE
*/

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationCallOutOverlayService';

	myModule.factory(svcName, modelAnnotationCallOutOverlayService);

	modelAnnotationCallOutOverlayService.$inject = ['_', '$http', 'd3', 'modelAnnotationOverlayService',
		'basicsCommonSmartCanvasService', 'modelViewerModelSelectionService', 'basicsCommonDrawingUtilitiesService', '$translate', '$injector'];

	function modelAnnotationCallOutOverlayService(_, $http, d3, modelAnnotationOverlayService,
		basicsCommonSmartCanvasService, modelViewerModelSelectionService, basicsCommonDrawingUtilitiesService, $translate, $injector) {
		let averageCharWidth;
		let charHeight;

		function getVisibleMarkers(allMarkers) {
			return _.filter(allMarkers, m => isFinite(m.projected.x) && isFinite(m.projected.y));
		}

		class Quadrant {
			constructor(id, x, y, size, fillFromLeft, fillFromTop) {
				this.id = id;
				this.qx1 = x;
				this.qx2 = x + size.width;
				this.qy1 = y;
				this.qy2 = y + size.height;
				this.xq0 = fillFromLeft ? x + 5 : (x + size.width - 105);
				this.yq0 = fillFromTop ? y + 5 : (y + size.height - 105);
			}

			containsPoint(x, y) {
				return x >= this.qx1 && x < this.qx2 && y >= this.qy1 && y < this.qy2;
			}
		}

		class CallOutOverlay extends modelAnnotationOverlayService.AnnotationOverlay {

			constructor(scApp) {
				super(scApp);
				this.updating = false;
				this._initializeCallOutLayer('CallOuts', 15000);
				this._initializeCallOutLayer('Lines', 12000);
				this._currentCall = null;
				this._cachedAnnotations = [];
			}

			_initializeCallOutLayer(layerName, zIndex) {
				this._scApp.addLayer(layerName, zIndex);

				const layerEl = this._scApp.getLayerParent(layerName); // box, linien?
				layerEl.classed('annotation-callouts', true);

				let invisibleText = layerEl.append('text').text('Gg').attr('visibility', function () {
					return 'hidden';
				});

				let measurementText = invisibleText.node().getBBox();
				averageCharWidth = measurementText.width / 2;
				charHeight = measurementText.width;
			}

			_generateMarkerPointId(marker) {
				return `M_a${marker.AnnotationFk}_m${marker.Id}`;
			}

			draw(info, data) {
				const that = this;

				if (data.spatialInfo) {

					if (that._currentCall) {
						return;
					}
					if (!that.updating) {

						that.updating = true;

						that._currentCall = $http.get(globals.webApiBaseUrl + 'model/annotation/findnearest', {
							params: {
								modelId: modelViewerModelSelectionService.getSelectedModelId(),
								actorX: data.spatialInfo.actor.x,
								actorY: data.spatialInfo.actor.y,
								actorZ: data.spatialInfo.actor.z,
								viewingDirX: data.spatialInfo.viewingDirection.x,
								viewingDirY: data.spatialInfo.viewingDirection.y,
								viewingDirZ: data.spatialInfo.viewingDirection.z
							}

						}).then(function integrateBestMatchingAnnotations(response) {

							const annotations = response.data;
							that._scApp.suspendPointUpdates();

							const markerPoints = [];
							for (let annotation of annotations) {
								if (Array.isArray(annotation.MarkerEntities)) {
									for (let marker of annotation.MarkerEntities) {
										const ptId = that._generateMarkerPointId(marker);
										markerPoints.push({
											id: ptId,
											type: 'coord3d',
											spec: {
												x: marker.PosX,
												y: marker.PosY,
												z: marker.PosZ
											}
										});
									}
								}
							}
							that._scApp.replacePointSet('annoMarkerPoints', markerPoints);
							that._cachedAnnotations = annotations;
							that._scApp.resumePointUpdates();
							that.updating = false;
							// that._updateGraphics(info, data);
						}).then(function finalizeAnnotationUpdate() {
							that._currentCall = null;
						});
					}
				}
				that._updateGraphics(info, data);
			}

			_updateGraphics(info, data) {

				const that = this;

				const viewportSize = info.getViewportSize();
				const quadrantSize = {
					width: viewportSize.width / 2,
					height: viewportSize.height / 2
				};
				const quadrant = [
					new Quadrant(1, 0, 0, quadrantSize, true, true),
					new Quadrant(2, quadrantSize.width, 0, quadrantSize, false, true),
					new Quadrant(3, 0, quadrantSize.height, quadrantSize, true, false),
					new Quadrant(4, quadrantSize.width, quadrantSize.height, quadrantSize, false, false)
				];

				const annotations = that._cachedAnnotations;

				const groupedAnnotations = {
					withVisibleMarkers: [],
					withGoodCameras: [],
					others: []
				};

				let positionX = 5;
				let positionY = 5;
				for (let annotation of annotations) {

					annotation.projected = {
						x: 0,
						y: 0,
						width: 100 - 2,
						height: charHeight
					};

					let length = Math.ceil(annotation.projected.width / averageCharWidth);

					annotation.substrings = this.chunkString(annotation.DescriptionInfo.Translated, length);

					annotation.translated = {
						x: positionX,
						y: positionY
					};
					positionY = positionY + Math.trunc(charHeight) * annotation.substrings.length + 5;

					if (Array.isArray(annotation.MarkerEntities)) {
						for (let marker of annotation.MarkerEntities) {
							const ptId = that._generateMarkerPointId(marker);
							marker.projected = that._scApp.getProjectedPoint(ptId);
						}

						annotation.visibleMarkers = getVisibleMarkers(annotation.MarkerEntities);
						if (annotation.visibleMarkers.length > 0) {
							groupedAnnotations.withVisibleMarkers.push(annotation);
							annotation.hasVisibleMarkers = true;
							continue;
						}
					}

					if (annotation.HasGoodCamera) {
						groupedAnnotations.withGoodCameras.push(annotation);
						continue;
					}

					groupedAnnotations.others.push(annotation);
				}

				// pre-scanning for empty areas
				if (groupedAnnotations.withGoodCameras.length + groupedAnnotations.others.length > 0) {
					for (let annotation of groupedAnnotations.withVisibleMarkers) {
						const markerQuadrants = _.map(annotation.visibleMarkers, function (marker) {
							return _.find(quadrant, q => q.containsPoint(marker.projected.x, marker.projected.y));
						});
						for (let mq of markerQuadrants) {
							if (mq) {
								mq.mightContainRelPoints = true;
							}
						}
					}
				}

				// final assignment of positions
				for (let annotation of annotations) {
					if (annotation.hasVisibleMarkers) {
						const markerQuadrants = _.map(annotation.visibleMarkers, function (marker) {
							return _.find(quadrant, q => q.containsPoint(marker.projected.x, marker.projected.y) && !q.containsAnnotations);
						});

						if (_.every(markerQuadrants, _.isNil)) {
							annotation.hidden = true;
						} else {
							for (let mq of markerQuadrants) {
								if (mq) {
									mq.containsRelPoints = true;
								}
							}
						}

						const candidateQuadrants = _.filter(quadrant, q => !q.containsRelPoints);
						for (let i = 0; i < candidateQuadrants.length; i++) {
							annotation.hidden = true;
							if ((candidateQuadrants[i].yq0 + annotation.height) < candidateQuadrants[i].qy2) {
								annotation.projected.x = candidateQuadrants[i].xq0;
								annotation.projected.y = candidateQuadrants[i].yq0;
								candidateQuadrants[i].yq0 += annotation.height + 2;
								candidateQuadrants[i].containsAnnotations = true;
								annotation.hidden = false;
								break;
							}
						}
					}
				}

				const visibleAnnotations = _.filter(annotations, a => !a.hidden);

				that._updateCallOutGraphics(info, data, visibleAnnotations);
				that._updateLineGraphics(info, data, visibleAnnotations);
			}

			splitString(str) {
				let resultArray = [];
				let tempString = '';

				if (!str || str.length === 0) {
					str = $translate.instant('model.annotation.noTitle');
				}
				for (let i = 0; i < str.length; i++) {
					if (str[i] !== ' ') {
						if (str[i] === '-' || str[i] === ':') {
							tempString += str[i];
							resultArray.push(tempString);
							tempString = '';
							i++;
						}
						tempString += str[i];
					} else if (tempString.trim()) {
						resultArray.push(tempString);
						tempString = '';
					}
				}
				if (tempString) {
					resultArray.push(tempString);
				}
				return resultArray;
			}

			chunkString(str, len) {
				let input = this.splitString(str);
				let [index, output] = [0, []];
				output[index] = '';
				input.forEach(word => {
					let space = output[index][output[index].length - 1] === ('-' || ':') ? '' : ' ';
					let temp = `${output[index]}${space}${word}`.trim();

					if (temp.length <= len) {
						output[index] = temp;
					} else {
						index++;
						output[index] = word;
					}
				});
				return output;
			}

			_updateCallOutGraphics(info, data, annotations) {

				const displayedAnnotations = _.filter(annotations, a => info.annotationVisibility.isVisible(a.RawType));
				var annoCallOuts = info.layers.CallOuts.selectAll('g.annotation').data(displayedAnnotations, a => a.Id);

				d3.selectAll('.annotation-callouts-overly').remove(); 

				var newAnnoCallOuts = annoCallOuts.enter().append('g').classed('annotation-callouts-overly', true).each(function (d) {
					const thisEl = d3.select(this).attr('transform', `translate(${d.translated.x},${d.translated.y})`).on('click', function (d) {
						let modelAnnotationDataService = null;
						if (!modelAnnotationDataService) {
							modelAnnotationDataService = $injector.get('modelAnnotationDataService');
							modelAnnotationDataService.selectAnnotationEntity(d.Id);
						}
					});

					const colorInRGB = basicsCommonDrawingUtilitiesService.intToRgbColor(d.Color);

					if (d.Color === null) {
						colorInRGB.r = 128;
						colorInRGB.g = 255;
						colorInRGB.b = 255;
					}
					const luminance = colorInRGB.getLuminance();
					const textColor = luminance >= 0.5 ? '#000' : '#FFF';

					this.visualParts = {
						box: thisEl.append('rect').attrs({
							rx: 8
						}).style('fill', d.Color === null ? 'rgb(128,255,255)' : `rgb(${colorInRGB.r}, ${colorInRGB.g}, ${colorInRGB.b})`)
							.attr('opacity', '0.5').style('stroke', d3.rgb('#000080').darker())
					};

					let desc = d.substrings;
					let textTranslateY = 12;

					desc.forEach((d) => {
						thisEl.append('text').text(d)
							.attr('transform', `translate(5,${textTranslateY})`)
							.style('fill', textColor);
						textTranslateY = textTranslateY + 12;
					});
				});

				annoCallOuts.exit().remove();
				annoCallOuts = newAnnoCallOuts.merge(annoCallOuts);

				annoCallOuts.each(function (d) {

					this.visualParts.box.attrs({
						x: d.projected.x,
						y: d.projected.y,
						width: d.projected.width,
						height: Math.trunc(d.projected.height) * d.substrings.length
					});
				});

			}

			_updateLineGraphics(info, data, annotations) {
				let annoCallOuts = info.layers.Lines.selectAll('g.annotation').data(annotations, a => a.Id);
				const newAnnoCallOuts = annoCallOuts.enter().append('g').classed('annotation', true).each(function () {
					this.visualParts = {
						lines: null
					};
				});
				annoCallOuts.exit().remove();

				annoCallOuts = newAnnoCallOuts.merge(annoCallOuts);

				annoCallOuts.each(function (d) {
					const thisEl = d3.select(this);
					const relevantMarkers = getVisibleMarkers(d.MarkerEntities);

					this.visualParts.lines = thisEl.selectAll('line').data(relevantMarkers);

					const newLines = this.visualParts.lines.enter()
						.append('line')
						.attr('stroke', d3.rgb('#000080').darker());

					this.visualParts.lines.exit().remove();

					this.visualParts.lines = newLines.merge(this.visualParts.lines);

					this.visualParts.lines
						.attrs(function (dp) {
							if (dp.projected.x > (d.projected.x + d.projected.width)) {
								return {
									x1: d.projected.x + d.projected.width,
									y1: d.projected.y + d.projected.height / 2,
									x2: dp.projected.x,
									y2: dp.projected.y
								};
							} else if (dp.projected.x < d.projected.x) {
								return {
									x1: d.projected.x,
									y1: d.projected.y + d.projected.height / 2,
									x2: dp.projected.x,
									y2: dp.projected.y
								};
							} else if (dp.projected.y > (d.projected.y + d.projected.height)) {
								return {
									x1: d.projected.x + d.projected.width / 2,
									y1: d.projected.y + d.projected.height,
									x2: dp.projected.x,
									y2: dp.projected.y
								};
							} else {
								return {
									x1: d.projected.x + d.projected.width / 2,
									y1: d.projected.y,
									x2: dp.projected.x,
									y2: dp.projected.y
								};
							}
						});
				});
			}
		}

		return {
			CallOutOverlay: CallOutOverlay
		};
	}
})(angular);

