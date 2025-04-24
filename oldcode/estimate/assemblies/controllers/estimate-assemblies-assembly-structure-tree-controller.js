/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesAssemblyStructureTreeController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Assembly entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateAssembliesAssemblyStructureTreeController',
		['$scope', 'estimateAssembliesStructureGridControllerService', 'estimateAssembliesAssembliesStructureService', 'estimateAssembliesService', 'estimateAssembliesFilterService',
			function ($scope, estimateAssembliesStructureGridControllerService, estimateAssembliesAssembliesStructureService, estimateAssembliesService, estimateAssembliesFilterService) {

				estimateAssembliesStructureGridControllerService.initAssembliesStructureController($scope, moduleName, estimateAssembliesAssembliesStructureService, estimateAssembliesService,
					estimateAssembliesFilterService, '179D44D751834DABB06EF4BA1F425D3C');
			}
		]);
})(angular);