/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelMainObjectSet2ObjectDataService
	 * @function
	 * @requires platformDataServiceFactory, modelViewerModelSelectionService
	 *
	 * @description Loads model object attributes.
	 */
	angular.module('model.main').service('modelMainObject2ObjectSetDataService', ['platformDataServiceFactory',
		'modelViewerModelSelectionService', 'modelMainObjectDataService',
		function (platformDataServiceFactory, modelSelectionService, modelMainObjectDataService) {
			var svcOptions = {
				flatLeafItem: {
					module: angular.module('model.main'),
					serviceName: 'modelMainObject2ObjectSetDataService',
					entityNameTranslationID: 'model.main.object2ObjectSetEntity',
					httpRead: {
						route: globals.webApiBaseUrl + 'model/main/objectset2object/',
						endRead: 'listbyobject',
						initReadData: function (readData) {
							var objectId;
							if(modelMainObjectDataService.hasSelection()){
								var item = modelMainObjectDataService.getSelected();
								if(item) {
									objectId = item.Id;
									var projectId = modelMainObjectDataService.getSelectedProject();
									readData.filter = '?projectId=' + projectId + '&objectId=' + objectId + '&modelId=' + item.ModelFk;
								}
							}
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'model/main/objectset2object/'
					},
					actions: {
						delete: true,
						create: false
					},
					entityRole: {
						leaf: {
							itemName: 'ObjectSet2Object',
							parentService: modelMainObjectDataService
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								if(modelMainObjectDataService.hasSelection()) {
									var modelId = modelMainObjectDataService.getSelected().ModelFk;
									var projectId = modelMainObjectDataService.getSelectedProject();
									creationData.PKey1 = modelId;
									creationData.PKey2 = projectId;
								}
							},
							handleCreateSucceeded: function (newData) {
								if(modelMainObjectDataService.hasSelection()) {
									var item = modelMainObjectDataService.getSelected();
									newData.ObjectFk = item.Id;
								}
								return newData;
							}
						}
					}
				}
			};

			return platformDataServiceFactory.createNewComplete(svcOptions).service;
		}]);
})(angular);
