
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectProjectLevelService
	 * @function
	 *
	 * @description
	 * objectProjectLevelService is the data service for all Project related functionality.
	 */
	var moduleName= 'object.project';
	var objectProjectLevelModule = angular.module(moduleName);
	objectProjectLevelModule.factory('objectProjectLevelService', ['globals', 'platformDataServiceFactory','objectProjectHeaderService','objectProjectLevelValidationProcessor',

		function (globals, platformDataServiceFactory, objectProjectHeaderService, objectProjectLevelValidationProcessor) {
			var factoryOptions = {
				flatLeafItem: {
					module: objectProjectLevelModule,
					serviceName: 'objectProjectLevelService',
					entityNameTranslationID: 'object.project.entityObjectProjectLevel',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/project/level/',
						usePostForRead: true,
						endRead: 'listByParent',
						initReadData: function initReadData(readData) {
							var selected = objectProjectHeaderService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = objectProjectHeaderService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'Level',  parentService: objectProjectHeaderService }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = objectProjectLevelValidationProcessor;
			return serviceContainer.service;

		}]);
})(angular);
