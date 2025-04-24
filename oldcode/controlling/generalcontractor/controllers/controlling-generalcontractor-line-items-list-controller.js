(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).controller('controllingGeneralContractorLineItemsListController',
		['$scope','$timeout', '_','$injector', 'platformGridControllerService', 'controllingGeneralContractorLineItemsDataService', 'controllingGeneralContractorLineItemsConfigurationService',
			function ($scope,$timeout, _,$injector, platformGridControllerService, dataService, controllingGeneralContractorLineItemsConfigurationService) {

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

				platformGridControllerService.initListController($scope, controllingGeneralContractorLineItemsConfigurationService, dataService, null, myGridConfig);

				let controllerFeaturesServiceProvider = $injector.get ('controllingGeneralcontractorControllerFeaturesServiceProvider');
				controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);



				let estimateCommonPaginationService = $injector.get('estimateCommonPaginationService');
				estimateCommonPaginationService.registerPagination($scope, dataService);


				dataService.refreshData();

				$injector.get('controllingGeneralcontractorCostControlDataService').onDueDatesChanged.register(dataService.load);

				$scope.$on ('$destroy', function () {
					$injector.get('controllingGeneralcontractorCostControlDataService').onDueDatesChanged.unregister(dataService.load);
				});
			}

		]);
})(angular);
