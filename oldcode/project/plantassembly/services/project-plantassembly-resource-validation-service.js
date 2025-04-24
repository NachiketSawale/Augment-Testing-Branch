/**
 * Created by juily.deshkar on 01.09.2021.
 */

(function () {
	'use strict';

	let moduleName = 'project.plantassembly';

	/**
     * @ngdoc service
     * @name projectPlantAssemblyResourceValidationService
     * @description provides validation methods for resource entities
     */
	angular.module(moduleName).factory('projectPlantAssemblyResourceValidationService',
		['estimateAssembliesResourceValidationServiceFactory', 'projectPlantAssemblyResourceService', 'projectPlantAssemblyMainService',
			function (estimateAssembliesResourceValidationService, projectPlantAssemblyResourceService, projectPlantAssemblyMainService) {

				let service = {};

				service = estimateAssembliesResourceValidationService.createEstAssemblyResourceValidationService(projectPlantAssemblyResourceService, projectPlantAssemblyMainService, false,false, true);

				return service;

			}
		]);

})();
