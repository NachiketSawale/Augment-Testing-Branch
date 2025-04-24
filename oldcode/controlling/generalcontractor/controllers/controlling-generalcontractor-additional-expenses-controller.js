
(function (angular){
	'use strict';

	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).controller('controllingGeneralContractorAdditionalExpensesListController',
		['$scope', '_', '$timeout','$injector','platformGridControllerService', 'controllingGeneralContractorAdditionalExpensesDataService','controllingGeneralContractorAdditionalExpensesConfigurationService',
			'controllingGeneralcontractorControllerFeaturesServiceProvider','platformGridAPI',
			function ($scope,_,$timeout,$injector,platformGridControllerService,controllingGeneralContractorAdditionalExpensesDataService,controllingGeneralContractorAdditionalExpensesConfigurationService,
				controllerFeaturesServiceProvider) {
				let myGridConfig = {
					initCalled: false,
					column:[],
					sortOption: {
						initialSortColumn:{field: 'code', id: 'code'},
						isAsc: true
					},
					cellChangeCallBack: function cellChangeCallBack() {

					},
					rowChangeCallBack: function rowChangeCallBack () {

					}
				};

				platformGridControllerService.initListController($scope, controllingGeneralContractorAdditionalExpensesConfigurationService, controllingGeneralContractorAdditionalExpensesDataService, null, myGridConfig);

				controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				let estimateCommonPaginationService = $injector.get('estimateCommonPaginationService');
				estimateCommonPaginationService.registerPagination($scope, controllingGeneralContractorAdditionalExpensesDataService);

				controllingGeneralContractorAdditionalExpensesDataService.refreshData();
			}
		]);
})(angular);