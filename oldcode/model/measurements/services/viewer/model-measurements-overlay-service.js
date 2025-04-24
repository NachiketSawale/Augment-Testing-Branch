/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.measurements');
	const svcName = 'modelMeasurementOverlayService';

	myModule.factory(svcName, modelMeasurementOverlayService);

	modelMeasurementOverlayService.$inject = ['modelMeasurementOverlayDataService', 'd3', '_', '$http'];

	function modelMeasurementOverlayService(modelMeasurementOverlayDataService, d3, _, $http) {

		function generatePointSetId(measurement) {
			return `m${measurement.id}`;
		}

		/*function generatePointId(measurement, ptId) {
			return `m${measurement.id}_p${ptId}`;
		}*/

		const pointMarkerSize = 5;

		function generatePointGraphic(parent) {
			parent.append('circle').classed('point-marker', true).attrs({
				x1: -pointMarkerSize,
				y1: -pointMarkerSize,
				x2: pointMarkerSize,
				y2: pointMarkerSize,
				r: 5
			}).style('fill', d3.rgb('#FF0000'));
		}

		const service = {};

		const appId = 'modelMeasurements';
		const layerName = 'measurements';
		const previewLayerName = `${layerName}Preview`;
		const previewPointSetName = 'measurementPreview';

		class MeasurementOverlay {
			constructor(scMgr) {
				const that = this;

				that._scMgr = scMgr;
				that._scApp = scMgr.addApplication(appId);

				that._scApp.addLayer(layerName, 18000);
				that._scApp.addLayer(previewLayerName, 18010);

				const layerEl = that._scApp.getLayerParent(layerName);
				layerEl.classed('measurements', true);

				const previewLayerEl = that._scApp.getLayerParent(previewLayerName);
				previewLayerEl.classed('measurements-preview', true);

				//that._addAllPoints();

				that._previewPoints = {
					static: [],
					live: false
				};

				that.measurementVisibility = true;

				//clear the measurements
				modelMeasurementOverlayDataService.clearAllMeasurements();

				that._pointsUpdated = function () {
					that._redraw();
				};
				that._scApp.registerUpdate(that._pointsUpdated);

				that._measurementsUpdated = function () {
					that._redraw();
				};

				modelMeasurementOverlayDataService.registerMeasurementsChanged(that._measurementsUpdated);
				that._pointsChanged = function (changes) {
					that._scApp.suspendPointUpdates();

					for (let newPt of changes.added.concat(changes.modified)) {
						that._scApp.setPoint(newPt.id, 'coord3d', newPt.coordinates, newPt.owner);
					}

					for (let delPt of changes.removed) {
						if (delPt.id) {
							that._scApp.removePoint(delPt.id);
						} else if (delPt.owner) {
							that._scApp.removePointSet(delPt.owner);
						}
					}

					that._scApp.resumePointUpdates();

					that._redraw();
				};
				modelMeasurementOverlayDataService.registerPointsChanged(that._pointsChanged);
			}

			/*_addAllPoints() {
				const that = this;

				const data = modelMeasurementOverlayDataService.getAllMeasurements();
			}*/



			_removeMeasurement(measurement) {
				this._scApp.removePointSet(generatePointSetId(measurement));
			}

			_redrawPreview() {
				const that = this;

				const layerParent = that._scApp.getLayerParent(previewLayerName);

				let livePreviewPt = layerParent.select('g.live-point');
				if (livePreviewPt.empty()) {
					livePreviewPt = layerParent.append('g').classed('live-point', true);
					generatePointGraphic(livePreviewPt);
				}
				if (that._previewPoints.live) {
					const coords = that._scApp.getProjectedPoint('livePreview');
					if (coords) {
						livePreviewPt.attr('transform', `translate(${coords.x},${coords.y})`);
					}
					livePreviewPt.classed('hidden', !coords);
				} else {
					livePreviewPt.classed('hidden', true);
				}

				let previewPts = layerParent.selectAll('g.point').data(that._previewPoints.static, d => d.id);

				const newPreviewPts = previewPts.enter().append('g').classed('point', true);
				newPreviewPts.each(function () {
					const thisEl = d3.select(this);

					generatePointGraphic(thisEl);
				});

				previewPts.exit().remove();

				previewPts = newPreviewPts.merge(previewPts);

				previewPts.each(function (d) {
					const thisEl = d3.select(this);
					const coords = that._scApp.getProjectedPoint(d.id);

					thisEl.classed('hidden', !coords);
					if (coords) {
						thisEl.attr('transform', `translate(${coords.x},${coords.y})`);
					}
				});
			}

			_redraw() {
				const that = this;

				const data = modelMeasurementOverlayDataService.getAllMeasurements();

				if (that.measurementVisibility === false) {
					data.measurements = [];
				}
				/*if (data.measurements) {
					const request = data.measurements.map(obj => ({
						Id: obj.id,
						Value: obj.value,
						MeasurementType: obj.type,
						TargetUomFk: obj.type === 10 ? that.uomSettings.uomLengthFk :
							obj.type === 20 ? that.uomSettings.uomLengthFk :
								obj.type === 30 ? that.uomSettings.uomAreaFk :
									obj.type === 40 ? that.uomSettings.uomAreaFk : null
					}));
					$http.post(globals.webApiBaseUrl + 'model/measurement/formatvalues', request).then(function (response) {
						response.data.forEach(item => {
							const matchingMeasurement = data.measurements.find(measurement => measurement.id === item.Id);
							if (matchingMeasurement) {
								matchingMeasurement.Uom = item.Uom;
								switch (matchingMeasurement.type) {
									case 10:
										matchingMeasurement.displayMeasurement = 'L = ' + item.FormattedValue;
										break;
									case 20:
										matchingMeasurement.displayMeasurement = 'P = ' + item.FormattedValue;
										break;
									case 30:
										matchingMeasurement.displayMeasurement = 'A = ' + item.FormattedValue;
										break;
									case 40:
										matchingMeasurement.displayMeasurement = 'V = ' + item.FormattedValue;
										break;
								}
								//matchingMeasurement.displayMeasurement = item.FormattedValue;
							}
						});
					});
				}*/

				let measurements = that._scApp.getLayerParent(layerName).selectAll('g.measurement').data(data.measurements, d => d.id);

				const newMeasurements = measurements.enter().append('g').classed('measurement', true).classed('measurement', true);
				newMeasurements.each(function (measurement) {
					const thisEl = d3.select(this);

					if (measurement.color) {
						measurement.color = '#' + measurement.color.toString(16);
					}

					this.visualParts = {
						lines: thisEl.append('g').classed('lines', true),
						points: thisEl.append('g').classed('points', true),
						text: thisEl.append('text').classed('length-display', true)
					};
				});

				measurements.exit().remove();

				measurements = newMeasurements.merge(measurements);

				measurements.each(function (measurement) {
					const thisEl = d3.select(this).datum();
					const displayedParts = thisEl.getDisplayedParts();
					const relevantPointIds = _.uniq(_.flatten(displayedParts.map(dp => dp.points)));
					const points2d = (function initPoints2d () {
						const result = {};
						for (let ptId of relevantPointIds) {
							result[ptId] = that._scApp.getProjectedPoint(ptId);
						}
						return result;
					})();

					let paths = this.visualParts.lines.selectAll('path').data(displayedParts);
					let newPaths = null;

					if (measurement.name === 'Area' || measurement.name === 'Volume') {
						if (measurement.color) {
							newPaths = paths.enter().append('path')
								.style('stroke', d3.rgb(measurement.color).darker(3))
								.style('stroke-width', '3')
								.style('stroke-dasharray', '7')
								.style('fill', d3.rgb(measurement.color))
								.style('opacity', '0.3')
								.attr('fill', 'null');
						} else {
							newPaths = paths.enter().append('path').classed('measured', true).attr('fill', 'null');
						}
					} else {
						newPaths = paths.enter().append('path')
							.style('stroke', dp => dp.filled ? d3.rgb(measurement.color).darker(3) : measurement.color)
							.style('stroke-width', '3')
							.style('stroke-dasharray', '7')
							.style('fill', dp => dp.filled ? d3.rgb(measurement.color) : 'none')
							.style('opacity', '0.5')
							.attr('fill', 'null');
					}

					paths.exit().remove();

					paths = newPaths.merge(paths);
					paths.attr('d', dp => {
						return dp.points.map((ptId, ptIdx) => {
							const pt2D = points2d[ptId];
							return (ptIdx === 0 ? 'M' : 'L') + ` ${pt2D.x},${pt2D.y}`;
						}).join(' ') + (dp.closeShape ? ' Z' : '');
					});


					let points = displayedParts[0].points;
					if (displayedParts.length > 1) {
						const dpPoints = [...displayedParts[0].points, ...displayedParts[1].points];
						points = this.visualParts.points.selectAll('g.point').data(dpPoints, (d, ptIdx) => ptIdx);
					} else {
						points = this.visualParts.points.selectAll('g.point').data(displayedParts[0].points, (d, ptIdx) => ptIdx);
					}


					const newPoints = points.enter().append('g').classed('point', true);
					newPoints.each(function () {
						generatePointGraphic(d3.select(this));
						if (measurement.color) {
							d3.select(this).append('circle')
								.attrs({
									x1: -pointMarkerSize,
									y2: pointMarkerSize,
									r: 5
								})
								.style('fill', measurement.color);
						}
					});
					points.exit().remove();

					points = newPoints.merge(points);

					points.attr('transform', function (pt) {
						const pt2D = points2d[pt];
						return `translate(${pt2D.x},${pt2D.y})`;
					});

					let pts2d = null;
					if (displayedParts.length > 1) {
						const dpPoints = [...displayedParts[0].points, ...displayedParts[1].points];
						pts2d = dpPoints.map((pt) => {
							const pt2D = points2d[pt];
							return pt2D;
						});
					} else {
						pts2d = displayedParts[0].points.map((pt) => {
							const pt2D = points2d[pt];
							return pt2D;
						});
					}

					this.visualParts.text.text(measurement.displayMeasurement);
					if (pts2d.length > 0) {
						if (measurement.color) {
							this.visualParts.text.attrs({
								x: pts2d.map(p => p.x).reduce((a, b) => a + b, 0) / pts2d.length,
								y: pts2d.map(p => p.y).reduce((a, b) => a + b, 0) / pts2d.length
							}).style('fill', d3.rgb(measurement.color).darker(2.5));
						} else {
							this.visualParts.text.attrs({
								x: pts2d.map(p => p.x).reduce((a, b) => a + b, 0) / pts2d.length,
								y: pts2d.map(p => p.y).reduce((a, b) => a + b, 0) / pts2d.length
							});
						}
					}
				});

				that._redrawPreview();
			}

			addPreviewPoint(x, y, z) {
				const newPreviewPt = {
					id: `previewPt${this._previewPoints.static.length}`,
					pos: {x, y, z}
				};

				this._scApp.setPoint(newPreviewPt.id, 'coord3d', newPreviewPt.pos, previewPointSetName);

				this._previewPoints.static.push(newPreviewPt);

				this._redrawPreview();
			}

			clearPreviewPoints() {
				this._previewPoints.static = [];
				this._scApp.removePointSet(previewPointSetName);
				this._redrawPreview();
			}

			showLivePreviewPoint(x, y, z) {
				this._previewPoints.live = true;
				this._scApp.setPoint('livePreview', 'coord3d', {x, y, z});
			}

			hideLivePreviewPoint() {
				if (this._previewPoints.live) {
					this._previewPoints.live = false;
					this._redrawPreview();
				}
			}

			finalize() {
				modelMeasurementOverlayDataService.unregisterMeasurementsChanged(this._measurementsUpdated);
				modelMeasurementOverlayDataService.unregisterPointsChanged(this._pointsChanged);
				this._scApp.unregisterUpdate(this._pointsUpdated);

				this._scMgr.removeApplication(appId);
			}
		}

		service.initialize = function (viewerAdapter, scMgr, uomInfo) {
			const overlay = new MeasurementOverlay(scMgr);
			//overlay.uomSettings = () => uomInfo.currentUnitSettings();
			//overlay.uomSettings = uomInfo.currentUnitSettings();
			//modelMeasurementOverlayDataService.saveUomSettings(overlay.uomSettings);
			const that = this;

			that.uomSettings = () => uomInfo.currentUnitSettings();

			that.bindToAnnoVisibilities = function () {
				overlay.measurementVisibility = viewerAdapter.getAnnotationVisibility().isVisible(5);
				overlay._redraw();
			};
			viewerAdapter.getAnnotationVisibility().registerVisibilitiesChanged(that.bindToAnnoVisibilities);

			return {
				finalize() {
					overlay.finalize();
					viewerAdapter.getAnnotationVisibility().unregisterVisibilitiesChanged(that.bindToAnnoVisibilities);
				},
				addPreviewPoint(x, y, z) {
					overlay.addPreviewPoint(x, y, z);
				},
				clearPreviewPoints() {
					overlay.clearPreviewPoints();
				},
				showLivePreviewPoint(x, y, z) {
					overlay.showLivePreviewPoint(x, y, z);
				},
				hideLivePreviewPoint() {
					overlay.hideLivePreviewPoint();
				}
			};
		};
		return service;
	}
})(angular);
