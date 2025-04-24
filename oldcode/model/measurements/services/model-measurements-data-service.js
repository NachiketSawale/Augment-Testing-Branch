/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const modelMeasurementsModule = angular.module('model.measurements');

	/**
	 * @ngdoc service
	 * @name modelMeasurementDataService
	 * @function
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	modelMeasurementsModule.factory('modelMeasurementDataService',
		modelMeasurementDataService);

	modelMeasurementDataService.$inject = ['_', '$injector', 'platformDataServiceFactory',
		'modelProjectPinnableEntityService', 'platformRuntimeDataService', 'PlatformMessenger', 'modelMeasurementTypes', 'modelViewerViewerRegistryService',
		'modelViewerModelSelectionService', '$timeout', '$translate', 'platformTranslateService', 'platformModalFormConfigService', '$http', '$q', 'modelAnnotationCameraUtilitiesService',
		'platformObservableService', 'modelViewerModelIdSetService', 'modelMeasurementGroupFilterService', 'modelViewerStandardFilterService', 'modelWdeViewerIgeService', 'basicsLookupdataLookupDescriptorService',
	   'cloudDesktopSidebarService'];

	function modelMeasurementDataService(_, $injector, platformDataServiceFactory,
		modelProjectPinnableEntityService, platformRuntimeDataService, PlatformMessenger, modelMeasurementTypes, modelViewerViewerRegistryService,
		modelViewerModelSelectionService, $timeout, $translate, platformTranslateService, platformModalFormConfigService, $http, $q, modelAnnotationCameraUtilitiesService,
		platformObservableService, modelViewerModelIdSetService, modelMeasurementGroupFilterService, modelViewerStandardFilterService, modelWdeViewerIgeService, basicsLookupdataLookupDescriptorService,
		cloudDesktopSidebarService) {

		let modelMeasurementOverlayDataService = null;

		const serviceOptions = {
			flatRootItem: {
				module: modelMeasurementsModule,
				serviceName: 'modelMeasurementDataService',
				entityNameTranslationID: 'model.measurements.modelMeasurementEntityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/measurement/',
					endRead: 'filtered',
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						const groupItems = modelMeasurementGroupFilterService.getFilter();
						const furtherFilters = [];
						const pinnedModelId = modelViewerModelSelectionService.getSelectedModelId();

						if (pinnedModelId) {
							furtherFilters.push({
								Token: 'MDL_MODEL',
								Value: pinnedModelId
							});
						}

						if (groupItems) {
							_.map(groupItems, function (value) {
								furtherFilters.push({
									Token: 'MDL_MEASUREMENT_GROUP',
									Value: value
								});
							});
						}

						if (furtherFilters.length > 0) {
							filterRequest.furtherFilters = furtherFilters;
						}
					},
					usePostForRead: true
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.PKey1 = modelProjectPinnableEntityService.getPinned();
						},
						incorporateDataRead: function incorporateDataRead(readData, data) {
							if (!modelMeasurementOverlayDataService) {
								modelMeasurementOverlayDataService = $injector.get('modelMeasurementOverlayDataService');
							}
							const pinnedModelId = modelViewerModelSelectionService.getSelectedModelId();
							 modelMeasurementOverlayDataService.clearAllMeasurements();
							if (pinnedModelId && Array.isArray(readData.dtos) && readData.dtos.length > 0) {
								const measurements = readData.dtos.map(me => {
									const measurement = (function createMeasurement () {
										switch (me.Type) {
											case 10:
												return new modelMeasurementOverlayDataService.types.StraightDistance();
											case 20:
												return new modelMeasurementOverlayDataService.types.Perimeter();
											case 30:
												return new modelMeasurementOverlayDataService.types.Area();
											case 40:
												return new modelMeasurementOverlayDataService.types.Volume();
											case 0:
												return new modelMeasurementOverlayDataService.types.UnknownMeasurement();
										}
									})();

									measurement.points = me.MdlMeasurementPointEntities.map(pe => {
										return {
											x: pe.PosX,
											y: pe.PosY,
											z: pe.PosZ
										};
									});

									measurement.color = me.Color;
									measurement.value = me.Value;

									/*switch (me.Type) {
										case 10:
											measurement.value = me.Value;
											measurement.displayMeasurement = 'L = ' + me.Value.toFixed(2) + 'm';
											break;
										case 20:
											measurement.value = me.Value;
											measurement.displayMeasurement = 'P = ' + me.Value.toFixed(2) + 'm';
											break;
										case 30:
											measurement.value = me.Value;
											measurement.displayMeasurement = 'A = ' + me.Value.toFixed(2) + 'm²';
											break;
										case 40:
											measurement.value = me.Value;
											measurement.displayMeasurement = 'V = ' + me.Value.toFixed(2) + 'm³';
											break;
									}*/

									measurement.isCompleted = true;

									return measurement;
								});

								if (measurements) {
									const request = measurements.map(obj => ({
										Id: obj.id,
										Value: obj.value,
										MeasurementType: obj.type,
										TargetUomFk: obj.UomFk
									}));
									$http.post(globals.webApiBaseUrl + 'model/measurement/formatvalues', request).then(function (response) {
										let matchingMeasurements = [];
										response.data.forEach(item => {
											const matchingMeasurement = measurements.find(measurement => measurement.id === item.Id);
											const result = item.FormattedValue;
											const splitResult = result.split(' ');
											const decimalPart = parseFloat(splitResult[0]);

											if (matchingMeasurement) {
												matchingMeasurement.value = decimalPart;
												matchingMeasurement.Uom = item.Uom;
												switch (matchingMeasurement.type) {
													case 10:
														matchingMeasurement.displayMeasurement = 'L = ' + item.FormattedValue;
														break;
													case 20:
														matchingMeasurement.displayMeasurement = 'P = ' + item.FormattedValue;
														break;
													case 30:
														matchingMeasurement.displayMeasurement = 'A = ' + item.FormattedValue;
														break;
													case 40:
														matchingMeasurement.displayMeasurement = 'V = ' + item.FormattedValue;
														break;
													case 0:
														matchingMeasurement.displayMeasurement = 'U' + item.FormattedValue;
														break;
												}
											}
											matchingMeasurements.push(matchingMeasurement);
										});
										triggerDataChangedCallbacks();
										modelMeasurementOverlayDataService.addMeasurements(matchingMeasurements);
									});
								}

								//modelMeasurementOverlayDataService.addMeasurements(measurements);
							}

							return data.handleReadSucceeded(readData, data);
						}
					},
					handleCreateSucceeded: function (newData) {
						return newData;
					}
				},
				entityRole: {
					root: {
						codeField: null,
						descField: 'DescriptionInfo.Translated',
						itemName: 'ModelMeasurements',
						moduleName: 'cloud.desktop.moduleDisplayNameModelMeasurements',
						mainItemName: 'ModelMeasurements',
						handleUpdateDone: function (updateData, response) {
							//onItemCreated.fire(updateData);
							serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);

						}
					}
				},
				actions: {
					create: 'flat',
					delete: true,
					canCreateCallBackFunc: function () {
						const selected = serviceContainer.service.getSelected();
						return selected && selected.Id > 0;
					},
					canDeleteCallBackFunc: function () {
						const selected = serviceContainer.service.getSelected();
						return selected && selected.Id > 0;
					}
				},
				dataProcessor: [{
					processItem: function (item) {
						item.ModelFk;
						item.DescriptionInfo.Translated;
						item.Code;
						item.Type;
						item.Value;
						item.MdlMeasurementPointEntities;
					},
					revertProcessItem: function (item) {
						item.ModelFk;
						item.DescriptionInfo.Translated;
						item.Code;
						item.Type;
						item.Value;
						item.MdlMeasurementPointEntities;
					}
				}],
				sidebarSearch: {
					options: {
						moduleName: 'model.measurements',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: false,
						showOptions: true,
						pinningOptions: {
							isActive: true,
							showPinningContext: [
								{token: 'project.main', show: true},
								{token: 'model.main', show: true}
							]
						},
						showProjectContext: false,
						withExecutionHints: false
					}
				},
				filterByViewer: true
			}
		};

		let filteredItemsList = [];

		let modelMeasurementPointDataService = null;

		const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

		const onItemsDeleted = new PlatformMessenger();

		const onItemCreated = new PlatformMessenger();

		const onItemModified = new PlatformMessenger();

		const onDataChangedCallbacks = [];

		function triggerDataChangedCallbacks() {
			onDataChangedCallbacks.forEach(callback => {
				callback();
			});
		}

		function onDataChanged(callback) {
			onDataChangedCallbacks.push(callback);
		}

		function getData() {
			return serviceContainer.data.itemList;
		}

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

		serviceContainer.service.addItem = function (measurement, viewRecord) {
			const newMeasurementSettings = {
				Description: '',
				Code: '',
				Type: modelMeasurementTypes.byCode[measurement.name],
				Value: measurement.value
			};
			const dlgConfig = {
				viewerInfo: viewRecord.info,
				title: $translate.instant('model.measurements.quickCreate.title'),
				dataItem: newMeasurementSettings,
				formConfiguration: {
					fid: 'model.measurements.quickcreate',
					showGrouping: false,
					groups: [{
						gid: 'default'
					}],
					rows: [{
						gid: 'default',
						rid: 'code',
						label$tr$: 'model.measurements.code',
						model: 'Code',
						type: 'code',
						maxLength: 42
					}, {
						gid: 'default',
						rid: 'desc',
						label$tr$: 'cloud.common.entityDescription',
						model: 'Description',
						type: 'description',
						maxLength: 42
					}, {
						gid: 'default',
						rid: 'color',
						label$tr$: 'model.measurements.color',
						model: 'Color',
						type: 'color',
						options: {
							showClearButton: true
						}
					}, {
						gid: 'default',
						rid: 'type',
						label$tr$: 'model.measurements.type',
						model: 'Type',
						type: 'imageselect',
						options: {
							serviceName: 'modelMeasurementTypeIconService',
						},
						change: function (item) {
							item.Type = modelMeasurementTypes.byCode[measurement.name];
						},
						readonly: true
					}, {
						gid: 'default',
						rid: 'value',
						label$tr$: 'model.measurements.value',
						model: 'Value',
						type: 'description',
						readonly: true
					}]
				},
				dialogOptions: {
					disableOkButton: function disableOkButton() {
						return !newMeasurementSettings.Code;
					}
				},
			};

			//Show Dialog
			platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
			platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
				if (result.ok) {
					const resultData = {
						Measurement: {
							ModelFk : modelProjectPinnableEntityService.getPinned(),
							DescriptionInfo : {
								Translated: result.data.Description,
							},
							Code : result.data.Code,
							Type : modelMeasurementTypes.byCode[measurement.name],
							Color : result.data.Color,
							Value : measurement.value,
							MdlMeasurementPointEntities : _.map(measurement.points, function (item) {
								return {
									PosX: item.x,
									PosY: item.y,
									PosZ: item.z
								};
							}),
						}
					};
					let resultPromise = $q.when(resultData);

					resultPromise = resultPromise.then(function (resultData) {
						resultData.Measurement.Camera = {};
						if (!modelAnnotationCameraUtilitiesService) {
							modelAnnotationCameraUtilitiesService = $injector.get('modelAnnotationCameraUtilitiesService');
						}
						return modelAnnotationCameraUtilitiesService.enrichCameraEntityFromView(dlgConfig.viewerInfo, resultData.Measurement.Camera)
							.then(() => resultData);
					});

					return resultPromise.then(function () {
						return $http.post(globals.webApiBaseUrl + 'model/measurement/quickcreate', resultData).then(function (response) {
							serviceContainer.data.itemList.push(response.data);
							serviceContainer.service.selectMeasurementEntity(response.data.Id);
							serviceContainer.service.gridRefresh();
						});
					});
				}
			});
		};

		serviceContainer.service.selectMeasurementEntity = function selectMeasurementEntity(id) {
			const result = this.getList();
			const selected = _.find(result, (entity) => {
				return entity.Id === id;
			});
			if (selected) {
				this.setSelected(selected);
			}
		};

		serviceContainer.service.registerSelectionChanged(function (e, entity) {
			const viewer = modelViewerViewerRegistryService.getViewers();
			if (entity.Id) {
				return $http.get(globals.webApiBaseUrl + 'model/annotation/listbymeasurement?measurementId=' + entity.Id).then(function (response) {
					if (viewer && response.data.length && response.data[0].DefaultCameraEntity) {
						_.forEach(viewer, function (v) {
							if (!v.isReady()) {
								return;
							}

							v.showCamPos({
								pos: {
									x: response.data[0].DefaultCameraEntity.PosX,
									y: response.data[0].DefaultCameraEntity.PosY,
									z: response.data[0].DefaultCameraEntity.PosZ
								},
								trg: {
									x: response.data[0].DefaultCameraEntity.PosX + response.data[0].DefaultCameraEntity.DirX,
									y: response.data[0].DefaultCameraEntity.PosY + response.data[0].DefaultCameraEntity.DirY,
									z: response.data[0].DefaultCameraEntity.PosZ + response.data[0].DefaultCameraEntity.DirZ
								}
							});
							if (globalSettings.overwriteBlacklist.getValue()) {
								const bl = v.getFilterEngine().getBlacklist();
								bl.excludeAll();

								if (response.data[0].DefaultCameraEntity.HiddenMeshIds) {
									const meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data[0].DefaultCameraEntity.HiddenMeshIds).useSubModelIds();
									bl.includeMeshIds(meshIds);
								}
							}
							if (globalSettings.cuttingPlanes.getValue()) {
								if (Array.isArray(response.data[0].DefaultCameraEntity.ClippingPlanes) && response.data[0].DefaultCameraEntity.ClippingPlanes.length > 0) {
									v.setCuttingPlane(response.data[0].DefaultCameraEntity.ClippingPlanes);
									v.setCuttingActive();
								} else {
									v.setCuttingInactive();
								}
							}
						});
					}
				});
			}
		});

		serviceContainer.service.registerItemCreated = function (handler) {
			onItemCreated.register(handler);
		};

		serviceContainer.service.unregisterItemCreated = function (handler) {
			onItemCreated.register(handler);
		};

		serviceContainer.service.registerItemModified = function (handler) {
			onItemModified.register(handler);
		};

		serviceContainer.service.unregisterItemModified = function (handler) {
			onItemModified.register(handler);
		};

		serviceContainer.service.registerItemsDeleted = function (handler) {
			onItemsDeleted.register(handler);
		};

		serviceContainer.service.unregisterItemsDeleted = function (handler) {
			onItemsDeleted.unregister(handler);
		};

		const originalOnDeleteDone = serviceContainer.data.onDeleteDone;
		serviceContainer.data.onDeleteDone = function (deleteParams) {
			const delItems = Array.isArray(deleteParams.entities) ? deleteParams.entities : [deleteParams.entity];
			onItemsDeleted.fire(delItems);

			return originalOnDeleteDone.apply(this, arguments);
		};

		//const service = serviceContainer.service;

		// Cameras can be created as long as there is a selected model.
		// Replacing this method right on the service object circumvents the default behaviour
		// of allowing creation only when something is selected in the parent data service.
		serviceContainer.service.canCreate = function () {
			return Boolean(modelViewerModelSelectionService.getSelectedModelId());
		};

		serviceContainer.service.getFilteredList = function () {
			return filteredItemsList;
		};

		function selectAfterNavigation(item, triggerField) {
			if (item && triggerField && triggerField === 'Ids'){
				const ids = item.Ids.split(',').map(e => parseInt(e));
				cloudDesktopSidebarService.filterSearchFromPKeys(ids)
			}
		}

		serviceContainer.service.selectAfterNavigation = selectAfterNavigation;

		serviceContainer.service.setFilteredList = function (data) {
			filteredItemsList = [];

			const list = serviceContainer.service.getList();
			if (list.length > 0) {
				data.filteredItems.forEach(function (value, key) {
					const item = _.find(list, {IdString: key});
					if (item && item.Id) {
						filteredItemsList.push({'MeasurementId': item.MeasurementFk});
					}
				});
			}
		};

		// snycronize viewer with list from object container
		serviceContainer.service.syncViewer = function syncViewer() {
			modelViewerStandardFilterService.updateMainEntityFilter();
		};

		return serviceContainer.service;
	}
})(angular);
