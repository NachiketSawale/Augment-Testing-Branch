(function (angular) {
	'use strict';

	/* global globals */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainContainerPropertyService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for constructionSystem main containerProperty list/detail controller.
	 */
	angular.module(moduleName).factory('constructionSystemMainContainerPropertyService', [
		'platformDataServiceFactory', 'constructionSystemMainContainerService',
		function (platformDataServiceFactory, parentService) {
			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMainContainerPropertyService',
					httpRead: {
						route: globals.webApiBaseUrl + 'model/main/containerproperty/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var obj = parentService.getSelected();
							if (obj && obj.Id && obj.ModelFk) {
								readData.ModelId = obj.ModelFk;
								readData.ContainerId = obj.Id;
							} else {
								readData.ModelId = -1;
								readData.ContainerId = -1;
							}
						}
					},
					entityRole: { // todo-mike: the difference is the parent service from model main counterpart modelMainContainerPropertyDataService. We need German side to support it.
						leaf: {itemName: 'ContainerProperty', parentService: parentService}
					},
					presenter: {list: {}},
					actions: {delete: false, create: false}
				}
			};

			return platformDataServiceFactory.createNewComplete(serviceOption).service;
		}
	]);
})(angular);
