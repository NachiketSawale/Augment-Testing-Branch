/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.assemblies';
	angular.module(moduleName).controller('estimateAssembliesCostGroupCatalogController', ['$scope','$translate','$templateCache','$injector','platformGridAPI', 'estimateAssembliesCostGroupCatalogDataService','costGroupCatalogControllerFactory',
		function ($scope,$translate,$templateCache,$injector,platformGridAPI, estimateAssembliesCostGroupCatalogDataService,costGroupCatalogControllerFactory) {


			$scope.gridId ='DE46430A95B742F08952DB7CDFB3A57E';
			let estimateAssembliesService = $injector.get('estimateAssembliesService');

			estimateAssembliesCostGroupCatalogDataService.onContextUpdated();

			costGroupCatalogControllerFactory.initCostGroupCatalogController($scope,'estimateAssembliesCostGroupStructureDataServiceFactory',estimateAssembliesCostGroupCatalogDataService,estimateAssembliesService);

		}]);
})();
