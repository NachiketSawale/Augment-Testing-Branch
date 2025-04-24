/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationCameraDataServiceFactory';

	myModule.factory(svcName, modelAnnotationCameraDataServiceFactory);

	modelAnnotationCameraDataServiceFactory.$inject = ['platformDataServiceFactory',
		'modelAnnotationDataService', '$q', '_', 'modelViewerViewerRegistryService',
		'modelAnnotationDataServiceFactoryHelperService', 'platformObservableService',
		'modelViewerModelIdSetService', 'modelProjectPinnableEntityService',
		'modelAnnotationCameraUtilitiesService', 'modelViewerModelSelectionService'];

	function modelAnnotationCameraDataServiceFactory(platformDataServiceFactory,
													 modelAnnotationDataService, $q, _, modelViewerViewerRegistryService,
													 modelAnnotationDataServiceFactoryHelperService, platformObservableService,
													 modelViewerModelIdSetService, modelProjectPinnableEntityService,
													 modelAnnotationCameraUtilitiesService, modelViewerModelSelectionService) {

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

			let service = {};
			const serviceOptions = {
				flatLeafItem: {
					module: actualConfig.getModule(),
					serviceName: actualConfig.serviceName,
					entityNameTranslationID: 'model.annotation.cameraEntityName',
					actions: {
						delete: true,
						create: 'flat'
					},
					dataProcessor: [{
						processItem: generateGlobalId
					}, {
						processItem: function (item) {
							if (privateState.hasActiveConsumers()) {
								updateViewerButtonsOnItem(item);
							}
						}
					}],
					presenter: {
						list: {
							initCreationData: function (creationData) {
								actualConfig.initializeCreationData(creationData, 'PKey1');
							},
							handleCreateSucceeded: function (newData) {
								generateGlobalId(newData);
								if (privateState.hasActiveConsumers()) {
									updateViewerButtonsOnItem(newData);
								}
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'ModelAnnotationCameras',
							parentService: actualConfig.parentService
						}
					}
				}
			};

			actualConfig.createHttpCrudSettings('camera', serviceOptions.flatLeafItem);

			const serviceContainer = platformDataServiceFactory.createService(serviceOptions, service);
			const svc = serviceContainer.service;

			const privateState = {
				activeConsumerCount: 0,
				hasActiveConsumers: () => privateState.activeConsumerCount > 0,
				nextNewId: -1,
				generateNewId() {
					return this.nextNewId--;
				}
			};

			svc.canCreateFromViewer = function (viewerInfo) {
				return actualConfig.canCreateForCurrentModel() && viewerInfo && viewerInfo.isReady();
			};

			svc.createFromViewer = function (viewerInfo) {
				return modelAnnotationCameraUtilitiesService.enrichCameraEntityFromView(viewerInfo,
					() => svc.createItem().then(function (newItem) {

						if (newItem.Id <= 0) {
							newItem.Id = privateState.generateNewId();
						}
						newItem.ContextModelId = modelProjectPinnableEntityService.getPinned();

						return newItem;
					})).then(function (newItem) {
					svc.fireItemModified(newItem);
					return newItem;
				});
			};

			svc.addActiveConsumer = function () {
				privateState.activeConsumerCount++;

				if (privateState.activeConsumerCount === 1) {
					modelViewerViewerRegistryService.onViewersChanged.register(updateViewerButtons);
					modelViewerViewerRegistryService.registerViewerReadinessChanged(updateViewerButtons);
					updateViewerButtons();
				}
			};

			svc.removeActiveConsumer = function () {
				privateState.activeConsumerCount--;

				if (privateState.activeConsumerCount === 0) {
					resetViewerButtons();
					modelViewerViewerRegistryService.onViewersChanged.unregister(updateViewerButtons);
					modelViewerViewerRegistryService.unregisterViewerReadinessChanged(updateViewerButtons);
				}
			};

			svc.addActiveConsumerScope = function (scope) {
				svc.addActiveConsumer();
				scope.$on('$destroy', function () {
					svc.removeActiveConsumer();
				});
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

						if (item.HiddenMeshIds) {
							const meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(item.HiddenMeshIds).useSubModelIds();
							bl.includeMeshIds(meshIds);
						}
					}

					if (globalSettings.cuttingPlanes.getValue()) {
						if (Array.isArray(item.ClippingPlanes) && item.ClippingPlanes.length > 0) {
							viewerInfo.setCuttingPlane(item.ClippingPlanes);
							viewerInfo.setCuttingActive();
						} else {
							viewerInfo.setCuttingInactive();
						}
					}

					viewerInfo.showCamPos({
						pos: {
							x: item.PosX,
							y: item.PosY,
							z: item.PosZ
						},
						trg: {
							x: item.PosX + item.DirX,
							y: item.PosY + item.DirY,
							z: item.PosZ + item.DirZ
						}
					});
				} : function showNoCamPos() {
				};

				_.set(item, 'ShowInViewer.actionList', modelViewerViewerRegistryService.createViewerActionButtons({
					disabled: !isRelevantModelShown,
					execute: showCamPos
				}));
				svc.fireItemModified(item);
			}

			function resetViewerButtons() {
				const items = serviceContainer.data.getList();
				if (!_.isEmpty(items)) {
					for (const item of items) {
						item.ShowInViewer = null;
						svc.fireItemModified(item);
					}
				}
			}

			serviceContainer.service.getParentDataService = () => actualConfig.parentService;

			_.assign(svc, globalSettings);

			return serviceContainer.service;
		}

		return {
			createService: createService
		};
	}
})(angular);
