/**
 * Created by uestuenel on 12.12.2017.
 */
(function () {
	'use strict';

	angular.module('cloud.desktop').constant('cloudDesktopModuleTypes', {
		internal: 0,
		external: 1,
		web: 2,
		quickstart: 3,
		pinned: 4
	});

	angular.module('cloud.desktop').factory('cloudDesktopModuleService', cloudDesktopModuleService);

	cloudDesktopModuleService.$inject = ['$q', '_', 'platformPermissionService', 'cloudDesktopTilesConfig', 'platformTranslateService', '$http', 'cloudDesktopModuleTypes', 'platformCollectionUtilitiesService', 'cloudDesktopTilesService'];

	function cloudDesktopModuleService($q, _, platformPermissionService, cloudDesktopTilesConfig, platformTranslateService, $http, moduleTypes, platformCollectionUtilitiesService, cloudDesktopTilesService) {
		let service = {
			getModules: getModules,
			getExternalModules: getExternalModules,
			getExternalModulesExtended: getExternalModulesExtended,
			getExternalModuleUrl: getExternalModuleUrl,
			getModulesById: getModulesById,
			getDescriptors: getDescriptors
		};

		let defaultModules;

		const idProp = 'id';
		const permissionProp = 'permission';
		const nameProp = 'displayName';

		function getDefaultModules() {
			if (_.isUndefined(defaultModules)) {
				defaultModules = _.cloneDeep(cloudDesktopTilesConfig);
			}
			return defaultModules;
		}

		function getDescriptors(pages) {
			let descriptors = [];

			if (pages) {
				_.forEach(pages, function (page) {
					descriptors = descriptors.concat(_.reduce(page.groups, function (result, item) {
						return result.concat(_.compact(_.map(item.tiles, permissionProp)));
					}, []));
				});
			}

			return descriptors;
		}

		/**
		 * @ngdoc function
		 * @name getExternalModules
		 * @function
		 * @methodOf cloudDesktopModuleService
		 * @description Returns an array of all external modules that the user has permission to access.
		 * @param { bool } ignorePermissions True, if the access rights of the current user should not be checked.
		 * @return { array } An array of modules
		 */
		function getExternalModules(ignorePermissions) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/customize/externaldesktoptiles/customizabledesktoptiles',
				params: {ignorePermissions: !!ignorePermissions}
			}).then(function (result) {
				if (angular.isObject(result.data)) {
					return _.map(result.data, function (module) {
						return getCleanedExternalModule(module);
					});
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name getExternalModuleUrl
		 * @function
		 * @methodOf cloudDesktopModuleService
		 * @description Returns an external module object that the user has permission to access with url data. This function costs more performance than getExternalModules.
		 * @param { number,string } id The id of the external module
		 * @return { array } An array of external modules
		 */
		function getExternalModuleUrl(id) {
			var modId = parseInt(id);

			if (_.isNaN(modId)) {
				return $q.when();
			}

			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/customize/externaldesktoptiles/resolveurl',
				params: {tileId: modId}
			}).then(function (result) {
				if (angular.isObject(result.data)) {
					return getCleanedExternalModule(result.data);
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name getExternalModulesExtended
		 * @function
		 * @methodOf cloudDesktopModuleService
		 * @description Returns an array of all external modules that the user has permission to access with extended data. This function costs more performance than getExternalModules.
		 * @param { object,number,string, array } id The id of the external module
		 * @return { array } An array of external modules
		 */
		function getExternalModulesExtended(id) {
			var ids = platformCollectionUtilitiesService.getValueArray(id);
			if (ids.length === 0) {
				return $q.when();
			}

			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/customize/externaldesktoptiles/desktoptiles',
				params: {tileIds: ids}
			}).then(function (result) {
				if (angular.isObject(result.data)) {
					return _.map(result.data, function (module) {
						return getCleanedExternalModule(module);
					});
				}
			});
		}

		function getCleanedExternalModule(module) {
			let m = {};
			_.forEach(_.keys(module), function (prop) {
				if (_.toLower(prop) === 'name') {
					m[nameProp] = module[prop];

				} else if (_.toLower(prop) === 'id') {
					// change int to string, because we want to use strings as the internal module ids are strings too.
					m[_.camelCase(prop)] = module[prop].toString();
				} else {
					m[_.camelCase(prop)] = module[prop];
				}
			});

			m.type = moduleTypes.external;

			return m;
		}

		/**
		 * @ngdoc function
		 * @name getModules
		 * @function
		 * @methodOf cloudDesktopModuleService
		 * @description Returns an array of all modules that the user has permission to access.
		 * @param {bool} ignorePermissions If true, the permissions of the current user will not be checked.
		 * @param {bool} withExternals If true, the external modules will also be loaded.
		 * @return { array } An array of modules
		 */
		function getModules(ignorePermissions, withExternals, withWebTiles) {
			return getInternalModules(ignorePermissions).then(function (internalResult) {
				if (withWebTiles) {
					var _webTiles = cloudDesktopTilesService.getWebTilesFromPages();

					if (_webTiles.length > 0) {
						// internalResult.concat(_webTiles);
						angular.forEach(_webTiles, function (item) {
							internalResult.push(item);
						});
					}
				}
				if (withExternals) {
					return getExternalModules(ignorePermissions).then(function (externalResult) {
						return internalResult.concat(externalResult);
					});
				}

				return internalResult;
			});
		}

		/**
		 * @ngdoc function
		 * @name getInternalModules
		 * @function
		 * @methodOf cloudDesktopModuleService
		 * @description Returns an array of internal modules that the user has permission to access.
		 * @param {bool} ignorePermissions If true, the permissions of the current user will not be checked.
		 * @return { array } An array of internal modules
		 */
		function getInternalModules(ignorePermissions) {
			let ribPagesStructure = getDefaultModules();

			function iterateStructure(structure) {
				var modules = [];
				_.each(structure, function (page) {
					_.each(page.groups, function (group) {
						group.tiles = cloudDesktopTilesService.getTiles(group, ignorePermissions);

						_.each(group.tiles, tile => {
							// set tile typ for internal modules
							tile.type = moduleTypes.internal;
						});

						if (group.tiles.length) {
							modules = modules.concat(group.tiles);
						}
					});
				});
				return modules;
			}

			if (ignorePermissions) {
				return $q.when(iterateStructure(ribPagesStructure));
			} else {
				var descriptors = getDescriptors(ribPagesStructure);
				return platformPermissionService.loadPermissions(descriptors).then(function () {
					if (descriptors.length) {
						return iterateStructure(ribPagesStructure);
					}
				});
			}
		}

		/**
		 * @ngdoc function
		 * @name getModulesById
		 * @function
		 * @methodOf cloudDesktopModuleService
		 * @description Returns an array of modules that the user has permission to access and the array contains its id.
		 * @param { string, array } id The id of the module or an array of ids or an array of objects with id property.
		 * @param {bool} ignorePermissions If true, the permissions of the current user will not be checked.
		 * @param {bool} withExternals If true, the external modules will also be loaded.
		 * @return { array } An array of modules
		 */
		function getModulesById(id, ignorePermissions, withExternals, withWebTiles) {
			var ids = _.isUndefined(id) ? [] : _.isArray(id) ? id : [id];
			if (!ids.length) {
				return $q.when();
			}

			var result = [];
			return getModules(ignorePermissions, withExternals, withWebTiles).then(function (modules) {
				_.forEach(ids, function (item) {

					var mod = _.find(modules, function (chr) {
						if (_.isObject(item)) {
							return chr[idProp] === item[idProp];
						} else {
							return chr[idProp] === item;
						}
					});

					if (mod) {
						result.push(mod);
					}
				});

				return result;
			});
		}

		return service;
	}
})();
