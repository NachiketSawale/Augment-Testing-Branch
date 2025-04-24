/**
 * Created by knickenberg on 30.07.2014.
 */

(function (angular, Platform) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformNavBarService
	 * @function
	 * @requireds
	 *
	 * @description Controls the navigation bar of the layout system.
	 */

	function arrayObjectIndexOf(myArray, property, searchTerm) {
		for (var i = 0, len = myArray.length; i < len; i++) {
			if (myArray[i][property] === searchTerm) {
				return i;
			}
		}
		return -1;
	}

	function getDescendantProp(obj, desc) {
		var arr = desc.split('.');
		/* jshint -W116 */
		while (arr.length && (obj = obj[arr.shift()])) ;
		/* jshint +W116 */
		return obj;
	}

	angular.module('platform').provider('platformNavBarService', PlatformNavBarServiceProvider);

	function PlatformNavBarServiceProvider() {
		var defaultActions = [];

		this.setDefaultActions = function (actions) {
			defaultActions = actions;
		};

		platformNavBarServiceFactory.$inject = ['$q', '$rootScope', 'platformTranslateService', 'platformPermissionService', 'basicsConfigNavCommandbarService'];

		function platformNavBarServiceFactory($q, $rootScope, platformTranslateService, platformPermissionService, basicsConfigNavCommandbarService) {
			var actions = [];
			var service = {};
			var actionChanged = new Platform.Messenger();

			var addActionInternal = function (item) {
				if (angular.isDefined(item.key)) {
					var action = service.getActionByKey(item.key);
					if (item.key !== action.key) {
						actions.push(action);
					}
					action.sync(item);
					// var transStr = platformTranslateService.instant(action.description);
					platformTranslateService.translate(action.description$tr$, true)
						.then(function (values) {
							action.description = getDescendantProp(values, action.description$tr$);
						});
				}
			};

			var copyDefaultActions = function () {
				for (var i = 0; i < defaultActions.length; i++) {
					actions.push(defaultActions[i].clone());
				}
			};

			copyDefaultActions();

			var getActionByKeyUnSave = function (key) {
				return _.find(actions, function (item) {
					return item.key === key;
				});
			};

			/**
			 * @ngdoc function
			 * @name registerActionChanged
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Callback registration for ActionChanged message.
			 * @param {function} fn
			 * @returns null
			 */
			service.registerActionChanged = function (fn) {
				actionChanged.register(fn);
			};

			/**
			 * @ngdoc function
			 * @name unregisterActionChanged
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Callback unregistration for ActionChanged message.
			 * @param {function} fn
			 * @returns null
			 */
			service.unregisterActionChanged = function (fn) {
				actionChanged.unregister(fn);
			};

			/**
			 * @ngdoc function
			 * @name getActionByKey
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Returns the Action with the given key.
			 * @param {string} key
			 * @returns {Platform.Action}
			 */
			service.getActionByKey = function (key) {
				var result = getActionByKeyUnSave(key);
				if (angular.isUndefined(result)) {
					result = new Platform.Action();
				}
				return result;
			};

			/**
			 * @ngdoc function
			 * @name getActionGroup
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Returns all Actions of the given group.
			 * @param {string} group
			 * @returns {Platform.Action[]}
			 */
			service.getActionGroup = function (group) {
				return _.filter(actions, {group: group, visible: true});
			};

			service.getTools = function (configuredItems) {

				var tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: []
				};

				let moduleConfig = basicsConfigNavCommandbarService.moduleConfigurations[$rootScope.currentModule];
				if(moduleConfig && ((globals.portal && moduleConfig.NavbarPortalEnabled) || (!globals.portal && moduleConfig.NavBarEnabled)))
				{
					if(configuredItems) {
						actions.map(function (item) {
							configuredItems.map(function (configItem) {
								if (item.key === configItem.ItemCode) {
									item.visible = configItem.ConfigVisibility;
									item.sortOrder = configItem.ConfigSorting;
									if (configItem.ConfigIsMenuItem) {
										item.group = 'defaultOptions';
										adjustIcons(item, true);
									} else {
										item.group = 'navBar';
										adjustIcons(item, false);
									}
								}
							});
						});
					}

					//sort according to sortOrder
					actions = actions.sort((a, b) => {
						if (a.sortOrder === null) {
							return 1;
						}

						if (b.sortOrder === null) {
							return -1;
						}

						if (a.sortOrder === b.sortOrder) {
							return 0;
						}

						return a.sortOrder < b.sortOrder ? -1 : 1;
					});
				}

				// ensure all item translated
				platformTranslateService.translateObject(actions, ['description']);

				tools.items.push(generateMenuItemList(_.filter(actions, {group: 'navBar'})));

				tools.items.push(
					{
						caption: 'defaultOptions',
						type: 'sublist',
						list: {
							showTitles: true,
							items: generateMenuItemList(_.filter(actions, {group: 'defaultOptions'}))
						}
					}
				);

				tools.items.push(
					{
						caption: 'defaultOptions',
						type: 'sublist',
						list: {
							showTitles: true,
							items: generateMenuItemList(_.filter(actions, {group: 'moduleOptions'}))
						}
					}
				);

				tools.navBarActions = applyPermission(_.filter(actions, {group: 'navBar'}));
				tools.defaultOptionsActions = applyPermission(_.filter(actions, {group: 'defaultOptions'}));
				tools.moduleOptionsActions = applyPermission(_.filter(actions, {group: 'moduleOptions'}));

				return tools;
			};

			function adjustIcons(item, isMenuItem) {
				if (typeof item.iconCSS === 'string') {
					item.iconCSS = isMenuItem ? item.iconCSS.replace('tlb-wh-icons', 'tlb-icons') : item.iconCSS.replace('tlb-icons', 'tlb-wh-icons');
				}
				/*else if(typeof item.iconCSS  === 'function') {
					let icon = item.iconCSS();
					item.iconCSS = isMenuItem ? icon.replace('tlb-wh-icons', 'tlb-icons') : icon.replace('tlb-icons', 'tlb-wh-icons');
				}*/
			}

			service.getActions = function () {
				return actions;
			};

			function applyPermission(actions) {
				return _.reduce(actions, function (result, action) {
					if (_.isString(action.permission)) {
						var splits = action.permission.split('#');
						var permission = {};

						permission[splits[0]] = platformPermissionService.permissionsFromString(splits[1]);

						var hasPermission = _.reduce(_.keys(permission), function (result, descriptor) {
							result &= platformPermissionService.has(descriptor, permission[descriptor]);

							return result;
						}, true);

						if (hasPermission) {
							result.push(action);
						}
					} else {
						result.push(action);
					}

					return result;
				}, []);
			}

			function generateMenuItemList(list) {
				return _.reduce(list, function (result, item) {
					var tool = item.getMenuListItem();

					if (_.isString(tool.permission)) {
						var splits = tool.permission.split('#');

						tool.permission = {};
						tool.permission[splits[0]] = platformPermissionService.permissionsFromString(splits[1]);
					}

					var hasPermission = _.reduce(_.keys(tool.permission || {}), function (result, descriptor) {
						result &= platformPermissionService.has(descriptor, tool.permission[descriptor]);

						return result;
					}, true);

					if (hasPermission) {
						result.push(tool);
					}

					return result;
				}, []);
			}

			/**
			 * @ngdoc function
			 * @name addAction
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Adds a action or updates the action with the same key.
			 * @param {Platform.Action} item
			 * @returns null
			 */
			service.addAction = function (item) {
				addActionInternal(item);
				actionChanged.fire();
			};

			service.addActions = function (newActions) {
				for (var i = 0; i < newActions.length; i++) {
					addActionInternal(newActions[i]);
				}
				actionChanged.fire();
			};

			/**
			 * @ngdoc function
			 * @name removeAction
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Remove the action with the given key.
			 * @param {string} key
			 * @returns null
			 */
			service.removeAction = function (key) {
				var index = arrayObjectIndexOf(actions, 'key', key);
				if(index >= 0) {
					actions.splice(index, 1);
					actionChanged.fire();
				}
			};

			service.removeActions = function (keys) {
				var index = -1;
				for (var i = 0; i < keys.length; i++) {
					index = arrayObjectIndexOf(actions, 'key', keys[i]);
					if(index >= 0) {
						actions.splice(index, 1);
					}
				}
				actionChanged.fire();
			};
			/**
			 * @ngdoc function
			 * @name setActionInVisible
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Convenience function to set the action with the given key invisible.
			 * @param {string} key
			 * @returns null
			 */
			service.setActionInVisible = function (key) {
				service.getActionByKey(key).visible = false;
				actionChanged.fire();
			};
			/**
			 * @ngdoc function
			 * @name setActionVisible
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Convenience function to set the action with the given key visible.
			 * @param {string} key
			 * @returns null
			 */
			service.setActionVisible = function (key) {
				service.getActionByKey(key).visible = true;
				actionChanged.fire();
			};
			/**
			 * @ngdoc function
			 * @name setActionDisabled
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Convenience function to set the action with the given key disabled.
			 * @param {string} key
			 * @returns null
			 */
			service.setActionDisabled = function (key) {
				service.getActionByKey(key).disabled = true;
				actionChanged.fire();
			};
			/**
			 * @ngdoc function
			 * @name setActionEnabled
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Convenience function to set the action with the given key enabled.
			 * @param {string} key
			 * @returns null
			 */
			service.setActionEnabled = function (key) {
				service.getActionByKey(key).disabled = false;
				actionChanged.fire();
			};
			/**
			 * @ngdoc function
			 * @name clearActions
			 * @function
			 * @methodOf platform.platformNavBarService
			 * @description Remove all actions. Typical use case for the function is the shutdown of a module.
			 * @param null
			 * @returns null
			 * <example module="module">
			 <file name="moduleControler.js">
			   $scope.$on('$destroy', function () {
					platformNavBarService.clearActions();
				});
			 </file>
			 </example>
			 */
			service.clearActions = function () {
				actions.length = 0;
				copyDefaultActions();
				actionChanged.fire();
			};

			return service;
		}

		this.$get = platformNavBarServiceFactory;
	}
})(angular, Platform);
