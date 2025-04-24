/**
 * Created by sandu on 06.06.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.user';
	angular.module(moduleName).controller('usermanagementUserSyncController', usermanagementUserSyncController);
	usermanagementUserSyncController.$inject = ['$scope', '$translate', '$modalInstance', 'platformGridAPI', 'usermanagementUserSyncService'];

	function usermanagementUserSyncController($scope, $translate, $modalInstance, platformGridAPI, usermanagementUserSyncService) {

		$scope.gridId = 'cb3d14d6f8ce494396fd34b99073c528';
		$scope.avGridData = true;

		$scope.modalOptions = {
			headerText: $translate.instant('usermanagement.user.userSync.headerText'),
			closeButtonText: $translate.instant('cloud.common.cancel'),
			actionButtonText: $translate.instant('usermanagement.user.userSync.syncronize'),
			cancel: cancel,
			sync: sync,
			canSync: canSync
		};

		$scope.gridData = {
			state: $scope.gridId
		};

		$scope.loadingOption = {
			loading: false,
			info: 'uploading in process...'
		};

		var usersToSync;

		var settings = {
			columns: [
				{
					id: 'state',
					field: 'State',
					name: $translate.instant('usermanagement.user.userSync.state'),
					formatter: 'imageselect',
					formatterOptions: {serviceName: 'usermanagementUserSyncIconService'},
					width: 40
				},
				{
					id: 'name',
					field: 'Name',
					name: $translate.instant('usermanagement.user.userImport.name'),
					formatter: 'description',
					width: 80
				},
				{
					id: 'loginName',
					field: 'UserPrincipalName',
					name: $translate.instant('usermanagement.user.userImport.loginName'),
					formatter: 'description',
					width: 80
				},
				{
					id: 'domainSid',
					field: 'ObjectSid',
					name: $translate.instant('usermanagement.user.userImport.domainSid'),
					formatter: 'description',
					width: 80
				}
			]
		};
		usermanagementUserSyncService.getAdsUsersToSync().then(function (data) {
			usersToSync = data.data;
			if (usersToSync === null) {
				$scope.avGridData = false;
			}
			platformGridAPI.items.data($scope.gridId, usersToSync);
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
			var data = _.filter(usersToSync, function (usersToSync) {
				return usersToSync.State === 2;
			});
			usermanagementUserSyncService.syncUsers(data);
			$modalInstance.close({cancel: true});
		}

		function canSync() {
			var data = _.filter(usersToSync, function (usersToSync) {
				return usersToSync.State === 2;
			});
			if (data.length) {
				return true;
			}
		}
	}

})(angular);
