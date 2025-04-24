(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectProjectHeaderService
	 * @function
	 *
	 * @description
	 * objectProjectHeaderService is the data service for all Project related functionality.
	 */
	var moduleName = 'object.project';
	var objectProjectHeaderModule = angular.module(moduleName);
	objectProjectHeaderModule.factory('objectProjectHeaderService', ['platformDataServiceFactory', 'projectMainService', 'objectProjectHeaderValidationProcessor',

		function (platformDataServiceFactory, projectMainService, objectProjectHeaderValidationProcessor) {
			var factoryOptions = {
				flatNodeItem: {
					module: objectProjectHeaderModule,
					serviceName: 'objectProjectHeaderService',
					entityNameTranslationID: 'object.project.entityObjectProjectHeader',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/project/header/'
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = projectMainService.getSelected();
								creationData.Pkey1 = selected.Id;
							}
						}
					},
					entityRole: {
						node: {itemName: 'ObjectHeader', parentService: projectMainService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = objectProjectHeaderValidationProcessor;

			return serviceContainer.service;
		}]);
})(angular);
