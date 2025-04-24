/*
 * $Id: menu-list-utilities-service.js 501972 2018-07-03 11:57:01Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformMenuListUtilitiesService
	 * @function
	 * @requires _, moment, PlatformMessenger, platformTranslateService
	 *
	 * @description Provides utilities for creating and populating menu lists.
	 */
	angular.module('platform').factory('platformMenuListUtilitiesService', ['_', 'moment', 'PlatformMessenger',
		'platformTranslateService',
		function (_, moment, PlatformMessenger, platformTranslateService) {
			var service = {};

			service.createFlatItems = function (config) {
				var invalidId = '::::invalid::::';

				var actualConfig = _.assign({
					asToggle: false,
					asRadio: false,
					dropdown: false,
					clickFunc: null,
					id: moment().valueOf().toString(16) + ':' + Math.floor(Math.random() * 100000).toString(16),
					itemFactory: function (item) {
						return _.clone(item);
					},
					idProperty: 'id',
					updateMenu: function () {
					},
					separateCategoryProperty: null
				}, config || {});
				actualConfig.isSelectable = actualConfig.asToggle || actualConfig.asRadio;

				var items = _.isArray(actualConfig.items) ? actualConfig.items : [];

				var rootItem = {
					id: actualConfig.id,
					iconClass: actualConfig.iconClass,
					caption: actualConfig.title,
					type: actualConfig.dropdown ? 'dropdown-btn' : 'sublist',
					list: {
						showTitles: true
					}
				};
				if (actualConfig.asRadio) {
					rootItem.list.cssClass = 'radio-group';
					rootItem.list.activeValue = invalidId;
				}

				var privateState = {
					reset: function () {
						this.allItems = [];
						this.itemById = {};
					},
					onSelectionChanged: new PlatformMessenger()
				};
				privateState.reset();

				var result = {
					menuItem: rootItem,
					updateItems: function (newItems) {
						var currentSelection = actualConfig.isSelectable ? this.getSelection() : null;

						var actualItems = _.map(angular.isArray(newItems) ? newItems : [], function createMenuItem(item) {
							var result = actualConfig.itemFactory(item);

							if (actualConfig.idProperty !== 'id') {
								item.id = item[actualConfig.idProperty];
							}

							if (actualConfig.asRadio) {
								result.type = 'radio';
								result.value = item[actualConfig.idProperty];
							} else if (actualConfig.asToggle) {
								result.type = 'check';
								result.value = false;
							} else {
								result.type = 'item';
							}

							var customClickFunc = _.isFunction(result.fn) ? result.fn : actualConfig.clickFunc;
							result.fn = function () {
								privateState.onSelectionChanged.fire();
								if (_.isFunction(customClickFunc)) {
									customClickFunc.apply(this, arguments);
								}
							};

							return result;
						});

						privateState.reset();

						if (_.isString(actualConfig.separateCategoryProperty)) {
							var lastCategory = null;

							for (var i = actualItems.length - 1; i >= 0; i--) {
								var currentCategory = actualItems[i][actualConfig.separateCategoryProperty];
								if (currentCategory !== lastCategory) {
									if (i < actualItems.length - 1) {
										actualItems.splice(i + 1, 0, {
											type: 'divider'
										});
									}

									lastCategory = currentCategory;
								}
							}
						}

						actualItems.forEach(function addItem(item) {
							privateState.allItems.push(item);
							if (!_.isNil(item.id)) {
								privateState.itemById[item.id] = item;
							}
						});

						rootItem.list.items = actualItems;

						if (actualConfig.isSelectable) {
							this.setSelection(currentSelection);
						}

						actualConfig.updateMenu();
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

						var selectionChanged = false;
						if (actualConfig.asRadio) {
							(function setRadioSelection() {
								var selValue = angular.isArray(ids) ? (ids.length > 0 ? ids[0] : null) : ids;
								var newActiveValue;
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
								var selValues = angular.isArray(ids) ? ids : ((ids === null) || (ids === undefined) ? [] : [ids]);
								var selValuesMap = {};
								selValues.forEach(function (v) {
									selValuesMap[v] = true;
								});

								privateState.allItems.forEach(function (item) {
									var itemVal = !item.value;
									var isInSelValuesMap = !!selValuesMap[item.id];
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

			service.createToggleItemForObservable = function (config) {
				var actualConfig = _.assign({
					updateMenu: function () {
						if (!_.isNil(this.toolsScope)) {
							this.toolsScope.tools.update();
						}
					}
				}, _.isObject(config) ? config : {});

				if (_.isObject(actualConfig.value.uiHints)) {
					actualConfig = _.assign({}, actualConfig.value.uiHints, actualConfig);
				}

				platformTranslateService.translateObject(actualConfig, [
					'caption'
				], {
					recursive: false
				});

				var result = {
					id: actualConfig.id,
					sort: actualConfig.sort,
					caption: actualConfig.caption,
					iconClass: actualConfig.iconClass,
					type: 'check',
					value: actualConfig.value.getValue(),
					fn: function () {
						actualConfig.value.setValue(this.value);
					}
				};

				actualConfig.updateItemState = function (newValue) {
					result.value = newValue;
					actualConfig.updateMenu();
				};

				actualConfig.value.registerValueChanged(actualConfig.updateItemState);
				result.destroy = function () {
					actualConfig.value.unregisterValueChanged(actualConfig.updateItemState);
				};

				return result;
			};

			return service;
		}]);
})();