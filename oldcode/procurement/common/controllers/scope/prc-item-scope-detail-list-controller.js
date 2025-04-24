(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('prcItemScopeDetailListController', [
		'$scope',
		'$injector',
		'platformControllerExtendService',
		'platformGridControllerService',
		'prcItemScopeDetailUIStandardService',
		'prcItemScopeDetailDataService',
		'prcItemScopeDetailValidationService',
		function ($scope,
			$injector,
			platformControllerExtendService,
			platformGridControllerService,
			prcItemScopeDetailUIStandardService,
			prcItemScopeDetailDataService,
			prcItemScopeDetailValidationService) {


			var uiStandardService = prcItemScopeDetailUIStandardService.getService();
			var dataService = prcItemScopeDetailDataService.getService();
			var validationService = prcItemScopeDetailValidationService.getService(dataService);

			var gridConfig = {
				columns: [],
				costGroupService : $injector.get('prcCommonPrcItemScopeDetailCostGroupService').getService(dataService)
			};

			function ItemTypeChange() {
				$scope.parentItem = dataService.parentService().parentService().getSelected();
				var parentItem = dataService.parentService().getSelected();
				if($scope.parentItem && parentItem) {
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
				$scope.parentItem = dataService.parentService().parentService().getSelected();
				var parentItem = dataService.parentService().getSelected();
				if($scope.parentItem && parentItem) {
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

			platformControllerExtendService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

			/* function costGroupLoaded(costGroupCatalogs){
                $injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, uiStandardService, costGroupCatalogs, dataService, validationService);
            }

            dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

            $scope.$on('$destroy', function () {
                dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
            });

            /!* add costGroupService to mainService *!/
            if(!dataService.costGroupService){
                dataService.costGroupService = $injector.get('prcCommonPrcItemScopeDetailCostGroupService').getService(dataService);
            }
            dataService.costGroupService.registerCellChangedEvent($scope.gridId);

            /!* refresh the columns configuration when controller is created *!/
            if(dataService.costGroupCatalogs){
                costGroupLoaded(dataService.costGroupCatalogs);
            } */

		}
	]);

})(angular);