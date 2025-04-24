(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).controller('controllingGeneralContractorSalesContractsListController',
		['$scope','$injector','$timeout', '_', 'platformGridControllerService', 'controllingGeneralContractorSalesContractsDataService', 'controllingGeneralContractorSalesContractsConfigurationService',
			function ($scope,$injector,$timeout, _, platformGridControllerService, dataService, controllingGeneralContractorSalesContractsConfigurationService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					sortOptions: {
						initialSortColumn: {field: 'code', id: 'code'},
						isAsc: true
					}
				};

				platformGridControllerService.initListController ($scope, controllingGeneralContractorSalesContractsConfigurationService, dataService, null, myGridConfig);
				dataService.setGridId($scope.gridId);

				let controllerFeaturesServiceProvider = $injector.get ('controllingGeneralcontractorControllerFeaturesServiceProvider');
				controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				dataService.registerRefreshRequested(dataService.refreshSalesContracts);

				dataService.loadSalesContracts();

				$scope.$on ('$destroy', function () {
					dataService.unregisterRefreshRequested(dataService.refreshSalesContracts);
				});
			}
		]);
})(angular);
