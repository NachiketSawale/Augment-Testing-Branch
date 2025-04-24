/*
 * Created by lnb on 6/5/2015.
 */
// eslint-disable-next-line no-redeclare
/* global angular,_ */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementStockStockTotalGridController',
		['$scope', '$translate', 'platformGridControllerService', 'procurementStockStockTotalDataService', 'procurementStockStockTotalUIStandardService',
			'procurementStockAlternativeDialogService','procurementCommonClipboardService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns,procurementStockAlternativeDialogService,
				procurementCommonClipboardService) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					type: 'procurement.stock',
					dragDropService: procurementCommonClipboardService,
					options: {
						editable: false,
						readonly:false
					}
				};

				dataService.createItem = false;
				dataService.deleteItem = false;

				gridControllerService.initListController($scope, gridColumns, dataService, {}, gridConfig);

				var tools = [
					{
						id: 'combineGroup',
						caption: 'procurement.stock.title.alternative',
						iconClass: 'tlb-icons ico-alternative',
						type: 'item',
						disabled: function(){
							return _.isEmpty(dataService.getSelected());
						},
						fn:function(){
							var selected=dataService.getSelected();
							if(selected) {
								var materialId = selected.MdcMaterialFk;
								var stockId = selected.PrjStockFk;
								var materialCode=selected.MaterialCode;
								var materialDecription=selected.Description1;
								var filterId=selected.Id;
								procurementStockAlternativeDialogService.showDialog({ requestId: materialId,code:materialCode,description:materialDecription,stockId: stockId,filterId:filterId});
							}

						}
					}
				];
				$scope.addTools(tools);

				var updateTools = function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				};

				dataService.registerSelectionChanged(updateTools);

				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(updateTools);
				});

			}]);
})(angular);