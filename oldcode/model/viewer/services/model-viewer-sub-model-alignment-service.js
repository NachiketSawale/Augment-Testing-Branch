/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSubModelAlignmentService
	 * @function
	 *
	 * @description Provides the logic for handling the alignment of sub-models in a composite model.
	 */
	angular.module('model.viewer').factory('modelViewerSubModelAlignmentService',
		modelViewerSubModelAlignmentService);

	modelViewerSubModelAlignmentService.$inject = ['_', '$q', 'Communicator',
		'modelProjectModelPartDataService', 'modelViewerViewerRegistryService', 'modelViewerHoopsLinkService',
		'modelViewerSpatialGeometryManagerService', 'basicsCommonDrawingUtilitiesService',
		'modelViewerModelSelectionService', 'modelViewerSubModelTransformationHelperService',
		'PlatformMessenger'];

	function modelViewerSubModelAlignmentService(_, $q, Communicator,
		modelProjectModelPartDataService, modelViewerViewerRegistryService, modelViewerHoopsLinkService,
		modelViewerSpatialGeometryManagerService, basicsCommonDrawingUtilitiesService,
		modelViewerModelSelectionService, modelViewerSubModelTransformationHelperService,
		PlatformMessenger) {

		const service = {};

		const RgbColor = basicsCommonDrawingUtilitiesService.RgbColor;

		let state;

		const modes = {
			xyTranslation: 'xy',
			zTranslation: 'z',
			xyzTranslation: 'xyz',
			xRotation: 'xRot',
			yRotation: 'yRot',
			zRotation: 'zRot'
		};
		service.modes = modes;

		function normalizePointStructure(pt) {
			if (_.isArray(pt)) {
				return {
					x: pt[0],
					y: pt[1],
					z: pt[2]
				};
			} else if (_.isObject(pt)) {
				return {
					x: pt.x,
					y: pt.y,
					z: pt.z
				};
			} else {
				return null;
			}
		}

		function ModeInfo(modeId, refPointDefs, refPtPlanePoint, refPtPlaneNormal, applyFn, previewFn) {
			this.id = modeId;
			this.refPointDefs = _.map(refPointDefs, function enrichRefPointDef(rpd, idx) {
				if (_.isString(rpd)) {
					rpd = {
						id: rpd
					};
				}
				if (!_.isObject(rpd.color)) {
					rpd.color = new RgbColor(40, 40, 40);
				}
				if (!_.isString(rpd.icon)) {
					rpd.icon = 'control-icons ico-n' + (idx + 1);
				}
				if (!_.isString(rpd.title)) {
					rpd.title = rpd.id;
				}
				return rpd;
			});

			this.refPtPlane = {
				point: normalizePointStructure(refPtPlanePoint),
				normal: normalizePointStructure(refPtPlaneNormal)
			};

			this._applyFn = applyFn;
			this._previewFn = previewFn;
		}

		ModeInfo.prototype.applyTransformation = function () {
			const info = {
				refPoints: {}
			};

			const that = this;
			that.refPointDefs.forEach(function (rpd) {
				const pt = state.getRefPoint(rpd.id);
				info.refPoints[rpd.id] = _.clone(pt.position);

				service.updateRefPoint(rpd.id, [0, 0, 0]);
			});

			return this._applyFn(info);
		};

		ModeInfo.prototype.previewMesh = function () {
			const info = {
				refPoints: {}
			};

			const that = this;
			that.refPointDefs.forEach(function (rpd) {
				const pt = state.getRefPoint(rpd.id);
				info.refPoints[rpd.id] = _.clone(pt.position);
			});

			return this._previewFn(info);
		};

		const defaultRefPointDefs = {
			source: {
				id: 'source',
				color: new RgbColor(232, 0, 0),
				icon: 'tlb-icons ico-view-source-point',
				title: 'model.viewer.operator.subModelAlignment.refPoints.source',
				geometryDef: 'refPointSrc'
			},
			target: {
				id: 'target',
				color: new RgbColor(0, 198, 0),
				icon: 'tlb-icons ico-view-destination-point',
				title: 'model.viewer.operator.subModelAlignment.refPoints.destination',
				geometryDef: 'refPointTrg'
			},
			rotAxis: {
				id: 'rotAxis',
				color: new RgbColor(0, 103, 177),
				icon: 'tlb-icons ico-view-rotation-axis',
				title: 'model.viewer.operator.subModelAlignment.refPoints.rotAxis',
				geometryDef: 'refPointRotAxis'
			}
		};

		function applyRotation(info) {
			const src = new Communicator.Point3(info.refPoints.source.x, info.refPoints.source.y, info.refPoints.source.z);
			const trg = new Communicator.Point3(info.refPoints.target.x, info.refPoints.target.y, info.refPoints.target.z);
			const rotAxis = new Communicator.Point3(info.refPoints.rotAxis.x, info.refPoints.rotAxis.y, info.refPoints.rotAxis.z);

			const originVector = Communicator.Point3.subtract(src, rotAxis);
			const targetVector = Communicator.Point3.subtract(trg, rotAxis);

			return modelViewerSubModelTransformationHelperService.applyRotationByVectors(state.getSubModelDataForTransformation(), rotAxis, originVector, targetVector);
		}

		function applyPreviewMeshRotation(info) {
			const src = new Communicator.Point3(info.refPoints.source.x, info.refPoints.source.y, info.refPoints.source.z);
			const trg = new Communicator.Point3(info.refPoints.target.x, info.refPoints.target.y, info.refPoints.target.z);
			const rotAxis = new Communicator.Point3(info.refPoints.rotAxis.x, info.refPoints.rotAxis.y, info.refPoints.rotAxis.z);

			const originVector = Communicator.Point3.subtract(src, rotAxis);
			const targetVector = Communicator.Point3.subtract(trg, rotAxis);

			return modelViewerSubModelTransformationHelperService.applyPreviewMeshRotation(state.getSubModelDataForTransformation(), rotAxis, originVector, targetVector);
		}

		function applyTranslation(info) {
			const src = info.refPoints.source;
			const dest = info.refPoints.target;
			const translation = computeTranslationByMode(state.activeMode, src, dest);

			return modelViewerSubModelTransformationHelperService.applyTranslation(state.getSubModelDataForTransformation(), translation);
		}

		function applyPreviewMeshTranslation(info) {
			const src = info.refPoints.source;
			const dest = info.refPoints.target;
			const translation = computeTranslationByMode(state.activeMode, src, dest);

			return modelViewerSubModelTransformationHelperService.applyPreviewMeshTranslation(state.getSubModelDataForTransformation(), translation);
		}

		function computeTranslationByMode(mode, src, dest){
			if (mode === 'xy'){
				return {
					x: dest.x - src.x,
					y: dest.y - src.y,
					z: 0
				};
			} else if (mode === 'z'){
				return {
					x: 0,
					y: 0,
					z: dest.z - src.z
				};
			} else if (mode === 'xyz'){
				return {
					x: dest.x - src.x,
					y: dest.y - src.y,
					z: dest.z - src.z,
				};
			}
		}

		const modeInfo = {};
		modeInfo[modes.xyTranslation] = new ModeInfo(modes.xyTranslation, [
			defaultRefPointDefs.source, defaultRefPointDefs.target
		], [0, 0, 0], [0, 0, -1], function (info) {
			const src = info.refPoints.source;
			const dest = info.refPoints.target;
			const translation = {
				x: dest.x - src.x,
				y: dest.y - src.y,
				z: 0
			};
			return modelViewerSubModelTransformationHelperService.applyTranslation(state.getSubModelDataForTransformation(), translation);
		}, applyPreviewMeshTranslation);
		modeInfo[modes.zTranslation] = new ModeInfo(modes.zTranslation, [
			defaultRefPointDefs.source, defaultRefPointDefs.target
		], [0, 0, 0], [-1, 0, 0], function (info) {
			const src = info.refPoints.source;
			const dest = info.refPoints.target;
			const translation = {
				x: 0,
				y: 0,
				z: dest.z - src.z
			};
			return modelViewerSubModelTransformationHelperService.applyTranslation(state.getSubModelDataForTransformation(), translation);
		}, applyPreviewMeshTranslation);
		modeInfo[modes.xyzTranslation] = new ModeInfo(modes.xyzTranslation, [
			defaultRefPointDefs.source, defaultRefPointDefs.target
		], [0, 0, 0], [0, 0, 0], function (info) {
			const src = info.refPoints.source;
			const dest = info.refPoints.target;
			const translation = {
				x: dest.x - src.x,
				y: dest.y - src.y,
				z: dest.z - src.z
			};
			return modelViewerSubModelTransformationHelperService.applyTranslation(state.getSubModelDataForTransformation(), translation);
		}, applyPreviewMeshTranslation);
		modeInfo[modes.xRotation] = new ModeInfo(modes.xRotation, [
			defaultRefPointDefs.rotAxis, defaultRefPointDefs.source, defaultRefPointDefs.target
		], [0, 0, 0], [-1, 0, 0], applyRotation, applyPreviewMeshRotation);
		modeInfo[modes.yRotation] = new ModeInfo(modes.yRotation, [
			defaultRefPointDefs.rotAxis, defaultRefPointDefs.source, defaultRefPointDefs.target
		], [0, 0, 0], [0, -1, 0], applyRotation, applyPreviewMeshRotation);
		modeInfo[modes.zRotation] = new ModeInfo(modes.zRotation, [
			defaultRefPointDefs.rotAxis, defaultRefPointDefs.source, defaultRefPointDefs.target
		], [0, 0, 0], [0, 0, -1], applyRotation, applyPreviewMeshRotation);

		function SubModelAlignmentModeState(modeId) {
			const that = this;

			that._modeId = modeId;
			that._refPoints = {};

			const thisModeInfo = modeInfo[modeId];
			if (!thisModeInfo) {
				throw new Error('Failed to retrieve sub-model alignment mode info: ' + modeId);
			}

			Object.keys(thisModeInfo.refPointDefs).forEach(function (idx) {
				const rpd = thisModeInfo.refPointDefs[idx];
				that._refPoints[rpd.id] = {
					position: normalizePointStructure([0, 0, 0])
				};
			});
		}

		SubModelAlignmentModeState.prototype.applyPoints = function (pph) {
			const that = this;

			Object.keys(that._refPoints).forEach(function (key) {
				that.applyPoint(pph, key);
			});
		};

		SubModelAlignmentModeState.prototype.applyPoint = function (pph, id) {
			const that = this;

			const pt = that._refPoints[id];
			pph.setPoint(id, pt.position);
		};

		state = {
			wrapper: null,
			geometryMgr: new modelViewerSpatialGeometryManagerService.SpatialGeometryManager('sub-model alignment'),
			activeMode: modes.xyTranslation,
			modeStates: {},
			pointProjectionHelpers: [],
			stateListeners: [],
			selectedModelPart: null,
			selectedModelPartNode: null,
			selectedModelPartCornerPos: Communicator.Point3.zero(),
			viewers: {},
			selectedRefPointId: null,
			onSubModelTransformationChanged: new PlatformMessenger(),
			getSelectedSubModelId: function () {
				if (this.selectedModelPart) {
					const selModel = modelViewerModelSelectionService.getSelectedModel();
					if (selModel) {
						return selModel.globalModelIdToSubModelId(this.selectedModelPart.ModelPartFk);
					}
				}
				return null;
			},
			getRefPoint: function (refPointId) {
				const subModelId = this.getSelectedSubModelId();
				if (!_.isInteger(subModelId)) {
					return;
				}

				const modeState = this.modeStates[state.activeMode];
				if (!modeState) {
					return;
				}

				const subModelModeState = modeState[subModelId];
				if (!subModelModeState) {
					return;
				}

				return subModelModeState._refPoints[refPointId];
			},
			getSubModelDataForTransformation: function () {
				return {
					modelPartEntity: state.selectedModelPart,
					hoopsViewers: state.viewers.hoops,
					modelPartId: state.getSelectedSubModelId(),
					modelPartNode: state.selectedModelPartNode,
				};
			},
			getSubModelNode: function () {
				return state.selectedModelPartNode;
			}
		};

		function updateSelectedModelParts() {
			if (!modelViewerModelSelectionService.getSelectedModel()) {
				return;
			}

			cleanUpCurrentMode();

			let selModel;
			const selParts = modelProjectModelPartDataService.getSelectedEntities();
			if (selParts.length >= 1) {
				if (!(function isModelPartActive (modelPart) {
					selModel = modelViewerModelSelectionService.getSelectedModel();
					return Boolean(selModel) && Boolean(selModel.findModelByGlobalId(modelPart.ModelPartFk));
				})(selParts[0])) {
					return;
				}

				state.selectedModelPart = selParts[0];
				if (_.isArray(state.viewers.hoops)) {
					loadSelectedModelPartNode(selModel, state.selectedModelPart);
				}

				initializeCurrentMode();
			} else {
				state.selectedModelPart = null;
			}
		}

		modelProjectModelPartDataService.registerSelectedEntitiesChanged(updateSelectedModelParts);

		function loadSelectedModelPartNode(selectedModel, selectedModelPart){
			let smInfo = _.find(selectedModel.subModels, sm => sm.info.modelId === selectedModelPart.ModelPartFk);
			let subModelId = smInfo.subModelId;

			if (_.isArray(state.viewers.hoops)) {
				removePreviewMesh();
				let mapProp = modelViewerHoopsLinkService.getSubModelsMapProperty();

				state.viewers.hoops.forEach(function (v) {
					v.selectionManager.clear();
					v.model.resetModelOpacity();
					let map = v[mapProp];
					if (map) {
						let unselectedNodes = [];
						for (let k in map.subModelToRootNode){
							if (map.subModelToRootNode.hasOwnProperty(k)) {
								if (parseInt(k) === subModelId){
									let rootNodeId = map.subModelToRootNode[k];
									state.selectedModelPartNode = rootNodeId;
									//v.selectionManager.selectNode(rootNodeId, Communicator.SelectionMode.Toggle);
								} else {
									unselectedNodes.push(map.subModelToRootNode[k]);
								}
							}
						}
						v.model.setNodesOpacity(unselectedNodes, 0.6);
					}
				});
			}
		}

		function unloadSelectedModelPartNode(){
			state.selectedModelPartNode = null;
			if (_.isArray(state.viewers.hoops)) {
				removePreviewMesh();
				state.viewers.hoops.forEach(function (v) {
					v.selectionManager.clear();
					v.model.resetModelOpacity();
				});
			}
		}

		function loadSelectedModel() {
			state.modeStates = {};

			const selModel = modelViewerModelSelectionService.getSelectedModel();
			if (!selModel || !selModel.info.isComposite) {
				return;
			}

			Object.keys(modes).forEach(function (modeId) {
				modeId = modes[modeId];

				const modeState = {};

				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					modeState[subModelId] = new SubModelAlignmentModeState(modeId);
				});

				state.modeStates[modeId] = modeState;
			});

			updateSelectedModelParts();
		}

		loadSelectedModel();
		modelViewerModelSelectionService.onSelectedModelChanged.register(loadSelectedModel);

		(function initGeometryManager() {
			const outerRadius = 0.1;

			function createPointGeometry(md, radius, centerDisplacement) {
				/*const innerRadius = radius / 4.0;

				const steps = 36;
				const stepSize = 2 * Math.PI / steps;

				const lineSegments = _.chunk(_.range(0, steps), 3);
				lineSegments.forEach(function (segment) {
					md.addPolyline(_.flatten(_.map(segment, function (circleIdx, idx) {
						const angle = circleIdx * stepSize;

						const r = radius + (idx % 2 === 1 ? centerDisplacement : 0);

						return [Math.cos(angle) * r, Math.sin(angle) * r, 0];
					})));
					md.addPolyline(_.flatten(_.map(segment, function (circleIdx, idx) {
						const angle = circleIdx * stepSize;

						const r = radius + (idx % 2 === 1 ? centerDisplacement : 0);

						return [Math.cos(angle) * r, 0, Math.sin(angle) * r];
					})));
					md.addPolyline(_.flatten(_.map(segment, function (circleIdx, idx) {
						const angle = circleIdx * stepSize;

						const r = radius + (idx % 2 === 1 ? centerDisplacement : 0);

						return [0, Math.cos(angle) * r, Math.sin(angle) * r];
					})));
				});

				md.addPolyline([
					-innerRadius, 0, 0,
					innerRadius, 0, 0
				]);
				md.addPolyline([
					0, -innerRadius, 0,
					0, innerRadius, 0
				]);
				md.addPolyline([
					0, 0, -innerRadius,
					0, 0, innerRadius
				]);
				md.addPoints([0, 0, 0]);
				*/

				const size = radius / 8.0;
				md = createCubeMeshData(md, size);
			}

			function createCubeMeshData(meshData, size) {
				const p1 = new Communicator.Point3(-size, size, size);
				const p2 = new Communicator.Point3(size, size, size);
				const p3 = new Communicator.Point3(-size, -size, size);
				const p4 = new Communicator.Point3(size, -size, size);
				const p5 = new Communicator.Point3(size, size, -size);
				const p6 = new Communicator.Point3(-size, size, -size);
				const p7 = new Communicator.Point3(-size, -size, -size);
				const p8 = new Communicator.Point3(size, -size, -size);

				const points = [
					p1, p2, p3, p2, p4, p3,     // front (Z)
					p5, p6, p7, p5, p7, p8,     // back (-Z)
					p6, p5, p2, p6, p2, p1,     // top (Y)
					p7, p4, p8, p7, p3, p4,     // bottom (-Y)
					p6, p1, p7, p1, p3, p7,     // left (-X)
					p2, p5, p8, p2, p8, p4,     // right (X)
				];

				const normals = [
					new Communicator.Point3(0,0,1),     // front (Z)
					new Communicator.Point3(0,0,-1),    // back (-Z)
					new Communicator.Point3(0,1,0),     // top (Y)
					new Communicator.Point3(0,-1,0),    // bottom (-Y)
					new Communicator.Point3(-1,0,0),    // left (-X)
					new Communicator.Point3(1,0,0),     // right (X)
				];

				const verticexData = [];
				points.forEach((p) => {
					verticexData.push(p.x);
					verticexData.push(p.y);
					verticexData.push(p.z);
				});

				const normalData = [];
				normals.forEach((p) => {
					for (let i = 0; i < 6; ++i) {
						normalData.push(p.x);
						normalData.push(p.y);
						normalData.push(p.z);
					}
				});

				//const meshData = new Communicator.MeshData();
				meshData.addFaces(verticexData, normalData);
				meshData.setFaceWinding(Communicator.FaceWinding.CounterClockwise);
				return meshData;
			}

			function getHelperGeometryMeshInstanceCreationFlags() {
				return Communicator.MeshInstanceCreationFlags.AlwaysDraw |
					Communicator.MeshInstanceCreationFlags.DoNotCut |
					Communicator.MeshInstanceCreationFlags.DoNotExplode |
					Communicator.MeshInstanceCreationFlags.DoNotLight |
					Communicator.MeshInstanceCreationFlags.DoNotSelect |
					Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors |
					Communicator.MeshInstanceCreationFlags.ExcludeBounding |
					Communicator.MeshInstanceCreationFlags.SuppressCameraScale;
			}

			state.geometryMgr.defineGeometry([{
				id: 'refPointSrc',
				data: {
					hoops: {
						populateMeshData: function (md) {
							createPointGeometry(md, outerRadius, 0.01);
						},
						getMeshInstanceCreationFlags: getHelperGeometryMeshInstanceCreationFlags
					}
				}
			}, {
				id: 'refPointTrg',
				data: {
					hoops: {
						populateMeshData: function (md) {
							createPointGeometry(md, outerRadius, -0.01);
						},
						getMeshInstanceCreationFlags: getHelperGeometryMeshInstanceCreationFlags
					}
				}
			}, {
				id: 'refPointRotAxis',
				data: {
					hoops: {
						populateMeshData: function (md) {
							createPointGeometry(md, outerRadius, 0);
						},
						getMeshInstanceCreationFlags: getHelperGeometryMeshInstanceCreationFlags
					}
				}
			}, {
				id: 'refPointSelection',
				data: {
					hoops: {
						populateMeshData: function (md) {
							const outerCornersRadius = 0.08;
							const innerCornersRadius = 0.035;

							const steps = 4;
							const stepSize = 2 * Math.PI / steps;

							const angleMod = Math.PI * 0.03;

							const triangles = _.map(_.range(0, steps), function (idx) {
								const angle = idx * stepSize;
								const triangleXY = [
									Math.cos(angle) * innerCornersRadius, Math.sin(angle) * innerCornersRadius, 0,
									Math.cos(angle + angleMod) * outerCornersRadius, Math.sin(angle + angleMod) * outerCornersRadius, 0,
									Math.cos(angle - angleMod) * outerCornersRadius, Math.sin(angle - angleMod) * outerCornersRadius, 0
								];
								const triangleXZ = [
									Math.cos(angle) * innerCornersRadius, 0, Math.sin(angle) * innerCornersRadius,
									Math.cos(angle + angleMod) * outerCornersRadius, 0, Math.sin(angle + angleMod) * outerCornersRadius,
									Math.cos(angle - angleMod) * outerCornersRadius, 0, Math.sin(angle - angleMod) * outerCornersRadius,
								];
								const triangleYZ = [
									0, Math.cos(angle) * innerCornersRadius, Math.sin(angle) * innerCornersRadius,
									0, Math.cos(angle + angleMod) * outerCornersRadius, Math.sin(angle + angleMod) * outerCornersRadius,
									0, Math.cos(angle - angleMod) * outerCornersRadius, Math.sin(angle - angleMod) * outerCornersRadius
								];

								md.addPolyline(_.concat(triangleXY, _.take(triangleXY, 3)));
								md.addPolyline(_.concat(triangleXZ, _.take(triangleXZ, 3)));
								md.addPolyline(_.concat(triangleYZ, _.take(triangleYZ, 3)));

								return _.concat(triangleXY, triangleXZ, triangleYZ);
							});

							md.addFaces(_.flatten(triangles));

							md.setBackfacesEnabled(true);
						},
						getMeshInstanceCreationFlags: getHelperGeometryMeshInstanceCreationFlags
					}
				}
			}, {
				id: 'originPt',
				data: {
					hoops: {
						populateMeshData: function (md) {
							const crossRadius = 0.045;
							const zeroRadius = 0.03;

							const steps = 24;
							const stepSize = 2 * Math.PI / steps;

							md.addPolyline(_.flatten(_.map(_.concat(_.range(0, steps), [0]), function (idx) {
								const angle = idx * stepSize;
								return [0, Math.cos(angle) * zeroRadius, Math.sin(angle) * zeroRadius];
							})));
							md.addPolyline(_.flatten(_.map(_.concat(_.range(0, steps), [0]), function (idx) {
								const angle = idx * stepSize;
								return [Math.cos(angle) * zeroRadius, 0, Math.sin(angle) * zeroRadius];
							})));
							md.addPolyline(_.flatten(_.map(_.concat(_.range(0, steps), [0]), function (idx) {
								const angle = idx * stepSize;
								return [Math.cos(angle) * zeroRadius, Math.sin(angle) * zeroRadius, 0];
							})));

							md.addPolyline([
								-crossRadius, 0, 0,
								crossRadius, 0, 0
							]);
							md.addPolyline([
								0, -crossRadius, 0,
								0, crossRadius, 0
							]);
							md.addPolyline([
								0, 0, -crossRadius,
								0, 0, crossRadius
							]);
						},
						getMeshInstanceCreationFlags: getHelperGeometryMeshInstanceCreationFlags
					}
				}
			}]);

			state.geometryMgr.addObject('origin', 'originPt', {
				// identity matrix
				transform: _.map(_.range(0, 16), function (idx) {
					return idx % 5 === 0 ? 1 : 0;
				}),
				color: new RgbColor(180, 180, 180)
			});

			state.geometryMgr.addObject('ptSelection', 'refPointSelection', {
				fillColor: new RgbColor(255, 255, 0),
				strokeColor: new RgbColor(141, 141, 0),
				isVisible: false
			});
		})();

		function SubModelAlignmentStateListener() {
		}

		service.SubModelAlignmentStateListener = SubModelAlignmentStateListener;

		SubModelAlignmentStateListener.prototype.modeChanged = function () {
		};

		SubModelAlignmentStateListener.prototype.selectedRefPointChanged = function () {
		};

		service.registerStateListener = function (listener) {
			state.stateListeners.push(listener);
			listener.modeChanged();
		};

		service.unregisterStateListener = function (listener) {
			const idx = state.stateListeners.findIndex(el => el === listener);
			if (idx >= 0) {
				state.stateListeners.splice(idx, 1);
			}
		};

		service.integrate = function (scope) {
			scope.addTools([{
				type: 'check',
				id: 'alignSubModel',
				iconClass: 'tlb-icons ico-view-submodel-alignment',
				caption: 'model.viewer.subModelAlignment.mode',
				fn: function () {
					if (this.value) {
						state.wrapper = modelViewerViewerRegistryService.getViewerWrapper();
						state.wrapper.setTemporaryManipulationOperator('subModelAlignment');
					} else {
						state.wrapper.unsetTemporaryManipulationOperator();
						state.wrapper.detach();
						state.wrapper = null;
					}
				},
				disabled: function () {
					return modelProjectModelPartDataService.getSelectedEntities().length !== 1;
				}
			}]);
		};

		service.registerViewers = function (type, viewers) {
			let viewersList = state.viewers[type];
			if (!_.isArray(viewersList)) {
				viewersList = [];
				state.viewers[type] = viewersList;
			}
			viewersList.push.apply(viewersList, viewers);

			return $q.all(_.map(viewers, function (v) {
				return $q.when(state.geometryMgr.registerViewer(type, v).then(function(){
					loadSelectedModelPartNode(modelViewerModelSelectionService.getSelectedModel(), state.selectedModelPart);
				}));
			}));
		};

		service.unregisterViewers = function (type, viewers) {
			const viewersList = state.viewers[type];
			if (_.isArray(viewersList)) {
				unloadSelectedModelPartNode();
				viewers.forEach(function (v) {
					const idx = viewersList.indexOf(v);
					if (idx >= 0) {
						viewersList.splice(idx, 1);
					}
				});
			}

			return $q.all(_.map(viewers, function (v) {
				return $q.when(state.geometryMgr.unregisterViewer(type, v));
			}));
		};

		service.registerPointProjectionHelper = function (pph) {
			state.pointProjectionHelpers.push(pph);

			if (state.activeMode) {
				const currentModeInfo = modeInfo[state.activeMode];
				if (currentModeInfo) {
					currentModeInfo.refPointDefs.forEach(function (rpd) {
						const pt = state.getRefPoint(rpd.id);

						pph.setPoint(rpd.id, pt.position);
					});
				}
			}
		};

		service.unregisterPointProjectionHelper = function (pph) {
			const idx = state.pointProjectionHelpers.findIndex(el => el === pph);
			if (idx >= 0) {
				state.pointProjectionHelpers.splice(idx, 1);
			}
		};

		function cleanUpCurrentMode() {
			state.selectedRefPointId = null;

			const previousModeInfo = modeInfo[state.activeMode];
			if (previousModeInfo) {
				previousModeInfo.refPointDefs.forEach(function (rpd) {
					state.geometryMgr.removeObject(rpd.id);
					state.pointProjectionHelpers.forEach(function (pph) {
						pph.removePoint(rpd.id);
					});
				});
			}
		}

		function initializeCurrentMode() {
			if (!state.selectedModelPart) {
				return;
			}

			const newModeInfo = modeInfo[state.activeMode];
			if (!newModeInfo) {
				throw new Error('Unknown sub-model alignment mode: ' + state.activeMode);
			}
			removePreviewMesh();

			newModeInfo.refPointDefs.forEach(function (rpd) {
				const pt = state.getRefPoint(rpd.id);
				if (!pt) {
					throw new Error('Invalid reference point: ' + rpd.id);
				}
				const pos = pt.position;

				state.geometryMgr.addObject(rpd.id, rpd.geometryDef, {
					color: rpd.color,
					transform: [
						1, 0, 0, 0,
						0, 1, 0, 0,
						0, 0, 1, 0,
						pos.x, pos.y, pos.z, 1
					],
					isSuppressCameraScale: true
				});
				state.pointProjectionHelpers.forEach(function (pph) {
					pph.setPoint(rpd.id, pos);
				});
			});

			state.stateListeners.forEach(function (sl) {
				sl.modeChanged();
			});

			updateRefPointSelection();
		}

		service.activateMode = function (mode) {
			cleanUpCurrentMode();

			const newModeInfo = modeInfo[mode];
			if (!newModeInfo) {
				throw new Error('Unknown sub-model alignment mode: ' + mode);
			}

			state.activeMode = mode;
			state.selectedRefPointId = null;

			initializeCurrentMode();
		};

		service.getActiveModeInfo = function () {
			const activeModeInfo = modeInfo[state.activeMode];

			return {
				id: state.activeMode,
				refPointsPlane: _.cloneDeep(activeModeInfo.refPtPlane),
				refPoints: _.cloneDeep(activeModeInfo.refPointDefs)
			};
		};

		service.getRefPoint = function (refPointId) {
			const pt = state.getRefPoint(refPointId);
			return _.clone(pt.position);
		};

		service.updateRefPoint = function (refPointId, position) {
			const pt = state.getRefPoint(refPointId);
			position = _.clone(normalizePointStructure(position));
			pt.position = position;

			state.pointProjectionHelpers.forEach(function (pph) {
				pph.setPoint(refPointId, position);
			});

			const tr = [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				position.x, position.y, position.z, 1
			];
			state.geometryMgr.setTransform(refPointId, tr);

			if (refPointId === state.selectedRefPointId) {
				state.geometryMgr.setTransform('ptSelection', tr);
			}
		};

		service.applyTransformation = function () {
			const activeMode = modeInfo[state.activeMode];
			return $q.when(activeMode.applyTransformation()).then(function () {
				removePreviewMesh();
				state.onSubModelTransformationChanged.fire();
			});
		};

		service.resetTransformation = function () {
			removePreviewMesh();
			return modelViewerSubModelTransformationHelperService.resetTransformation(state.getSubModelDataForTransformation());
		};

		service.setSubModelCornerPos = function (position) {
			state.selectedModelPartCornerPos = position;
		};

		service.getSubModelCornerPos = function () {
			return state.selectedModelPartCornerPos;
		};

		service.forcePositionFix = function (mode, refId, position) {
			let fix_pos = position;
			if (mode === 'xRot'){
				fix_pos.x = 0;
			} else if (mode === 'yRot'){
				fix_pos.y = 0;
			} else if (mode === 'zRot'){
				fix_pos.z = 0;
			}

			return fix_pos;
		};

		service.previewMesh = function () {
			const activeMode = modeInfo[state.activeMode];
			return activeMode.previewMesh();
		};

		service.removePreviewMesh = function () {
			return removePreviewMesh();
		};

		function removePreviewMesh(){
			if (_.isArray(state.viewers.hoops) && state.viewers.hoops.length > 0) {
				let viewer = state.viewers.hoops[0];
				return modelViewerSubModelTransformationHelperService.removePreviewMeshInstance(viewer);
			}
			return $q.when();
		}

		function updateRefPointSelection() {
			if (state.selectedRefPointId) {
				const pt = state.getRefPoint(state.selectedRefPointId);
				if (pt) {
					state.geometryMgr.setTransform('ptSelection', [
						1, 0, 0, 0,
						0, 1, 0, 0,
						0, 0, 1, 0,
						pt.position.x, pt.position.y, pt.position.z, 1
					]);
					state.geometryMgr.setVisible('ptSelection', true);
					return;
				}
			}

			state.geometryMgr.setVisible('ptSelection', false);
		}

		service.selectRefPoint = function (ptId) {
			let newSel;

			if (_.isNil(ptId)) {
				newSel = null;
			} else if (_.isString(ptId)) {
				if (_.find(modeInfo[state.activeMode].refPointDefs, {id: ptId})) {
					newSel = ptId;
				} else {
					throw new Error('Unknown reference point: ' + ptId);
				}
			} else {
				throw new Error('Invalid ref point ID supplied for selection.');
			}

			if (state.selectedRefPointId !== newSel) {
				state.selectedRefPointId = newSel;

				updateRefPointSelection();

				state.stateListeners.forEach(function (sl) {
					sl.selectedRefPointChanged();
				});
			}
		};

		service.getSelectedRefPointId = function () {
			return state.selectedRefPointId;
		};

		service.registerSubModelTransformationChanged = function (handler) {
			return state.onSubModelTransformationChanged.register(handler);
		};

		service.unregisterSubModelTransformationChanged = function (handler) {
			return state.onSubModelTransformationChanged.unregister(handler);
		};

		return service;
	}
})(angular);
