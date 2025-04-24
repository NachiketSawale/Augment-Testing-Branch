(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';
	// eslint-disable-next-line no-redeclare
	/* global angular,Slick,jQuery */

	/**
	 * @ngdoc controller
	 * @name businessPartnerEvaluationItemDataController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of evaluation.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('businessPartnerEvaluationItemDataController', [
		'$scope',
		'platformGridAPI',
		'platformGridControllerService',
		'$timeout',
		'businessPartnerEvaluationItemDataUIStandardService',
		'basicsPermissionServiceFactory',
		'$rootScope',
		'busiessPartnerMainEvaluationDynamicGridOption',
		'businessPartnerMainEvaluationPermissionDescriptor',
		function ($scope,
			platformGridAPI,
			platformGridControllerService,
			$timeout,
			businessPartnerEvaluationItemDataUIStandardService,
			basicsPermissionServiceFactory,
			$rootScope,
			busiessPartnerMainEvaluationDynamicGridOption,
			businessPartnerMainEvaluationPermissionDescriptor) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				editorLock: new Slick.EditorLock(),
				skipPermissionCheck: true,
				lazyInit: true,
				enableConfigSave: true
			};

			let groupDataService = tryGetService('groupDataService'),
				itemDataService = tryGetService('itemDataService'),
				itemValidationService = tryGetService('itemValidationService');

			let businessPartnerMainEvaluationPermissionService = basicsPermissionServiceFactory.getService('businessPartnerMainEvaluationPermissionDescriptor');
			let evalItemInfo = busiessPartnerMainEvaluationDynamicGridOption.getEvalItemInfo();
			let permission = businessPartnerMainEvaluationPermissionDescriptor.getPermission(evalItemInfo.permissionName);
			let hasWrite = businessPartnerMainEvaluationPermissionService.hasWrite(permission);
			let hasRead = businessPartnerMainEvaluationPermissionService.hasRead(permission);
			evalItemInfo.hasRead = hasRead;

			itemDataService.hasWrite = hasWrite;
			itemDataService.hasRead = hasRead;

			$scope.getContainerUUID = function () {
				return 'b0f91870d5804749be358015d372b8f0';
			};

			$scope.onContentResized = function () {

			};

			$scope.setTools = function () {

			};
			// if not unregister the grids, when detail setting, it will some errors
			if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
				platformGridAPI.grids.unregister($scope.getContainerUUID());
			}
			platformGridControllerService.initListController($scope, businessPartnerEvaluationItemDataUIStandardService, itemDataService, itemValidationService, myGridConfig);

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onGridCellChangedHandler);
			platformGridAPI.grids.element('id', $scope.gridId).options.editorLock = new Slick.EditorLock();

			// noinspection JSUnusedLocalSymbols
			function onGridCellChangedHandler(e, args) { // jshint ignore:line
				let currentParentItem = groupDataService.getSelected();

				if (currentParentItem && !currentParentItem.IsMultiSelect &&
					platformGridAPI.grids.element('id', $scope.gridId).columns.visible[args.cell].id === 'isticked' &&
					args.item.IsTicked) {
					itemDataService.getList().forEach(function (item) {
						if (item.Id !== args.item.Id && item.IsTicked) {
							item.IsTicked = false;
							itemDataService.markItemAsModified(item);
						}
					});
				}

				itemDataService.gridRefresh();

				let totalPoints = 0;

				itemDataService.getList().forEach(function (item) {
					if (item.IsTicked) {
						totalPoints += item.Points;
					}
				});
				if (currentParentItem.Points !== totalPoints) {
					itemDataService.pointsChangedMessage.fire(args.item, {points: totalPoints});
				}
			}

			// to make sure the grid config in the dialog can be saved by default.
			if (angular.isUndefined(myGridConfig.enableConfigSave) || myGridConfig.enableConfigSave === true) {
				let grid = platformGridAPI.grids.element('id', $scope.gridId);
				grid.enableConfigSave = true;
			}

			$timeout(function () {
				platformGridAPI.grids.resize($scope.gridId);
			});

			// Define standard toolbar Icons and their function on the scope
			let toolbarItems = [
				{
					id: 't111',
					sort: 111,
					caption: 'cloud.common.gridlayout',
					iconClass: 'tlb-icons ico-settings',
					type: 'item',
					fn: function () {
						platformGridAPI.configuration.openConfigDialog($scope.gridId);
					}
				}
			];

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
				tools.refreshVersion = Math.random();
				tools.refresh = function () {
					tools.refreshVersion += 1;
				};
				$scope.tools = tools;
			};

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: toolbarItems
			});

			jQuery(window).on('resize', resizeGrid);

			function resizeGrid() {
				platformGridAPI.grids.resize($scope.gridId);
			}

			function tryGetService(targetServiceName) {
				let dataService = null, parentScope = $scope.$parent;
				while (parentScope && dataService === null) {
					if (parentScope[targetServiceName]) {
						dataService = parentScope[targetServiceName];
					}
					parentScope = parentScope.$parent;
				}
				return dataService;
			}

			if (itemDataService.parentService().permissionUpdated) {
				itemDataService.parentService().permissionUpdated.register(onPermissionUpdated);
			}
			$scope.$on('$destroy', function () {
				jQuery(window).off('resize', resizeGrid);
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onGridCellChangedHandler);
				platformGridAPI.grids.unregister($scope.gridId);
				if ((angular.isDefined($scope.isUpdateGrid) && !$scope.isUpdateGrid) || angular.isUndefined($scope.isUpdateGrid)) {
					itemDataService.clearAllData();
				} else {
					itemDataService.deselect();
				}
				if (itemDataService.parentService().permissionUpdated) {
					itemDataService.parentService().permissionUpdated.unregister(onPermissionUpdated);
				}
			});

			// /////////////////////////////
			function onPermissionUpdated() {
				if (hasRead !== businessPartnerMainEvaluationPermissionService.hasRead(permission)) {
					itemDataService.hasWrite = hasWrite = businessPartnerMainEvaluationPermissionService.hasWrite(permission);
					itemDataService.hasRead = hasRead = businessPartnerMainEvaluationPermissionService.hasRead(permission);
					evalItemInfo.hasRead = hasRead;
					if (itemDataService.parentService().permissionUpdated) {
						itemDataService.parentService().permissionUpdated.unregister(onPermissionUpdated);
					}
					$rootScope.$emit('dynamic-grid-permission:changed', {
						evalItem: evalItemInfo
					});
				}
			}
		}
	]);
})(angular);