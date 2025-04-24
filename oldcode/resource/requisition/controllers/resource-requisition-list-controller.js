(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'resource.requisition';
	var angModule = angular.module(moduleName);

	angModule.controller('resourceRequisitionListController', ResourceRequisitionListController);

	ResourceRequisitionListController.$inject = ['$scope', 'platformContainerControllerService','resourceRequisitionDataService','procurementStockAlternativeDialogService'];

	function ResourceRequisitionListController($scope, platformContainerControllerService,resourceRequisitionDataService,procurementStockAlternativeDialogService) {
		platformContainerControllerService.initController($scope, moduleName, '291a21ca7ab94d549d2d0c541ec09f5d');

		var tools = [
			{
				id: 'alternative',
				caption: 'procurement.stock.title.alternative',
				iconClass: 'tlb-icons ico-alternative',
				type: 'item',
				fn:function(){
					var selected = resourceRequisitionDataService.getSelected();
					if( selected&&!_.isNil(selected.MaterialFk )) {
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

		resourceRequisitionDataService.registerSelectionChanged(updateTools);

		$scope.$on('$destroy', function () {
			resourceRequisitionDataService.unregisterSelectionChanged(updateTools);
		});



	}
})();
