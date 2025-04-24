/**
 * Created by mov on 27.07.2021.
 */

/* global angular */

(function () {

	'use strict';
	var moduleName = 'project.assembly';

	/**
     * @ngdoc controller
     * @name projectAssemblyStructureController
     * @function
     *
     * @description
     * projectAssemblyStructureController
     **/

	angular.module(moduleName).controller('projectAssemblyStructureController',
		['$scope', 'estimateAssembliesStructureGridControllerService', 'projectAssemblyStructureService', 'projectAssemblyMainService', 'projectAssemblyFilterService',
			function ($scope, estimateAssembliesStructureGridControllerService, projectAssemblyStructureService, projectAssemblyMainService, projectAssemblyFilterService) {

				estimateAssembliesStructureGridControllerService.initAssembliesStructureController($scope, moduleName, projectAssemblyStructureService, projectAssemblyMainService,
					projectAssemblyFilterService, 'b0b09a5709be478e9da50d8adbd3aa6d');


				projectAssemblyStructureService.IsActived = true;

				$scope.$on('$destroy', function () {
					delete projectAssemblyStructureService.IsActived;
				});

			}
		]);
})();