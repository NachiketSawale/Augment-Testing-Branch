/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesAssemblyResourcesTreeController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Assembly Resources entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateAssembliesAssemblyResourcesTreeController',
		['$scope', '$injector', 'estimateAssembliesResourcesTreeControllerFactory', 'estimateAssembliesResourceService', 'estimateAssembliesResourceDynamicConfigurationService',
			function ($scope, $injector, estimateAssembliesResourcesTreeControllerFactory, estimateAssembliesResourceService, estimateAssembliesResourceDynamicConfigurationService) {
				let isPrjAssembly = false;

				estimateAssembliesResourcesTreeControllerFactory.initAssembliesResourceController($scope, moduleName, estimateAssembliesResourceService, estimateAssembliesResourceDynamicConfigurationService, 'A32CE3F29BD446E097BC818F71B1263D', isPrjAssembly);
				
			}
		]);
})(angular);
