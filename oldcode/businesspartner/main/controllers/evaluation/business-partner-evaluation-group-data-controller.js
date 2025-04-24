(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';
	// eslint-disable-next-line no-redeclare
	/* global angular,Slick,jQuery  */

	/**
	 * @ngdoc controller
	 * @name businessPartnerEvaluationGroupDataController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of evaluation.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('businessPartnerEvaluationGroupDataController',
		['$scope', '$', '_', '$translate', 'platformGridAPI', 'platformGridControllerService', '$timeout',
			'businessPartnerEvaluationGroupDataUIStandardService', 'commonTooltipService', 'businessPartnerRecalculateService',
			'busiessPartnerMainEvaluationDynamicGridOption', '$rootScope',
			'basicsPermissionServiceFactory',
			'businessPartnerMainEvaluationPermissionDescriptor',
			function ($scope, $, _, $translate, platformGridAPI, platformGridControllerService, $timeout,
				businessPartnerEvaluationGroupDataUIStandardService, commonTooltipService, recalculateService,
				busiessPartnerMainEvaluationDynamicGridOption, $rootScope,
				basicsPermissionServiceFactory,
				businessPartnerMainEvaluationPermissionDescriptor
			) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'PId',
					childProp: 'ChildrenItem',
					enableDraggableGroupBy: false,
					editorLock: new Slick.EditorLock(),
					skipPermissionCheck: true,
					enableConfigSave: true,
					autoHeight: true,
					updateChangeCallBack: function () {
					}
				};

				let groupDataService = tryGetService('groupDataService'),
					groupValidationService = tryGetService('groupValidationService');
				let evalGroupInfo = busiessPartnerMainEvaluationDynamicGridOption.getEvalGroupInfo();

				let businessPartnerMainEvaluationPermissionService = basicsPermissionServiceFactory.getService('businessPartnerMainEvaluationPermissionDescriptor');
				let permission = businessPartnerMainEvaluationPermissionDescriptor.getPermission(evalGroupInfo.permissionName);
				groupDataService.hasWrite = businessPartnerMainEvaluationPermissionService.hasWrite(permission);

				$scope.getContainerUUID = function () {
					return '6784b688752143c189b7406d53cebd41';
				};

				$scope.onContentResized = function () {
				};

				$scope.setTools = function (tools) {
					// tools.items.splice(0, 4);
					// tools.items.splice(5, 1);
					tools.update = function () {
						tools.version += 1;
					};
					tools.refreshVersion = Math.random();
					tools.refresh = function () {
						tools.refreshVersion += 1;
					};
					// remove btn 'grid setting'.
					let gridSetItem = _.find(tools.items, {id: 't200'});
					if (gridSetItem) {
						let showStatusBtnIndex = gridSetItem.list.items.indexOf(_.find(gridSetItem.list.items, {id: 't155'}));
						if (showStatusBtnIndex !== -1) {
							gridSetItem.list.items.splice(showStatusBtnIndex, 1);
						}
					}
					businessPartnerMainEvaluationPermissionService.parseToolPermission(tools);
					$scope.tools = tools;
				};

				// if not unregister the grids, when detail setting, it will some errors
				if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
					platformGridAPI.grids.unregister($scope.getContainerUUID());
				}

				platformGridControllerService.initListController($scope, businessPartnerEvaluationGroupDataUIStandardService, groupDataService, groupValidationService, myGridConfig);
				platformGridAPI.grids.element('id', $scope.gridId).options.editorLock = new Slick.EditorLock();

				commonTooltipService.register($scope.gridId, {
					isShowArrow: false,
					fields: [
						{
							tooltipField: 'GroupDescription',
							textField: function (item) {
								return item.CommentText;
							}
						}
					]
				});

				$scope.tools.items.push({
					id: 't1000',
					sort: 110,
					caption: $translate.instant('procurement.common.total.dirtyRecalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						return !groupDataService.hasWrite;
					},
					fn: function updateCalculation() {
						groupDataService.recalculateAll();
					}
				});
				$scope.tools.items = _.orderBy($scope.tools.items, ['sort']);

				// to make sure the grid config in the dialog can be saved by default.
				if (angular.isUndefined(myGridConfig.enableConfigSave) || myGridConfig.enableConfigSave === true) {
					let grid = platformGridAPI.grids.element('id', $scope.gridId);
					grid.enableConfigSave = true;
				}

				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
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

				function onCellChange( ) {
				}

				platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
				groupDataService.permissionUpdated.register(onPermissionUpdated);
				groupDataService.setGridId($scope.getContainerUUID());
				$scope.$on('$destroy', function () {
					jQuery(window).off('resize', resizeGrid);
					platformGridAPI.grids.unregister($scope.gridId);
					// groupDataService.clearAllData();

					commonTooltipService.unregister($scope.gridId);
					groupDataService.permissionUpdated.unregister(onPermissionUpdated);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);

				});

				// ///////////////////
				function onPermissionUpdated() {
					if (groupDataService.hasWrite !== businessPartnerMainEvaluationPermissionService.hasWrite(permission)) {
						groupDataService.hasWrite = businessPartnerMainEvaluationPermissionService.hasWrite(permission);
						groupDataService.updateListReadonly();
						groupDataService.gridRefresh();
					}
				}
			}
		]);
})(angular);