(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemSalescontractCharacteristicController', [
		'platformPermissionService', 'permissions',
		function (platformPermissionService, permissions) {
			platformPermissionService.restrict(['46314dc58a8e427c88e6bf7dbeb44803'], permissions.read);
		}]);
})();