/**
 * Created by alisch on 13.02.2018.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name cloudDesktopModuleDialogService
	 * @function
	 * @requires _, PlatformMessenger
	 *
	 * @description Modal dialog to choose modules
	 */
	angular.module('cloud.desktop').factory('cloudDesktopModuleDialogService', ['_', '$filter', '$translate', 'cloudDesktopModuleService', 'platformListSelectionDialogService',
		function (_, $filter, $translate, desktopModuleService, listSelectionDialogService) {
			var service = {};
			var nameMember = 'displayName';
			var idMember = 'id';

			service.showDialog = function (selectedModules, userConfig) {
				return desktopModuleService.getModules(false, _.get(userConfig, 'withExternals'), _.get(userConfig, 'withWebTiles')).then(function (data) {
					var selectedItems = getModulesById(data, selectedModules);
					var config = _.assign({
						dialogTitle$tr$: 'cloud.desktop.design.desktop.tileConfig',
						availableTitle$tr$: 'cloud.desktop.settings.availableModules',
						selectedTitle$tr$: 'cloud.desktop.settings.selectedModules',
						showIndicator: false,
						idProperty: idMember,
						displayNameProperty: nameMember,
						allItems: getItems(data),
						value: selectedItems
					}, userConfig || {});

					return listSelectionDialogService.showDialog(config);
				});
			};

			function getModulesById(modules, id) {
				var ids = _.isUndefined(id) ? [] : _.isArray(id) ? id : [id];
				if (!ids.length) {
					return [];
				}

				var result = [];
				_.forEach(ids, function (item) {
					var mod = _.find(modules, function (chr) {
						if (_.isObject(item)) {
							return chr.id === item.id;
						} else {
							return chr.id === item;
						}
					});

					if (mod) {
						result.push(mod);
					}
				});

				return result;
			}

			function getItems(data) {
				var array = [];

				// filter disabled
				array = _.filter(data, function (tile) {
					return !tile.disabled;
				});

				// sort content
				array = $filter('orderBy')(array, nameMember);

				return array;
			}

			return service;
		}]);
})();
