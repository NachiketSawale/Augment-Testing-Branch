/**
 * Created by lst on 4/13/2018.
 */

(function (angular) {
	'use strict';
	const moduleName = 'cloud.desktop';
	angular.module(moduleName).controller('cloudDesktopOneDriveMainController',
		['$scope', 'globals', 'cloudDesktopSidebarService', 'cloudDesktopOneDriveManagementService',
			function ($scope, globals, sidebarService, cloudDesktopOneDriveManagementService) {

				$scope.isAuthenticated = false;

				$scope.loginView = globals.appBaseUrl + 'cloud.desktop/templates/sidebar/one-drive/login-view.html';
				$scope.fileExplorerView = globals.appBaseUrl + 'cloud.desktop/templates/sidebar/one-drive/file-explorer-view.html';

				cloudDesktopOneDriveManagementService.initOneDriveButton();

				function onOpenSidebar(cmdId) {
					if (cmdId && cmdId === sidebarService.getSidebarIdAsId(sidebarService.getSidebarIds().oneDrive)) {
						$scope.$broadcast('one-drive-sidebar-opened');
					}
				}

				sidebarService.onOpenSidebar.register(onOpenSidebar);

				$scope.$on('$destroy', function () {
					sidebarService.onOpenSidebar.unregister(onOpenSidebar);
				});

			}]);
})(angular);