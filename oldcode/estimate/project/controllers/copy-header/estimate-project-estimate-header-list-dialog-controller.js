/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.project';
	/**
	 * @ngdoc controller
	 * @name estimateProjectEstimateHeaderListDialogController
	 * @function
	 *
	 * @description
	 * Controller for estimate Header Copy during Deep Copy Project
	 **/
	angular.module(moduleName).controller('estimateProjectEstimateHeaderListDialogController',
		['$scope',
			'$timeout',
			'$injector',
			'platformGridAPI',
			'platformCreateUuid',
			'estimateProjectEstimateHeaderListDialogService',
			'estimateProjectEstimateHeaderListConfigDialogService',
			'platformGridControllerService',
			'platformToolbarBtnService',
			'projectMainCopyEntityService',
			'basicsCommonHeaderColumnCheckboxControllerService',

			function (
				$scope,
				$timeout,
				$injector,
				platformGridAPI,
				platformCreateUuid,
				estimateProjectEstimateHeaderListService,
				estimateProjectEstimateHeaderListConfigDialogService,
				platformGridControllerService,
				platformToolbarBtnService,
				projectMainCopyEntityService,
				basicsCommonHeaderColumnCheckboxControllerService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					skipPermissionCheck: true,
					cellChangeCallBack: function (arg) {
						return updateParentScope(arg.item, arg.item.IsChecked);
					}
				};

				$scope.gridId = platformCreateUuid();

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.setTools = function () {
				};

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					let entity = $scope.$eval('entity');
					if(entity){
						estimateProjectEstimateHeaderListService.setProject(entity.Project);
						estimateProjectEstimateHeaderListConfigDialogService.setProject(entity.Project);
					}
					estimateProjectEstimateHeaderListService.setDataList(true);
					projectMainCopyEntityService.CheckDependancies.register(onCosInstanceChanged);
					projectMainCopyEntityService.onOkOrCancelDialog.register(clearDataList);
					platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);

					platformGridControllerService.initListController($scope, estimateProjectEstimateHeaderListConfigDialogService, estimateProjectEstimateHeaderListService, null, myGridConfig);

					basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
					basicsCommonHeaderColumnCheckboxControllerService.init($scope, estimateProjectEstimateHeaderListService, ['IsChecked']);
				}

				$scope.isCheckedValueChange = function isCheckedValueChange() {
					return {apply: true, valid: true, error: ''};
				};

				function updateParentScope(selectItem, newValue, cosInstanceModel) {
					let selectedGridId = $scope.gridId;
					let parentScope = $scope.$parent;
					let rows = parentScope.groups ? parentScope.groups[0].rows : null;
					if (rows) {
						let rowConfig = _.find(rows, {rid: 'copyObject.estimate.project.estimate'});
						if (rowConfig) {
							let allitems = platformGridAPI.items.data(selectedGridId);
							let estHeadersTocopy = _.filter(allitems, {IsChecked: true});
							let estHeaderIds = estHeadersTocopy && estHeadersTocopy.length ? _.map(estHeadersTocopy, 'Id') : [];
							rowConfig.change($scope.$parent.entity, rowConfig.model, newValue, estHeaderIds, cosInstanceModel);
						}
					}
					return {apply: true, valid: true, error: ''};
				}

				function onHeaderCheckboxChange(e) {
					return updateParentScope(null, e.target.checked);
				}

				function onCosInstanceChanged(cosInstanceModel, isCosChecked) {
					let isValid = {apply: true, valid: true, error: ''};
					if (!isCosChecked || cosInstanceModel !== 'Project.copyObject.constructionsystem.project.instanceHeader') {
						return isValid;
					}
					estimateProjectEstimateHeaderListService.setValueToDataList('IsChecked', isCosChecked);
					estimateProjectEstimateHeaderListService.refreshGrid();

					return updateParentScope(null, isCosChecked, cosInstanceModel);
				}

				function clearDataList() {
					estimateProjectEstimateHeaderListService.setDataList(false);
					projectMainCopyEntityService.onOkOrCancelDialog.unregister(clearDataList);
				}

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
					projectMainCopyEntityService.CheckDependancies.unregister(onCosInstanceChanged);
				});

				init();
			}]);
})();
