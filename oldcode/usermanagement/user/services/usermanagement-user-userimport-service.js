/**
 * Created by sandu on 24.05.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.user';
	angular.module(moduleName).factory('usermanagementUserImportService', usermanagementUserImportService);
	usermanagementUserImportService.$inject = ['$http', '$log', 'platformGridAPI', 'platformModalService'];

	function usermanagementUserImportService($http, $log, platformGridAPI, platformModalService) {
		var service = {};

		function processInfoDialog() {
			return platformModalService.showMsgBox('usermanagement.user.userImport.infoBodyText', 'usermanagement.user.userImport.infoDialogHeader', 'info');
		}

		service.showUserImport = function () {
			platformModalService.showDialog({
				templateUrl: globals.appBaseUrl + 'usermanagement.user/templates/userImportDialog.html',
				controller: 'usermanagementUserImportController',
				resizeable: true,
				width: '800px',
				height: '600px'
			});
		};

		service.getAdsUsers = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsUser/list'
			}).then(function (response) {
				return response;
			}, function (error) {
				$log.error(error);
			});
		};

		service.importSelectedAdsUsers = function (selectedUsers) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsUser/import',
				data: selectedUsers
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
