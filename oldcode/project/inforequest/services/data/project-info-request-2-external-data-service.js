(function (angular) {
	'use strict';
	var myModule = angular.module('project.inforequest');

	/**
	 * @ngdoc service
	 * @name projectInfoRequest2ExternalDataService
	 * @description pprovides methods to access, create and update inforequest2external  entities
	 */
	myModule.service('projectInfoRequest2ExternalDataService', ProjectInfoRequest2ExternalDataService);

	ProjectInfoRequest2ExternalDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceEntityReadonlyProcessor', 'changeMainConstantValues', 'projectInfoRequestDataService'];

	function ProjectInfoRequest2ExternalDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformDataServiceEntityReadonlyProcessor, changeMainConstantValues, projectInfoRequestDataService) {
		var self = this;
		var projectInfoRequestServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectInfoRequest2ExternalDataService',
				entityNameTranslationID: 'project.inforequest.inforequest2ExternalEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/rfi/inforequest2external/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectInfoRequestDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{typeName: 'InfoRequest2ExternalDto', moduleSubModule: 'Project.InfoRequest'}),
				platformDataServiceEntityReadonlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectInfoRequestDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'InfoRequest2External', parentService: projectInfoRequestDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectInfoRequestServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
