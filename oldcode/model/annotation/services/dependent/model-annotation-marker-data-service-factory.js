/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationMarkerDataServiceFactory';

	myModule.factory(svcName, modelAnnotationMarkerDataServiceFactory);

	modelAnnotationMarkerDataServiceFactory.$inject = ['platformDataServiceFactory', '_', 'modelViewerViewerRegistryService',
		'modelAnnotationDataServiceFactoryHelperService', 'modelAnnotationMarkerDisplayService',
		'modelProjectPinnableEntityService', 'modelViewerModelSelectionService','platformObservableService', 'modelViewerModelIdSetService'];

	function modelAnnotationMarkerDataServiceFactory(platformDataServiceFactory, _, modelViewerViewerRegistryService,
		modelAnnotationDataServiceFactoryHelperService, modelAnnotationMarkerDisplayService,
		modelProjectPinnableEntityService, modelViewerModelSelectionService, platformObservableService,modelViewerModelIdSetService) {

		const globalSettings = {
			overwriteBlacklist: _.assign(platformObservableService.createObservableBoolean({
				initialValue: true
			}), {
				uiHints: {
					id: 'toggleOverwriteBlacklist',
					caption$tr$: 'model.annotation.updateBlacklist',
					iconClass: 'tlb-icons ico-set-model-blacklist'
				}
			}),
			cuttingPlanes: _.assign(platformObservableService.createObservableBoolean({
				initialValue: true
			}), {
				uiHints: {
					id: 'toggleCutObjects',
					caption$tr$: 'model.annotation.cuttingPlanes ',
					iconClass: 'tlb-icons ico-set-cutting-planes'
				}
			})
		};



		function createService(config) {
			const actualConfig = modelAnnotationDataServiceFactoryHelperService.normalizeConfig(config);

			function generateGlobalId(item) {
				item.globalId = _.isString(item.TemporaryId) ? item.TemporaryId : `${item.AnnotationFk}/${item.Id}`;
			}

			const privateState = {
				activeUsers: 0,
				hasActiveConsumers: () => privateState.activeConsumerCount > 0,
				nextNewId: -1,
				generateNewId() {
					return this.nextNewId--;
				}
			};

			const service = {};
			const serviceOptions = {
				flatLeafItem: {
					module: actualConfig.getModule(),
					serviceName: actualConfig.serviceName,
					entityNameTranslationID: 'model.annotation.markerEntityName',
					actions: {
						delete: true,
						create: 'flat'
					},
					dataProcessor: [{
						processItem: generateGlobalId
					}, {
							processItem: function (item) {
								
								updateViewerButtonsOnItem(item);
								
							}
						}],
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								actualConfig.initializeCreationData(creationData, 'PKey1');
							},
							handleCreateSucceeded: function (item) {
								if (item.Id <= 0) {
									item.Id = privateState.generateNewId();
								}
								item.ContextModelId = modelProjectPinnableEntityService.getPinned();
								generateGlobalId(item);
								modelAnnotationMarkerDisplayService.addMarker(item);
								updateViewerButtonsOnItem(item);
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'ModelAnnotationMarkers',
							parentService: actualConfig.parentService
						}
					}
				}
			};

			actualConfig.createHttpCrudSettings('marker', serviceOptions.flatLeafItem);

			const serviceContainer = platformDataServiceFactory.createService(serviceOptions, service);

			service.canCreate = () => actualConfig.canCreateForCurrentModel();

			service.registerItemModified(function annoMarkerModified(e, marker) {
				modelAnnotationMarkerDisplayService.updateMarker(marker);
			});

			service.registerSelectedEntitiesChanged(function () {
				modelAnnotationMarkerDisplayService.setHighlight(service.getSelectedEntities());
			});

			const baseOnDeleteDone = serviceContainer.data.onDeleteDone;
			serviceContainer.data.onDeleteDone = function (deletionInfo) {
				if (Array.isArray(deletionInfo.entities)) {
					for (let marker of deletionInfo.entities) {
						modelAnnotationMarkerDisplayService.removeMarker(marker);
					}
				}

				return baseOnDeleteDone.apply(this, arguments);
			};

			actualConfig.parentService.registerRefreshRequested(function () {
				modelAnnotationMarkerDisplayService.refreshMarkers();
			});

			service.addActiveUser = function () {
				privateState.activeUsers++;
			};

			service.removeActiveUser = function () {
				privateState.activeUsers--;
				if (privateState.activeUsers === 0) {
					modelAnnotationMarkerDisplayService.clearHighlight();
				}
			};

			function updateViewerButtons() {
				const items = serviceContainer.data.getList();
				if (!_.isEmpty(items)) {
					items.forEach(updateViewerButtonsOnItem);
				}
			}

			function updateViewerButtonsOnItem(item) {
				const selModel = modelViewerModelSelectionService.getSelectedModel();
				const isRelevantModelShown = selModel && selModel.isGlobalModelIdIncluded(item.ContextModelId);
								
				const showCamPos = isRelevantModelShown ? function showCamPos(viewerInfo) {

					if (globalSettings.overwriteBlacklist.getValue()) {
						const bl = viewerInfo.getFilterEngine().getBlacklist();
						bl.excludeAll();

						if(item.CameraPosition){
							if (item.CameraPosition.HiddenMeshIds) {
								const meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(item.CameraPosition.HiddenMeshIds).useSubModelIds();
								bl.includeMeshIds(meshIds);
							}
						}
					}

					if (globalSettings.cuttingPlanes.getValue() && item.CameraPosition) {
						if (Array.isArray(item.CameraPosition.ClippingPlanes) && item.CameraPosition.ClippingPlanes.length > 0) {
							viewerInfo.setCuttingPlane(item.CameraPosition.ClippingPlanes);
							viewerInfo.setCuttingActive();
						} else {
							viewerInfo.setCuttingInactive();
						}												
					}

					viewerInfo.showCamPos({
						pos: {
							x: item.CameraPosition.PosX,
							y: item.CameraPosition.PosY,
							z: item.CameraPosition.PosZ
						},
						trg: {
							x: item.CameraPosition.PosX + item.CameraPosition.DirX,
							y: item.CameraPosition.PosY + item.CameraPosition.DirY,
							z: item.CameraPosition.PosZ + item.CameraPosition.DirZ
						}
					});
				} : function showNoCamPos() { };

				_.set(item, 'ShowInViewer.actionList', modelViewerViewerRegistryService.createViewerActionButtons({
					disabled: !isRelevantModelShown,
					execute: showCamPos
				}));
				service.fireItemModified(item);
			}

			return service;
		}

		return {
			createService: createService
		};
	}
})(angular);
