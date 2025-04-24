/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'model.main';
	var modelMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name modelMainObjectDataService
	 * @function
	 *
	 * @description
	 * modelMainObjectDataService is the data service for object in model. Objects are the main entity
	 */
	modelMainModule.service('modelMainObjectDataService', ModelMainObjectDataService);
	ModelMainObjectDataService.$inject = ['_', 'platformDataServiceFactory', 'modelProjectModelReadonlyDataService',
		'modelMainFilterService', 'modelViewerViewerRegistryService', 'cloudDesktopSidebarService',
		'platformRuntimeDataService', 'modelViewerModelSelectionService', '$q', '$injector', '$http',
		'modelViewerCompositeModelObjectSelectionService',
		'modelViewerModelIdSetService', 'modelProjectSubModelSelectorService', 'modelViewerStandardFilterService',
		'PlatformMessenger', '$log'];

	function ModelMainObjectDataService(_, platformDataServiceFactory, modelProjectModelReadonlyDataService,
	                                    modelMainFilterService, modelViewerViewerRegistryService,
	                                    cloudDesktopSidebarService, platformRuntimeDataService,
	                                    modelViewerModelSelectionService, $q, $injector, $http,
	                                    modelViewerCompositeModelObjectSelectionService,
	                                    modelViewerModelIdSetService, modelProjectSubModelSelectorService,
	                                    modelViewerStandardFilterService, PlatformMessenger, $log) {
		var self = this;

		var selectedModel = null;
		var selectedProject = -1;
		var pinnedModel = null;
		var pinnedProject = -1;
		// var gridId = null;
		var curGridSelection = [];
		// var curViewerSelection = [];
		var curViewerSelection = new modelViewerModelIdSetService.ObjectIdSet();
		var filteredItemsList = [];
		var selectedList = [];
		var service;
		var serviceContainer;
		var cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');

		function canCreateObject() {
			const selModel = modelViewerModelSelectionService.getSelectedModel();
			return selModel && !selModel.info.isPreview;
		}


		// The instance of the main service - to be filled with functionality below
		var modelObjectServiceOption = {
			flatRootItem: {
				module: modelMainModule,
				serviceName: 'modelMainObjectDataService',
				entityNameTranslationID: 'model.main.entityObject',
				useItemFilter: true,
				actions: {
					delete: {},
					create: 'flat',
					canDeleteCallBackFunc: function (item) {
						return _.isNil(item.CpiId);
					},
					canCreateCallBackFunc: canCreateObject,
					suppressAutoCreate: true
				},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/main/object/',
					endRead: 'listfiltered',
					endDelete: 'multidelete',
					// initReadData: function (readdata, data) {
					// 	var params = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(data.searchFilter);
					// 	angular.extend(readdata, params);
					// 	return readdata;
					// },
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						if (selectedModel && selectedModel.Id) {
							filterRequest.furtherFilters = [{Token: 'MDL_MODEL', Value: selectedModel.Id}];
						}
					},
					usePostForRead: true
				},
				entityRole: {
					root: {
						codeField: null,
						itemName: 'Objects',
						moduleName: 'cloud.desktop.moduleDisplayNameModel',
						useIdentification: true,
						provideIdentificationFn: function provideIdentification(entity) {
							return {
								Id: entity.Id,
								PKey1: entity.ModelFk
							};
						},
						handleUpdateDone: function (updateData, response) {
							if (updateData.RequestToSave && response.RequestToSave) {
								var requestService = $injector.get('modelMainInfoRequestDataService');
								requestService.handleUpdateDone(updateData.RequestToSave, response.RequestToSave);
								requestService.mergeInUpdateData(response);
							}
							if (updateData.ObjectSetToSave && response.ObjectSetToSave && !serviceContainer.service.hasSelection()) {
								var objectSetService = $injector.get('modelMainObjectSetDataService');
								objectSetService.mergeInUpdateData(response);
							}
							serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
						},
						showProjectHeader: {
							getProject: function (entity) {
								var project = null;
								if (entity) {
									if (selectedModel && selectedModel.Id === entity.ModelFk) {
										//noinspection JSUnresolvedVariable
										project = selectedModel.ProjectDto ? selectedModel.ProjectDto : null;
									} else {
										var modelItem = modelProjectModelReadonlyDataService.getItemById(entity.ModelFk);
										//noinspection JSUnresolvedVariable
										project = (modelItem && modelItem.ProjectDto) ? modelItem.ProjectDto : null;
									}
								}
								return project;
							},
							getHeaderEntity: function (entity) {
								var model = null;
								if (entity) {
									if (selectedModel && selectedModel.Id === entity.ModelFk) {
										model = selectedModel ? selectedModel : null;
									} else {
										var modelItem = modelProjectModelReadonlyDataService.getItemById(entity.ModelFk);
										model = modelItem ? modelItem : null;
									}
								}
								return model;
							},
							getHeaderOptions: function () {
								return {codeField: 'Code', descField: 'DescriptionInfo.Translated'};
							}
						}
					}
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData, data, creationOptions) {
							for (var prop in creationData) {
								if (Object.prototype.hasOwnProperty(creationData, prop)) {
									delete creationData[prop];
								}
							}
							creationData.PKey1 = creationOptions.modelId;
						},
						incorporateDataRead: function (result, data) {
							data.isDataLoaded = true;

							//TODO-CostGroup

							$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
								basicsCostGroupAssignmentService.process(result, service, {
									mainDataName: 'dtos',
									attachDataName: 'ModelObject2CostGroups',
									dataLookupType: 'ModelObject2CostGroups',
									identityGetter: function identityGetter(entity) {
										return {
											ModelFk: entity.RootItemId,
											Id: entity.MainItemId
										};
									}
								});

							}]);

							return serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				},
				dataProcessor: [{processItem: processItem}],
				entitySelection: {supportsMultiSelection: true},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
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
							setContextCallback: setCurrentPinningContext // may own context service
						},
						showProjectContext: false,
						withExecutionHints: false
					}
				},
				filterByViewer: true
			}
		};

		function processItem(item) {
			if (item) {
				var fields = [
					{
						field: 'ContainerFk',
						readonly: Boolean(item.MeshId)
					},
					{
						field: 'ObjectFk',
						readonly: Boolean(item.MeshId)
					}

				];
				platformRuntimeDataService.readonly(item, fields);
			}
		}

		function setCurrentPinningContext(dataService) {

			function setCurrentProjectToPinnningContext(dataService) {
				var currentItem = dataService.getSelected();
				if (currentItem) {
					var projectPromise = $q.when(true);
					var modelPromise = $q.when(true);
					var pinningContext = [];

					if (angular.isNumber(currentItem.ModelFk)) {
						var modelItem = modelProjectModelReadonlyDataService.getItemById(currentItem.ModelFk);
						if (modelItem) {
							if (angular.isNumber(modelItem.ProjectFk)) {
								projectPromise = cloudDesktopPinningContextService.getProjectContextItem(modelItem.ProjectFk).then(function (pinningItem) {
									pinningContext.push(pinningItem);
								});
								serviceContainer.service.setPinnedProject(modelItem.ProjectFk);
							}
							pinningContext.push(
								new cloudDesktopPinningContextService.PinningItem('model.main', currentItem.ModelFk,
									cloudDesktopPinningContextService.concate2StringsWithDelimiter(modelItem.Code, modelItem.Description, ' - '))
							);
							serviceContainer.service.setPinnedModel({
								Id: currentItem.ModelFk,
								IsComposite: currentItem.IsComposite
							});
						}
					}

					return $q.all([projectPromise, modelPromise]).then(
						function () {
							if (pinningContext.length > 0) {
								cloudDesktopPinningContextService.setContext(pinningContext, dataService);
							}
						});
				}
			}

			setCurrentProjectToPinnningContext(dataService);
		}

		serviceContainer = platformDataServiceFactory.createService(modelObjectServiceOption, self);

		//noinspection JSUnresolvedVariable
		serviceContainer.service.onModelContextUpdated = new Platform.Messenger();
		//noinspection JSUnresolvedVariable
		serviceContainer.service.onProjectContextUpdated = new Platform.Messenger();

		// create new object regarding composite model#
		serviceContainer.service.createItemForSubModel = function () {
			var modelId;
			if (selectedModel && selectedModel.Id) {
				modelId = selectedModel.Id;
			} else if (serviceContainer.data.selectedItem && serviceContainer.data.selectedItem.ModelFk) {
				modelId = serviceContainer.data.selectedItem.ModelFk;
			} else {
				var pinnedContext = cloudDesktopPinningContextService.getContext();
				var pinnedMdl = _.find(pinnedContext, {token: 'model.main'});
				if (pinnedMdl && pinnedMdl.id) {
					modelId = pinnedMdl.id.Id ? pinnedMdl.id.Id : pinnedMdl.id;
				}
			}
			var subModelPromise = $q.when(true);
			var modelItem = modelProjectModelReadonlyDataService.getItemById(modelId);
			if (modelItem.IsComposite) {
				subModelPromise = modelProjectSubModelSelectorService.selectSubModel().then(function (data) {
					modelId = data.modelId;
					// serviceContainer.service.createItem({modelId: modelId});
				});
			}
			return $q.all([subModelPromise]).then(
				function () {
					serviceContainer.service.createItem({modelId: modelId});
				}, function () {
					$log.error('no input');
				});
		};

		// selection model
		serviceContainer.service.setSelectedModel = function setSelectedModel(item, withLoad) {

			if (selectedModel && item && selectedModel.Id !== item.Id || !selectedModel) {
				selectedModel = item;
				if (item && item.Id) {
					// serviceContainer.service.update();
					if (withLoad) {
						// serviceContainer.service.setFilter('mainItemId=' + item.Id);
						serviceContainer.service.load();
					}
					if (item.ProjectFk) {
						serviceContainer.service.setSelectedProject(item.ProjectFk);
					}
				} else {
					serviceContainer.service.setSelectedProject(-1);
					serviceContainer.service.clear();
				}
				serviceContainer.service.onModelContextUpdated.fire();
			} else if (!item) {
				selectedModel = item;
				serviceContainer.service.setSelectedProject(-1);
				serviceContainer.service.onModelContextUpdated.fire();
			}
		};

		serviceContainer.service.getSelectedModel = function getSelectedModel() {
			if (!selectedModel) {
				if (pinnedModel) {
					return {Id: pinnedModel.Id, ProjectFk: pinnedProject, IsComposite: pinnedModel.IsComposite};
				} else if (pinnedProject) {
					return {Id: null, ProjectFk: pinnedProject, IsComposite: false};
				}
			}
			return selectedModel;
		};

		// selection project
		serviceContainer.service.setSelectedProject = function setSelectedProject(item) {

			if (selectedProject !== item) {
				if (item) {
					selectedProject = item;
				} else {
					selectedProject = -1;
				}
				serviceContainer.service.onProjectContextUpdated.fire();
			}
		};

		serviceContainer.service.getSelectedProject = function getSelectedProject() {
			if (selectedProject === -1) {
				if (pinnedProject !== -1) {
					return pinnedProject;
				}
			}
			return selectedProject;
		};

		// pinning model
		serviceContainer.service.setPinnedModel = function setPinnedModel(item) {
			if (item !== pinnedModel) {
				if (item) {
					pinnedModel = item;
				} else {
					var pinnedContext = cloudDesktopPinningContextService.getContext();
					var found = _.find(pinnedContext, {token: 'model.main'});
					if (found) {
						var modelItem = modelProjectModelReadonlyDataService.getItemById(found.id);
						pinnedModel = {Id: found.id, IsComposite: modelItem ? modelItem.IsComposite : false};
					} else {
						pinnedModel = null;
					}
				}
				if (!selectedModel) {
					serviceContainer.service.onModelContextUpdated.fire();
				}
			}
		};


		serviceContainer.service.getPinnedModel = function getPinnedModel() {
			return pinnedModel;
		};

		// pinnig project
		serviceContainer.service.setPinnedProject = function setPinnedProject(item) {
			if (item !== pinnedProject) {
				if (item) {
					pinnedProject = item;
				} else {
					var pinnedContext = cloudDesktopPinningContextService.getContext();
					var found = _.find(pinnedContext, {token: 'project.main'});
					if (found) {
						pinnedProject = found.id;
					} else {
						pinnedProject = -1;
					}
				}
				if (selectedProject !== -1) {
					serviceContainer.service.onProjectContextUpdated.fire();
				}
			}
		};

		serviceContainer.service.getPinnedProject = function getPinnedProject() {
			return pinnedProject;
		};


		service = serviceContainer.service;
		//add the onCostGroupCatalogsLoaded messenger
		service.onCostGroupCatalogsLoaded = new PlatformMessenger();

		//
		function setPinningContext(dataService) {
			var currentItem = dataService.getSelected();
			if (currentItem) {
				var projectPromise = $q.when(true);
				var pinningContext = [];

				if (angular.isNumber(currentItem.Id)) {
					if (currentItem) {
						if (angular.isNumber(currentItem.ProjectFk)) {
							projectPromise = cloudDesktopPinningContextService.getProjectContextItem(currentItem.ProjectFk).then(function (pinningItem) {
								pinningContext.push(pinningItem);
							});
							serviceContainer.service.setPinnedProject(currentItem.ProjectFk);
						}
						pinningContext.push(
							new cloudDesktopPinningContextService.PinningItem('model.main', currentItem.Id,
								cloudDesktopPinningContextService.concate2StringsWithDelimiter(currentItem.Code, currentItem.Description, ' - '))
						);
						serviceContainer.service.setPinnedModel({Id: currentItem.Id, IsComposite: currentItem.IsComposite});
					}
				}

				return $q.all([projectPromise]).then(
					function () {
						if (pinningContext.length > 0) {
							cloudDesktopPinningContextService.setContext(pinningContext, dataService);
						}
					});
			}
		}

		serviceContainer.service.selectAfterNavigation = function selectAfterNavigation(item) {
			modelViewerModelSelectionService.pauseUpdate();

			modelProjectModelReadonlyDataService.setNewFilter(item.ProjectFk);
			modelProjectModelReadonlyDataService.setSelectedModel(item).then(function () {
				setPinningContext(modelProjectModelReadonlyDataService).then(function () {
					modelViewerModelSelectionService.resumeUpdate();

					selectedModel = null;
					serviceContainer.service.setSelectedModel(item, true);
				});
			});
		};

		// selection from grid to viewer and from viewer to grid if selection changed
		function isEqualGridSelection(array) {
			var result = true;
			if (array.length > 0) {
				var difArray = _.difference(array, curGridSelection);
				if (difArray.length > 0 || curGridSelection.length !== array.length) {
					curGridSelection = _.clone(array);
					result = false;
				}
			} else {
				if (curGridSelection.length > 0) {
					curGridSelection = [];
					result = false;
				}
			}
			return result;
		}

		// selection from grid to viewer and from viewer to grid if selection changed
		function isEqualViewerSelection(objectIds) {
			// var subModelIds = _.sortBy(Object.keys(objectIds));
			var subModelIds = _.sortBy(_.map(Object.keys(objectIds), function (subModelId) {
				return parseInt(subModelId);
			}));
			if (_.isEqual(subModelIds, _.sortBy(_.map(Object.keys(curViewerSelection), function (subModelId) {
				return parseInt(subModelId);
			})))) {
				if (_.every(subModelIds, function (subModelId) {
					var result = false;
					if (!curViewerSelection.isEmpty() && curViewerSelection[subModelId]) {
						if (objectIds[subModelId].length === curViewerSelection[subModelId].length) {
							var difArray = _.difference(objectIds[subModelId], curViewerSelection[subModelId]);
							if (difArray.length <= 0 && objectIds[subModelId].length === curViewerSelection[subModelId].length) {
								result = true;
							}
						}
					}
					// return !curViewerSelection.isEmpty() && curViewerSelection[subModelId] ? curViewerSelection[subModelId].equals(objectIds[subModelId]) : false;
					return result;
				})) {
					return true;
				}
			}
			curViewerSelection = _.clone(objectIds);
			return false;
		}

		// selection on viewer from grid
		serviceContainer.service.setSelectionOnViewer = function setSelectionOnViewer(rows) {
			if (!isEqualGridSelection(rows) && modelViewerViewerRegistryService.isViewerActive()) {
				// var modelId = modelViewerModelSelectionService.getSelectedModelId();
				var itemList = serviceContainer.service.getList();
				var newGridSelection = [];
				selectedList = [];
				var selectedObjectIds = new modelViewerModelIdSetService.ObjectIdSet();
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					selectedObjectIds[subModelId] = [];
				});
				if (rows) {
					if (_.keys(selectedObjectIds).length > 0) {
						selectedObjectIds = selectedObjectIds.useGlobalModelIds();
						if (itemList.length > 0) {
							angular.forEach(rows, function (item) {
								if (item) {
									if (selectedObjectIds.hasOwnProperty(item.ModelFk)) {
										var hlpArr = selectedObjectIds[item.ModelFk];
										hlpArr.push(item.Id);
										selectedObjectIds[item.ModelFk] = hlpArr;
									} else {
										var arr = [];
										arr.push(item.Id);
										selectedObjectIds[item.ModelFk] = arr;
									}
									newGridSelection.push(item.IdString);
									selectedList.push({'ModelId': item.ModelFk, 'ObjectId': item.Id});
								}
							});
						}

						var filterByViewerMgr = serviceContainer.data.filterByViewerManager;
						if (!isEqualViewerSelection(selectedObjectIds) && !selectedObjectIds.isEmpty() && (!filterByViewerMgr || !filterByViewerMgr.isActive())) {
							modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(selectedObjectIds.useSubModelIds());
						}
					}
				}
			}
		};

		serviceContainer.service.getFilteredList = function () {
			return filteredItemsList;
		};

		serviceContainer.service.setFilteredList = function (data) {
			filteredItemsList = [];

			var list = serviceContainer.service.getList();
			if (list.length > 0) {
				data.filteredItems.forEach(function (value, key) {
					var item = _.find(list, {IdString: key});
					if (item && item.Id) {
						filteredItemsList.push({'ModelId': item.ModelFk, 'ObjectId': item.Id});
					}
				});
			}
		};
		serviceContainer.service.getSelectedList = function () {
			return selectedList;
		};

		// snycronize viewer with list from object container
		serviceContainer.service.syncViewer = function syncViewer() {
			modelViewerStandardFilterService.updateMainEntityFilter();
		};

		/**
		 * @ngdoc function
		 * @name getMeshesByPropertyTextValue
		 * @function
		 * @methodOf modelMainObjectDataService
		 * @description Retrieves mesh IDs from the currently selected model for which a given text value is assigned
		 *              to a given property key.
		 * @param {String} propertyKeyName The property key name.
		 * @param {String} valueTypeName The value type name.
		 * @param {String} value The text value.
		 * @return {Promise<ObjectIdSet>} A promise that is reolved to the array of mesh IDs.
		 * @throws {Error} if no model is selected.
		 */
		serviceContainer.service.getMeshesByPropertyTextValue = function (propertyKeyName, valueTypeName, value) {
			var selModelId = modelViewerModelSelectionService.getSelectedModelId();
			if (selModelId) {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'model/main/object/meshesbyproptext',
					params: {
						modelId: selModelId,
						propertyName: propertyKeyName,
						valueTypeName: valueTypeName,
						value: value
					}
				}).then(function (response) {
					if (angular.isString(response.data)) {
						return modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data).useSubModelIds();
					} else {
						return new modelViewerModelIdSetService.ObjectIdSet();
					}
				});
			} else {
				throw new Error('No model selected.');
			}
		};


		function getPinningContext() {
			serviceContainer.service.setPinnedModel();
			serviceContainer.service.setPinnedProject();
		}

		// registration
		serviceContainer.service.registerSelectionChanged(function (e, entity) {
			if (entity && selectedModel && entity.ModelFk !== selectedModel.Id || entity && !selectedModel) {
				var model = _.find(modelProjectModelReadonlyDataService.getList(), {Id: entity.ModelFk});
				if (!model && modelProjectModelReadonlyDataService.getFilter() !== -1) {
					modelProjectModelReadonlyDataService.setNewFilter(-1).then(function (response) {
						model = _.find(response, {Id: entity.ModelFk});
						serviceContainer.service.setSelectedModel(model, false);
					});
				} else {
					serviceContainer.service.setSelectedModel(model, false);
				}
			} else if (!entity) {
				serviceContainer.service.setSelectedModel(entity);
			}

		});

		cloudDesktopPinningContextService.onSetPinningContext.register(getPinningContext);
		cloudDesktopPinningContextService.onClearPinningContext.register(getPinningContext);

		serviceContainer.service.registerListLoaded(function () {
			serviceContainer.service.syncViewer();
		});

		serviceContainer.service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
			if (!updateData.MainItemId && updateData.EntitiesCount > 0) {
				var first = _.head(serviceContainer.service.getList());
				if (first) {
					updateData.MainItemId = first.Id;
				}
			}
		};

		serviceContainer.service.isDataLoaded = function () {
			return !!serviceContainer.data.isDataLoaded;
		};

		serviceContainer.service.setPinnedModel();
		serviceContainer.service.setPinnedProject();
	}
})(angular);
