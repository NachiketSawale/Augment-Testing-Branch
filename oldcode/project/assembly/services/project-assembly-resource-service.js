/**
 * Created by mov on 06.10.2021.
 */

(function () {
	'use strict';

	let moduleName = 'project.assembly';
	let projectAssembliesModule = angular.module(moduleName);

	projectAssembliesModule.factory('projectAssemblyResourceService',
		['estimateAssembliesResourceServiceFactory', 'projectAssemblyMainService', 'estimateMainResourceImageProcessor','PlatformMessenger','platformRuntimeDataService',
			function (estimateAssembliesResourceServiceFactory, projectAssemblyMainService, estimateMainResourceImageProcessor,PlatformMessenger,platformRuntimeDataService) {

				let option = {
					module: projectAssembliesModule,
					isPrjAssembly: true,
					parent: projectAssemblyMainService,
					serviceName: 'projectAssemblyResourceService',
					itemName: 'PrjEstResource',
					assemblyResourceDynamicUserDefinedColumnService: 'projectAssemblyResourceDynamicUserDefinedColumnService'
				};

				let serviceContainer = estimateAssembliesResourceServiceFactory.createNewEstAssembliesResourceService(option);
				serviceContainer.data.usesCache = false;
				let service = serviceContainer.service;

				service.onPrjAssemlyChanged = new PlatformMessenger();

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