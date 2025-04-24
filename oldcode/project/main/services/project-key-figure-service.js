(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainKeyFigureService
	 * @function
	 *
	 * @description
	 * projectMainKeyFigureService is the data service for all KeyFigure related functionality.
	 */
	/* jshint -W072 */
	projectMainModule.factory('projectMainKeyFigureService', ['projectMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function (projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			var clerkServiceInfo = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectKeyFigureService',
					entityNameTranslationID: 'project.main.entityKeyFigure',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'KeyFigureDto', moduleSubModule: 'Project.Main'})],
					httpCreate: { route: globals.webApiBaseUrl + 'project/main/keyfigure/' },
					httpRead: { route: globals.webApiBaseUrl + 'project/main/keyfigure/' },
					presenter: { list: { initCreationData: function initCreationData(creationData) {
						var project = projectMainService.getSelected();
						creationData.Id = project.Id;
						delete creationData.MainItemId;
					}}},
					entityRole: { leaf: { itemName: 'KeyFigures', parentService: projectMainService, parentFilter: 'projectId' } }
				} };

			var container = platformDataServiceFactory.createNewComplete(clerkServiceInfo);

			return container.service;

		}]);
})(angular);
