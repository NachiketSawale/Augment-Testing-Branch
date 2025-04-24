/**
 * $Id: model-main-viewpoint-data-service-factory.js$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const myModule = angular.module('model.main');
	const svcName = 'modelMainViewpointDataServiceFactory';

	myModule.factory(svcName, modelMainViewpointDataServiceFactory);

	modelMainViewpointDataServiceFactory.$inject = ['_', '$http', '$injector', 'modelMainObjectDataService',
		'platformDataServiceFactory', 'modelViewerModelSelectionService',
		'modelViewerViewerRegistryService', 'modelViewerModelIdSetService', 'modelAnnotationDataServiceFactoryHelperService'];

	function modelMainViewpointDataServiceFactory(_, $http, $injector, modelMainObjectDataService,
		platformDataServiceFactory, modelViewerModelSelectionService,
		modelViewerViewerRegistryService, modelViewerModelIdSetService, modelAnnotationDataServiceFactoryHelperService) {

		function createService(config) {
			const actualConfig = modelAnnotationDataServiceFactoryHelperService.normalizeConfig(config);

			const serviceOptions = {
				flatLeafItem: {
					module: actualConfig.getModule(),
					serviceName: actualConfig.serviceName,
					entityNameTranslationID: 'model.main.viewpointEntityName',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'model/main/viewpoint/',
						endRead: 'byModel',
						initReadData: function (readData) {
							const selModelId = modelViewerModelSelectionService.getSelectedModelId() || -1;
							readData.filter = `?modelId=${selModelId}&includeCamera=true`;
						}
					},
					modification: {},
					entityRole: {
						node: {
							itemName: 'ModelViewpoints',
							parentService: actualConfig.parentService
						}
					},
					dataProcessor: [{
						processItem: function (item) {
							updateNormalizedId(item);
							updateViewerButtonsOnItem(item);
						}
					}],
					actions: {
						create: 'flat',
						delete: true
					}, presenter: {
						list: {
							initCreationData: function (creationData) {
								creationData.PKey1 = modelViewerModelSelectionService.getSelectedModelId();
							},
							handleCreateSucceeded: function (newData) {
								updateNormalizedId(newData);
								updateViewerButtonsOnItem(newData);
							}
						}
					}
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			//container.data.newEntityValidator = fieldsValidatorFactory.createValidator('projectInfoRequestValidationService', 'Code');
			const svc = serviceContainer.service;

			// Viewpoints can be created as long as there is a selected model.
			// Replacing this method right on the service object circumvents the default behaviour
			// of allowing creation only when something is selected in the parent data service.
			svc.canCreate = function () {
				return Boolean(modelViewerModelSelectionService.getSelectedModelId());
			};

			svc.createMenuItems = function (getViewerInfoFunc, restrictToImportant) {
				const selModelId = modelViewerModelSelectionService.getSelectedModelId() || -1;

				return $http.get(globals.webApiBaseUrl + 'model/main/viewpoint/byModel', {
					params: {
						modelId: selModelId,
						includeCamera: true,
						restrictToImportant: restrictToImportant
					}
				}).then(function (response) {
					if (Array.isArray(response.data)) {
						return response.data.map(item => {
							return {
								id: 'camPos-' + item.Id,
								caption: item.Description,
								fn: function () {
									showCamPos(item.Camera, getViewerInfoFunc().info);
								},
								scopeLevel: item.Scope
							};
						});
					}

					return [];
				});
			};

			let modelAnnotationCameraUtilitiesService = null;

			svc.createFromViewer = function (viewerInfo) {
				if (!modelAnnotationCameraUtilitiesService) {
					modelAnnotationCameraUtilitiesService = $injector.get('modelAnnotationCameraUtilitiesService');
				}

				return svc.createItem().then(function (newViewpoint) {
					newViewpoint.Camera = {};
					return modelAnnotationCameraUtilitiesService.enrichCameraEntityFromView(viewerInfo,
						newViewpoint.Camera).then(() => newViewpoint);
				});
			};

			function updateViewerButtons() {
				const items = serviceContainer.data.getList();
				if (!_.isEmpty(items)) {
					items.forEach(updateViewerButtonsOnItem);
				}
			}

			function showCamPos(camera, viewerInfo) {
				// overwrite blacklist
				{
					const bl = viewerInfo.getFilterEngine().getBlacklist();
					bl.excludeAll();

					if (camera.HiddenMeshIds) {
						const meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(camera.HiddenMeshIds).useSubModelIds();
						bl.includeMeshIds(meshIds);
					}
				}

				// cutting planes
				{
					if (Array.isArray(camera.ClippingPlanes) && camera.ClippingPlanes.length > 0) {
						viewerInfo.setCuttingPlane(camera.ClippingPlanes);
						viewerInfo.setCuttingActive();
					} else {
						viewerInfo.setCuttingInactive();
					}
				}

				viewerInfo.showCamPos({
					pos: {
						x: camera.PosX,
						y: camera.PosY,
						z: camera.PosZ
					},
					trg: {
						x: camera.PosX + camera.DirX,
						y: camera.PosY + camera.DirY,
						z: camera.PosZ + camera.DirZ
					}
				});
			}

			function updateViewerButtonsOnItem(item) {
				const selModel = modelViewerModelSelectionService.getSelectedModel();
				const isRelevantModelShown = selModel && selModel.isGlobalModelIdIncluded(item.ModelFk);

				const camera = item.Camera;
				if (camera) {
					const doShowCamPos = isRelevantModelShown ? function showModelCamPos(viewerInfo) {
						return showCamPos(camera, viewerInfo);
					} : function showNoCamPos() {
					};

					_.set(item, 'ShowInViewer.actionList', modelViewerViewerRegistryService.createViewerActionButtons({
						disabled: !isRelevantModelShown,
						execute: doShowCamPos
					}));
				} else {
					_.set(item, 'ShowInViewer.actionList', null);
				}

				svc.fireItemModified(item);
			}

			svc.addItem = function (newItem) {
				if (Array.isArray(serviceContainer.data.itemList)) {
					serviceContainer.data.itemList.push(newItem);
					serviceContainer.service.gridRefresh();
					updateViewerButtonsOnItem(newItem);
				}
			};

			function updateNormalizedId(item) {
				item.NormalizedId = item.Id > 0 ? `vp${item.Id}` : `cp${item.ModelFk}/${item.LegacyId}`;
			}

			modelViewerViewerRegistryService.onViewersChanged.register(updateViewerButtons);
			modelViewerViewerRegistryService.registerViewerReadinessChanged(updateViewerButtons);
			updateViewerButtons();

			return serviceContainer.service;
		}

		return {
			createService: createService
		};
	}

})(angular);


