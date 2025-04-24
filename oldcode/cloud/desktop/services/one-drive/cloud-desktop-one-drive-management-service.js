/**
 * Created by lst on 4/16/2018.
 */
/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopOneDriveManagementService
 * @priority default value
 * @description
 *
 *
 *
 * @example
 ...
 }
 */

(function (angular) {
	'use strict';
	const moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOneDriveManagementService', [
		'globals',
		'$http',
		'$q',
		'platformModalService',
		'cloudDesktopSidebarService',
		function (
			globals,
			$http,
			$q,
			platformModalService,
			sidebarService
		) {
			let service = {};

			function initOneDriveButton() {
				let systemOption = globals.webApiBaseUrl + 'basics/common/systemoption/isshowonedrivebuttoninsidebar';

				$http.get(systemOption).then(function (res) {
					if (res) {
						sidebarService.setOneDriveButtonVisible(res.data);
					}
				});
			}

			service.initOneDriveButton = initOneDriveButton;

			service.enableOneDrive = false;
			service.getOneDriveEnableOption = function getSidebarEnableOption() {
				let systemOption = globals.webApiBaseUrl + 'basics/common/systemoption/isshowonedrivebuttoninsidebar';

				return $http.get(systemOption).then(function (res) {
					if (res) {
						service.enableOneDrive = res.data;
					}
				});
			};
			service.getOneDriveEnableOption();

			service.enableOnlineEdit = false;
			service.getOnlineEnableOption = function getOnlineEnableOption() {
				let systemOption = globals.webApiBaseUrl + 'basics/common/systemoption/enableonlineedit';

				return $http.get(systemOption).then(function (res) {
					if (res) {
						service.enableOnlineEdit = res.data;
					}
				});
			};
			service.getOnlineEnableOption();

			service.onlineEditOfficeDocument = function (fileArchiveDocId) {
				$http.get(globals.webApiBaseUrl + 'onedrive/getsharelink?fileArchiveDocId=' + fileArchiveDocId).then(function (response) {
					let result = response.data;
					if (result && result['CanOnlineEdit'] && result['ShareLink']) {
						window.open(result['ShareLink'], '_blank');
					} else {
						platformModalService.showMsgBox('Get OneDrive share link failed.', 'cloud.desktop.oneDrive.title', 'error');
					}
				});
			};

			service.synchronizeOfficeDocument = function (fileArchiveDocId) {
				return fileArchiveDocId ? $http.get(globals.webApiBaseUrl + 'onedrive/synchronize?fileArchiveDocId=' + fileArchiveDocId).then(function (result) {
					return result.data;
				}) : $q.when(null);
			};

			return service;
		}
	]);
})(angular);