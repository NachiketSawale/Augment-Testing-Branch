/**
 * $Id: project-plantassembly-resource-dynamic-user-defined-column-service.js winjit.juily.deshkar
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'project.plantassembly';
	/**
     * @ngdoc service
     * @name projectPlantAssemblyResourceDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * projectPlantAssemblyResourceDynamicUserDefinedColumnService is the config service for resource dynamic user defined column
     */
	angular.module(moduleName).factory('projectPlantAssemblyResourceDynamicUserDefinedColumnService', ['estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory) {
			let options = {
					isPrjPlantAssembly : true,
					moduleName : 'ProjectPlantAssemblyResource',
					resourceDynamicConfigurationService : 'projectPlantAssemblyResourceDynamicConfigurationService',
					assemblyDynamicUserDefinedColumnService : 'projectPlantAssemblyDynamicUserDefinedColumnService',
					dataService : 'projectPlantAssemblyResourceService',
					uuid: 'bedc9497ca84537ae6c8cabbb0b8faeb'
				},
				isPrjAssembly = false;

			return estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory.initService(isPrjAssembly, options);
		}

	]);

})(angular);