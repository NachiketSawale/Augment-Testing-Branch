/**
 * Created by wed on 6/19/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterGroupController',
		['$scope',
			'platformContainerControllerService',
			'constructionSystemMasterGroupService',
			'constructionSystemMasterHeaderService',
			'platformGridControllerService',
			'constructionSystemMasterGroupUIStandardService',
			'constructionSystemMasterGroupValidationService',
			'constructionSystemMasterGroupFilterService',
			function ($scope, platformContainerControllerService, constructionSystemMasterGroupService, constructionSystemMasterHeaderService, platformGridControllerService, constructionSystemMasterGroupUIStandardService, constructionSystemMasterGroupValidationService, constructionSystemMasterGroupFilterService) {
				// platformContainerControllerService.initController($scope, moduleName, '7fb0f988359341e6950d9f679d0c7b62');
				platformGridControllerService.initListController($scope, constructionSystemMasterGroupUIStandardService, constructionSystemMasterGroupService, constructionSystemMasterGroupValidationService, {
					parentProp: 'CosGroupFk',
					childProp: 'GroupChildren',
					marker: {
						filterService: constructionSystemMasterGroupFilterService,
						filterId: 'constructionSystemMasterGroupService',
						dataService: constructionSystemMasterGroupService,
						serviceName: 'constructionSystemMasterGroupService'
					},
					cellChangeCallBack: function cellChangeCallBack(arg) {
						constructionSystemMasterGroupService.onCellChange(arg);
					},
					rowChangeCallBack: function rowChangeCallBack(/* arg, buttons */) {

					}
				});

				// If entity modify we check code is empty or not,when update code can not be null.
				constructionSystemMasterGroupService.registerDataModified(function () {
					var selectedItem = constructionSystemMasterGroupService.getSelected();
					if(selectedItem){
						if(!selectedItem.Code) {
							constructionSystemMasterGroupValidationService.asyncValidateCode(selectedItem, selectedItem.Code, 'Code');
						}
					}
				});

				constructionSystemMasterHeaderService.registerRefreshRequested(constructionSystemMasterGroupService.refresh);

				$scope.$on('$destroy',function () {
					constructionSystemMasterHeaderService.unregisterRefreshRequested(constructionSystemMasterGroupService.refresh);
				});
			}]);
})(angular);