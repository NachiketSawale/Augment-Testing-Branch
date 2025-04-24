/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSpatialGeometryManagerService
	 * @function
	 *
	 * @description Provides a manager class for custom 3D geometry.
	 */
	angular.module('model.viewer').factory('modelViewerSpatialGeometryManagerService', ['_', '$q', '$injector',
		'platformPromiseUtilitiesService',
		function (_, $q, $injector, platformPromiseUtilitiesService) {
			var service = {};

			function RegisteredViewer(type, viewer, name) {
				var ConnectorClass = $injector.get(_.camelCase('model-viewer-spatial-geometry-' + type + '-connector-service'));

				this.type = type;
				this.viewer = viewer;
				this.connector = new ConnectorClass(viewer, name);
				this.geometryDefLinks = {};
				this.objectLinks = {};
			}

			RegisteredViewer.prototype.initialize = function () {
				return $q.when(this.connector.initialize());
			};

			RegisteredViewer.prototype.finalize = function () {
				return $q.when(this.connector.finalize());
			};

			RegisteredViewer.prototype.defineGeometry = function (id, geometryDef) {
				var that = this;

				var typedDef = _.get(geometryDef, ['data', that.type]);
				if (typedDef) {
					return that.connector.defineGeometry(id, typedDef).then(function (geometryDefLink) {
						that.geometryDefLinks[id] = geometryDefLink;
						return true;
					});
				}

				return $q.when(false);
			};

			RegisteredViewer.prototype.addObject = function (id, geometryDefRef, options) {
				var that = this;

				var geometryDefLink = this.geometryDefLinks[geometryDefRef];
				if (!_.isNil(geometryDefLink)) {
					return that.connector.addObject(id, geometryDefLink, options).then(function (objectLink) {
						that.objectLinks[id] = objectLink;
						return true;
					});
				}
				return $q.when(false);
			};

			RegisteredViewer.prototype.removeObject = function (id) {
				var that = this;

				var objectLink = this.objectLinks[id];
				if (!_.isNil(objectLink)) {
					return that.connector.removeObject(objectLink).then(function () {
						delete that.objectLinks[id];
						return true;
					});
				}
				return $q.when(false);
			};

			RegisteredViewer.prototype.setTransform = function (id, matrix) {
				var that = this;

				var objectLink = this.objectLinks[id];
				if (!_.isNil(objectLink)) {
					return that.connector.setTransform(objectLink, matrix).then(function () {
						return true;
					});
				}
				return $q.when(false);
			};

			RegisteredViewer.prototype.setStrokeColor = function (id, color, isSelected) {
				var that = this;

				var objectLink = this.objectLinks[id];
				if (!_.isNil(objectLink)) {
					return that.connector.setStrokeColor(objectLink, color, isSelected).then(function () {
						return true;
					});
				}
				return $q.when(false);
			};

			RegisteredViewer.prototype.setFillColor = function (id, color, isSelected) {
				var that = this;

				var objectLink = this.objectLinks[id];
				if (!_.isNil(objectLink)) {
					return that.connector.setFillColor(objectLink, color, isSelected).then(function () {
						return true;
					});
				}
				return $q.when(false);
			};

			RegisteredViewer.prototype.setSelected = function (id, isSelected, strokeColor, fillColor) {
				var that = this;

				var objectLink = this.objectLinks[id];
				if (!_.isNil(objectLink)) {
					return that.connector.setSelected(objectLink, isSelected, strokeColor, fillColor).then(function () {
						return true;
					});
				}
				return $q.when(false);
			};

			RegisteredViewer.prototype.setVisible = function (id, isVisible) {
				var that = this;

				var objectLink = this.objectLinks[id];
				if (!_.isNil(objectLink)) {
					return that.connector.setVisible(objectLink, isVisible).then(function () {
						return true;
					});
				}
				return $q.when(false);
			};

			function SpatialGeometryManager(name) {
				this._internalData = {
					name: name,
					geometryDefs: {},
					objects: {},
					viewers: []
				};
			}

			service.SpatialGeometryManager = SpatialGeometryManager;

			SpatialGeometryManager.prototype.registerViewer = function (type, viewer) {
				var that = this;

				var regViewer = new RegisteredViewer(type, viewer, name);
				that._internalData.viewers.push(regViewer);

				return $q.when(regViewer.connector.initialize()).then(function initGeometryDefs() {
					var geometryCreationFuncs = _.map(Object.keys(that._internalData.geometryDefs), function (geometryDefId) {
						return function () {
							var geometryDef = that._internalData.geometryDefs[geometryDefId];
							return regViewer.defineGeometry(geometryDefId, geometryDef);
						};
					});

					if (geometryCreationFuncs.length > 0) {
						return platformPromiseUtilitiesService.allSequentially(geometryCreationFuncs);
					}
				}).then(function initObjects() {
					var objectCreationFuncs = _.map(Object.keys(that._internalData.objects), function (objectId) {
						return function () {
							var objectDef = that._internalData.objects[objectId];
							return regViewer.addObject(objectId, objectDef.geometryDefRef, objectDef.options);
						};
					});

					if (objectCreationFuncs.length > 0) {
						return platformPromiseUtilitiesService.allSequentially(objectCreationFuncs);
					}
				});
			};

			SpatialGeometryManager.prototype.unregisterViewer = function (type, viewer) {
				var idx = _.findIndex(this._internalData.viewers, function (item) {
					return (item.type === type) && (item.viewer === viewer);
				});
				if (idx >= 0) {
					var regViewer = this._internalData.viewers[idx];
					this._internalData.viewers.splice(idx, 1);
					return $q.when(regViewer.connector.finalize()).then(function () {
						return true;
					});
				}
				return $q.when(false);
			};

			SpatialGeometryManager.prototype.defineGeometry = function (defs) {
				var that = this;

				if (!_.isArray(defs)) {
					defs = [defs];
				}

				defs.forEach(function (geometryDef) {
					var id = geometryDef.id;
					if (_.isEmpty(id)) {
						throw new Error('Invalid geometry ID.');
					}

					that._internalData.geometryDefs[id] = geometryDef;

					that._internalData.viewers.forEach(function (regViewer) {
						regViewer.defineGeometry(id, geometryDef);
					});
				});
			};

			SpatialGeometryManager.prototype.addObject = function (id, geometryDefRef, options) {
				var that = this;

				var effectiveOptions = _.isObject(options) ? _.cloneDeep(options) : {};
				if (!_.isNil(effectiveOptions.color)) {
					effectiveOptions.strokeColor = effectiveOptions.color;
					effectiveOptions.fillColor = effectiveOptions.color;
					delete effectiveOptions.color;
				}

				if (_.isNil(effectiveOptions.isVisible)) {
					effectiveOptions.isVisible = true;
				} else {
					effectiveOptions.isVisible = Boolean(effectiveOptions.isVisible);
				}

				that._internalData.objects[id] = {
					geometryDefRef: geometryDefRef,
					options: effectiveOptions
				};

				that._internalData.viewers.forEach(function (regViewer) {
					regViewer.addObject(id, geometryDefRef, effectiveOptions);
				});
			};

			SpatialGeometryManager.prototype.removeObject = function (id) {
				var that = this;

				delete that._internalData.objects[id];

				that._internalData.viewers.forEach(function (regViewer) {
					regViewer.removeObject(id);
				});
			};

			SpatialGeometryManager.prototype.setTransform = function (id, matrix) {
				var that = this;

				var objInfo = that._internalData.objects[id];
				objInfo.options.transform = matrix;

				that._internalData.viewers.forEach(function (regViewer) {
					regViewer.setTransform(id, matrix);
				});
			};

			SpatialGeometryManager.prototype.setColor = function (id, color) {
				var that = this;

				var objInfo = that._internalData.objects[id];
				objInfo.options.strokeColor = color;
				objInfo.options.fillColor = color;

				that._internalData.viewers.forEach(function (regViewer) {
					regViewer.setStrokeColor(id, color);
					regViewer.setFillColor(id, color);
				});
			};

			SpatialGeometryManager.prototype.setStrokeColor = function (id, color) {
				var that = this;

				var objInfo = that._internalData.objects[id];
				objInfo.options.strokeColor = color;
				objInfo.options.fillColor = color;

				that._internalData.viewers.forEach(function (regViewer) {
					regViewer.setStrokeColor(id, color, Boolean(objInfo.options.isSelected));
				});
			};

			SpatialGeometryManager.prototype.setFillColor = function (id, color) {
				var that = this;

				var objInfo = that._internalData.objects[id];
				objInfo.options.strokeColor = color;
				objInfo.options.fillColor = color;

				that._internalData.viewers.forEach(function (regViewer) {
					regViewer.setFillColor(id, color, Boolean(objInfo.options.isSelected));
				});
			};

			SpatialGeometryManager.prototype.setSelected = function (id, isSelected) {
				var that = this;

				var objInfo = that._internalData.objects[id];
				objInfo.options.isSelected = Boolean(isSelected);

				that._internalData.viewers.forEach(function (regViewer) {
					regViewer.setSelected(id, isSelected, objInfo.options.strokeColor, objInfo.options.fillColor);
				});
			};

			SpatialGeometryManager.prototype.setVisible = function (id, isVisible) {
				var that = this;

				var objInfo = that._internalData.objects[id];
				objInfo.options.isVisible = Boolean(isVisible);

				that._internalData.viewers.forEach(function (regViewer) {
					regViewer.setVisible(id, isVisible);
				});
			};

			return service;
		}]);
})(angular);
