/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSpatialGeometryHoopsConnectorService
	 * @function
	 *
	 * @description Represents a HOOPS implementation for spatial geometry connectors.
	 */
	angular.module('model.viewer').factory('modelViewerSpatialGeometryHoopsConnectorService', ['_', '$q', 'Communicator',
		'modelViewerSpatialGeometryConnectorBaseService', 'platformPromiseUtilitiesService',
		'modelViewerHoopsUtilitiesService',
		function (_, $q, Communicator, modelViewerSpatialGeometryConnectorBaseService, platformPromiseUtilitiesService,
		          modelViewerHoopsUtilitiesService) {

			var SpatialGeometryConnector = modelViewerSpatialGeometryConnectorBaseService;

			var defaultColor = new Communicator.Color(0, 0, 0);

			function HoopsConnector(viewer, name) {
				SpatialGeometryConnector.call(this, viewer, name);

				this.promiseSequencer = new platformPromiseUtilitiesService.PromiseSequencer();
			}

			HoopsConnector.prototype = Object.create(SpatialGeometryConnector.prototype);
			HoopsConnector.prototype.constructor = HoopsConnector;

			HoopsConnector.prototype.initialize = function () {
				var mdl = this._viewer.model;
				this._containerId = mdl.createNode(mdl.getAbsoluteRootNode(), this._name + ' container');
				this._meshIds = [];
				this._meshInfo = {};
				this._unappliedObjectChanges = {};

				this._updateRequested = false;

				var that = this;

				this._updateFunc = function doUpdate() {
					var changedObjectLinks = Object.keys(that._unappliedObjectChanges);
					if (_.isEmpty(changedObjectLinks)) {
						return $q.when();
					}

					var lastPromise = $q.when();
					that._viewer.pauseRendering();

					var selColor = null;

					changedObjectLinks.forEach(function doUpdateObject(objectLink) {
						objectLink = parseInt(objectLink);

						var objectChanges = that._unappliedObjectChanges[objectLink];

						if (objectChanges.isSelected === true) {
							if (!selColor) {
								selColor = that._viewer.selectionManager.getNodeSelectionColor();
							}
						}

						if (!_.isNil(objectChanges.transform)) {
							let hoopsMatrix = Communicator.Matrix.createFromArray(_.flatten(objectChanges.transform));
							lastPromise = lastPromise.then(function updateTransform() {
								return mdl.setNodeMatrix(objectLink, hoopsMatrix);
							});
						}
						if (!_.isNil(objectChanges.strokeColor)) {
							let hoopsColor = objectChanges.isSelected === true ?
								selColor :
								modelViewerHoopsUtilitiesService.rgbColorToViewerColor(objectChanges.strokeColor, defaultColor);
							lastPromise = lastPromise.then(function updateStrokeColor() {
								return mdl.setNodesLineColor([objectLink], hoopsColor);
							});
						}
						if (!_.isNil(objectChanges.fillColor)) {
							let hoopsColor = objectChanges.isSelected === true ?
								selColor :
								modelViewerHoopsUtilitiesService.rgbColorToViewerColor(objectChanges.fillColor, defaultColor);
							lastPromise = lastPromise.then(function updateStrokeColor() {
								return mdl.setNodesFaceColor([objectLink], hoopsColor);
							});
						}
						if (!_.isNil(objectChanges.isVisible)) {
							lastPromise = lastPromise.then(function updateIsVisible() {
								return mdl.setNodesVisibility([objectLink], Boolean(objectChanges.isVisible));
							});
						}
					});

					that._unappliedObjectChanges = {};

					that._viewer.resumeRendering();

					return lastPromise;
				};
			};

			HoopsConnector.prototype.getUnappliedObjectChanges = function (objectLink) {
				var objectChanges = this._unappliedObjectChanges[objectLink];
				if (!objectChanges) {
					objectChanges = {};
					this._unappliedObjectChanges[objectLink] = objectChanges;
				}
				return objectChanges;
			};

			HoopsConnector.prototype.requestUpdate = function () {
				var that = this;

				if (!that._updateRequested) {
					that._updateRequested = true;
					return that.promiseSequencer.addPromise(function invokeUpdate() {
						that._updateRequested = false;
						return that._updateFunc();
					});
				}

				return $q.when();
			};

			HoopsConnector.prototype.finalize = function () {
				var that = this;

				if (_.isInteger(this._containerId)) {
					var mdl = that._viewer.model;
					return that.promiseSequencer.addPromise(function () {
						return mdl.deleteNode(that._containerId).then(function () {
							delete that._containerId;
							delete that._meshInfo;

							if (!_.isEmpty(that._meshIds)) {
								return mdl.deleteMeshes(_.uniq(that._meshIds));
							}
						});
					});
				}
			};

			HoopsConnector.prototype.defineGeometry = function (id, geometryDef) {
				var that = this;

				if (_.isFunction(geometryDef)) {
					geometryDef = {
						populateMeshData: geometryDef
					};
				}

				if (!_.isObject(geometryDef)) {
					throw new Error('The geometry definition for HOOPS viewers must be supplied as an object.');
				}
				if (!_.isFunction(geometryDef.populateMeshData)) {
					throw new Error('The geometry definition for HOOPS viewers must contain a populateMeshData function.');
				}

				var mdl = that._viewer.model;

				return that.promiseSequencer.addPromise(function () {
					var md = new Communicator.MeshData();
					geometryDef.populateMeshData(md);
					return mdl.createMesh(md).then(function (meshId) {
						that._meshIds.push(meshId);

						that._meshInfo[meshId] = {
							id: id,
							getMeshInstanceCreationFlags: _.isFunction(geometryDef.getMeshInstanceCreationFlags) ? geometryDef.getMeshInstanceCreationFlags : null
						};

						return meshId;
					});
				});
			};

			HoopsConnector.prototype.addObject = function (id, geometryDefLink, options) {
				var that = this;

				var mdl = that._viewer.model;

				return that.promiseSequencer.addPromise(function () {
					var meshInfo = that._meshInfo[geometryDefLink];
					if (!meshInfo) {
						throw new Error('Mesh ID ' + geometryDefLink + ' not found.');
					}

					var creationFlags = _.isFunction(meshInfo.getMeshInstanceCreationFlags) ? meshInfo.getMeshInstanceCreationFlags() : Communicator.MeshInstanceCreationFlags.None;

					var initialTransform = _.isNil(options.transform) ? null : Communicator.Matrix.createFromArray(options.transform);
					var initialStrokeColor = _.isNil(options.strokeColor) ? null : modelViewerHoopsUtilitiesService.rgbColorToViewerColor(options.strokeColor, defaultColor);
					var initialFillColor = _.isNil(options.fillColor) ? null : modelViewerHoopsUtilitiesService.rgbColorToViewerColor(options.fillColor, defaultColor);

					if (options.isSelected) {
						if (!_.isNil(initialStrokeColor)) {
							initialStrokeColor = that._viewer.selectionManager.getNodeSelectionColor();
						}
						if (!_.isNil(initialFillColor)) {
							initialFillColor = that._viewer.selectionManager.getNodeSelectionColor();
						}
					}

					var mid = new Communicator.MeshInstanceData(geometryDefLink, initialTransform, '' + id,
						initialFillColor, initialStrokeColor, initialStrokeColor,
						creationFlags);
					var resultPromise = mdl.createMeshInstance(mid, that._containerId, true);

					/*if (options.isSuppressCameraScale) {
						resultPromise = resultPromise.then(function (nodeId) {
							return mdl.setInstanceModifier(Communicator.InstanceModifier.SuppressCameraScale, [nodeId], true);
						});
					}*/

					if (!options.isVisible) {
						resultPromise = resultPromise.then(function (nodeId) {
							return mdl.setNodesVisibility([nodeId], false).then(() => nodeId);
						});
					}
					return resultPromise;
				});
			};

			HoopsConnector.prototype.removeObject = function (objectLink) {
				var that = this;

				delete that._unappliedObjectChanges[objectLink];

				var mdl = that._viewer.model;

				return that.promiseSequencer.addPromise(function () {
					return mdl.deleteNode(objectLink);
				});
			};

			HoopsConnector.prototype.setTransform = function (objectLink, transform) {
				var objectChanges = this.getUnappliedObjectChanges(objectLink);
				objectChanges.transform = transform;
				return this.requestUpdate();
			};

			HoopsConnector.prototype.setStrokeColor = function (objectLink, color, isSelected) {
				var objectChanges = this.getUnappliedObjectChanges(objectLink);
				objectChanges.strokeColor = color;
				objectChanges.isSelected = Boolean(isSelected);
				return this.requestUpdate();
			};

			HoopsConnector.prototype.setFillColor = function (objectLink, color, isSelected) {
				var objectChanges = this.getUnappliedObjectChanges(objectLink);
				objectChanges.fillColor = color;
				objectChanges.isSelected = Boolean(isSelected);
				return this.requestUpdate();
			};

			HoopsConnector.prototype.setSelected = function (objectLink, isSelected, strokeColor, fillColor) {
				var objectChanges = this.getUnappliedObjectChanges(objectLink);
				objectChanges.isSelected = Boolean(isSelected);
				objectChanges.strokeColor = strokeColor;
				objectChanges.fillColor = fillColor;
				return this.requestUpdate();
			};

			HoopsConnector.prototype.setVisible = function (objectLink, isVisible) {
				var objectChanges = this.getUnappliedObjectChanges(objectLink);
				objectChanges.isVisible = Boolean(isVisible);
				return this.requestUpdate();
			};

			return HoopsConnector;
		}]);
})(angular);
