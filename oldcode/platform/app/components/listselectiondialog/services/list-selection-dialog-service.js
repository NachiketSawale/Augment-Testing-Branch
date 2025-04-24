/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformListSelectionDialogService
	 * @function
	 *
	 * @description Displays a dialog box with two lists, one for available items and one for selected items.
	 */
	angular.module('platform').factory('platformListSelectionDialogService',
		platformListSelectionDialogService);

	platformListSelectionDialogService.$inject = ['_', 'platformDialogService',
		'platformTranslateService', '$translate', 'basicsCommonUtilities'];

	function platformListSelectionDialogService(_, platformDialogService,
		platformTranslateService, $translate, basicsCommonUtilities) {

		const service = {};

		const state = {
			nextDialogId: 1
		};

		function generateDefaultColumnsIfRequired(config, columnsProperty) {
			if (!_.isArray(config[columnsProperty]) || (config[columnsProperty].length <= 0)) {
				config[columnsProperty] = [{
					id: 'description',
					formatter: 'description',
					name: 'Item',
					name$tr$: 'platform.listselection.item',
					field: config.displayNameProperty,
					width: 200
				}];
			}
		}

		service.showDialog = function (config) {
			function transformTranslationIfAvailable(propName) {
				if (actualConfig[propName + 'Key']) {
					console.warn(propName + 'Key is obsolete. Please use ' + propName + '$tr$.');
					actualConfig[propName + '$tr$'] = actualConfig[propName + 'Key'];
					delete actualConfig[propName + 'Key'];
				}
			}

			const actualConfig = _.assign({
				backdrop: 'static',
				availableTitle$tr$: 'platform.listselection.available',
				selectedTitle$tr$: 'platform.listselection.selected',
				idProperty: 'id',
				temporarySelectedIdProperty: '__selItemId',
				displayNameProperty: 'name',
				allItems: [],
				value: [],
				isSelectable: function (item) {
					if (_.isNil(this.childrenProperty)) {
						return true;
					} else {
						const children = item[this.childrenProperty];
						return !_.isArray(children) || (children.length <= 0);
					}
				},
				canInsertMultiple: function () {
					return this.allowInsertMultiple;
				},
				hideWithoutChildren: function (item) {
					if (this.isSelectable(item)) {
						return false;
					}
					if (!_.isNil(this.childrenProperty)) {
						return _.isArray(item[this.childrenProperty]);
					}
					return false;
				},
				allowInsertMultiple: false,
				childrenProperty: null,
				sortItems: null,
				acceptSelection: function () {
					return true;
				}
			}, config || {});

			transformTranslationIfAvailable('availableTitle');
			transformTranslationIfAvailable('selectedTitle');
			transformTranslationIfAvailable('dialogTitle');

			platformTranslateService.translateObject(actualConfig, undefined, {recursive: false});

			generateDefaultColumnsIfRequired(actualConfig, 'availableColumns');
			generateDefaultColumnsIfRequired(actualConfig, 'selectedColumns');
			actualConfig.value = _.map(actualConfig.value, function (selItem, index) {
				let itemObj;
				if (_.isObject(selItem)) {
					itemObj = selItem;
				} else {
					itemObj = {};
					itemObj[actualConfig.idProperty] = selItem;
				}
				itemObj[actualConfig.temporarySelectedIdProperty] = index + 1;
				return itemObj;
			});

			const dlgOptions = {
				width: '60%',
				height: '60%',
				resizeable: true,
				headerText: actualConfig.dialogTitle,
				headerText$tr$: actualConfig.dialogTitle$tr$,
				backdrop: actualConfig.backdrop,
				buttons: [{
					id: 'ok',
					disabled: function () {
						return !actualConfig.acceptSelection(createCleanSelectedItems());
					}
				}, {
					id: 'cancel'
				}],
				bodyTemplateUrl: globals.appBaseUrl + 'app/components/listselectiondialog/partials/list-selection-dialog-body.html',
				dataItem: {
					id: state.nextDialogId++,
					cfg: actualConfig,
					availableItemsTree: !_.isNil(actualConfig.childrenProperty),
					getItemId: function (item) {
						if (_.isUndefined(item)) {
							return undefined;
						}

						return item[actualConfig.idProperty];
					},
					getSelectedItemId: function (item) {
						if (_.isUndefined(item)) {
							return undefined;
						}

						return item[actualConfig.temporarySelectedIdProperty];
					},
					findAvailableItemById: function (id) {
						function findItemInList(itemList) {
							let result = null;
							itemList.some(function (avItem) {
								if (that.getItemId(avItem) === id) {
									result = avItem;
									return true;
								}

								if (that.availableItemsTree) {
									const subItems = avItem[actualConfig.childrenProperty];
									if (_.isArray(subItems)) {
										result = findItemInList(subItems);
										if (result) {
											return true;
										}
									}
								}

								return false;
							});
							return result;
						}

						const that = this;
						return findItemInList(actualConfig.allItems);
					},
					getAvailableItems: function () {
						const that = this;

						function getItems(itemList) {
							return _.filter(_.map(itemList, function (avItem) {
								if (actualConfig.isSelectable(avItem) && !actualConfig.canInsertMultiple(avItem)) {
									if (_.find(actualConfig.value, function (selItem) {
										return that.getItemId(avItem) === that.getItemId(selItem);
									})) {
										return null;
									}
								}

								let injectChildren;
								if (that.availableItemsTree) {
									let children = avItem[actualConfig.childrenProperty];
									if (_.isArray(children)) {
										children = getItems(children);
									}
									if (actualConfig.hideWithoutChildren(avItem)) {
										const hasChildren = _.isArray(children) && (children.length > 0);
										if (!hasChildren) {
											return null;
										}
									}
									injectChildren = function (val, propName) {
										if (propName === actualConfig.childrenProperty) {
											return children;
										}
									};
								} else {
									injectChildren = null;
								}

								return _.cloneDeepWith(avItem, injectChildren);
							}), function (avItem) {
								return !!avItem;
							});
						}

						return getItems(actualConfig.allItems);
					},
					getSelectedItems: function () {
						const that = this;
						return _.filter(_.map(actualConfig.value, function (selItem) {
							const id = that.getItemId(selItem);
							const itemDef = that.findAvailableItemById(id);
							if (itemDef) {
								return _.assign(_.cloneDeep(itemDef), selItem);
							} else {
								return null;
							}
						}), function (selItem) {
							return !_.isNil(selItem);
						});
					},
					getAllSelectableItems: function () {
						const that = this;

						function addItemsFromList(itemList) {
							itemList.forEach(function (item) {
								if (actualConfig.isSelectable(item)) {
									result.push(item);
								}
								if (that.availableItemsTree) {
									const childItems = item[actualConfig.childrenProperty];
									if (_.isArray(childItems)) {
										addItemsFromList(childItems);
									}
								}
							});
						}

						const result = [];
						addItemsFromList(actualConfig.allItems);
						return result;
					},
					generateSelectedItemId: function () {
						const that = this;
						const existingIds = basicsCommonUtilities.arrayAsSetObject(actualConfig.value, function (selItem) {
							return that.getSelectedItemId(selItem);
						});
						for (let id = 1; ; id++) {
							if (!existingIds[id]) {
								return id;
							}
						}
					},
					createSelectedItem: function (availableItemId) {
						if (_.isUndefined(availableItemId)) {
							return undefined;
						}

						const newSelItem = {};
						newSelItem[actualConfig.idProperty] = availableItemId;
						newSelItem[actualConfig.temporarySelectedIdProperty] = this.generateSelectedItemId();
						return newSelItem;
					},
					sortSelectedItems: function sortSelectedItems() {
						const that = this;
						if (_.isFunction(actualConfig.sortItems)) {
							const sortedItems = actualConfig.sortItems(_.map(actualConfig.value, function (selItem) {
								const selItemId = that.getItemId(selItem);
								const avItem = that.findAvailableItemById(selItemId) || {};

								const selItemClone = _.clone(selItem);
								return selItemClone;
								//return _.assign(selItemClone, avItem);
							}));
							if (!_.isArray(sortedItems)) {
								throw new Error('If supplied, the sortItems method must return an array.');
							}

							const selItemsById = _.keyBy(actualConfig.value, function (selItem) {
								return that.getSelectedItemId(selItem);
							});
							const sortedSelItems = _.map(sortedItems, function (selItemClone) {
								return selItemsById[that.getSelectedItemId(selItemClone)];
							});

							Array.prototype.splice.apply(actualConfig.value, Array.prototype.concat.apply([0, actualConfig.value.length], sortedSelItems));
						}
					},
					copyItemProperties: function (from, to) {
						if (_.isFunction(actualConfig.copyItemProperties)) {
							actualConfig.copyItemProperties(from, to);
						}
					}
				}
			};

			dlgOptions.dataItem.sortSelectedItems();
			platformTranslateService.translateObject(dlgOptions, undefined, {recursive: false});

			function createCleanSelectedItems() {
				return _.map(actualConfig.value, function (selItem) {
					let result = _.cloneDeep(selItem);

					if (_.isFunction(dlgOptions.dataItem.addItemSettingsFromUi)) {
						dlgOptions.dataItem.addItemSettingsFromUi(result);
					}

					delete result[actualConfig.temporarySelectedIdProperty];

					const avItem = dlgOptions.dataItem.findAvailableItemById(dlgOptions.dataItem.getItemId(result));
					if (avItem) {
						result = _.assign({}, avItem, result);
					}

					return result;
				});
			}

			return platformDialogService.showDialog(dlgOptions).then(function (result) {
				actualConfig.value.splice.apply(actualConfig.value, _.concat([0, actualConfig.value.length], createCleanSelectedItems()));
				return {
					success: !!result.ok,
					ok: !!result.ok,
					value: actualConfig.value
				};
			});
		};

		return service;
	}
})(angular);
