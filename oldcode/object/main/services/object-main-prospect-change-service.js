(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainService
	 * @function
	 *
	 * @description
	 * objectMainService is the data service for all Main related functionality.
	 */
	var moduleName= 'object.main';
	var objectMainProspectChangeModule = angular.module(moduleName);
	objectMainProspectChangeModule.factory('objectMainProspectChangeService', ['platformDataServiceFactory','objectMainProspectService','platformDataServiceProcessDatesBySchemeExtension',

		function (platformDataServiceFactory, objectMainProspectService, platformDataServiceProcessDatesBySchemeExtension) {
			var factoryOptions = {
				flatLeafItem: {
					module: objectMainProspectChangeModule,
					serviceName: 'objectMainService',
					entityNameTranslationID: 'object.main.entityObjectMainProspectChange',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/main/prospectchange/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = objectMainProspectService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'ProspectChangeDto', moduleSubModule: 'Object.Main'})],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = objectMainProspectService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: { itemName: 'ProspectChange', parentService: objectMainProspectService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			return serviceContainer.service;

		}]);
})(angular);
