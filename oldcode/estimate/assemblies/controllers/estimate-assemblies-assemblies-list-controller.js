/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesAssembliesListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Assembly entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateAssembliesAssembliesListController',
		['$scope', '$injector', 'estimateAssembliesService', 'estimateAssembliesAssembliesListControllerFactory', 'projectAssemblyValidationService', 'estimateAssembliesResourceService', 'estimateAssembliesFilterService',
			function ($scope, $injector, estimateAssembliesService, estimateAssembliesAssembliesListControllerFactory, projectAssemblyValidationService, estimateAssembliesResourceService, estimateAssembliesFilterService) {

				estimateAssembliesAssembliesListControllerFactory.initAssembliesListController($scope, moduleName, estimateAssembliesService, projectAssemblyValidationService, estimateAssembliesResourceService,
					estimateAssembliesFilterService, '234BB8C70FD9411299832DCCE38ED118');

			}
		]);
})(angular);
