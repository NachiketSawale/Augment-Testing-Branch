/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const modelAnnotationModule = angular.module('model.annotation');

	/**
	 * @ngdoc service
	 * @name modelAnnotationDataService
	 * @function
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	modelAnnotationModule.factory('modelAnnotationDataService',
		modelAnnotationDataService);

	modelAnnotationDataService.$inject = ['_', '$injector', 'platformDataServiceFactory',
		'modelProjectPinnableEntityService', 'platformRuntimeDataService',
		'modelAnnotationTypes', 'PlatformMessenger', 'platformObservableService',
		'modelViewerToggleObjectSelectionHelperService', '$http', 'modelViewerViewerRegistryService',
		'modelViewerModelIdSetService', 'ServiceDataProcessDatesExtension', 'modelMeasurementOverlayDataService',
		'cloudDesktopPinningContextService', 'cloudDesktopSidebarService'];

	function modelAnnotationDataService(_, $injector, platformDataServiceFactory,
		modelProjectPinnableEntityService, platformRuntimeDataService,
		modelAnnotationTypes, PlatformMessenger, platformObservableService,
		modelViewerToggleObjectSelectionHelperService, $http, modelViewerViewerRegistryService,
		modelViewerModelIdSetService, ServiceDataProcessDatesExtension, modelMeasurementOverlayDataService,
		cloudDesktopPinningContextService, cloudDesktopSidebarService) {

		let modelAnnotationMarkerDisplayService = null;

		const serviceOptions = {
			flatRootItem: {
				module: modelAnnotationModule,
				serviceName: 'modelAnnotationDataService',
				entityNameTranslationID: 'model.annotation.modelAnnotationEntityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/annotation/',
					endRead: 'filtered',
					usePostForRead: true
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.PKey1 = modelProjectPinnableEntityService.getPinned();
						}
					}
				},
				entityRole: {
					root: {
						codeField: null,
						descField: 'DescriptionInfo.Translated',
						itemName: 'ModelAnnotations',
						moduleName: 'cloud.desktop.moduleDisplayNameModelAnnotation',
						mainItemName: 'ModelAnnotation',
						handleUpdateDone: function (updateData, response) {
							if (response.ModelAnnotations) {
								if (!modelAnnotationMarkerDisplayService) {
									modelAnnotationMarkerDisplayService = $injector.get('modelAnnotationMarkerDisplayService');
								}

								modelAnnotationMarkerDisplayService.updateAnnotation(response.ModelAnnotations.Id);
							}

							serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
						}
					}
				},
				actions: {
					create: 'flat',
					delete: true,
					canCreateCallBackFunc: () => _.isInteger(modelProjectPinnableEntityService.getPinned()),
					canDeleteCallBackFunc: item => item.RawType === 0
				},
				dataProcessor: [{
					processItem: function (item) {
						if (_.isInteger(item.EffectiveCategoryFk)) {
							var categoryPrefix = 11;
							item.EffectiveCategoryFk = item.RawType+''+item.EffectiveCategoryFk;
							item.EffectiveCategoryFk = parseInt(categoryPrefix+item.EffectiveCategoryFk);
						}
					},
					revertProcessItem: function (item) {
						let removedPref = Number(item.EffectiveCategoryFk.toString().slice('2'));
						item.EffectiveCategoryFk = Number(removedPref.toString().replace(item.RawType, '')); 
					}
				}, {
					processItem: updateAnnotationByType
				}, new ServiceDataProcessDatesExtension(['DueDate'])],
				sidebarSearch: {
					options: {
						moduleName: 'model.annotation',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: false,
						showOptions: true,
						pinningOptions: {
							isActive: true,
							showPinningContext: [{token: 'project.main', show: true}, {token: 'model.main', show: true}],
							setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext,
							setModelContextCallback:setModelPinningContext,
							disableModelContextBtnCallback:function (selected) {
								return selected.ModelFk <= 0;
							},
						},
						showProjectContext: false,
						withExecutionHints: false
					}
				},
				filterByViewer: true
			}
		};

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

		const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

		function updateAnnotationByType(item) {
			const isDefectAnnotation = _.get(modelAnnotationTypes.byId[item.RawType], 'code') === 'Defect';
			const isRfIAnnotation = _.get(modelAnnotationTypes.byId[item.RawType], 'code') === 'RfI';
			const isMeasurementAnnotation = _.get(modelAnnotationTypes.byId[item.RawType], 'code') === 'Measurement';

			const fields = [{
				field: 'InfoRequestFk',
				readonly: isRfIAnnotation
			}, {
				field: 'DefectFk',
				readonly: isDefectAnnotation
			}, {
				field: 'EffectiveCategoryFk',
				readonly: isMeasurementAnnotation
			}];

			platformRuntimeDataService.readonly(item, fields);
		}

		function updateItemDisabledStates(item) {
			let fields = [];
			if (_.isNil(item.ClerkFk) && _.isNil(item.BusinessPartnerFk)) {
				fields.push({field: 'ClerkFk', readonly: false});
				fields.push({field: 'BusinessPartnerFk', readonly: false});
				fields.push({field: 'SubsidiaryFk', readonly: false});
				fields.push({field: 'ContactFk', readonly: false});
			}
			if (_.isInteger(item.ClerkFk)) {
				fields = [];
				fields.push({field: 'ClerkFk', readonly: false});
				fields.push({field: 'BusinessPartnerFk', readonly: true});
				fields.push({field: 'SubsidiaryFk', readonly: true});
				fields.push({field: 'ContactFk', readonly: true});
			}
			if (_.isInteger(item.BusinessPartnerFk)) {
				fields = [];
				fields.push({field: 'ClerkFk', readonly: true});
			}
			platformRuntimeDataService.readonly(item, fields);
		}

		function setModelPinningContext(dataService) {
			return cloudDesktopPinningContextService.setCurrentModelToPinnningContext(dataService, 'ModelFk', 'ProjectFk');
		}

		serviceContainer.service.selectAnnotationEntity = function selectAnnotationEntity(id) {
			const result = this.getList();
			const selected = _.find(result, (entity) => {
				return entity.Id === id;
			});
			if (selected) {
				this.setSelected(selected);
			}
		};

		serviceContainer.service.registerItemModified(function (skip, item) {
			updateItemDisabledStates(item);
		});

		serviceContainer.service.updateAnnotationByType = updateAnnotationByType;
		serviceContainer.service.updateItemDisabledStates = updateItemDisabledStates;

		serviceContainer.service.addItem = function (newItem) {
			if (Array.isArray(serviceContainer.data.itemList)) {
				serviceContainer.data.itemList.push(newItem);
				serviceContainer.service.gridRefresh();
			}
		};

		const onItemsDeleted = new PlatformMessenger();

		serviceContainer.service.registerItemsDeleted = function (handler) {
			onItemsDeleted.register(handler);
		};

		serviceContainer.service.unregisterItemsDeleted = function (handler) {
			onItemsDeleted.unregister(handler);
		};

		serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
			if (deleteParams.entity) {			
				let removedPref = Number(deleteParams.entity.EffectiveCategoryFk.toString().slice('2'));
				deleteParams.entity.EffectiveCategoryFk = Number(removedPref.toString().replace(deleteParams.entity.RawType, '')); 
			}
		};

		const originalOnDeleteDone = serviceContainer.data.onDeleteDone;
		serviceContainer.data.onDeleteDone = function (deleteParams) {
			const delItems = Array.isArray(deleteParams.entities) ? deleteParams.entities : [deleteParams.entity];
			onItemsDeleted.fire(delItems);

			return originalOnDeleteDone.apply(this, arguments);
		};

		serviceContainer.service.retrieveModelObjectIds = function (info) {
			return $http.get(globals.webApiBaseUrl + 'model/annotation/objlink/idsbyannotation', {
				params: {
					annotationIds: _.join(_.map(info.items, a => a.Id), ':'),
					modelId: info.modelId
				}
			}).then(r => r.data);
		};

		serviceContainer.service.registerSelectionChanged(function (e, entity) {
			const viewer = modelViewerViewerRegistryService.getViewers();

			if (viewer && entity.DefaultCameraEntity) {
				_.forEach(viewer, function (v) {
					if (!v.isReady()) {
						return;
					}

					v.showCamPos({
						pos: {
							x: entity.DefaultCameraEntity.PosX,
							y: entity.DefaultCameraEntity.PosY,
							z: entity.DefaultCameraEntity.PosZ
						},
						trg: {
							x: entity.DefaultCameraEntity.PosX + entity.DefaultCameraEntity.DirX,
							y: entity.DefaultCameraEntity.PosY + entity.DefaultCameraEntity.DirY,
							z: entity.DefaultCameraEntity.PosZ + entity.DefaultCameraEntity.DirZ
						}
					});
					if (globalSettings.overwriteBlacklist.getValue()) {
						const bl = v.getFilterEngine().getBlacklist();
						bl.excludeAll();

						if (entity.DefaultCameraEntity.HiddenMeshIds) {
							const meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(entity.DefaultCameraEntity.HiddenMeshIds).useSubModelIds();
							bl.includeMeshIds(meshIds);
						}
					}
					if (globalSettings.cuttingPlanes.getValue()) {
						if (Array.isArray(entity.DefaultCameraEntity.ClippingPlanes) && entity.DefaultCameraEntity.ClippingPlanes.length > 0) {
							v.setCuttingPlane(entity.DefaultCameraEntity.ClippingPlanes);
							v.setCuttingActive();
						} else {
							v.setCuttingInactive();
						}
					}
				});
			}

			if (entity.MeasurementFk) {
				return $http.get(globals.webApiBaseUrl + 'model/measurement/byMeasurement/', {
					params: {
						measurementFk: entity.MeasurementFk,
					}
				}).then(function (response) {
					//overlay-data-service showSelectedAnno
					modelMeasurementOverlayDataService.showSelectedMeasurement(response.data);
				});
			}
		});

		function selectAfterNavigation(item, triggerField) {
			if (item && triggerField && triggerField === 'Ids'){
				const ids = item.Ids.split(',').map(e => parseInt(e));
				cloudDesktopSidebarService.filterSearchFromPKeys(ids);
			}
		}
		serviceContainer.service.selectAfterNavigation = selectAfterNavigation;

		modelViewerToggleObjectSelectionHelperService.initializeObservable({
			dataService: serviceContainer.service,
			titleKey: 'model.annotation.selectObjects',
			initialValue: true
		});

		return serviceContainer.service;
	}
})(angular);
