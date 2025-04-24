/*
 * $Id: master-detail-dialog-controller.js 605621 2020-10-05 06:35:42Z alisch $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name platform.controller:platformMasterDetailDialogController
	 * @requires _, $scope, $q, platformTranslateService, $translate
	 * @description Controller for the master detail dialog box.
	 */
	angular.module('platform').controller('platformMasterDetailDialogController', ['_', '$scope', '$q',
		'platformTranslateService', '$translate',
		function (_, $scope, $q, platformTranslateService, $translate) { // jshint ignore:line
			$scope.getContainerUUID = function () {
				return '3cb864a826444b4a9a30da8d4c3347ce';
			};

			var data = $scope.dialog ? $scope.dialog.modalOptions.value : $scope.modalOptions.value;

			$scope.formController = '';

			$scope.itemsEditable = !!data.editing;
			var nameProperty = data.itemDisplayMember || 'Name';

			$scope.nameProperty = nameProperty;
			$scope.formOptions = null;
			$scope.searchSettings = {
				isSearchActive: false,
				searchPlaceholder: $translate.instant('platform.masterdetail.filterTemplate'),
				searchTerm: ''
			};

			var toolBarItems = [];

			if (data.editing) {
				toolBarItems.push({
					id: 'add',
					sort: 1,
					caption: data.editing.addKey || 'platform.masterdetail.add',
					iconClass: 'tlb-icons ico-add',
					type: 'item',
					fn: function () {
						$q.when(data.editing.add(data.items)).then(function (newItem) {
							updateList();
							if (!_.includes($scope.displayedItems, newItem)) {
								$scope.displayedItems.push(newItem);
							}
							$scope.selectItem(newItem);
						});
					},
					disabled: function () {
						return !data.editing || !angular.isFunction(data.editing.add);
					}
				}, {
					id: 'delete',
					sort: 2,
					caption: data.editing.deleteKey || 'platform.masterdetail.delete',
					iconClass: 'tlb-icons ico-delete2',
					type: 'item',
					fn: function () {
						if ($scope.selectedItem) {
							deleteMasterItem($scope.selectedItem, true);
						}
					},
					disabled: function () {
						return !data.editing || !$scope.selectedItem || !angular.isFunction(data.editing.delete) || (angular.isFunction(data.editing.canDelete) && !data.editing.canDelete(data.items, $scope.selectedItem));
					}
				});
			}

			function deleteMasterItem(item) {
				if (item) {
					var index = _.findIndex($scope.displayedItems, function (i) {
						return i === item;
					});

					$q.when(data.editing.delete(data.items, item)).then(function () {
						updateList();

						if (index === 0) {
							if ($scope.displayedItems.length > 0) {
								selectItemByIndex(0);
							}
						} else {
							if (($scope.displayedItems.length - 1) >= index) {
								selectItemByIndex(index);
							} else {
								var newIndex = index - 1;

								if (newIndex > -1) {
									selectItemByIndex(newIndex);
								}
							}
						}
					});
				}
			}

			function isTitle(item) {
				return item && _.includes(item.cssClass, 'title');
			}

			function selectItemByIndex(index) {
				if (!_.isNumber(index)) {
					return;
				}

				if (index >= $scope.displayedItems.length) {
					return;
				}

				selectItem($scope.displayedItems[index]);
			}

			function selectItem(item) {
				var itemToSelect;

				if (_.isNull(item) || ($scope.displayedItems.length === 0)) {
					$scope.selectItem(null);
					return;
				}

				if (_.isObject(item)) {
					if (!isTitle(item) && !isDisabled(item) && _.includes($scope.displayedItems, item)) {
						itemToSelect = item;
					}
				}

				if (!itemToSelect) {
					itemToSelect = $scope.displayedItems.find(function findItem(i) {
						// select first item which isn't disabled and not a title
						return !isDisabled(i) && !isTitle(i);
					});
				}

				if (itemToSelect) {
					$scope.selectItem(itemToSelect);
				} else {
					$scope.selectItem(null);
				}
			}

			toolBarItems.push({
				id: 'find',
				sort: 20,
				caption: 'platform.masterdetail.filter',
				iconClass: 'tlb-icons ico-search',
				type: 'check',
				value: false,
				fn: function (btnId, btn) {
					$scope.$evalAsync(function () {
						$scope.searchSettings.isSearchActive = btn.value;
						updateList($scope.selectedItem);
					});
				}
			});

			var getDataChangedMember = function getDataChangedMember() {
				if (data.dataChangedMember) {
					if (angular.isString(data.dataChangedMember)) {
						return data.dataChangedMember;
					} else {
						return data.dataChangeMember ? '__changed' : undefined;
					}
				}

				return undefined;
			};

			var createCustomTool = function (item) {
				return {
					id: item.id,
					sort: item.sort,
					caption: item.caption,
					iconClass: item.iconClass,
					type: item.type,
					fn: function () {
						if (item.fn) { // call only if there is a function declared
							var info = {
								selectedMasterItem: $scope.selectedItem,
								dataChangeMember: getDataChangedMember(),
								data: _.get($scope.selectedItem, 'data')
							};

							item.fn.apply(this, [item.id, item, info]);
						}
					},
					disabled: function () {
						if (!(_.isUndefined(item.disabled) || _.isNull(item.disabled))) {
							if (_.isFunction(item.disabled)) {
								var info = {
									selectedMasterItem: $scope.selectedItem
								};
								return item.disabled(info);
							} else {
								return item.disabled;
							}
						} else {
							return false;
						}
					}
				};
			};

			toolBarItems.unshift({type: 'divider'});
			if (data.customTools && angular.isArray(data.customTools)) {
				for (var i = data.customTools.length - 1; i > -1; i--) {
					toolBarItems.unshift(createCustomTool(data.customTools[i]));
				}
			}

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				align: 'left',
				items: toolBarItems,
				update: function () {
					this.version++;
				}
			};

			$scope.selectedItem = null;

			var preparedItems = [];
			$scope.selectItem = function (item) {
				if (isDisabled(item) || !isVisible(item) || isTitle(item)) {
					return;
				}

				$scope.selectedItem = item;
				$scope.formController = _.get(item, 'controller');

				if (item && item.form && item.form.prepareData && !_.includes(preparedItems, item.Id)) {
					$q.when(item.form.prepareData(item, $scope)).then(function () {
						preparedItems.push(item.Id);
						updateSelection();
					});
				} else {
					updateSelection();
				}
			};

			function updateSelection() {
				$scope.$evalAsync(function () {
					if ($scope.formOptions && angular.isArray($scope.formOptions.finalizers)) {
						$scope.formOptions.finalizers.forEach(function (f) {
							f();
						});
					}
					if ($scope.selectedItem) {
						var frm = {
							// ToDo: It isn't a good pratice not to clone the form data. So the form data could be changed also if the dialog is canceled
							// configure: _.cloneDeep($scope.selectedItem.form || data.defaultForm || {}),
							configure: $scope.selectedItem.form || data.defaultForm || {},
							finalizers: []
						};
						frm.configure.skipPermissionCheck = true;

						// if (!frm.configure.onChange) {
						// 	frm.configure.onChange = frm.configure.change;
						// }
						frm.configure.change = function (entity, field, control) {

							var dataChangedMember = getDataChangedMember();
							if (dataChangedMember) {
								entity.data[dataChangedMember] = true;
							}

							// if user change function exists, then apply this
							if (_.isFunction(frm.configure.onChange)) {
								frm.configure.onChange.apply(this, [entity, field, control]);
							}
						};

						platformTranslateService.translateFormConfig(frm.configure);
						$scope.formOptions = frm;
						if (angular.isArray(frm.configure.initializers)) {
							frm.configure.initializers.forEach(function (f) {
								var finalizer = f($scope, 'selectedItem');
								if (angular.isFunction(finalizer)) {
									frm.finalizers.push(finalizer);
								}
							});
						}
					} else {
						$scope.formOptions = null;
					}
					if ($scope.tools && _.isFunction($scope.tools.update)) {
						$scope.tools.update();
					}
				});
			}

			$scope.$watch('searchSettings.searchTerm', function (newValue) {
				$scope.searchSettings.searchRegEx = new RegExp(_.escapeRegExp(newValue), 'i');

				if ($scope.searchSettings.isSearchActive) {
					updateList($scope.selectedItem);
				}
			});

			$scope.isDisabled = isDisabled;
			$scope.isVisible = isVisible;

			function isDisabled(item) {
				if (item && item.hasOwnProperty(getDisabledMember())) {
					return item[getDisabledMember()];
				} else {
					return false;
				}
			}

			function isVisible(item) {
				if (item && item.hasOwnProperty(getVisibleMember())) {
					return item[getVisibleMember()];
				} else {
					return true;
				}
			}

			function removeUnnecessaryTitles(items) {
				// title is unnecessary if it doesn't contain any child item
				var lastWasTitle = false;
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if (isTitle(item)) {
						if (lastWasTitle) {
							items.splice(i - 1, 1);
						} else {
							lastWasTitle = true;
						}
					} else {
						lastWasTitle = false;
					}
				}
			}

			function updateList(selectedItem) {
				$scope.items = angular.isArray(data.items) ? data.items : [];

				var filteredItems = [];

				filteredItems = _.filter($scope.items, function (item) {
					return isVisible(item);
				});

				if ($scope.searchSettings.isSearchActive) {
					filteredItems = _.filter(filteredItems, function (item) {
						if (isTitle(item)) {
							return true;
						} else if (angular.isFunction(item.matchesSearchText)) {
							return item.matchesSearchText($scope.searchSettings.searchRegEx);
						} else {
							var itemName = item[nameProperty];
							if (!itemName) {
								itemName = '';
							}
							return $scope.searchSettings.searchRegEx.test(itemName);
						}
					});
				}

				removeUnnecessaryTitles(filteredItems);
				$scope.displayedItems = filteredItems;

				if (filteredItems.length === 0) {
					selectItem();
				} else if (selectedItem) {
					selectItem(selectedItem);
				}
			}

			function getDisabledMember() {
				return data.itemDisabledMember || 'disabled';
			}

			function getVisibleMember() {
				return data.itemVisibleMember || 'visible';
			}

			function doInitialItemSelect() {
				selectItem();
			}

			updateList();
			doInitialItemSelect();
		}]);
})();
