/**
 * Created by wui on 10/23/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('prcItemScopeListController', [
		'$scope',
		'platformGridControllerService',
		'prcItemScopeUIStandardService',
		'prcItemScopeDataService',
		'prcItemScopeValidationService',
		function ($scope,
			platformGridControllerService,
			prcItemScopeUIStandardService,
			prcItemScopeDataService,
			prcItemScopeValidationService) {
			var gridConfig = {
				columns: []
			};

			var dataService = prcItemScopeDataService.getService();
			var validationService = prcItemScopeValidationService.getService(dataService);
			var uiStandardService = prcItemScopeUIStandardService.getService(dataService);

			function ItemTypeChange() {
				$scope.parentItem = dataService.parentService().getSelected();
				if($scope.parentItem) {
					let itemTypeFk = $scope.parentItem.BasItemTypeFk;
					updateTools(itemTypeFk);
					let itemList = dataService.getList();
					_.forEach(itemList,(item)=>{
						dataService.readonlyFieldsByItemType(item,itemTypeFk);
					});
				}
			}
			dataService.updateToolsEvent.register(ItemTypeChange);

			dataService.parentService().registerSelectionChanged(onParentItemChanged);

			function onParentItemChanged() {
				$scope.parentItem = dataService.parentService().getSelected();
				if($scope.parentItem) {
					let itemTypeFk = $scope.parentItem.BasItemTypeFk;
					updateTools(itemTypeFk);
					let itemList = dataService.getList();
					_.forEach(itemList,(item)=>{
						dataService.readonlyFieldsByItemType(item,itemTypeFk);
					});
				}
			}


			function updateTools(itemTypeFk){
				var tools = $scope.tools;
				if(tools) {
					_.forEach($scope.tools.items, (item) => {
						if (item.id === 'create' || item.id === 'delete') {
							if (itemTypeFk === 7) {
								item.disabled = true;
							} else {
								item.disabled = false;
							}
						}
					});
					$scope.tools.update();
				}
			}

			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

			dataService.watch($scope);
		}
	]);

})(angular);