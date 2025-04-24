/**
 * Created by sandu on 14.06.2016.
 */
(function () {
	'use strict';
	var moduleName = 'usermanagement.group';
	angular.module(moduleName).factory('usermanagementGroupAdsConfigService', usermanagementGroupAdsConfigService);
	usermanagementGroupAdsConfigService.$inject = ['$http', '$log', 'platformModalService','$q', '$translate'];

	function usermanagementGroupAdsConfigService($http, $log, platformModalService, $q, $translate) {
		var service = {};

		function processErrorInfoDialog(errorCode, errorCodeTask) {
			var taskMessage = '';
			if (errorCodeTask === 1){
				taskMessage = $translate.instant('usermanagement.group.adsConfig.adTaskInfo');
			}
			switch (errorCode) {
				case 0:
					return platformModalService.showMsgBox('usermanagement.group.adsConfig.infoBodyText', 'usermanagement.group.adsConfig.infoDialogHeader', 'info');
				case 1:
					return platformModalService.showMsgBox($translate.instant('usermanagement.group.adsConfig.infoBodyTextGroupError')+'<br>'+ taskMessage, 'usermanagement.group.adsConfig.infoDialogHeader', 'info');
				case 2:
					return platformModalService.showMsgBox($translate.instant('usermanagement.group.adsConfig.infoBodyTextUserError')+'<br>'+ taskMessage, 'usermanagement.group.adsConfig.infoDialogHeader', 'info');
				case 3:
					return platformModalService.showMsgBox($translate.instant('usermanagement.group.adsConfig.infoBodyTextGroupAndUserError')+'<br>'+ taskMessage, 'usermanagement.group.adsConfig.infoDialogHeader', 'info');
			}
		}

		service.showConfig = function () {
			platformModalService.showDialog({
				templateUrl: globals.appBaseUrl + 'usermanagement.group/templates/adConfigDialog.html',
				controller: 'usermanagementGroupAdConfigController'
			});
		};

		service.getLastConfig = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'services/scheduler/job/lastadconfig'
			}).then(function (response) {
				response.data.ParameterList = JSON.parse(response.data.ParameterList);
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		function saveLdapPath(adsPaths) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsConfig/savepaths',
				params: {usersPath: adsPaths.usersPath || '', groupsPath: adsPaths.groupsPath || ''}
			});
		}

		service.getPaths = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsConfig/getpaths'
			}).then(function (response) {
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		function saveScheduleTaskConfig(settings) {
			var settingsOpt = {
				Activated: settings.activated,
				AddAdUser: settings.addAdUser,
				SyncAdUser: settings.syncAdUser,
				SyncAdGroup: settings.syncAdGroup,
				Daily: settings.daily === 'true',
				Weekly: settings.daily === 'weekly',
				Date: settings.date
			};
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsConfig/savescheduletaskconfig',
				data: settingsOpt
			});
		}

		function handleErrorDialog(errorCodePaths, errorCodeTask){
			if(errorCodePaths === 0 && errorCodeTask === 1){
				processErrorInfoDialog(0);
			}else{
				processErrorInfoDialog(errorCodePaths, errorCodeTask);
			}
		}

		service.saveAdConfigurationComplete = function (profileAdPaths, adsPaths, settings) {
			var errorCodePaths;
			var errorCodeTask;
			var promises = [];
			if (adsPaths.usersPath !== profileAdPaths.usersPath || adsPaths.groupsPath !== profileAdPaths.groupsPath) {
				var promiseLdap = saveLdapPath(adsPaths);
				promises.push(promiseLdap);
				promiseLdap.then(function (response) {
					errorCodePaths = response.data;
				}, function (error) {
					$log.error(error);
				});
			}
			if (settings.activated === true) {
				var promiseTaskConfig = saveScheduleTaskConfig(settings);
				promises.push(promiseTaskConfig);
				promiseTaskConfig.then(function (response) {
					errorCodeTask = response.data;
				}, function (error) {
					$log.error(error);
				});
			}
			$q.all(promises).then(function(){
				handleErrorDialog(errorCodePaths, errorCodeTask);
			});

		};
		return service;
	}
})();