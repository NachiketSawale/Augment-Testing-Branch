
(function (angular){
	'use strict';

	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).controller('controllingGeneralActualListController',
		['$scope', '_', '$timeout','platformGridControllerService', 'controllingGeneralcontractorControllerFeaturesServiceProvider','controllingGeneralActualConfigurationService', 'controllingGeneralActualDataService','$injector',
			function ($scope, _, $timeout, platformGridControllerService, controllerFeaturesServiceProvider, controllingGeneralActualConfigurationService, controllingGeneralActualDataService,$injector) {
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

				platformGridControllerService.initListController($scope, controllingGeneralActualConfigurationService, controllingGeneralActualDataService, null, myGridConfig);

				controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				let estimateCommonPaginationService = $injector.get('estimateCommonPaginationService');
				estimateCommonPaginationService.registerPagination($scope, controllingGeneralActualDataService);

				controllingGeneralActualDataService.refreshData();
			}
		]);
})(angular);