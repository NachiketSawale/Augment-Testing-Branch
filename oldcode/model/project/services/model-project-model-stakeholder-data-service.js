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
	 * @name modelProjectModelStakeholderDataService
	 * @function
	 *
	 * @description
	 * DataService from Model Stakeholder.
	 */
	angular.module('model.project').factory('modelProjectModelStakeholderDataService', ['_', 'platformDataServiceFactory',
		'modelProjectModelDataService', 'modelProjectModelVersionDataService', 'platformRuntimeDataService',
		function (_, platformDataServiceFactory, modelProjectModelDataService, modelProjectModelVersionDataService, platformRuntimeDataService) {

			let service;

			const dataServiceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'modelProjectModelStakeholderDataService',
					entityNameTranslationID: 'model.project.entityModelStakeholder',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'model/project/stakeholder/',
						endRead: 'listformodel',
						usePostForRead: false,
						initReadData: function initReadData(readData) {
							let modelId;
							const selectedModel = modelProjectModelDataService.getSelected();
							const selectedModelVersion = modelProjectModelVersionDataService.getSelected();
							if (selectedModelVersion) {
								modelId = selectedModelVersion.Id;
							} else if (selectedModel) {
								modelId = selectedModel.Id;
							}
							readData.filter = '?modelId=' + (_.isInteger(modelId) ? modelId : '0');
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'model/project/modelpart/',
						endCreate: 'createpart'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'model/project/modelpart/',
						endRead: 'listformodel',
						initReadData: function (readdata) {
							let modelId;
							const selectedModel = modelProjectModelDataService.getSelected();
							const selectedModelVersion = modelProjectModelVersionDataService.getSelected();
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
							initCreationData: function (creationData) {
								let pKey1;
								const selectedModel = modelProjectModelDataService.getSelected();
								const selectedModelVersion = modelProjectModelVersionDataService.getSelected();
								if (selectedModelVersion) {
									pKey1 = selectedModelVersion.Id;
								} else if (selectedModel) {
									pKey1 = selectedModel.Id;
								}
								creationData.PKey1 = pKey1;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'ModelStakeholders',
							parentService: modelProjectModelDataService
						}
					},
					dataProcessor: [{processItem: updateItemDisabledStates}],
				}
			};

			function updateItemDisabledStates(item) {
				let fields = [];
				if (_.isNil(item.ClerkFk) && _.isNil(item.BusinessPartnerFk)) {
					fields.push({field: 'ClerkFk', readonly: false});
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

			const serviceContainer = platformDataServiceFactory.createNewComplete(dataServiceOption);

			service = serviceContainer.service;

			service.registerItemModified(function (skip, item) {
				updateItemDisabledStates(item);
			});

			function selectionChanged() {
				service.load();
			}

			modelProjectModelVersionDataService.registerSelectionChanged(selectionChanged);

			service.updateItemDisabledStates = updateItemDisabledStates;
			return service;
		}]);
})(angular);
