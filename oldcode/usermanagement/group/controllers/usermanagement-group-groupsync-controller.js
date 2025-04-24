/**
 * Created by sandu on 09.06.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.group';
	angular.module(moduleName).controller('usermanagementGroupSyncController', usermanagementGroupSyncController);
	usermanagementGroupSyncController.$inject = ['$scope', '$translate', '$modalInstance', 'platformGridAPI', 'usermanagementGroupSyncService'];
	function usermanagementGroupSyncController($scope, $translate, $modalInstance, platformGridAPI, usermanagementGroupSyncService) {

		$scope.gridId = '43ae7c3f353b4375a22e0b61493ac217';
		$scope.avGridData = true;

		$scope.modalOptions = {
			headerText: $translate.instant('usermanagement.group.groupSync.headerText'),
			closeButtonText: $translate.instant('cloud.common.cancel'),
			actionButtonText: $translate.instant('usermanagement.group.groupSync.syncronize'),
			cancel: cancel,
			sync: sync,
			canSync:canSync
		};

		$scope.gridData = {
			state: $scope.gridId
		};

		$scope.loadingOption = {
			loading: false,
			info: 'uploading in process...'
		};

		var groupsToSync;

		var settings = {
			columns: [
				{
					id: 'state',
					field: 'State',
					name: $translate.instant('usermanagement.group.groupSync.state'),
					formatter: 'imageselect',
					formatterOptions: {serviceName: 'usermanagementGroupSyncIconService'},
					width: 40
				},
				{
					id: 'name',
					field: 'Name',
					name: $translate.instant('usermanagement.group.groupImport.name'),
					formatter: 'description',
					width: 80
				},
				{
					id: 'description',
					field: 'Description',
					name: $translate.instant('usermanagement.group.groupImport.description'),
					formatter: 'description',
					width: 80
				},
				{
					id: 'domainSid',
					field: 'ObjectSid',
					name: $translate.instant('usermanagement.group.groupImport.domainSid'),
					formatter: 'description',
					width: 80
				}
			]
		};

		$scope.settings = {};
		$scope.settings.createAssignOpt = {
			ctrlId: 'createAssign',
			labelText: $translate.instant('usermanagement.group.groupSync.createAssign')
		};

		$scope.settings.createAssign = false;

		usermanagementGroupSyncService.getAdsGroupsToSync().then(function (data) {
			groupsToSync = data.data;
			if (groupsToSync === null){
				$scope.avGridData = false;
			}
			platformGridAPI.items.data($scope.gridId, groupsToSync);
			$scope.loadingOption.loading = false;
		});

		var gridInstance = platformGridAPI.grids.element('id', $scope.gridId);

		if (!gridInstance) {
			var grid = {
				columns: angular.copy(settings.columns),
				data: [],
				id: $scope.gridId,
				lazyInit: true,
				enableConfigSave: true,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'ObjectSid',
					autoHeight: false
				}
			};

			$scope.loadingOption.loading = true;
			platformGridAPI.grids.config(grid);
		}
		function cancel() {
			$modalInstance.close({cancel: true});
		}

		function sync() {
			var data = _.filter(groupsToSync, function (usersToSync) {
				return usersToSync.State === 2;
			});
			usermanagementGroupSyncService.syncGroups(data, $scope.settings.createAssign);
			$modalInstance.close({cancel: true});
		}

		function canSync() {
			var data = _.filter(groupsToSync, function (groupsToSync) {
				return groupsToSync.State === 2;
			});
			if (data.length) {
				return true;
			}
		}
	}

})(angular);
