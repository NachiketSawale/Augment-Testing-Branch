/* globals angular */
(function (angular) {
	'use strict';

	basicsWorkflowBaseGridController.$inject = ['$timeout', '_', 'platformGridAPI', 'platformModuleStateService', 'basicsWorkflowUIService'];

	function basicsWorkflowBaseGridController($timeout, _, platformGridAPI, platformModuleStateService, basicsWorkflowUIService) { // jshint ignore:line
		var factory = {};

		factory._ = _;
		factory.gridAPI = platformGridAPI;

		factory.extend = function ($scope, module, currentItemProp, itemsProp, selectionConfig) {

			factory.state = platformModuleStateService.state(module);

			$scope.platformGridAPI = platformGridAPI;

			$scope.gridVisible = selectionConfig && _.isFunction(selectionConfig.isParentSelected) ? selectionConfig.isParentSelected() : true;

			$scope.isNewButtonDisabled = function () {
				return !$scope.isNewPossible;
			};

			$scope.isDeleteButtonDisabled = function () {
				return !$scope.isDeletePossible;
			};

			$scope.changeToolbar = function (isNewPos, isDeletePos) {
				if (isNewPos !== null) {
					$scope.isNewPossible = isNewPos;
				}
				if (isDeletePos !== null) {
					$scope.isDeletePossible = isDeletePos;
				}
				if ($scope.tools && angular.isFunction($scope.tools.update)) {
					$scope.tools.update();
				}
			};

			$scope.newItemIsAdded = false;
			$scope.isNewPossible = false;
			$scope.isDeletePossible = false;

			function getCurrentItem() {
				return factory.state[currentItemProp];
			}

			function getItems() {
				return factory.state[itemsProp];
			}

			function whenCurrentItemChanged(newVal, oldVal) {
				if (newVal && (newVal !== oldVal)) {
					$scope.changeToolbar(null, true);
					platformGridAPI.rows.selection({
						gridId: $scope.gridId,
						rows: [newVal],
						nextEnter: $scope.newItemIsAdded
					});
					$scope.newItemIsAdded = false;
				}
				factory.state.rootService.selectionChanged.fire();
			}

			function whenItemsChanged(newVal) {
				var newItems = _.differenceWith(newVal, platformGridAPI.items.data($scope.gridId), _.isEqual);
				newItems = $scope.gridId === '14d5f58009ff11e5a6c01697f925ec7b' && factory.state.creatingNewTemplate ? [_.find(factory.state.mainEntities, {Id: factory.state.newestCreatedTemplateId})] : newItems;
				var deletedItems = _.differenceWith(platformGridAPI.items.data($scope.gridId), newVal, _.isEqual);
				var selected = angular.isObject(currentItemProp) ? factory.state[currentItemProp.name] :
					factory.state[currentItemProp];
				if (newVal || deletedItems) {
					if (newItems.length > 0 || (newVal && newVal.length === 0)) {
						_.forEach(newVal, function (item) {
							if (!item.__rt$data) {
								item.__rt$data = {
									readonly: false
								};
							} else {
								item.__rt$data.readonly = false;
							}
						});
						$scope.newItemIsAdded = true; //TODO: why execute this when newVal is empty array?
					}
					platformGridAPI.items.data($scope.gridId, newVal);
				}

				if (selected) {
					if (angular.isArray(selected)) {
						platformGridAPI.rows.selection({
							gridId: $scope.gridId,
							rows: selected
						});
					} else {
						platformGridAPI.rows.selection({
							gridId: $scope.gridId,
							rows: [selected]
						});
					}
					factory.state.rootService.selectionChanged.fire();
				}
			}

			$scope.setItems = whenItemsChanged;
			$scope.setCurrentItem = whenCurrentItemChanged;

			if (angular.isString(itemsProp)) {
				$scope.itemsWatch = $scope.$watchCollection(getItems, whenItemsChanged);
			} else if (angular.isFunction(itemsProp)) {
				$scope.itemsWatch = $scope.$watchCollection(itemsProp, whenItemsChanged);
			} else if (angular.isObject(itemsProp)) {
				$scope.itemsWatch = $scope.$watchCollection(itemsProp.expression, itemsProp.listener);
			}

			if (angular.isString(currentItemProp)) {
				$scope.currentItemWatch = $scope.$watch(getCurrentItem, whenCurrentItemChanged);
			} else if (angular.isFunction(currentItemProp)) {
				$scope.currentItemWatch = $scope.$watch(currentItemProp, whenCurrentItemChanged);
			} else if (angular.isObject(currentItemProp)) {
				$scope.itemsWatch = $scope.$watchCollection(currentItemProp.expression, currentItemProp.listener);
			}

			if (selectionConfig && _.isFunction(selectionConfig.isParentSelected)) {
				$scope.parentSelectionWatch = $scope.$watch(selectionConfig.isParentSelected, selectionConfig.listener);
			}

			$scope.gridId = $scope.getContainerUUID();
			basicsWorkflowUIService.addGridId($scope.gridId);

			$scope.gridData = {
				state: $scope.gridId,
				config: {},
				moduleState: factory.state
			};

			function onDestroy($scope) {

				factory.state.dirtyItems = [];
				if (_.isFunction($scope.currentItemWatch)) {
					$scope.currentItemWatch();
				}
				if (_.isFunction($scope.itemsWatch)) {
					$scope.itemsWatch();
				}
				if (_.isFunction($scope.parentSelectionWatch)) {
					$scope.parentSelectionWatch();
				}

				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				basicsWorkflowUIService.removeGridId($scope.gridId);
			}

			$scope.changeCurrentItem = function (item) {
				if ($scope.currentItemWatch) {
					$scope.currentItemWatch();
				}

				if ($scope.parentSelectionWatch) {
					$scope.parentSelectionWatch();
				}
				var currentItemPropName;
				if (angular.isObject(currentItemProp)) {
					currentItemPropName = currentItemProp.name;
				} else {
					currentItemPropName = currentItemProp;
				}

				factory.state[currentItemPropName] = item;
				$scope.currentItemWatch = $scope.$watch(getCurrentItem, whenCurrentItemChanged);

				if (selectionConfig && _.isFunction(selectionConfig.isParentSelected)) {
					$scope.parentSelectionWatch = $scope.$watch(selectionConfig.isParentSelected, selectionConfig.listener);
				}
			};

			$scope.configGrid = function (grid) {
				var gridInstance = platformGridAPI.grids.element('Id', $scope.gridId);
				if (!gridInstance) {
					platformGridAPI.grids.config(grid);
				}
			};

			$scope.refreshGrid = function refreshGrid() {
				platformGridAPI.grids.refresh($scope.gridId);
			};

			$scope.resizeGrid = function resizeGrid() {
				platformGridAPI.grids.resize($scope.gridId);
			};

			$scope.onContentResized($scope.resizeGrid);

			function onSelectedRowsChanged(a, b) {
				var current = null;
				if (b.rows.length > 0) {
					var wantsArray = (b.rows.length > 1);
					var selected = platformGridAPI.rows.selection({
						gridId: $scope.gridId,
						wantsArray: wantsArray
					});

					var currentItemPropName;
					if (angular.isObject(currentItemProp)) {
						currentItemPropName = currentItemProp.name;
					} else {
						currentItemPropName = currentItemProp;
					}

					if (angular.isDefined(selected)) {
						if (factory.state.mainItemIsDirty && angular.isFunction($scope.saveHook) && factory.state.selectedMainEntity) {
							$scope.saveHook(factory.state.selectedMainEntity);
						}

						if (angular.isString(itemsProp)) {
							current = _.find(factory.state[itemsProp], {Id: selected.Id});
						} else if (angular.isFunction(itemsProp)) {
							$scope.itemsWatch = $scope.$watchCollection(itemsProp, whenItemsChanged);
							current = _.find(itemsProp(), {Id: selected.Id});
						} else if (angular.isObject(itemsProp)) {
							current = _.find(_.get(factory.state, itemsProp.name), {Id: selected.Id});
						}

						if (selectionConfig && _.isFunction(selectionConfig.isParentSelected)) {
							$scope.parentSelectionWatch = $scope.$watch(selectionConfig.isParentSelected, selectionConfig.listener);
						}

						// If multiple rows (as an array) are selected.
						if (angular.isUndefined(current)) {
							current = selected;
						}
					}
					// In Workflow Designer, to select a templateVersion after hard refresh and display the design.
					else if (angular.isObject(itemsProp)) {
						current = _.find(_.get(factory.state, itemsProp.name), {Id: selected.Id});
					}
				}

				$scope.changeCurrentItem(current);
				$timeout(function () {
					$scope.$apply();
				});
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			function onCellChange() {
				factory.state[currentItemProp.name] = platformGridAPI.rows.selection({gridId: $scope.gridId});

				if (_.isArray(factory.state.dirtyItems) && !_.find(factory.state.dirtyItems, {Id: factory.state[currentItemProp.name].Id})) {
					factory.state.dirtyItems.push(factory.state[currentItemProp.name]);
				} else {
					factory.state.dirtyItems = [factory.state[currentItemProp.name]];
				}
				factory.state.mainItemIsDirty = true;
			}

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

			$scope.showGridLayoutConfigDialog = function () {
				platformGridAPI.configuration.openConfigDialog($scope.gridId);
			};

			var prop;
			if (currentItemProp) {
				if (angular.isString(currentItemProp)) {
					prop = currentItemProp;
				} else {
					prop = currentItemProp.name;
				}
				if (factory.state[prop]) {
					$timeout(function () {
						whenCurrentItemChanged(factory.state[prop], null);
					}, 250, false);

				}
			}

			$scope.$on('$destroy', function () {
				onDestroy($scope);
			});
		};
		return factory;
	}

	angular.module('basics.workflow').factory('basicsWorkflowBaseGridController', basicsWorkflowBaseGridController);

})(angular);
