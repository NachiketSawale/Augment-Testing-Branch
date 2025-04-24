/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklisttemplate';
	angular.module(moduleName).controller('hsqeCheckListGroupController',
		['$scope',
			'_',
			'platformGridAPI',
			'platformContainerControllerService',
			'hsqeCheckListGroupService',
			'platformGridControllerService',
			'hsqeCheckListGroupUIStandardService',
			'hsqeCheckListTemplateHeaderService',
			'hsqeCheckListGroupValidationService',
			'hsqeCheckListGroupFilterService',
			function ($scope, _, platformGridAPI,platformContainerControllerService, hsqeCheckListGroupService, platformGridControllerService, hsqeCheckListGroupUIStandardService,hsqeCheckListTemplateHeaderService,hsqeCheckListGroupValidationService,hsqeCheckListGroupFilterService){

				platformGridControllerService.initListController($scope, hsqeCheckListGroupUIStandardService, hsqeCheckListGroupService,hsqeCheckListGroupValidationService, {
					parentProp: 'HsqCheckListGroupFk',
					childProp: 'HsqChecklistgroupChildren',
					marker: {
						filterService: hsqeCheckListGroupFilterService,
						filterId: 'hsqeCheckListGroupService',
						dataService: hsqeCheckListGroupService,
						serviceName: 'hsqeCheckListGroupService'
					},
					cellChangeCallBack: function cellChangeCallBack(arg) {
						hsqeCheckListGroupService.onCellChange(arg);
					},
					rowChangeCallBack: function rowChangeCallBack(/* arg, buttons */) {

					}
				});

				hsqeCheckListGroupService.registerDataModified(function () {
					var selectedItem = hsqeCheckListGroupService.getSelected();
					if(selectedItem){
						if(!selectedItem.Code) {
							hsqeCheckListGroupValidationService.asyncValidateCode(selectedItem, selectedItem.Code, 'Code');
						}
					}
				});

				function refreshGroupListService(){
					var grpStructureList  = hsqeCheckListGroupService.getData().itemTree;
					_.forEach(grpStructureList,function(item){
						item.IsMarked = false;
					});
					hsqeCheckListGroupFilterService.removeFilter();
					clearDefaultSelected();
					hsqeCheckListGroupService.load().then(function(){
						clearDefaultSelected();
					});
				}

				function clearDefaultSelected(){
					var grid = platformGridAPI.grids.element('id', $scope.gridId);
					grid.instance.resetActiveCell();
					grid.instance.setSelectedRows([]);
					grid.instance.invalidate();
					hsqeCheckListGroupService.clearSelectedItem();
				}

				hsqeCheckListTemplateHeaderService.registerRefreshRequested(refreshGroupListService);

				$scope.$on('$destroy',function () {
					hsqeCheckListTemplateHeaderService.unregisterRefreshRequested(refreshGroupListService);
				});
			}]);
})(angular);