/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsPointProjectionService
	 * @function
	 *
	 * @description Provides a utility class that helps project 3D points to the HOOPS WebViewer view port.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsPointProjectionService',
		modelViewerHoopsPointProjectionService);

	modelViewerHoopsPointProjectionService.$inject = ['_', 'Communicator',
		'PlatformMessenger'];

	function modelViewerHoopsPointProjectionService(_, Communicator,
		PlatformMessenger) {

		const service = {};

		const updatePoint = function (viewer) {
			const pt3d = this.isDynamic ? this.pos3d() : this.pos3d;
			const pt2d = viewer.view.projectPoint(pt3d, viewer.view.getCamera());
			this.latestPos3d = pt3d;
			this.pos2d = new Communicator.Point2(pt2d.x, pt2d.y);
		};

		function normalizeFilter(rawFilter) {
			const result = {};

			if (_.isFunction(rawFilter)) {
				result.filter = rawFilter;
			} else if (_.isObject(rawFilter)) {
				_.assign(result, rawFilter);
				if (!_.isFunction(result.filter)) {
					result.filter = () => true;
				}
			}

			result.apply = function (item) {
				return Boolean(this.filter(item));
			};

			return result;
		}

		class PointProjectionHelper {
			constructor(viewer) {
				this._viewer = viewer;
				this._points = {};
				this._onInvalidated = new PlatformMessenger();
				this._pointUpdatesSuspendedLevel = 0;

				const that = this;
				this._cameraChangedCallback = _.debounce(function () {
					if (!that._isDisposed) {
						that.invalidatePoints();
					}
				}, {
					wait: 300,
					maxWait: 500
				});

				this._callbackMap = {
					modelStructureReady: this._cameraChangedCallback,
					camera: this._cameraChangedCallback
				};
				viewer.setCallbacks(this._callbackMap);

				this._cameraChangedCallback();
			}

			suspendPointUpdates() {
				this._pointUpdatesSuspendedLevel++;
			}

			resumePointUpdates() {
				this._pointUpdatesSuspendedLevel--;
				if (this._pointUpdatesSuspendedLevel === 0) {
					this._onInvalidated.fire();
				}
			}

			setPoint(id, positionOrX, y, z) {
				let pt;
				if (_.isNumber(positionOrX) && _.isNumber(y) && _.isNumber(z)) {
					pt = new Communicator.Point3(positionOrX, y, z);
				} else if (_.isArray(positionOrX)) {
					pt = new Communicator.Point3(positionOrX[0], positionOrX[1], positionOrX[2]);
				} else if (_.isFunction(positionOrX)) {
					pt = positionOrX;
				} else if (_.isObject(positionOrX)) {
					pt = new Communicator.Point3(positionOrX.x, positionOrX.y, positionOrX.z);
				} else {
					throw new Error('Unsupported coordinate format.');
				}

				this._points[id] = {
					pos3d: pt,
					isDynamic: _.isFunction(pt),
					pos2d: null,
					updatePoint: updatePoint,
					info: null
				};
			}

			projectPoint(id) {
				const pt = this._points[id];
				if (!pt) {
					throw new Error('Unknown point ID: ' + id);
				}

				return pt.pos2d;
			}

			setPointInfo(id, info) {
				const pt = this._points[id];
				if (!pt) {
					throw new Error('Unknown point ID: ' + id);
				}

				pt.info = info;
			}

			removePoint(id) {
				delete this._points[id];
			}

			removePointsByFilter(filter) {
				const actualFilter = normalizeFilter(filter);

				const that = this;

				const idsToRemove = _.filter(Object.keys, that._points, function (id) {
					const ptInfo = that._points[id];
					return actualFilter.apply({
						info: _.cloneDeep(ptInfo.info)
					});
				});
				idsToRemove.forEach(function (id) {
					that.removePoint(id);
				});
			}

			invalidatePoints(ids, suppressNotification) {
				const that = this;

				function invalidateById(id) {
					const ptInfo = that._points[id];
					if (!ptInfo) {
						throw new Error('Unknown projectable point ID ' + id + '.');
					}

					ptInfo.updatePoint(that._viewer);
				}

				if (_.isArray(ids)) {
					ids.forEach(invalidateById);
				} else if (_.isInteger(ids) || _.isString(ids)) {
					invalidateById(ids);
				} else if (_.isObject(ids)) {
					Object.keys(ids).forEach(function (id) {
						if (ids[id]) {
							invalidateById(id);
						}
					});
				} else {
					Object.keys(that._points).forEach(invalidateById);
				}

				if (!suppressNotification && (that._pointUpdatesSuspendedLevel <= 0)) {
					this._onInvalidated.fire(ids);
				}
			}

			findPointsAt(position, filter) {
				const that = this;

				const actualFilter = normalizeFilter(filter);
				if (!_.isNumber(actualFilter.radius)) {
					actualFilter.radius = 0.000001;
				}

				const ids = Object.keys(that._points);
				if (!_.isInteger(actualFilter.maxCount)) {
					actualFilter.maxCount = ids.length;
				}

				if (_.isArray(position)) {
					position = new Communicator.Point2(position[0], position[1]);
				}

				const results = [];
				ids.forEach(function (id) {
					const ptInfo = that._points[id];
					if (actualFilter.apply({
						info: _.cloneDeep(ptInfo.info)
					}) && !_.isNil(ptInfo.pos2d)) {
						const dist = Communicator.Point2.distance(position, ptInfo.pos2d);
						if (dist <= actualFilter.radius) {
							results.push({
								ptId: id,
								pos2d: ptInfo.pos2d.copy(),
								pos3d: ptInfo.latestPos3d.copy(),
								distance: dist
							});
						}
					}
				});

				results.sort(function compareDistance(first, second) {
					if (first.distance < second.distance) {
						return -1;
					} else if (first.distance > second.distance) {
						return 1;
					} else {
						return 0;
					}
				});

				if (results.length > actualFilter.maxCount) {
					results.splice(actualFilter.maxCount, results.length - actualFilter.maxCount);
				}

				return results;
			}

			registerInvalidated(handler) {
				this._onInvalidated.register(handler);
			}

			unregisterInvalidated(handler) {
				this._onInvalidated.unregister(handler);
			}

			dispose() {
				this._viewer.unsetCallbacks(this._callbackMap);

				this._isDisposed = true;
				this._points = null;
			}
		}

		service.PointProjectionHelper = PointProjectionHelper;

		return service;
	}
})(angular);
