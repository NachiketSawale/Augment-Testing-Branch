(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).controller('controllingGeneralContractorPackagesListController',
		['$scope','$timeout', '_','$injector', 'platformGridControllerService', 'controllingGeneralContractorPackagesDataService', 'controllingGeneralContractorPackagesConfigurationService',
			function ($scope,$timeout, _,$injector, platformGridControllerService, dataService, controllingGeneralContractorPackagesConfigurationService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					sortOptions: {
						initialSortColumn: {field: 'code', id: 'code'},
						isAsc: true
					}
				};

				platformGridControllerService.initListController($scope, controllingGeneralContractorPackagesConfigurationService, dataService, null, myGridConfig);

				let controllerFeaturesServiceProvider = $injector.get ('controllingGeneralcontractorControllerFeaturesServiceProvider');
				controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				dataService.refreshData();

				$injector.get('controllingGeneralcontractorCostControlDataService').onDueDatesChanged.register(dataService.load);

				$scope.$on ('$destroy', function () {
					$injector.get('controllingGeneralcontractorCostControlDataService').onDueDatesChanged.unregister(dataService.load);
				});
			}
		]);
})(angular);
