/**
 * Created by lst on 12/18/2020.
 */

(function (angular) {
	'use strict';
	const moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopPowerBIAdalService', [
		'$injector',
		'$q',
		'$log',
		'$rootScope',
		'_',
		'globals',
		'msalAuthenticationCustomService',
		function (
			$injector,
			$q,
			$log,
			$rootScope,
			_,
			globals,
			msalService
		) {
			let service = {};

			service.getPowerBISettings = function getPowerBISettings(selectedItem) {
				const authUrl = selectedItem.Authurl;
				const res = /(https:\/\/[^/]+\/)([^/]+)\/.*/i.exec(authUrl);

				return {
					authority: res[1],
					tenant: res[2],
					clientId: selectedItem.Clientid,
					apiUrl: selectedItem.Apiurl,
					resourceUrl: selectedItem.Resourceurl,
					loginAccount: selectedItem.Logonname
				};
			};

			service.acquireTokenAsync = function acquireTokenAsync(powerBISettings) {
				return powerBISettings && powerBISettings.loginAccount ? msalService.client(powerBISettings.clientId, msalService.appType.powerBi).acquireTokenAsync(powerBISettings.loginAccount, {
					loginHint: powerBISettings.loginAccount
				}) : Promise.resolve(null);
			};

			return service;
		}
	]);
})(angular);
