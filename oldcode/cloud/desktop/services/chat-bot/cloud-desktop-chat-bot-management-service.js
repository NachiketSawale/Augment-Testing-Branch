/**
 * Created by liz on 4/16/2018.
 */
/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopChatBotManagementService
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
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopChatBotManagementService',
		['$http', 'globals', '$q', 'cloudDesktopSidebarService',
			function ($http, globals, $q, sidebarService) {
				var service = {};

				function initChatBotButton() {
					var systemOption = globals.webApiBaseUrl + 'basics/common/systemoption/IsShowWebChatInSideBar';

					$http.get(systemOption).then(function (res) {
						if (res) {
							sidebarService.setChatBotButtonVisible(res.data);
						}
					});
				}

				service.initChatBotButton = initChatBotButton;

				return service;
			}]);
})(angular);