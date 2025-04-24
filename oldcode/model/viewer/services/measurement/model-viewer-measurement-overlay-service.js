/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.viewer');
	const svcName = 'modelViewerMeasurementOverlayService';

	myModule.factory(svcName, modelViewerMeasurementOverlayService);

	modelViewerMeasurementOverlayService.$inject = ['modelViewerMeasurementDataService', 'd3'];

	function modelViewerMeasurementOverlayService(modelViewerMeasurementDataService, d3) {

		function generatePointSetId(measurement) {
			return `m${measurement.id}`;
		}

		function generatePointId(measurement, ptId) {
			return `m${measurement.id}_p${ptId}`;
		}

		const pointMarkerSize = 5;

		function generatePointGraphic(parent) {
			parent.append('line').classed('point-marker', true).attrs({
				x1: -pointMarkerSize,
				y1: -pointMarkerSize,
				x2: pointMarkerSize,
				y2: pointMarkerSize
			});
			parent.append('line').classed('point-marker', true).attrs({
				x1: -pointMarkerSize,
				y1: pointMarkerSize,
				x2: pointMarkerSize,
				y2: -pointMarkerSize
			});
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

				that._addAllPoints();

				that._previewPoints = {
					static: [],
					live: false
				};

				that._pointsUpdated = function () {
					that._redraw();
				};
				that._scApp.registerUpdate(that._pointsUpdated);

				that._measurementsUpdated = function (changes) {
					// TODO: distinguish measurement types

					that._scApp.suspendPointUpdates();
					if (changes.added.length > 0) {
						for (let item of changes.added) {
							that._addStraightDistance(item);
						}
					}
					that._scApp.resumePointUpdates();
				};
				modelViewerMeasurementDataService.registerMeasurementsChanged(that._measurementsUpdated);
			}

			_addAllPoints() {
				const that = this;

				const data = modelViewerMeasurementDataService.getAllMeasurements();

				for (let dist of data.straightDistances) {
					that._addStraightDistance(dist);
				}
			}

			_addStraightDistance(dist) {
				const that = this;

				const psId = generatePointSetId(dist);
				that._scApp.setPoint(generatePointId(dist, '1'), 'coord3d', dist.pt1, psId);
				that._scApp.setPoint(generatePointId(dist, '2'), 'coord3d', dist.pt2, psId);
			}

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

				const data = modelViewerMeasurementDataService.getAllMeasurements();

				let sDistances = that._scApp.getLayerParent(layerName).selectAll('g.straightDistance').data(data.straightDistances, d => d.id);

				const newSDistances = sDistances.enter().append('g').classed('straightDistance', true).classed('measurement', true);
				newSDistances.each(function (d) {
					const thisEl = d3.select(this);

					this.visualParts = {
						p1: thisEl.append('g').classed('p1', true),
						p2: thisEl.append('g').classed('p2', true),
						line: thisEl.append('line').classed('distance', true),
						text: thisEl.append('text').classed('length-display', true)
					};
					this.visualParts.text.text(d.displayLength);

					for (let p of [this.visualParts.p1, this.visualParts.p2]) {
						generatePointGraphic(p);
					}
				});

				sDistances.exit().remove();

				sDistances = newSDistances.merge(sDistances);

				sDistances.each(function (d) {
					const p1Coords = that._scApp.getProjectedPoint(generatePointId(d, '1'));
					const p2Coords = that._scApp.getProjectedPoint(generatePointId(d, '2'));

					const thisEl = d3.select(this);
					if (p1Coords && p2Coords) {
						thisEl.classed('hidden', false);

						this.visualParts.p1.attr('transform', `translate(${p1Coords.x},${p1Coords.y})`);
						this.visualParts.p2.attr('transform', `translate(${p2Coords.x},${p2Coords.y})`);
						this.visualParts.line.attrs({
							x1: p1Coords.x,
							y1: p1Coords.y,
							x2: p2Coords.x,
							y2: p2Coords.y
						});
						this.visualParts.text.attrs({
							x: (p1Coords.x + p2Coords.x) / 2,
							y: (p1Coords.y + p2Coords.y) / 2
						});
					} else {
						thisEl.classed('hidden', true);
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
				modelViewerMeasurementDataService.unregisterMeasurementsChanged(this._measurementsUpdated);
				this._scApp.unregisterUpdate(this._pointsUpdated);

				this._scMgr.removeApplication(appId);
			}
		}

		service.initialize = function (viewerAdapter, scMgr) {
			const overlay = new MeasurementOverlay(viewerAdapter, scMgr);

			return {
				finalize() {
					overlay.finalize();
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
