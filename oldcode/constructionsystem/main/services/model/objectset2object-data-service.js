(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainObjectSet2ObjectService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for constructionSystem main objectset2object list/detail controller.
	 */
	angular.module(moduleName).factory('constructionSystemMainObjectSet2ObjectService', [
		'platformDataServiceFactory', 'constructionSystemMainInstanceService', 'constructionSystemMainObjectSetService',
		function (platformDataServiceFactory, constructionSystemMainInstanceService, parentService) {

			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMainObjectSet2ObjectService',
					httpRead: {
						route: globals.webApiBaseUrl + 'model/main/objectset2object/',
						endRead: 'listbyobjectset',
						usePostForRead: false,
						initReadData: function initReadData(readData) {
							var modelId = constructionSystemMainInstanceService.getCurrentSelectedModelId();
							var objectSet = parentService.getSelected();
							var projectId=constructionSystemMainInstanceService.getCurrentSelectedProjectId();
							readData.filter = '?projectId=' + projectId + '&objectSetId=' + objectSet.Id + '&modelId=' + modelId;
						}
					},
					entityRole: {
						leaf: {
							itemName: 'ObjectSet2Object',
							parentService: parentService
						}
					},
					presenter: {list: {}},
					actions: {delete: false, create: false}
				}
			};

			return platformDataServiceFactory.createNewComplete(serviceOption).service;
		}
	]);
})(angular);
