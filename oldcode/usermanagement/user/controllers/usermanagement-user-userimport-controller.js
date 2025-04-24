/**
 * Created by sandu on 19.05.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.user';
	angular.module(moduleName).controller('usermanagementUserImportController', usermanagementUserImportController);

	usermanagementUserImportController.$inject = ['$scope', '$modalInstance', 'platformGridAPI', '$translate', 'usermanagementUserImportService', '$timeout'];

	function usermanagementUserImportController($scope, $modalInstance, platformGridAPI, $translate, usermanagementUserImportService, $timeout) {

		$scope.gridId = 'e2701a90c70e42528a5d89a3ce15e4a3';
		$scope.gId = 'c3f1d926d3424664a962cf7435bc8d4c';
		$scope.avGridData = true;
		var selectedUsers = [];

		$scope.modalOptions = {
			headerText: $translate.instant('usermanagement.user.userImport.headerText'),
			closeButtonText: $translate.instant('cloud.common.cancel'),
			actionButtonText: $translate.instant('usermanagement.user.userImport.importButton'),
			cancel: cancel,
			ok: OK,
			canImport: canImport
		};

		$scope.gridData = {
			state: $scope.gridId
		};

		$scope.gData = {
			state: $scope.gId
		};

		$scope.loadingOption = {
			loading: false,
			info: 'uploading in process...'
		};

		var settings = {
			columns: [
				{
					id: 'selected',
					field: 'selected',
					name: $translate.instant('usermanagement.user.userImport.selected'),
					editor: 'marker',
					formatter: 'marker',
					width: 50,
					editorOptions: {
						// serviceName: 'usermanagementUserImportService',
						// serviceMethod: 'getAdsUsers',
						multiSelect: true
					}
				},
				{
					id: 'isDisable',
					field: 'IsDisable',
					name: $translate.instant('usermanagement.user.userImport.disable'),
					formatter: 'boolean',
					width: 55
				},
				{
					id: 'name',
					field: 'Name',
					name: $translate.instant('usermanagement.user.userImport.name'),
					formatter: 'description',
					width: 150
				},
				{
					id: 'loginName',
					field: 'UserPrincipalName',
					name: $translate.instant('usermanagement.user.userImport.loginName'),
					formatter: 'description',
					width: 200
				},
				{
					id: 'domainSid',
					field: 'ObjectSid',
					name: $translate.instant('usermanagement.user.userImport.domainSid'),
					formatter: 'description',
					width: 150
				}
			]
		};

		var settingsOverview = {
			columns: [
				{
					id: 'name',
					field: 'Name',
					name: $translate.instant('usermanagement.user.userImport.name'),
					formatter: 'description',
					width: 150
				},
				{
					id: 'loginName',
					field: 'UserPrincipalName',
					name: $translate.instant('usermanagement.user.userImport.loginName'),
					formatter: 'description',
					width: 200
				},
				{
					id: 'domainSid',
					field: 'ObjectSid',
					name: $translate.instant('usermanagement.user.userImport.domainSid'),
					formatter: 'description',
					width: 150
				},
				{
					id: 'isDisable',
					field: 'IsDisable',
					name: $translate.instant('usermanagement.user.userImport.disable'),
					formatter: 'boolean',
					width: 55
				}
			]
		};

		usermanagementUserImportService.getAdsUsers().then(function (data) {
			var users = data.data;
			if (users === null) {
				$scope.avGridData = false;
			}
			platformGridAPI.items.data($scope.gridId, users);
			$scope.loadingOption.loading = false;
		});

		var gridInstance = platformGridAPI.grids.element('id', $scope.gridId);
		var gridInstanceOverview = platformGridAPI.grids.element('id', $scope.gId);

		if (!gridInstance) {
			var grid = {
				columns: angular.copy(settings.columns),
				data: [],
				id: $scope.gridId,
				lazyInit: true,
				enableConfigSave: true,
				options: {
					tree: false,
					indicator: false,
					idProperty: 'UserPrincipalName',
					autoHeight: false
				}
			};

			$scope.loadingOption.loading = true;
			platformGridAPI.grids.config(grid);
		}
		if (!gridInstanceOverview) {
			var gridOverview = {
				columns: angular.copy(settingsOverview.columns),
				data: [],
				id: $scope.gId,
				lazyInit: true,
				enableConfigSave: true,
				options: {
					tree: false,
					indicator: false,
					idProperty: 'UserPrincipalName',
					autoHeight: false
				}
			};
			platformGridAPI.grids.config(gridOverview);
		}

		$scope.tools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 't2',
					caption: 'usermanagement.user.userImport.toolbarButtons.checkAll',
					type: 'item',
					iconClass: 'tlb-icons ico-check-all',
					fn: function () {
						var data = platformGridAPI.items.data($scope.gridId);
						_.each(data, function (user) {
							user.selected = true;
						});
						$timeout(function (){
							platformGridAPI.items.data($scope.gridId, data);
							$timeout(function (){
								getSelectedAdsUsers();
							});
						});
					}
				},
				{
					id: 't3',
					caption: 'usermanagement.user.userImport.toolbarButtons.uncheckAll',
					type: 'item',
					iconClass: 'tlb-icons ico-uncheck-all',
					fn: function () {
						var data = platformGridAPI.items.data($scope.gridId);
						_.each(data, function (user) {
							user.selected = false;
						});
						$timeout(function (){
							platformGridAPI.items.data($scope.gridId, data);
							$timeout(function (){
								getSelectedAdsUsers();
							});
						});
					}
				},
				{
					id: 't4',
					caption: 'usermanagement.user.userImport.toolbarButtons.checkAllSelected',
					type: 'item',
					iconClass: 'tlb-icons ico-check-all-selected',
					fn: function () {
						setSelectedUserSelectedState(true);
					}
				},
				{
					id: 't5',
					caption: 'usermanagement.user.userImport.toolbarButtons.uncheckAllSelected',
					type: 'item',
					iconClass: 'tlb-icons ico-uncheck-all-selected',
					fn: function () {
						setSelectedUserSelectedState(false);
					}
				},
				{
					id: 't1',
					caption: 'cloud.common.toolbarSearch',
					type: 'check',
					value: platformGridAPI.filters.showSearch($scope.gridId),
					iconClass: 'tlb-icons ico-search',
					fn: function () {
						platformGridAPI.filters.showSearch($scope.gridId, this.value);
					}
				}

			]
		};

		function setSelectedUserSelectedState(value){
			var data = platformGridAPI.items.data($scope.gridId);
			var selected = platformGridAPI.rows.selection({gridId:$scope.gridId, wantsArray:true});
			_.each(selected, function (user) {
				let selectedUser = _.find(data, function (dt){
					return dt.UserPrincipalName === user.UserPrincipalName;
				});
				if(selectedUser){
					selectedUser.selected = value;
				}
			});
			$timeout(function (){
				platformGridAPI.items.data($scope.gridId, data);
				$timeout(function (){
					getSelectedAdsUsers();
				});
			});
		}

		function updateTools() {
			$timeout($scope.tools.update, 0, true);
		}
		updateTools();
		function cancel() {
			$modalInstance.close({cancel: true});
		}

		function OK() {
			usermanagementUserImportService.importSelectedAdsUsers(selectedUsers);
			$modalInstance.close({cancel: true});
		}

		function canImport() {
			if (selectedUsers.length) {
				return true;
			}
		}

		function getSelectedAdsUsers() {
			var data = platformGridAPI.items.data($scope.gridId);
			selectedUsers = _.filter(data, function (user) {
				return user.selected === true;
			});
			platformGridAPI.items.data($scope.gId, selectedUsers);
		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', getSelectedAdsUsers);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', getSelectedAdsUsers);
			platformGridAPI.grids.unregister($scope.gridId);
			platformGridAPI.grids.unregister($scope.gId);
		});

	}
})(angular);
