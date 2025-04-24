/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationOverlayService';

	myModule.factory(svcName, modelAnnotationOverlayService);

	modelAnnotationOverlayService.$inject = ['_', '$http', '$q', '$injector',
		'modelViewerModelSelectionService', 'modelViewerObjectIdMapService',
		'modelViewerModelIdSetService', 'PlatformMessenger'];

	function modelAnnotationOverlayService(_, $http, $q, $injector,
		modelViewerModelSelectionService, modelViewerObjectIdMapService,
		modelViewerModelIdSetService, PlatformMessenger) {

		const service = {};

		const appId = 'modelAnnotations';

		class CachedMeshInfo {
			constructor(subModelId, meshId) {
				this.subModelId = parseInt(subModelId);
				this.meshId = parseInt(meshId);
				this.annotations = [];
			}

			static generatePointId(subModelId, meshId) {
				return `mesh_${subModelId}_${meshId}`;
			}

			getPointId() {
				return CachedMeshInfo.generatePointId(this.subModelId, this.meshId);
			}
		}

		const cachedData = {
			clientCount: 0,
			addClient() {
				if (this.clientCount === 0) {
					modelViewerModelSelectionService.onSelectedModelChanged.register(modelChanged);
					modelChanged();
				}
				this.clientCount++;
			},
			removeClient() {
				this.clientCount--;
				if (this.clientCount === 0) {
					modelViewerModelSelectionService.onSelectedModelChanged.unregister(modelChanged);
					this.clearData();
				}
			},
			clearData() {
				this.byModelId = null;
				this.byAnnotationId = {};
			},
			byModelId: null,
			byAnnotationId: null,
			storeAnnotation(annotation) {
				const that = this;

				if (!that.byAnnotationId[annotation.AnnotationFk]) {
					that.byAnnotationId[annotation.AnnotationFk] = annotation;

					delete annotation.ObjectIds;
					annotation.MeshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(annotation.MeshIds).useSubModelIds();
					annotation.MeshPointIds = [];

					Object.keys(annotation.MeshIds).forEach(function (smId) {
						const modelMeshIds = annotation.MeshIds[smId];

						const cachedModelMeshIds = that.byModelId[smId];

						modelMeshIds.forEach(function (meshId) {
							let cachedMeshInfo = cachedModelMeshIds[meshId];
							if (!cachedMeshInfo) {
								cachedMeshInfo = new CachedMeshInfo(smId, meshId);
								cachedModelMeshIds[meshId] = cachedMeshInfo;
							}

							cachedMeshInfo.annotations.push(annotation);

							annotation.MeshPointIds.push(CachedMeshInfo.generatePointId(smId, meshId));
						});
					});
				}
			},
			retrieveMissingLocationInfo(viewerAdapter) {
				const that = this;

				const posRetrievalPromises = [];
				Object.keys(that.byModelId).forEach(function (smId) {
					smId = parseInt(smId);
					const cachedModelData = that.byModelId[smId];
					Object.keys(cachedModelData).forEach(function (meshId) {
						meshId = parseInt(meshId);
						const cachedMeshData = cachedModelData[meshId];
						if (!cachedMeshData.position) {
							posRetrievalPromises.push($q.when(viewerAdapter.retrieveMeshCenter(smId, meshId)).then(function (pos) {
								cachedMeshData.position = pos;
							}));
						}
					});
				});

				return $q.all(posRetrievalPromises).then(() => posRetrievalPromises.length > 0);
			},
			getAnnotationIdsForMeshIds: function (meshIds) {
				if (_.isNil(meshIds)) {
					return [];
				}

				const that = this;

				const annotationIdMap = {};

				Object.keys(meshIds).forEach(function (smId) {
					smId = parseInt(smId);

					const cachedModelMeshIds = that.byModelId[smId];
					if (cachedModelMeshIds) {
						const modelMeshIds = meshIds[smId];

						modelMeshIds.forEach(function (meshId) {
							const cachedMeshInfo = cachedModelMeshIds[meshId];
							if (cachedMeshInfo && _.isArray(cachedMeshInfo.annotations)) {
								cachedMeshInfo.annotations.forEach(function (annotation) {
									annotationIdMap[annotation.AnnotationFk] = true;
								});
							}
						});
					}
				});

				return _.map(Object.keys(annotationIdMap), id => parseInt(id));
			}
		};

		function modelChanged() {
			cachedData.clearData();
			cachedData.byModelId = modelViewerModelSelectionService.forEachSubModel(() => new modelViewerObjectIdMapService.ObjectIdMap());
		}

		class ViewerAdapter {
			constructor() {
				this._onViewportUpdated = new PlatformMessenger();
			}

			registerViewportUpdated(handler) {
				this._onViewportUpdated.register(handler);
			}

			unregisterViewportUpdated(handler) {
				this._onViewportUpdated.unregister(handler);
			}

			_fireViewportUpdated(info) {
				this._onViewportUpdated.fire(info);
			}

			findNearbyMeshes() {
				throw new Error('This function must be overridden in a subclass.');
			}

			retrieveMeshCenter(/* subModelId, meshId */) {
				throw new Error('This function must be overridden in a subclass.');
			}

			enrichDrawingData(/* drawingData */) {
			}

			getAnnotationVisibility() {
				throw new Error('This function must be overridden in a subclass.');
			}

			finalize() {
			}
		}

		service.ViewerAdapter = ViewerAdapter;

		class AnnotationOverlay {
			constructor(scApp) {
				this._scApp = scApp;
			}

			draw(/* info, data */) {
				throw new Error('This method must be overridden by a subclass.');
			}

			getToolItems() {
				return [];
			}

			finalize() {
			}
		}

		service.AnnotationOverlay = AnnotationOverlay;

		let modelAnnotationIconOverlayService = null;

		let modelAnnotationCallOutOverlayService = null;

		service.initialize = function (viewerAdapter, scMgr) {
			const privateState = {
				scApp: scMgr.addApplication(appId),
				initializeOverlays() {
					const that = this;

					if (!modelAnnotationIconOverlayService) {
						modelAnnotationIconOverlayService = $injector.get('modelAnnotationIconOverlayService');
						modelAnnotationCallOutOverlayService = $injector.get('modelAnnotationCallOutOverlayService');
					}
					that.overlays = [
						new modelAnnotationIconOverlayService.IconOverlay(that.scApp),
						new modelAnnotationCallOutOverlayService.CallOutOverlay(that.scApp)
					];

					that.annoVisUpdateFunc = function () {
						that.requestRedraw();
					};
					viewerAdapter.getAnnotationVisibility().registerVisibilitiesChanged(that.annoVisUpdateFunc);
				},
				requestRedraw() {
					const that = this;
					that.scApp.requestRedraw();
				},
				nearbyMeshIds: null,
				updateNearbyMeshIds(meshIds) {
					const that = this;
					const newMeshIds = meshIds.normalizeToArrays();

					const isDifferent = (function checkIsDifferent() {
						if (_.isNil(that.nearbyMeshIds)) {
							return true;
						}

						const oldSubModelIds = _.map(Object.keys(that.nearbyMeshIds), smId => parseInt(smId));
						if (oldSubModelIds.length !== Object.keys(newMeshIds).length) {
							return true;
						}

						for (const smId of oldSubModelIds) {
							const newModelMeshIds = newMeshIds[smId];
							if (!newModelMeshIds) {
								return true;
							}

							const oldModelMeshIds = that.nearbyMeshIds[smId];
							if (oldModelMeshIds.length !== newModelMeshIds.length) {
								return true;
							}

							if (_.some(oldModelMeshIds, id => !newModelMeshIds.includes(id))) {
								return true;
							}
						}

						return false;
					})();

					if (isDifferent) {
						that.nearbyMeshIds = newMeshIds;
					}
					return isDifferent;
				}
			};

			privateState.initializeOverlays();

			viewerAdapter.registerViewportUpdated(function doUpdateCamera() {
				$q.when(viewerAdapter.findNearbyMeshes()).then(function (nearbyMeshIds) {
					if (privateState.updateNearbyMeshIds(nearbyMeshIds)) {
						privateState.requestRedraw();
					}

					if (!privateState.nearbyMeshIds.isEmpty()) {
						const unknownMeshes = modelViewerModelSelectionService.forEachSubModel(function (smId) {
							const cachedModelMeshes = cachedData.byModelId[smId];

							const nearbyModelMeshIds = privateState.nearbyMeshIds[smId];
							const unknownModelMeshes = [];
							if (_.isArray(nearbyModelMeshIds)) {
								nearbyModelMeshIds.forEach(function (meshId) {
									let cachedMeshInfo = cachedModelMeshes[meshId];
									if (!cachedMeshInfo) {
										cachedMeshInfo = new CachedMeshInfo(smId, meshId);
										cachedModelMeshes[meshId] = cachedMeshInfo;
									}

									if (!cachedMeshInfo.isComplete) {
										unknownModelMeshes.push(meshId);
										cachedMeshInfo.isComplete = true;
									}
								});
							}
							return unknownModelMeshes;
						});

						if (!unknownMeshes.isEmpty()) {
							$http.post(globals.webApiBaseUrl + 'model/annotation/hints', {
								modelId: modelViewerModelSelectionService.getSelectedModelId() || 0,
								meshIds: unknownMeshes.useGlobalModelIds().toCompressedString()
							}).then(function (response) {
								if (_.isArray(response.data)) {
									response.data.forEach(annotation => cachedData.storeAnnotation(annotation));

									return cachedData.retrieveMissingLocationInfo(viewerAdapter).then(function (newDataLoaded) {
										if (newDataLoaded) {
											privateState.requestRedraw();
										}
									});
								}
							});
						}
					}
				});
			});

			cachedData.addClient();

			privateState.scApp.registerUpdate(function drawIcons(info) {
				if (_.isNil(privateState.nearbyMeshIds)) {
					privateState.nearbyMeshIds = new modelViewerModelIdSetService.MultiModelIdSet();
				}

				privateState.scApp.suspendPointUpdates();
				const usedPointsMap = {};
				for (const smId of Object.keys(privateState.nearbyMeshIds)) {
					const modelMeshIds = privateState.nearbyMeshIds[smId];
					for (const meshId of modelMeshIds) {
						const cachedMeshInfo = _.get(cachedData, `byModelId[${smId}][${meshId}]`);
						if (cachedMeshInfo) {
							if (cachedMeshInfo.position) {
								const pointId = cachedMeshInfo.getPointId();
								if (!privateState.scApp.isPointRegistered(pointId)) {
									privateState.scApp.setPoint(pointId, 'coord3d', cachedMeshInfo.position, 'meshes');
								}
								usedPointsMap[pointId] = true;
							}
						}
					}
				}
				_.filter(privateState.scApp._getPointIdsInSet('meshes'), ptId => !usedPointsMap[ptId]).forEach(ptId => privateState.scApp.removePoint(ptId));
				privateState.scApp.resumePointUpdates();

				const annotationIds = cachedData.getAnnotationIdsForMeshIds(privateState.nearbyMeshIds);
				const annotations = _.filter(_.map(annotationIds, aId => cachedData.byAnnotationId[aId]), a => _.isObject(a));

				const drawingData = {
					annotations: annotations,
					usedPoints: usedPointsMap
				};
				viewerAdapter.enrichDrawingData(drawingData);
				for (const overlay of privateState.overlays) {
					overlay.draw(_.assign(info, {
						annotationVisibility: viewerAdapter.getAnnotationVisibility()
					}), drawingData);
				}
			});

			return {
				getToolItems() {
					return _.flatten(_.map(privateState.overlays, function (overlay) {
						const items = overlay.getToolItems();
						return Array.isArray(items) ? items : [];
					}));
				},
				finalize() {
					viewerAdapter.getAnnotationVisibility().unregisterVisibilitiesChanged(privateState.annoVisUpdateFunc);

					viewerAdapter.finalize();
					cachedData.removeClient();

					for (const overlay of privateState.overlays) {
						overlay.finalize();
					}
					privateState.overlays = [];

					scMgr.removeApplication(appId);
				}
			};
		};

		return service;
	}
})(angular);
