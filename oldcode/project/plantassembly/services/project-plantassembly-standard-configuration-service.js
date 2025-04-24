/**
 * $Id:$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.plantassembly';

	/**
     * @ngdoc service
     * @name projectPlantassemblyStandardConfigurationService
     * @function
     *
     * @description
     * This service provides standard layouts for project Plant Assembly container
     */
	angular.module(moduleName).factory('projectPlantassemblyStandardConfigurationService', ['estimateAssembliesUIConfigurationServiceFactory',
		function (estimateAssembliesUIConfigurationServiceFactory) {
			let option = {
				isProjectPlantAssembly: true
			};

			let service = estimateAssembliesUIConfigurationServiceFactory.createEstAssembliesListUIConfigService(false, false, option.isProjectPlantAssembly);

			return service;
		}
	]);
})(angular);
