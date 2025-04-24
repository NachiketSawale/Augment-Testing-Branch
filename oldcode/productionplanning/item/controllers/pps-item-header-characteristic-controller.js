(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemHeaderCharacteristicController', [
		'platformPermissionService', 'permissions',
		function (platformPermissionService, permissions) {
			platformPermissionService.restrict(['9246c58ebd2945c6ad51011861b569eb'], permissions.read);
		}]);
})();