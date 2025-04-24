/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('editorContainer', editorContainerDirective);

	editorContainerDirective.$inject = ['$templateCache', '_', '$timeout', 'layoutEditorService', '$translate'];

	function editorContainerDirective($templateCache, _, $timeout, layoutEditorService, $translate) {
		var directive = {};
		directive.restrict = 'A';
		directive.scope = {};
		directive.template = $templateCache.get('layout-editor-container.html');
		directive.require = '^layoutEditorContent';

		directive.compile = function () {
			return {
				pre: function (scope, ele, attr) {

					scope.paneId = attr.id;
				},
				post: function (scope, ele, attr, ctrl) {

					var createDefaultOption = function () {

						const defaultOption = {
							displayMember: 'title',
							valueMember: 'uuid',
							selected: null,
							showDragZone: true,
							showSearchfield: true
						};

						layoutEditorService.updateAvailableViews(ctrl.getUnselectedViews());
						let copy = _.cloneDeep(defaultOption);
						copy.items = ctrl.items;
						// get current 'options' in selectbox
						copy.displayedItems = layoutEditorService.availableViews;
						copy.uuid = _.uniqueId();
						copy.alpha = layoutEditorService.shortcuts;
						copy.shortcut = '-';
						return copy;
					};

					// click-event on x-button
					scope.removeOptionByUUID = function (optionToRemove) {

						if (optionToRemove) {
							scope.removeView(getItem(optionToRemove.selected));
						}

						_.remove(scope.optionsList, function (option) {
							return option.uuid === optionToRemove.uuid;
						});
					};

					scope.optionsList = [];

					scope.dropHandler = {
						// used to determine drag zone is allowed are not.
						accept: function (sourceItemHandleScope) {
							// prevent dropping when there is no selected item
							// return sourceItemHandleScope.selectedItem && sourceItemHandleScope.selectedItem.id;

							// noinspection JSUnresolvedVariable
							return sourceItemHandleScope.itemScope.opt && sourceItemHandleScope.itemScope.opt.selected;
						}
					};

					var setContainerTitle = function setContainerTitle() {
						var counterSelectedItems = 0;
						var lastSelectedItem = {'uuid': '#'};
						_.each(scope.optionsList, function (option) {
							if (option.selected !== null) {
								counterSelectedItems++;
								lastSelectedItem = option;
							}
						});

						if (counterSelectedItems > 1) {
							scope.containerTitle = $translate.instant('platform.layoutsystem.tabbedContainer');
						} else {
							setTitleByUUID(lastSelectedItem.selected);
						}
					};

					var handleOptions = function handleOptions() {

						var toPromise = $timeout(function () {
							if (countOptionsWithoutSelection() < 1 && (countUsedViews() < ctrl.items.length)) {
								// create new DropDown
								scope.optionsList.push(createDefaultOption());
							}
							// remove DropDown
							else if (countOptionsWithoutSelection() >= 1 && countUsedViews() === ctrl.items.length) {
								for (var i = scope.optionsList.length - 1; i >= 0 && countOptionsWithoutSelection() >= 1; i--) {
									if (scope.optionsList[i].selected === null) {
										scope.optionsList.splice(i, 1);
									}
								}
							}
							$timeout.cancel(toPromise);
						}, 0, true);
					};

					function getDiffItem(largerArr, smallerArr) {
						var result = '';
						for (var i = 0; i < largerArr.length; i++) {

							result = _.find(smallerArr, {uuid: largerArr[i].uuid});
							if (typeof (result) === 'undefined') {
								// return the difference
								return largerArr[i];
							}
						}
					}

					function getViewObjectByUUID(optionItem) {
						return _.find(optionItem.items, {uuid: optionItem.selected});
					}

					var unregister = [];

					unregister.push(scope.$watch('optionsList', function (newList, oldList) {
						var diffOptionItem = null;
						var viewObject = null;

						// noinspection JSUnresolvedVariable
						if (oldList.length !== newList.length) {

							// noinspection JSUnresolvedVariable
							if (oldList.length > newList.length) {

								diffOptionItem = getDiffItem(oldList, newList);
								viewObject = getViewObjectByUUID(diffOptionItem);
								if (viewObject) {
									ctrl.removeView(scope.paneId, viewObject);
									const selected = _.find(layoutEditorService.shortcuts.items, function (item) {
										return item.character === viewObject.shortcut;
									});
									if (selected) {
										selected.isHidden = false;
									}
								}
							}

							// noinspection JSUnresolvedVariable
							if (newList.length > oldList.length) {

								diffOptionItem = getDiffItem(newList, oldList);
								viewObject = getViewObjectByUUID(diffOptionItem);
								if (viewObject) {
									ctrl.addSelectedView(scope.paneId, viewObject);
									const selected = _.find(layoutEditorService.shortcuts.items, function (item) {
										return item.character === viewObject.shortcut;
									});
									if (selected && selected.character !== '-') {
										selected.isHidden = true;
									}
									/*
									 Bug: #79528 -> Layout manager does not sort properly.
									 Tab-item not sorted after moving(drag&drop) in another tabbed Container.
									 The js-function dropHandler.orderChanges has been removed. Had the same function.
									 */
									layoutEditorService.reorderViews(scope.paneId, newList);

									/*
									 Be to avoid, that empty selectbox is in the middle. Empty selectbox belongs down.
									 in function handleOptions get a new empty selectbox.
									 */

									// noinspection JSCheckFunctionSignatures
									_.remove(newList, function (item) {
										return item.selected === null;
									});
								}
							}
						} else {
							// by select-change
							processAfterChangeSelectItem(oldList, newList);
						}

						setContainerTitle();
						handleOptions();
						// update 'options' in selectbox
						layoutEditorService.shortcuts.displayedItems = layoutEditorService.shortcuts.items.filter(function (item) {
							return !item.isHidden;
						});
						layoutEditorService.updateAvailableViews(ctrl.getUnselectedViews());
					}, true));

					ctrl.registerOndropDownValueChanged(handleOptions);

					var setTitleByUUID = function (uuid) {
						var item = _.find(ctrl.items, {uuid: uuid});
						scope.containerTitle = '';
						if (item) {
							scope.containerTitle = item.title;
						}
					};

					var countUsedViews = function () {
						var counter = 0;
						for (var i = 0; i < ctrl.items.length; i++) {
							if (ctrl.items[i].isHidden && ctrl.items[i].isHidden === true) {
								counter++;
							}
						}
						return counter;
					};

					var countOptionsWithoutSelection = function () {
						var counter = 0;
						_.each(scope.optionsList, function (option) {
							if (!option.selected) {
								counter++;
							}
						});
						return counter;
					};

					scope.additionalCss = 'e2e-content-value-';

					scope.selectedItemChanged = function (newItem, prevItem) {

						if (newItem) {
							// isHidden == true --> dont show in selectbox
							newItem.isHidden = true;
						}

						if (prevItem) {
							prevItem.isHidden = false;
							scope.removeView(prevItem);
						}

						ctrl.addSelectedView(attr.id, newItem);
						ctrl.valueChanged();
					};

					scope.removeView = function (item) {
						if (item) {
							// remove from select-list
							item.isHidden = false;
							ctrl.removeView(scope.paneId, item);
						}
						ctrl.valueChanged();
					};

					var views = ctrl.getSelectedViews(scope.paneId);

					if (views.length === 0) {
						scope.optionsList.push(createDefaultOption());
					} else {
						angular.forEach(views, function (view) {
							var option = createDefaultOption();
							option.selected = view.uuid;
							option.shortcut = view.shortcut;
							if (view.shortcut !== '-') {
								const selected = _.find(layoutEditorService.shortcuts.items, function (item) {
									return item.character === view.shortcut;
								});
								if (selected) {
									selected.isHidden = true;
								}
							}
							scope.optionsList.push(option);
						});
						handleOptions();
						layoutEditorService.shortcuts.displayedItems = layoutEditorService.shortcuts.items.filter(function (item) {
							return !item.isHidden;
						});
					}

					function processAfterChangeSelectItem(oldList, newList) {
						var requiredUUIDs = getNewPrevItemUUID(oldList, newList);
						if (!_.isEmpty(requiredUUIDs)) {
							if (requiredUUIDs.newSelectUUID) {
								scope.selectedItemChanged(getItem(requiredUUIDs.newSelectUUID), getItem(requiredUUIDs.oldSelectUUID));
							}
							else if (requiredUUIDs.newShortcut && requiredUUIDs.viewUUID) {
								if (requiredUUIDs.newShortcut !== '-') {

									_.forEach(layoutEditorService.shortcuts.items, function (item) {
										if (item.character === requiredUUIDs.newShortcut) {
											item.isHidden = true;
										}
										else if (item.character === requiredUUIDs.oldShortcut) {
											item.isHidden = false;
										}
									})
								}
								ctrl.setShortcut(attr.id, requiredUUIDs.viewUUID, requiredUUIDs.newShortcut);
							}
						}
					}

					// After change selected Item. Find newItem and oldItem
					function getNewPrevItemUUID(oldValue, newValue) {
						var _uuids = {};

						// [0], [1], [2], ... compare
						/*
						 oldValue[0].selected != oldValue[0].selected
						 */
						angular.forEach(oldValue, function (value, index) {
							if (value.selected !== newValue[index].selected) {
								_uuids.oldSelectUUID = value.selected;
								_uuids.newSelectUUID = newValue[index].selected;
							}
							if (value.shortcut !== newValue[index].shortcut) {
								_uuids.oldShortcut = value.shortcut;
								_uuids.newShortcut = newValue[index].shortcut;
								_uuids.viewUUID = value.selected;
							}
						});

						return _uuids;
					}

					function getItem(value) {
						var _toReturn = null;

						angular.forEach(scope.optionsList, function (option) {
							for (var i = 0; i < option.items.length; i++) {
								if (option.items[i][option.valueMember] === value) {
									_toReturn = option.items[i];
								}
							}
						});
						return _toReturn;
					}

					unregister.push(scope.$on('$destroy', function () {
						ctrl.unregisterOndropDownValueChanged(handleOptions);
						scope.optionsList = [];

						_.over(unregister)();
						unregister = null;
					}));

				}
			};
		};

		return directive;
	}
})(angular);
