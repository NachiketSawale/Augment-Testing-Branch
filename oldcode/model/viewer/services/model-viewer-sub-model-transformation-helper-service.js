/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSubModelTransformationHelperService
	 * @function
	 *
	 * @description Applies alignment transformations to sub-models of a composite model.
	 *              This service internally uses HOOPS Communicator for the sake of convenience to handle vector and
	 *              matrix data, but the respective operations could also be performed by custom code.
	 */
	angular.module('model.viewer').factory('modelViewerSubModelTransformationHelperService', ['_', '$q', 'Communicator',
		'modelProjectModelPartDataService', 'modelViewerModelSelectionService', 'modelViewerHoopsLinkService',
		'modelViewerHoopsUtilitiesService', 'modelViewerSelectabilityService',
		function (_, $q, Communicator, modelProjectModelPartDataService, modelViewerModelSelectionService,
		          modelViewerHoopsLinkService, modelViewerHoopsUtilitiesService, modelViewerSelectabilityService) {
			var service = {};

			service.applyTranslation = function (subModelData, translationVector) {
				return service.applyTransformation(subModelData, [
					1, 0, 0, 0,
					0, 1, 0, 0,
					0, 0, 1, 0,
					translationVector.x, translationVector.y, translationVector.z, 1
				]);
			};

			function extractTransform(modelPartEntity) {
				if (modelPartEntity && _.isString(modelPartEntity.Transform)) {
					var rawMatrix;
					try {
						rawMatrix = JSON.parse(modelPartEntity.Transform);
					} catch (e) {
						rawMatrix = null;
					}
					if (_.isArray(rawMatrix)) {
						return Communicator.Matrix.createFromArray(rawMatrix);
					}
				}
				return null;
			}

			service.applyTransformation = function (subModelData, matrix) {
				var m = Communicator.Matrix.createFromArray(matrix);

				var baseTransform = extractTransform(subModelData.modelPartEntity) || new Communicator.Matrix();

				var newMatrix = Communicator.Matrix.multiply(baseTransform, m);

				if (subModelData.modelPartEntity) {
					var newMatrixStr = JSON.stringify(newMatrix.m);
					if (subModelData.modelPartEntity.Transform !== newMatrixStr) {
						subModelData.modelPartEntity.Transform = newMatrixStr;
						modelProjectModelPartDataService.markItemAsModified(subModelData.modelPartEntity);
					}

					var selModel = modelViewerModelSelectionService.getSelectedModel();
					if (selModel && selModel.info.modelId === subModelData.modelPartEntity.ModelFk) {
						var smInfo = _.find(selModel.subModels, sm => sm.info.modelId === subModelData.modelPartEntity.ModelPartFk);
						if (smInfo) {
							smInfo.transform = _.clone(newMatrix.m);

							updateViewers(subModelData, smInfo.subModelId, newMatrix);
						}
					}
				}
			};

			service.resetTransformation = function (subModelData) {
				if (subModelData.modelPartEntity) {
					if (!_.isNil(subModelData.modelPartEntity.Transform)) {
						subModelData.modelPartEntity.Transform = null;
						modelProjectModelPartDataService.markItemAsModified(subModelData.modelPartEntity);
					}

					var selModel = modelViewerModelSelectionService.getSelectedModel();
					if (selModel && selModel.info.modelId === subModelData.modelPartEntity.ModelFk) {
						var smInfo = _.find(selModel.subModels, sm => sm.info.modelId === subModelData.modelPartEntity.ModelPartFk);
						if (smInfo) {
							smInfo.transform = null;

							updateViewers(subModelData, smInfo.subModelId, null);
						}
					}
				}
			};

			function updateViewers(subModelData, subModelId, matrix) {
				var results = [];

				if (_.isArray(subModelData.hoopsViewers)) {
					var mapProp = modelViewerHoopsLinkService.getSubModelsMapProperty();

					var effectiveMatrix = _.isNil(matrix) ? new Communicator.Matrix() : matrix;

					subModelData.hoopsViewers.forEach(function (v) {
						var map = v[mapProp];
						if (map) {
							var rootNodeId = map.subModelToRootNode[subModelId];
							if (_.isInteger(rootNodeId)) {
								var promise = v.model.setNodeMatrix(rootNodeId, effectiveMatrix, true);
								results.push(promise);
							}
						}
					});
				}

				return results.length > 0 ? $q.all(results) : $q.when();
			}

			service.applyRotationByVectors = function (subModelData, rotationAxisPoint, originVector, destinationVector) {
				var angle = Communicator.Point3.degreesBetween(originVector, destinationVector);
				var rotationAxis = Communicator.Point3.normalFromVectors(originVector, destinationVector);

				var toOrigin = new Communicator.Matrix().setTranslationComponent(-rotationAxisPoint.x, -rotationAxisPoint.y, -rotationAxisPoint.z);
				var fromOrigin = new Communicator.Matrix().setTranslationComponent(rotationAxisPoint.x, rotationAxisPoint.y, rotationAxisPoint.z);

				var rotMatrix = Communicator.Matrix.createFromOffAxisRotation(rotationAxis, angle);

				var completeMatrix = modelViewerHoopsUtilitiesService.createMatrix(toOrigin, rotMatrix, fromOrigin);

				return service.applyTransformation(subModelData, completeMatrix.m);
			};

			let pvMeshInstanceNodeNamePrefix = 'preview-mesh-';

			service.applyPreviewMeshTranslation = function (subModelData, translationVector) {

				let translationMatrix = new Communicator.Matrix();
				translationMatrix.m[12] = translationVector.x;
				translationMatrix.m[13] = translationVector.y;
				translationMatrix.m[14] = translationVector.z;

				return service.transformPreviewMeshInstance(subModelData, translationMatrix.m);
			};

			service.applyPreviewMeshRotation = function (subModelData, rotationAxisPoint, originVector, destinationVector) {
				var angle = Communicator.Point3.degreesBetween(originVector, destinationVector);
				var rotationAxis = Communicator.Point3.normalFromVectors(originVector, destinationVector);

				var toOrigin = new Communicator.Matrix().setTranslationComponent(-rotationAxisPoint.x, -rotationAxisPoint.y, -rotationAxisPoint.z);
				var fromOrigin = new Communicator.Matrix().setTranslationComponent(rotationAxisPoint.x, rotationAxisPoint.y, rotationAxisPoint.z);

				var rotMatrix = Communicator.Matrix.createFromOffAxisRotation(rotationAxis, angle);

				var rotationMatrix = modelViewerHoopsUtilitiesService.createMatrix(toOrigin, rotMatrix, fromOrigin);

				return service.transformPreviewMeshInstance(subModelData, rotationMatrix.m);
			};

			service.createPreviewMeshInstance = function (subModelData) {
				let viewer = subModelData.hoopsViewers[0];
				let subModelId = subModelData.modelPartId;
				let subModelNode = subModelData.modelPartNode;
				const selectabilityInfo = modelViewerSelectabilityService.getSelectabilityInfo(viewer);

				let leafNodeIds = gatherChildLeafNodes(viewer, subModelNode);
				var meshIdPromises = leafNodeIds.map(function (leafNodeId) {
					return viewer.model.getMeshIds([leafNodeId]);
				});
				//! [webviewer_instance_get_mesh_ids]

				//! [webviewer_instance_create_mesh]
				var parentNodeId = viewer.model.createNode(viewer.model.getAbsoluteRootNode(), pvMeshInstanceNodeNamePrefix + subModelData.modelPartId);
				let results = [];

				$q.all(meshIdPromises).then(function (meshIdsByLeafNode) {
					viewer.model.getNodesEffectiveFaceColor(leafNodeIds).then(function (myFaceColor) {
						viewer.model.getNodesEffectiveLineColor(leafNodeIds).then(function (myLineColor) {
							var currentMeshIndex = 0;

							for (var i = 0; i < meshIdsByLeafNode.length; ++i) {
								var myMeshIds = meshIdsByLeafNode[i];
								var myNodeId = leafNodeIds[i];
								var baseTransform = viewer.model.getNodeNetMatrix(myNodeId);
								//var translationMatrix = Communicator.Matrix.multiply(baseTransform, m);
								for (var j = 0; j < myMeshIds.length; j++) {
									var myMeshId = myMeshIds[j];
									if (selectabilityInfo.isMeshSelectable(subModelId, myMeshId[1])){
										var myMeshInstanceData = new Communicator.MeshInstanceData(
											myMeshId,
											//translationMatrix,
											baseTransform,
											null,
											myFaceColor[currentMeshIndex],
											myLineColor[currentMeshIndex]
										);
										myMeshInstanceData.setOpacity(0.2);
										let createMeshPromise = viewer.model.createMeshInstance(myMeshInstanceData, parentNodeId);
										results.push(createMeshPromise);
									}
									currentMeshIndex++;
								}
							}
						});
					});
				});

				return $q.all(results).then(function(){ return parentNodeId; });
			};

			service.transformPreviewMeshInstance = function (subModelData, matrix) {
				let m = Communicator.Matrix.createFromArray(matrix);

				let viewer = subModelData.hoopsViewers[0];
				let rootNodes = getPreviewMeshInstanceNodes(viewer, subModelData.modelPartId);
				let rootNodeId = rootNodes.length > 0 ? rootNodes[0] : null;

				let results = [];
				if (!rootNodeId) {
					service.createPreviewMeshInstance(subModelData).then(function(newNodeId){
						let promise = viewer.model.setNodeMatrix(newNodeId, m, true);
						results.push(promise);
					});
				} else {
					let promise = viewer.model.setNodeMatrix(rootNodeId, m, true);
					results.push(promise);
				}

				return results.length > 0 ? $q.all(results) : $q.when();
			};

			service.removePreviewMeshInstance = function (viewer) {
				let meshInstanceNodes = getPreviewMeshInstanceNodes(viewer);

				if (meshInstanceNodes.length > 0) {
					let results = [];
					meshInstanceNodes.forEach(function (meshInstanceNodeId) {
						let leafNodeIds = gatherChildLeafNodes(viewer, meshInstanceNodeId);

						let promise = viewer.model.deleteMeshInstances(leafNodeIds).then(function () {
							viewer.model.deleteNode(meshInstanceNodeId);
						});
						results.push(promise);
					});

					return $q.all(results);
				} else {
					return $q.when();
				}
			};

			function gatherChildLeafNodes(viewer, subModelNode) {
				let nodes = [subModelNode];
				let leaves = [];
				for (let i = 0; i < nodes.length; ++i) {
					let node = nodes[i];
					let kids = viewer.model.getNodeChildren(node);
					if (kids.length === 0) {
						leaves.push(node);
					}
					for (let j = 0; j < kids.length; j++) {
						let kid = kids[j];
						nodes.push(kid);
					}
				}
				return leaves;
			}

			function getPreviewMeshInstanceNodes(viewer, subModelId){
				let pvMeshInstanceNodes = [];
					let childNodes = viewer.model.getNodeChildren(viewer.model.getAbsoluteRootNode());
					childNodes.forEach(function (childNodeId) {
						if (!subModelId){
							if(viewer.model.getNodeName(childNodeId).includes(pvMeshInstanceNodeNamePrefix)){
								pvMeshInstanceNodes.push(childNodeId);
							}
						} else {
							if(viewer.model.getNodeName(childNodeId) === pvMeshInstanceNodeNamePrefix + subModelId){
								pvMeshInstanceNodes.push(childNodeId);
							}
						}
					});
				return pvMeshInstanceNodes;
			}

			return service;
		}]);
})(angular);
