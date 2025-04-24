/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */

	'use strict';
	let moduleName = 'estimate.assemblies';
	let estimateAssembliesModule = angular.module(moduleName);
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateAssembliesModule.factory('estimateAssembliesAssembliesStructureService', [
		'$http', 'estimateAssembliesStructureServiceFactory', 'ServiceDataProcessArraysExtension', 'estimateAssembliesStructureImageProcessor', 'estAssemblyRuleParamIconProcess', 'estimateAssembliesStructureProcessor', 'platformModalService',
		function ($http, estimateAssembliesStructureServiceFactory, ServiceDataProcessArraysExtension, estimateAssembliesStructureImageProcessor, estAssemblyRuleParamIconProcess, estimateAssembliesStructureProcessor, platformModalService) {

			let serviceContainer = estimateAssembliesStructureServiceFactory.createNewEstAssembliesStructureService({
				dataProcessor: [new ServiceDataProcessArraysExtension(['AssemblyCatChildren']),
					estimateAssembliesStructureImageProcessor,
					estimateAssembliesStructureProcessor, estAssemblyRuleParamIconProcess],
				structureProcessor: estimateAssembliesStructureProcessor,
				assemblyFilterService: 'estimateAssembliesFilterService'
			});

			let service = serviceContainer.service;

			let originalDeleteEntities = serviceContainer.data.deleteItem;
			serviceContainer.data.deleteItem = deleteEntity;
			function deleteEntity(entity,data) {
				if (entity) {
					let postData = {
						Id: entity.Id,
						LineItemContextFk: entity.LineItemContextFk
					};
					let isProjectStructureRelated = false;
					return $http.post(globals.webApiBaseUrl + 'estimate/assemblies/structure/isProjectAssemblyCatRelated', postData).then(function (response) {
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

			return service;
		}]);
})();
