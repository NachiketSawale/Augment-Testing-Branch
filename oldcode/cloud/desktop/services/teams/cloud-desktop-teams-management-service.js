/**
 * Created by joy on 3/2816/2022.
 */
/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopTeamsManagementService
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

	angular.module(moduleName).factory('cloudDesktopTeamsManagementService',
		['$http', '$q', 'cloudDesktopSidebarService',
			function ($http, $q, sidebarService ) {
				var service = {};

				// function initTeamsButton() {
				// 	var systemOption = globals.webApiBaseUrl + 'basics/common/systemoption/isenableteamschatnavigation';
				//
				// 	$http.get(systemOption).then(function (res) {
				// 		if (res) {
				// 			sidebarService.setTeamsButtonVisible(res.data);
				// 		}
				// 	});
				// }
				//
				// service.initTeamsButton = initTeamsButton;


				service.enableTeamsChatNavigation = true;
				service.getTeamsChatOption = function getSidebarEnableOption() {
					var systemOption = globals.webApiBaseUrl + 'basics/common/systemoption/isenableteamschatnavigation';
					return $http.get(systemOption).then(function (res) {
						if (res) {
							service.enableTeamsChatNavigation = res.data;
							service.enableChatForClerk = true;
						}
					});
				};
				service.getTeamsChatOption();
				return service;
			}]);
})(angular);