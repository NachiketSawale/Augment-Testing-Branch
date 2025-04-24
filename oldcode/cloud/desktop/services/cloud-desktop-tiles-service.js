(() => {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopTilesService', cloudDesktopTilesService);

	cloudDesktopTilesService.$inject = ['platformTranslateService', 'platformPermissionService', 'cloudDesktopModuleTypes'];

	function cloudDesktopTilesService(platformTranslateService, platformPermissionService, cloudDesktopModuleTypes) {
		let service = {
			getTiles: getTilesByGroup,
			setWebTilesFromPages: setWebTilesFromPages,
			getWebTilesFromPages: getWebTilesFromPages
		};

		service.webTiles = [];
		const permissionProp = 'permission';
		const nameProp = 'displayName';
		const descriptionProp = 'description';
		const disabledProp = 'disabled';

		function getTilesByGroup(group, ignorePermissions) {
			if (group && group.tiles) {
				return _.reduce(group.tiles, function (result, tile) {
					if (tile[permissionProp] || ignorePermissions) {
						platformTranslateService.translateObject(tile, [nameProp, descriptionProp]);

						tile[disabledProp] = !platformPermissionService.hasExecute(tile.permission, true);

						if (platformPermissionService.hasRead(tile.permission, true)) {
							// tile.type = moduleTypes.internal; // 0: Internal Module, 1: External, 2: Web
							result.push(tile);
						}
					} else if (tile.type === cloudDesktopModuleTypes.external || tile.type === cloudDesktopModuleTypes.web || tile.type === cloudDesktopModuleTypes.quickstart || tile.type === cloudDesktopModuleTypes.pinned) {
						result.push(tile);
					}

					return result;
				}, []);
			} else {
				return [];
			}
		}

		function setWebTilesFromPages(_pages) {
			var _webTiles = [];
			// in module items are the type 0 and 1. type 2 are in pages. therefore take pagestructire and find the type=2 and add in moduleitems
			_.each(_pages, function (page) {
				if (page.id !== 'main' && page.id !== 'config') {
					_.each(page.groups, function (group) {
						if (group.tiles) {
							let externalWebTiles = _.filter(group.tiles, function (tile) {
								return !_.isNil(tile) && (tile.type === 2 || tile.type === 3);
							});
							if (externalWebTiles) {
								_.map(externalWebTiles, function (webTile) {
									return getCleanedWebTilesObject(webTile);
								});
								_webTiles.push(externalWebTiles);
							}
						}
					});
				}
			});
			service.webTiles = _.flatten(_webTiles);
			return service.webTiles;
		}

		function getCleanedWebTilesObject(webTile) {
			webTile.routeUrl = webTile.url;
			if (webTile.icon) {
				webTile.image = webTile.icon.data;
			}
		}

		/**
		 * @ngdoc function
		 * @name getWebTilesFromPages
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description Returns the web-tiles(type: 2) settings object
		 * @returns { array } The current web-tiles
		 */

		function getWebTilesFromPages() {
			return service.webTiles;
		}

		return service;
	}
})();
