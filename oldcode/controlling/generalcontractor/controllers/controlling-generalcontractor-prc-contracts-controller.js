(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).controller('controllingGeneralContractorPrcContractsController', ['$scope', '$injector', '$timeout', '_',
		'platformGridControllerService', 'controllingGeneralContractorPrcContractsDataService', 'controllingGeneralContractorPrcContractsConfigurationService',
		function ($scope, $injector, $timeout, _,
			platformGridControllerService, dataService, controllingGeneralContractorPrcContractsConfigurationService) {

			let myGridConfig = {
				initCalled: false, columns: [],
				sortOptions: {
					initialSortColumn: {field: 'code', id: 'code'},
					isAsc: true
				}
			};

			platformGridControllerService.initListController($scope, controllingGeneralContractorPrcContractsConfigurationService, dataService, null, myGridConfig);

			let controllerFeaturesServiceProvider = $injector.get('controllingGeneralcontractorControllerFeaturesServiceProvider');
			controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

			dataService.refreshData();

			$injector.get('controllingGeneralcontractorCostControlDataService').onDueDatesChanged.register(dataService.load);
			$scope.$on ('$destroy', function () {
				$injector.get('controllingGeneralcontractorCostControlDataService').onDueDatesChanged.unregister(dataService.load);
			});
		}
	]);
})(angular);
