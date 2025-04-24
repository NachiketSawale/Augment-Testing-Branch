/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const modelAnnotationModule = angular.module('model.annotation');

	modelAnnotationModule.factory('modelAnnotationHoopsMarkerDisplayService',
		modelAnnotationHoopsMarkerDisplayService);

	modelAnnotationHoopsMarkerDisplayService.$inject = ['_', 'modelAnnotationMarkerDisplayService',
		'Communicator', 'modelViewerHoopsUtilitiesService', '$q', '$http', 'platformPromiseUtilitiesService',
		'basicsCommonDrawingUtilitiesService', 'modelViewerModelSelectionService', 'modelViewerHoopsRuntimeDataService', 'modelAnnotationTypes'];

	function modelAnnotationHoopsMarkerDisplayService(_, modelAnnotationMarkerDisplayService,
		Communicator, modelViewerHoopsUtilitiesService, $q, $http, platformPromiseUtilitiesService,
		basicsCommonDrawingUtilitiesService, modelViewerModelSelectionService, modelViewerHoopsRuntimeDataService, modelAnnotationTypes) {

		function createMarkerMesh(viewer, shapeDef) {
			const md = new Communicator.MeshData();
			md.setFaceWinding(Communicator.FaceWinding.CounterClockwise);

			try {
				md.setBackfacesEnabled(false);

				const shapeGeometry3d = JSON.parse(shapeDef);

				md.addFaces(shapeGeometry3d.faces);
				md.addPolyline(shapeGeometry3d.lines);
			} catch (ex) {
				md.setBackfacesEnabled(true);

				md.addFaces([0, 0, 0, -0.1, -0.1, 0, -0.1, 0.1, 0]);
			}

			return viewer.model.createMesh(md);
		}

		const highlightColor = new Communicator.Color(255, 255, 0);

		function createColorForMarker(marker) {
			/*if (modelAnnotationMarkerDisplayService.isMarkerHighlighted(marker)) {
				return highlightColor;
			}*/
			let effectiveColor = _.isInteger(marker.EffectiveColor) ? marker.EffectiveColor : 0xFF00FF;
			if (_.isInteger(marker.Color) && marker.Color !== effectiveColor){
				effectiveColor = marker.Color;
			}
			return modelViewerHoopsUtilitiesService.rgbColorToViewerColor(basicsCommonDrawingUtilitiesService.intToRgbColor(effectiveColor));
		}

		function createHighlightColorForMarker(marker) {
			if (modelAnnotationMarkerDisplayService.isMarkerHighlighted(marker)) {
				return highlightColor;
			}
			return createColorForMarker(marker);
		}

		class HoopsMarkerRenderer extends modelAnnotationMarkerDisplayService.MarkerRenderer {
			constructor(viewer) {
				super();

				this._viewer = viewer;
				this._geometryPromises = [];
				this._markerInfos = {};
				this._modelTransformations = {};

				this._promiseSequencer = new platformPromiseUtilitiesService.PromiseSequencer();

				this._promiseSequencer.addPromise(this._prepareGeometry());

				const that = this;
				that._updateAnnotationTypeVisibility = function (info) {
					const typeParentNodeId = that._markerParentNodeIdByType[info.changedTypeId];
					return that._promiseSequencer.addPromise(that._viewer.model.setNodesVisibility([typeParentNodeId], info.newValue));
				};
				if (that._viewer.rib$annotationTypeVisibility) {
					that._viewer.rib$annotationTypeVisibility.registerVisibilitiesChanged(that._updateAnnotationTypeVisibility);
				}
			}

			_createMatrixForMarker(marker) {
				let result = new Communicator.Matrix().setTranslationComponent(marker.PosX, marker.PosY, marker.PosZ);

				const transform = this._modelTransformations[marker.OwnerModelFk];
				if (transform) {
					result = Communicator.Matrix.multiply(transform, result);
				}

				return result;
			}

			modelUpdated() {
				const that = this;

				super.modelUpdated();

				that._modelTransformations = {};

				const selModel = modelViewerModelSelectionService.getSelectedModel();
				if (selModel) {
					modelViewerModelSelectionService.forEachSubModel(function (smId) {
						const sm = selModel.bySubModelId[smId];
						if (Array.isArray(sm.transform) && sm.transform.length === 16) {
							that._modelTransformations[sm.info.modelId] = Communicator.Matrix.createFromArray(sm.transform);
						}
					});
				}
			}

			subModelTransformChanged(globalModelId) {
				const that = this;

				super.subModelTransformChanged(globalModelId);

				const selModel = modelViewerModelSelectionService.getSelectedModel();
				if (selModel) {
					const changedModel = selModel.findModelByGlobalId(globalModelId);
					if (changedModel) {
						if (Array.isArray(changedModel.transform) && changedModel.transform.length === 16) {
							that._modelTransformations[changedModel] = Communicator.Matrix.createFromArray(changedModel.transform);
						} else {
							delete that._modelTransformations[globalModelId];
						}
					}
				}
			}

			_prepareGeometry() {
				const that = this;
				that._markerMeshIds = new Map();

				const rootNodeId = that._viewer.model.getAbsoluteRootNode();
				that._markerParentNodeId = that._viewer.model.createNode(rootNodeId, 'Model Annotation Markers');

				that._markerParentNodeIdByType = {};
				for (let typeInfo in modelAnnotationTypes.byId) {
					that._markerParentNodeIdByType[parseInt(typeInfo)] = that._viewer.model.createNode(that._markerParentNodeId, `Type ${typeInfo}`);
				}

				let markerShapeJsonList = modelViewerHoopsRuntimeDataService.getMarkerShapeList(that._viewer);
				_.each(markerShapeJsonList, function(shape){
					that._geometryPromises.push((function () {
						return createMarkerMesh(that._viewer, shape.ShapeDef).then(function (markerMeshId) {
							that._markerMeshIds[shape.Id] = markerMeshId;
						});
					})());
				});

				return $q.all(that._geometryPromises);
			}

			_removeAllMarkers() {
				const that = this;

				const markerNodeIds = _.map(Object.keys(this._markerInfos), mId => that._markerInfos[mId].nodeId);
				this._markerInfos = {};

				this._promiseSequencer.addPromise(() => this._viewer.model.deleteMeshInstances(markerNodeIds));
			}

			_doAddMarker(marker) {
				const that = this;

				that._promiseSequencer.addPromise(function createMarkerMesh() {
					const mId = modelAnnotationMarkerDisplayService.generateMarkerId(marker);
					const cl = createColorForMarker(marker);
					const ch = createHighlightColorForMarker(marker);

					let markerShapeId = marker.MarkerShapeFk;
					let markerMeshId = that._markerMeshIds[markerShapeId];
					const meshInstanceData = new Communicator.MeshInstanceData(markerMeshId,
						that._createMatrixForMarker(marker),
						mId,
						cl, ch, cl,
						Communicator.MeshInstanceCreationFlags.DoNotLight | Communicator.MeshInstanceCreationFlags.DoNotCut);

					const typeParentNodeId = that._markerParentNodeIdByType[marker.RawAnnotationBaseType];
					return that._viewer.model.createMeshInstance(meshInstanceData, typeParentNodeId).then(function (nodeId) {
						that._markerInfos[mId] = {
							baseTypeId: marker.RawAnnotationBaseType,
							nodeId: nodeId,
							shapeId: markerShapeId
						};
						//that._viewer.model.setInstanceModifier(Communicator.InstanceModifier.SuppressCameraScale, [nodeId], true);
						that._viewer.model.setInstanceModifier(Communicator.InstanceModifier.ExcludeBounding, [nodeId], true);
						that._viewer.model.setInstanceModifier(Communicator.InstanceModifier.IgnoreCutting, [nodeId], true);
						that._viewer.model.setInstanceModifier(Communicator.InstanceModifier.IgnoreExplosion, [nodeId], true);
						that._viewer.model.setInstanceModifier(Communicator.InstanceModifier.IgnoreSelection, [nodeId], true);
					});
				});
			}

			refreshAll(markers) {
				const that = this;

				that._removeAllMarkers();

				for (let marker of markers) {
					that._doAddMarker(marker);
				}
			}

			updateMarker(marker) {
				const that = this;

				const mId = modelAnnotationMarkerDisplayService.generateMarkerId(marker);
				const cl = createColorForMarker(marker);
				const ch = createHighlightColorForMarker(marker);
				const matrix = that._createMatrixForMarker(marker);

				const mInfo = that._markerInfos[mId];
				if (mInfo) {
					const mdl = that._viewer.model;
					if (marker.MarkerShapeFk !== mInfo.shapeId){
						mdl.deleteNode(mInfo.nodeId);

						let markerShapeId = marker.MarkerShapeFk;
						let markerMeshId = that._markerMeshIds[markerShapeId];
						const meshInstanceData = new Communicator.MeshInstanceData(markerMeshId,
							that._createMatrixForMarker(marker),
							mId,
							cl, ch, cl,
							Communicator.MeshInstanceCreationFlags.DoNotLight | Communicator.MeshInstanceCreationFlags.DoNotCut);

						const typeParentNodeId = that._markerParentNodeIdByType[marker.RawAnnotationBaseType];
						that._promiseSequencer.addPromise(function () {
							return mdl.createMeshInstance(meshInstanceData, typeParentNodeId, true).then(function (nodeId) {
								that._markerInfos[mId] = {
									baseTypeId: marker.RawAnnotationBaseType,
									nodeId: nodeId,
									shapeId: markerShapeId
								};
								//mdl.setInstanceModifier(Communicator.InstanceModifier.SuppressCameraScale, [nodeId], true);
								mdl.setInstanceModifier(Communicator.InstanceModifier.ExcludeBounding, [nodeId], true);
								mdl.setInstanceModifier(Communicator.InstanceModifier.IgnoreCutting, [nodeId], true);
								mdl.setInstanceModifier(Communicator.InstanceModifier.IgnoreExplosion, [nodeId], true);
								mdl.setInstanceModifier(Communicator.InstanceModifier.IgnoreSelection, [nodeId], true);
							});
						});
					} else {
						that._promiseSequencer.addPromise(function () {
							mdl.setNodesColors({
								[mInfo.nodeId]: cl
							}, true);
							mdl.setNodesLineColor([mInfo.nodeId], ch);

							return mdl.setNodeMatrix(mInfo.nodeId, matrix);
						});
					}
				}
			}

			addMarker(marker) {
				this._doAddMarker(marker);
			}

			removeMarker(marker) {
				const that = this;

				const mId = modelAnnotationMarkerDisplayService.generateMarkerId(marker);
				const mInfo = that._markerInfos[mId];
				if (mInfo) {
					that._promiseSequencer.addPromise(function () {
						delete that._markerInfos[mId];
						return that._viewer.model.deleteMeshInstances([mInfo.nodeId]);
					});
				}
			}

			dispose() {
				if (this._viewer.rib$annotationTypeVisibility) {
					this._viewer.rib$annotationTypeVisibility.unregisterVisibilitiesChanged(this._updateAnnotationTypeVisibility);
				}
				delete this._viewer[rendererPropertyName];
				super.dispose();
			}
		}

		const rendererPropertyName = 'rib$annoMarkerRenderer';

		const service = {};

		service.initializeForViewer = function (viewer) {
			const renderer = service.getMarkerRendererForViewer(viewer);
			modelAnnotationMarkerDisplayService.registerRenderer(renderer);
		};

		service.getMarkerRendererForViewer = function (viewer, suppressCreation) {
			let renderer = viewer[rendererPropertyName];
			if (!renderer && !suppressCreation) {
				renderer = new HoopsMarkerRenderer(viewer);
				viewer[rendererPropertyName] = renderer;
			}
			return renderer;
		};

		service.getMarkerShape = function (viewer, shapeId) {
			if (!angular.isNumber(shapeId)) {
				return modelViewerHoopsRuntimeDataService.getDefaultMarkerShape(viewer);
			}

			return modelViewerHoopsRuntimeDataService.getMarkerShapeById(viewer, shapeId);
		};

		return service;
	}
})(angular);
