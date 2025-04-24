/**
 * $Id: qto-cost-group-structure-controller.js 2021-10-10 10:03:14Z wul $
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'qto.main';

	angular.module(moduleName).controller('qtoCostGroupStructureController', ['$scope', '$q', '$injector', '$timeout', 'costGroupStructureMainControllerService',
		'qtoMainHeaderValidationService','qtoCostGroupCatalogService',
		function ($scope, $q, $injector, $timeout,costGroupStructureMainControllerService,qtoMainHeaderValidationService,costGroupCatalogService)
		{
			$scope.gridId = $scope.getContainerUUID();
			let filterServiceName = $scope.getContentValue('filterService');
			let filterService = $injector.get(filterServiceName);
			filterService.clearFilter();
			costGroupStructureMainControllerService.initCostGroupController($scope, 'EstCostGrp','qtoCostGroupCatalogController',costGroupCatalogService,'qtoCostGroupStructureDataServiceFactory', null, filterService, qtoMainHeaderValidationService);
			// leadQuantityAggrConfigService.addAggrLeadQuantityTool($scope, 'qtoCostGroupStructureDataServiceFactory');
		}
	]);
})();
