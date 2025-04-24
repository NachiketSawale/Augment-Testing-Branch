/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListModelObjectDataService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('hsqeCheckListModelObjectDataService', ['$http', '$injector', 'platformDataServiceFactory', 'hsqeCheckListDataService',
		'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService', 'platformObservableService', 'modelViewerModelSelectionService',
		'modelViewerModelIdSetService', 'modelViewerCompositeModelObjectSelectionService', 'cloudDesktopPinningContextService',
		function ($http, $injector, platformDataServiceFactory, parentService,
			basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService, platformObservableService, modelViewerModelSelectionService,
			modelViewerModelIdSetService, modelViewerCompositeModelObjectSelectionService, cloudDesktopPinningContextService) {
			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'hsqeCheckListModelObjectDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/modelannotationobject/',
						endRead: 'listbyfilter',
						initReadData: function (readData) {
							let mainItem = parentService.getSelected();
							let modelId = getModelId();
							readData.filter = '?checkListId=' + mainItem.Id + (modelId === null ? '' : '&modelId=' + getModelId());
						}
					},
					httpCreate: {route: globals.webApiBaseUrl + 'hsqe/checklist/modelannotationobject/', endCreate: 'createdto'},
					httpUpdate: {route: globals.webApiBaseUrl + 'hsqe/checklist/modelannotationobject/', endUpdate: 'updatedto'},
					httpDelete: {route: globals.webApiBaseUrl + 'hsqe/checklist/modelannotationobject/', endDelete: 'deletedto'},
					entityRole: {
						leaf: {
							itemName: 'ModelAnnotationObjectLinks',
							parentService: parentService
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var main = readData;
								if (parentService.ModelObjects && parentService.ModelObjects.length > 0) {
									angular.forEach(main, function (item) {
										var modelObjectItem = _.find(parentService.ModelObjects, {Id: item.MdlObjectFk});
										if (modelObjectItem) {
											item.MeshId = modelObjectItem.MeshId;
											item.CpiId = modelObjectItem.CpiId;
											item.IsComposite = modelObjectItem.IsComposite;
											item.CadIdInt = modelObjectItem.CadIdInt;
											item.LocationFk = modelObjectItem.LocationFk;
										}
									});
								}
								return serviceContainer.data.handleReadSucceeded(main, data);
							},
							initCreationData: function initCreationData(creationData) {
								creationData.CheckListFk = parentService.getSelected().Id;
								creationData.ModelFk = getModelId();
							}
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							let canEdit = parentService.getHeaderEditAble();
							return canEdit && !!getModelId();
						},
						canDeleteCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						}
					}
				}
			};

			function getModelId() {
				let modelId = modelViewerModelSelectionService.getSelectedModelId();
				if (modelId) {
					return modelId;
				}
				var pinModelEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'model.main'});
				if (!_.isNil(pinModelEntity)) {
					return pinModelEntity.id;
				}
				return null;
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			serviceContainer.data.loadOnSelectedEntitiesChanged = true;

			var service = serviceContainer.service;
			service.createObjectSetToCheckList = function (param) {
				var list = _.filter(serviceContainer.data.itemList, function (item) {
					return item.Version === 0;
				});
				if (list && list.length > 0) {
					angular.forEach(list, function (item) {
						service.deleteItem(item);
					});
				}
				service.parentService().update().then(function () {
					$http.post(globals.webApiBaseUrl + 'hsqe/checklist/modelannotationobject/viewer2objectcopy', param).then(function (response) {
						if (response) {
							service.addList(response.data);
						}
					}).catch(function () {
					});
				});
			};

			service.addList = function addList(data) {
				var list = serviceContainer.data.itemList;
				if (data && data.length) {
					angular.forEach(data, function (d) {
						if (parentService.ModelObjects && parentService.ModelObjects.length > 0) {
							var modelObjectItem = _.find(parentService.ModelObjects, {Id: d.MdlObjectFk});
							if (modelObjectItem) {
								d.MeshId = modelObjectItem.MeshId;
								d.CpiId = modelObjectItem.CpiId;
								d.IsComposite = modelObjectItem.IsComposite;
								d.CadIdInt = modelObjectItem.CadIdInt;
								d.LocationFk = modelObjectItem.LocationFk;
							}
						}
						var item = _.find(list, {Id: d.Id});
						if (item) {
							angular.extend(list[list.indexOf(item)], d);
						} else {
							serviceContainer.data.itemList.push(d);
						}
					});
				}
				serviceContainer.data.listLoaded.fire();
				service.gridRefresh();
			};

			service.updateModelSelection = platformObservableService.createObservableBoolean();

			service.updateModelSelection.uiHints = {
				id: 'toggleObjectSelection',
				caption$tr$: 'hsqe.checklist.modelobject.selectObjects',
				iconClass: 'tlb-icons ico-view-select'
			};

			function updateModelSelectionIfRequired() {
				if (service.updateModelSelection.getValue()) {
					var selModelId = getModelId();
					if (selModelId) {
						var selItems = service.getSelectedEntities();
						var modelObjects = _.filter(selItems, function (item) {
							return item.ModelFk !== null;
						});
						service.selectAssignedObject(modelObjects);
					}
				}
			}

			service.updateModelSelection.registerValueChanged(updateModelSelectionIfRequired);
			service.registerSelectedEntitiesChanged(updateModelSelectionIfRequired);

			service.createAssignedObject = function createAssignedObject(assignedObjects) {
				var selectedItem = parentService.getSelected();
				var list = _.filter(serviceContainer.data.itemList, function (item) {
					return item.Version === 0;
				});
				if (list && list.length > 0) {
					angular.forEach(list, function (item) {
						service.deleteItem(item);
					});
				}
				$http.post(globals.webApiBaseUrl + 'hsqe/checklist/modelobject/createmodelobject', {
					HsqCheckListFk: selectedItem.Id,
					MdlModelFk: assignedObjects.ModelFk,
					MdlObjectFk: assignedObjects.ObjectFk
				}).then(function (res) {
					var newItem = res.data;
					if (newItem) {
						service.addList([newItem]);
					}
				});
			};

			service.selectAssignedObject = function (assignedObjects) {
				if (modelViewerModelSelectionService.getSelectedModelId()) {
					if (assignedObjects && assignedObjects.length) {
						var selectedObjectIds = new modelViewerModelIdSetService.ObjectIdSet();

						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							selectedObjectIds[subModelId] = [];
						});

						selectedObjectIds = selectedObjectIds.useGlobalModelIds();

						assignedObjects.forEach(function (assignedObject) {
							if (angular.isArray(selectedObjectIds[assignedObject.ModelFk])) {
								selectedObjectIds[assignedObject.ModelFk].push(assignedObject.ObjectFk);
							}
						});

						if (!selectedObjectIds.isEmpty()) {
							modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(selectedObjectIds.useSubModelIds());
						}
					} else {
						modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds();
					}
				}
			};

			return service;
		}
	]);
})(angular);
