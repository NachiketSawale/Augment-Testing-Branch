/**
 * Created by lid on 7/26/2017.
 */
(function () {

	'use strict';
	const moduleName = 'basics.common';
	const masterModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	masterModule.controller('treeviewListDialogMainController', TreeviewListDialogMainController);
	TreeviewListDialogMainController.$inject = ['$scope', '$injector', '$translate', '$timeout', '$modalInstance', 'keyCodes', 'treeviewListDialogDataService', '$', '_'];

	function TreeviewListDialogMainController($scope, $injector, $translate, $timeout, $modalInstance, keyCodes, treeviewListDialogDataService, $, _) {

		const dialogConfig = treeviewListDialogDataService.getDialogConfig();
		const isShowTreeview = dialogConfig.isShowTreeview;
		const listService = $injector.get(dialogConfig.listServiceName);

		let treeviewService = {};
		if (isShowTreeview) {
			treeviewService = $injector.get(dialogConfig.treeviewServiceName);
		}

		$scope.options = {};
		const options = $scope.options;

		$scope.enableMultiSelection = false;
		$scope.instantSearch = false;

		$scope.modalOptions = {
			closeButtonText: $translate.instant('cloud.common.cancel'),
			actionButtonText: $translate.instant('cloud.common.ok'),
			refreshButtonText: $translate.instant('basics.common.button.refresh'),
			disableOkButton: true,
			selectedItems: [],

			ok: ok,
			close: onClose,
			refresh: refresh,
			onMultipleSelection: onMultipleSelection
		};
		angular.extend($scope.modalOptions, dialogConfig);

		$scope.search = search;
		$scope.onSearchInputKeydown = onSearchInputKeydown;
		$scope.setTools = function setTools(tools) {
			$scope.tools = tools || {};
			$scope.tools.update = function () {
			};
		};

		function load(callBackFunc) {
			if (isShowTreeview) {
				treeviewService.load().then(function () {
					listService.loadAllItems().then(function () {
						if (angular.isFunction(callBackFunc)) {
							callBackFunc();
							$('div[modal-window]').find('input:first').focus();
						}
					});
				});
			} else {
				listService.loadAllItems().then(function () {
					if (angular.isFunction(callBackFunc)) {
						callBackFunc();
						$('div[modal-window]').find('input:first').focus();
					}
				});
			}
		}

		function initialize() {
			listService.isInit(true);
			listService.setReloadData($scope.modalOptions.needReloadData);
			$modalInstance.opened.then(function () {
				listService.setList([]);
				if (isShowTreeview) {
					treeviewService.setReloadData($scope.modalOptions.needReloadData);
					treeviewService.setSelected({}).then(function () {
						$timeout(function () {
							load(function () {
								treeviewService.filterStructureCategories(options);
								treeviewService.collapseAll.fire();
								listService.isInit(false);
							});
						}, 300);
					});
				} else {
					$timeout(function () {
						load(function () {
							listService.isInit(false);
						});
					}, 300);
				}
			});
		}

		function ok(result) {
			const selectedItems = $scope.enableMultiSelection ? listService.getMultipleSelectedItems() : listService.getSelectedEntities();
			result = $.extend(result, {isOk: true});

			treeviewListDialogDataService.ok(selectedItems);

			$modalInstance.close(result);
		}

		function onClose() {
			listService.setItemFilter(null);
			$modalInstance.dismiss('cancel');
		}

		function refresh() {
			$scope.modalOptions.disableOkButton = true;
			listService.resetMultipleSelection.fire();

			listService.refresh().then(function () {
				if (isShowTreeview) {
					const categorySelected = isShowTreeview ? treeviewService.getSelected() : {};
					const itemSelected = listService.getSelected();

					treeviewService.refresh().then(function () {
						if (itemSelected && categorySelected) {
							listService.isInit(true);

							treeviewService.filterStructureCategories(options);
							treeviewService.expandNode(categorySelected);
							treeviewService.reloadGridExpanded();

							listService.filterItems(null).then(function (filteredItems) {
								listService.setList(filteredItems);
								listService.setItemFilter(null);
								listService.setSelected({}).then(function () {
									listService.setSelected(itemSelected).then(function () {
										treeviewService.setSelected(categorySelected);
										$timeout(function () {
											listService.isInit(false);
										}, 260);
									});
								});
							});
						} else {
							listService.setSelected(null);
							listService.setList([]);
						}

					});
				} else {
					listService.setSelected(null);
					// listService.setList([]);
				}
			});
		}

		function search(searchValue) {
			$scope.modalOptions.disableOkButton = true;
			listService.setIsListBySearch(true);
			listService.setSelected({}).then(function () {
				listService.search(searchValue);
			});
		}

		function onSearchInputKeydown(event, searchValue) {
			if (event.keyCode === keyCodes.ENTER || $scope.instantSearch) {
				$scope.search(searchValue);
			}
		}

		function onMultipleSelection(enabled) {
			$scope.enableMultiSelection = enabled;
			if (enabled) {
				$scope.modalOptions.selectedItems = listService.getSelectedEntities();
				$scope.modalOptions.disableOkButton = _.isEmpty(listService.getMultipleSelectedItems());
			} else {
				listService.resetMultipleSelection.fire();
			}
		}

		initialize();

		_.extend($scope.modalOptions, {
			cancel: onClose
		});

		$scope.$on('$destroy', function () {
			listService.resetMultipleSelection.fire();
			onClose();
		});
	}
})();
