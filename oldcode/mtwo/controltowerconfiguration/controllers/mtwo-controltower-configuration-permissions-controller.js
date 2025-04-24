/**
 * Created by waldrop on 9/16/2019
 */

(function (angular) {
	'use strict';

	var moduleName = 'mtwo.controltowerconfiguration';

	/**
	 * @ngdoc controller
	 * @name mtwoControltowerConfigurationPermissionsController
	 * @function
	 *
	 * @description
	 * Controller for the list view of mtwo controltower configuration entities.
	 **/

	angular.module(moduleName).controller('mtwoControltowerConfigurationPermissionsController', mtwoControltowerConfigurationPermissionsController);

	mtwoControltowerConfigurationPermissionsController.$inject = [
		'$scope',
		'platformGridControllerService',
		'mtwoPermissionManagementService',
		'platformGridAPI',
		'mtwoControlTowerConfigurationPermissionsConfigurationService',
		'usermanagementRightDescriptorStructureSelectionDialog',
		'mtwoControlTowerConfigurationPermissionsDialog',
	   '$translate'];

	function mtwoControltowerConfigurationPermissionsController(
		$scope,
		platformGridControllerService,
		mtwoPermissionManagementService,
		platformGridAPI,
		mtwoControlTowerConfigurationPermissionsConfigurationService,
		usermanagementRightDescriptorStructureSelectionDialog,
		mtwoControlTowerConfigurationPermissionsDialog,
		$translate) {

		$scope.gridId = '8b7b355acb6a457e95985b07f36549fd';
		var gridConfig = {
			initCalled: true,
			columns: [],
			parentProp: 'ParentId',
			childProp: 'Modules',
		};

		// platformContainerControllerService.initController($scope, moduleName, '8b7b355acb6a457e95985b07f36549fd');
		platformGridControllerService.initListController($scope, mtwoControlTowerConfigurationPermissionsConfigurationService, mtwoPermissionManagementService, {}, gridConfig);
		var disabledDelete= function()
		{
			let selectedItem = mtwoPermissionManagementService.getSelected();

			// return !selectedItem || !selectedItem.ParentId;
			return false;
		};

		$scope.setTools({
			showImages: true,
			shotTitles: true,
			cssClass: 'tools',
			version: 0,
			items: [
				{
					id: 't11',
					sort: 200,
					caption: 'cloud.common.toolbarRefresh',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					fn: function refresh() {
						mtwoPermissionManagementService.refresh();
					}
				},
				{
					id: 't1001',
					sort: 3,
					caption: $translate.instant('cloud.common.toolbarDelete'),
					type: 'item',
					iconClass: 'tlb-icons ico-rec-delete',
					fn: function () {
						let selectedItems = mtwoPermissionManagementService.getSelectedEntities();
						if (selectedItems){
							_.forEach(selectedItems, function(item){
								if(item && item.ParentId)
								{
									let parentItem = _.find(mtwoPermissionManagementService.getList(),{Id:item.ParentId});
									_.remove(parentItem.Modules,item);
									parentItem.Permissions = parentItem.Modules.map(m=>m.InternalName).join(',');
									mtwoPermissionManagementService.markItemAsModified(parentItem);
								}
							});
							mtwoPermissionManagementService.removeSelected(selectedItems);
							mtwoPermissionManagementService.gridRefresh();
						}
					},
					disabled: function () {
						return disabledDelete();
					}
				}
			],
			update: function () {
				++$scope.tools.version;
			}
		});
		$scope.tools.items = _.filter($scope.tools.items,item=>item.id !== 'delete');
		$scope.tools.items = _.filter($scope.tools.items,item=>item.id !== 'createChild');
		var containerScope;

		containerScope = $scope.$parent;

		function changeEdgeCaseNames(name) {
			if (name === 'Construction System Instance') {
				return 'Construction System Main';
			}
			return name;
		}

		containerScope.tools.items[1].fn = function () {
			// mtwoPermissionManagementService.updatePermissions();
			mtwoControlTowerConfigurationPermissionsDialog.showDialog().then(function (response) {
				if (response.data) {
					var selected = mtwoPermissionManagementService.getSelected();
					if (selected.nodeInfo.level !== 0) {
						selected =_.find(mtwoPermissionManagementService.getList(),{Id:selected.ParentId});
					}
					var selectedPermisions = selected.Permissions;
					var dialogResults = response.data;
					angular.forEach(dialogResults, function (item) {
						item.Id = changeEdgeCaseNames(item.Id);
					});

					if (selectedPermisions && dialogResults.length > 0) {
						const newModules = dialogResults.map(item => {
							return item.Id;
						});
						const splitPerms = selectedPermisions.split(',');
						let newPermissions = splitPerms.concat(newModules);
						newPermissions = Array.from(new Set(newPermissions));
						selected.Permissions = newPermissions.join();
						mtwoPermissionManagementService.markItemAsModified(selected);
					} else {
						var newModules2 = [];
						angular.forEach(dialogResults, function (result) {
							newModules2.push(result.Id);
						});
						if (newModules2.length > 0) {
							selected.Permissions = newModules2.join();
							mtwoPermissionManagementService.markItemAsModified(selected);
						}
					}
				}

			});

		};
	}
})(angular);
