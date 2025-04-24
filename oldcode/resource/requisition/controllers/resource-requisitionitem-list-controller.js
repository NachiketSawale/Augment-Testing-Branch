/**
 * Created by shen on 10/2/2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.requisition';

	/**
	 * @ngdoc service
	 * @name resourceRequisitionItemListController
	 * @description pprovides methods to access, create and update resource requisitionitem entities
	 */
	angular.module(moduleName).controller('resourceRequisitionItemListController', resourceRequisitionItemListController);

	resourceRequisitionItemListController.$inject = ['$scope', 'platformContainerControllerService','resourceRequisitionItemDataService','procurementStockAlternativeDialogService'];

	function resourceRequisitionItemListController($scope,platformContainerControllerService,resourceRequisitionItemDataService,procurementStockAlternativeDialogService) {
		platformContainerControllerService.initController($scope, moduleName, '2236d94d1c8f4cdd8f9ab9150492ccdb');

		var tools = [
			{
				id: 'alternative',
				caption: 'procurement.stock.title.alternative',
				iconClass: 'tlb-icons ico-alternative',
				type: 'item',
				fn:function(){
					var selected = resourceRequisitionItemDataService.getSelected();
					if( selected&&!_.isNil(selected.MaterialFk)) {
						var materialId = selected.MaterialFk;
						var stockId = selected.StockFk;
						procurementStockAlternativeDialogService.showDialog({ requestId: materialId,stockId: stockId });
					}
					else{
						procurementStockAlternativeDialogService.noMaterialRecordMessage();
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

		resourceRequisitionItemDataService.registerSelectionChanged(updateTools);

		$scope.$on('$destroy', function () {
			resourceRequisitionItemDataService.unregisterSelectionChanged(updateTools);
		});




	}
})(angular);
