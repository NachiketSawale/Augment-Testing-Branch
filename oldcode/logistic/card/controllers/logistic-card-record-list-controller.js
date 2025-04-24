/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardRecordListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic card record entities.
	 **/

	angular.module(moduleName).controller('logisticCardRecordListController', LogisticCardRecordListController);

	LogisticCardRecordListController.$inject = ['_', '$scope', 'platformContainerControllerService','logisticCardRecordDataService','procurementStockAlternativeDialogService'];

	function LogisticCardRecordListController(_, $scope, platformContainerControllerService,logisticCardRecordDataService,procurementStockAlternativeDialogService) {
		platformContainerControllerService.initController($scope, moduleName, '1e6832ec58314f4bb772e0986f110d33');


		var tools = [
			{
				id: 'alternative',
				caption: 'procurement.stock.title.alternative',
				iconClass: 'tlb-icons ico-alternative',
				type: 'item',
				fn:function(){
					var selected = logisticCardRecordDataService.getSelected();
					if( selected && !_.isNil(selected.MaterialFk)) {
						var materialId = selected.MaterialFk;
						var articleCode = selected.CardRecordFk;
						var description = selected.CardRecordDescription;
						var stockId = selected.StockFk;
						var filterId = selected.Id;
						procurementStockAlternativeDialogService.showDialog({ requestId: materialId,code:articleCode,description:description,stockId: stockId,filterId:filterId });
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

		logisticCardRecordDataService.registerSelectionChanged(updateTools);

		$scope.$on('$destroy', function () {
			logisticCardRecordDataService.unregisterSelectionChanged(updateTools);
		});




	}
})(angular);
