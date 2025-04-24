/**
 * Created by wed on 08/06/2020.
 */

(function constructionSystemMainInstanceParameterUserformConfigServiceDefinition(angular) {

	'use strict';

	angular.module('constructionsystem.main').factory('constructionSystemMainInstanceParameterUserformConfigService', [
		'platformPermissionService',
		function constructionSystemMainInstanceParameterUserformConfigService(
			platformPermissionService) {

			return {
				isEditable: function () {
					return platformPermissionService.hasExecute('8ad6088d3d56499c8459ef44e6d9d4d8');
				},
				onControllerCreating: function (/* $scope */) {

				},
				onControllerDestroyed: function (/* $scope */) {

				}
			};

		}]);
})(angular);