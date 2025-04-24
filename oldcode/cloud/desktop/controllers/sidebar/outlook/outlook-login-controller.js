/**
 * Created by wed on 8/15/2023.
 */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').controller('cloudDesktopOutlookLoginController', [
		'_',
		'$scope',
		'cloudDesktopOutlookMainService',
		function (
			_,
			$scope,
			outlookMainService
		) {
			$scope.login = function () {
				outlookMainService.msalClient.loginPopup().then(()=>{
					outlookMainService.onLoginSuccess.fire();
				});
			};
		}
	]);
})(angular);