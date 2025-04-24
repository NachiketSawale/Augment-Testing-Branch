/**
 * Created by sandu on 31.05.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.group';
	angular.module(moduleName).factory('usermanagementGroupImportService', usermanagementGroupImportService);
	usermanagementGroupImportService.$inject = ['platformModalService','$http','$log'];
	function usermanagementGroupImportService(platformModalService, $http, $log) {
		var service = {};

		function processInfoDialog(){
			return platformModalService.showMsgBox( 'usermanagement.group.groupImport.infoBodyText',  'usermanagement.group.groupImport.infoDialogHeader', 'info');
		}

		service.showGroupImport = function () {
			platformModalService.showDialog({
				templateUrl: globals.appBaseUrl + 'usermanagement.group/templates/groupImportDialog.html',
				controller: 'usermanagementGroupImportController',
				resizeable :true
			});
		};

		service.getAdsGroups = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsGroup/list'
			}).then(function (response) {
				return response;
			}, function (error) {
				$log.error(error);
			});
		};

		service.importSelectedAdsGroups = function (selectedGroups,createUsersFlag) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsGroup/import',
				data: selectedGroups,
				params: {createUsersFlag :createUsersFlag}
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
