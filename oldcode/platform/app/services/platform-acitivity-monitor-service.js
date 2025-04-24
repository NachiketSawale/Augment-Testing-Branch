/* global app globals */

(function (angular) {
	'use strict';

	angular.module('platform').factory('platformActivityMonitorService', platformActivityMonitorService);

	platformActivityMonitorService.$inject = ['tokenAuthentication', '$http', 'platformDialogService'];

	function platformActivityMonitorService(tokenAuthentication, $http, platformDialogService)// jshint ignore:line
	{
		let service = {
			startMonitoring: startMonitoring,
			resetTimer: resetTimer,
			forceLogout: forceLogout
		};

		let messageTimer = undefined;
		let inactiveLimit = 100000000;
		let messageDuration = 30; // dialog will be shown for 30 seconds
		let initialized = false;
		let isTracking = true;
		let dialogShown = false;

		let dialogConfig = {
			headerText$tr$: 'platform.dialogs.autoLogout.headerText',
			bodyTemplateUrl: globals.appBaseUrl + 'app/partials/auto-logout-dialog.html',
			buttons: [{
				id: 'cancel',
				fn: function (event, info) {
					console.error(info);
				}
			}],
			value:{
				dialogDurationSeconds: messageDuration
			}
		};

		function startMonitoring(){
			$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/inactivelimit').then(function (result){
				initialized = true;
				isTracking = false;
				if(result.data > 0){
					isTracking = true;
					inactiveLimit = result.data * 1000 * 60;
					resetTimer();
					window.addEventListener('click', function() {
						resetTimer();
					});
				}
			});

		}

		function resetTimer(){
			if(!isTracking || dialogShown){
				return;
			}
			if(initialized){
				if( messageTimer){
					clearTimeout(messageTimer);
				}
				messageTimer = setTimeout(showLogoutNotification, inactiveLimit - (messageDuration * 1000));
				dialogShown = false;
			}
			else{
				startMonitoring();
			}
		}

		function forceLogout(){
			const cb = app.logoutCallbackUrl();
			tokenAuthentication.logout(cb).then(
				function () {
					app.reloadLoginPage();
				}
			);
		}

		function showLogoutNotification(){
			dialogShown = true;
			platformDialogService.showDialog(dialogConfig).then(() => {
				dialogShown = false;
			},function () {
				dialogShown = false;
			});
		}

		return service;
	}

})(angular);
