/*
 * $Id: config-location-list-service.js 521460 2018-11-15 05:58:36Z haagf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCommonConfigLocationListService
	 * @function
	 * @requires _, platformTranslateService, platformPermissionService, $q, moment, PlatformMessenger
	 *
	 * @description Provides items for selecting a configuration location (AKA access scope, such as User, Role,
	 *              System, or Portal) in a combo box or other type of selection list, as well as related utilities.
	 */
	angular.module('basics.common').factory('basicsCommonConfigLocationListService', ['_', 'platformTranslateService',
		'platformPermissionService', '$q', 'moment', 'PlatformMessenger',
		function (_, platformTranslateService, platformPermissionService, $q, moment, PlatformMessenger) {
			const service = {};

			const canonicalConfigLocations = [{
				id: 'u',
				longId: 'user',
				value: '0',
				title$tr$: 'basics.common.configLocation.user',
				name$tr$: 'basics.common.configLocation.user',
				priority: 1000
			}, {
				id: 'r',
				longId: 'role',
				value: '2',
				title$tr$: 'basics.common.configLocation.role',
				name$tr$: 'basics.common.configLocation.role',
				priority: 100
			}, {
				id: 'g',
				longId: 'system',
				value: '1',
				title$tr$: 'basics.common.configLocation.system',
				name$tr$: 'basics.common.configLocation.system',
				priority: 10
			}, {
				id: 'p',
				longId: 'portal',
				value: '3',
				title$tr$: 'basics.common.configLocation.portal',
				name$tr$: 'basics.common.configLocation.portal',
				priority: 50
			}];

			/**
			 * @ngdoc function
			 * @name createItems
			 * @function
			 * @methodOf basicsCommonConfigLocationListService
			 * @description Creates an array of items that can be inserted into a combo box.
			 * @param {Boolean|Object} config An object with properties named like the IDs or long IDs of the access scopes.
			 *                         Only such access scopes will be included in the result for which the respective
			 *                         property is truthy. If a single boolean value of `true` is passed instead of an
			 *                         object, all access scopes will be included.
			 * @returns {Array} The array of items. Each item has a localized title in both its `title` and its 'name'
			 *                  properties, an identifier (`u`, `r`, `g`, or `p`, respectively) in its `id` property,
			 *                  a long ID in its `longId` property, and a numerical value ('0', '2', or '1',
			 *                  respectively) in its 'value' property. Furthermore, each item has a `priority` property.
			 *                  The higher the priority, the more localized the setting.
			 *                  The array has additional `byId` and `byLongId` map properties to directly retrieve items
			 *                  based upon the respective IDs.
			 */
			service.createItems = function (config) {
				const configLocations = _.cloneDeep(canonicalConfigLocations);
				platformTranslateService.translateObject(configLocations, ['title', 'name']);

				let actualConfig;
				if (config === true) {
					actualConfig = {};
					configLocations.forEach(function (scope) {
						actualConfig[scope.longId] = true;
					});
				} else if (angular.isObject(config)) {
					actualConfig = {};
					configLocations.forEach(function (scope) {
						actualConfig[scope.longId] = !!(config[scope.longId] || config[scope.id]);
					});
				} else {
					actualConfig = {
						user: true,
						role: true,
						system: true,
						portal: false
					};
				}

				const result = _.filter(configLocations, function (scope) {
					return actualConfig[scope.longId];
				});

				result.byId = {};
				result.byLongId = {};
				result.forEach(function (scope) {
					result.byId[scope.id] = scope;
					result.byLongId[scope.longId] = scope;
				});

				return result;
			};

			/**
			 * @ngdoc function
			 * @name checkAccessRights
			 * @function
			 * @methodOf basicsCommonConfigLocationListService
			 * @description Checks whether certain permissions are granted by access scope.
			 * @param {Object} requiredPermissions An object that may have properties named like access scope IDs. Each
			 *                                     of these properties can contain either a single permission item or
			 *                                     an array of permission items. Each permission item can either be an
			 *                                     object with a `descriptor` and a `permission` property, or just a
			 *                                     string identifying the permission descriptor, if the
			 *                                     `requiredPermissions` object has a `permission` property.
			 * @returns {Promise<Object>} A promise that is resolved to an object with one property per access scope.
			 *                            Each property contains a boolean value that is `true` if and only if all
			 *                            permissions for the access scope are granted.
			 */
			service.checkAccessRights = function (requiredPermissions) {
				function retrievePermissionItem(item) {
					if (item) {
						if (angular.isString(item)) {
							req.allDescriptors.push(item);
							return {
								descriptor: item,
								permission: requiredPermissions.permission
							};
						} else {
							req.allDescriptors.push(item.descriptor);
							return item;
						}
					} else {
						throw new Error('Permission items must not be falsy.');
					}
				}

				const accessScopes = canonicalConfigLocations;

				const req = {
					allDescriptors: []
				};
				accessScopes.forEach(function (accessScope) {
					if (requiredPermissions) {
						const requiredScopedPermissions = requiredPermissions[accessScope.id];
						if (requiredScopedPermissions) {
							if (angular.isArray(requiredScopedPermissions)) {
								req[accessScope.id] = _.map(requiredScopedPermissions, function (item) {
									return retrievePermissionItem(item);
								});
							} else {
								req[accessScope.id] = [retrievePermissionItem(requiredScopedPermissions)];
							}
						} else {
							req[accessScope.id] = [];
						}
					} else {
						req[accessScope.id] = [];
					}
				});

				if (req.allDescriptors.length > 0) {
					return platformPermissionService.loadPermissions(req.allDescriptors).then(function () {
						const result = {};
						accessScopes.forEach(function (accessScope) {
							result[accessScope.id] = true;
							req[accessScope.id].forEach(function (reqPermission) {
								if (!platformPermissionService.has(reqPermission.descriptor, reqPermission.permission)) {
									result[accessScope.id] = false;
								}
							});
						});
						return result;
					});
				} else {
					const result = {};
					accessScopes.forEach(function (accessScope) {
						result[accessScope.id] = true;
					});
					return $q.when(result);
				}
			};

			/**
			 * @ngdoc function
			 * @name checkAllAccessRights
			 * @function
			 * @methodOf basicsCommonConfigLocationListService
			 * @description Checks whether certain permissions are granted by access scope, for several distinct named
			 *              sets of scoped permissions at a time.
			 * @param {Array<Object>} requiredPermissions An array of objects, each of whose items should have a
			 *                                            `permissions` property that is structured like the
			 *                                            `requiredPermissions` argument to {@see checkAccessRights},
			 *                                            as well as an `id` property.
			 * @returns {Promise<Object>} A promise that is resolved to an object with one property per item from
			 *                            `requiredPermissions`, using the value of the item's `id` property as a name.
			 *                            Each item contains an object like the one returned by
			 *                            {@see checkAccessRights}.
			 */
			service.checkAllAccessRights = function (requiredPermissions) {
				const result = {};

				const promises = [];
				requiredPermissions.forEach(function (item) {
					promises.push(service.checkAccessRights(item.permissions).then(function (p) {
						result[item.id] = p;
					}));
				});

				return $q.all(promises).then(function () {
					return result;
				});
			};

			/**
			 * @ngdoc function
			 * @name canAccess
			 * @function
			 * @methodOf basicsCommonConfigLocationListService
			 * @description Checks whether something from one access scope can access something from another access
			 *              scope.
			 * @param {String} from The short or long ID of the source access scope.
			 * @param {String} to The short or long ID of the target access scope.
			 * @returns {Boolean} A value that indicates whether something from scope `from` can access something from
			 *                    scope `to`.
			 */
			service.canAccess = function (from, to) {
				const fromScope = _.find(canonicalConfigLocations, function (s) {
					return (s.id === from) || (s.longId === from);
				});
				const toScope = _.find(canonicalConfigLocations, function (s) {
					return (s.id === to) || (s.longId === to);
				});

				if (fromScope && toScope) {
					return fromScope.priority >= toScope.priority;
				} else {
					throw new Error('Invalid arguments.');
				}
			};

			/**
			 * @ngdoc function
			 * @name createMenuItems
			 * @function
			 * @methodOf basicsCommonConfigLocationListService
			 * @description Creates menu items for a list of items, where the menu items are grouped by access scope.
			 * @param {Array<Object>} items The items.
			 * @param {Object} config An optional configuration object.
			 * @returns {Object} An object that contains a sublist menu item with all the contained items.
			 */
			service.createMenuItems = function (items, config) {
				const invalidId = '::::invalid::::';

				const actualConfig = _.assign({
					asToggle: false,
					asRadio: false,
					clickFunc: null,
					id: moment().valueOf().toString(16) + ':' + Math.floor(Math.random() * 100000).toString(16),
					scopeSource: 'scopeLevel'
				}, config || {});
				actualConfig.isSelectable = actualConfig.asToggle || actualConfig.asRadio;

				const scopes = service.createItems(true);

				actualConfig.headers = {};
				scopes.forEach(function (scope) {
					actualConfig.headers[scope.id] = scope.title;
				});
				if (config && config.headers) {
					actualConfig.headers = _.assign(actualConfig.headers, config.headers);
				}

				if (angular.isFunction(actualConfig.scopeSource)) {
					actualConfig.getItemScope = function (item) {
						const resultId = actualConfig.scopeSource(item);
						let result = scopes.byId[resultId];
						if (!result) {
							result = scopes.byLongId[resultId];
							if (!result) {
								result = scopes.byId.u;
							}
						}
						return result;
					};
				} else {
					actualConfig.getItemScope = function (item) {
						const resultId = item[actualConfig.scopeSource];
						let result = scopes.byId[resultId];
						if (!result) {
							result = scopes.byLongId[resultId];
							if (!result) {
								result = scopes.byId.u;
							}
						}
						return result;
					};
				}

				const rootItem = {
					id: actualConfig.id,
					type: 'sublist',
					list: {
						showTitles: true
					}
				};
				if (actualConfig.asRadio) {
					rootItem.list.cssClass = 'radio-group';
					rootItem.list.activeValue = invalidId;
				}

				const privateState = {
					reset: function () {
						this.allItems = [];
						this.itemById = {};
					},
					onSelectionChanged: new PlatformMessenger()
				};
				privateState.reset();

				const result = {
					menuItem: rootItem,
					updateItems: function (newItems) {
						const currentSelection = actualConfig.isSelectable ? this.getSelection() : null;

						const actualItems = angular.isArray(newItems) ? newItems : [];

						privateState.reset();

						const itemsByScope = {};
						actualItems.forEach(function (item) {
							const itemScope = actualConfig.getItemScope(item);

							let itemsList = itemsByScope[itemScope.id];
							if (!itemsList) {
								itemsByScope[itemScope.id] = itemsList = [];
							}

							const itemCopy = _.assign({
								type: actualConfig.asRadio ? 'radio' : (actualConfig.asToggle ? 'check' : 'item'),
								fn: function () {
									privateState.onSelectionChanged.fire();
									actualConfig.clickFunc.apply(this, arguments);
								}
							}, item);
							if (actualConfig.asRadio) {
								itemCopy.value = item.id;
							} else if (actualConfig.asToggle) {
								itemCopy.value = false;
							}

							privateState.allItems.push(item);
							privateState.itemById[itemCopy.id] = item;

							itemsList.push(itemCopy);
						});

						const finalItemsList = [];
						_.orderBy(scopes, function (scope) {
							return scope.priority;
						}).forEach(function (scope) {
							const itemsList = itemsByScope[scope.id];
							if (itemsList) {
								finalItemsList.push({
									id: rootItem.id + '-' + scope.id,
									type: 'item',
									disabled: true,
									cssClass: 'title',
									caption: actualConfig.headers[scope.id]
								});
								finalItemsList.push.apply(finalItemsList, itemsList);
							}
						});
						rootItem.list.items = finalItemsList;

						if (actualConfig.isSelectable) {
							this.setSelection(currentSelection);
						}
					},
					getSelection: function () {
						if (actualConfig.asRadio) {
							return rootItem.list.activeValue === invalidId ? null : privateState.itemById[rootItem.list.activeValue].id;
						} else if (actualConfig.asToggle) {
							return _.map(_.filter(privateState.allItems, function (itemRec) {
								return !!itemRec.item.value;
							}), function (itemRec) {
								return itemRec.item.id;
							});
						} else {
							throw new Error('Non-toggleable items do not have a selection.');
						}
					},
					setSelection: function (ids) {
						if (angular.isArray(ids) && (ids.length > 1)) {
							if (!actualConfig.asToggle && !actualConfig.asRadio) {
								throw new Error('Non-toggleable items cannot have a selection.');
							}
							if (actualConfig.asRadio) {
								throw new Error('Cannot select more than one radio item.');
							}
						}

						let selectionChanged = false;
						if (actualConfig.asRadio) {
							(function setRadioSelection() {
								const selValue = angular.isArray(ids) ? (ids.length > 0 ? ids[0] : null) : ids;
								let newActiveValue;
								if ((selValue === null) || (selValue === undefined) || !privateState.itemById[selValue]) {
									newActiveValue = invalidId;
								} else {
									newActiveValue = '' + selValue;
								}
								if (newActiveValue !== rootItem.list.activeValue) {
									rootItem.list.activeValue = newActiveValue;
									selectionChanged = true;
								}
							})();
						} else {
							(function setCheckSelection() {
								const selValues = angular.isArray(ids) ? ids : ((ids === null) || (ids === undefined) ? [] : [ids]);
								const selValuesMap = {};
								selValues.forEach(function (v) {
									selValuesMap[v] = true;
								});

								privateState.allItems.forEach(function (item) {
									const itemVal = !item.value;
									const isInSelValuesMap = !!selValuesMap[item.id];
									if (itemVal !== isInSelValuesMap) {
										item.value = isInSelValuesMap;
										selectionChanged = true;
									}
								});
							})();
						}
						if (selectionChanged) {
							privateState.onSelectionChanged.fire();
						}
					},
					registerSelectionChanged: function (handler) {
						privateState.onSelectionChanged.register(handler);
					},
					unregisterSelectionChanged: function (handler) {
						privateState.onSelectionChanged.unregister(handler);
					}
				};

				result.updateItems(items);

				return result;
			};

			service.createFieldOverload = function (config) {
				const items = service.createItems(config);
				const isReadOnly = _.isObject(config) && !!config.readonly;
				return {
					grid: {
						formatter: 'select',
						formatterOptions: {
							items: items,
							valueMember: 'id',
							displayMember: 'title'
						},
						editor: 'select',
						editorOptions: {
							items: items,
							valueMember: 'id',
							displayMember: 'title'
						},
						readonly: isReadOnly
					},
					detail: {
						type: 'select',
						options: {
							items: items,
							valueMember: 'id',
							displayMember: 'title'
						},
						readonly: isReadOnly
					}
				};
			};

			return service;
		}]);
})();