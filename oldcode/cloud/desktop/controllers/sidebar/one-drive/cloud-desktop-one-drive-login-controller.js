/**
 * Created by lst on 4/13/2018.
 */

(function (angular) {
	'use strict';
	const moduleName = 'cloud.desktop';
	angular.module(moduleName).controller('cloudDesktopOneDriveLoginController', [
		'globals',
		'$scope',
		'cloudDesktopSidebarService',
		'msalAuthenticationCustomService',
		function (
			globals,
			$scope,
			cloudDesktopSidebarService,
			msalService
		) {
			const client = msalService.client(globals.aad.office365ClientId, msalService.appType.oneDrive);

			const updateAuthenticatedStatus = function (isAuthenticated) {
				if ($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.$parent) {
					$scope.$parent.$parent.$parent.isAuthenticated = isAuthenticated;
				}
			};

			const checkAuthenticated = function () {
				$scope.isLoading = true;
				return client.isAuthenticated().then(r => {
					$scope.isLoading = false;
					updateAuthenticatedStatus(r.isAuthenticated);
				});
			};

			const onOpenSidebar = function (cmd) {
				if (cmd === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().oneDrive)) {
					checkAuthenticated();
				}
			};

			updateAuthenticatedStatus(false);
			$scope.loginMessage = '';
			$scope.isLoading = false;

			$scope.login = function () {
				$scope.loginMessage = 'login...';
				client.loginPopup().then(r => {
					updateAuthenticatedStatus(!!(r && r.accessToken));
				});
			};

			checkAuthenticated();

			cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);

			$scope.$on('$destroy', function () {
				cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
			});
		}]);
})(angular);
