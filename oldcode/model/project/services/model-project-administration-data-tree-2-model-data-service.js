/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('model.project');

	/**
	 * @ngdoc service
	 * @name modelProjectAdministrationDataTree2ModelDataService
	 * @description Provides methods to access, create and update data tree to model links.
	 */
	myModule.service('modelProjectAdministrationDataTree2ModelDataService', ['platformDataServiceFactory',
		'modelProjectModelDataService', 'modelProjectModelVersionDataService',
		function (platformDataServiceFactory, modelProjectModelDataService, modelProjectModelVersionDataService) {
			var self = this;
			var serviceOption = {
				flatLeafItem: {
					module: myModule,
					serviceName: 'modelProjectAdministrationDataTree2ModelDataService',
					entityNameTranslationID: 'model.administration.dataTree.dataTree2Model',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'model/project/datatree2model/',
						endRead: 'list',
						usePostForRead: false,
						initReadData: function initReadData(readData) {
							var selModel = modelProjectModelVersionDataService.getSelected();
							if (!selModel) {
								selModel = modelProjectModelDataService.getSelected();
							}
							readData.filter = '?mainItemId=' + (selModel ? selModel.Id : 0);
						}
					},
					actions: {
						delete: true,
						create: 'flat'
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selModel = modelProjectModelVersionDataService.getSelected();
								if (!selModel) {
									selModel = modelProjectModelDataService.getSelected();
								}
								creationData.PKey2 = selModel.Id;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'DataTree2Models',
							parentService: modelProjectModelDataService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createService(serviceOption, self);

			function refreshData() {
				serviceContainer.service.load();
			}

			modelProjectModelVersionDataService.registerSelectionChanged(refreshData);
		}]);
})(angular);
