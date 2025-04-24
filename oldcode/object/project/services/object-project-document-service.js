
(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectProjectDocumentMainService
	 * @function
	 *
	 * @description
	 * objectProjectDocumentMainService is the data service for all Project related functionality.
	 */
	var moduleName= 'object.project';
	var objectProjectDocumentModule = angular.module(moduleName);
	objectProjectDocumentModule.factory('objectProjectMainService', ['platformDataServiceFactory',

		function (platformDataServiceFactory) {
			var factoryOptions = {
				flatRootItem: {
					module: objectProjectDocumentModule,
					serviceName: 'objectProjectDocumentMainService',
					entityNameTranslationID: 'object.project.entityObjectProjectDocument',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/project/document/', endRead: 'listfiltered', usePostForRead: true
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						root: {itemName: 'Document', moduleName: 'Document'}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			return serviceContainer.service;

		}]);
})(angular);
