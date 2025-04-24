(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainGeneralService
	 * @function
	 *
	 * @description
	 * projectMainGeneralService is the data service for all generals related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectMainGeneralService', ['projectMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function (projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			var clerkServiceInfo = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectGeneralService',
					entityNameTranslationID: 'basics.general.entityGeneral',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'GeneralDto', moduleSubModule: 'Project.Main'})],
					httpCreate: { route: globals.webApiBaseUrl + 'project/main/general/' },
					httpRead: { route: globals.webApiBaseUrl + 'project/main/general/' },
					presenter: { list: { initCreationData: function initCreationData(creationData) {
						var project = projectMainService.getSelected();
						creationData.Id = project.Id;
						delete creationData.MainItemId;
					}}},
					entityRole: { leaf: { itemName: 'Generals', parentService: projectMainService, parentFilter: 'projectId' } }
				} };

			var container = platformDataServiceFactory.createNewComplete(clerkServiceInfo);

			return container.service;

		}]);
})(angular);
