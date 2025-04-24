/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.revrecognition';

	/**
     * @ngdoc controller
     * @name controllingRevenueRecognitionItemListController
     * @function
     *
     * @description
     * Controller for the list view of Cost Headers (Actuals).
     **/
	angular.module(moduleName).controller('controllingRevenueRecognitionItemListController',
		['$scope', '_', 'platformGridAPI','platformModalService','platformGridControllerService','platformRuntimeDataService', 'controllingRevenueRecognitionItemService', 'controllingRevenueRecognitionItemValidationService','controllingRevenueRecognition2ItemUIStandardService','controllingRevenueRecognitionHeaderDataService',
			function ($scope, _, platformGridAPI,platformModalService, platformGridControllerService, platformRuntimeDataService,dataService,validateService,controllingRevenueRecognition2ItemUIStandardService,parentService) {

				var myGridConfig = {
					initCalled: false,
					lazyInit: true,
					columns: [],
					parentProp: 'PrrItemParentId',
					childProp: 'PrrItems',
				};

				platformGridControllerService.initListController($scope, controllingRevenueRecognition2ItemUIStandardService, dataService, validateService, myGridConfig);

				var onSelectedRowsChanged = function (e, item) {
					var parent=parentService.getSelected();
					// solve remark not update when change item
					if(item&&(item.ItemType>0)&&(item.PrrConfigurationFk>0)&&!parent.IsReadonlyStatus){
						platformRuntimeDataService.readonly(item, [{field: 'Remark', readonly: false}]);
					}
					else {
						platformRuntimeDataService.readonly(item, [{field: 'Remark', readonly: true}]);
					}
				};
				dataService.registerSelectionChanged(onSelectedRowsChanged);

				var prrItemAmountChanged = function (item) {
					if (item) {
						refreshAndInvalidateGrid();
					}
				};

				function refreshAndInvalidateGrid() {
					platformGridAPI.grids.refresh($scope.gridId);
					platformGridAPI.grids.invalidate($scope.gridId);
				}
				dataService.prrItemAmountChanged.register(prrItemAmountChanged);


				var toolbarItems = [
					{
						id: 't100',
						caption: 'Recalculate',
						type: 'item',
						cssClass: 'control-icons ico-recalculate',
						disabled: function () {
							var parentEntity=parentService.getSelected();
							if(!parentEntity||(parentEntity&&parentEntity.IsReadonlyStatus)){
								return true;
							}
							return false;
						},
						fn: function () {
							platformModalService.showYesNoDialog('controlling.revrecognition.recalculateTipMessage1', 'controlling.revrecognition.recalculateCaption', 'no')
								.then(function (result) {
									if (result.yes) {
										dataService.refreshItem();
									}
								});
						}
					}];
				platformGridControllerService.addTools(toolbarItems);

				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(onSelectedRowsChanged);
					dataService.prrItemAmountChanged.unregister(prrItemAmountChanged);
				});
			}
		]);
})(angular);
