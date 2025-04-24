/*
 * Created by lnb on 6/5/2015.
 */

// eslint-disable-next-line no-redeclare
/* global angular */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('stockTransactionController',
		['$scope', '$translate', 'platformGridControllerService', 'procurementStockTransactionDataService', 'procurementStockTransactionUIStandardService',
			'procurementStockTransactionValidationService','procurementStockHeaderDataService','procurementStockStockTotalDataService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns,ValidationService,procurementStockHeaderDataService,procurementStockStockTotalDataService) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					options: {
						editable: false,
						readonly:false
					}
				};

				gridControllerService.initListController($scope, gridColumns, dataService, ValidationService, gridConfig);

				$scope.addTools([{
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('procurement.common.total.dirtyRecalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					permission: '#w',
					disabled: function () {
						return !dataService.canRecalculate();

					},
					fn: function updateCalculation() {
						// dataService.updateCalculation();
						// TODO:workaround, it should use one request to reload and also calculate it
						var that = this;
						if(!that.isCalculating){
							that.isCalculating = true;
							procurementStockHeaderDataService.update().finally(function(){
								that.isCalculating = false;
							});
						}

					}
				}]);


				var updateTools = function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				};

				procurementStockHeaderDataService.registerSelectionChanged(updateTools);
			}]);
})(angular);