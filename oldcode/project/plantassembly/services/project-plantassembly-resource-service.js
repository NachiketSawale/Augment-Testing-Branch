/**
 * Created by winjit.deshkar.juily on 28-12-2023.
 */

(function () {
	'use strict';

	let moduleName = 'project.plantassembly';
	let projectPlantAssembliesModule = angular.module(moduleName);

	projectPlantAssembliesModule.factory('projectPlantAssemblyResourceService',
		['estimateAssembliesResourceServiceFactory', 'projectPlantAssemblyMainService', 'estimateMainResourceImageProcessor','PlatformMessenger','platformRuntimeDataService',
			function (estimateAssembliesResourceServiceFactory, projectPlantAssemblyMainService, estimateMainResourceImageProcessor,PlatformMessenger,platformRuntimeDataService) {

				let option = {
					module: projectPlantAssembliesModule,
					parent: projectPlantAssemblyMainService,
					serviceName: 'projectPlantAssemblyResourceService',
					itemName: 'PrjPlantAssemblyResource',
					isPrjPlantAssembly:true,
					isPrjAssembly:false,
					assemblyResourceDynamicUserDefinedColumnService: 'projectPlantAssemblyResourceDynamicUserDefinedColumnService'
				};

				let serviceContainer = estimateAssembliesResourceServiceFactory.createNewEstAssembliesResourceService(option);
				serviceContainer.data.usesCache = false;
				let service = serviceContainer.service;

				function getDataOriginal() {
					return angular.copy(serviceContainer.data.itemListOriginal);
				}

				function getData() {
					return serviceContainer.data;
				}

				service.getDataOriginal = getDataOriginal;
				service.getData = getData;

				service.setReadOnly = function setReadOnly (readOnly) {
					let list = service.getList();
					_.forEach (list, function (item) {
						let fields = [];
						_.forOwn(item, function (value, key) {
							let field = {field: key, readonly: readOnly};
							fields.push(field);
						});
						platformRuntimeDataService.readonly(item,fields);
					});
				};

				return service;
			}]);
})();