/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).controller('estimateAssembliesCostGroupStructureController', ['$scope', '$q', '$injector', '$timeout', 'costGroupStructureMainControllerService','estimateAssembliesClipboardService', 'estimateAssembliesFilterService','estimateAssembliesValidationService','estimateAssembliesCostGroupCatalogDataService',
		function ($scope, $q, $injector, $timeout,costGroupStructureMainControllerService,estimateAssembliesClipboardService, estimateAssembliesFilterService,estimateAssembliesValidationService,estimateAssembliesCostGroupCatalogDataService)
		{

			$scope.gridId = $scope.getContainerUUID();
			costGroupStructureMainControllerService.initCostGroupController($scope, 'EstCostGrp','estimateAssembliesCostGroupStructureController',estimateAssembliesCostGroupCatalogDataService, 'estimateAssembliesCostGroupStructureDataServiceFactory', estimateAssembliesClipboardService, estimateAssembliesFilterService,estimateAssembliesValidationService);

		}
	]);
})();
