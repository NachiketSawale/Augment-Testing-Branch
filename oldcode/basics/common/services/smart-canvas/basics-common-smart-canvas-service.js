/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const basicsCommonModule = angular.module('basics.common');

	basicsCommonModule.factory('basicsCommonSmartCanvasService',
		basicsCommonSmartCanvasService);

	basicsCommonSmartCanvasService.$inject = ['PlatformMessenger', '_',
		'd3'];

	function basicsCommonSmartCanvasService(PlatformMessenger, _,
		d3) {

		const service = {};

		class ProjectedPoint {
			constructor(x, y) {
				this.x = x;
				this.y = y;
			}

			static average(...points) {
				if (_.isEmpty(points)) {
					throw new Error('No points supplied.');
				}

				return new ProjectedPoint(_.sumBy(points, p => p.x) / points.length,
					_.sumBy(points, p => p.y) / points.length);
			}
		}

		service.ProjectedPoint = ProjectedPoint;

		class SmartCanvasPointProvider {
			constructor(id) {
				this._id = id;
				this._pointsUpdated = new PlatformMessenger();
			}

			get id() {
				return this._id;
			}

			registerPointsUpdated(handler) {
				this._pointsUpdated.register(handler);
			}

			unregisterPointsUpdated(handler) {
				this._pointsUpdated.unregister(handler);
			}

			firePointsUpdated(pointIds) {
				if (_.isString(pointIds)) {
					this._pointsUpdated.fire([pointIds]);
				} else if (_.isArray(pointIds)) {
					this._pointsUpdated.fire(pointIds);
				} else {
					this._pointsUpdated.fire(null);
				}
			}

			setPoint(/* id, spec */) {
				throw new Error('Not implemented.');
			}

			removePoint(/* id */) {
				throw new Error('Not implemented.');
			}

			projectPoint(/* id */) {
				throw new Error('Not implemented.');
			}

			suspendPointUpdates() {
			}

			resumePointUpdates() {
			}
		}

		service.SmartCanvasPointProvider = SmartCanvasPointProvider;

		class SmartCanvasApplication {
			constructor(owner, name) {
				this._owner = owner;
				this.name = name;
				this._layers = {};
				this._points = {};
				this._onUpdate = new PlatformMessenger();
			}

			// layers ----------------

			addLayer(id, zIndex) {
				if (this._layers[id]) {
					throw new Error('A layer with ID ' + id + ' has already been created.');
				}

				this._layers[id] = {
					id: id,
					globalId: this.name + ':' + id,
					zIndex: _.isInteger(zIndex) ? zIndex : 0
				};

				this._owner._updateLayers();
			}

			removeLayer(id) {
				delete this._layers[id];

				this._owner._updateLayers();
			}

			getLayers() {
				return _.map(Object.keys(this._layers), lId => this._layers[lId]);
			}

			getLayerParent(id) {
				const layer = this._layers[id];
				if (!layer) {
					throw new Error(`Unknown layer ID: ${id}`);
				}

				return layer.parentEl;
			}

			getDefsForLayer(id) {
				const layer = this._layers[id];
				if (!layer) {
					throw new Error(`Unknown layer ID: ${id}`);
				}

				let result = layer.parentEl.select('defs');
				if (result.empty()) {
					result = layer.parentEl.append('defs');
				}
				return result;
			}

			// points ----------------

			_getGlobalPointId(id) {
				return this.name + ':' + id;
			}

			setPoint(id, type, spec, pointSetId) {
				let pt = this._points[id];
				if (pt) {
					if (pt.type !== type) {
						this._owner.removePoint(pt.globalId, pt.type);
					}
					pt.projectedPoint = null;
				} else {
					pt = {
						id: id,
						globalId: this._getGlobalPointId(id)
					};
					this._points[id] = pt;
				}

				pt.type = type;
				pt.pointSetId = pointSetId;
				this._owner.setPoint(pt.globalId, type, spec);
			}

			removePoint(id) {
				const pt = this._points[id];
				if (!pt) {
					throw new Error(`Unknown point ID: ${id}`);
				}

				this._owner.removePoint(pt.globalId, pt.type);
				delete this._points[id];
			}

			_getPointIdsInSet(pointSetId) {
				const that = this;
				return _.filter(Object.keys(that._points), ptId => that._points[ptId].pointSetId === pointSetId);
			}

			replacePointSet(pointSetId, points) {
				const that = this;

				const newPointIds = {};
				that.suspendPointUpdates();

				for (let pt of points) {
					that.setPoint(pt.id, pt.type, pt.spec, pointSetId);
					newPointIds[pt.id] = true;
				}

				const ids = that._getPointIdsInSet(pointSetId);
				for (let ptId of ids) {
					if (!newPointIds[ptId]) {
						that.removePoint(ptId);
					}
				}

				that.resumePointUpdates();
			}

			removePointSet(pointSetId) {
				const that = this;

				const ids = that._getPointIdsInSet(pointSetId);
				if (ids.length > 0) {
					that.suspendPointUpdates();
					for (let ptId of ids) {
						that.removePoint(ptId);
					}
					that.resumePointUpdates();
				}
			}

			getProjectedPoint(id) {
				const pt = this._points[id];
				if (!pt) {
					throw new Error(`Unknown point ID: ${id}`);
				}

				if (_.isNil(pt.projectedPoint)) {
					pt.projectedPoint = this._owner.projectPoint(pt.globalId, pt.type);
				}

				return _.clone(pt.projectedPoint);
			}

			getAllPointIds() {
				return Object.keys(this._points);
			}

			isPointRegistered(id) {
				return Boolean(this._points[id]);
			}

			suspendPointUpdates() {
				this._owner.suspendPointUpdates();
			}

			resumePointUpdates() {
				this._owner.resumePointUpdates();
			}

			// update ----------------

			registerUpdate(handler) {
				this._onUpdate.register(handler);
			}

			unregisterUpdate(handler) {
				this._onUpdate.unregister(handler);
			}

			_prepareUpdateInfo(info, additionalInfo) {
				const that = this;

				const effectiveInfo = _.assign({
					pointsChanged: false,
					redrawRequested: false,
					globalRedrawRequest: false,
					viewportResized: false,
					data: null
				}, _.isObject(info) ? info : {}, _.isObject(additionalInfo) ? additionalInfo : {});

				effectiveInfo.layers = {};
				Object.keys(that._layers).forEach(function (lId) {
					effectiveInfo.layers[lId] = that._layers[lId].parentEl;
				});

				effectiveInfo.getProjectedPoint = pointId => that.getProjectedPoint(pointId);

				effectiveInfo.getViewportSize = () => that._owner.getViewportSize();

				return effectiveInfo;
			}

			requestRedraw(contextInfo) {
				this._onUpdate.fire(this._prepareUpdateInfo({
					redrawRequested: true
				}, contextInfo));
			}

			_requestGlobalRedraw(contextInfo) {
				this._onUpdate.fire(this._prepareUpdateInfo({
					globalRedrawRequested: true
				}, contextInfo));
			}

			_updateSize() {
				this._onUpdate.fire(this._prepareUpdateInfo({
					viewportResized: true
				}));
			}

			_notifyPointsUpdated(pointIds) {
				const that = this;

				const prefixLength = that.name.length + 1;
				const localPointIds = _.isArray(pointIds) ? _.map(pointIds, id => id.substring(prefixLength)) : null;

				const pointsMap = {};
				if (!_.isNil(localPointIds)) {
					localPointIds.forEach(function (id) {
						pointsMap[id] = true;
					});
				}

				(localPointIds || Object.keys(that._points)).forEach(function (ptId) {
					that._points[ptId].projectedPoint = null;
				});

				that._onUpdate.fire(this._prepareUpdateInfo({
					pointsChanged: true,
					data: {
						allPoints: _.isNil(localPointIds),
						pointIds: localPointIds,
						isPointIdChanged: _.isNil(localPointIds) ? () => true : id => Boolean(pointsMap[id])
					}
				}));
			}
		}

		class SmartCanvasManager {
			constructor(parent) {
				this._applications = {};
				this._pointProviders = {};

				this._parent = d3.select(parent);

				this._pointUpdatesSuspendedLevel = 0;
			}

			// point providers ----------------

			addPointProvider(pp) {
				const that = this;

				if (!_.isObject(pp)) {
					throw new Error('Invalid point provider object.');
				}

				that._pointProviders[pp.id] = pp;

				pp.registerPointsUpdated(function pointsUpdated(pointIds) {
					const allPointIds = _.isArray(pointIds) ? pointIds : (_.isString(pointIds) ? [pointIds] : null);
					Object.keys(that._applications).forEach(function (appId) {
						const appPointIds = _.isArray(allPointIds) ? _.filter(allPointIds, id => id.startsWith(`${appId}:`)) : null;
						if (_.isNil(appPointIds) || !_.isEmpty(appPointIds)) {
							that._applications[appId]._notifyPointsUpdated(appPointIds);
						}
					});
				});
			}

			// applications ----------------

			addApplication(id) {
				if (this._applications[id]) {
					throw new Error('A smart canvas application with ID ' + id + ' has already been added.');
				}

				const app = new SmartCanvasApplication(this, id);
				this._applications[id] = app;
				return app;
			}

			// TODO: remove? Should other code be able to access existing applications?
			getApplication(id, autoCreate = false) {
				let result = this._applications[id];
				if (!result && autoCreate) {
					result = this.addApplication(id);
				}
				return result;
			}

			removeApplication(id) {
				if (this._applications[id]) {
					delete this._applications[id];
					return true;
				}
				return false;
			}

			// points ----------------

			setPoint(id, type, spec) {
				const pp = this._pointProviders[type];
				if (!pp) {
					throw new Error(`Unknown point type: ${type}`);
				}

				pp.setPoint(id, spec);
			}

			removePoint(id, type) {
				const pp = this._pointProviders[type];
				if (!pp) {
					throw new Error(`Unknown point type: ${type}`);
				}

				pp.removePoint(id);
			}

			projectPoint(id, type) {
				const pp = this._pointProviders[type];
				if (!pp) {
					throw new Error(`Unknown point type: ${type}`);
				}

				return pp.projectPoint(id);
			}

			suspendPointUpdates() {
				this._pointUpdatesSuspendedLevel++;
				if (this._pointUpdatesSuspendedLevel === 1) {
					for (let ppType of Object.keys(this._pointProviders)) {
						this._pointProviders[ppType].suspendPointUpdates();
					}
				}
			}

			resumePointUpdates() {
				this._pointUpdatesSuspendedLevel--;
				if (this._pointUpdatesSuspendedLevel === 0) {
					for (let ppType of Object.keys(this._pointProviders)) {
						this._pointProviders[ppType].resumePointUpdates();
					}
				}
			}

			// graphics ----------------

			getViewportSize() {
				const bBox = this._parent.node().getBoundingClientRect();
				return {
					width: bBox.width,
					height: bBox.height
				};
			}

			_updateLayers() {
				const allLayers = _.flatten(_.map(Object.keys(this._applications), appId => this._applications[appId].getLayers()));

				let layerEls = this._parent.selectAll('g.layer').data(allLayers, d => d.globalId);

				let newLayerEls = layerEls.enter();
				newLayerEls = newLayerEls.append('g').classed('layer', true);

				layerEls.exit().remove();

				layerEls = newLayerEls.merge(layerEls);

				layerEls.sort((a, b) => d3.ascending(a.zIndex, b.zIndex)).each(function (d, i) {
					d.parentEl = d3.select(this);
					d.layerIndex = i;
				});
			}

			// update ----------------

			updateSize() {
				const that = this;
				Object.keys(that._applications).forEach(function (appId) {
					const app = that._applications[appId];
					app._updateSize();
				});
			}

			requestRedraw(contextInfo) {
				const that = this;
				Object.keys(that._applications).forEach(function (appId) {
					const app = that._applications[appId];
					app._requestGlobalRedraw(contextInfo);
				});
			}
		}

		service.SmartCanvasManager = SmartCanvasManager;

		return service;
	}
})(angular);
