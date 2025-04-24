/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainObjectSetDataService
	 * @function
	 *
	 * @description The data service for model object sets.
	 */
	angular.module('model.main').service('modelMainObjectSetDataService', ['$http', '$q', 'platformDataServiceFactory',
		'modelViewerModelSelectionService', 'platformDataServiceProcessDatesBySchemeExtension',
		'modelMainObjectDataService', 'platformDataServiceSelectionExtension', 'platformRuntimeDataService',
		'modelMainObjectSetValidationProcessor', 'modelViewerModelIdSetService',
		'modelViewerCompositeModelObjectSelectionService', 'platformObservableService', '_',
		function ($http, $q, platformDataServiceFactory, modelSelectionService,
		          platformDataServiceProcessDatesBySchemeExtension, modelMainObjectDataService,
		          platformDataServiceSelectionExtension, platformRuntimeDataService,
		          modelMainObjectSetValidationProcessor, modelViewerModelIdSetService,
		          modelViewerCompositeModelObjectSelectionService, platformObservableService, _) {
			var svcOptions = {
				flatNodeItem: {
					module: angular.module('model.main'),
					serviceName: 'modelMainObjectSetDataService',
					entityNameTranslationID: 'model.main.objectSet.entity',
					httpCreate: {
						route: globals.webApiBaseUrl + 'model/main/objectset/'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ObjectSetDto',
						moduleSubModule: 'Model.Main'
					}), {processItem: processItem}],
					modification: {},
					actions: {
						delete: true,
						create: 'flat'
					},
					entityRole: {
						node: {
							itemName: 'ObjectSet',
							moduleName: 'Model Main',
							mainItemName: 'ModelFk',
							parentService: modelMainObjectDataService
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								// var modelId = modelSelectionService.getSelectedModelId();
								// if (modelId) {
								// 	creationData.PKey1 = modelId;
								// }
								for (var prop in creationData) {
									if (creationData.hasOwnProperty(prop)) {
										delete creationData[prop];
									}
								}
								var projectId = modelMainObjectDataService.getSelectedProject();
								if (projectId) {
									creationData.PKey1 = projectId;
								}
							}
						}
					}
				}
			};

			function processItem(item) {
				if (item) {
					var fields = [
						{
							field: 'FormFk',
							readonly: item.Version > 0 && !(_.isNull(item.FormFk) || _.isUndefined(item.FormFk))
						}
					];
					platformRuntimeDataService.readonly(item, fields);
				}
			}

			var container = platformDataServiceFactory.createNewComplete(svcOptions);
			var service = container.service;
			container.data.doNotLoadOnSelectionChange = true;
			container.data.doNotDeselctOnClearContent = true;
			container.data.newEntityValidator = modelMainObjectSetValidationProcessor;

			service.canCreate = function canCreate() {
				var projectId = modelMainObjectDataService.getSelectedProject();
				return projectId && projectId > 0 && modelMainObjectDataService.getList().length > 0;
			};
			// service.canDelete = function canDelete() {
			// 	var modelId = modelSelectionService.getSelectedModelId();
			// 	return modelId && modelId >= 1 && modelMainObjectDataService.getList().length>0 && service.hasSelection();
			// };

			container.data.clearContent = function clearListContent() {
			};
			container.service.setSelected = function setSelectedRCI(item, entities) {
				platformDataServiceSelectionExtension.doSelectEntities(entities, container.data);
				return platformDataServiceSelectionExtension.doSelect(item, container.data);
			};

			container.service.setSelectedEntities = function setSelectedEntities(entities) {
				return platformDataServiceSelectionExtension.doSelectEntities(entities, container.data);
			};

			container.service.deselect = function deselectRCI() {
				return platformDataServiceSelectionExtension.deselect(container.data);
			};
			container.service.loadAllObjectSets = function loadAllObjectSets() {
				var data = container.data;
				var modelId = modelSelectionService.getSelectedModelId();
				var projectId = modelMainObjectDataService.getSelectedProject();
				// if(modelId) {
				if (projectId > 0 ) {
					if(modelId){
						var httpReadRoute = globals.webApiBaseUrl + 'model/main/objectset/list?mainItemId=' + projectId +'&modelId=' +modelId;
					}else{
						var httpReadRoute = globals.webApiBaseUrl + 'model/main/objectset/list?mainItemId=' + projectId;
					}
					

					return $http.get(httpReadRoute).then(function (response) {
						return data.handleReadSucceeded(response.data, data);
					});
				}
			};

			modelMainObjectDataService.registerListLoaded(service.loadAllObjectSets);

			service.getFilteredList = function getFilteredList() {
				var result = [];
				var modelId = modelSelectionService.getSelectedModelId();
				if (modelId) {
					result = _.filter(container.data.itemList, {ModelFk: modelId});
				}
				return result;
			};

			/**
			 * @ngdoc function
			 * @name addItemIfAppropriate
			 * @function
			 * @methodOf modelMainObjectSetDataService
			 * @description Adds an object set entity to the list, if that object set is linked to the currently pinned
			 *              model, or updates an existing item based upon its ID.
			 * @param {Object} item The item.
			 */
			service.addItemIfAppropriate = function (item) {
				var existingItem = _.find(container.data.itemList, {
					ModelFk: item.ModelFk,
					Id: item.Id
				});
				if (existingItem) {
					_.assign(existingItem, item);
					service.gridRefresh();
				} else if (item.ModelFk === modelSelectionService.getSelectedModelId()) {
					container.data.itemList.push(item);
					service.gridRefresh();
				}
			};

			modelSelectionService.onSelectedModelChanged.register(service.loadAllObjectSets);

			service.updateModelSelection = platformObservableService.createObservableBoolean();
			service.updateModelSelection.uiHints = {
				id: 'toggleObjectSelection',
				caption$tr$: 'model.main.selectObjectSetObjects',
				iconClass: 'tlb-icons ico-view-select'
			};

			function updateModelSelectionIfRequired() {
				if (service.updateModelSelection.getValue()) {
					var selModelId = modelSelectionService.getSelectedModelId();
					if (selModelId) {
						var selItems = service.getSelectedEntities();
						service.getObjectIdsFromObjectSets(selModelId, _.map(selItems, function (objSet) {
							return objSet.Id;
						})).then(function (resultMap) {
							if (modelSelectionService.getSelectedModelId()) {
								resultMap = resultMap.useSubModelIds();
								modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(resultMap);
							}
						});
					}
				}
			}

			service.updateModelSelection.registerValueChanged(updateModelSelectionIfRequired);
			service.registerSelectedEntitiesChanged(updateModelSelectionIfRequired);

			/**
			 * @ngdoc function
			 * @name getObjectIdsFromObjectSets
			 * @function
			 * @methodOf modelMainObjectSetDataService
			 * @description Retrieves the IDs of all objects in a given model (or one of its sub-models) that are
			 *              included in at least one of the given object sets.
			 * @param {Number} modelId The model ID.
			 * @param {Array<Number>>} objectSetIds The IDs of the object sets to check.
			 * @returns {MultiModelIdSet} The included object IDs with global (!) model IDs.
			 */
			service.getObjectIdsFromObjectSets = function (modelId, objectSetIds) {
				return $http.get(globals.webApiBaseUrl + 'model/main/objectset/modelObjectsFromObjectSets', {
					params: {
						modelId: modelId,
						objectSetIds: (_.isArray(objectSetIds) ? objectSetIds : []).join(':')
					}
				}).then(function (response) {
					return modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data);
				});
			};

			var defaultSettings = null;

			service.getDefaultSettings = function () {
				if (defaultSettings) {
					return $q.when(defaultSettings);
				}

				return $http.get(globals.webApiBaseUrl + 'model/main/objectset/initinfo').then(function (response) {
					defaultSettings = response.data;

					return defaultSettings;
				});
			};

			return service;
		}]);
})(angular);
