(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name projectMainAccessObject2GrpRoleService
	 * @function
	 *
	 * @description
	 * projectMainaccessObject2GrpRoleService is the data service for all Unit Area related functionality.
	 */
	var moduleName= 'project.main';
	var accessObject2GrpRoleModule = angular.module(moduleName);
	accessObject2GrpRoleModule.factory('projectMainAccessObject2GrpRoleService', ['platformDataServiceFactory','projectMainService',

		function (platformDataServiceFactory, projectMainService) {
			var factoryOptions = {
				flatLeafItem: {
					module: accessObject2GrpRoleModule,
					serviceName: 'projectMainAccessObject2GrpRoleService',
					entityNameTranslationID: 'project.main.accessObject2GrpRole',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'project/main/permission/',
						endRead: 'listByParentId',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = projectMainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = projectMainService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'AccessObject2GrpRole', parentService: projectMainService, parentFilter: 'projectId' }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			return serviceContainer.service;

		}]);
})(angular);
