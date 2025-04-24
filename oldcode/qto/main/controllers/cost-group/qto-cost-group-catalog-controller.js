/**
 * $Id: qto-cost-group-catalog-controller.js 2021-10-10 10:03:14Z wul $
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'qto.main';
	angular.module(moduleName).controller('qtoCostGroupCatalogController', ['$scope','$translate','$templateCache','$injector','platformGridAPI','costGroupCatalogControllerFactory', 'qtoCostGroupCatalogService',
		function ($scope,$translate,$templateCache,$injector,platformGridAPI,costGroupCatalogControllerFactory, costGroupCatalogService) {

			$scope.gridId ='e4e860cfc33d4b5985f097d427635013';
			let dataMainService = $injector.get($scope.getContentValue('mainService'));
			let estimateCommonControllerFeaturesServiceProvider = $injector.get('estimateCommonControllerFeaturesServiceProvider');

			costGroupCatalogService.clearData();

			dataMainService.onContextUpdated.register(costGroupCatalogService.onContextUpdated);
			costGroupCatalogService.onContextUpdated();

			dataMainService.costGroupCatalogService = costGroupCatalogService;

			costGroupCatalogControllerFactory.initCostGroupCatalogController($scope,'qtoCostGroupStructureDataServiceFactory',costGroupCatalogService,dataMainService);

			estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

			let selectedQtoHeader = dataMainService.getSelected();
			if(selectedQtoHeader && selectedQtoHeader.ProjectFk > 0){
				costGroupCatalogService.loadData();
			}

			$scope.$on('$destroy', function () {
				dataMainService.onContextUpdated.unregister(costGroupCatalogService.onContextUpdated);
			});
		}]);
})();
