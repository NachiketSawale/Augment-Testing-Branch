/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* globals _ */
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('costGroupStructureController', ['$scope', '$q', '$injector', '$timeout', 'costGroupStructureMainControllerService','estimateMainClipboardService',
		'estimateMainFilterService','estimateMainService','estimateMainValidationService','costGroupCatalogService','estimateCommonControllerFeaturesServiceProvider','estimateMainCommonFeaturesService',  'estimateMainLeadQuantityAggregatorConfigService',
		function ($scope, $q, $injector, $timeout,costGroupStructureMainControllerService,estimateMainClipboardService,estimateMainFilterService,estimateMainService,estimateMainValidationService,costGroupCatalogService,estimateCommonControllerFeaturesServiceProvider,estimateMainCommonFeaturesService, leadQuantityAggrConfigService)
		{
			$scope.gridId = $scope.getContainerUUID();

			costGroupStructureMainControllerService.initCostGroupController($scope, 'EstCostGrp','costGroupStructureController',costGroupCatalogService,'costGroupStructureDataServiceFactory', estimateMainClipboardService, estimateMainFilterService,estimateMainValidationService);
			estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);
			leadQuantityAggrConfigService.addAggrLeadQuantityTool($scope, 'costGroupStructureDataServiceFactory');
			estimateMainService.setIsEstimate(true);
			$scope.tools.items = _.filter($scope.tools.items,function(item){ return !['delete','createChild','create','t14','d0'].includes(item.id);});
			estimateMainCommonFeaturesService.disableTools($scope,['d1', 't7', 't8', 't9', 't10', 'd2',  't12', 'd1', 't109', 't13', 'gridSearchAll', 'gridSearchColumn', 't200']);
		}
	]);
})();
