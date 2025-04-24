(function () {

	'use strict';

	const moduleName = 'basics.common';
	const basics = angular.module(moduleName);
	const serviceName = 'basicsCommonRuleAdapterService';
	basics.factory(serviceName, ['_', 'platformGridAPI', 'platformToolbarService', 'platformObjectHelper', '$timeout',

		function (_, platformGridAPI, platformToolbarService, objectHelper, $timeout) {
			const service = {};
			service.addRuleEditorAdapter = function addRuleEditorAdapter($scope, dataService) {
				$scope.ruleDefinition = [];

				function loadRules() {
					// unregister before loading new data, so the watch does not trigger
					if (_.isFunction($scope.unRegister)) {
						$scope.unRegister();
						$scope.unRegister = null;
					}
					const parentService = dataService.parentService();
					const selected = dataService.getSelected();
					if (objectHelper.isSet(selected) && objectHelper.isSet(selected.ConditionFk)) {
						$scope.isLoading = true;
						parentService.getRuleDefinitionByTopFk(selected.ConditionFk).then(function (ruleTree) {
							$scope.isLoading = false;
							// $scope.ruleDefinition = [];
							$scope.ruleDefinition = ruleTree;
							$timeout(function () {
								setWatch();
							}, 0);
						});
					} else {
						$scope.ruleDefinition = [];
						setWatch();
					}
				}

				dataService.registerSelectionChanged(function () {
					updateOverlayVisibility();
					loadRules();
				});

				function updateOverlayVisibility() {
					$scope.showInfoOverlay = dataService.getList().length === 0;
				}

				function setWatch() {

					$scope.unRegister = $scope.$watch('ruleDefinition', function (newRulesList, oldRulesList) {
						const selectedItem = dataService.getSelected();
						if (newRulesList !== oldRulesList) {
							// the old root has an Id but the new not -> root Deleted
							if (oldRulesList[0] && oldRulesList[0].Id && _.isEmpty(newRulesList)) {
								selectedItem.ConditionFk = null;
								dataService.markCurrentItemAsModified();
							}

							// the new root has an Id but the old not -> root Added
							if (newRulesList[0] && newRulesList[0].Id && _.isEmpty(oldRulesList)) {
								selectedItem.ConditionFk = newRulesList[0].Id;// take the root
								dataService.markCurrentItemAsModified();
							}

							if (objectHelper.isSet(oldRulesList, oldRulesList[0]) && objectHelper.isSet(newRulesList) && objectHelper.isSet(newRulesList[0]) && newRulesList[0].Id === oldRulesList[0].Id) {
								dataService.parentService().saveRuleDefinition(newRulesList);
							}
						}
					}, true);
				}

				function reSort(list) {
					_.each(list, function (item, index) {
						item.Sorting = index;
						dataService.markItemAsModified(item);
					});
				}

				$scope.setTools = function (tools) {
					tools.items = platformToolbarService.getTools($scope.gridId, tools.items);
					tools.update = function () {
						// check whether to display overlay or not.
						updateOverlayVisibility();
						tools.version += 1;
					};
					tools.items.push({
						id: 't100',
						sort: 100,
						caption: 'cloud.common.toolbarMoveUp',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse',
						fn: function moveUpSelected() {
							let list = dataService.getList();
							// let itemToMove = null;
							const selected = dataService.getSelected();
							if (selected) {
								const index = _.findIndex(list, function (item) {
									if (item.Id === selected.Id) {
										// itemToMove = item;
										return true;
									}
								});
								if (index > 0) {
									const newIndex = index - 1;
									list = objectHelper.arrayItemMove(list, index, newIndex);
									reSort(list);
									dataService.deselect();
									dataService.gridRefresh();
									dataService.setSelected(list[newIndex]);
								}
							}
						},
						disabled: function disabled() {
							return !dataService.getSelected();
						}
					});

					tools.items.push({
						id: 't110',
						sort: 110,
						caption: 'cloud.common.toolbarMoveDown',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand',
						fn: function moveDownSelected() {
							let list = dataService.getList();
							// let itemToMove = null;
							const selected = dataService.getSelected();
							if (selected) {
								const index = _.findIndex(list, function (item) {
									if (item.Id === selected.Id) {
										// itemToMove = item;
										return true;
									}
								});
								if (index < (list.length - 1)) {
									const newIndex = index + 1;
									list = objectHelper.arrayItemMove(list, index, newIndex);
									reSort(list);
									dataService.deselect();
									dataService.gridRefresh();
									dataService.setSelected(list[newIndex]);
								}
							}
						},
						disabled: function disabled() {
							return !dataService.getSelected();
						}
					});

					let overflowButtonIndex = null;
					_.each(tools.items, function (item, index) {
						if (item.type === 'overflow-btn') {
							overflowButtonIndex = index;
							return false;
						}
					});

					// put overflowBtn  to the last position
					tools.items = objectHelper.arrayItemMove(tools.items, overflowButtonIndex, tools.items.length - 1);
					$scope.tools = tools;
				};

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);
					dataService.unregisterSelectionChanged(loadRules);

					if (_.isFunction($scope.unRegister)) {
						$scope.unRegister();
						$scope.unRegister = null;
					}
				});
			};
			return service;
		}]);
})(angular);
