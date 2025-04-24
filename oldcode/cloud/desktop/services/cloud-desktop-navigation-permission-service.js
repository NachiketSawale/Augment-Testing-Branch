(function () {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopNavigationPermissionService', cloudDesktopNavigationPermissionService);

	cloudDesktopNavigationPermissionService.$inject = ['cloudDesktopTilesConfig', 'platformPermissionService', '$q', '_'];

	function cloudDesktopNavigationPermissionService(cloudDesktopTilesConfig, platformPermissionService, $q, _) {

		var module2Descriptor = new Map();

		function loadModulePermission() {

			if (module2Descriptor.size > 0) {
				return $q.when();
			}
			_.each(cloudDesktopTilesConfig, function (cloudDesktopTiles) {
				_.each(cloudDesktopTiles.groups, function (group) {
					_.each(group.tiles, function (tile) {
						module2Descriptor.set(tile.routeUrl.split('.')[1], tile.permission);
					});
				});
			});

			return platformPermissionService.loadPermissions(getPermission(), false);
		}

		function getPermission() {
			return [...module2Descriptor.values()];
		}

		function hasPermissionForModule(module) {
			module = module.replace(/\./g, '');
			var permission = module2Descriptor.get(module);
			return !permission ? true : platformPermissionService.hasExecute(permission, false);
		}

		return {
			loadModulePermission: loadModulePermission,
			hasPermissionForModule: hasPermissionForModule
		};
	}
})();