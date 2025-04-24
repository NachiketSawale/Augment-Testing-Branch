/**
 * Created by rnt on 6/17/2019.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	/**
	 * @ngdoc service
	 * @name basicsCommonAIService
	 * @function
	 * @requires $q, $http, platformModalService, globals
	 *
	 * @description
	 * Service to register tooltips for specified column in grid.
	 **/
	angular.module(moduleName).factory('basicsCommonAIService', [
		'$q',
		'$http',
		'platformModalService',
		'globals',
		function (
			$q,
			$http,
			platformModalService,
			globals) {

			function showAINotConfiguredError() {
				platformModalService.showMsgBox('basics.common.aiNotConfiguredError', 'basics.common.aiDialogTitle', 'ico-error');
			}

			function showAINotEnabledError() {
				platformModalService.showMsgBox('basics.common.aiNotEnabledError', 'basics.common.aiDialogTitle', 'ico-error');
			}

			function showNoAIPermissionError() {
				platformModalService.showMsgBox('basics.common.aiNoPermissionError', 'basics.common.aiDialogTitle', 'ico-error');
			}

			function checkStatus(result, showError) {
				if (!result.IsAIConfigured) {
					if (showError) {
						showAINotConfiguredError();
					}
					return false;
				}
				if (!result.IsAIEnabled) {
					if (showError) {
						showAINotEnabledError();
					}
					return false;
				}
				if (result.Permission) {
					if (!result.HasPermission) {
						if (showError) {
							showNoAIPermissionError();
						}
						return false;
					}
				}
				return true;
			}

			function checkPermission(permission, showError) {
				let url = 'basics/common/aiconfig/checkpermission?permission=';
				if (permission) {
					url += permission;
				}
				return $http.get(globals.webApiBaseUrl + url).then(
					function (response) {
						return checkStatus(response.data, showError);
					}
				);
			}

			return {
				'checkPermission': checkPermission
			};
		}]);
})(angular);