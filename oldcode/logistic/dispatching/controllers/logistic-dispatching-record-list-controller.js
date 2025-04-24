/**
 * Created by baf on 30.01.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRecordListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic dispatching record entities.
	 **/

	angular.module(moduleName).controller('logisticDispatchingRecordListController', LogisticDispatchingRecordListController);

	LogisticDispatchingRecordListController.$inject = ['_', '$scope', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService',
		'logisticDispatchingRecordDataService', 'procurementStockAlternativeDialogService', 'logisticDispatchingHeaderValidationService'];

	function LogisticDispatchingRecordListController(_, $scope, platformContainerControllerService, platformContainerCreateDeleteButtonService,
		logisticDispatchingRecordDataService, procurementStockAlternativeDialogService, logisticDispatchingHeaderValidationService) {
		platformContainerControllerService.initController($scope, moduleName, '2aba47e0b663449e8cd86d5e6258e417');

		var tools = [
			{
				id: 'alternative',
				caption: 'procurement.stock.title.alternative',
				iconClass: 'tlb-icons ico-alternative',
				type: 'item',
				fn:function(){
					var selected = logisticDispatchingRecordDataService.getSelected();
					if(selected && !_.isNil(selected.MaterialFk)) {
						var materialId = selected.MaterialFk;
						var stockId = selected.PrjStockFk;
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
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig,logisticDispatchingRecordDataService);
			if ($scope.tools) {
				$scope.tools.update();
			}
		};

		logisticDispatchingRecordDataService.registerSelectionChanged(updateTools);
		logisticDispatchingHeaderValidationService.registerCompletionCallback(updateTools);

		$scope.$on('$destroy', function () {
			logisticDispatchingRecordDataService.unregisterSelectionChanged(updateTools);
			logisticDispatchingHeaderValidationService.unregisterCompletionCallback(updateTools);
		});
	}
})(angular);
