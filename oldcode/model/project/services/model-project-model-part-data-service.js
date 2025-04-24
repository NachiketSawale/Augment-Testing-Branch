/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var module = angular.module('model.project');

	/**
	 * @ngdoc service
	 * @name modelProjectModelPartDataService
	 * @function
	 *
	 * @description
	 * modelProjectModelPartDataService is the data service for sub-models of composite models.
	 */
	angular.module('model.project').factory('modelProjectModelPartDataService', ['platformDataServiceFactory',
		'modelProjectModelDataService', 'modelProjectModelVersionDataService',
		function (platformDataServiceFactory, modelProjectModelDataService, modelProjectModelVersionDataService) {

			var service = {};

			var dataServiceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'modelProjectModelPartDataService',
					entityNameTranslationID: 'model.project.entityModelPart',
					httpCreate: {
						route: globals.webApiBaseUrl + 'model/project/modelpart/',
						endCreate: 'createpart'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'model/project/modelpart/',
						endRead: 'listformodel',
						initReadData: function (readdata) {
							var modelId;
							var selectedModel = modelProjectModelDataService.getSelected();
							var selectedModelVersion = modelProjectModelVersionDataService.getSelected();
							if (selectedModelVersion) {
								modelId = selectedModelVersion.Id;
							} else if (selectedModel) {
								modelId = selectedModel.Id;
							}
							if (modelId) {
								readdata.filter = '?modelId=' + modelId;
							} else {
								readdata.filter = '?modelId=' + 0;
							}
						}
					},
					actions: {
						create: 'flat',
						delete: true
					},
					presenter: {
						list: {
							initCreationData: function (creationData, svcData, creationOptions) {
								creationData.mainItemId = modelProjectModelDataService.getSelected().Id;
								creationData.subModelId = creationOptions.modelId;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'ModelParts',
							parentService: modelProjectModelDataService
						}
					},
					dataProcessor: [{
						processItem: function (item) {
							item.Id = item.ModelFk + '-' + item.ModelPartFk;
						}
					}]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(dataServiceOption);

			service = serviceContainer.service;

			service.canShowContent = function () {
				var sel = modelProjectModelDataService.getSelectedEntities();
				if (angular.isArray(sel) && (sel.length === 1)) {
					if (sel[0].IsComposite) {
						return true;
					}
				}
				return false;
			};

			service.createSubModel = function (config) {
				return service.createItem(config);
			};

			service.deleteSubModel = function (entities) {
				return service.deleteEntities(entities);
			};

			function selectionChanged() {
				service.load();
			}

			modelProjectModelVersionDataService.registerSelectionChanged(selectionChanged);


			return service;
		}]);
})(angular);
