/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('costGroupCatalogController', ['$scope','$translate','$templateCache','$injector','platformGridAPI','costGroupCatalogControllerFactory', 'costGroupCatalogService',
		function ($scope,$translate,$templateCache,$injector,platformGridAPI,costGroupCatalogControllerFactory, costGroupCatalogService) {

			$scope.gridId ='e4e860cfc33d4b5985f097d427635013';
			let estimateMainService = $injector.get('estimateMainService');
			let estimateCommonControllerFeaturesServiceProvider = $injector.get('estimateCommonControllerFeaturesServiceProvider');

			estimateMainService.onContextUpdated.register(costGroupCatalogService.onContextUpdated);
			costGroupCatalogService.onContextUpdated();

			costGroupCatalogControllerFactory.initCostGroupCatalogController($scope,'costGroupStructureDataServiceFactory',costGroupCatalogService,estimateMainService);

			estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

			$scope.$on('$destroy', function () {
				estimateMainService.onContextUpdated.unregister(costGroupCatalogService.onContextUpdated);
			});
		}]);
})();
