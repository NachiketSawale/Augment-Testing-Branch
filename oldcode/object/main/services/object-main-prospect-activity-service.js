(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainProspectActivityService
	 * @function
	 *
	 * @description
	 * objectMainService is the data service for all Main related functionality.
	 **/
	var moduleName = 'object.main';
	var objectMainProspectActivityModule = angular.module(moduleName);
	objectMainProspectActivityModule.factory('objectMainProspectActivityService', ['platformDataServiceFactory', 'objectMainProspectService', 'platformDataServiceProcessDatesBySchemeExtension',

		function (platformDataServiceFactory, objectMainProspectService, platformDataServiceProcessDatesBySchemeExtension) {
			var factoryOptions = {
				flatLeafItem: {
					module: objectMainProspectActivityModule,
					serviceName: 'objectMainProspectActivityService',
					entityNameTranslationID: 'object.main.entityObjectMainProspectActivity',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/main/prospectactivity/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = objectMainProspectService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ProspectActivityDto',
						moduleSubModule: 'Object.Main'
					})],
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
						leaf: { itemName:'ProspectActivity', parentService: objectMainProspectService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			return serviceContainer.service;

		}]);
})(angular);
