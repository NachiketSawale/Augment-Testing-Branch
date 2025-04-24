/**
 * Created by sandu on 06.06.2016.
 */
(function (angular) {
	'use strict';
	var modulename = 'usermanagement.user';
	angular.module(modulename).factory('usermanagementUserSyncService', usermanagementUserSyncService);
	usermanagementUserSyncService.$inject = ['platformModalService', '$http', '$log'];

	function usermanagementUserSyncService(platformModalService, $http, $log) {
		var service = {};

		function processInfoDialog() {
			return platformModalService.showMsgBox('usermanagement.user.userSync.infoBodyText', 'usermanagement.user.userSync.infoDialogHeader', 'info');
		}

		service.showUserSync = function () {
			platformModalService.showDialog({
				templateUrl: globals.appBaseUrl + 'usermanagement.user/templates/userSyncDialog.html',
				controller: 'usermanagementUserSyncController'
			});
		};

		service.getAdsUsersToSync = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsUser/listUsersToSync'
			}).then(function (response) {
				return response;
			}, function (error) {
				$log.error(error);
			});
		};

		service.syncUsers = function (usersToSync) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsUser/sync',
				data: usersToSync
			}).then(function (response) {
				processInfoDialog();
				return response;
			}, function (error) {
				$log.error(error);
			});
		};

		service.syncUsersNoPreValidation = function () {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsUser/syncnoprevalidation',
			}).then(function (response) {
				processInfoDialog();
				return response;
			}, function (error) {
				$log.error(error);
			});
		};

		return service;
	}
})(angular);
