/**
 * Created by mov on 06.10.2021.
 */

/* global angular, globals, _ */

(function () {
	'use strict';

	var moduleName = angular.module('project.assembly');

	moduleName.factory('projectAssemblyStructureService',
		['$injector', '$http', 'estimateAssembliesStructureServiceFactory', 'projectAssemblyStructureProcessor', 'projectMainService', 'ServiceDataProcessArraysExtension', 'estimateAssembliesStructureImageProcessor', 'estAssemblyRuleParamIconProcess', 'platformModalService',
			function ($injector, $http, estimateAssembliesStructureServiceFactory, projectAssemblyStructureProcessor, projectMainService, ServiceDataProcessArraysExtension, estimateAssembliesStructureImageProcessor, estAssemblyRuleParamIconProcess, platformModalService) {

				let option = {
					isPrjAssembly: true,
					parent: projectMainService,
					serviceName: 'projectAssemblyStructureService',
					dataProcessor: [new ServiceDataProcessArraysExtension(['AssemblyCatChildren']),
						estimateAssembliesStructureImageProcessor,
						projectAssemblyStructureProcessor, estAssemblyRuleParamIconProcess],
					structureProcessor: projectAssemblyStructureProcessor,
					assemblyFilterService: 'projectAssemblyFilterService'
				};
				let serviceContainer = estimateAssembliesStructureServiceFactory.createNewEstAssembliesStructureService(option);
				let service = serviceContainer.service ? serviceContainer.service : {};
				let originalDeleteEntities = serviceContainer.data.deleteItem;
				serviceContainer.data.deleteItem = deleteEntity;
				function deleteEntity(entity,data) {
					if (entity) {
						let isProjectStructureRelated = false;
						let urlGet = 'basics/common/dependent/gettotalcount?mainItemId='+ entity.Id +'&moduleIdentifer=project.assembly.catalog&projectId='+entity.PrjProjectFk+'&headerId=0';
						return $http.get(globals.webApiBaseUrl + urlGet).then(function (response) {
							isProjectStructureRelated = response.data;
							if (isProjectStructureRelated) {
								let modalOptions = {
									headerTextKey: 'cloud.common.errorMessage',
									bodyTextKey: 'estimate.assemblies.dialog.WarningAssignedAssemblyToProjectCatalog',
									iconClass: 'ico-error',
									height: '185px',
									width:'700px'
								};
								return platformModalService.showDialog(modalOptions);
							} else {
								originalDeleteEntities(entity, data);
							}
						});
					}
				}

				service.setNavigateId = function (assemblyCategoryId) {
					option.navigateAssemblyCategoryId = assemblyCategoryId;
				};

				return service;
			}]);
})();