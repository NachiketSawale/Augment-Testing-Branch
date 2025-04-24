/**
 * Created by sandu on 09.06.2016.
 */
(function () {
	'use strict';
	var moduleName = 'usermanagement.group';
	angular.module(moduleName).factory('usermanagementGroupSyncService',usermanagementGroupSyncService);
	usermanagementGroupSyncService.$inject =['platformModalService','$http','$log'];
	function usermanagementGroupSyncService (platformModalService, $http, $log){
		var service = {};

		function processInfoDialog(){
			return platformModalService.showMsgBox( 'usermanagement.group.groupSync.infoBodyText',  'usermanagement.group.groupSync.infoDialogHeader', 'info');
		}

		service.showGroupSync = function () {
			platformModalService.showDialog({
				templateUrl: globals.appBaseUrl + 'usermanagement.group/templates/groupSyncDialog.html',
				controller: 'usermanagementGroupSyncController'
			});
		};

		service.getAdsGroupsToSync = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsGroup/listgroupstosync'
			}).then(function (response) {
				return response;
			}, function (error) {
				$log.error(error);
			});
		};

		service.syncGroups = function (groupsToSync, createUsersFlag) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsGroup/sync',
				data: groupsToSync,
				params: {createUsersFlag :createUsersFlag}
			}).then(function (response) {
				processInfoDialog();
				return response;
			}, function (error) {
				$log.error(error);
			});
		};

		service.syncGroupsNoPreValidation = function () {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsGroup/syncnoprevalidation',
			}).then(function (response) {
				processInfoDialog();
				return response;
			}, function (error) {
				$log.error(error);
			});
		};


		return service;
	}

})();