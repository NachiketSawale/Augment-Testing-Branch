/**
 * Created by winjit.deshkar.juily on 28.12.2023.
 */

(function (angular) {
    
	'use strict';
	let moduleName = 'project.plantassembly';
	/**
     * @ngdoc controller
     * @name projectPlantAssemblyResourceListController
     * @function
     *
     * @description
     * Controller for the list view of Plant Assembly Resources entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectPlantAssemblyResourceListController',
		['$scope', '$injector', 'estimateAssembliesResourcesTreeControllerFactory', 'projectPlantAssemblyResourceService','projectPlantAssemblyResourceDynamicConfigurationService',
			function ($scope, $injector, estimateAssembliesResourcesTreeControllerFactory, projectPlantAssemblyResourceService, projectPlantAssemblyResourceDynamicConfigurationService) {
				let isPrjAssembly = false;
				let options = {};
				options.isPrjPlantAssembly = true;
				options.resourcesDynamicUserDefinedColumnServiceName = 'projectPlantAssemblyResourceDynamicUserDefinedColumnService';

				estimateAssembliesResourcesTreeControllerFactory.initAssembliesResourceController($scope, moduleName, projectPlantAssemblyResourceService, projectPlantAssemblyResourceDynamicConfigurationService ,'bedc9497ca84537ae6c8cabbb0b8faeb', isPrjAssembly,options);

				$scope.$on('$destroy', function () {
				});
			}
		]);
})(angular);
