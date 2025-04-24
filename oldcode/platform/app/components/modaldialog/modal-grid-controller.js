/**
 * Created in workshop GZ
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc service
	 * @name platformModalGridController
	 * @function
	 *
	 * @description
	 * Controller for a modal dialogue displaying the data in a form container
	 **/
	angular.module('platform').controller('platformModalGridController', ['$scope', '$timeout', '$translate', 'platformModalGridConfigService', 'platformGridAPI', 'platformDataServiceSelectionExtension',
		function ($scope, $timeout, $translate, platformModalGridConfigService, platformGridAPI, platformDataServiceSelectionExtension) {
			// scope variables/ functions
			$scope.error = {};
			$scope.path = globals.appBaseUrl;
			$scope.modalTitle = platformModalGridConfigService.getDialogTitle();
			$scope.gridId = platformModalGridConfigService.getGridUUID();
			$scope.resizeable = true;

			var settings = platformModalGridConfigService.getGridConfiguration();
			var validationService = platformModalGridConfigService.getUsedValidationService();

			if (validationService && settings.addValidationAutomatically) {
				_.forEach(settings.columns, function (col) {
					var colField = col.field.replace(/\./g, '$');

					var syncName = 'validate' + colField;
					var asyncName = 'asyncValidate' + colField;

					if (validationService[syncName]) {
						col.validator = validationService[syncName];
					}

					if (validationService[asyncName]) {
						col.asyncValidator = validationService[asyncName];
					}
				});
			}

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					columns: angular.copy(settings.columns),
					data: [],
					id: $scope.gridId,
					lazyInit: true,
					options: {
						tree: platformModalGridConfigService.usesTree(),
						indicator: true,
						idProperty: 'Id',
						iconClass: '',
						skipPermissionCheck: settings.skipPermissionCheck
					}
				};

				if (platformModalGridConfigService.hasIconClass()) {
					grid.options.iconClass = platformModalGridConfigService.getIconClass();
				}

				if (platformModalGridConfigService.usesTree()) {
					grid.options.parentProp = platformModalGridConfigService.getParentProp();
					grid.options.childProp = platformModalGridConfigService.getChildProp();
					grid.options.collapsed = false;
				}

				platformGridAPI.grids.config(grid);
			}

			$scope.showToolbar = !!settings.tools;

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.toggleFilter = function (active) {
				platformGridAPI.filters.showSearch($scope.gridId, active);
			};

			function updateItemList() {
				platformGridAPI.items.data($scope.gridId, platformModalGridConfigService.getDataItems());
			}

			function onEntityCreated(entity) {
				platformGridAPI.rows.add({gridId: $scope.gridId, item: entity});
				platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, entity, true);
			}

			function selectionAfterSort(item) {
				if (platformDataServiceSelectionExtension.isSelection(item) && item.Id !== $scope.selectedEntityID) {
					platformGridAPI.rows.selection({
						gridId: $scope.gridId,
						rows: [item]
					});
				}
			}

			function OnSelectedRowChanged() {
				if (platformModalGridConfigService.supportsRowSelection()) {
					var selectedEntity = platformGridAPI.rows.selection({
						gridId: $scope.gridId,
						wantsArray: false
					});
					platformModalGridConfigService.onSelectedRowChanged(selectedEntity);
				}
			}

			var gridListener = $scope.$watch(function () {
				return $scope.gridCtrl !== undefined;
			}, function () {
				$timeout(function () {
					updateItemList();
					gridListener();
				}, 10);
			});

			platformModalGridConfigService.prepareMoveUpDown(function () {
				platformModalGridConfigService.handleMoveUp(platformGridAPI, $scope.gridId);
			}, function () {
				platformModalGridConfigService.handleMoveDown(platformGridAPI, $scope.gridId);
			});

			if (platformModalGridConfigService.customBtn1Enable) {
				$scope.customBtn1 = {};
				$scope.customBtn1.label = platformModalGridConfigService.customBtn1Label;
				if (platformModalGridConfigService.handleCustomBtn1) {
					$scope.customBtn1.action = function () {
						platformModalGridConfigService.handleCustomBtn1(platformGridAPI, $scope.gridId);
					};
				} else {
					$scope.customBtn1.action = function () {
						$scope.$close({custom1: true, data: platformModalGridConfigService.getDataItems()});

						platformGridAPI.grids.unregister(platformModalGridConfigService.getGridUUID());
					};
				}
			}

			if (platformModalGridConfigService.customBtn2Enable) {
				$scope.customBtn2 = {};
				$scope.customBtn2.label = platformModalGridConfigService.customBtn2Label;
				if (platformModalGridConfigService.handleCustomBtn2) {
					$scope.customBtn2.action = function () {
						platformModalGridConfigService.handleCustomBtn2(platformGridAPI, $scope.gridId);
					};
				} else {
					$scope.customBtn2.action = function () {
						$scope.$close({custom2: true, data: platformModalGridConfigService.getDataItems()});

						platformGridAPI.grids.unregister(platformModalGridConfigService.getGridUUID());
					};
				}
			}

			$scope.disableOK = function disableOK() {
				return platformModalGridConfigService.disableOK();
			};

			// EOF grid configuration
			$scope.onOK = function () {
				$scope.$close({isOK: true, data: platformModalGridConfigService.getDataItems()});
				platformGridAPI.grids.unregister(platformModalGridConfigService.getGridUUID());
			};

			$scope.onCancel = function () {
				$scope.$close({isOK: false});
				platformGridAPI.grids.unregister(platformModalGridConfigService.getGridUUID());
			};

			if (platformModalGridConfigService.getTools()) {
				$scope.tools = platformModalGridConfigService.getTools() || {};
			}

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', OnSelectedRowChanged);

				if (platformModalGridConfigService.getEntityCreatedEvent()) {
					platformModalGridConfigService.getEntityCreatedEvent().unregister(onEntityCreated);
				}

				if (platformModalGridConfigService.getEntityDeletedEvent()) {
					platformModalGridConfigService.getEntityDeletedEvent().unregister(updateItemList);
				}

				if (platformModalGridConfigService.getSelectionAfterSortEvent()) {
					platformModalGridConfigService.getSelectionAfterSortEvent().unregister(selectionAfterSort);
				}
			});

			if (platformModalGridConfigService.getEntityCreatedEvent()) {
				platformModalGridConfigService.getEntityCreatedEvent().register(onEntityCreated);
			}

			if (platformModalGridConfigService.getEntityDeletedEvent()) {
				platformModalGridConfigService.getEntityDeletedEvent().register(updateItemList);
			}

			if (platformModalGridConfigService.getSelectionAfterSortEvent()) {
				platformModalGridConfigService.getSelectionAfterSortEvent().register(selectionAfterSort);
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', OnSelectedRowChanged);

		}
	]);
})(angular);