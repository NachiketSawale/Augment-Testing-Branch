/**
 * Created by chi on 1/31/2018.
 */
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.pes';
	angular.module(moduleName).controller('procurementPesAccrualGridController', procurementPesAccrualGridController);

	procurementPesAccrualGridController.$inject = ['$scope', 'platformGridControllerService', 'procurementPesAccrualUIStandardService',
		'procurementPesAccrualDataService'];

	function procurementPesAccrualGridController($scope, platformGridControllerService, procurementPesAccrualUIStandardService,
		procurementPesAccrualDataService) {
		var gridConfig = {
			initCalled: false,
			columns: []
		};
		platformGridControllerService.initListController($scope, procurementPesAccrualUIStandardService, procurementPesAccrualDataService, {}, gridConfig);
	}
})(angular);