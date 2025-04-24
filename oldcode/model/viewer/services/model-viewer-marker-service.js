/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var modelViewer = 'model.viewer';
	var modelViewerModule = angular.module(modelViewer);

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerMarkerService
	 * @function
	 *
	 * @description Provides access to marker data services specific to a given marker type.
	 */
	modelViewerModule.factory('modelViewerMarkerService', ['_', 'platformDataServiceFactory',
		'modelViewerModelSelectionService', 'PlatformMessenger', 'modelViewerViewerRegistryService',
		'platformDataServiceModificationTrackingExtension', '$http', '$q',
		function (_, platformDataServiceFactory, modelViewerModelSelectionService, PlatformMessenger,
		          modelViewerViewerRegistryService, platformDataServiceModificationTrackingExtension, $http, $q) {
			var service = {};

			service.markerTypes = {
				rfi: {
					id: 1,
					categoryNameKey: 'model.viewer.rfiMarkers'
				},
				defect: {
					id: 2,
					categoryNameKey: 'model.viewer.defectMarkers'
				}
			};

			var state = {
				dataServices: [],
				zoomToViewer: false,
				onZoomToViewerChanged: new PlatformMessenger()
			};

			service.setZoomToViewer = function (newValue) {
				var actualNewValue = !!newValue;
				if (state.zoomToViewer !== actualNewValue) {
					state.zoomToViewer = actualNewValue;
					state.onZoomToViewerChanged.fire();
				}
			};
			service.getZoomToViewer = function () {
				return state.zoomToViewer;
			};

			service.registerZoomToViewerChanged = function (handler) {
				state.onZoomToViewerChanged.register(handler);
			};

			service.unregisterZoomToViewerChanged = function (handler) {
				state.onZoomToViewerChanged.unregister(handler);
			};

			service.createZoomToViewerButton = function (config) {
				var actualConfig = config || {};

				var result = {
					id: 'ZoomToViewer',
					caption: 'model.viewer.zoomToViewer',
					type: 'check',
					iconClass: 'tlb-icons ico-zoom-to',
					value: state.zoomToViewer,
					fn: function (btnId, btn) {
						service.setZoomToViewer(btn.value);
					}
				};

				if (_.isFunction(actualConfig.addFinalizer)) {
					var updateZoomToViewerState = function () {
						result.value = state.zoomToViewer;
						if (_.isFunction(actualConfig.buttonUpdated)) {
							actualConfig.buttonUpdated();
						}
					};

					service.registerZoomToViewerChanged(updateZoomToViewerState);
					actualConfig.addFinalizer(function () {
						service.unregisterZoomToViewerChanged(updateZoomToViewerState);
					});
				}

				return result;
			};

			service.mapMarkerTypes = function (map) {
				return _.map(service.markerTypes, function (mt) {
					return map({
						id: mt.id,
						categoryNameKey: mt.categoryNameKey
					});
				});
			};

			function showMarkerInViewer(marker, viewerInfo) {
				if (marker) {
					viewerInfo.showCamPos({
						pos: {
							x: marker.CameraPositionX,
							y: marker.CameraPositionY,
							z: marker.CameraPositionZ
						},
						trg: {
							x: marker.PositionX,
							y: marker.PositionY,
							z: marker.PositionZ
						}
					});
					return true;
				} else {
					return false;
				}
			}

			service.getDataService = function (markerType, coupleToService, module) {
				var markerTypeId = angular.isObject(markerType) ? markerType.id : markerType;
				var svcInfo = state.dataServices[markerTypeId];
				if (!svcInfo) {
					var svcConfig = {
						module: modelViewerModule,
						serviceName: 'modelViewerMarkerType' + markerTypeId + 'Service',
						entityNameTranslationID: 'model.viewer.marker',
						httpCreate: {
							route: globals.webApiBaseUrl + 'model/main/marker/',
							endCreate: 'createmarker'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'model/main/marker/',
							endRead: 'list',
							initReadData: function (readData) {
								readData.filter = '?modelId=' + modelViewerModelSelectionService.getSelectedModelId() + '&markerTypeId=' + markerTypeId;
							}
						},
						modification: {multi: {}},
						dataProcessor: [{
							processItem: function (item) {
								item.isInitialized = true;
							}
						}],
						actions: {create: 'flat', delete: true},
						entitySelection: {},
						presenter: {
							list: {
								initCreationData: function (creationData) {
									creationData.ModelFk = modelViewerModelSelectionService.getSelectedModelId();
									creationData.MarkerTypeFk = markerTypeId;
								}
							}
						}
					};
					var serviceContainer = platformDataServiceFactory.createNewComplete(svcConfig);
					var service = serviceContainer.service;
					var data = serviceContainer.data;

					service.isMarkerListLoaded = data.itemList.length > 0;
					service.getMarkerListLoaded = function () {
						return service.isMarkerListLoaded;
					};
					service.setMarkerListLoaded = function () {
						service.isMarkerListLoaded = true;
					};

					service.assertSelectedEntityEntry = function assertSelectedEntityEntry(modStorage) {
						var toInsert = {MainItemId: data.parentService.selectedItem.Id};
						if (modStorage) {
							if (!modStorage.MarkerToSave) {
								modStorage.MarkerToSave = [];
							}
							var entry = _.find(modStorage.MarkerToSave, toInsert);
							if (!entry) {
								modStorage.MarkerToSave.push(toInsert);
							} else {
								toInsert = entry;
							}
						}
						return toInsert;
					};

					service.assertTypeEntries = function doAssertTypeEntries(modStorage) {
						if (modStorage) {
							if (!modStorage.MarkerToSave) {
								modStorage.MarkerToSave = [];
							}
						}
					};

					service.addEntityToModified = function addEntityToModified(elemState, entity, modState) {
						var add = false;
						var entry;
						if (!elemState.MarkerToSave) {
							elemState.MarkerToSave = [];
							add = true;
						} else {
							entry = _.find(elemState.MarkerToSave, {Id: entity.Id});//If it is not in already we got null. Not null is true
							add = !entry;
						}
						if (add) {
							var newEntry = entity;
							if (!entry) {
								elemState.MarkerToSave.push(newEntry);
							} else {
								angular.extend(entry, newEntry);
							}
							modState.EntitiesCount += 1;
						}

					};

					service.addEntityToDeleted = function (elemState, entity, data, modState) {
						if (elemState) {
							if (!elemState.MarkerToDelete) {
								elemState.MarkerToDelete = [];
							}
							if (entity) {
								elemState.MarkerToDelete.push(entity);
								modState.EntitiesCount += 1;
							}
						}
					};

					service.deleteItem = function deleteItem(entity) {
						var deleteParams = {};
						deleteParams.entity = entity;
						deleteParams.service = service;
						platformDataServiceModificationTrackingExtension.markAsDeleted(service, entity, data);
						data.doPrepareDelete(deleteParams, data);
						data.onDeleteDone(deleteParams, data, null);
					};

					service.registerListLoaded(service.setMarkerListLoaded);

					svcInfo = {
						service: serviceContainer.service,
						data: serviceContainer.data,
						module: module
					};

					svcInfo.service.isModified = false;

					svcInfo.service.getModule = function getModule() {
						if (!svcInfo.module) {
							return modelViewerModule;
						}
						return svcInfo.module;
					};

					svcInfo.updateEntities = [];
					svcInfo.service.createMarker = function (pos, camPos) {
						return svcInfo.service.createItem().then(function (newMarker) {
							newMarker.PositionX = pos.x;
							newMarker.PositionY = pos.y;
							newMarker.PositionZ = pos.z;
							newMarker.CameraPositionX = camPos.x;
							newMarker.CameraPositionY = camPos.y;
							newMarker.CameraPositionZ = camPos.z;
							newMarker.isInitialized = true;
							svcInfo.service.markItemAsModified(newMarker);
							return newMarker;
						});
					};

					svcInfo.service.modifyMarker = function (id, pos, camPos) {
						var itemList = svcInfo.service.getList();
						var item = _.find(itemList, {Id: id});
						if (item) {
							var isModified = false;
							if (item.PositionX !== pos.x) {
								item.PositionX = pos.x;
								isModified = true;
							}
							if (item.PositionY !== pos.y) {
								item.PositionY = pos.y;
								isModified = true;
							}
							if (item.PositionZ !== pos.z) {
								item.PositionZ = pos.z;
								isModified = true;
							}
							if (item.CameraPositionX !== camPos.x) {
								item.CameraPositionX = camPos.x;
								isModified = true;
							}
							if (item.CameraPositionY !== camPos.y) {
								item.CameraPositionY = camPos.y;
								isModified = true;
							}
							if (item.CameraPositionZ !== camPos.z) {
								item.CameraPositionZ = camPos.z;
								isModified = true;
							}
							svcInfo.service.markItemAsModified(item);

							return item;
						} else {
							return svcInfo.service.createMarker(pos, camPos);
						}
					};

					svcInfo.service.onUpdateDone = function onUpdateDone(updateData) {
						angular.forEach(updateData, function (item) {
							var itemList = svcInfo.service.getList();
							var oldItem = _.find(itemList, {Id: item.Id});
							if (!oldItem || !oldItem.Id) {
								return;
							}
							angular.extend(oldItem, item);
						});
					};

					svcInfo.service.provideUpdateData = function provideUpdateData() {
					};
					svcInfo.service.mergeInUpdateData = function mergeInUpdateData(updateData) {
						svcInfo.service.onUpdateDone(updateData);
					};

					svcInfo.service.parentService = function parentService() {
						return svcInfo.data.parentService;
					};

					svcInfo.highlightedMarkers = [];

					svcInfo.service.setHighlighted = function (ids) {
						var oldHighlight = svcInfo.highlightedMarkers.slice(0);
						if (angular.isNumber(ids)) {
							svcInfo.highlightedMarkers = [ids];
						} else if (angular.isArray(ids)) {
							svcInfo.highlightedMarkers = ids;
						} else {
							svcInfo.highlightedMarkers = [];
						}
						svcInfo.onHighlightChanged.fire(svcInfo.highlightedMarkers.slice(0), oldHighlight);

						if (state.zoomToViewer) {
							var hlMarkers = [];
							_.filter(svcInfo.service.getList(), function (mrk) {
								return !!mrk.isInitialized;
							}).forEach(function (mrk) {
								if (svcInfo.highlightedMarkers.indexOf(mrk.Id) >= 0) {
									hlMarkers.push(mrk);
								}
							});
							if (hlMarkers.length > 0) {
								var wrapper = modelViewerViewerRegistryService.getViewerWrapper();
								try {
									showMarkerInViewer(hlMarkers[0], wrapper);
								} finally {
									wrapper.detach();
								}
							}
						}
					};

					svcInfo.service.getHighlighted = function () {
						return svcInfo.highlightedMarkers.slice(0);
					};

					svcInfo.onHighlightChanged = new PlatformMessenger();
					svcInfo.service.registerHighlightChanged = function (handler) {
						svcInfo.onHighlightChanged.register(handler);
					};
					svcInfo.service.unregisterHighlightChanged = function (handler) {
						svcInfo.onHighlightChanged.unregister(handler);
					};

					svcInfo.service.showInViewer = function (id, viewerInfo) {
						var mrk = _.find(svcInfo.service.getList(), {Id: id});
						return showMarkerInViewer(mrk, viewerInfo);
					};

					svcInfo.updateParentSelection = function () {
						var selItem = svcInfo.data.parentService ? svcInfo.data.parentService.getSelected() : null;
						if (selItem) {
							if (selItem.ModelFk === modelViewerModelSelectionService.getSelectedModelId()) {
								if (selItem.MarkerFk) {
									svcInfo.service.setHighlighted([selItem.MarkerFk]);
									return;
								}
							}
						}
						svcInfo.service.setHighlighted([]);
					};

					svcInfo.service.getColorInfo = function getColorInfo() {
						if (svcInfo.data.markerColorInfo) {
							return $q.when(svcInfo.data.markerColorInfo);
						} else {
							return $http.get(globals.webApiBaseUrl + 'model/main/marker/getcolorinfo?markerTypeFk=' + markerTypeId).then(function (response) {
								if (_.isObject(response.data)) {
									return response.data;
								} else {
									return {};
								}
							}, function () {
								return {};
							}).then(function (info) {
								return _.assign({
									MarkerColor: 0xBBBBBB,
									HighlightColor: 0xFFFF00
								}, info);
							});
						}
					};

					state.dataServices[markerTypeId] = svcInfo;
					svcInfo.service.load();
				}

				if (coupleToService) {
					if (svcInfo.data.parentService) {
						svcInfo.data.parentService.unregisterSelectionChanged(svcInfo.updateParentSelection);
					}
					svcInfo.data.parentService = coupleToService;
					svcInfo.data.parentService.registerSelectionChanged(svcInfo.updateParentSelection);
					svcInfo.updateParentSelection();
				}

				if (module) {
					svcInfo.module = module;
				}

				return svcInfo.service;
			};

			function updateSelectedModel() {
				var selectedModelId = modelViewerModelSelectionService.getSelectedModelId();
				Object.keys(state.dataServices).forEach(function (svcName) {
					var svc = state.dataServices[svcName];
					if (selectedModelId) {
						svc.service.load();
					} else {
						svc.service.setList([]);
					}
				});
			}

			modelViewerModelSelectionService.onSelectedModelChanged.register(updateSelectedModel);

			return service;
		}]);
})(angular);
