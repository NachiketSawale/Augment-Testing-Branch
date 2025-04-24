(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).controller('controllingGeneralContractorPesHeaderListController',
		['$scope', '$timeout', '_', '$injector', 'platformGridControllerService', 'controllingGeneralContractorPesHeaderDataService', 'controllingGeneralContractorPesHeaderConfigurationService',
			function ($scope, $timeout, _, $injector, platformGridControllerService, dataService, controllingGeneralContractorPesHeaderConfigurationService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					sortOptions: {
						initialSortColumn: {field: 'code', id: 'code'},
						isAsc: true
					},
					cellChangeCallBack: function cellChangeCallBack() {

					},
					rowChangeCallBack: function rowChangeCallBack() {

					}
				};

				platformGridControllerService.initListController($scope, controllingGeneralContractorPesHeaderConfigurationService, dataService, null, myGridConfig);

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